import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiTrendingUp, FiSun, FiMoon } from 'react-icons/fi';

const PublicNavbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b transition-colors duration-300
                    bg-[#060606] border-gray-900
                    [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity mt-1">
              <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">TRADE</span>
              <div className="w-[110%] h-[3px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] my-[3px] rounded-full"></div>
              <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">JOURNAL</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/gallery" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors
                                           [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900">
              Public Gallery
            </Link>

            {/* Theme Toggle */}
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
              <Link
                to="/dashboard"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors
                                             [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
