import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606] [html:not(.dark)_&]:bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1c1c1c] p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-black/60 border border-transparent [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-xl [html:not(.dark)_&]:shadow-slate-200"
      >
        <h2 className="text-3xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-6 text-center">Create Account</h2>
        {error && (
          <div className="bg-[#1c1c1c] border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center [html:not(.dark)_&]:bg-red-50 [html:not(.dark)_&]:text-red-600 [html:not(.dark)_&]:border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#060606] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#060606] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#060606] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:text-slate-900"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg transition-colors mt-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-500 hover:text-violet-400">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
