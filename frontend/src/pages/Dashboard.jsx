import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/trades/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-white text-center">Loading Dashboard...</div>;
  if (!stats) return <div className="p-6 text-white text-center">Failed to load statistics.</div>;

  const COLORS = ['#10B981', '#EF4444', '#6B7280']; // Green, Red, Gray

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Dashboard Overview" 
        buttonText="+ Log Trade" 
        buttonLink="/dashboard/add-trade" 
      />

      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Win Rate" value={`${stats.winRate}%`} />
        <StatCard 
          title="Total P/L" 
          value={`$${stats.totalProfit}`} 
          valueColorClass={stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} 
        />
        <StatCard title="Total Trades" value={stats.totalTrades} />
        <StatCard title="Profit Factor" value={stats.profitFactor} />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve */}
        <div className="lg:col-span-2 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent">
          <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-6">Equity Curve</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.equityCurve} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#3B82F6', strokeWidth: 1 }}
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss Pie Chart */}
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex flex-col">
          <h2 className="text-lg font-semibold text-white [html:not(.dark)_&]:text-slate-900 mb-6">Win/Loss Distribution</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9CA3AF' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Trades */}
      <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm rounded-xl shadow-2xl shadow-black/60 border border-transparent overflow-hidden">
        <div className="p-6 border-b border-gray-700 [html:not(.dark)_&]:border-slate-200 flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900">Recent Trades</h2>
          <Link to="/dashboard/journal" className="text-orange-500 hover:text-orange-400 text-sm">View All</Link>
        </div>
        <div className="overflow-x-auto">
          {stats.recentTrades.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No recent trades to display.</div>
          ) : (
            <table className="w-full text-left text-gray-300 [html:not(.dark)_&]:text-slate-600">
              <thead className="bg-[#060606] [html:not(.dark)_&]:bg-slate-50 text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Pair</th>
                  <th className="px-6 py-4 font-medium">Direction</th>
                  <th className="px-6 py-4 font-medium">Result</th>
                  <th className="px-6 py-4 font-medium">P/L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 [html:not(.dark)_&]:divide-slate-200">
                {stats.recentTrades.map((trade) => (
                  <tr key={trade._id} className="hover:bg-gray-700/30 [html:not(.dark)_&]:hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">{format(new Date(trade.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 font-medium text-white [html:not(.dark)_&]:text-slate-900">{trade.pair}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${trade.direction === 'Long' ? 'bg-[#060606] text-green-400 [html:not(.dark)_&]:bg-green-50 [html:not(.dark)_&]:text-green-600' : 'bg-[#060606] text-red-400 [html:not(.dark)_&]:bg-red-50 [html:not(.dark)_&]:text-red-600'}`}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${trade.winLoss === 'Win' ? 'bg-[#060606] text-green-400' : trade.winLoss === 'Loss' ? 'bg-[#060606] text-red-400' : 'bg-[#060606] text-gray-400'}`}>
                        {trade.winLoss}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${trade.profitLoss}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
