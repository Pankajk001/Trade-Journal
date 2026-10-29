import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import AccountMenu from "../components/AccountMenu";
import { PriceAlertsProvider } from "../context/PriceAlertsContext";
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
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
const navigation = [
  ["Overview", "/dashboard", FiGrid],
  ["Markets", "/dashboard/markets", FiActivity],
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
  const { pathname } = useLocation();
  const isMarkets = pathname === "/dashboard/markets";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  const sidebar = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    } catch {
      /* The toggle remains usable when browser storage is unavailable. */
    }
  }, [collapsed]);
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
    <PriceAlertsProvider key={user.id} userId={user.id}>
      <div className={"workspace" + (collapsed ? " sidebar-collapsed" : "")}>
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
          <div className="sidebar-heading">
            <Link
              className="brand"
              aria-label="TradeJournal home"
              to="/dashboard"
              onClick={() => setOpen(false)}
            >
              <span className="brand-icon" aria-hidden="true">
                <FiActivity />
              </span>
              <span className="brand-text">
                TradeJournal<small>BUILD YOUR EDGE</small>
              </span>
            </Link>
            <button
              className="icon-button desktop-sidebar-toggle"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              aria-controls="workspace-navigation"
            >
              {collapsed ? (
                <FiChevronsRight aria-hidden="true" />
              ) : (
                <FiChevronsLeft aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="nav-label">WORKSPACE</p>
          <nav aria-label="Main navigation">
            {navigation.map(([name, path, Icon]) => (
              <NavLink
                key={path}
                end={path === "/dashboard"}
                to={path}
                aria-label={name}
                title={collapsed ? name : undefined}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "workspace-nav " + (isActive ? "active" : "")
                }
              >
                <Icon aria-hidden="true" />
                <span className="nav-text">{name}</span>
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
          <main
            id="main-content"
            className={
              "workspace-main" + (isMarkets ? " workspace-main-markets" : "")
            }
          >
            <Outlet key={user?.id} />
          </main>
          {!isMarkets && (
            <footer className="workspace-footer">
              A little more intention. A little more consistency.
            </footer>
          )}
        </div>
        <nav className="bottom-navigation" aria-label="Quick navigation">
          {navigation
            .filter(([, path]) =>
              [
                "/dashboard",
                "/dashboard/markets",
                "/dashboard/journal",
                "/dashboard/statistics",
              ].includes(path),
            )
            .map(([name, path, Icon]) => (
              <NavLink key={path} end={path === "/dashboard"} to={path}>
                <Icon />
                <span>{name}</span>
              </NavLink>
            ))}
        </nav>
      </div>
    </PriceAlertsProvider>
  );
}
