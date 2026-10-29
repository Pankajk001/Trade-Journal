import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import tradeService from "../services/tradeService";
import { dayKey } from "../lib/analytics";
import {
  PageTitle,
  AddButton,
  Notice,
  Loading,
  Empty,
  Pnl,
} from "../components/WorkspaceUI";
export default function Journal() {
  const w = useWorkspace(),
    [params] = useSearchParams();
  const [search, setSearch] = useState(""),
    [account, setAccount] = useState(""),
    [status, setStatus] = useState(""),
    [review, setReview] = useState(params.get("review") || ""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [page, setPage] = useState(1);
  const [trash, setTrash] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const change = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };
  async function toggleTrash() {
    try {
      setBusy(true);
      setTrash(trash ? null : await tradeService.all({ deleted: true }));
      setPage(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function restore(id) {
    try {
      await tradeService.restore(id);
      setTrash(await tradeService.all({ deleted: true }));
      await w.reload();
    } catch (e) {
      setError(e.message);
    }
  }
  if (w.loading) return <Loading />;
  if (w.error) return <Notice error={w.error} onRetry={w.reload} />;
  const rows = (trash || w.trades).filter((t) => {
    const day = dayKey(t.date, w.profile.timezone);
    return (
      (!search ||
        (t.pair + " " + (t.strategyName || "") + " " + (t.tags || ""))
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!account || t.accountId === account) &&
      (!status || t.tradeStatus === status || t.winLoss === status) &&
      (!review || !t.reviewed) &&
      (!from || day >= from) &&
      (!to || day <= to)
    );
  });
  const pages = Math.max(1, Math.ceil(rows.length / 20)),
    current = Math.min(page, pages),
    visible = rows.slice((current - 1) * 20, current * 20);
  return (
    <div className="page-stack">
      <PageTitle
        title={trash ? "Recently deleted." : "Your trading journal."}
        description={
          rows.length + " trades · searchable, filterable, and always private."
        }
      >
        <button className="button" disabled={busy} onClick={toggleTrash}>
          {trash ? "Back to journal" : "Recently deleted"}
        </button>
        <AddButton />
      </PageTitle>
      {error && <Notice error={error} />}
      <div className="filter-bar">
        <input
          aria-label="Search trades"
          placeholder="Search instrument or strategy…"
          value={search}
          onChange={change(setSearch)}
        />
        <select
          aria-label="Account"
          value={account}
          onChange={change(setAccount)}
        >
          <option value="">All accounts</option>
          {w.accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Trade result"
          value={status}
          onChange={change(setStatus)}
        >
          {["", "Open", "Closed", "Win", "Loss", "Breakeven"].map((s) => (
            <option key={s} value={s}>
              {s || "All results"}
            </option>
          ))}
        </select>
        <select
          aria-label="Review status"
          value={review}
          onChange={change(setReview)}
        >
          <option value="">All reviews</option>
          <option value="needed">Needs review</option>
        </select>
        <label>
          From <input type="date" value={from} onChange={change(setFrom)} />
        </label>
        <label>
          To{" "}
          <input type="date" min={from} value={to} onChange={change(setTo)} />
        </label>
      </div>
      {!rows.length ? (
        <Empty
          title={trash ? "Nothing in recently deleted" : "No trades found"}
          text="Try different filters, or log a new trade."
        >
          {!trash && <AddButton />}
        </Empty>
      ) : (
        <>
          <section className="panel trade-table-wrap">
            <table className="trade-table">
              <thead>
                <tr>
                  {[
                    "Instrument",
                    "Date",
                    "Account",
                    "Setup",
                    "Net result",
                    "Realised R",
                    "Review",
                    "",
                  ].map((s, i) => (
                    <th key={i}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => {
                  const a = w.accounts.find((a) => a.id === t.accountId);
                  return (
                    <tr key={t.id}>
                      <td data-label="Instrument">
                        <strong>{t.pair}</strong>
                        <small className="muted">
                          {t.direction} · {t.tradeStatus}
                        </small>
                      </td>
                      <td data-label="Date">
                        {dayKey(t.date, w.profile.timezone)}
                      </td>
                      <td data-label="Account">{a?.name}</td>
                      <td data-label="Setup">{t.strategyName || "—"}</td>
                      <td data-label="Net result">
                        <Pnl value={t.netPnl} currency={a?.currency} />
                      </td>
                      <td data-label="Realised R">
                        {t.rMultiple == null
                          ? "—"
                          : t.rMultiple.toFixed(2) + "R"}
                      </td>
                      <td data-label="Review">
                        <span className={"tag " + (t.reviewed ? "" : "amber")}>
                          {t.reviewed ? "Reviewed" : "Needs review"}
                        </span>
                      </td>
                      <td>
                        {trash ? (
                          <button
                            className="text-link"
                            onClick={() => restore(t.id)}
                          >
                            Restore
                          </button>
                        ) : (
                          <Link
                            className="text-link"
                            to={"/dashboard/trade/" + t.id}
                          >
                            View →
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          <div className="pagination">
            <span className="muted">
              {rows.length} trades · Page {current} of {pages}
            </span>
            <div className="actions">
              <button
                className="button"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </button>
              <button
                className="button"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      <p className="caption">
        Each result uses its account currency. Values from different currencies
        are never added together.
      </p>
    </div>
  );
}
