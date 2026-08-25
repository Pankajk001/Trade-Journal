import { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FiHome, FiList, FiBook, FiPieChart, FiSettings, FiBarChart2, FiFileText, FiChevronsLeft, FiChevronsRight, FiSun, FiMoon, FiLogOut, FiUser, FiKey, FiChevronRight, FiAperture, FiActivity } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Journal', path: '/dashboard/journal', icon: <FiList /> },
    { name: 'Mistakes', path: '/dashboard/mistakes', icon: <FiBook /> },
    { name: 'Strategies', path: '/dashboard/strategies', icon: <FiPieChart /> },
    { name: 'Notes', path: '/dashboard/notes', icon: <FiFileText /> },
    { name: 'Statistics', path: '/dashboard/statistics', icon: <FiBarChart2 /> },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-full hidden md:flex flex-col transition-all duration-300
                      bg-[#1c1c1c] border-r border-gray-800/80
                      [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm`}>
      <Link to="/" className={`p-5 flex items-center ${isCollapsed ? 'justify-center p-4' : 'gap-3'} shrink-0 hover:opacity-80 transition-opacity`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] [html:not(.dark)_&]:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <FiActivity className="text-white text-2xl" />
        </div>
        {!isCollapsed && (
          <span className="font-black text-2xl tracking-tighter text-white [html:not(.dark)_&]:text-slate-900 truncate">
            Trade<span className="text-violet-500">Journal</span>
          </span>
        )}
      </Link>

      <nav className="p-4 flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            title={isCollapsed ? item.name : ""}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                isActive
                  ? 'bg-violet-500/10 text-violet-500 border border-violet-500/30 [html:not(.dark)_&]:bg-violet-50 [html:not(.dark)_&]:border-violet-200'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:bg-slate-100 [html:not(.dark)_&]:hover:text-slate-800'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800/80 [html:not(.dark)_&]:border-slate-200 flex flex-col gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} w-full py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-700/50 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:bg-slate-100 [html:not(.dark)_&]:hover:text-slate-800`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FiChevronsRight className="text-xl" /> : <FiChevronsLeft className="text-xl" />}
          {!isCollapsed && <span className="font-medium text-sm">Collapse</span>}
        </button>
      </div>

      {user && (
        <div className="relative border-t border-gray-800/80 [html:not(.dark)_&]:border-slate-200" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            title={isCollapsed ? user.name : "Profile Options"}
            className={`w-full flex p-4 transition-colors hover:bg-gray-800/30 [html:not(.dark)_&]:hover:bg-slate-50 ${isProfileMenuOpen ? 'bg-gray-800/50 [html:not(.dark)_&]:bg-slate-100' : ''}`}
          >
            <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3'} overflow-hidden`}>
              {user.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full object-cover shadow-lg shadow-violet-500/20 border border-violet-400/30 shrink-0"
                />
              ) : (
                <div 
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20 border border-violet-400/30 shrink-0"
                >
                  {getInitials(user.name)}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 pr-2 text-left">
                  <span className="text-sm font-medium text-gray-200 [html:not(.dark)_&]:text-slate-800 truncate">{user.name}</span>
                </div>
              )}
            </div>
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute z-50 bg-[#1c1c1c] border border-gray-700/80 shadow-2xl rounded-xl overflow-hidden
                           [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-xl
                           ${isCollapsed ? 'left-full ml-2 bottom-2 w-56' : 'bottom-full mb-2 left-4 right-4'}`}
              >
                <div className="py-2 flex flex-col">
                  <Link 
                    to="/dashboard/settings?tab=profile" 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900 [html:not(.dark)_&]:hover:bg-slate-50"
                  >
                    <FiUser className="text-lg opacity-70" />
                    My profile
                  </Link>

                  <button 
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900 [html:not(.dark)_&]:hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <FiSun className="text-lg opacity-70" /> : <FiMoon className="text-lg opacity-70" />}
                      <span>Display mode</span>
                    </div>
                    <FiChevronRight className="opacity-50" />
                  </button>

                  <div className="my-1 border-t border-gray-700/50 [html:not(.dark)_&]:border-slate-100"></div>

                  <Link 
                    to="/dashboard/settings?tab=preferences" 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900 [html:not(.dark)_&]:hover:bg-slate-50"
                  >
                    <FiSettings className="text-lg opacity-70" />
                    User preferences
                  </Link>

                  <Link 
                    to="/dashboard/settings?tab=security" 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900 [html:not(.dark)_&]:hover:bg-slate-50"
                  >
                    <FiKey className="text-lg opacity-70" />
                    Change password
                  </Link>
                  
                  <div className="my-1 border-t border-gray-700/50 [html:not(.dark)_&]:border-slate-100"></div>

                  <button 
                    onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900 [html:not(.dark)_&]:hover:bg-slate-50"
                  >
                    <FiLogOut className="text-lg opacity-70" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
