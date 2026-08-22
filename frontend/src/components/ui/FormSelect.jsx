const FormSelect = ({ label, name, value, onChange, options, required = false }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-400 text-sm mb-1 [html:not(.dark)_&]:text-slate-600">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 appearance-none transition-colors duration-200
          bg-[#060606] border-gray-700 text-white
          [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:text-slate-900"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
