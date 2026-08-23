import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NumberedListInput = ({ label, name, value = '', onChange, placeholder = "Enter a step..." }) => {
  // Convert the incoming newline-separated string to an array. 
  // If empty, start with one empty step.
  const [items, setItems] = useState(() => {
    if (!value) return [''];
    return value.split('\n');
  });

  // Sync back to parent whenever items change
  useEffect(() => {
    // Only join items that are not empty, unless it's the only item
    const joined = items.filter(item => item.trim() !== '').join('\n');
    onChange({ target: { name, value: joined } });
  }, [items, name]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleItemChange = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    if (newItems.length === 0) {
      setItems(['']); // Ensure there is always at least one input
    } else {
      setItems(newItems);
    }
  };

  return (
    <div className="mb-6">
      {label && <label className="block text-gray-400 text-sm mb-3 font-medium">{label}</label>}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1c1c1c] border border-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold mt-1 shadow-inner">
                {index + 1}
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-[#060606]/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 focus:bg-[#060606] transition-colors placeholder-gray-600"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                title="Remove step"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={handleAddItem}
        className="mt-4 mx-auto flex items-center justify-center w-6 h-6 text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 hover:bg-violet-500/20 rounded-full"
        title="Add Step"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default NumberedListInput;
