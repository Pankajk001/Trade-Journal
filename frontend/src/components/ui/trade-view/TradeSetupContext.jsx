import React from 'react';
import { FiTarget, FiList, FiCheckCircle } from 'react-icons/fi';

const TradeSetupContext = ({ trade }) => {
  return (
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
  );
};

export default TradeSetupContext;
