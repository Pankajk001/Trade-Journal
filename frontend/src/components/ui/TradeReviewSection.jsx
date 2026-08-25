import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const TradeReviewSection = ({
  formData,
  handleChange,
  strategies,
  isChecklistOpen,
  setIsChecklistOpen,
  strategyPoints,
  handleConfluenceChange,
  emotionOptions,
  loading
}) => {
  return (
    <div className="bg-[#1c1c1c] rounded-2xl border border-gray-800/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] [html:not(.dark)_&]:shadow-[0_8px_30px_rgb(0,0,0,0.04)] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
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
                <div className="w-5 h-5 rounded border border-gray-600 bg-transparent flex items-center justify-center text-transparent peer-checked:bg-violet-500 peer-checked:border-violet-500 peer-checked:text-white transition-colors">
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
                          <div className="w-4 h-4 rounded border border-gray-600 bg-transparent flex items-center justify-center text-transparent peer-checked:bg-violet-500 peer-checked:border-violet-500 peer-checked:text-white transition-colors">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Trade Management" name="tradeManagement" value={formData.tradeManagement} onChange={handleChange} placeholder="e.g. Partials 1R/2R, SL to BE" />
          <FormInput label="Lessons Learned" name="lessonsLearned" value={formData.lessonsLearned} onChange={handleChange} placeholder="e.g. Wait for candle close" />
          <FormInput label="Mistakes" name="mistakesMade" value={formData.mistakesMade} onChange={handleChange} placeholder="e.g. Added to Position" />
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
      
    </div>
  );
};

export default TradeReviewSection;
