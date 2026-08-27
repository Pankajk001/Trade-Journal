import React from 'react';
import { format } from 'date-fns';
import { FiImage, FiBookmark, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import InstrumentIcon from './InstrumentIcon';

const TradeCard = ({ trade, onClick }) => {
  const coverImage = trade.screenshotHTF || trade.screenshotBeforeEntry || trade.screenshotMTF || trade.screenshotLTF;
  
  return (
    <div 
      onClick={() => onClick(trade)}
      className="bg-[#1e1e1e] [html:not(.dark)_&]:bg-white rounded-none p-4 shadow-md [html:not(.dark)_&]:shadow-sm border border-gray-600/80 [html:not(.dark)_&]:border-transparent flex flex-col group hover:-translate-y-1.5 hover:shadow-xl [html:not(.dark)_&]:hover:shadow-md transition-all duration-300 cursor-pointer"
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
        <div className="flex items-center gap-2 mb-2.5">
          {trade.direction === 'Long' ? (
            <FiArrowUpRight className="text-emerald-500 flex-shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={18} strokeWidth={3} />
          ) : trade.direction === 'Short' ? (
            <FiArrowDownRight className="text-rose-500 flex-shrink-0 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" size={18} strokeWidth={3} />
          ) : null}
          <div className="mr-0.5">
            <InstrumentIcon pair={trade.pair} size="xsmall" />
          </div>
          <h3 className="text-base md:text-lg font-extrabold text-white [html:not(.dark)_&]:text-slate-900 leading-tight line-clamp-1 group-hover:text-violet-400 [html:not(.dark)_&]:group-hover:text-violet-600 transition-colors">
            {trade.pair || 'Unknown Instrument'}
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-gray-500 [html:not(.dark)_&]:text-slate-500 mb-6 flex items-center gap-2">
          <span>{trade.date ? format(new Date(trade.date), 'MMM dd, yyyy') : 'Unknown Date'}</span>
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
};

export default TradeCard;
