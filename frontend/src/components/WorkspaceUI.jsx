import { Link } from "react-router-dom";
import { FiPlus, FiRefreshCw, FiArrowUpRight } from "react-icons/fi";
import { money } from "../lib/analytics";
export function PageTitle({
  eyebrow = "YOUR TRADING WORKSPACE",
  title,
  description,
  children,
}) {
  return (
    <header className="page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      <div className="actions">{children}</div>
    </header>
  );
}
export function AddButton() {
  return (
    <Link className="button primary" to="/dashboard/add-trade">
      <FiPlus /> Log trade
    </Link>
  );
}
export function Notice({ error, onRetry }) {
  return (
    <div className="notice" role="alert">
      {error}
      {onRetry && (
        <button className="button" onClick={onRetry}>
          <FiRefreshCw /> Retry
        </button>
      )}
    </div>
  );
}
export function Loading() {
  return (
    <div className="loading-state" role="status">
      <span className="loading-dot" /> Loading your workspace…
    </div>
  );
}
export function Empty({
  title = "Your journal starts here",
  text = "Log your first trade to start building a clearer picture of your performance.",
  children,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <FiArrowUpRight />
      </span>
      <h2>{title}</h2>
      <p className="muted">{text}</p>
      {children}
    </div>
  );
}
export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small className="muted">{hint}</small>}
    </label>
  );
}
export function Pnl({ value, currency = "USD" }) {
  return (
    <span className={value > 0 ? "positive" : value < 0 ? "negative" : "muted"}>
      {value == null ? "—" : money(value, currency)}
    </span>
  );
}
export function Metrics({ stats, currency }) {
  return (
    <div className="metric-grid">
      {[
        [
          "Net result",
          money(stats.totalProfit, currency),
          "After recorded trading costs",
        ],
        [
          "Win rate",
          stats.winRate.toFixed(1) + "%",
          stats.totalTrades + " closed trades · including breakevens",
        ],
        [
          "Expectancy",
          money(stats.expectancy, currency),
          "Average net result per closed trade",
        ],
        [
          "Max drawdown",
          money(stats.maxDrawdown, currency),
          "Based on closed trades",
        ],
      ].map(([label, value, hint]) => (
        <div className="panel metric" key={label}>
          <span className="muted">{label}</span>
          <strong>{value}</strong>
          <small className="muted">{hint}</small>
        </div>
      ))}
    </div>
  );
}
export function AccountFilter({ accounts, value, onChange }) {
  return (
    <label className="inline-field">
      <span className="sr-only">Trading account</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} · {a.currency}
          </option>
        ))}
      </select>
    </label>
  );
}
