import React from 'react';

const Badge = ({ children, color = "violet" }) => {
  const colors = {
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20 [html:not(.dark)_&]:bg-violet-50 [html:not(.dark)_&]:border-violet-200",
    green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 [html:not(.dark)_&]:bg-emerald-50 [html:not(.dark)_&]:border-emerald-200",
    red: "bg-rose-500/10 text-rose-500 border-rose-500/20 [html:not(.dark)_&]:bg-rose-50 [html:not(.dark)_&]:border-rose-200",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20 [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:border-slate-200",
    indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 [html:not(.dark)_&]:bg-indigo-50 [html:not(.dark)_&]:text-indigo-600 [html:not(.dark)_&]:border-indigo-100",
  };
  
  const defaultColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  const selectedColor = colors[color] || defaultColor;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedColor} uppercase tracking-wider`}>
      {children}
    </span>
  );
};

export default Badge;
