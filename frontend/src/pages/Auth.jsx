import { useContext, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiActivity, FiArrowRight } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { db, isConfigured } from "../lib/supabase";
import { Field, Notice } from "../components/WorkspaceUI";
export default function Auth({ mode = "login" }) {
  const { login, register, user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const titles = {
    login: "Welcome back.",
    register: "Build your trading journal.",
    forgot: "Reset your password.",
    reset: "Choose a new password.",
  };
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        navigate("/dashboard");
      }
      if (mode === "register") {
        const result = await register(form.name, form.email, form.password);
        if (result) navigate("/dashboard");
        else
          setMessage("Check your email to confirm your account, then sign in.");
      }
      if (mode === "forgot") {
        await authService.resetPassword(form.email);
        setMessage(
          "If an account exists, a password reset email will arrive shortly.",
        );
      }
      if (mode === "reset") {
        const { error: failure } = await db().auth.updateUser({
          password: form.password,
        });
        if (failure) throw failure;
        setMessage("Password updated. You can return to your workspace.");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="auth-page">
      <div className="auth-story">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <FiActivity />
          </span>
          TradeJournal
        </Link>
        <div>
          <p className="eyebrow">TRADE WITH INTENTION</p>
          <h1>
            Your trades.
            <br />
            Your patterns.
            <br />
            <span>Your next chapter.</span>
          </h1>
          <p>
            A private place to record decisions, study your execution, and turn
            experience into insight.
          </p>
        </div>
        <small>PREPARE / EXECUTE / REFLECT</small>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <p className="eyebrow">YOUR PRIVATE WORKSPACE</p>
          <h2>{titles[mode]}</h2>
          <p className="muted">Every session is a chance to learn something.</p>
          {!isConfigured && (
            <Notice error="Setup required: add your Supabase URL and publishable key to frontend/.env.local. See readme.md." />
          )}
          {(error || params.get("error_description")) && (
            <Notice error={error || params.get("error_description")} />
          )}
          {message && (
            <p className="success" role="status">
              {message}
            </p>
          )}
          {mode === "register" && (
            <Field label="Your name">
              <input
                autoComplete="name"
                name="name"
                required
                value={form.name}
                onChange={change}
              />
            </Field>
          )}
          {mode !== "reset" && (
            <Field label="Email address">
              <input
                type="email"
                autoComplete="email"
                name="email"
                required
                value={form.email}
                onChange={change}
              />
            </Field>
          )}
          {mode !== "forgot" && (
            <Field
              label={mode === "reset" ? "New password" : "Password"}
              hint={mode === "register" ? "Use at least 10 characters." : null}
            >
              <input
                type="password"
                name="password"
                required
                minLength={mode === "login" ? 1 : 10}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={form.password}
                onChange={change}
              />
            </Field>
          )}
          <button
            className="button primary"
            disabled={busy || !isConfigured || (mode === "reset" && !user)}
          >
            {busy
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Update password"}
            <FiArrowRight />
          </button>
          {mode === "reset" && !user && (
            <p className="muted">
              Open the recovery link from your email to set a password.
            </p>
          )}
          {mode === "login" && (
            <Link className="text-link" to="/forgot-password">
              Forgot password?
            </Link>
          )}
          <p className="muted">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link className="text-link" to="/register">
                  Create an account
                </Link>
              </>
            ) : (
              <Link className="text-link" to="/login">
                Back to sign in
              </Link>
            )}
          </p>
          {mode === "reset" && user && (
            <Link className="text-link" to="/dashboard">
              Return to workspace
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
