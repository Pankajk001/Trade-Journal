import { useState, useEffect } from 'react';
import axios from 'axios';
import PublicNavbar from '../components/PublicNavbar';
import { format } from 'date-fns';
import { FiX } from 'react-icons/fi';
import TradeView from '../components/ui/TradeView';

const Gallery = () => {
  const [publicTrades, setPublicTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    const fetchPublicTrades = async () => {
      try {
        const { data } = await axios.get('/api/trades/public');
        setPublicTrades(data);
      } catch (error) {
        console.error('Error fetching public trades', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTrades();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative">
      <PublicNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Public Trade Gallery</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Explore trades shared by our community. Learn from their setups, wins, losses, and psychology to improve your own trading.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading public trades...</div>
        ) : publicTrades.length === 0 ? (
          <div className="text-center bg-gray-800 shadow-2xl shadow-black/60 border border-transparent rounded-xl p-10 max-w-2xl mx-auto">
            <h3 className="text-xl text-white font-medium mb-2">No public trades yet</h3>
            <p className="text-gray-400">Be the first to share your trading journey by making a trade public!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicTrades.map((trade) => (
              <div 
                key={trade._id} 
                onClick={() => setSelectedTrade(trade)}
                className="bg-gray-800 rounded-xl shadow-2xl shadow-black/60 border border-transparent overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer"
              >
                
                {/* Header: User & Date */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                      {trade.user?.name ? trade.user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="text-sm font-medium text-white">{trade.user?.name || 'Anonymous'}</span>
                  </div>
                  <span className="text-xs text-gray-500">{format(new Date(trade.date), 'MMM dd, yyyy')}</span>
                </div>

                {/* Trade Image */}
                <div className="h-48 w-full bg-gray-900 relative">
                  {trade.screenshotBeforeEntry || trade.screenshotAfterExit ? (
                    <img 
                      src={trade.screenshotBeforeEntry || trade.screenshotAfterExit} 
                      alt="Trade Chart" 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Chart Image</div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded shadow ${
                      trade.winLoss === 'Win' ? 'bg-green-500 text-white' : 
                      trade.winLoss === 'Loss' ? 'bg-red-500 text-white' : 
                      'bg-gray-500 text-white'
                    }`}>
                      {trade.winLoss}
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold rounded shadow ${
                      trade.direction === 'Long' ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {trade.direction}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{trade.pair}</h3>
                      <p className="text-xs text-gray-400">{trade.strategyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300 font-medium">{trade.rMultiple}R</p>
                      <p className="text-xs text-gray-500">{trade.session}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Lessons Learned</p>
                    <p className="text-sm text-gray-300 line-clamp-3">{trade.lessonsLearned || trade.tradeDescription || 'No description provided.'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Full Screen Modal Overlay for TradeView */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          {/* Scrollable Container */}
          <div className="bg-gray-900 w-full max-w-5xl rounded-2xl border border-gray-700 shadow-2xl relative max-h-[90vh] overflow-y-auto p-6">
            <button 
              onClick={() => setSelectedTrade(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors z-10"
            >
              <FiX size={24} />
            </button>
            <div className="mt-4">
              <TradeView trade={selectedTrade} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
