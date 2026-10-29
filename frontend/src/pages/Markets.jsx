import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiStar,
  FiMaximize,
  FiMinimize,
  FiPlus,
  FiSidebar,
  FiBell,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  MARKET_SYMBOLS,
  MARKET_INTERVALS,
  findMarket,
  marketPreferences,
} from "../lib/markets";
import MarketChart from "../components/MarketChart";
import PriceAlertsPanel from "../components/PriceAlertsPanel";
import { usePriceAlerts } from "../context/PriceAlertsContext";

export default function Markets() {
  const { alerts } = usePriceAlerts();
  const [panel, setPanel] = useState("symbols");
  const { user } = useContext(AuthContext),
    { resolvedTheme } = useTheme();
  const key = "market-preferences:" + user.id;
  const [preferences, setPreferences] = useState(() => {
    try {
      return marketPreferences(JSON.parse(localStorage.getItem(key)));
    } catch {
      return marketPreferences();
    }
  });
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [storageError, setStorageError] = useState(false),
    [expanded, setExpanded] = useState(false),
    [watchlistOpen, setWatchlistOpen] = useState(true);
  const expandButton = useRef(null);
  const market = findMarket(preferences.symbol);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(preferences));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [key, preferences]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keyboard = (event) => {
      if (event.key === "Escape") {
        setExpanded(false);
        expandButton.current?.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard);
    };
  }, [expanded]);
  function choose(symbol) {
    setPreferences((value) => ({ ...value, symbol }));
  }
  function openAlerts() {
    setWatchlistOpen(true);
    setPanel("alerts");
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        const panelElement = document.querySelector(".price-alert-panel");
        panelElement?.scrollIntoView({ block: "start" });
        panelElement?.focus({ preventScroll: true });
      }
    });
  }
  function toggleWatch(symbol) {
    setPreferences((value) => ({
      ...value,
      watchlist: value.watchlist.includes(symbol)
        ? value.watchlist.filter((item) => item !== symbol)
        : [...value.watchlist, symbol],
    }));
  }
  const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  const symbols = MARKET_SYMBOLS.filter(
    (item) =>
      (category === "All" ||
        (category === "Watchlist"
          ? preferences.watchlist.includes(item.symbol)
          : item.category === category)) &&
      ((item.pair + " " + item.name + " " + item.source)
        .toLowerCase()
        .includes(query.toLowerCase().trim()) ||
        (normalized && item.pair.toLowerCase().includes(normalized))),
  );
  const watched = preferences.watchlist.includes(market.symbol);
  return (
    <div
      className={
        "markets-page market-terminal" +
        (expanded ? " expanded" : "") +
        (watchlistOpen ? "" : " watchlist-hidden")
      }
    >
      <header className="terminal-toolbar">
        <h1>Markets</h1>
        <label className="terminal-symbol-select">
          <span className="sr-only">Instrument</span>
          <select
            aria-label="Chart symbol"
            value={market.symbol}
            onChange={(event) => choose(event.target.value)}
          >
            {["Forex", "Metals", "Crypto"].map((group) => (
              <optgroup key={group} label={group}>
                {MARKET_SYMBOLS.filter((item) => item.category === group).map(
                  (item) => (
                    <option key={item.symbol} value={item.symbol}>
                      {item.pair} · {item.source}
                    </option>
                  ),
                )}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="terminal-timeframe-select">
          <span className="sr-only">Timeframe</span>
          <select
            aria-label="Chart timeframe"
            value={preferences.interval}
            onChange={(event) =>
              setPreferences((value) => ({
                ...value,
                interval: event.target.value,
              }))
            }
          >
            {MARKET_INTERVALS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="terminal-selected-feed">
          <span>{market.category}</span>
          <small>{market.source}</small>
        </div>
        <div className="terminal-tools">
          <button
            className="icon-button market-alert-button"
            title="Price alerts"
            aria-label="Open price alerts"
            aria-pressed={watchlistOpen && panel === "alerts"}
            onClick={openAlerts}
          >
            <FiBell aria-hidden="true" />
            {alerts.some((a) => a.status === "active") && (
              <span className="market-alert-count" aria-hidden="true">
                {alerts.filter((a) => a.status === "active").length}
              </span>
            )}
          </button>
          <button
            className={"icon-button market-star " + (watched ? "saved" : "")}
            title={watched ? "Remove from watchlist" : "Save to watchlist"}
            aria-label={
              watched
                ? "Remove selected symbol from watchlist"
                : "Save selected symbol to watchlist"
            }
            aria-pressed={watched}
            onClick={() => toggleWatch(market.symbol)}
          >
            <FiStar aria-hidden="true" />
          </button>
          <button
            ref={expandButton}
            className="icon-button"
            title={expanded ? "Exit expanded chart" : "Expand chart"}
            aria-label={expanded ? "Exit expanded chart" : "Expand chart"}
            aria-pressed={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <FiMinimize aria-hidden="true" />
            ) : (
              <FiMaximize aria-hidden="true" />
            )}
          </button>
          <button
            className="icon-button"
            title={watchlistOpen ? "Hide watchlist" : "Show watchlist"}
            aria-label={watchlistOpen ? "Hide watchlist" : "Show watchlist"}
            aria-expanded={watchlistOpen}
            aria-controls="market-watchlist"
            onClick={() => setWatchlistOpen(!watchlistOpen)}
          >
            <FiSidebar aria-hidden="true" />
          </button>
          <Link
            className="button primary"
            to={
              "/dashboard/add-trade?symbol=" + encodeURIComponent(market.symbol)
            }
          >
            <FiPlus aria-hidden="true" /> Log {market.pair} trade
          </Link>
        </div>
      </header>
      <div className="terminal-workspace">
        <section
          className="market-chart-panel"
          aria-label="Selected market chart"
        >
          <MarketChart
            symbol={market.symbol}
            interval={preferences.interval}
            theme={resolvedTheme}
          />
          <div className="terminal-statusbar">
            <span>{market.name}</span>
            <span>{market.source} feed · UTC</span>
          </div>
        </section>
        {watchlistOpen && (
          <aside
            className="market-browser"
            id="market-watchlist"
            aria-label="Market symbols"
          >
            <div
              className="market-panel-tabs"
              role="group"
              aria-label="Market panel"
            >
              <button
                aria-pressed={panel === "symbols"}
                onClick={() => setPanel("symbols")}
              >
                Symbols
              </button>
              <button
                aria-pressed={panel === "alerts"}
                onClick={() => setPanel("alerts")}
              >
                <FiBell aria-hidden="true" /> Alerts
              </button>
            </div>
            {panel === "alerts" ? (
              <PriceAlertsPanel symbol={market.symbol} />
            ) : (
              <>
                <div className="terminal-watchlist-heading">
                  <h2>Watchlist & symbols</h2>
                  <span>{preferences.watchlist.length} saved</span>
                </div>
                <label className="market-search">
                  <FiSearch aria-hidden="true" />
                  <input
                    type="search"
                    aria-label="Search market symbols"
                    placeholder="Search symbol or name"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <div
                  className="market-categories"
                  role="group"
                  aria-label="Market category"
                >
                  {["All", "Forex", "Metals", "Crypto", "Watchlist"].map(
                    (value) => (
                      <button
                        key={value}
                        aria-pressed={category === value}
                        onClick={() => setCategory(value)}
                      >
                        {value === "Watchlist" ? (
                          <>
                            <FiStar aria-hidden="true" /> Saved
                          </>
                        ) : (
                          value
                        )}
                      </button>
                    ),
                  )}
                </div>
                <div className="terminal-list-labels" aria-hidden="true">
                  <span>Symbol / provider</span>
                  <span>Save</span>
                </div>
                <div className="market-symbol-list">
                  {symbols.map((item) => (
                    <div
                      className={
                        "market-symbol-row " +
                        (item.symbol === market.symbol ? "selected" : "")
                      }
                      key={item.symbol}
                    >
                      <button
                        className="market-symbol-choice"
                        aria-pressed={item.symbol === market.symbol}
                        onClick={() => choose(item.symbol)}
                      >
                        <span
                          className={
                            "market-symbol-icon " + item.category.toLowerCase()
                          }
                        >
                          {item.pair.slice(0, 2)}
                        </span>
                        <span>
                          <strong>{item.pair}</strong>
                          <small>{item.name}</small>
                          <small className="market-source">{item.source}</small>
                        </span>
                      </button>
                      <button
                        className={
                          "market-star " +
                          (preferences.watchlist.includes(item.symbol)
                            ? "saved"
                            : "")
                        }
                        aria-label={
                          (preferences.watchlist.includes(item.symbol)
                            ? "Remove "
                            : "Save ") +
                          item.pair +
                          (preferences.watchlist.includes(item.symbol)
                            ? " from watchlist"
                            : " to watchlist")
                        }
                        aria-pressed={preferences.watchlist.includes(
                          item.symbol,
                        )}
                        onClick={() => toggleWatch(item.symbol)}
                      >
                        <FiStar aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {!symbols.length && (
                    <p className="market-empty muted">
                      {category === "Watchlist" && !query
                        ? "Save symbols with the star to build your personal watchlist."
                        : "No matching symbols. Try a different name or category."}
                    </p>
                  )}
                </div>
                <div className="terminal-watchlist-footer">
                  <p role={storageError ? "alert" : undefined}>
                    {storageError
                      ? "Preferences are available for this session only."
                      : "Your watchlist is saved on this device."}
                  </p>
                  <p>
                    Provider prices may differ from your broker. Check the
                    chart’s data status.
                  </p>
                </div>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
