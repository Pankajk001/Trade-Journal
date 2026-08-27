import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const currencyFlags = {
  EUR: 'eu',
  USD: 'us',
  GBP: 'gb',
  JPY: 'jp',
  CHF: 'ch',
  CAD: 'ca',
  AUD: 'au',
  NZD: 'nz',
};

const instruments = [
  { group: 'Majors', options: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'USDCAD', 'AUDUSD', 'NZDUSD'] },
  { group: 'Minors', options: ['EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'EURAUD'] },
  { group: 'Metals / Indices', options: ['XAUUSD', 'XAGUSD', 'US30', 'NAS100'] },
  { group: 'Crypto', options: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD'] },
];

const InstrumentIcon = ({ pair }) => {
  if (pair.length === 6 && currencyFlags[pair.substring(0, 3)] && currencyFlags[pair.substring(3, 6)]) {
    const base = currencyFlags[pair.substring(0, 3)];
    const quote = currencyFlags[pair.substring(3, 6)];
    
    return (
      <div className="relative flex items-center w-8 h-5">
        <img src={`https://flagcdn.com/w40/${base}.png`} alt={base} className="absolute left-0 w-5 h-5 rounded-full object-cover border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-10" />
        <img src={`https://flagcdn.com/w40/${quote}.png`} alt={quote} className="absolute left-3 w-5 h-5 rounded-full object-cover border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-0" />
      </div>
    );
  }

  // Fallbacks for metals and indices
  if (pair === 'XAUUSD') {
    return (
      <div className="relative flex items-center w-8 h-5">
        <div className="absolute left-0 w-5 h-5 rounded-full bg-yellow-500 border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-10 flex items-center justify-center text-[8px]">Au</div>
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className="absolute left-3 w-5 h-5 rounded-full object-cover border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-0" />
      </div>
    );
  }
  
  if (pair === 'XAGUSD') {
    return (
      <div className="relative flex items-center w-8 h-5">
        <div className="absolute left-0 w-5 h-5 rounded-full bg-gray-400 border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-10 flex items-center justify-center text-[8px]">Ag</div>
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className="absolute left-3 w-5 h-5 rounded-full object-cover border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-0" />
      </div>
    );
  }

  if (pair === 'US30' || pair === 'NAS100') {
    return (
      <div className="relative flex items-center w-5 h-5">
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className="w-5 h-5 rounded-full object-cover" />
      </div>
    );
  }

  // Fallbacks for cryptos
  if (['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD'].includes(pair)) {
    const cryptoConfig = {
      'BTCUSD': { symbol: '₿', bg: 'bg-[#F7931A]' },
      'ETHUSD': { symbol: 'Ξ', bg: 'bg-[#627EEA]' },
      'SOLUSD': { symbol: 'S', bg: 'bg-[#14F195] text-black' },
      'XRPUSD': { symbol: '✕', bg: 'bg-[#23292F]' },
      'ADAUSD': { symbol: '₳', bg: 'bg-[#0033AD]' },
    };
    const config = cryptoConfig[pair];
    return (
      <div className="relative flex items-center w-8 h-5">
        <div className={`absolute left-0 w-5 h-5 rounded-full ${config.bg} ${config.bg.includes('text-black') ? '' : 'text-white'} border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-10 flex items-center justify-center text-[10px] font-bold`}>{config.symbol}</div>
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className="absolute left-3 w-5 h-5 rounded-full object-cover border border-[#1c1c1c] [html:not(.dark)_&]:border-white z-0" />
      </div>
    );
  }

  return <div className="w-5 h-5 rounded-full bg-gray-700"></div>;
};

const InstrumentDropdown = ({ value, onChange }) => {
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

  const handleSelect = (pair) => {
    onChange({ target: { name: 'pair', value: pair } });
    setIsOpen(false);
  };



  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-transparent text-xs font-bold text-white [html:not(.dark)_&]:text-slate-900 outline-none w-full border-b border-transparent focus:border-gray-500 transition-colors pb-1 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {value ? <InstrumentIcon pair={value} /> : null}
          <span>{value ? value : 'Select Instrument'}</span>
        </div>
        <FiChevronDown className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <p className="text-xs text-gray-500 uppercase mt-1">Instrument</p>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[calc(100%+8px)] left-0 w-64 bg-[#1c1c1c] border border-gray-800 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar 
        [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 transition-all duration-300 origin-top
        ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}
      >
        <div className="p-2 space-y-1">
          {instruments.map((group) => (
            <div key={group.group} className="mb-2 last:mb-0">
              <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                {group.group}
              </div>
              {group.options.map((option) => (
                <div 
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                    ${value === option ? 'bg-violet-500/10 text-violet-500' : 'text-gray-300 hover:bg-violet-500/10 hover:text-violet-500 [html:not(.dark)_&]:text-slate-700 [html:not(.dark)_&]:hover:bg-violet-50'}`}
                >
                  <InstrumentIcon pair={option} />
                  <span className="text-xs font-medium">{option}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstrumentDropdown;
