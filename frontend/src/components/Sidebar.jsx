import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiBook, FiPieChart, FiSettings, FiBarChart2, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Journal', path: '/dashboard/journal', icon: <FiList /> },
    { name: 'Mistakes', path: '/dashboard/mistakes', icon: <FiBook /> },
    { name: 'Strategies', path: '/dashboard/strategies', icon: <FiPieChart /> },
    { name: 'Notes', path: '/dashboard/notes', icon: <FiFileText /> },
    { name: 'Statistics', path: '/dashboard/statistics', icon: <FiBarChart2 /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FiSettings /> },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} min-h-[calc(100vh-4rem)] hidden md:flex flex-col transition-all duration-300
                      bg-[#1c1c1c] border-r border-gray-800/80
                      [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm`}>
      <nav className="p-4 flex-1 space-y-2">
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

      <div className="p-4 border-t border-gray-800/80 [html:not(.dark)_&]:border-slate-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center justify-center w-full py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-700/50 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:bg-slate-100 [html:not(.dark)_&]:hover:text-slate-800`}
        >
          {isCollapsed ? <FiChevronRight className="text-xl" /> : <FiChevronLeft className="text-xl" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
