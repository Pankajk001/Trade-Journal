import React from 'react';
import TradeHeader from './trade-view/TradeHeader';
import TradeMetrics from './trade-view/TradeMetrics';
import TradeImages from './trade-view/TradeImages';
import TradeSetupContext from './trade-view/TradeSetupContext';
import TradeExecution from './trade-view/TradeExecution';
import TradeReflection from './trade-view/TradeReflection';

const TradeView = ({ trade }) => {
  if (!trade) return null;

  return (
    <div className="w-full max-w-5xl mx-auto text-left font-sans pb-16 bg-[#202020] [html:not(.dark)_&]:bg-[#fcfcfd] rounded-none overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8 pb-8 pt-12 px-6 sm:px-8 lg:px-12">
        <TradeHeader trade={trade} />
        
        <div className="flex bg-[#0a0a0a] [html:not(.dark)_&]:bg-white border border-gray-800/80 [html:not(.dark)_&]:border-slate-200/80 px-4 sm:px-6 py-3 sm:py-4 shadow-lg self-start md:self-start overflow-x-auto custom-scrollbar max-w-full rounded-xl">
          <TradeMetrics trade={trade} />
        </div>
      </div>
      
      <TradeImages trade={trade} />
      
      <div className="px-6 sm:px-12 max-w-4xl mx-auto space-y-8">
        <TradeSetupContext trade={trade} />
        <TradeExecution trade={trade} />
        <TradeReflection trade={trade} />
      </div>
    </div>
  );
};

export default TradeView;
