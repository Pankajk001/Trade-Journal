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
        className="w-full aspect-[4/3] bg-black [html:not(.dark)_&]:bg-slate-50 rounded-xl border border-gray-700 hover:border-orange-500/50 [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:hover:border-orange-500/50 transition-all flex items-center justify-center overflow-hidden cursor-pointer group shadow-sm"
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]" />
        ) : (
          <div className="text-orange-500/70 group-hover:text-orange-500 flex flex-col items-center transition-colors">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-3 group-hover:bg-orange-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500/80 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-orange-500/80 group-hover:text-orange-500 transition-colors">Upload {label}</span>
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
