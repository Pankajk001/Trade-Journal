import { useState } from "react";
import { Link } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import { calculateStats, dayKey, money } from "../lib/analytics";
import {
  PageTitle,
  Notice,
  Loading,
  AccountFilter,
  Pnl,
} from "../components/WorkspaceUI";
export default function Calendar() {
  const w = useWorkspace(),
    [month, setMonth] = useState(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ),
    [selected, setSelected] = useState(""),
    [day, setDay] = useState("");
  if (w.loading) return <Loading />;
  if (w.error) return <Notice error={w.error} onRetry={w.reload} />;
  const account = w.accounts.find((a) => a.id === selected) || w.accounts[0],
    stats = calculateStats(
      w.trades.filter((t) => t.accountId === account?.id),
      w.profile.timezone,
    );
  const year = month.getFullYear(),
    m = month.getMonth(),
    count = new Date(year, m + 1, 0).getDate(),
    offset = (month.getDay() + 6) % 7;
  const prefix = year + "-" + String(m + 1).padStart(2, "0");
  const daily = Object.fromEntries(stats.dailyData.map((d) => [d.date, d]));
  const trades = w.trades.filter(
    (t) =>
      t.accountId === account?.id &&
      dayKey(t.closedAt || t.date, w.profile.timezone) === day,
  );
  return (
    <div className="page-stack">
      <PageTitle
        title="Every session tells a story."
        description={"Daily realised results · " + w.profile.timezone}
      >
        <AccountFilter
          accounts={w.accounts}
          value={account?.id || ""}
          onChange={setSelected}
        />
      </PageTitle>
      <section className="panel calendar-panel">
        <div className="section-heading">
          <h2>
            {month.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="actions">
            <button
              className="button small"
              aria-label="Previous month"
              onClick={() => setMonth(new Date(year, m - 1, 1))}
            >
              ←
            </button>
            <button
              className="button small"
              onClick={() =>
                setMonth(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                )
              }
            >
              Today
            </button>
            <button
              className="button small"
              aria-label="Next month"
              onClick={() => setMonth(new Date(year, m + 1, 1))}
            >
              →
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span className="calendar-weekday" key={d}>
              {d}
            </span>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <div className="calendar-spacer" key={"space" + i} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const key = prefix + "-" + String(i + 1).padStart(2, "0"),
              d = daily[key];
            return (
              <button
                key={key}
                aria-label={
                  key +
                  (d
                    ? ", " +
                      money(d.pnl, account?.currency) +
                      ", " +
                      d.trades +
                      " trades"
                    : ", no closed trades")
                }
                aria-pressed={day === key}
                className={
                  "calendar-day " +
                  (d ? (d.pnl > 0 ? "win" : d.pnl < 0 ? "loss" : "flat") : "") +
                  (day === key ? " selected" : "")
                }
                onClick={() => setDay(key)}
              >
                <span>{i + 1}</span>
                {d && (
                  <>
                    <strong>{money(d.pnl, account?.currency)}</strong>
                    <small>{d.trades} trades</small>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>{day || "Select a day"}</h2>
          {day && (
            <Link className="text-link" to={"/dashboard/review?day=" + day}>
              Plan & reflection →
            </Link>
          )}
        </div>
        <p className="muted">
          {!day
            ? "Choose a date to explore its trades."
            : !trades.length
              ? "No trades for this day. A deliberate no-trade day is worth recording."
              : ""}
        </p>
        <div className="activity-list">
          {trades.map((t) => (
            <Link key={t.id} to={"/dashboard/trade/" + t.id}>
              <span>
                <strong>{t.pair}</strong>
                <small className="muted">
                  {t.direction} · {t.tradeStatus}
                </small>
              </span>
              <Pnl value={t.netPnl} currency={account?.currency} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
