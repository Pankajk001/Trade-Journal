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
        <h1 className="text-3xl font-bold text-white mb-2">
          {trade.pair} <span className="text-gray-400 text-xl font-normal">({trade.direction})</span>
        </h1>
        <p className="text-gray-400">
          {trade.date ? format(new Date(trade.date), 'MMMM dd, yyyy') : 'Unknown Date'} 
          {trade.time ? ` at ${trade.time}` : ''}
          {trade.user?.name ? ` • by ${trade.user.name}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Result</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Outcome</span>
                <span className={`font-medium ${trade.winLoss === 'Win' ? 'text-green-400' : trade.winLoss === 'Loss' ? 'text-red-400' : 'text-gray-400'}`}>
                  {trade.winLoss}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Profit/Loss</span>
                <span className={`font-medium ${trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${trade.profitLoss || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">R Multiple</span>
                <span className="text-white">{trade.rMultiple || 0}R</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Setup Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Strategy</span>
                <span className="text-white">{trade.strategyName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Setup</span>
                <span className="text-white">{trade.setupName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Session</span>
                <span className="text-white">{trade.session || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Pricing</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Entry</span>
                <span className="text-white">{trade.entryPrice || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stop Loss</span>
                <span className="text-white">{trade.stopLoss || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Take Profit</span>
                <span className="text-white">{trade.takeProfit || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Review & Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Journal Review</h2>
            
            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Description</h3>
              <p className="text-white bg-gray-900 p-4 rounded-lg">{trade.tradeDescription || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Emotions Before Entry</h3>
                <p className="text-white bg-gray-900 p-3 rounded-lg">{trade.emotionsBeforeEntry || '-'}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Confidence (1-10)</h3>
                <p className="text-white bg-gray-900 p-3 rounded-lg">{trade.confidenceLevel || '-'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Mistakes Made</h3>
              <p className="text-red-300 bg-red-900/20 border border-red-900/50 p-4 rounded-lg">{trade.mistakesMade || 'None recorded.'}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 text-sm mb-1">Lessons Learned</h3>
              <p className="text-green-300 bg-green-900/20 border border-green-900/50 p-4 rounded-lg">{trade.lessonsLearned || 'No lessons recorded.'}</p>
            </div>
            
            {trade.tags && trade.tags.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trade.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Screenshots</h2>
            {images.length > 0 ? (
              <ImageGallery images={images} />
            ) : (
              <p className="text-gray-400">No screenshots attached to this trade.</p>
            )}
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeView;
