import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const MinimalDropdown = ({ name, value, onChange, options, variant = 'underline', className = '', triggerTextColor = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const baseTextColor = triggerTextColor || "text-white [html:not(.dark)_&]:text-slate-900";
  const triggerClasses = variant === 'underline' 
    ? `flex items-center justify-between gap-2 bg-transparent text-sm font-bold ${baseTextColor} outline-none w-full border-b border-transparent focus:border-gray-500 transition-colors pb-1 cursor-pointer`
    : `flex items-center justify-between gap-2 bg-black border border-gray-800 rounded-md pl-2 pr-2 py-1 text-right outline-none w-full ${baseTextColor} hover:border-gray-600 transition-colors cursor-pointer [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200`;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={triggerClasses}>
        <span className={`w-full ${variant === 'underline' ? 'text-left' : 'text-right'}`}>{selectedOption.label}</span>
        <FiChevronDown className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div 
        className={`absolute top-[calc(100%+4px)] right-0 min-w-full bg-[#1c1c1c] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden 
        [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 transition-all duration-300 origin-top
        ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}
      >
        <div className="p-1 space-y-1">
          {options.map((opt, i) => (
            <div 
              key={i}
              onClick={() => handleSelect(opt.value)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer text-left transition-colors font-medium text-sm whitespace-nowrap
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

export default MinimalDropdown;
