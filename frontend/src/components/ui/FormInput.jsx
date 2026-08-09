const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, min, max, step }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-400 text-sm mb-1">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows="3"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
        />
      )}
    </div>
  );
};

export default FormInput;
