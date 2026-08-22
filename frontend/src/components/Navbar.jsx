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

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-[#1c1c1c] dark:bg-[#1c1c1c] border-b border-gray-800/80 dark:border-gray-800/80
                    light:bg-white light:border-slate-200 h-16 flex items-center justify-between px-6
                    transition-colors duration-300
                    [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm">
      <div className="flex items-center">
        <Link to="/" className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity mt-1">
          <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">TRADE</span>
          <div className="w-[110%] h-[3px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] my-[3px] rounded-full"></div>
          <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">JOURNAL</span>
        </Link>
      </div>
      <div className="flex items-center gap-5">
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
          <div className="flex items-center gap-4 border-l border-gray-700/50 [html:not(.dark)_&]:border-slate-300 pl-5 ml-1">
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt={user.name} 
                className="w-9 h-9 rounded-full object-cover shadow-lg shadow-orange-500/20 border border-orange-400/30"
                title={user.name}
              />
            ) : (
              <div 
                className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20 border border-orange-400/30"
                title={user.name}
              >
                {getInitials(user.name)}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300
                         [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-800"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
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
