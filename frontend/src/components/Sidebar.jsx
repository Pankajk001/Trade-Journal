import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiBook, FiPieChart, FiSettings, FiBarChart2, FiFileText } from 'react-icons/fi';

const Sidebar = () => {
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
    <aside className="w-64 min-h-[calc(100vh-4rem)] hidden md:block transition-colors duration-300
                      bg-gray-800 border-r border-gray-700
                      [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                isActive
                  ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30 [html:not(.dark)_&]:bg-orange-50 [html:not(.dark)_&]:border-orange-200'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:bg-slate-100 [html:not(.dark)_&]:hover:text-slate-800'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
