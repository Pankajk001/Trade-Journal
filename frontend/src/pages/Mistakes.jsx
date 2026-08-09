import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import FormInput from '../components/ui/FormInput';

const Mistakes = () => {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMistake, setSelectedMistake] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    impact: '',
    solution: '',
    howToAvoid: ''
  });

  const fetchMistakes = async () => {
    try {
      const { data } = await axios.get('/api/mistakes');
      setMistakes(data);
    } catch (error) {
      console.error('Error fetching mistakes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMistakes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/mistakes', formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', impact: '', solution: '', howToAvoid: '' });
      fetchMistakes(); // Refresh list
    } catch (error) {
      console.error('Error creating mistake', error);
    }
  };

  const deleteMistake = async (id) => {
    if (window.confirm('Are you sure you want to delete this mistake from your library?')) {
      try {
        await axios.delete(`/api/mistakes/${id}`);
        fetchMistakes();
      } catch (error) {
        console.error('Error deleting mistake', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Mistake Library" 
        buttonText="+ Add Mistake" 
        buttonAction={() => setIsModalOpen(true)} 
      />

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading Library...</div>
      ) : mistakes.length === 0 ? (
        <div className="text-gray-400 text-center py-10 bg-gray-800 rounded-xl shadow-2xl shadow-black/60 border border-transparent">
          Your library is empty. Click "+ Add Mistake" to start logging common errors.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mistakes.map((mistake) => (
            <div 
              key={mistake._id} 
              onClick={() => setSelectedMistake(mistake)}
              className="bg-gray-800 rounded-xl shadow-2xl shadow-black/60 border border-transparent p-6 flex flex-col h-full relative group shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMistake(mistake._id);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{mistake.title}</h3>
                <span className="bg-gray-800 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20">
                  Freq: {mistake.frequency}
                </span>
              </div>
              
              <div className="space-y-4 flex-1 mt-4 border-t border-gray-700/50 pt-4">
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-gray-300 text-sm line-clamp-3">{mistake.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Mistake Modal */}
      {/* Add Mistake Modal */}
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
              className="bg-gray-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-700/50 bg-gray-800/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Add New Mistake</h2>
                  <p className="text-sm text-gray-500 mt-1">Log an error to prevent it from happening again.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto custom-scrollbar">
                <form id="mistake-form" onSubmit={handleSubmit}>
                  <FormInput 
                    label="Mistake Title (e.g. FOMO Entry)" 
                    name="title" 
                    value={formData.title} 
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
                  <FormInput 
                    type="textarea"
                    label="Impact (How did it affect the trade?)" 
                    name="impact" 
                    value={formData.impact} 
                    onChange={handleChange} 
                    required 
                  />
                  <FormInput 
                    type="textarea"
                    label="Solution" 
                    name="solution" 
                    value={formData.solution} 
                    onChange={handleChange} 
                    required 
                  />
                  <FormInput 
                    type="textarea"
                    label="How to Avoid (Actionable steps)" 
                    name="howToAvoid" 
                    value={formData.howToAvoid} 
                    onChange={handleChange} 
                    required 
                  />
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-700/50 bg-gray-800/30 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="mistake-form"
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Save Mistake
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedMistake && (
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
              className="bg-gray-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-700/50 bg-gray-800/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{selectedMistake.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-gray-800 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20">
                      Frequency: {selectedMistake.frequency}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMistake(null)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedMistake.description}</p>
                </div>
                
                <div>
                  <h4 className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Impact</h4>
                  <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/20">
                    <p className="text-red-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedMistake.impact}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">Solution</h4>
                  <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/20">
                    <p className="text-green-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedMistake.solution}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">How to Avoid</h4>
                  <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/20">
                    <p className="text-orange-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedMistake.howToAvoid}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-700/50 bg-gray-900 flex justify-end">
                <button 
                  onClick={() => setSelectedMistake(null)}
                  className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
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

export default Mistakes;
