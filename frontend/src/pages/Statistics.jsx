import { useState } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { calculateStats, dayKey, money } from "../lib/analytics";
import {
  PageTitle,
  Notice,
  Loading,
  Empty,
  Metrics,
  AccountFilter,
} from "../components/WorkspaceUI";
import { BalanceChart } from "./Dashboard";
export default function Statistics() {
  const w = useWorkspace(),
    [selected, setSelected] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  if (w.loading) return <Loading />;
  if (w.error) return <Notice error={w.error} onRetry={w.reload} />;
  const a = w.accounts.find((a) => a.id === selected) || w.accounts[0];
  const trades = w.trades.filter((t) => {
    const day = dayKey(t.closedAt || t.date, w.profile.timezone);
    return (
      t.accountId === a?.id && (!from || day >= from) && (!to || day <= to)
    );
  });
  const s = calculateStats(trades, w.profile.timezone);
  return (
    <div className="page-stack">
      <PageTitle
        title="Study your edge."
        description="Consistent calculations across every closed trade in your selected account."
      />
      <div className="filter-bar">
        <AccountFilter
          accounts={w.accounts}
          value={a?.id || ""}
          onChange={setSelected}
        />
        <label>
          From{" "}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label>
          To{" "}
          <input
            type="date"
            min={from}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button
          className="button"
          onClick={() => {
            setFrom("");
            setTo("");
          }}
        >
          All time
        </button>
      </div>
      <Metrics stats={s} currency={a?.currency} />
      {!s.totalTrades ? (
        <Empty
          title="No closed trades in this period"
          text="Change the filters or record a closed trade to explore your performance."
        />
      ) : (
        <>
          <section className="panel">
            <h2>Cumulative net P&L</h2>
            <BalanceChart stats={s} currency={a.currency} />
            <p className="caption">
              Starts at zero for the selected period. This is realised P&L, not
              account equity.
            </p>
          </section>
          <div className="metric-grid">
            {[
              [
                "Profit factor",
                s.profitFactor == null ? "—" : s.profitFactor.toFixed(2),
                "Undefined when there are no losing trades",
              ],
              [
                "Average realised R",
                s.avgR == null ? "—" : s.avgR.toFixed(2) + "R",
                s.rSample + " trades with initial risk recorded",
              ],
              [
                "Average win / loss",
                money(s.avgWin, a.currency) +
                  " / " +
                  money(s.avgLoss, a.currency),
                "Net results",
              ],
              [
                "Longest streaks",
                s.maxWinStreak + " W / " + s.maxLossStreak + " L",
                s.breakevens + " breakevens; break the streak",
              ],
            ].map(([label, value, hint]) => (
              <section className="panel metric" key={label}>
                <span className="muted">{label}</span>
                <strong className="compact-metric">{value}</strong>
                <small className="muted">{hint}</small>
              </section>
            ))}
          </div>
          <div className="two-columns">
            {[
              ["By instrument", s.pairData],
              ["By session", s.sessionData],
              ["By weekday", s.dayData],
              ["By strategy", s.strategyData],
            ].map(([title, rows]) => (
              <section className="panel" key={title}>
                <h2>{title}</h2>
                <div className="breakdown">
                  {rows.map((r) => (
                    <div key={r.name}>
                      <span>
                        {r.name}
                        <small className="muted">{r.trades} trades</small>
                      </span>
                      <strong
                        className={r.profit >= 0 ? "positive" : "negative"}
                      >
                        {money(r.profit, a.currency)}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
      <p className="caption">
        Results are grouped by close date in {w.profile.timezone}. Win rate
        includes breakevens in the denominator. Small samples can be misleading.
      </p>
    </div>
  );
}
