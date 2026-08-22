import { format } from 'date-fns';
import ImageGallery from '../ImageGallery';

const TradeView = ({ trade }) => {
  if (!trade) return null;

  const images = [
    { url: trade.screenshotBeforeEntry, title: 'Before Entry' },
    { url: trade.screenshotDuringTrade, title: 'During Trade' },
    { url: trade.screenshotAfterExit, title: 'After Exit' }
  ].filter(img => img.url);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-2">
          {trade.pair} <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-xl font-normal">({trade.direction})</span>
        </h1>
        <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600">
          {trade.date ? format(new Date(trade.date), 'MMMM dd, yyyy') : 'Unknown Date'} 
          {trade.time ? ` at ${trade.time}` : ''}
          {trade.user?.name ? ` • by ${trade.user.name}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent [html:not(.dark)_&]:border-slate-200 shadow-lg [html:not(.dark)_&]:shadow-sm">
            <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-4 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200 pb-2">Result</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Outcome</span>
                <span className={`font-medium ${trade.winLoss === 'Win' ? 'text-green-400 [html:not(.dark)_&]:text-green-600' : trade.winLoss === 'Loss' ? 'text-red-400 [html:not(.dark)_&]:text-red-600' : 'text-gray-400 [html:not(.dark)_&]:text-slate-500'}`}>
                  {trade.winLoss}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Profit/Loss</span>
                <span className={`font-medium ${trade.profitLoss >= 0 ? 'text-green-400 [html:not(.dark)_&]:text-green-600' : 'text-red-400 [html:not(.dark)_&]:text-red-600'}`}>
                  ${trade.profitLoss || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">R Multiple</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.rMultiple || 0}R</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent [html:not(.dark)_&]:border-slate-200 shadow-lg [html:not(.dark)_&]:shadow-sm">
            <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-4 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200 pb-2">Setup Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Strategy</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.strategyName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Setup</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.setupName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Session</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.session || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent [html:not(.dark)_&]:border-slate-200 shadow-lg [html:not(.dark)_&]:shadow-sm">
            <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-4 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200 pb-2">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Entry</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.entryPrice || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Stop Loss</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.stopLoss || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 [html:not(.dark)_&]:text-slate-600">Take Profit</span>
                <span className="text-white [html:not(.dark)_&]:text-slate-900">{trade.takeProfit || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Review & Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent [html:not(.dark)_&]:border-slate-200 shadow-lg [html:not(.dark)_&]:shadow-sm">
            <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-4 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200 pb-2">Journal Review</h2>
            
            <div className="mb-4">
              <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-1">Description</h3>
              <p className="text-white [html:not(.dark)_&]:text-slate-900 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border [html:not(.dark)_&]:border-slate-200 p-4 rounded-lg">{trade.tradeDescription || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-1">Emotions Before Entry</h3>
                <p className="text-white [html:not(.dark)_&]:text-slate-900 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border [html:not(.dark)_&]:border-slate-200 p-3 rounded-lg">{trade.emotionsBeforeEntry || '-'}</p>
              </div>
              <div>
                <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-1">Confidence (1-10)</h3>
                <p className="text-white [html:not(.dark)_&]:text-slate-900 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border [html:not(.dark)_&]:border-slate-200 p-3 rounded-lg">{trade.confidenceLevel || '-'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-1">Mistakes Made</h3>
              <p className="text-red-300 [html:not(.dark)_&]:text-red-700 bg-red-900/20 [html:not(.dark)_&]:bg-red-50 border border-red-900/50 [html:not(.dark)_&]:border-red-200 p-4 rounded-lg">{trade.mistakesMade || 'None recorded.'}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-1">Lessons Learned</h3>
              <p className="text-green-300 [html:not(.dark)_&]:text-green-700 bg-green-900/20 [html:not(.dark)_&]:bg-green-50 border border-green-900/50 [html:not(.dark)_&]:border-green-200 p-4 rounded-lg">{trade.lessonsLearned || 'No lessons recorded.'}</p>
            </div>
            
            {trade.tags && trade.tags.length > 0 && (
              <div>
                <h3 className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trade.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-700 [html:not(.dark)_&]:bg-slate-100 text-gray-300 [html:not(.dark)_&]:text-slate-600 [html:not(.dark)_&]:border [html:not(.dark)_&]:border-slate-200 px-3 py-1 rounded-full text-sm">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent [html:not(.dark)_&]:border-slate-200 shadow-lg [html:not(.dark)_&]:shadow-sm">
            <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-4 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200 pb-2">Screenshots</h2>
            {images.length > 0 ? (
              <ImageGallery images={images} />
            ) : (
              <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600">No screenshots attached to this trade.</p>
            )}
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeView;
