import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  ALERT_LIMIT,
  alertFeed,
  freshQuote,
  matchesAlert,
  validAlerts,
} from "../lib/priceAlerts";
import { findMarket } from "../lib/markets";

const Context = createContext(null);
export const usePriceAlerts = () => useContext(Context);

export function PriceAlertsProvider({ userId, children }) {
  const key = "price-alerts:" + userId;
  const [storageError, setStorageError] = useState(false);
  const [alerts, setAlerts] = useState(() => {
    try {
      return validAlerts(JSON.parse(localStorage.getItem(key)));
    } catch {
      return [];
    }
  });
  const current = useRef(alerts);
  const writeFailed = useRef(false);
  const [quotes, setQuotes] = useState({});
  const [notice, setNotice] = useState(null);
  const [sound, setSound] = useState(false);
  const audio = useRef(null);
  const [permission, setPermission] = useState(() =>
    typeof Notification === "undefined"
      ? "unsupported"
      : Notification.permission,
  );
  const [notificationError, setNotificationError] = useState("");
  const save = useCallback(
    (next) => {
      current.current = next;
      setAlerts(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
        writeFailed.current = false;
        setStorageError(false);
      } catch {
        writeFailed.current = true;
        setStorageError(true);
      }
    },
    [key],
  );
  useEffect(() => {
    const changed = (event) => {
      if (event.key !== key) return;
      try {
        const next = validAlerts(JSON.parse(event.newValue));
        current.current = next;
        setAlerts(next);
      } catch {
        /* Ignore malformed storage from another tab. */
      }
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, [key]);
  const symbols = [
    ...new Set(
      alerts.filter((a) => a.status === "active").map((a) => a.symbol),
    ),
  ]
    .sort()
    .join(",");
  const soundRef = useRef(sound);
  soundRef.current = sound;
  useEffect(() => {
    if (!symbols) return;
    let stopped = false;
    const controller = new AbortController();
    async function poll() {
      for (const symbol of symbols.split(",")) {
        if (stopped) return;
        try {
          const response = await fetch(alertFeed(symbol).url, {
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(10000),
            ]),
            cache: "no-store",
          });
          if (!response.ok)
            throw new Error("Price feed unavailable. Retrying automatically.");
          const quote = freshQuote(await response.json(), symbol);
          if (stopped) return;
          setQuotes((old) => ({
            ...old,
            [symbol]: { ...quote, checkedAt: Date.now() },
          }));
          const trigger = () => {
            if (stopped) return;
            // Refresh inside the lock so two tabs cannot fire the same saved alert.
            let latest = current.current;
            try {
              const stored = writeFailed.current
                ? null
                : localStorage.getItem(key);
              if (stored) latest = validAlerts(JSON.parse(stored));
            } catch {
              /* Session fallback. */
            }
            const fired = latest.filter(
              (a) => a.symbol === symbol && matchesAlert(a, quote),
            );
            if (!fired.length) return;
            const now = new Date().toISOString();
            save(
              latest.map((a) =>
                fired.some((f) => f.id === a.id)
                  ? {
                      ...a,
                      status: "triggered",
                      triggeredAt: now,
                      triggeredPrice: quote.price,
                    }
                  : a,
              ),
            );
            const text = `${findMarket(symbol).pair}: ${quote.price.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD · ${fired.length} price alert${fired.length > 1 ? "s" : ""} triggered`;
            setNotice(text);
            if (soundRef.current && audio.current?.state === "running") {
              const oscillator = audio.current.createOscillator(),
                gain = audio.current.createGain();
              oscillator.connect(gain);
              gain.connect(audio.current.destination);
              oscillator.frequency.value = 880;
              gain.gain.setValueAtTime(0.12, audio.current.currentTime);
              gain.gain.exponentialRampToValueAtTime(
                0.001,
                audio.current.currentTime + 0.7,
              );
              oscillator.start();
              oscillator.stop(audio.current.currentTime + 0.7);
            }
            if (
              typeof Notification !== "undefined" &&
              Notification.permission === "granted"
            ) {
              try {
                new Notification("TradeJournal price alert", {
                  body: text,
                  tag: "price-alert-" + fired[0].id,
                });
              } catch {
                setNotificationError(
                  "Desktop notifications are unavailable in this browser. In-app alerts remain enabled.",
                );
              }
            }
          };
          if (navigator.locks) await navigator.locks.request(key, trigger);
          else trigger();
        } catch (error) {
          if (!stopped)
            setQuotes((old) => ({
              ...old,
              [symbol]: { error: error.message, checkedAt: Date.now() },
            }));
        }
      }
    }
    // A recursive timeout prevents overlapping requests on slow connections.
    let timer;
    async function tick() {
      await poll();
      if (!stopped) timer = setTimeout(tick, 30000);
    }
    tick();
    return () => {
      stopped = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [symbols, key, save]);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  async function toggleSound() {
    if (sound) {
      setSound(false);
      return;
    }
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error();
      audio.current ||= new Audio();
      await audio.current.resume();
      setSound(true);
    } catch {
      setNotificationError("Sound is unavailable in this browser.");
    }
  }
  async function enableNotifications() {
    try {
      setPermission(await Notification.requestPermission());
    } catch {
      setNotificationError(
        "Desktop notifications are unavailable in this browser.",
      );
    }
  }
  function create(symbol, condition, target) {
    if (current.current.length >= ALERT_LIMIT)
      throw new Error("Keep up to 20 alerts. Delete an old alert first.");
    if (
      !alertFeed(symbol) ||
      !["above", "below"].includes(condition) ||
      !Number.isFinite(target) ||
      target <= 0
    )
      throw new Error("Choose a supported instrument and a positive price.");
    save([
      ...current.current,
      {
        id: crypto.randomUUID(),
        symbol,
        condition,
        target,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ]);
  }
  return (
    <Context.Provider
      value={{
        alerts,
        quotes,
        storageError,
        sound,
        toggleSound,
        permission,
        enableNotifications,
        notificationError,
        create,
        update: (id, status) =>
          save(
            current.current.map((a) =>
              a.id === id
                ? { ...a, status, triggeredAt: null, triggeredPrice: null }
                : a,
            ),
          ),
        remove: (id) => save(current.current.filter((a) => a.id !== id)),
      }}
    >
      {children}
      {notice && (
        <div className="price-alert-toast" role="alert">
          <strong>Price alert</strong>
          <p>{notice}</p>
          <button className="button small" onClick={() => setNotice(null)}>
            Dismiss alert
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
