const FormInput = ({ label, name, type = "text", value, onChange, placeholder, required = false, min, max, step }) => {
  const baseClass = `w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-violet-500 transition-colors duration-200
    bg-[#060606] border-gray-700 text-white placeholder-gray-500
    [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:text-slate-900 [html:not(.dark)_&]:placeholder-slate-400`;

  return (
    <div className="mb-4">
      {label && <label className="block text-gray-400 text-sm mb-1 [html:not(.dark)_&]:text-slate-600">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows="3"
          className={baseClass}
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
          className={baseClass}
        />
      )}
    </div>
  );
};

export default FormInput;
