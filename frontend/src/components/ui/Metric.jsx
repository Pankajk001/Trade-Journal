import React from 'react';

const Metric = ({ label, value, valueClass = "text-white [html:not(.dark)_&]:text-slate-900" }) => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] font-bold text-gray-500 [html:not(.dark)_&]:text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-sm md:text-base font-black ${valueClass}`}>{value || '-'}</span>
  </div>
);

export default Metric;
