import { format } from 'date-fns';
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiImage } from 'react-icons/fi';

const DataBlock = ({ label, value, valueClass = "text-white [html:not(.dark)_&]:text-slate-900" }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold text-gray-500 [html:not(.dark)_&]:text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-sm font-semibold ${valueClass}`}>{value || '-'}</span>
  </div>
);

const Badge = ({ children, color = "violet" }) => {
  const colors = {
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    red: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20 [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:border-slate-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${colors[color]} uppercase tracking-wider`}>
      {children}
    </span>
  );
};

const ReadOnlyImage = ({ label, src }) => (
  <div className="flex flex-col group">
    <div className="bg-[#121212] [html:not(.dark)_&]:bg-slate-50 border border-gray-800 [html:not(.dark)_&]:border-slate-200 rounded-2xl p-1 aspect-video overflow-hidden relative shadow-inner mb-3 transition-all duration-300 group-hover:border-violet-500/30 group-hover:shadow-violet-500/10 cursor-pointer">
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 [html:not(.dark)_&]:text-slate-400 rounded-xl">
          <FiImage size={24} className="mb-2 opacity-30" />
          <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">No Image</span>
        </div>
      )}
    </div>
    <span className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest text-center">{label}</span>
  </div>
);

const TradeView = ({ trade }) => {
  if (!trade) return null;

  const htfImg = trade.screenshotHTF || trade.screenshotBeforeEntry;
  const mtfImg = trade.screenshotMTF || trade.screenshotDuringTrade;
  const ltfImg = trade.screenshotLTF || trade.screenshotAfterExit;

  const netPnlNum = Number(String(trade.netPnl || '').replace(/[^0-9.-]/g, ''));
  const isWin = netPnlNum > 0 || String(trade.netPnl || '').includes('+');
  const isLoss = netPnlNum < 0 || String(trade.netPnl || '').includes('-');

  return (
    <div className="w-full text-left font-sans pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-800/50 [html:not(.dark)_&]:border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-4xl font-black text-white [html:not(.dark)_&]:text-slate-900 tracking-tight">
              Trade Report
            </h2>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1"></div>
          </div>
          <p className="text-sm font-semibold text-gray-500 [html:not(.dark)_&]:text-slate-500">
            {trade.date ? format(new Date(trade.date), 'MMMM dd, yyyy') : 'Unknown Date'}
          </p>
        </div>
        <div className="text-left sm:text-right bg-[#1c1c1c] [html:not(.dark)_&]:bg-slate-50 px-6 py-4 rounded-2xl border border-gray-800/50 [html:not(.dark)_&]:border-slate-200">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Net PNL</p>
          <div className={`text-4xl font-black tracking-tighter leading-none ${isWin ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-gray-400 [html:not(.dark)_&]:text-slate-600'}`}>
            {trade.netPnl || '$0.00'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Overview (Col Span 4) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#1c1c1c] rounded-3xl border border-gray-800/60 p-7 shadow-xl [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-200/50 hover:border-gray-700 [html:not(.dark)_&]:hover:border-slate-300 transition-colors">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/60 [html:not(.dark)_&]:border-slate-100 pb-3 mb-6 flex items-center gap-2">
              Overview
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-7">
              <DataBlock label="Instrument" value={trade.pair} />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Direction</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {trade.direction === 'Long' ? <Badge color="green">Long</Badge> : trade.direction === 'Short' ? <Badge color="red">Short</Badge> : <Badge color="gray">-</Badge>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-7">
              <DataBlock label="Lot Size" value={trade.lotSize} />
              <DataBlock label="Session" value={trade.session} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <DataBlock label="Risk" value={trade.riskPercentage ? `${trade.riskPercentage}%` : '-'} />
              <DataBlock label="Return (R)" value={trade.rMultiple ? `${trade.rMultiple}R` : '-'} valueClass={Number(trade.rMultiple) > 0 ? "text-emerald-500" : Number(trade.rMultiple) < 0 ? "text-rose-500" : "text-white [html:not(.dark)_&]:text-slate-900"} />
            </div>
          </div>

          <div className="bg-[#1c1c1c] rounded-3xl border border-gray-800/60 p-7 shadow-xl [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-200/50 hover:border-gray-700 [html:not(.dark)_&]:hover:border-slate-300 transition-colors">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/60 [html:not(.dark)_&]:border-slate-100 pb-3 mb-6">
              Execution
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-7">
              <DataBlock label="Entry Price" value={trade.entryPrice} />
              <DataBlock label="Exit Price" value={trade.exitPrice} />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-7">
              <DataBlock label="Stop Loss" value={trade.stopLoss} />
              <DataBlock label="Take Profit" value={trade.takeProfit} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <DataBlock label="Duration" value={trade.duration} />
              <DataBlock label="Fees / Swap" value={`${trade.fees || '0'} / ${trade.swap || '0'}`} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Context & Reflection (Col Span 8) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Charts Card */}
          <div className="bg-[#1c1c1c] rounded-3xl border border-gray-800/60 p-7 shadow-xl [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-200/50 hover:border-violet-500/30 transition-colors">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/60 [html:not(.dark)_&]:border-slate-100 pb-3 mb-6">
              Technical Context
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReadOnlyImage label="MTF Overview" src={mtfImg} />
              <ReadOnlyImage label="HTF Context" src={htfImg} />
              <ReadOnlyImage label="LTF Entry" src={ltfImg} />
            </div>
          </div>

          {/* Reflection Card */}
          <div className="bg-[#1c1c1c] rounded-3xl border border-gray-800/60 p-7 shadow-xl [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-200/50 hover:border-violet-500/30 transition-colors">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/60 [html:not(.dark)_&]:border-slate-100 pb-3 mb-8">
              Analysis & Reflection
            </h3>
            
            <div className="space-y-8">
              {/* Plan & Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex flex-col gap-1.5 mb-6">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan Adherence</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      {trade.followedPlan ? (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          <FiCheckCircle size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Followed Plan</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                          <FiXCircle size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Deviated</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <DataBlock label="Intended Strategy" value={trade.strategyName || trade.intendedPlan || 'No strategy assigned'} valueClass="text-violet-400 font-bold [html:not(.dark)_&]:text-violet-600" />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Confluences Met</span>
                  {Array.isArray(trade.entryConfluences) && trade.entryConfluences.length > 0 ? (
                    <ul className="space-y-3">
                      {trade.entryConfluences.map((c, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300 [html:not(.dark)_&]:text-slate-700 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0"></div>
                          <span className="leading-tight">{c}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-gray-500 italic bg-[#121212] [html:not(.dark)_&]:bg-slate-50 px-3 py-2 rounded-lg border border-gray-800/40 [html:not(.dark)_&]:border-slate-200">No confluences recorded.</span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800/40 [html:not(.dark)_&]:border-slate-100"></div>

              {/* Psychology & Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <DataBlock label="Trade Management" value={trade.tradeManagement} />
                  <DataBlock label="Mistakes Made" value={trade.mistakesMade} valueClass={trade.mistakesMade ? "text-rose-400 [html:not(.dark)_&]:text-rose-600" : "text-gray-400"} />
                </div>
                <div className="space-y-6">
                  <DataBlock label="Entry Emotion" value={trade.entryEmotion} />
                  <DataBlock label="Exit Emotion" value={trade.exitEmotion} />
                </div>
              </div>

              <div className="border-t border-gray-800/40 [html:not(.dark)_&]:border-slate-100"></div>

              {/* Notes */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">Journal Notes</span>
                <div className="bg-[#121212] [html:not(.dark)_&]:bg-slate-50 border border-gray-800/60 [html:not(.dark)_&]:border-slate-200 rounded-2xl p-5 shadow-inner">
                  <p className="text-sm text-gray-300 [html:not(.dark)_&]:text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {trade.noteReflection || trade.lessonsLearned || trade.tradeDescription || 'No detailed notes provided for this trade.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TradeView;
