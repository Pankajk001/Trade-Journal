import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { journalService } from "../services/journalService";
import authService from "../services/authService";
import { PageTitle, Notice, Loading, Field } from "../components/WorkspaceUI";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useContext(AuthContext),
    [profile, setProfile] = useState(null),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  useEffect(() => {
    journalService
      .profile()
      .then(setProfile)
      .catch((e) => setError(e.message));
  }, []);
  async function task(work) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await work();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function preferences(e) {
    e.preventDefault();
    await task(async () => {
      new Intl.DateTimeFormat("en", { timeZone: profile.timezone }).format();
      await journalService.saveProfile(profile);
      setUser(await authService.updateProfile({ name: profile.name }));
      setMessage("Preferences saved.");
    });
  }
  async function updatePassword(e) {
    e.preventDefault();
    await task(async () => {
      if (password !== confirm) throw new Error("Passwords do not match.");
      await authService.updateProfile({ password });
      setPassword("");
      setConfirm("");
      setMessage("Password updated.");
    });
  }
  async function download() {
    await task(async () => {
      const data = await journalService.exportData();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download =
        "trade-journal-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(
        "Export downloaded. Back up screenshot files separately from Supabase Storage.",
      );
    });
  }
  return (
    <div className="page-stack">
      <PageTitle
        title="Make it yours."
        description="Preferences, account security, and a copy of your data."
      />
      <section
        className="panel appearance-panel"
        aria-labelledby="appearance-heading"
      >
        <div>
          <h2 id="appearance-heading">Appearance</h2>
          <p className="muted">
            Choose your workspace theme. System follows your device, including
            automatic changes.
          </p>
        </div>
        <fieldset className="appearance-options">
          <legend className="sr-only">Workspace theme</legend>
          {[
            ["light", "Light", FiSun],
            ["dark", "Dark", FiMoon],
            ["system", "System", FiMonitor],
          ].map(([value, label, Icon]) => (
            <label
              className={
                "appearance-option " + (theme === value ? "selected" : "")
              }
              key={value}
            >
              <input
                type="radio"
                name="appearance"
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
              />
              <span className={"theme-preview " + value} aria-hidden="true">
                <span />
                <span>
                  <i />
                  <i />
                  <i />
                </span>
              </span>
              <span className="appearance-option-label">
                <Icon aria-hidden="true" />
                {label}
              </span>
            </label>
          ))}
        </fieldset>
        <small className="muted">
          Applied immediately and remembered on this device.
        </small>
      </section>
      {error && <Notice error={error} />}{" "}
      {message && (
        <p className="success" role="status">
          {message}
        </p>
      )}
      {!profile ? (
        !error && <Loading />
      ) : (
        <div className="two-columns">
          <section className="panel">
            <h2>Profile & preferences</h2>
            <form onSubmit={preferences} className="form-stack">
              <Field label="Name">
                <input
                  required
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </Field>
              <Field label="Email">
                <input readOnly value={user.email} />
              </Field>
              <Field
                label="Default currency"
                hint="Each trading account keeps its own currency."
              >
                <select
                  value={profile.currency}
                  onChange={(e) =>
                    setProfile({ ...profile, currency: e.target.value })
                  }
                >
                  {[
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
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field
                label="Journal timezone"
                hint="Used for daily results, the calendar, and reviews. Trade entry uses your device timezone."
              >
                <select
                  value={profile.timezone}
                  onChange={(e) =>
                    setProfile({ ...profile, timezone: e.target.value })
                  }
                >
                  {Array.from(
                    new Set([
                      profile.timezone,
                      "Asia/Kolkata",
                      "UTC",
                      "America/New_York",
                      "Europe/London",
                      "Asia/Dubai",
                      "Asia/Singapore",
                      "Australia/Sydney",
                      Intl.DateTimeFormat().resolvedOptions().timeZone,
                    ]),
                  ).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <button className="button primary" disabled={busy}>
                Save preferences
              </button>
            </form>
          </section>
          <div className="page-stack">
            <section className="panel">
              <h2>Password</h2>
              <form onSubmit={updatePassword} className="form-stack">
                <Field label="New password">
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={10}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <Field label="Confirm password">
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={10}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Field>
                <button className="button" disabled={busy}>
                  Update password
                </button>
              </form>
            </section>
            <section className="panel">
              <h2>Your data belongs to you.</h2>
              <p className="muted">
                Download accounts, trades (including deleted records),
                playbooks, notes, mistakes, and daily reviews as JSON. The
                export contains image keys, not image files.
              </p>
              <button className="button" disabled={busy} onClick={download}>
                Download full data export
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
