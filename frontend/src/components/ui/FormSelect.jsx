import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FormSelect = ({ label, name, value, onChange, options, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange({ target: { name, value: optValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value) || options[0] || {};

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      {label && <label className="block text-gray-400 text-sm mb-1 [html:not(.dark)_&]:text-slate-600">{label}</label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center relative transition-all duration-300
          ${isOpen ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'border-gray-700 [html:not(.dark)_&]:border-slate-300 hover:border-gray-500'}
          bg-[#060606] text-white [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:text-slate-900`}
      >
        <span className={`text-left w-full font-medium ${!value ? 'text-gray-500 [html:not(.dark)_&]:text-slate-400' : ''}`}>
          {selectedOption.label || 'Select...'}
        </span>
        <FiChevronDown className={`absolute right-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu - Smooth Transition */}
      <div 
        className={`absolute top-[calc(100%+8px)] left-0 w-full bg-[#1c1c1c] border border-gray-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar 
        [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 transition-all duration-300 origin-top
        ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}
      >
        <div className="p-2 space-y-1">
          {options.map((opt, i) => (
            <div 
              key={i}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-2 rounded-lg cursor-pointer text-left transition-colors font-medium
                ${value === opt.value ? 'bg-orange-500/10 text-orange-500' : 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 [html:not(.dark)_&]:text-slate-700 [html:not(.dark)_&]:hover:bg-orange-50'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
