import React from "react";
import { FiActivity, FiAward, FiAlertCircle } from "react-icons/fi";

const TradeReflection = ({ trade }) => {
  return (
    <section className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50/50 rounded-none border border-gray-800/40 [html:not(.dark)_&]:border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.1)] [html:not(.dark)_&]:shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-800/50 [html:not(.dark)_&]:border-slate-200/60">
        <div className="flex items-center gap-2">
          <FiActivity className="text-violet-500" size={18} />
          <h2 className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest">
            Analysis & Reflection
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 [html:not(.dark)_&]:bg-white rounded-lg border border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Plan:
            </span>
            <span
              className={`text-sm font-bold ${trade.followedPlan ? "text-emerald-500" : "text-rose-500"}`}
            >
              {trade.followedPlan ? "Followed" : "Deviated"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 [html:not(.dark)_&]:bg-white rounded-lg border border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              In:
            </span>
            <span className="text-sm font-bold text-white [html:not(.dark)_&]:text-slate-900">
              {trade.entryEmotion || "Not recorded"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 [html:not(.dark)_&]:bg-white rounded-lg border border-gray-800/50 [html:not(.dark)_&]:border-slate-200/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Out:
            </span>
            <span className="text-sm font-bold text-white [html:not(.dark)_&]:text-slate-900">
              {trade.exitEmotion || "Not recorded"}
            </span>
          </div>
        </div>
      </div>

      <div className="text-gray-300 [html:not(.dark)_&]:text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap mb-8">
        {trade.noteReflection ||
          trade.tradeDescription ||
          "No reflection recorded yet."}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trade.lessonsLearned && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-none">
            <div className="flex items-center gap-2 mb-2">
              <FiAward className="text-emerald-500" size={16} />
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                Lessons Learned
              </h4>
            </div>
            <p className="text-emerald-400/90 [html:not(.dark)_&]:text-emerald-700 text-sm italic">
              "{trade.lessonsLearned}"
            </p>
          </div>
        )}

        {trade.mistakesMade && (
          <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-none">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="text-rose-500" size={16} />
              <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                Mistakes Made
              </h4>
            </div>
            <p className="text-rose-400/90 [html:not(.dark)_&]:text-rose-700 text-sm italic">
              "{trade.mistakesMade}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TradeReflection;
