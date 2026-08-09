import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-white tracking-wider">
          TRADE<span className="text-orange-500">JOURNAL</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
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
