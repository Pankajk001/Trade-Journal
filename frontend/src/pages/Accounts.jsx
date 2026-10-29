import { useState } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { journalService } from "../services/journalService";
import { PageTitle, Notice, Loading, Field } from "../components/WorkspaceUI";
import { money } from "../lib/analytics";
export default function Accounts() {
  const w = useWorkspace(),
    [form, setForm] = useState({
      name: "",
      currency: "",
      kind: "Demo",
      starting_balance: "0",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await journalService.createAccount({
        ...form,
        currency: form.currency || w.profile.currency,
        name: form.name.trim(),
        starting_balance: Number(form.starting_balance),
      });
      setForm({ ...form, name: "" });
      await w.reload();
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
        title="A place for every account."
        description="Separate live, demo, and prop results without mixing currencies."
      />
      {error && <Notice error={error} />}
      <div className="two-columns">
        <section className="panel">
          <h2>Add an account</h2>
          <form onSubmit={submit} className="form-stack">
            {Object.entries({
              name: "Account name",
              currency: "Currency",
              kind: "Account type",
              starting_balance: "Starting balance",
            }).map(([key, label]) => (
              <Field key={key} label={label}>
                {key === "currency" || key === "kind" ? (
                  <select
                    value={
                      form[key] ||
                      (key === "currency" ? w.profile.currency : "")
                    }
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  >
                    {(key === "currency"
                      ? [
                          "USD",
                          "INR",
                          "EUR",
                          "GBP",
                          "JPY",
                          "AUD",
                          "CAD",
                          "CHF",
                          "SGD",
                          "AED",
                        ]
                      : ["Demo", "Live", "Prop"]
                    ).map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    type={key === "starting_balance" ? "number" : "text"}
                    min="0"
                    step={key === "starting_balance" ? "0.01" : undefined}
                    maxLength={key === "name" ? 80 : undefined}
                    value={
                      form[key] ||
                      (key === "currency" ? w.profile.currency : "")
                    }
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                )}
              </Field>
            ))}
            <button className="button primary" disabled={busy}>
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
        </section>
        <div className="page-stack">
          {w.accounts.map((a) => (
            <section className="panel" key={a.id}>
              <div className="section-heading">
                <h2>{a.name}</h2>
                <span className="tag">{a.kind}</span>
              </div>
              <p className="muted">{a.currency} account</p>
              <strong className="account-balance">
                {money(a.starting_balance, a.currency)}
              </strong>
              <small className="muted">
                Starting balance ·{" "}
                {w.trades.filter((t) => t.accountId === a.id).length} recorded
                trades
              </small>
            </section>
          ))}
          {!w.accounts.length && (
            <p className="muted">
              Create your first account to begin logging trades.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
