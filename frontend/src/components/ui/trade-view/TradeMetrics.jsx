import React from 'react';
import Metric from '../Metric';

const TradeMetrics = ({ trade }) => {
  const netPnlNum = Number(String(trade.netPnl || '').replace(/[^0-9.-]/g, ''));
  const isWin = netPnlNum > 0 || String(trade.netPnl || '').includes('+') || trade.winLoss === 'Win';
  const isLoss = netPnlNum < 0 || String(trade.netPnl || '').includes('-') || trade.winLoss === 'Loss';
  
  return (
    <div className="flex flex-wrap items-center justify-start lg:justify-end gap-6 sm:gap-8">
      <Metric 
        label="Net PNL" 
        value={trade.netPnl || '$0.00'} 
        valueClass={isWin ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-gray-400 [html:not(.dark)_&]:text-slate-600'} 
      />
      <Metric label="R-Multiple" value={trade.rMultiple ? `${trade.rMultiple}R` : '-'} />
      <Metric label="Risk" value={trade.riskPercentage ? `${trade.riskPercentage}%` : '-'} />
      <div className="hidden sm:block">
        <Metric label="Lot Size" value={trade.lotSize || '-'} />
      </div>
      <div className="hidden sm:block">
        <Metric label="Duration" value={trade.duration || '-'} />
      </div>
    </div>
  );
};

export default TradeMetrics;
