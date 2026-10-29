import { Outlet, NavLink, Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import AccountMenu from "../components/AccountMenu";
import {
  FiActivity,
  FiGrid,
  FiBookOpen,
  FiCalendar,
  FiBarChart2,
  FiLayers,
  FiEdit3,
  FiSettings,
  FiMenu,
  FiX,
  FiCreditCard,
} from "react-icons/fi";
const navigation = [
  ["Overview", "/dashboard", FiGrid],
  ["Journal", "/dashboard/journal", FiBookOpen],
  ["Calendar", "/dashboard/calendar", FiCalendar],
  ["Analytics", "/dashboard/statistics", FiBarChart2],
  ["Playbook", "/dashboard/strategies", FiLayers],
  ["Daily review", "/dashboard/review", FiEdit3],
  ["Mistakes", "/dashboard/mistakes", FiActivity],
  ["Notes", "/dashboard/notes", FiBookOpen],
  ["Accounts", "/dashboard/accounts", FiCreditCard],
  ["Settings", "/dashboard/settings", FiSettings],
];
export default function MainLayout() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const sidebar = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = () =>
      Array.from(
        sidebar.current.querySelectorAll("a[href],button:not([disabled])"),
      );
    links()[0]?.focus();
    const keyboard = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = links(),
        first = items[0],
        last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keyboard);
      previous?.focus();
    };
  }, [open]);
  return (
    <div className="workspace">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {open && (
        <button
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        id="workspace-navigation"
        ref={sidebar}
        className={"workspace-sidebar " + (open ? "is-open" : "")}
      >
        {open && (
          <button
            className="button small mobile-close"
            onClick={() => setOpen(false)}
          >
            Close menu
          </button>
        )}
        <Link className="brand" to="/dashboard" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            <FiActivity />
          </span>
          <span>
            TradeJournal<small>BUILD YOUR EDGE</small>
          </span>
        </Link>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {navigation.map(([name, path, Icon]) => (
            <NavLink
              key={path}
              end={path === "/dashboard"}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                "workspace-nav " + (isActive ? "active" : "")
              }
            >
              <Icon />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="workspace-body">
        <div className="workspace-topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="workspace-navigation"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
          <span className="topbar-label">
            <span className="status-dot" /> Personal trading journal
          </span>
          <div className="topbar-actions">
            <Link className="button small" to="/dashboard/add-trade">
              + Log trade
            </Link>
            <AccountMenu />
          </div>
        </div>
        <main id="main-content" className="workspace-main">
          <Outlet key={user?.id} />
        </main>
        <footer className="workspace-footer">
          A little more intention. A little more consistency.
        </footer>
      </div>
      <nav className="bottom-navigation" aria-label="Quick navigation">
        {navigation.slice(0, 4).map(([name, path, Icon]) => (
          <NavLink key={path} end={path === "/dashboard"} to={path}>
            <Icon />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
