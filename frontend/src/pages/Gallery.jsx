import { useState, useEffect } from 'react';
import tradeService from '../services/tradeService';
import PublicNavbar from '../components/PublicNavbar';
import { format } from 'date-fns';
import { FiX, FiTrendingUp, FiTrendingDown, FiClock, FiMaximize2 } from 'react-icons/fi';
import TradeView from '../components/ui/TradeView';

const Gallery = () => {
  const [publicTrades, setPublicTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    const fetchPublicTrades = async () => {
      try {
        const data = await tradeService.getPublicTrades();
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
    <div className="min-h-screen bg-[#060606] [html:not(.dark)_&]:bg-slate-50 flex flex-col relative font-sans overflow-x-hidden">
      <PublicNavbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800/60 [html:not(.dark)_&]:border-slate-200/60">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent [html:not(.dark)_&]:from-violet-500/10 [html:not(.dark)_&]:to-slate-50 pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 [html:not(.dark)_&]:bg-violet-400/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <span className="inline-block text-violet-500 text-sm font-bold uppercase tracking-widest mb-4">Community</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white [html:not(.dark)_&]:text-slate-900 mb-6 tracking-tight">Public Trade Gallery</h1>
          <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore live trades shared by the community. Dissect their setups, learn from their wins and losses, and refine your own execution.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 [html:not(.dark)_&]:text-slate-500 font-medium">Loading gallery...</p>
          </div>
        ) : publicTrades.length === 0 ? (
          <div className="text-center bg-[#18181b] [html:not(.dark)_&]:bg-white shadow-xl shadow-black/20 [html:not(.dark)_&]:shadow-slate-200/50 border border-gray-800 [html:not(.dark)_&]:border-slate-200 rounded-3xl p-16 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-800/50 [html:not(.dark)_&]:bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-500 [html:not(.dark)_&]:text-slate-400">
              <FiMaximize2 size={32} />
            </div>
            <h3 className="text-2xl text-white [html:not(.dark)_&]:text-slate-900 font-bold mb-3 tracking-tight">No public trades yet</h3>
            <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-lg">Be the first to share your trading journey by making a trade public from your dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicTrades.map((trade) => (
              <div 
                key={trade._id} 
                onClick={() => setSelectedTrade(trade)}
                className="bg-[#18181b] [html:not(.dark)_&]:bg-white rounded-3xl shadow-lg shadow-black/20 border border-gray-800 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-200/50 overflow-hidden flex flex-col group hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] [html:not(.dark)_&]:hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
              >
                {/* Header: User & Date */}
                <div className="px-6 py-4 border-b border-gray-800 [html:not(.dark)_&]:border-slate-100 flex justify-between items-center bg-[#1c1c1e]/50 [html:not(.dark)_&]:bg-slate-50/50 backdrop-blur-sm relative z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {trade.user?.name ? trade.user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="text-sm font-bold text-white [html:not(.dark)_&]:text-slate-900">{trade.user?.name || 'Anonymous'}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 [html:not(.dark)_&]:text-slate-400 bg-gray-800/50 [html:not(.dark)_&]:bg-slate-200/50 px-2.5 py-1 rounded-md">
                    {format(new Date(trade.date), 'MMM dd, yyyy')}
                  </span>
                </div>

                {/* Trade Image Container */}
                <div className="h-52 w-full bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 relative overflow-hidden">
                  {trade.screenshotBeforeEntry || trade.screenshotAfterExit ? (
                    <img 
                      src={trade.screenshotBeforeEntry || trade.screenshotAfterExit} 
                      alt="Trade Chart" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 [html:not(.dark)_&]:text-slate-400 bg-gray-900/50 [html:not(.dark)_&]:bg-slate-100">
                      <FiMaximize2 className="mb-2 opacity-50" size={24} />
                      <span className="text-sm font-medium">No Chart Available</span>
                    </div>
                  )}
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg backdrop-blur-md border ${
                      trade.winLoss === 'Win' ? 'bg-green-500/20 text-green-400 border-green-500/20 [html:not(.dark)_&]:bg-green-100 [html:not(.dark)_&]:text-green-700 [html:not(.dark)_&]:border-green-200' : 
                      trade.winLoss === 'Loss' ? 'bg-red-500/20 text-red-400 border-red-500/20 [html:not(.dark)_&]:bg-red-100 [html:not(.dark)_&]:text-red-700 [html:not(.dark)_&]:border-red-200' : 
                      'bg-gray-500/20 text-gray-300 border-gray-500/20 [html:not(.dark)_&]:bg-slate-200 [html:not(.dark)_&]:text-slate-700 [html:not(.dark)_&]:border-slate-300'
                    }`}>
                      {trade.winLoss}
                    </span>
                  </div>
                  
                  {/* Hover Overlay Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]">
                    <div className="bg-violet-500 text-white rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-violet-500/30">
                      <FiMaximize2 size={20} />
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#121212]/30 [html:not(.dark)_&]:to-slate-50/50">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-black text-white [html:not(.dark)_&]:text-slate-900 tracking-tight">{trade.pair}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${trade.direction === 'Long' ? 'text-emerald-400 bg-emerald-400/10 [html:not(.dark)_&]:text-emerald-700 [html:not(.dark)_&]:bg-emerald-100' : 'text-rose-400 bg-rose-400/10 [html:not(.dark)_&]:text-rose-700 [html:not(.dark)_&]:bg-rose-100'}`}>
                          {trade.direction === 'Long' ? <FiTrendingUp className="inline mr-1" /> : <FiTrendingDown className="inline mr-1" />}{trade.direction}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-violet-400 [html:not(.dark)_&]:text-violet-600 bg-violet-500/10 [html:not(.dark)_&]:bg-violet-100 px-2 py-1 rounded-md inline-block">
                        {trade.strategyName || 'No Strategy'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-white [html:not(.dark)_&]:text-slate-900 font-black tracking-tight">{trade.rMultiple ? `${trade.rMultiple}R` : '-'}</p>
                      <p className="text-xs text-gray-500 [html:not(.dark)_&]:text-slate-500 flex items-center justify-end gap-1 font-medium mt-1">
                        <FiClock size={12}/> {trade.session || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-gray-800 [html:not(.dark)_&]:border-slate-200/80">
                    <p className="text-[10px] text-gray-500 [html:not(.dark)_&]:text-slate-400 uppercase tracking-widest mb-2 font-bold">Lessons Learned</p>
                    <p className="text-sm text-gray-300 [html:not(.dark)_&]:text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {trade.lessonsLearned || trade.tradeDescription || 'No description provided by the trader.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Full Screen Modal Overlay for TradeView */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 [html:not(.dark)_&]:bg-slate-900/80 backdrop-blur-md transition-all duration-300">
          {/* Scrollable Container */}
          <div className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50 w-full max-w-6xl rounded-3xl border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-2xl relative max-h-[95vh] overflow-y-auto overflow-x-hidden p-2 sm:p-6 custom-scrollbar">
            <button 
              onClick={() => setSelectedTrade(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 [html:not(.dark)_&]:text-slate-500 hover:text-white [html:not(.dark)_&]:hover:text-slate-900 bg-[#1c1c1e] [html:not(.dark)_&]:bg-white hover:bg-gray-800 [html:not(.dark)_&]:hover:bg-slate-100 border border-transparent [html:not(.dark)_&]:border-slate-200 rounded-full p-2.5 transition-all z-[60] shadow-lg"
            >
              <FiX size={24} />
            </button>
            <div className="mt-6 sm:mt-2">
              <TradeView trade={selectedTrade} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
