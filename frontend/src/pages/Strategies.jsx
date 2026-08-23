import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import strategyService from '../services/strategyService';
import PageHeader from '../components/ui/PageHeader';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';
import NumberedListInput from '../components/ui/NumberedListInput';

const Strategies = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    chartingProcess: '',
    entryCriteria: '',
    status: 'Testing'
  });

  const fetchStrategies = async () => {
    try {
      const data = await strategyService.getStrategies();
      setStrategies(data);
    } catch (error) {
      console.error('Error fetching strategies', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await strategyService.createStrategy(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', chartingProcess: '', entryCriteria: '', status: 'Testing' });
      fetchStrategies(); // Refresh list
    } catch (error) {
      console.error('Error creating strategy', error);
    }
  };

  const deleteStrategy = async (id) => {
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      try {
        await strategyService.deleteStrategy(id);
        fetchStrategies();
      } catch (error) {
        console.error('Error deleting strategy', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Strategy Library"
        buttonText="+ Add Strategy"
        buttonAction={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading Library...</div>
      ) : strategies.length === 0 ? (
        <div className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-center py-10 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm rounded-xl shadow-2xl shadow-black/60 border border-transparent">
          Your library is empty. Click "+ Add Strategy" to start logging your strategies.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <div
              key={strategy._id}
              onClick={() => setSelectedStrategy(strategy)}
              className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 rounded-xl shadow-2xl shadow-black/60 border border-transparent p-6 flex flex-col h-full relative group shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteStrategy(strategy._id);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>

              <div className="flex justify-between items-start mb-4 pr-6">
                <div>
                  <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900">{strategy.name}</h3>
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mt-1">{strategy.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded border ${strategy.status === 'Active' ? 'bg-[#1c1c1c] [html:not(.dark)_&]:bg-green-50 text-green-400 [html:not(.dark)_&]:text-green-600 border-green-500/20 [html:not(.dark)_&]:border-green-200' :
                    strategy.status === 'Testing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                  {strategy.status}
                </span>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-700/50 [html:not(.dark)_&]:border-slate-200 pt-4">
                <div className="text-center">
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-xs uppercase mb-1">Trades</p>
                  <p className="text-white [html:not(.dark)_&]:text-slate-900 font-bold">{strategy.stats.totalTrades}</p>
                </div>
                <div className="text-center border-l border-r border-gray-700 [html:not(.dark)_&]:border-slate-200">
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-xs uppercase mb-1">Win Rate</p>
                  <p className={`font-bold ${strategy.stats.winRate >= 50 ? 'text-green-400 [html:not(.dark)_&]:text-green-600' : 'text-yellow-400 [html:not(.dark)_&]:text-yellow-600'}`}>
                    {strategy.stats.winRate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-xs uppercase mb-1">Avg RR</p>
                  <p className="text-violet-400 [html:not(.dark)_&]:text-violet-600 font-bold">{strategy.stats.averageRR}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Strategy Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700/50 [html:not(.dark)_&]:border-slate-200 bg-[#1c1c1c]/50 [html:not(.dark)_&]:bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 [html:not(.dark)_&]:from-slate-900 [html:not(.dark)_&]:to-slate-700">Add New Strategy</h2>
                  <p className="text-sm text-gray-500 [html:not(.dark)_&]:text-slate-500 mt-1">Define your rules to build a profitable edge.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="strategy-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  {/* Left Column: Overview */}
                  <div className="space-y-4">
                    <h3 className="text-white [html:not(.dark)_&]:text-slate-900 font-bold text-lg mb-4 border-b border-gray-700/50 [html:not(.dark)_&]:border-slate-200 pb-2">Strategy Overview</h3>
                    <FormInput
                      label="Strategy Name (e.g. London Breakout)"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      type="textarea"
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                    <FormSelect
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      options={[
                        { label: 'Testing (Paper trading / Demo)', value: 'Testing' },
                        { label: 'Active (Live trading)', value: 'Active' },
                        { label: 'Discarded (Not working)', value: 'Discarded' }
                      ]}
                      required
                    />
                  </div>

                  {/* Right Column: Execution */}
                  <div className="space-y-4">
                    <h3 className="text-white [html:not(.dark)_&]:text-slate-900 font-bold text-lg mb-4 border-b border-gray-700/50 [html:not(.dark)_&]:border-slate-200 pb-2">Execution Framework</h3>
                    <NumberedListInput
                      label="Charting Process"
                      name="chartingProcess"
                      value={formData.chartingProcess}
                      onChange={handleChange}
                      placeholder="e.g. Identify daily bias"
                    />
                    <NumberedListInput
                      label="Entry Criteria"
                      name="entryCriteria"
                      value={formData.entryCriteria}
                      onChange={handleChange}
                      placeholder="e.g. Wait for 5min displacement"
                    />
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-700/50 [html:not(.dark)_&]:border-slate-200 bg-[#1c1c1c]/30 [html:not(.dark)_&]:bg-slate-50 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:text-slate-900 [html:not(.dark)_&]:hover:bg-slate-200 hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="strategy-form"
                  className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Save Strategy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedStrategy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-700/50 [html:not(.dark)_&]:border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-white [html:not(.dark)_&]:text-slate-900">{selectedStrategy.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded border ${selectedStrategy.status === 'Active' ? 'bg-[#1c1c1c] [html:not(.dark)_&]:bg-green-50 text-green-400 [html:not(.dark)_&]:text-green-600 border-green-500/20 [html:not(.dark)_&]:border-green-200' :
                        selectedStrategy.status === 'Testing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                      {selectedStrategy.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedStrategy.description}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Charting Process</h4>
                  <div className="bg-[#060606]/80 p-5 rounded-xl border border-gray-700/50 shadow-inner">
                    {selectedStrategy.chartingProcess ? (
                      <ol className="list-decimal list-outside ml-4 text-blue-200/90 font-medium text-sm leading-relaxed space-y-2 marker:text-blue-500/50">
                        {selectedStrategy.chartingProcess.split('\n').filter(step => step.trim() !== '').map((step, i) => (
                          <li key={i} className="pl-1">{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Not specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Entry Criteria</h4>
                  <div className="bg-[#060606]/80 p-5 rounded-xl border border-gray-700/50 shadow-inner">
                    {selectedStrategy.entryCriteria ? (
                      <ol className="list-decimal list-outside ml-4 text-green-200/90 font-medium text-sm leading-relaxed space-y-2 marker:text-green-500/50">
                        {selectedStrategy.entryCriteria.split('\n').filter(step => step.trim() !== '').map((step, i) => (
                          <li key={i} className="pl-1">{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-500 text-sm italic">Not specified</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-6 w-full sm:w-auto">
                  <div className="text-center">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Trades</p>
                    <p className="text-white font-bold">{selectedStrategy.stats?.totalTrades || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Win Rate</p>
                    <p className={`font-bold ${selectedStrategy.stats?.winRate >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {selectedStrategy.stats?.winRate || 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Avg RR</p>
                    <p className="text-violet-400 font-bold">{selectedStrategy.stats?.averageRR || 0}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Strategies;
