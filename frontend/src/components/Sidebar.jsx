import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiBook, FiPieChart, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Journal', path: '/dashboard/journal', icon: <FiList /> },
    { name: 'Mistakes', path: '/dashboard/mistakes', icon: <FiBook /> },
    { name: 'Strategies', path: '/dashboard/strategies', icon: <FiPieChart /> },
    { name: 'Notes', path: '/dashboard/notes', icon: <FiBook /> },
    { name: 'Statistics', path: '/dashboard/statistics', icon: <FiPieChart /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FiSettings /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-[calc(100vh-4rem)] hidden md:block">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-600/10 text-orange-500 border border-orange-500/50'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
