import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import tradeService from "../services/tradeService";
import { mediaService } from "../services/mediaService";
import { PageTitle, Notice, Loading, Pnl } from "../components/WorkspaceUI";
function Screenshot({ image, index }) {
  const [url, setUrl] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true,
      objectUrl;
    mediaService
      .read(image)
      .then((value) => {
        objectUrl = value;
        if (active) setUrl(value);
        else URL.revokeObjectURL(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image]);
  return error ? (
    <Notice error={error} />
  ) : url ? (
    <a href={url} target="_blank" rel="noreferrer">
      <img
        className="trade-screenshot"
        src={url}
        alt={"Trade chart screenshot " + (index + 1)}
      />
    </a>
  ) : (
    <Loading />
  );
}
export default function TradeDetails() {
  const { id } = useParams(),
    navigate = useNavigate(),
    w = useWorkspace();
  const [trade, setTrade] = useState(null),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    tradeService
      .getTradeById(id)
      .then((t) => {
        if (active) setTrade(t);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  async function remove() {
    setBusy(true);
    try {
      await tradeService.deleteTrade(id);
      navigate("/dashboard/journal");
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  if (w.error || error)
    return <Notice error={w.error || error} onRetry={w.reload} />;
  if (w.loading || !trade) return <Loading />;
  const account = w.accounts.find((a) => a.id === trade.accountId);
  return (
    <div className="page-stack">
      <PageTitle
        title={trade.pair}
        description={
          trade.direction + " · " + account?.name + " · " + trade.tradeStatus
        }
      >
        <Link className="button" to="/dashboard/journal">
          Back
        </Link>
        <Link
          className="button primary"
          to={"/dashboard/trade/" + id + "/edit"}
        >
          Edit trade
        </Link>
      </PageTitle>
      <div className="metric-grid">
        {[
          [
            "Net result",
            <Pnl key="pnl" value={trade.netPnl} currency={account?.currency} />,
          ],
          [
            "Realised R",
            trade.rMultiple == null ? "—" : trade.rMultiple.toFixed(2) + "R",
          ],
          ["Review", trade.reviewed ? "Complete" : "Needs review"],
          ["Strategy", trade.strategyName || "—"],
        ].map(([label, value]) => (
          <section className="panel metric" key={label}>
            <span className="muted">{label}</span>
            <strong className="compact-metric">{value}</strong>
          </section>
        ))}
      </div>
      <div className="two-columns">
        <section className="panel">
          <h2>Execution</h2>
          <dl className="detail-list">
            {[
              [
                "Entry",
                new Date(trade.date).toLocaleString(undefined, {
                  timeZone: w.profile.timezone,
                }),
              ],
              [
                "Exit",
                trade.closedAt
                  ? new Date(trade.closedAt).toLocaleString(undefined, {
                      timeZone: w.profile.timezone,
                    })
                  : "Still open",
              ],
              ["Timezone", w.profile.timezone],
              ["Session", trade.session],
              ["Market chart source", trade.marketSource],
              ["Entry price", trade.entryPrice],
              ["Exit price", trade.exitPrice],
              ["Size / lots", trade.lotSize],
              ["Initial risk", trade.initialRisk],
              ["Fees (already included in net)", trade.fees],
              ["Swap / funding (already included)", trade.swap],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="muted">{k}</dt>
                <dd>{v == null || v === "" ? "—" : v}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="panel">
          <h2>Reflection</h2>
          <div className="reflection-content">
            {[
              [
                "Plan adherence",
                trade.followedPlan ? "Followed plan" : "Not marked as followed",
              ],
              [
                "Emotions",
                (trade.entryEmotion || "—") +
                  " → " +
                  (trade.exitEmotion || "—"),
              ],
              ["What happened", trade.noteReflection],
              ["Mistakes", trade.mistakesMade],
              ["Lesson", trade.lessonsLearned],
            ].map(([label, text]) => (
              <div key={label}>
                <p className="eyebrow">{label}</p>
                <p>{text || "No notes yet."}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      {!!trade.images?.length && (
        <section className="panel">
          <h2>Trade screenshots</h2>
          <div className="screenshot-grid">
            {trade.images.map((image, index) => (
              <Screenshot key={image} image={image} index={index} />
            ))}
          </div>
        </section>
      )}
      <section className="panel">
        <div className="section-heading">
          <p className="muted">
            Deleted trades remain available in Recently deleted.
          </p>
          {!confirm ? (
            <button className="button danger" onClick={() => setConfirm(true)}>
              Delete trade
            </button>
          ) : (
            <div className="actions">
              <button className="button" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button
                className="button danger"
                disabled={busy}
                onClick={remove}
              >
                {busy ? "Deleting…" : "Confirm deletion"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
