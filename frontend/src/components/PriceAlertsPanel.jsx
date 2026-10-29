import { useState } from "react";
import { FiBell, FiTrash2 } from "react-icons/fi";
import { usePriceAlerts } from "../context/PriceAlertsContext";
import { alertFeed } from "../lib/priceAlerts";
import { MARKET_SYMBOLS, findMarket } from "../lib/markets";

export default function PriceAlertsPanel({ symbol }) {
  const engine = usePriceAlerts();
  const [selected, setSelected] = useState(
    alertFeed(symbol) ? symbol : "OANDA:XAUUSD",
  );
  const [condition, setCondition] = useState("above");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const feed = alertFeed(selected);
  function submit(event) {
    event.preventDefault();
    try {
      engine.create(selected, condition, Number(target));
      setTarget("");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div
      className="price-alert-panel"
      tabIndex={-1}
      aria-label="Price alert settings"
    >
      <div className="price-alert-intro">
        <FiBell aria-hidden="true" />
        <div>
          <h2>Price alerts</h2>
          <p>
            Keep this app open and connected. Checks run about every 30 seconds;
            brief price moves may be missed.
          </p>
        </div>
      </div>
      <form className="price-alert-form" onSubmit={submit}>
        <label>
          Alert instrument
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {MARKET_SYMBOLS.filter((m) => alertFeed(m.symbol)).map((m) => (
              <option key={m.symbol} value={m.symbol}>
                {m.pair}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">
          {feed.name} · USD. Alert prices may differ from the chart and your
          broker.
        </p>
        <label>
          Trigger when price
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="above">Is at or above</option>
            <option value="below">Is at or below</option>
          </select>
        </label>
        <label>
          Target price (USD)
          <input
            type="number"
            step="any"
            min="0.00000001"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter a price"
          />
        </label>
        <button className="button primary" type="submit">
          <FiBell aria-hidden="true" /> Create alert
        </button>
        <small>
          Each alert fires once, including on its first check if the condition
          is already met.
        </small>
        {error && <p role="alert">{error}</p>}
      </form>
      <div className="price-alert-options">
        <button
          className="button small"
          aria-pressed={engine.sound}
          onClick={engine.toggleSound}
        >
          {engine.sound ? "Sound on" : "Enable sound"}
        </button>
        {engine.permission === "default" && (
          <button className="button small" onClick={engine.enableNotifications}>
            Enable desktop notifications
          </button>
        )}
        <small>
          {engine.permission === "granted"
            ? "Desktop notifications allowed."
            : engine.permission === "denied"
              ? "Notifications blocked. Allow them in browser site settings."
              : engine.permission === "unsupported"
                ? "Desktop notifications unavailable in this browser."
                : "Desktop notifications are optional."}{" "}
          Sound must be enabled each session.
        </small>
        {engine.notificationError && (
          <p role="status">{engine.notificationError}</p>
        )}
      </div>
      <p className="price-alert-scope">
        Forex alerts need a separate live feed and are unavailable here. Alerts
        and history are saved for your account on this device only. Monitoring
        stops when the app closes or your device sleeps.
      </p>
      {engine.storageError && (
        <p role="alert">
          Cannot save alerts on this device. Changes last for this session only.
        </p>
      )}
      <div
        className="market-categories"
        role="group"
        aria-label="Filter alerts"
      >
        {["All", "Active", "Paused", "Triggered"].map((v) => (
          <button
            key={v}
            aria-pressed={filter === v}
            onClick={() => setFilter(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="price-alert-list">
        {engine.alerts
          .filter((a) => filter === "All" || a.status === filter.toLowerCase())
          .map((a) => {
            const quote = engine.quotes[a.symbol];
            return (
              <article className="price-alert-card" key={a.id}>
                <div>
                  <strong>{findMarket(a.symbol).pair}</strong>
                  <span className={"alert-status " + a.status}>{a.status}</span>
                </div>
                <p>
                  {a.condition === "above" ? "At or above" : "At or below"}{" "}
                  {a.target.toLocaleString(undefined, {
                    maximumFractionDigits: 8,
                  })}{" "}
                  USD
                </p>
                <small>{alertFeed(a.symbol).name}</small>
                {a.status === "active" && (
                  <p className="muted" role="status">
                    {quote?.error ||
                      (quote
                        ? `Last check: ${quote.price.toLocaleString(undefined, { maximumFractionDigits: 8 })} USD · ${new Date(quote.checkedAt).toLocaleTimeString()}`
                        : "Connecting to price feed…")}
                  </p>
                )}
                {a.status === "triggered" && (
                  <p>
                    Triggered at {a.triggeredPrice?.toLocaleString()} USD ·{" "}
                    {a.triggeredAt && new Date(a.triggeredAt).toLocaleString()}
                  </p>
                )}
                <div className="price-alert-actions">
                  <button
                    className="button small"
                    onClick={() =>
                      engine.update(
                        a.id,
                        a.status === "active" ? "paused" : "active",
                      )
                    }
                  >
                    {a.status === "active"
                      ? "Pause"
                      : a.status === "triggered"
                        ? "Rearm"
                        : "Resume"}
                  </button>
                  <button
                    className="icon-button"
                    aria-label={
                      "Delete " + findMarket(a.symbol).pair + " alert"
                    }
                    onClick={() => engine.remove(a.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            );
          })}
        {!engine.alerts.some(
          (a) => filter === "All" || a.status === filter.toLowerCase(),
        ) && (
          <p className="market-empty muted">
            No {filter === "All" ? "" : filter.toLowerCase() + " "}alerts yet.
          </p>
        )}
      </div>
    </div>
  );
}
