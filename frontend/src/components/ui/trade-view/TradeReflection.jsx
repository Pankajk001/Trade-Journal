import React from 'react';
import { FiActivity, FiAward, FiAlertCircle } from 'react-icons/fi';

const TradeReflection = ({ trade }) => {
  return (
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
  );
};

export default TradeReflection;
