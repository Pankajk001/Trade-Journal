const FormSelect = ({ label, name, value, onChange, options, required = false }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-400 text-sm mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 appearance-none"
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
