import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import tradeService from '../services/tradeService';
import PublicNavbar from '../components/PublicNavbar';
import { format } from 'date-fns';
import { FiX, FiTrendingUp, FiBookmark, FiActivity, FiDollarSign, FiPieChart, FiCheckCircle, FiXCircle, FiImage } from 'react-icons/fi';
import TradeView from '../components/ui/TradeView';

const FILTERS = ['All Trades', 'Crypto', 'Forex', 'Wins', 'Losses'];

const Gallery = () => {
  const [publicTrades, setPublicTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Trades');

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

  const filteredTrades = useMemo(() => {
    if (activeFilter === 'All Trades') return publicTrades;
    if (activeFilter === 'Wins') return publicTrades.filter(t => t.winLoss === 'Win');
    if (activeFilter === 'Losses') return publicTrades.filter(t => t.winLoss === 'Loss');
    return publicTrades.filter(t => t.market?.toLowerCase() === activeFilter.toLowerCase());
  }, [publicTrades, activeFilter]);

  const categoryCounts = useMemo(() => {
    return {
      Crypto: publicTrades.filter(t => t.market?.toLowerCase() === 'crypto').length,
      Forex: publicTrades.filter(t => t.market?.toLowerCase() === 'forex').length,
      Wins: publicTrades.filter(t => t.winLoss === 'Win').length,
      Losses: publicTrades.filter(t => t.winLoss === 'Loss').length,
    };
  }, [publicTrades]);

  return (
    <div className="min-h-screen bg-[#060606] [html:not(.dark)_&]:bg-[#fcfcfd] flex flex-col relative font-sans overflow-x-hidden">
      <PublicNavbar />
      
      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 relative z-10">
        
        {/* Left Column: Trade Cards & Filters */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Top Filter Bar */}
          <div className="w-full mb-8 relative z-10 border-b border-gray-800/60 [html:not(.dark)_&]:border-slate-200">
            <div className="w-full overflow-x-auto custom-scrollbar">
              <div className="flex w-full min-w-max lg:min-w-0 justify-start items-center gap-2 sm:gap-6 lg:gap-8 pb-4">
                {FILTERS.map((filter, index) => {
                  const isActive = activeFilter === filter;
                  return (
                    <div key={filter} className="flex items-center">
                      <button
                        onClick={() => setActiveFilter(filter)}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm md:text-base font-bold transition-all duration-300 ${
                          isActive 
                            ? 'bg-violet-500/10 [html:not(.dark)_&]:bg-violet-50 text-violet-400 [html:not(.dark)_&]:text-violet-600 shadow-sm' 
                            : 'bg-transparent text-gray-400 [html:not(.dark)_&]:text-slate-600 hover:bg-gray-800/50 [html:not(.dark)_&]:hover:bg-slate-50 hover:text-white [html:not(.dark)_&]:hover:text-slate-900'
                        }`}
                      >
                        {filter === 'All Trades' && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20' : 'bg-gray-800 [html:not(.dark)_&]:bg-violet-100 [html:not(.dark)_&]:text-violet-500'}`}>
                            <FiTrendingUp size={12} />
                          </div>
                        )}
                        {filter}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 [html:not(.dark)_&]:text-slate-500 font-medium">Loading gallery...</p>
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="text-center bg-[#121212] [html:not(.dark)_&]:bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] [html:not(.dark)_&]:shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-800/60 [html:not(.dark)_&]:border-slate-100 rounded-3xl p-16 max-w-2xl mx-auto mt-10">
              <div className="w-20 h-20 bg-gray-800/50 [html:not(.dark)_&]:bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-500 [html:not(.dark)_&]:text-slate-400">
                <FiActivity size={32} />
              </div>
              <h3 className="text-2xl text-white [html:not(.dark)_&]:text-slate-900 font-bold mb-3 tracking-tight font-serif">No trades found</h3>
              <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-lg font-medium">Try selecting a different category from the filters above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrades.map((trade) => {
                const coverImage = trade.screenshotHTF || trade.screenshotBeforeEntry || trade.screenshotMTF || trade.screenshotLTF;
                return (
                  <div 
                    key={trade._id} 
                    onClick={() => setSelectedTrade(trade)}
                    className="bg-[#121212] [html:not(.dark)_&]:bg-white rounded-none p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] [html:not(.dark)_&]:shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-800/60 [html:not(.dark)_&]:border-slate-100 flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] [html:not(.dark)_&]:hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="w-full aspect-video rounded-none overflow-hidden mb-5 relative bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50">
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt="Trade Cover" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 [html:not(.dark)_&]:text-slate-300">
                          <FiImage size={32} />
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md backdrop-blur-md ${
                          trade.market?.toLowerCase() === 'crypto' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 [html:not(.dark)_&]:bg-indigo-50 [html:not(.dark)_&]:text-indigo-600 [html:not(.dark)_&]:border-indigo-100' :
                          trade.market?.toLowerCase() === 'forex' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 [html:not(.dark)_&]:bg-emerald-50 [html:not(.dark)_&]:text-emerald-600 [html:not(.dark)_&]:border-emerald-100' :
                          'bg-violet-500/20 text-violet-300 border border-violet-500/30 [html:not(.dark)_&]:bg-violet-50 [html:not(.dark)_&]:text-violet-600 [html:not(.dark)_&]:border-violet-100'
                        }`}>
                          {trade.market || 'TRADE'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-3 pb-2 flex-1 flex flex-col">
                      <h3 className="text-xl md:text-[22px] font-black font-serif text-white [html:not(.dark)_&]:text-slate-900 leading-tight mb-2.5 line-clamp-2 group-hover:text-violet-400 [html:not(.dark)_&]:group-hover:text-violet-600 transition-colors">
                        {trade.strategyName ? `${trade.strategyName} on ${trade.pair}` : `${trade.direction} on ${trade.pair}`}
                      </h3>
                      <p className="text-[13px] font-semibold text-gray-500 [html:not(.dark)_&]:text-slate-500 mb-6 flex items-center gap-2">
                        <span>{format(new Date(trade.date), 'MMM dd, yyyy')}</span>
                        <span className="text-violet-500/50 [html:not(.dark)_&]:text-violet-300 font-bold">•</span>
                        <span>{trade.rMultiple ? `${trade.rMultiple}R Profit` : 'Setup Review'}</span>
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-800/60 [html:not(.dark)_&]:border-slate-100 pt-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                            {trade.user?.name ? trade.user.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <span className="text-sm font-bold text-gray-400 [html:not(.dark)_&]:text-slate-700">By <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.user?.name || 'Anonymous'}</span></span>
                        </div>
                        <FiBookmark className="text-gray-600 [html:not(.dark)_&]:text-slate-400 hover:text-violet-500 transition-colors" size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Ad Spaces */}
        <div className="w-full lg:w-[250px] flex-none flex flex-col gap-8 items-center lg:items-start">
          {/* Ad Slot 1: Square (250x250) */}
          <div className="w-full aspect-square bg-[#121212] [html:not(.dark)_&]:bg-slate-100 rounded-none border-2 border-dashed border-gray-800 [html:not(.dark)_&]:border-slate-300 flex flex-col items-center justify-center text-gray-500 [html:not(.dark)_&]:text-slate-400 p-4">
            <span className="text-sm font-bold uppercase tracking-widest mb-2">Ad</span>
            <span className="text-xs">250 x 250</span>
          </div>

          {/* Ad Slot 2: Tall Banner (250x600) */}
          <div className="w-full h-[600px] bg-[#121212] [html:not(.dark)_&]:bg-slate-100 rounded-none border-2 border-dashed border-gray-800 [html:not(.dark)_&]:border-slate-300 flex flex-col items-center justify-center text-gray-500 [html:not(.dark)_&]:text-slate-400 p-4 sticky top-28">
            <span className="text-sm font-bold uppercase tracking-widest mb-2 text-center">Ad</span>
            <span className="text-xs text-center">250 x 600</span>
          </div>
        </div>
      </main>

      {/* Full Screen "Page" Overlay for TradeView */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 bg-[#060606] [html:not(.dark)_&]:bg-[#fcfcfd] overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300">
          <PublicNavbar />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 relative z-10">
            {/* Left Column: Trade View */}
            <div className="flex-1 w-full min-w-0">
              <button 
                onClick={() => setSelectedTrade(null)}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-900 transition-colors font-semibold"
              >
                &larr; Back to Gallery
              </button>
              <TradeView trade={selectedTrade} />
            </div>

            {/* Right Sidebar: Ad Spaces */}
            <div className="w-full lg:w-[250px] flex-none flex flex-col gap-8 items-center lg:items-start pt-12">
              {/* Ad Slot 1: Square (250x250) */}
              <div className="w-full aspect-square bg-[#121212] [html:not(.dark)_&]:bg-slate-100 rounded-none border-2 border-dashed border-gray-800 [html:not(.dark)_&]:border-slate-300 flex flex-col items-center justify-center text-gray-500 [html:not(.dark)_&]:text-slate-400 p-4">
                <span className="text-sm font-bold uppercase tracking-widest mb-2">Ad</span>
                <span className="text-xs">250 x 250</span>
              </div>

              {/* Ad Slot 2: Tall Banner (250x600) */}
              <div className="w-full h-[600px] bg-[#121212] [html:not(.dark)_&]:bg-slate-100 rounded-none border-2 border-dashed border-gray-800 [html:not(.dark)_&]:border-slate-300 flex flex-col items-center justify-center text-gray-500 [html:not(.dark)_&]:text-slate-400 p-4 sticky top-28">
                <span className="text-sm font-bold uppercase tracking-widest mb-2 text-center">Ad</span>
                <span className="text-xs text-center">250 x 600</span>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Gallery;
