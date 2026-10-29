import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useWorkspace } from "../hooks/useWorkspace";
import { calculateStats, money } from "../lib/analytics";
import {
  PageTitle,
  AddButton,
  Notice,
  Loading,
  Empty,
  Metrics,
  AccountFilter,
  Pnl,
} from "../components/WorkspaceUI";
export function BalanceChart({ stats, currency }) {
  return (
    <div
      className="chart-container"
      role="img"
      aria-label="Cumulative closed-trade net profit and loss over time"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={stats.dailyData}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b7cf8" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#8b7cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            minTickGap={40}
          />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} width={65} />
          <Tooltip
            formatter={(v) => money(v, currency)}
            contentStyle={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
          />
          <Area
            type="linear"
            dataKey="equity"
            name="Cumulative P&L"
            stroke="#9b8cff"
            strokeWidth={2.5}
            fill="url(#balanceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export default function Dashboard() {
  const w = useWorkspace(),
    [selected, setSelected] = useState("");
  if (w.loading) return <Loading />;
  if (w.error) return <Notice error={w.error} onRetry={w.reload} />;
  const account = w.accounts.find((a) => a.id === selected) || w.accounts[0];
  const trades = w.trades.filter((t) => t.accountId === account?.id);
  const stats = calculateStats(trades, w.profile.timezone);
  return (
    <div className="page-stack">
      <PageTitle
        title="A clearer view of your trading."
        description="Your decisions, results, and next steps. All in one place."
      >
        <AddButton />
      </PageTitle>
      {!account ? (
        <Empty
          title="First, create a trading account"
          text="Keep results separated by account and currency."
        >
          <Link className="button primary" to="/dashboard/accounts">
            Create account
          </Link>
        </Empty>
      ) : (
        <>
          <div className="section-heading">
            <div>
              <span className="status-dot" />{" "}
              <span className="muted">Performance overview</span>
            </div>
            <AccountFilter
              accounts={w.accounts}
              value={account.id}
              onChange={setSelected}
            />
          </div>
          <Metrics stats={stats} currency={account.currency} />
          <div className="dashboard-columns">
            <section className="panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">THE BIGGER PICTURE</p>
                  <h2>Cumulative net P&L</h2>
                </div>
                <span className="tag">All time</span>
              </div>
              {stats.totalTrades ? (
                <BalanceChart stats={stats} currency={account.currency} />
              ) : (
                <Empty
                  title="Room for your first result"
                  text="Your performance chart will appear after you close a trade."
                />
              )}
              <p className="caption">
                Closed trades only. Excludes deposits, withdrawals, and
                unrealised P&L.
              </p>
            </section>
            <section className="panel focus-panel">
              <p className="eyebrow">YOUR NEXT STEP</p>
              <h2>Make reflection a habit.</h2>
              <p className="muted">
                Good records help you understand the decisions behind the
                numbers.
              </p>
              <div className="focus-number">
                {trades.filter((t) => !t.reviewed).length}
                <span>trades awaiting review</span>
              </div>
              <Link className="button" to="/dashboard/journal?review=needed">
                Review your trades →
              </Link>
              <Link className="text-link" to="/dashboard/review">
                Write today's reflection
              </Link>
            </section>
          </div>
          <section className="panel">
            <div className="section-heading">
              <h2>Recent activity</h2>
              <Link className="text-link" to="/dashboard/journal">
                Open journal →
              </Link>
            </div>
            {!trades.length ? (
              <Empty>
                <AddButton />
              </Empty>
            ) : (
              <div className="activity-list">
                {trades.slice(0, 5).map((t) => (
                  <Link key={t.id} to={"/dashboard/trade/" + t.id}>
                    <span
                      className={
                        "instrument-avatar " +
                        (t.direction === "Long" ? "positive" : "negative")
                      }
                    >
                      {t.direction === "Long" ? "↗" : "↘"}
                    </span>
                    <span>
                      <strong>{t.pair}</strong>
                      <small className="muted">
                        {new Date(t.date).toLocaleDateString()} · {t.direction}
                      </small>
                    </span>
                    <span className="activity-result">
                      <Pnl value={t.netPnl} currency={account.currency} />
                      <small className="muted">{t.tradeStatus}</small>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
