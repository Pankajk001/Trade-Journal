import React from 'react';
import InstrumentDropdown from './InstrumentDropdown';
import MinimalDropdown from './MinimalDropdown';
import { FiUploadCloud } from 'react-icons/fi';

const TradeContextSection = ({
  formData,
  setFormData,
  handleChange,
  handleAutoFillImage,
  isParsingImage,
  netPnlRef
}) => {
  return (
    <div className="xl:col-span-4 bg-[#1c1c1c] rounded-2xl border border-gray-800/80 p-6 shadow-lg [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900">Trade details</h2>
        <div className="relative">
          <input 
            type="file" 
            id="tradeScreenshot" 
            className="hidden" 
            accept="image/*" 
            onChange={handleAutoFillImage} 
            disabled={isParsingImage}
          />
          <label 
            htmlFor="tradeScreenshot" 
            className={`flex items-center justify-center p-2 rounded-lg bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 transition-colors cursor-pointer ${isParsingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Auto-fill from screenshot"
          >
            {isParsingImage ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FiUploadCloud className="w-5 h-5" />
            )}
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <div className={`flex items-center text-3xl font-bold bg-black border border-gray-800 rounded-xl px-4 py-3 focus-within:border-purple-500 transition-colors ${String(formData.netPnl || '').startsWith('-') ? 'text-red-500' : 'text-green-500'} [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200`}>
          <input 
            ref={netPnlRef}
            type="text" 
            name="netPnl" 
            value={formData.netPnl} 
            onChange={(e) => setFormData(prev => ({ ...prev, netPnl: e.target.value }))}
            onBlur={(e) => {
              let val = e.target.value.replace(/[^0-9.-]/g, '');
              if (!val || val === '-' || val === '.') {
                setFormData(prev => ({ ...prev, netPnl: '' }));
                return;
              }
              let num = Number(val);
              if (!isNaN(num)) {
                let formatted = num < 0 ? `-$${Math.abs(num).toFixed(2)}` : `+$${num.toFixed(2)}`;
                setFormData(prev => ({ ...prev, netPnl: formatted }));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                let val = e.target.value.replace(/[^0-9.-]/g, '');
                let current = Number(val) || 0;
                let next = e.key === 'ArrowUp' ? current + 1 : current - 1;
                let formatted = next < 0 ? `-$${Math.abs(next).toFixed(2)}` : `+$${next.toFixed(2)}`;
                setFormData(prev => ({ ...prev, netPnl: formatted }));
              }
            }}
            className={`bg-transparent outline-none w-full ${String(formData.netPnl || '').startsWith('-') ? 'placeholder-red-700/50' : 'placeholder-green-700/50'}`} 
            placeholder="+$0.00" 
          />
        </div>
        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-2">Net PNL</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <InstrumentDropdown value={formData.pair} onChange={handleChange} />
        </div>
        <div>
          <div className="relative">
            <MinimalDropdown 
              name="direction" 
              value={formData.direction} 
              onChange={handleChange} 
              options={[
                { label: '↑ Buy', value: 'Long' },
                { label: '↓ Sell', value: 'Short' }
              ]}
              variant="underline"
              triggerTextColor={formData.direction === 'Long' ? '!text-green-500' : '!text-red-500'}
            />
          </div>
          <p className="text-xs text-gray-500 uppercase mt-1">Direction</p>
        </div>
        <div>
          <input 
            type="number" 
            step="any" 
            name="lotSize" 
            value={formData.lotSize} 
            onChange={handleChange} 
            className="bg-transparent text-sm font-bold text-white [html:not(.dark)_&]:text-slate-900 outline-none w-full border-b border-transparent focus:border-gray-500 transition-colors pb-1 placeholder-gray-500" 
            placeholder="3.00" 
          />
          <p className="text-xs text-gray-500 uppercase mt-1">Lot Size</p>
        </div>
      </div>

      <div className="space-y-6 text-sm">
        {/* Context */}
        <div>
          <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 border-b-[0.5px] border-violet-500/30 pb-1">Context</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Session</span>
            <div className="relative w-28">
              <MinimalDropdown 
                name="session" 
                value={formData.session} 
                onChange={handleChange} 
                options={[
                  { label: 'London', value: 'London' },
                  { label: 'New York', value: 'New York' },
                  { label: 'Asia', value: 'Asia' },
                  { label: 'Sydney', value: 'Sydney' }
                ]}
                variant="box"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Duration</span>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="bg-black border border-gray-800 rounded-md px-2 py-1 text-right outline-none w-28 text-white focus:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-900 placeholder-gray-500" placeholder="1 hr 55 min" />
          </div>
        </div>

        {/* Execution */}
        <div>
          <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 border-b-[0.5px] border-violet-500/30 pb-1">Execution</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Entry / Exit Price</span>
            <div className="flex items-center gap-1">
              <input type="number" step="any" name="entryPrice" value={formData.entryPrice} onChange={handleChange} className="bg-black border border-gray-800 rounded-md px-2 py-1 text-right outline-none w-20 text-white focus:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-900 placeholder-gray-500" placeholder="Entry" />
              <span className="text-gray-600">/</span>
              <input type="number" step="any" name="exitPrice" value={formData.exitPrice} onChange={handleChange} className="bg-black border border-gray-800 rounded-md px-2 py-1 text-right outline-none w-20 text-white focus:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-900 placeholder-gray-500" placeholder="Exit" />
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Stop Loss</span>
            <input type="number" step="any" name="stopLoss" value={formData.stopLoss} onChange={handleChange} className="bg-black border border-gray-800 rounded-md px-2 py-1 text-right outline-none w-28 text-white focus:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-900 placeholder-gray-500" placeholder="0.0000" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Take Profit</span>
            <input type="number" step="any" name="takeProfit" value={formData.takeProfit} onChange={handleChange} className="bg-black border border-gray-800 rounded-md px-2 py-1 text-right outline-none w-28 text-white focus:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-900 placeholder-gray-500" placeholder="0.0000" />
          </div>
        </div>

        {/* Performance */}
        <div>
          <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 border-b-[0.5px] border-violet-500/30 pb-1">Performance</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Risk (R)</span>
            <div className="flex items-center justify-end w-28 bg-black border border-gray-800 rounded-md px-2 py-1 focus-within:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200">
              <input 
                type="number" 
                step="any" 
                min="0"
                name="riskPercentage" 
                value={formData.riskPercentage} 
                onChange={(e) => {
                  if (Number(e.target.value) < 0) return;
                  handleChange(e);
                }} 
                className="bg-transparent text-right outline-none w-full text-white [html:not(.dark)_&]:text-slate-900 placeholder-gray-500" 
                placeholder="1.00" 
              />
              <span className="text-gray-500 ml-0.5">R</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Return (R)</span>
            <div className="flex items-center justify-end w-28 bg-black border border-gray-800 rounded-md px-2 py-1 focus-within:border-purple-500 transition-colors [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200">
              <span className="text-green-500">{formData.rMultiple !== '' ? '+' : ''}</span>
              <input 
                type="number" 
                step="any" 
                min="0"
                name="rMultiple" 
                value={formData.rMultiple} 
                onChange={(e) => {
                  if (Number(e.target.value) < 0) return;
                  handleChange(e);
                }} 
                className="bg-transparent text-right outline-none w-full text-green-500 placeholder-green-500" 
                placeholder="1.33" 
              />
              <span className="text-green-500 ml-0.5">R</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeContextSection;
