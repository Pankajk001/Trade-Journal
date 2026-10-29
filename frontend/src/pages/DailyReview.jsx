import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import { journalService } from "../services/journalService";
import { dayKey } from "../lib/analytics";
import { PageTitle, Notice, Loading, Field } from "../components/WorkspaceUI";
const blank = { plan: "", reflection: "", lesson: "", no_trade_reason: "" };
export default function DailyReview() {
  const w = useWorkspace(),
    [params, setParams] = useSearchParams(),
    [form, setForm] = useState(blank),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(""),
    [dirty, setDirty] = useState(false);

  const day = params.get("day") || dayKey(new Date(), w.profile?.timezone);
  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      setError("Choose a valid review date.");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    setSaved("");
    journalService
      .review(day)
      .then((r) => {
        if (active) {
          setForm(
            r
              ? {
                  plan: r.plan,
                  reflection: r.reflection,
                  lesson: r.lesson,
                  no_trade_reason: r.no_trade_reason,
                }
              : blank,
          );
          setDirty(false);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [day]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await journalService.saveReview({ ...form, day });
      setSaved("Review saved");
      setDirty(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (w.loading) return <Loading />;
  if (w.error) return <Notice error={w.error} onRetry={w.reload} />;
  return (
    <div className="page-stack">
      <PageTitle
        title="Pause. Reflect. Improve."
        description="Start with intention, finish with one useful lesson."
      >
        <label className="field">
          <span>Review date</span>
          <input
            type="date"
            value={day}
            disabled={busy}
            onChange={(e) => {
              if (
                !dirty ||
                window.confirm("Leave this date without saving your review?")
              )
                setParams({ day: e.target.value });
            }}
          />
        </label>
      </PageTitle>
      {error && <Notice error={error} />}{" "}
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={save} className="page-stack">
          <div className="two-columns">
            {[
              [
                "plan",
                "Before the session",
                "What are you watching? Which setups are valid? What will keep you out of the market?",
              ],
              [
                "reflection",
                "After the session",
                "What went well? Where did execution differ from the plan?",
              ],
              [
                "lesson",
                "One adjustment for tomorrow",
                "Choose a specific action you can actually follow.",
              ],
              [
                "no_trade_reason",
                "Stayed out today?",
                "Record why no trade was the right decision.",
              ],
            ].map(([key, title, placeholder]) => (
              <section className="panel" key={key}>
                <Field label={title}>
                  <textarea
                    rows={6}
                    disabled={busy}
                    value={form[key]}
                    placeholder={placeholder}
                    onChange={(e) => {
                      setForm({ ...form, [key]: e.target.value });
                      setDirty(true);
                      setSaved("Unsaved changes");
                    }}
                  />
                </Field>
              </section>
            ))}
          </div>
          <div className="editor-savebar">
            <span role="status" className="muted">
              {saved}
            </span>
            <button className="button primary" disabled={busy}>
              {busy ? "Saving…" : "Save daily review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
