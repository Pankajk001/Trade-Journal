import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiArrowRight, FiMenu, FiX } from 'react-icons/fi';


const PublicNavbar = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling when navigating from another page
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  const handleNavClick = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setMobileOpen(false);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Nav */}
      <nav className={`transition-all duration-500 border-b
                       ${scrolled
                         ? 'bg-[#060606]/80 backdrop-blur-2xl border-gray-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)] [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:backdrop-blur-2xl [html:not(.dark)_&]:border-slate-200/60 [html:not(.dark)_&]:shadow-[0_4px_30px_rgba(0,0,0,0.08)]'
                         : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity mt-1">
                <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">TRADE</span>
                <div className="w-[110%] h-[3px] bg-violet-500 heartbeat-line my-[3px] rounded-full"></div>
                <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">JOURNAL</span>
              </Link>
            </div>

            {/* Center nav links — desktop */}
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => handleNavClick('features')} className="text-gray-400 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">
                Features
              </button>
              <button onClick={() => handleNavClick('how-it-works')} className="text-gray-400 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">
                How It Works
              </button>
              <button onClick={() => handleNavClick('testimonials')} className="text-gray-400 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">
                Testimonials
              </button>
              <Link to="/gallery" className="text-gray-400 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">
                Gallery
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300
                           bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-gray-800
                           [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:hover:bg-slate-200
                           [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-800 [html:not(.dark)_&]:border-slate-200"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              </button>

              {user ? (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
                >
                  Dashboard <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors
                                               [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 btn-shimmer"
                  >
                    Get Started <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all
                           [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:hover:bg-slate-200 [html:not(.dark)_&]:border-slate-200"
              >
                {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-800 [html:not(.dark)_&]:border-slate-200 bg-[#060606]/95 [html:not(.dark)_&]:bg-white/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-1">
            <button onClick={() => handleNavClick('features')} className="block w-full text-left text-gray-300 [html:not(.dark)_&]:text-slate-600 hover:text-white [html:not(.dark)_&]:hover:text-slate-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">Features</button>
            <button onClick={() => handleNavClick('how-it-works')} className="block w-full text-left text-gray-300 [html:not(.dark)_&]:text-slate-600 hover:text-white [html:not(.dark)_&]:hover:text-slate-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">How It Works</button>
            <button onClick={() => handleNavClick('testimonials')} className="block w-full text-left text-gray-300 [html:not(.dark)_&]:text-slate-600 hover:text-white [html:not(.dark)_&]:hover:text-slate-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">Testimonials</button>
            <Link to="/gallery" onClick={() => setMobileOpen(false)} className="block text-gray-300 [html:not(.dark)_&]:text-slate-600 hover:text-white [html:not(.dark)_&]:hover:text-slate-900 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 [html:not(.dark)_&]:hover:bg-slate-100">Gallery</Link>
            <div className="pt-2 border-t border-gray-800 [html:not(.dark)_&]:border-slate-200 flex gap-2">
              {user ? (
                <Link to="/dashboard" className="flex-1 text-center bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="flex-1 text-center text-gray-300 [html:not(.dark)_&]:text-slate-700 bg-white/5 [html:not(.dark)_&]:bg-slate-100 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">Log in</Link>
                  <Link to="/register" className="flex-1 text-center bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default PublicNavbar;
