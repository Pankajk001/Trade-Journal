import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const TradeImages = ({ trade }) => {
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const htfImg = trade.screenshotHTF || trade.screenshotBeforeEntry;
  const mtfImg = trade.screenshotMTF || trade.screenshotDuringTrade;
  const ltfImg = trade.screenshotLTF || trade.screenshotAfterExit;

  if (!htfImg && !mtfImg && !ltfImg) return null;

  return (
    <>
      <div className="px-4 sm:px-8 mt-8 mb-16">
        <div className="flex flex-col sm:flex-row gap-4">
          {htfImg && (
            <div 
              className="flex-1 w-full aspect-[4/3] bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 rounded-none overflow-hidden border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-lg relative group cursor-pointer"
              onClick={() => setFullScreenImage(htfImg)}
            >
              <div className="absolute top-2 left-2 bg-black/60 [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:text-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">HTF / BEFORE</div>
              <img src={htfImg} alt="HTF Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          {mtfImg && (
            <div 
              className="flex-1 w-full aspect-[4/3] bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 rounded-none overflow-hidden border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-lg relative group cursor-pointer"
              onClick={() => setFullScreenImage(mtfImg)}
            >
              <div className="absolute top-2 left-2 bg-black/60 [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:text-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">MTF / DURING</div>
              <img src={mtfImg} alt="MTF Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          {ltfImg && (
            <div 
              className="flex-1 w-full aspect-[4/3] bg-[#0a0a0a] [html:not(.dark)_&]:bg-slate-100 rounded-none overflow-hidden border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-lg relative group cursor-pointer"
              onClick={() => setFullScreenImage(ltfImg)}
            >
              <div className="absolute top-2 left-2 bg-black/60 [html:not(.dark)_&]:bg-white/80 [html:not(.dark)_&]:text-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm z-10">LTF / AFTER</div>
              <img src={ltfImg} alt="LTF Entry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="cursor-pointer fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setFullScreenImage(null)}
        >
          <button 
            className="cursor-pointer absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}
          >
            <FiX size={24} />
          </button>
          <img 
            src={fullScreenImage} 
            alt="Full Screen View" 
            className="cursor-pointer max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};

export default TradeImages;
