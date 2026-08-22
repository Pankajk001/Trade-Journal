import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    content: '',
    tags: ''
  });

  const categories = ['Price Action', 'Risk Management', 'ICT', 'SMC', 'Psychology', 'Books', 'Videos', 'General'];

  const fetchNotes = async () => {
    try {
      const url = activeCategory ? `/api/notes?category=${activeCategory}` : '/api/notes';
      const { data } = await axios.get(url);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [activeCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notes', formData);
      setIsModalOpen(false);
      setFormData({ title: '', category: 'General', content: '', tags: '' });
      fetchNotes(); // Refresh list
    } catch (error) {
      console.error('Error creating note', error);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/api/notes/${id}`);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Learning Notes" 
        buttonText="+ Add Note" 
        buttonAction={() => setIsModalOpen(true)} 
      />

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === '' ? 'bg-orange-600 text-white' : 'bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:bg-slate-100 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm text-gray-400 hover:bg-gray-700 hover:text-white shadow-2xl shadow-black/60 border border-transparent'
          }`}
        >
          All Notes
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-orange-600 text-white' : 'bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:hover:bg-slate-100 [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm text-gray-400 hover:bg-gray-700 hover:text-white shadow-2xl shadow-black/60 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-10">Loading Notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-center py-10 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm rounded-xl shadow-2xl shadow-black/60 border border-transparent">
          No notes found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex flex-col overflow-hidden group shadow-sm transition-transform hover:scale-[1.01]">
              
              {/* Attachment Preview (if any) */}
              {note.attachmentUrl ? (
                <div className="h-48 w-full relative overflow-hidden bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200">
                  <img src={note.attachmentUrl} alt="Attachment" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 left-3 bg-[#060606] [html:not(.dark)_&]:bg-orange-50 text-orange-400 [html:not(.dark)_&]:text-orange-600 text-xs px-2 py-1 rounded-md border border-gray-700 [html:not(.dark)_&]:border-orange-200">
                    {note.category}
                  </span>
                  <button 
                    onClick={() => deleteNote(note._id)}
                    className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="pt-4 px-6 pb-0 flex justify-between items-start">
                  <span className="bg-[#060606] [html:not(.dark)_&]:bg-orange-50 text-orange-400 [html:not(.dark)_&]:text-orange-600 text-xs px-2 py-1 rounded-md border border-gray-700 [html:not(.dark)_&]:border-orange-200">
                    {note.category}
                  </span>
                  <button 
                    onClick={() => deleteNote(note._id)}
                    className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-2">{note.title}</h3>
                
                <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-4 line-clamp-4 flex-1">
                  {note.content}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] uppercase text-gray-500 [html:not(.dark)_&]:text-slate-600 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 px-2 py-0.5 rounded border border-gray-800 [html:not(.dark)_&]:border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Note Modal */}
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
              className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-700/50 [html:not(.dark)_&]:border-slate-200 bg-[#1c1c1c]/50 [html:not(.dark)_&]:bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 [html:not(.dark)_&]:from-slate-900 [html:not(.dark)_&]:to-slate-700">Create Learning Note</h2>
                  <p className="text-sm text-gray-500 [html:not(.dark)_&]:text-slate-500 mt-1">Document your insights, psychology, and setups.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="note-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput 
                      label="Title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      required 
                    />
                    <FormSelect
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      options={categories.map(c => ({ label: c, value: c }))}
                      required
                    />
                  </div>
                  <FormInput 
                    type="textarea"
                    label="Content" 
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    required 
                  />
                  <FormInput 
                    label="Tags (comma separated)" 
                    name="tags" 
                    placeholder="e.g. basics, psychology, setup"
                    value={formData.tags} 
                    onChange={handleChange} 
                  />
                </form>
              </div>
              
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
                  form="note-form"
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
