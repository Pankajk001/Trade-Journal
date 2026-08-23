import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tradeService from '../services/tradeService';
import { format } from 'date-fns';
import ImageGallery from '../components/ImageGallery';
import { FiTrash2 } from 'react-icons/fi';

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
        navigate('/journal');
      } catch (err) {
        alert('Failed to delete trade');
      }
    }
  };

  if (loading) return <div className="p-6 text-white">Loading trade details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!trade) return <div className="p-6 text-gray-400">Trade not found.</div>;

  const images = [
    { url: trade.screenshotHTF, title: 'HTF Chart' },
    { url: trade.screenshotMTF, title: 'MTF Chart' },
    { url: trade.screenshotLTF, title: 'LTF Chart' }
  ].filter(img => img.url); // filter out empty URLs if any

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {trade.pair} <span className="text-gray-400 text-xl font-normal">({trade.direction})</span>
          </h1>
          <p className="text-gray-400">{format(new Date(trade.date), 'MMMM dd, yyyy')} at {trade.time}</p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition-colors"
        >
          <FiTrash2 /> Delete Trade
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-[#1c1c1c] p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Result</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Outcome</span>
                <span className={`font-medium ${trade.winLoss === 'Win' ? 'text-green-400' : 'text-red-400'}`}>{trade.winLoss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net PNL</span>
                <span className={`font-medium ${trade.netPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.netPnl >= 0 ? `+$${(trade.netPnl || 0).toFixed(2)}` : `-$${Math.abs(trade.netPnl || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">R Multiple</span>
                <span className="text-white">{trade.rMultiple}R</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Setup Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Strategy</span>
                <span className="text-white">{trade.strategyName}</span>
              </div>
              <div className="flex justify-between items-start text-right">
                <span className="text-gray-400">Confluences</span>
                <span className="text-white max-w-[150px]">{trade.entryConfluences?.length > 0 ? trade.entryConfluences.join(', ') : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Session</span>
                <span className="text-white">{trade.session}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1c1c1c] p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Entry</span>
                <span className="text-white">{trade.entryPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stop Loss</span>
                <span className="text-white">{trade.stopLoss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Take Profit</span>
                <span className="text-white">{trade.takeProfit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Review & Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1c1c1c] p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Journal Review</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Entry Emotion</h3>
                <p className="text-white bg-[#060606] p-3 rounded-lg border border-gray-800">{trade.entryEmotion || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Exit Emotion</h3>
                <p className="text-white bg-[#060606] p-3 rounded-lg border border-gray-800">{trade.exitEmotion || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Followed Plan?</h3>
                <p className={`font-semibold p-3 rounded-lg border ${trade.followedPlan ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                  {trade.followedPlan ? 'Yes' : 'No'}
                </p>
              </div>
              {!trade.followedPlan && trade.intendedPlan && (
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Intended Plan</h3>
                  <p className="text-white bg-[#060606] p-3 rounded-lg border border-gray-800">{trade.intendedPlan}</p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Trade Management</h3>
              <p className="text-white bg-[#060606] p-4 rounded-lg border border-gray-800">{trade.tradeManagement || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Note / Reflection</h3>
              <p className="text-white bg-[#060606] p-4 rounded-lg border border-gray-800">{trade.noteReflection || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Mistakes Made</h3>
              <p className="text-red-300 bg-red-900/20 border border-red-900/50 p-4 rounded-lg">{trade.mistakesMade}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Lessons Learned</h3>
              <p className="text-green-300 bg-green-900/20 border border-green-900/50 p-4 rounded-lg">{trade.lessonsLearned}</p>
            </div>
            
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trade.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Screenshots</h2>
            {images.length > 0 ? (
              <ImageGallery images={images} />
            ) : (
              <p className="text-gray-400">No screenshots attached to this trade.</p>
            )}
            
            {trade.tradingViewLink && (
              <div className="mt-6 text-center">
                <a 
                  href={trade.tradingViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  View on TradingView
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;
