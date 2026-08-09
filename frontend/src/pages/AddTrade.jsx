import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TradeContext } from '../context/TradeContext';
import PageHeader from '../components/ui/PageHeader';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';

const AddTrade = () => {
  const { createTrade } = useContext(TradeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    tradeNumber: '',
    date: '',
    time: '',
    pair: '',
    market: 'Forex',
    direction: 'Long',
    buySell: 'Buy',
    session: 'London',
    setupName: '',
    strategyName: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    riskPercentage: '',
    lotSize: '',
    riskRewardRatio: '',
    exitPrice: '',
    profitLoss: '',
    rMultiple: '',
    winLoss: 'Win',
    emotionsBeforeEntry: '',
    confidenceLevel: '5',
    tradeDescription: '',
    mistakesMade: '',
    lessonsLearned: '',
    tags: '',
    tradeStatus: 'Closed',
    tradingViewLink: '',
    isPublic: false,
  });

  const [files, setFiles] = useState({
    screenshotBeforeEntry: null,
    screenshotDuringTrade: null,
    screenshotAfterExit: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'tags') {
          const tagsArray = formData[key].split(',').map(tag => tag.trim());
          tagsArray.forEach(tag => data.append('tags[]', tag));
        } else {
          data.append(key, formData[key]);
        }
      });
      
      if (files.screenshotBeforeEntry) data.append('screenshotBeforeEntry', files.screenshotBeforeEntry);
      if (files.screenshotDuringTrade) data.append('screenshotDuringTrade', files.screenshotDuringTrade);
      if (files.screenshotAfterExit) data.append('screenshotAfterExit', files.screenshotAfterExit);

      await createTrade(data);
      navigate('/dashboard/journal');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating trade');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: '1. Basic Info' },
    { id: 'setup', label: '2. Setup & Pricing' },
    { id: 'results', label: '3. Results' },
    { id: 'psychology', label: '4. Psychology' },
    { id: 'media', label: '5. Media & Links' }
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Log New Trade" backLink="/dashboard/journal" />
      {error && <div className="bg-gray-800 text-red-500 p-4 rounded-lg">{error}</div>}
      
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto bg-gray-800/50 p-2 rounded-2xl border border-gray-700/50 shadow-inner space-x-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-black/20' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit} 
        className="bg-gray-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-gray-700/50 overflow-hidden min-h-[500px] flex flex-col"
      >
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            {/* Tab Content: Basic Info */}
            {activeTab === 'basic' && (
              <motion.div 
                key="basic"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Trade Number" name="tradeNumber" value={formData.tradeNumber} onChange={handleChange} required />
                  <FormInput type="date" label="Date" name="date" value={formData.date} onChange={handleChange} required />
                  <FormInput type="time" label="Time (HH:MM)" name="time" value={formData.time} onChange={handleChange} required />
                  <FormInput label="Pair" name="pair" placeholder="e.g. EURUSD" value={formData.pair} onChange={handleChange} required />
                  <FormInput label="Market" name="market" value={formData.market} onChange={handleChange} required />
                  <FormSelect 
                    label="Direction" name="direction" value={formData.direction} onChange={handleChange} required 
                    options={[{label: 'Long', value: 'Long'}, {label: 'Short', value: 'Short'}]} 
                  />
                  <FormSelect 
                    label="Buy/Sell" name="buySell" value={formData.buySell} onChange={handleChange} required 
                    options={[{label: 'Buy', value: 'Buy'}, {label: 'Sell', value: 'Sell'}]} 
                  />
                  <FormSelect 
                    label="Session" name="session" value={formData.session} onChange={handleChange} required 
                    options={[
                      {label: 'London', value: 'London'}, {label: 'New York', value: 'New York'},
                      {label: 'Asian', value: 'Asian'}, {label: 'Sydney', value: 'Sydney'}, {label: 'Other', value: 'Other'}
                    ]} 
                  />
                </div>
              </motion.div>
            )}

            {/* Tab Content: Setup & Pricing */}
            {activeTab === 'setup' && (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">Setup & Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Setup Name" name="setupName" value={formData.setupName} onChange={handleChange} required />
                  <FormInput label="Strategy Name" name="strategyName" value={formData.strategyName} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Entry Price" name="entryPrice" value={formData.entryPrice} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Stop Loss" name="stopLoss" value={formData.stopLoss} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Take Profit" name="takeProfit" value={formData.takeProfit} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Risk Percentage (%)" name="riskPercentage" value={formData.riskPercentage} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Lot Size" name="lotSize" value={formData.lotSize} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Exit Price" name="exitPrice" value={formData.exitPrice} onChange={handleChange} required />
                </div>
              </motion.div>
            )}

            {/* Tab Content: Results */}
            {activeTab === 'results' && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">Trade Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput type="number" step="any" label="Risk Reward Ratio" name="riskRewardRatio" value={formData.riskRewardRatio} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="Profit/Loss ($)" name="profitLoss" value={formData.profitLoss} onChange={handleChange} required />
                  <FormInput type="number" step="any" label="R Multiple" name="rMultiple" value={formData.rMultiple} onChange={handleChange} required />
                  <FormSelect 
                    label="Win/Loss" name="winLoss" value={formData.winLoss} onChange={handleChange} required 
                    options={[{label: 'Win', value: 'Win'}, {label: 'Loss', value: 'Loss'}, {label: 'Breakeven', value: 'Breakeven'}]} 
                  />
                </div>
              </motion.div>
            )}

            {/* Tab Content: Psychology & Review */}
            {activeTab === 'psychology' && (
              <motion.div 
                key="psychology"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">Psychology & Review</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <FormInput type="textarea" label="Trade Description" name="tradeDescription" value={formData.tradeDescription} onChange={handleChange} required />
                  </div>
                  <div className="col-span-full">
                    <FormInput label="Emotions Before Entry" name="emotionsBeforeEntry" value={formData.emotionsBeforeEntry} onChange={handleChange} required />
                  </div>
                  <FormInput type="number" min="1" max="10" label="Confidence Level (1-10)" name="confidenceLevel" value={formData.confidenceLevel} onChange={handleChange} required />
                  <div className="col-span-full">
                    <FormInput label="Mistakes Made" name="mistakesMade" value={formData.mistakesMade} onChange={handleChange} required />
                  </div>
                  <div className="col-span-full">
                    <FormInput label="Lessons Learned" name="lessonsLearned" value={formData.lessonsLearned} onChange={handleChange} required />
                  </div>
                  <div className="col-span-full">
                    <FormInput label="Tags (comma separated)" name="tags" placeholder="e.g. breakout, fomo" value={formData.tags} onChange={handleChange} required />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Tab Content: Media & Links */}
            {activeTab === 'media' && (
              <motion.div 
                key="media"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">Media & Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <FormInput type="url" label="TradingView Link" name="tradingViewLink" value={formData.tradingViewLink} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1 font-medium">Screenshot Before Entry</label>
                    <input type="file" name="screenshotBeforeEntry" onChange={handleFileChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-orange-400 hover:file:bg-gray-700 transition-all cursor-pointer" accept="image/*" required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1 font-medium">Screenshot During Trade</label>
                    <input type="file" name="screenshotDuringTrade" onChange={handleFileChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-orange-400 hover:file:bg-gray-700 transition-all cursor-pointer" accept="image/*" required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1 font-medium">Screenshot After Exit</label>
                    <input type="file" name="screenshotAfterExit" onChange={handleFileChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-orange-400 hover:file:bg-gray-700 transition-all cursor-pointer" accept="image/*" required />
                  </div>
                  
                  <div className="col-span-full flex items-center gap-3 mt-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <input type="checkbox" name="isPublic" id="isPublic" checked={formData.isPublic} onChange={handleChange} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-orange-600 focus:ring-orange-500 focus:ring-offset-gray-900" />
                    <label htmlFor="isPublic" className="text-gray-300 font-medium">Make this trade public (visible in the global gallery)</label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Submit Button & Nav */}
        <div className="bg-gray-800/50 p-6 border-t border-gray-700/50 flex justify-between items-center mt-auto">
          <div className="flex gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors hover:scale-105 active:scale-95"
              >
                Previous
              </button>
            )}
          </div>
          
          {activeTab === 'media' ? (
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Submit Full Trade'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Next Step
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default AddTrade;
