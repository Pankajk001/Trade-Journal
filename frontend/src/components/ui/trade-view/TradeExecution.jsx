import React from 'react';
import { FiCrosshair } from 'react-icons/fi';

const TradeExecution = ({ trade }) => {
  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return '-';
    const num = Number(price);
    return isNaN(num) ? price : num.toFixed(3);
  };

  return (
    <section className="bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-50/50 rounded-none border border-gray-800/40 [html:not(.dark)_&]:border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.1)] [html:not(.dark)_&]:shadow-sm overflow-hidden">
      <div className="bg-black/40 [html:not(.dark)_&]:bg-white/50 px-6 py-3 border-b border-gray-800/50 [html:not(.dark)_&]:border-slate-200/60 flex items-center gap-2">
         <FiCrosshair className="text-violet-500" size={18} />
         <h2 className="text-xs font-bold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-widest">Execution Details</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-800/50 [html:not(.dark)_&]:divide-slate-200/60">
        <div className="p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Entry</span>
          <span className="text-lg font-black text-white [html:not(.dark)_&]:text-slate-900">{formatPrice(trade.entryPrice)}</span>
        </div>
        <div className="p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stop Loss</span>
          <span className="text-lg font-black text-rose-500">{formatPrice(trade.stopLoss)}</span>
        </div>
        <div className="p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Take Profit</span>
          <span className="text-lg font-black text-emerald-500">{formatPrice(trade.takeProfit)}</span>
        </div>
        <div className="p-5 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Exit</span>
          <span className="text-lg font-black text-white [html:not(.dark)_&]:text-slate-900">{formatPrice(trade.exitPrice)}</span>
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
  );
};

export default TradeExecution;
