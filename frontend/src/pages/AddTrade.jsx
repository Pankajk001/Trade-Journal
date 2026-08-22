import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import ImageUploadBox from '../components/ui/ImageUploadBox';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';
import InstrumentDropdown from '../components/ui/InstrumentDropdown';
import MinimalDropdown from '../components/ui/MinimalDropdown';
import { FiChevronDown, FiUploadCloud, FiTrash2 } from 'react-icons/fi';

const AddTrade = () => {
  const [files, setFiles] = useState({
    screenshotHTF: null,
    screenshotMTF: null,
    screenshotLTF: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    screenshotHTF: null,
    screenshotMTF: null,
    screenshotLTF: null,
  });

  const [formData, setFormData] = useState({
    pair: 'EURUSD',
    direction: 'Long',
    lotSize: '',
    session: 'London',
    duration: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    riskPercentage: '',
    rMultiple: '',
    fees: '',
    swap: '',
    netPnl: '',
    followedPlan: false,
    intendedPlan: '',
    tradeManagement: '',
    entryEmotion: '',
    exitEmotion: '',
    noteReflection: '',
    entryConfluences: [],
  });

  // Strategy-related state
  const [strategies, setStrategies] = useState([]);
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  const netPnlRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement === netPnlRef.current) {
        e.preventDefault();
        setFormData(prev => {
          let val = (prev.netPnl || '').toString().replace(/[^0-9.-]/g, '');
          let current = Number(val) || 0;
          let step = e.shiftKey ? 10 : 1;
          let next = e.deltaY < 0 ? current + step : current - step;
          let formatted = next < 0 ? `-$${Math.abs(next).toFixed(2)}` : `+$${next.toFixed(2)}`;
          return { ...prev, netPnl: formatted };
        });
      }
    };

    const el = netPnlRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Fetch all strategies on mount
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const { data } = await axios.get('/api/strategies');
        setStrategies(data);
      } catch (error) {
        console.error('Error fetching strategies', error);
      }
    };
    fetchStrategies();
  }, []);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
      setPreviewUrls((prev) => ({ ...prev, [name]: URL.createObjectURL(selectedFiles[0]) }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const emotionOptions = [
    { label: 'Select emotion...', value: '' },
    { label: '😐 Calm / Neutral', value: 'Calm' },
    { label: '😌 Patient', value: 'Patient' },
    { label: '😎 Confident', value: 'Confident' },
    { label: '🤑 Greedy', value: 'Greedy' },
    { label: '🏃 FOMO', value: 'FOMO' },
    { label: '😰 Anxious / Nervous', value: 'Anxious' },
    { label: '😡 Frustrated / Angry', value: 'Frustrated' },
    { label: '🔥 Revenge Trading', value: 'Revenge' },
    { label: '🤠 Overconfident', value: 'Overconfident' },
    { label: '🥱 Bored', value: 'Bored' },
    { label: '😃 Happy / Satisfied', value: 'Happy' },
    { label: '😔 Disappointed', value: 'Disappointed' },
  ];

  const handleConfluenceChange = (point) => {
    setFormData(prev => {
      const current = prev.entryConfluences || [];
      if (current.includes(point)) {
        return { ...prev, entryConfluences: current.filter(c => c !== point) };
      } else {
        return { ...prev, entryConfluences: [...current, point] };
      }
    });
  };

  const selectedStrategy = strategies.find(s => s._id === formData.intendedPlan);
  const strategyPoints = selectedStrategy?.entryCriteria ? selectedStrategy.entryCriteria.split('\n').filter(p => p.trim() !== '') : [];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 text-gray-200 [html:not(.dark)_&]:text-slate-800">
      <PageHeader title="Log New Trade" backLink="/dashboard/journal" />
      
      <form className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Trade Details (Col Span 4) */}
        <div className="xl:col-span-4 bg-[#1c1c1c] rounded-2xl border border-gray-800/80 p-6 shadow-lg [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-white [html:not(.dark)_&]:text-slate-900">Trade details</h2>
          
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
              <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 border-b-[0.5px] border-orange-500/30 pb-1">Context</p>
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
              <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 border-b-[0.5px] border-orange-500/30 pb-1">Execution</p>
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
              <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase mb-3 border-b-[0.5px] border-orange-500/30 pb-1">Performance</p>
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

        {/* MIDDLE COLUMN: Charts & Review (Col Span 8) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Charts Card */}
          <div className="bg-[#1c1c1c] rounded-2xl border border-gray-800/80 p-6 shadow-lg [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
            <h2 className="text-xl font-bold mb-1 text-white [html:not(.dark)_&]:text-slate-900">Charts</h2>
            <p className="text-gray-500 text-sm mb-6">Add screenshots to review context + execution:</p>
            
            <div className="grid grid-cols-3 gap-4">
              <ImageUploadBox label="MTF" name="screenshotMTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotMTF} small />
              <ImageUploadBox label="HTF" name="screenshotHTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotHTF} small />
              <ImageUploadBox label="LTF" name="screenshotLTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotLTF} small />
            </div>
          </div>

          {/* Review & Reflection Card */}
          <div className="bg-[#1c1c1c] rounded-2xl border border-gray-800/80 p-6 shadow-lg [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-white [html:not(.dark)_&]:text-slate-900">Review & Reflection</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-500 text-xs font-semibold uppercase mb-2">Plan</label>
                  <div className="flex items-center gap-3 bg-[#060606] px-4 py-3 rounded-xl border border-gray-700/50 [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200">
                    <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                      <input 
                        type="checkbox" 
                        id="followedPlanMain"
                        name="followedPlan" 
                        checked={formData.followedPlan}
                        onChange={handleChange}
                        className="peer absolute w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="w-5 h-5 rounded border border-gray-600 bg-transparent flex items-center justify-center text-transparent peer-checked:bg-orange-500 peer-checked:border-orange-500 peer-checked:text-white transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <label 
                      htmlFor="followedPlanMain" 
                      className={`text-sm font-medium cursor-pointer flex-1 transition-colors ${formData.followedPlan ? 'text-white [html:not(.dark)_&]:text-slate-900' : 'text-gray-500 [html:not(.dark)_&]:text-slate-400'}`}
                    >
                      I followed my trade plan
                    </label>
                  </div>
                </div>
                <div>
                  <FormSelect 
                    label="Which plan did you intend to follow?" 
                    name="intendedPlan" 
                    value={formData.intendedPlan} 
                    onChange={handleChange} 
                    options={[
                      { label: 'Select a strategy...', value: '' },
                      ...strategies.map(s => ({ label: s.name, value: s._id }))
                    ]} 
                  />
                </div>
              </div>

              <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${strategyPoints.length > 0 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 !mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="group pt-2 pb-2">
                    <div 
                      className="flex justify-between items-center text-gray-500 text-xs font-semibold uppercase mb-3 cursor-pointer select-none"
                      onClick={() => setIsChecklistOpen(!isChecklistOpen)}
                    >
                      <span>Strategy Checklist</span>
                      <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${isChecklistOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isChecklistOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="bg-[#060606] rounded-xl border border-gray-700/50 p-4 space-y-3 [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200">
                          {strategyPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="relative flex items-center justify-center w-4 h-4 mt-0.5 flex-shrink-0">
                                <input 
                                  type="checkbox" 
                                  id={`point-${idx}`}
                                  checked={(formData.entryConfluences || []).includes(point)}
                                  onChange={() => handleConfluenceChange(point)}
                                  className="peer absolute w-full h-full opacity-0 cursor-pointer z-10" 
                                />
                                <div className="w-4 h-4 rounded border border-gray-600 bg-transparent flex items-center justify-center text-transparent peer-checked:bg-orange-500 peer-checked:border-orange-500 peer-checked:text-white transition-colors">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <label htmlFor={`point-${idx}`} className="text-sm font-medium text-gray-300 [html:not(.dark)_&]:text-slate-700 cursor-pointer leading-tight">
                                {point}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className="grid grid-cols-2 gap-6">
                <FormInput label="Trade Management" name="tradeManagement" value={formData.tradeManagement} onChange={handleChange} placeholder="e.g. Partials 1R/2R, SL to BE" />
                <FormInput label="Mistakes" name="mistakesMade" placeholder="e.g. Added to Position" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormSelect 
                  label="Entry emotion" name="entryEmotion" value={formData.entryEmotion} onChange={handleChange} 
                  options={emotionOptions} 
                />
                <FormSelect 
                  label="Exit emotion" name="exitEmotion" value={formData.exitEmotion} onChange={handleChange} 
                  options={emotionOptions} 
                />
              </div>

              <div>
                <label className="block text-gray-500 text-xs font-semibold uppercase mb-2">Note Reflection</label>
                <textarea 
                  name="noteReflection"
                  value={formData.noteReflection}
                  onChange={handleChange}
                  className="w-full h-24 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-colors bg-black border border-gray-800 text-gray-200 placeholder-gray-500 [html:not(.dark)_&]:bg-purple-50/50 [html:not(.dark)_&]:border-purple-100 [html:not(.dark)_&]:text-slate-700 [html:not(.dark)_&]:placeholder-slate-400"
                  placeholder="Add a note or voice reflection..."
                ></textarea>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="pt-8 mt-8 border-t border-gray-800/80 [html:not(.dark)_&]:border-slate-200 flex justify-end gap-3">
              <button type="button" className="w-40 py-3 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:bg-gray-800 hover:text-white transition-colors [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:bg-slate-50 text-sm flex items-center justify-center">
                Go to Journal
              </button>
              <button type="submit" className="w-40 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors text-sm flex items-center justify-center">
                Save Trade
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AddTrade;
