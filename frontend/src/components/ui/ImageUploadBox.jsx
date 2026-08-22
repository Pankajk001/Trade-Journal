import React, { useRef } from 'react';

const ImageUploadBox = ({ label, name, onChange, previewUrl }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-gray-300 [html:not(.dark)_&]:text-slate-600 uppercase tracking-wide">{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 [html:not(.dark)_&]:text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div 
        onClick={handleClick}
        className="w-full aspect-[4/3] bg-black [html:not(.dark)_&]:bg-slate-50 rounded-xl border border-gray-700 hover:border-gray-500 [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:hover:border-slate-400 transition-all flex items-center justify-center overflow-hidden cursor-pointer group shadow-sm"
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]" />
        ) : (
          <div className="text-gray-500 [html:not(.dark)_&]:text-slate-400 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center mb-3 group-hover:bg-gray-700 [html:not(.dark)_&]:bg-slate-200 [html:not(.dark)_&]:group-hover:bg-slate-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-gray-300 [html:not(.dark)_&]:group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:group-hover:text-slate-700 transition-colors">Upload {label}</span>
          </div>
        )}
        <input 
          type="file" 
          name={name}
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ImageUploadBox;
