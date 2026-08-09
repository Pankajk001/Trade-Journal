const StatCard = ({ title, value, valueColorClass = "text-white" }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-sm transition-transform hover:scale-[1.02]">
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${valueColorClass}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
