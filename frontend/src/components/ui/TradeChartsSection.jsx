import React from 'react';
import ImageUploadBox from './ImageUploadBox';

const TradeChartsSection = ({ previewUrls, handleFileChange }) => {
  return (
    <div className="bg-[#1c1c1c] rounded-2xl border border-gray-800/80 p-6 shadow-lg [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
      <h2 className="text-xl font-bold mb-1 text-white [html:not(.dark)_&]:text-slate-900">Charts</h2>
      <p className="text-gray-500 text-sm mb-6">Add screenshots to review context + execution:</p>
      
      <div className="grid grid-cols-3 gap-4">
        <ImageUploadBox label="MTF" name="screenshotMTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotMTF} small />
        <ImageUploadBox label="HTF" name="screenshotHTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotHTF} small />
        <ImageUploadBox label="LTF" name="screenshotLTF" onChange={handleFileChange} previewUrl={previewUrls.screenshotLTF} small />
      </div>
    </div>
  );
};

export default TradeChartsSection;
