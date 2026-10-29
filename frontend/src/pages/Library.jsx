import { useEffect, useState, useMemo, useRef } from "react";
import { libraryService } from "../services/libraryService";
import {
  PageTitle,
  Notice,
  Loading,
  Empty,
  Field,
} from "../components/WorkspaceUI";
const config = {
  strategies: {
    title: "Your strategy playbook.",
    description: "Write the rules you want to follow before the next session.",
    singular: "strategy",
    fields: {
      name: "Strategy name",
      description: "Overview",
      chartingProcess: "Charting process",
      entryCriteria: "Entry checklist — one rule per line",
      status: "Status",
    },
  },
  mistakes: {
    title: "Turn mistakes into lessons.",
    description:
      "Recognise repeated behaviours and write a practical response.",
    singular: "mistake",
    fields: {
      title: "Mistake",
      description: "What happens?",
      impact: "Impact on execution",
      solution: "What to do instead",
      howToAvoid: "How to prevent it",
    },
  },
  notes: {
    title: "Keep the useful things.",
    description: "A quiet place for observations, ideas, and lessons.",
    singular: "note",
    fields: {
      title: "Title",
      category: "Category",
      content: "Note",
      tags: "Tags — comma separated",
    },
  },
};
export default function Library({ kind }) {
  const c = config[kind],
    service = useMemo(() => libraryService(kind), [kind]);
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState({}),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    service
      .list()
      .then((r) => {
        if (active) setRows(r);
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
  }, [service]);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await service.create(form);
      setRows(await service.list());
      setEditing(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id) {
    if (
      !window.confirm(
        "Delete this " +
          c.singular +
          "? Strategies linked to trades must be kept.",
      )
    )
      return;
    setBusy(true);
    try {
      await service.remove(id);
      setRows(await service.list());
      setSelected(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const filtered = rows.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="page-stack">
      <PageTitle title={c.title} description={c.description}>
        <button
          className="button primary"
          onClick={() => {
            setForm({ status: "Testing", category: "General" });
            setEditing("new");
          }}
        >
          + Add {c.singular}
        </button>
      </PageTitle>
      {error && <Notice error={error} />}
      <input
        aria-label="Search library"
        placeholder="Search your library…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? (
        <Loading />
      ) : !filtered.length ? (
        <Empty
          title={"Your " + c.singular + " library is ready"}
          text={"Add your first " + c.singular + " or adjust your search."}
        />
      ) : (
        <div className="library-grid">
          {filtered.map((r) => (
            <button
              className="panel library-card"
              key={r._id}
              onClick={() => setSelected(r)}
            >
              <span className="eyebrow">
                {r.status || r.category || c.singular}
              </span>
              <h2>{r.name || r.title}</h2>
              <p className="muted">
                {(r.description || r.content || "").slice(0, 180)}
              </p>
              <span className="text-link">Read more →</span>
            </button>
          ))}
        </div>
      )}
      {(editing || selected) && (
        <LibraryDialog
          label={
            editing ? "Add " + c.singular : selected.name || selected.title
          }
          busy={busy}
          onClose={() => {
            setEditing(null);
            setSelected(null);
          }}
        >
          <div className="section-heading">
            <h2>
              {editing ? "Add " + c.singular : selected.name || selected.title}
            </h2>
            <button
              className="button small"
              disabled={busy}
              onClick={() => {
                setEditing(null);
                setSelected(null);
              }}
            >
              Close
            </button>
          </div>
          {editing ? (
            <form className="form-stack" onSubmit={save}>
              {Object.entries(c.fields).map(([key, label]) => (
                <Field key={key} label={label}>
                  {key === "status" ? (
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      {["Testing", "Active", "Discarded"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  ) : ["name", "title", "category", "tags"].includes(key) ? (
                    <input
                      required={key === "name" || key === "title"}
                      maxLength={200}
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <textarea
                      rows={4}
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  )}
                </Field>
              ))}
              <button className="button primary" disabled={busy}>
                {busy ? "Saving…" : "Save " + c.singular}
              </button>
            </form>
          ) : (
            <>
              <div className="reflection-content">
                {Object.entries(c.fields)
                  .filter(([k]) => !["name", "title"].includes(k))
                  .map(([k, label]) => (
                    <div key={k}>
                      <p className="eyebrow">{label}</p>
                      <p>{selected[k] || "—"}</p>
                    </div>
                  ))}
              </div>
              <button
                className="button danger"
                disabled={busy}
                onClick={() => remove(selected._id)}
              >
                Delete {c.singular}
              </button>
            </>
          )}
        </LibraryDialog>
      )}
    </div>
  );
}
function LibraryDialog({ label, busy, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={label}
      className="panel library-modal"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) {
          const bounds = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < bounds.left ||
            e.clientX > bounds.right ||
            e.clientY < bounds.top ||
            e.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      {children}
    </dialog>
  );
}
