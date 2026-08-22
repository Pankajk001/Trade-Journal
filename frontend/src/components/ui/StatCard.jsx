const StatCard = ({ title, value, valueColorClass = "text-white [html:not(.dark)_&]:text-slate-900" }) => {
  return (
    <div className="p-6 rounded-xl shadow-sm border transition-all duration-200 hover:scale-[1.02]
                    bg-[#1c1c1c] border-gray-700/50 shadow-black/20
                    [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-200/60">
      <h3 className="text-gray-400 text-sm font-medium mb-1 [html:not(.dark)_&]:text-slate-500">{title}</h3>
      <p className={`text-3xl font-bold ${valueColorClass}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
