import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-800 border-b border-gray-700 dark:border-gray-700
                    light:bg-white light:border-slate-200 h-16 flex items-center justify-between px-6
                    transition-colors duration-300
                    [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold tracking-wider text-white [html:not(.dark)_&]:text-slate-800 transition-colors duration-300">
          TRADE<span className="text-orange-500">JOURNAL</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300
                     bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white
                     [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:hover:bg-slate-200
                     [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-800"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>

        {user ? (
          <>
            <span className="text-gray-300 [html:not(.dark)_&]:text-slate-600 transition-colors duration-300 text-sm font-medium">
              Welcome, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300
                         [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-800"
            >
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-gray-300 hover:text-white transition-colors duration-300
                         [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
