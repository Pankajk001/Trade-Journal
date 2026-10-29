import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useWorkspace } from "../hooks/useWorkspace";
import tradeService from "../services/tradeService";
import strategyService from "../services/strategyService";
import { mediaService } from "../services/mediaService";
import {
  PageTitle,
  Notice,
  Loading,
  Field,
  Empty,
} from "../components/WorkspaceUI";
const localTime = (value) => {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
const initial = () => ({
  accountId: "",
  strategyId: "",
  pair: "",
  direction: "Long",
  tradeStatus: "Closed",
  date: localTime(Date.now()),
  closedAt: localTime(Date.now()),
  netPnl: "",
  initialRisk: "",
  reviewed: false,
  details: {
    session: "London",
    entryPrice: "",
    exitPrice: "",
    lotSize: "",
    fees: "",
    swap: "",
    followedPlan: false,
    noteReflection: "",
    entryEmotion: "Calm",
    exitEmotion: "Calm",
    mistakesMade: "",
    lessonsLearned: "",
    images: [],
  },
});
export default function AddTrade() {
  const { id } = useParams(),
    { user } = useContext(AuthContext),
    w = useWorkspace(),
    navigate = useNavigate();
  const key = "trade-draft:" + user.id + ":" + (id || "new");
  const [form, setForm] = useState(initial),
    [strategies, setStrategies] = useState([]),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(""),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [files, setFiles] = useState([]);
  const restored = useRef(false),
    submitting = useRef(false);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const options = await strategyService.getStrategies();
        let value = id ? await tradeService.getTradeById(id) : initial();
        if (id) {
          const {
            accountId,
            strategyId,
            pair,
            direction,
            tradeStatus,
            date,
            closedAt,
            netPnl,
            initialRisk,
            reviewed,
            ...details
          } = value;
          value = {
            accountId,
            strategyId,
            pair,
            direction,
            tradeStatus,
            date: localTime(date),
            closedAt: closedAt ? localTime(closedAt) : localTime(Date.now()),
            netPnl,
            initialRisk,
            reviewed,
            details: { ...initial().details, ...details },
          };
        }
        const draft = localStorage.getItem(key);
        if (draft) {
          value = JSON.parse(draft);
          restored.current = true;
        }
        if (active) {
          setStrategies(options);
          setForm(value);
          setSaved(draft ? "Draft restored" : "");
          setReady(true);
        }
      } catch (e) {
        if (active) setError(e.message);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id, key]);
  useEffect(() => {
    if (!ready || busy || submitting.current) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(form));
        setSaved("Draft saved on this device");
      } catch {
        setSaved("Draft could not be saved on this device");
      }
    }, 650);
    return () => clearTimeout(timer);
  }, [form, ready, key, busy]);
  useEffect(() => {
    if (!ready) return;
    const warn = (e) => {
      if (!submitting.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [ready]);
  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setSaved("Saving draft…");
  };
  const detail = (name, value) =>
    setForm((f) => ({ ...f, details: { ...f.details, [name]: value } }));
  async function submit(e) {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    const uploaded = [];
    try {
      if (!form.accountId) throw new Error("Choose a trading account.");
      if (
        form.tradeStatus === "Closed" &&
        new Date(form.closedAt) < new Date(form.date)
      )
        throw new Error("Exit time must be after entry time.");
      for (const file of files) {
        const result = await mediaService.upload(file);
        uploaded.push(result.key);
      }
      const strategy = strategies.find((s) => s._id === form.strategyId);
      await tradeService.save(
        {
          ...form,
          details: {
            ...form.details,
            strategyName: strategy?.name || "",
            images: [...(form.details.images || []), ...uploaded],
          },
        },
        id,
      );
      localStorage.removeItem(key);
      navigate("/dashboard/journal");
    } catch (e) {
      await Promise.allSettled(uploaded.map((key) => mediaService.remove(key)));
      setError(e.message);
      submitting.current = false;
      setBusy(false);
    }
  }
  function discard() {
    localStorage.removeItem(key);
    setForm(initial());
    setFiles([]);
    setSaved("Draft cleared");
  }
  if (w.loading) return <Loading />;
  if (w.error) return <Notice error={w.error} onRetry={w.reload} />;
  if (!w.accounts.length)
    return (
      <Empty
        title="Create an account first"
        text="Every trade belongs to an account and uses its currency."
      >
        <Link className="button primary" to="/dashboard/accounts">
          Create account
        </Link>
      </Empty>
    );
  return (
    <div className="page-stack">
      <PageTitle
        title={id ? "Refine the record." : "Record the trade."}
        description="Capture the essentials now. Add your reflection when you have time."
      >
        <Link className="button" to="/dashboard/journal">
          Back to journal
        </Link>
      </PageTitle>
      {error && <Notice error={error} />}
      {!ready ? (
        <Loading />
      ) : (
        <form onSubmit={submit} className="page-stack">
          <fieldset disabled={busy} className="form-fieldset">
            <div className="editor-columns">
              <div className="page-stack">
                <section className="panel">
                  <div className="section-heading">
                    <h2>The essentials</h2>
                    <span className="tag">Private</span>
                  </div>
                  <div className="form-grid">
                    <Field label="Trading account">
                      <select
                        required
                        value={form.accountId}
                        onChange={(e) => set("accountId", e.target.value)}
                      >
                        <option value="">Select an account</option>
                        {w.accounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} · {a.currency}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Instrument">
                      <input
                        required
                        maxLength={30}
                        placeholder="e.g. EURUSD, NIFTY, BTCUSD"
                        value={form.pair}
                        onChange={(e) =>
                          set("pair", e.target.value.toUpperCase())
                        }
                      />
                    </Field>
                    <Field label="Direction">
                      <select
                        value={form.direction}
                        onChange={(e) => set("direction", e.target.value)}
                      >
                        <option>Long</option>
                        <option>Short</option>
                      </select>
                    </Field>
                    <Field label="Trade status">
                      <select
                        value={form.tradeStatus}
                        onChange={(e) => set("tradeStatus", e.target.value)}
                      >
                        <option>Closed</option>
                        <option>Open</option>
                      </select>
                    </Field>
                    <Field
                      label="Entry date and time"
                      hint={
                        "Device timezone: " +
                        Intl.DateTimeFormat().resolvedOptions().timeZone
                      }
                    >
                      <input
                        type="datetime-local"
                        required
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                      />
                    </Field>
                    {form.tradeStatus === "Closed" && (
                      <Field label="Exit date and time">
                        <input
                          type="datetime-local"
                          required
                          min={form.date}
                          value={form.closedAt}
                          onChange={(e) => set("closedAt", e.target.value)}
                        />
                      </Field>
                    )}
                    {form.tradeStatus === "Closed" && (
                      <Field
                        label="Broker-reported net P&L"
                        hint="Final result after all fees, commission and funding. Do not subtract costs again."
                      >
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="-25.00 or 120.50"
                          value={form.netPnl ?? ""}
                          onChange={(e) => set("netPnl", e.target.value)}
                        />
                      </Field>
                    )}
                    <Field
                      label="Initial risk amount"
                      hint="Account currency. Used to calculate realised R; preserve your original risk."
                    >
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.initialRisk ?? ""}
                        onChange={(e) => set("initialRisk", e.target.value)}
                      />
                    </Field>
                  </div>
                </section>
                <details className="panel" open={Boolean(id)}>
                  <summary>
                    Execution & setup{" "}
                    <span className="muted">Optional details</span>
                  </summary>
                  <div className="form-grid">
                    <Field label="Strategy">
                      <select
                        value={form.strategyId || ""}
                        onChange={(e) => set("strategyId", e.target.value)}
                      >
                        <option value="">No strategy</option>
                        {strategies.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Session">
                      <select
                        value={form.details.session}
                        onChange={(e) => detail("session", e.target.value)}
                      >
                        {["London", "New York", "Asia", "Sydney", "Other"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                    </Field>
                    {["entryPrice", "exitPrice", "lotSize", "fees", "swap"].map(
                      (k) => (
                        <Field
                          key={k}
                          label={
                            {
                              entryPrice: "Entry price",
                              exitPrice: "Exit price",
                              lotSize: "Position size / lots",
                              fees: "Fees (reference only)",
                              swap: "Swap / funding (reference only)",
                            }[k]
                          }
                        >
                          <input
                            type="number"
                            step="any"
                            value={form.details[k] ?? ""}
                            onChange={(e) => detail(k, e.target.value)}
                          />
                        </Field>
                      ),
                    )}
                  </div>
                </details>
                <section className="panel">
                  <h2>Chart screenshots</h2>
                  <p className="muted">
                    Up to 3 PNG, JPEG or WebP images, 5 MB each. Files upload
                    when you save; reselect files after restoring a draft.
                  </p>
                  {(form.details.images || []).map((image, i) => (
                    <div className="attachment-row" key={image}>
                      <span>Screenshot {i + 1}</span>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() =>
                          detail(
                            "images",
                            form.details.images.filter((k) => k !== image),
                          )
                        }
                      >
                        Remove from trade
                      </button>
                    </div>
                  ))}
                  <Field label="Choose screenshots">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={(e) => {
                        const picked = Array.from(e.target.files);
                        if (
                          picked.length + (form.details.images?.length || 0) >
                          3
                        ) {
                          setError("A trade can have up to three screenshots.");
                          e.target.value = "";
                          return;
                        }
                        if (
                          picked.some(
                            (f) =>
                              f.size > 5 * 1024 * 1024 ||
                              ![
                                "image/png",
                                "image/jpeg",
                                "image/webp",
                              ].includes(f.type),
                          )
                        ) {
                          setError("Use PNG, JPEG or WebP files under 5 MB.");
                          e.target.value = "";
                          return;
                        }
                        setError("");
                        setFiles(picked);
                      }}
                    />
                  </Field>
                  {files.map((f, i) => (
                    <p className="caption" key={i}>
                      {f.name}
                    </p>
                  ))}
                </section>
              </div>
              <aside className="page-stack">
                <section className="panel">
                  <p className="eyebrow">BEYOND THE NUMBERS</p>
                  <h2>A moment to reflect.</h2>
                  <div className="form-stack">
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={Boolean(form.details.followedPlan)}
                        onChange={(e) =>
                          detail("followedPlan", e.target.checked)
                        }
                      />{" "}
                      I followed my trading plan
                    </label>
                    {["entryEmotion", "exitEmotion"].map((k) => (
                      <Field
                        key={k}
                        label={
                          k === "entryEmotion" ? "Before entry" : "After exit"
                        }
                      >
                        <select
                          value={form.details[k]}
                          onChange={(e) => detail(k, e.target.value)}
                        >
                          {[
                            "Calm",
                            "Confident",
                            "Patient",
                            "Anxious",
                            "FOMO",
                            "Greedy",
                            "Frustrated",
                            "Overconfident",
                          ].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                    ))}
                    <Field label="What happened?">
                      <textarea
                        rows={4}
                        value={form.details.noteReflection || ""}
                        onChange={(e) =>
                          detail("noteReflection", e.target.value)
                        }
                        placeholder="The decision, execution, and what you noticed."
                      />
                    </Field>
                    <Field label="Mistakes to revisit">
                      <textarea
                        rows={2}
                        value={form.details.mistakesMade || ""}
                        onChange={(e) => detail("mistakesMade", e.target.value)}
                      />
                    </Field>
                    <Field label="One lesson">
                      <textarea
                        rows={2}
                        value={form.details.lessonsLearned || ""}
                        onChange={(e) =>
                          detail("lessonsLearned", e.target.value)
                        }
                      />
                    </Field>
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={form.reviewed}
                        onChange={(e) => set("reviewed", e.target.checked)}
                      />{" "}
                      Mark as reviewed
                    </label>
                  </div>
                </section>
              </aside>
            </div>
            <div className="editor-savebar">
              <span role="status" className="muted">
                {saved}
              </span>
              <div className="actions">
                {!id && (
                  <button type="button" className="button" onClick={discard}>
                    Clear draft
                  </button>
                )}
                <button className="button primary" disabled={busy}>
                  {busy ? "Saving trade…" : id ? "Save changes" : "Save trade"}
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
}
