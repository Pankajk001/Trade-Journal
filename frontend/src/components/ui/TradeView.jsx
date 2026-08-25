import { useState } from 'react';
import { format } from 'date-fns';
import { FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiXCircle, FiImage, FiX, FiTarget, FiList, FiCrosshair, FiActivity, FiAlertCircle, FiAward } from 'react-icons/fi';

const Badge = ({ children, color = "violet" }) => {
  const colors = {
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20 [html:not(.dark)_&]:bg-violet-50 [html:not(.dark)_&]:border-violet-200",
    green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 [html:not(.dark)_&]:bg-emerald-50 [html:not(.dark)_&]:border-emerald-200",
    red: "bg-rose-500/10 text-rose-500 border-rose-500/20 [html:not(.dark)_&]:bg-rose-50 [html:not(.dark)_&]:border-rose-200",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20 [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:border-slate-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[color]} uppercase tracking-wider`}>
      {children}
    </span>
  );
};

const Metric = ({ label, value, valueClass = "text-white [html:not(.dark)_&]:text-slate-900" }) => (
  <div className="flex flex-col items-center">
    <span className="text-[10px] font-bold text-gray-500 [html:not(.dark)_&]:text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-xl md:text-2xl font-black ${valueClass}`}>{value || '-'}</span>
  </div>
);

const TradeView = ({ trade }) => {
  const [fullScreenImage, setFullScreenImage] = useState(null);

  if (!trade) return null;

  const htfImg = trade.screenshotHTF || trade.screenshotBeforeEntry;
  const mtfImg = trade.screenshotMTF || trade.screenshotDuringTrade;
  const ltfImg = trade.screenshotLTF || trade.screenshotAfterExit;

  const netPnlNum = Number(String(trade.netPnl || '').replace(/[^0-9.-]/g, ''));
  const isWin = netPnlNum > 0 || String(trade.netPnl || '').includes('+') || trade.winLoss === 'Win';
  const isLoss = netPnlNum < 0 || String(trade.netPnl || '').includes('-') || trade.winLoss === 'Loss';
  
  const coverImage = htfImg || mtfImg || ltfImg;

  return (
    <div className="w-full max-w-4xl mx-auto text-left font-sans pb-16 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white rounded-none overflow-hidden shadow-2xl">
      
      {/* Blog Header */}
      <div className="flex flex-col items-center text-center pt-16 pb-8 px-4">
        <div className="flex items-center gap-2 mb-4">
          {trade.direction === 'Long' ? <Badge color="green"><FiTrendingUp className="inline mr-1"/>Long</Badge> : trade.direction === 'Short' ? <Badge color="red"><FiTrendingDown className="inline mr-1"/>Short</Badge> : null}
          {trade.strategyName && <Badge color="violet">{trade.strategyName}</Badge>}
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-white [html:not(.dark)_&]:text-slate-900 tracking-tight mb-6">
          {trade.pair}
        </h1>
        
        <div className="flex items-center gap-3 text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm font-medium mb-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {trade.user?.name ? trade.user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span>By <strong className="text-white [html:not(.dark)_&]:text-slate-900">{trade.user?.name || 'Anonymous'}</strong></span>
          <span>•</span>
          <span>{trade.date ? format(new Date(trade.date), 'MMMM dd, yyyy') : 'Unknown Date'}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FiClock /> {trade.session || 'Any'} Session</span>
        </div>
        
        {/* Metric Strip */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-6 px-10 bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50 border border-gray-800/80 [html:not(.dark)_&]:border-slate-200 rounded-none w-full max-w-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] [html:not(.dark)_&]:shadow-sm">
          <Metric 
            label="Net PNL" 
            value={trade.netPnl || '$0.00'} 
            valueClass={isWin ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-gray-400 [html:not(.dark)_&]:text-slate-600'} 
          />
          <Metric label="R-Multiple" value={trade.rMultiple ? `${trade.rMultiple}R` : '-'} />
          <Metric label="Risk" value={trade.riskPercentage ? `${trade.riskPercentage}%` : '-'} />
          <Metric label="Lot Size" value={trade.lotSize || '-'} />
          <Metric label="Duration" value={trade.duration || '-'} />
        </div>
      </div>

      {/* All Images in a Single Row */}
      {(htfImg || mtfImg || ltfImg) && (
        <div className="px-4 sm:px-8 mb-16">
          <div className="flex flex-col sm:flex-row gap-4">
            {htfImg && (
              <div 
                className="flex-1 w-full aspect-[4/3] bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 rounded-none overflow-hidden border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-lg relative group cursor-pointer"
                onClick={() => setFullScreenImage(htfImg)}
              >
                <div className="absolute top-2 left-2 bg-black/60 [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:text-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">HTF / BEFORE</div>
                <img src={htfImg} alt="HTF Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            {mtfImg && (
              <div 
                className="flex-1 w-full aspect-[4/3] bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 rounded-none overflow-hidden border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-lg relative group cursor-pointer"
                onClick={() => setFullScreenImage(mtfImg)}
              >
                <div className="absolute top-2 left-2 bg-black/60 [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:text-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">MTF / DURING</div>
                <img src={mtfImg} alt="MTF Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            {ltfImg && (
              <div 
                className="flex-1 w-full aspect-[4/3] bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 rounded-none overflow-hidden border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-lg relative group cursor-pointer"
                onClick={() => setFullScreenImage(ltfImg)}
              >
                <div className="absolute top-2 left-2 bg-black/60 [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:text-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">LTF / AFTER</div>
                <img src={ltfImg} alt="LTF Entry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Data Section */}
      <div className="px-6 sm:px-12 max-w-4xl mx-auto space-y-8">
        
        {/* Setup & Context Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Setup */}
          <section className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50/50 p-6 rounded-none border border-gray-800/40 [html:not(.dark)_&]:border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.1)] [html:not(.dark)_&]:shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiTarget className="text-violet-500" size={18} />
              <h2 className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest">Setup & Context</h2>
            </div>
            <div className="text-gray-300 [html:not(.dark)_&]:text-slate-700 leading-relaxed text-sm sm:text-base">
              I took this trade based on the <strong className="text-white [html:not(.dark)_&]:text-slate-900">{trade.strategyName || 'unnamed'}</strong> strategy.
              {trade.intendedPlan && <span className="block mt-3 pt-3 border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50"><strong className="text-gray-400">Plan:</strong> {trade.intendedPlan}</span>}
            </div>
          </section>

          {/* Confluences */}
          <section className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50/50 p-6 rounded-none border border-gray-800/40 [html:not(.dark)_&]:border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.1)] [html:not(.dark)_&]:shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiList className="text-violet-500" size={18} />
              <h2 className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest">Confluences Met</h2>
            </div>
            {Array.isArray(trade.entryConfluences) && trade.entryConfluences.length > 0 ? (
              <ul className="space-y-2.5">
                {trade.entryConfluences.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm sm:text-base text-gray-300 [html:not(.dark)_&]:text-slate-700">
                    <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">No specific confluences recorded.</p>
            )}
          </section>
        </div>

        {/* Execution Details Ribbon */}
        <section className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50/50 rounded-none border border-gray-800/40 [html:not(.dark)_&]:border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.1)] [html:not(.dark)_&]:shadow-sm overflow-hidden">
          <div className="bg-black/40 [html:not(.dark)_&]:bg-white/50 px-6 py-3 border-b border-gray-800/50 [html:not(.dark)_&]:border-slate-200/60 flex items-center gap-2">
             <FiCrosshair className="text-violet-500" size={18} />
             <h2 className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest">Execution Details</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-800/50 [html:not(.dark)_&]:divide-slate-200/60">
            <div className="p-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Entry</span>
              <span className="text-lg font-black text-white [html:not(.dark)_&]:text-slate-900">{trade.entryPrice || '-'}</span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stop Loss</span>
              <span className="text-lg font-black text-rose-500">{trade.stopLoss || '-'}</span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Take Profit</span>
              <span className="text-lg font-black text-emerald-500">{trade.takeProfit || '-'}</span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Exit</span>
              <span className="text-lg font-black text-white [html:not(.dark)_&]:text-slate-900">{trade.exitPrice || '-'}</span>
            </div>
          </div>
          {(trade.fees || trade.swap) && (
            <div className="flex gap-6 px-5 sm:px-8 py-3 border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200/60 bg-black/40 [html:not(.dark)_&]:bg-slate-100/50 text-xs">
              {trade.fees && <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 font-bold uppercase tracking-widest">Fees: <strong className="text-white [html:not(.dark)_&]:text-slate-900 ml-1">${trade.fees}</strong></span>}
              {trade.swap && <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 font-bold uppercase tracking-widest">Swap: <strong className="text-white [html:not(.dark)_&]:text-slate-900 ml-1">${trade.swap}</strong></span>}
            </div>
          )}
          {trade.tradeManagement && (
            <div className="p-5 sm:px-8 border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200/60 bg-black/20 [html:not(.dark)_&]:bg-slate-100/50">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Trade Management</span>
              <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm leading-relaxed">{trade.tradeManagement}</p>
            </div>
          )}
        </section>

        {/* Reflection & Lessons */}
        <section className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50/50 rounded-none border border-gray-800/40 [html:not(.dark)_&]:border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.1)] [html:not(.dark)_&]:shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-800/50 [html:not(.dark)_&]:border-slate-200/60">
            <div className="flex items-center gap-2">
              <FiActivity className="text-violet-500" size={18} />
              <h2 className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest">Analysis & Reflection</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 [html:not(.dark)_&]:bg-white rounded-lg border border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan:</span>
                <span className={`text-sm font-bold ${trade.followedPlan ? 'text-emerald-500' : 'text-rose-500'}`}>{trade.followedPlan ? 'Followed' : 'Deviated'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 [html:not(.dark)_&]:bg-white rounded-lg border border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">In:</span>
                <span className="text-sm font-bold text-white [html:not(.dark)_&]:text-slate-900">{trade.entryEmotion || 'Neutral'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 [html:not(.dark)_&]:bg-white rounded-lg border border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Out:</span>
                <span className="text-sm font-bold text-white [html:not(.dark)_&]:text-slate-900">{trade.exitEmotion || 'Neutral'}</span>
              </div>
            </div>
          </div>

          <div className="text-gray-300 [html:not(.dark)_&]:text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap mb-8">
            {trade.noteReflection || trade.tradeDescription || (
              <>
                <p className="mb-4">No detailed reflection was provided for this specific setup. However, the execution aligned with the core structural parameters of the trading system, adhering strictly to predefined risk limits and position sizing rules.</p>
                <p className="mb-4">Market conditions presented a clear directional bias during the session window. Price action confirmed the higher timeframe narrative, allowing for a precise entry once the lower timeframe confluences aligned. Stop loss was placed safely behind structural invalidation points to protect capital from unexpected volatility.</p>
                <p>The position was managed dynamically as the trade progressed. Partial profits were secured at initial target zones, and the remaining risk was trailed to ensure a risk-free outcome while maximizing upside potential in trending conditions.</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trade.lessonsLearned && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <FiAward className="text-emerald-500" size={16} />
                  <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Lessons Learned</h4>
                </div>
                <p className="text-emerald-400/90 [html:not(.dark)_&]:text-emerald-700 text-sm italic">"{trade.lessonsLearned}"</p>
              </div>
            )}

            {trade.mistakesMade && (
              <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertCircle className="text-rose-500" size={16} />
                  <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Mistakes Made</h4>
                </div>
                <p className="text-rose-400/90 [html:not(.dark)_&]:text-rose-700 text-sm italic">"{trade.mistakesMade}"</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setFullScreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}
          >
            <FiX size={24} />
          </button>
          <img 
            src={fullScreenImage} 
            alt="Full Screen View" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default TradeView;
