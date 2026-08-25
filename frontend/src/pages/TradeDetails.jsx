import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import tradeService from '../services/tradeService';
import TradeView from '../components/ui/TradeView';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const data = await tradeService.getTradeById(id);
        setTrade(data);
      } catch (err) {
        setError('Error fetching trade details');
      } finally {
        setLoading(false);
      }
    };
    fetchTrade();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        await tradeService.deleteTrade(id);
        navigate('/dashboard/journal');
      } catch (err) {
        alert('Failed to delete trade');
      }
    }
  };

  if (loading) return <div className="p-6 text-white [html:not(.dark)_&]:text-slate-900 text-center mt-20">Loading trade details...</div>;
  if (error) return <div className="p-6 text-rose-500 text-center mt-20">{error}</div>;
  if (!trade) return <div className="p-6 text-gray-400 [html:not(.dark)_&]:text-slate-500 text-center mt-20">Trade not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-8 bg-[#0a0a0a] [html:not(.dark)_&]:bg-white p-4 rounded-2xl border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-sm">
        <Link 
          to="/dashboard/journal" 
          className="flex items-center gap-2 text-gray-400 [html:not(.dark)_&]:text-slate-500 hover:text-white [html:not(.dark)_&]:hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <FiArrowLeft size={16} /> Back to Journal
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-rose-500/20 [html:not(.dark)_&]:bg-rose-50 [html:not(.dark)_&]:hover:bg-rose-500 [html:not(.dark)_&]:hover:text-white [html:not(.dark)_&]:border-rose-200"
        >
          <FiTrash2 size={16} /> Delete Trade
        </button>
      </div>

      {/* Render the unified Blog-style TradeView */}
      <TradeView trade={trade} />
    </div>
  );
};

export default TradeDetails;
