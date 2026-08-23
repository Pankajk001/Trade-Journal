import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TradeContext } from '../context/TradeContext';
import { format } from 'date-fns';
import PageHeader from '../components/ui/PageHeader';

const Journal = () => {
  const { trades, loading, page, pages, getTrades } = useContext(TradeContext);
  const [keyword, setKeyword] = useState('');
  const [winLoss, setWinLoss] = useState('');
  const [session, setSession] = useState('');

  useEffect(() => {
    getTrades(keyword, winLoss, session, 1);
    // eslint-disable-next-line
  }, [keyword, winLoss, session]);

  const handlePageChange = (newPage) => {
    getTrades(keyword, winLoss, session, newPage);
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Trading Journal" 
        buttonText="+ Add Trade" 
        buttonLink="/dashboard/add-trade" 
      />

      {/* Filters & Search */}
      <div className="bg-[#1c1c1c] p-4 rounded-xl shadow-2xl shadow-black/60 border border-transparent mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Pair or Strategy..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-[#060606] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
        />
        <select
          value={winLoss}
          onChange={(e) => setWinLoss(e.target.value)}
          className="bg-[#060606] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
        >
          <option value="">All Results</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Breakeven">Breakeven</option>
        </select>
        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="bg-[#060606] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
        >
          <option value="">All Sessions</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Asian">Asian</option>
        </select>
      </div>

      {/* Trades Table */}
      <div className="bg-[#1c1c1c] rounded-xl shadow-2xl shadow-black/60 border border-transparent overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading trades...</div>
        ) : trades.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No trades found.</div>
        ) : (
          <table className="w-full text-left text-gray-300">
            <thead className="bg-[#060606] text-gray-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Pair</th>
                <th className="px-6 py-4 font-medium">Direction</th>
                <th className="px-6 py-4 font-medium">Strategy</th>
                <th className="px-6 py-4 font-medium">RR</th>
                <th className="px-6 py-4 font-medium">Result</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {trades.map((trade) => (
                <tr key={trade._id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">{format(new Date(trade.date), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4 font-medium text-white">{trade.pair}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${trade.direction === 'Long' ? 'bg-[#1c1c1c] text-green-400' : 'bg-[#1c1c1c] text-red-400'}`}>
                      {trade.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4">{trade.strategyName}</td>
                  <td className="px-6 py-4">{trade.riskRewardRatio}R</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${trade.winLoss === 'Win' ? 'bg-[#1c1c1c] text-green-400' : trade.winLoss === 'Loss' ? 'bg-[#1c1c1c] text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {trade.winLoss}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/dashboard/trade/${trade._id}`} className="text-violet-500 hover:text-violet-400 font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => handlePageChange(x + 1)}
              className={`px-4 py-2 rounded-lg ${
                x + 1 === page
                  ? 'bg-violet-600 text-white'
                  : 'bg-[#1c1c1c] shadow-2xl shadow-black/60 border border-transparent text-gray-400 hover:bg-gray-700'
              }`}
            >
              {x + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
