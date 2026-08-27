import React from 'react';
import { format } from 'date-fns';
import { FiTrendingUp, FiTrendingDown, FiClock } from 'react-icons/fi';
import Badge from '../Badge';
import InstrumentIcon from '../InstrumentIcon';

const TradeHeader = ({ trade }) => {
  return (
    <div className="flex flex-col items-start text-left flex-shrink-0 w-full lg:w-auto">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {trade.direction === 'Long' ? (
          <Badge color="green"><FiTrendingUp className="inline mr-1"/>Long</Badge>
        ) : trade.direction === 'Short' ? (
          <Badge color="red"><FiTrendingDown className="inline mr-1"/>Short</Badge>
        ) : null}
        {trade.strategyName && <Badge color="violet">{trade.strategyName}</Badge>}
      </div>
      
      {/* Title & Icon */}
      <div className="flex items-center gap-3 mb-4">
        <InstrumentIcon pair={trade.pair} size="medium" />
        <h1 className="text-3xl md:text-4xl font-black text-white [html:not(.dark)_&]:text-slate-900 tracking-tight">
          {trade.pair}
        </h1>
      </div>
      
      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm font-medium">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {trade.user?.name ? trade.user.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <span>By <strong className="text-white [html:not(.dark)_&]:text-slate-900">{trade.user?.name || 'Anonymous'}</strong></span>
        <span className="hidden sm:inline text-gray-700 [html:not(.dark)_&]:text-slate-300">•</span>
        <span>{trade.date ? format(new Date(trade.date), 'MMMM dd, yyyy') : 'Unknown Date'}</span>
        <span className="hidden sm:inline text-gray-700 [html:not(.dark)_&]:text-slate-300">•</span>
        <span className="flex items-center gap-1.5"><FiClock /> {trade.session || 'Any'} Session</span>
      </div>
    </div>
  );
};

export default TradeHeader;
