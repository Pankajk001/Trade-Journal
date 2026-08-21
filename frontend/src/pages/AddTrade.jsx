import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import ImageUploadBox from '../components/ui/ImageUploadBox';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';

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
    followedPlan: false,
    intendedPlan: '',
    pair: '',
    direction: 'Long',
    winLoss: 'Win',
    profitLoss: '',
    tradeManagement: '',
    entryEmotion: '',
    exitEmotion: '',
  });

  // Strategy-related state
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [entryCriteriaChecklist, setEntryCriteriaChecklist] = useState([]);

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

  // When a strategy is picked, load its entry criteria as a checklist
  useEffect(() => {
    if (formData.intendedPlan) {
      const found = strategies.find(s => s._id === formData.intendedPlan);
      if (found && found.entryCriteria) {
        const lines = found.entryCriteria.split('\n').filter(l => l.trim() !== '');
        setEntryCriteriaChecklist(lines.map(line => ({ label: line.trim(), checked: false })));
        setSelectedStrategy(found);
      } else {
        setEntryCriteriaChecklist([]);
        setSelectedStrategy(null);
      }
    } else {
      setEntryCriteriaChecklist([]);
      setSelectedStrategy(null);
    }
  }, [formData.intendedPlan, strategies]);

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

  const handleCriteriaToggle = (index) => {
    setEntryCriteriaChecklist(prev =>
      prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
    );
  };

  const checkedCount = entryCriteriaChecklist.filter(c => c.checked).length;
  const totalCount = entryCriteriaChecklist.length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Log New Trade" backLink="/dashboard/journal" />
      
      <form className="bg-[#121212] rounded-2xl border border-gray-800 p-8 shadow-lg">
        {/* Charts Section */}
        <div className="mb-8 border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-gray-100 tracking-wide">Charts</h2>
          <p className="text-gray-400 text-sm mt-2">Add screenshots to review context + execution:</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImageUploadBox label="HTF" name="screenshotHTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotHTF} />
          <ImageUploadBox label="MTF" name="screenshotMTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotMTF} />
          <ImageUploadBox label="LTF" name="screenshotLTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotLTF} />
        </div>

        {/* Review & Reflection Section */}
        <div className="mt-12 mb-8 border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-gray-100 tracking-wide">Review & Reflection</h2>
        </div>

        <div className="space-y-8">
          {/* Row 1: Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">Plan</label>
              <div className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                <input 
                  type="checkbox" 
                  id="followedPlan"
                  name="followedPlan" 
                  checked={formData.followedPlan}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer" 
                />
                <label htmlFor="followedPlan" className="text-gray-300 font-medium cursor-pointer flex-1">I followed my trade plan</label>
              </div>
            </div>
            <div>
              <FormSelect 
                label="Which strategy did you follow?" 
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

          {/* Entry Criteria Checklist — appears only when a strategy is selected */}
          {selectedStrategy && entryCriteriaChecklist.length > 0 && (
            <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-gray-100">Entry Criteria Checklist</h3>
                  <p className="text-xs text-gray-500 mt-0.5">From strategy: <span className="text-orange-400">{selectedStrategy.name}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-gray-300">
                    <span className={checkedCount === totalCount ? 'text-green-400' : 'text-orange-400'}>{checkedCount}</span>
                    <span className="text-gray-600">/{totalCount}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
                        background: checkedCount === totalCount ? '#4ade80' : '#f97316'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {entryCriteriaChecklist.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCriteriaToggle(index)}
                    className={`flex items-center gap-4 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      item.checked 
                        ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/15' 
                        : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${
                      item.checked ? 'bg-green-500 border-green-500' : 'border-gray-600'
                    }`}>
                      {item.checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-all duration-200 ${
                      item.checked ? 'text-green-300 line-through decoration-green-500/50' : 'text-gray-300'
                    }`}>
                      {index + 1}. {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Important Trade Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormInput label="Pair" name="pair" value={formData.pair} onChange={handleChange} placeholder="e.g. EURUSD" />
            <FormSelect 
              label="Direction" name="direction" value={formData.direction} onChange={handleChange} 
              options={[{label: 'Long', value: 'Long'}, {label: 'Short', value: 'Short'}]} 
            />
            <FormSelect 
              label="Win/Loss" name="winLoss" value={formData.winLoss} onChange={handleChange} 
              options={[{label: 'Win', value: 'Win'}, {label: 'Loss', value: 'Loss'}, {label: 'Breakeven', value: 'Breakeven'}]} 
            />
            <FormInput type="number" step="any" label="Profit/Loss ($)" name="profitLoss" value={formData.profitLoss} onChange={handleChange} placeholder="e.g. 150.50" />
          </div>

          {/* Row 3: Trade Management */}
          <div>
            <FormInput 
              label="Trade Management" 
              name="tradeManagement" 
              value={formData.tradeManagement} 
              onChange={handleChange} 
              placeholder="e.g. Partial at 1R, move SL to BE after 1R, set and forget etc." 
            />
          </div>

          {/* Row 4: Emotions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput 
              type="textarea" 
              label="Entry Emotion" 
              name="entryEmotion" 
              value={formData.entryEmotion} 
              onChange={handleChange} 
              placeholder="How did you feel when entering this trade?" 
            />
            <FormInput 
              type="textarea" 
              label="Exit Emotion" 
              name="exitEmotion" 
              value={formData.exitEmotion} 
              onChange={handleChange} 
              placeholder="How did you feel when exiting this trade?" 
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTrade;
