import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiTrendingUp } from 'react-icons/fi';

const PublicNavbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-orange-500 hover:text-orange-400 transition-colors">
              <FiTrendingUp className="text-2xl mr-2" />
              <span className="text-xl font-bold text-white tracking-wider">TradeJournal</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/gallery" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Public Gallery
            </Link>
            
            {user ? (
              <Link
                to="/dashboard"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
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
