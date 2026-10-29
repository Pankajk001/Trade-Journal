import { useContext, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

export default function AccountMenu() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const container = useRef(null),
    trigger = useRef(null),
    panelId = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    const keyboard = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);
  async function signOut() {
    setBusy(true);
    setError("");
    try {
      await logout();
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }
  return (
    <div
      className="account-menu"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className="account-menu-trigger"
        aria-label="Account options"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <span className="avatar" aria-hidden="true">
          {(user?.name || "U").slice(0, 2).toUpperCase()}
        </span>
        <FiChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="account-menu-panel">
          <div className="account-menu-identity">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>
          <nav aria-label="Account options">
            <Link to="/dashboard/settings" onClick={() => setOpen(false)}>
              <FiUser aria-hidden="true" /> Profile & settings
            </Link>
            <button disabled={busy} onClick={signOut}>
              <FiLogOut aria-hidden="true" />
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </nav>
          {error && (
            <p className="negative" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
