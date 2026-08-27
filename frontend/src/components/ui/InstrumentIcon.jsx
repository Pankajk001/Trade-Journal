import React from 'react';

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

const cryptoLogos = {
  BTC: 'bitcoin-btc-logo',
  ETH: 'ethereum-eth-logo',
  SOL: 'solana-sol-logo',
  XRP: 'xrp-xrp-logo',
  ADA: 'cardano-ada-logo',
};

const InstrumentIcon = ({ pair, size = "small" }) => {
  if (!pair) return null;

  const w = size === "large" ? "w-10 h-10" : size === "medium" ? "w-8 h-8" : size === "xsmall" ? "w-4 h-4" : "w-5 h-5";
  const containerW = size === "large" ? "w-16 h-10" : size === "medium" ? "w-12 h-8" : size === "xsmall" ? "w-6 h-4" : "w-8 h-5";
  const leftOffset = size === "large" ? "left-6" : size === "medium" ? "left-4" : size === "xsmall" ? "left-2" : "left-3";
  const textSize = size === "large" ? "text-[12px]" : size === "medium" ? "text-[10px]" : size === "xsmall" ? "text-[6px]" : "text-[8px]";

  const base = pair.length >= 6 ? pair.substring(0, 3) : '';
  const quote = pair.length >= 6 ? pair.substring(pair.length - 3) : '';

  // 1. Check if it's a known crypto pair (e.g., BTCUSD, ETHUSD)
  if (cryptoLogos[base]) {
    const quoteFlag = currencyFlags[quote];
    return (
      <div className={`relative flex items-center ${containerW}`}>
        <img src={`https://cryptologos.cc/logos/${cryptoLogos[base]}.png`} alt={base} className={`absolute left-0 ${w} rounded-full object-cover border border-black/20 z-10 bg-white`} />
        {quoteFlag ? (
          <img src={`https://flagcdn.com/w40/${quoteFlag}.png`} alt={quote} className={`absolute ${leftOffset} ${w} rounded-full object-cover border border-black/20 z-0`} />
        ) : (
          <div className={`absolute ${leftOffset} ${w} rounded-full bg-gray-600 border border-black/20 z-0 flex items-center justify-center ${textSize} text-white font-bold`}>{quote}</div>
        )}
      </div>
    );
  }

  // 2. Check if it's a known fiat currency pair
  if (pair.length === 6 && currencyFlags[base] && currencyFlags[quote]) {
    return (
      <div className={`relative flex items-center ${containerW}`}>
        <img src={`https://flagcdn.com/w40/${currencyFlags[base]}.png`} alt={currencyFlags[base]} className={`absolute left-0 ${w} rounded-full object-cover border border-black/20 z-10`} />
        <img src={`https://flagcdn.com/w40/${currencyFlags[quote]}.png`} alt={currencyFlags[quote]} className={`absolute ${leftOffset} ${w} rounded-full object-cover border border-black/20 z-0`} />
      </div>
    );
  }

  // 3. Fallbacks for metals
  if (pair === 'XAUUSD') {
    return (
      <div className={`relative flex items-center ${containerW}`}>
        <div className={`absolute left-0 ${w} rounded-full bg-yellow-500 border border-black/20 z-10 flex items-center justify-center ${textSize} font-bold text-black`}>Au</div>
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className={`absolute ${leftOffset} ${w} rounded-full object-cover border border-black/20 z-0`} />
      </div>
    );
  }
  
  if (pair === 'XAGUSD') {
    return (
      <div className={`relative flex items-center ${containerW}`}>
        <div className={`absolute left-0 ${w} rounded-full bg-gray-400 border border-black/20 z-10 flex items-center justify-center ${textSize} font-bold text-black`}>Ag</div>
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className={`absolute ${leftOffset} ${w} rounded-full object-cover border border-black/20 z-0`} />
      </div>
    );
  }

  // 4. Indices
  if (pair === 'US30' || pair === 'NAS100') {
    return (
      <div className={`relative flex items-center ${w}`}>
        <img src={`https://flagcdn.com/w40/us.png`} alt="us" className={`${w} rounded-full object-cover`} />
      </div>
    );
  }

  // 5. Generic fallback
  return (
    <div className={`relative flex items-center ${w}`}>
      <div className={`${w} rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border border-black/20 flex items-center justify-center text-white font-bold ${textSize}`}>
        {pair.substring(0, 2)}
      </div>
    </div>
  );
};

export default InstrumentIcon;
