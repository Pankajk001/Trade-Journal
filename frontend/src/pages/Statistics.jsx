import { useState, useEffect } from 'react';
import statsService from '../services/statsService';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getStats(); 
        
        let avgWin = 0;
        let avgLoss = 0;
        let winTotal = 0;
        let lossTotal = 0;
        let winCount = 0;
        let lossCount = 0;
        let currentStreak = 0;
        let maxWinStreak = 0;
        let maxLossStreak = 0;
        let currentLossStreak = 0;

        const dayCount = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0 };
        const dayProfit = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0 };
        
        const pairCount = {};
        const pairProfit = {};
        
        const directionCount = { Long: 0, Short: 0 };
        
        const sessionCount = { London: 0, 'New York': 0, Asian: 0, Sydney: 0, Other: 0 };

        if (data.recentTrades && data.recentTrades.length > 0) {
          // Sort chronological for streaks
          const sorted = [...data.recentTrades].sort((a,b) => new Date(a.date) - new Date(b.date));
          
          sorted.forEach(t => {
            // Averages & Streaks
            if (t.winLoss === 'Win') {
              winCount++;
              winTotal += t.profitLoss;
              currentStreak++;
              currentLossStreak = 0;
              if (currentStreak > maxWinStreak) maxWinStreak = currentStreak;
            } else if (t.winLoss === 'Loss') {
              lossCount++;
              lossTotal += Math.abs(t.profitLoss);
              currentLossStreak++;
              currentStreak = 0;
              if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
            }

            // Direction
            if (t.direction === 'Long') directionCount.Long++;
            if (t.direction === 'Short') directionCount.Short++;

            // Session
            if (sessionCount[t.session] !== undefined) sessionCount[t.session]++;

            // Pair
            if (!pairCount[t.pair]) {
              pairCount[t.pair] = 0;
              pairProfit[t.pair] = 0;
            }
            pairCount[t.pair]++;
            pairProfit[t.pair] += t.profitLoss;

            // Day of Week
            const dayIdx = new Date(t.date).getDay();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = days[dayIdx];
            if (dayCount[dayName] !== undefined) {
              dayCount[dayName]++;
              dayProfit[dayName] += t.profitLoss;
            }
          });
        }

        avgWin = winCount > 0 ? winTotal / winCount : 0;
        avgLoss = lossCount > 0 ? lossTotal / lossCount : 0;

        // format into Recharts structures
        const dayData = Object.keys(dayCount).map(k => ({ name: k, trades: dayCount[k], profit: dayProfit[k] }));
        const pairData = Object.keys(pairProfit).map(k => ({ name: k, profit: pairProfit[k], trades: pairCount[k] })).sort((a,b)=>b.profit - a.profit);
        const dirData = [
          { name: 'Long', value: directionCount.Long },
          { name: 'Short', value: directionCount.Short }
        ].filter(d => d.value > 0);
        const sessionData = Object.keys(sessionCount).filter(k => sessionCount[k] > 0).map(k => ({ name: k, value: sessionCount[k] }));

        setStats({
          ...data,
          avgWin,
          avgLoss,
          maxWinStreak,
          maxLossStreak,
          dayData,
          pairData,
          dirData,
          sessionData
        });
      } catch (error) {
        console.error('Error fetching advanced stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-white text-center">Loading Statistics...</div>;
  if (!stats) return <div className="p-6 text-white text-center">Failed to load statistics.</div>;

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#6366f1', '#eab308'];
  const DIR_COLORS = ['#10b981', '#ef4444']; 

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#060606] border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
              <p className="text-gray-100 text-sm font-medium">
                {p.name}: {typeof p.value === 'number' && p.name.includes('$') ? '$'+p.value.toFixed(2) : p.value}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <PageHeader title="Advanced Statistics" />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Average Win</h3>
          <p className="text-3xl font-bold text-green-500">
            ${stats.avgWin.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Average Loss</h3>
          <p className="text-3xl font-bold text-red-500">
            ${stats.avgLoss.toFixed(2)}
          </p>
        </div>

        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Max Win Streak</h3>
          <p className="text-3xl font-bold text-gray-100 [html:not(.dark)_&]:text-slate-900">
            {stats.maxWinStreak} <span className="text-sm text-gray-600 font-medium ml-1">trades</span>
          </p>
        </div>

        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 p-6 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
          <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Max Loss Streak</h3>
          <p className="text-3xl font-bold text-gray-100 [html:not(.dark)_&]:text-slate-900">
            {stats.maxLossStreak} <span className="text-sm text-gray-600 font-medium ml-1">trades</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Performance by Asset (Bar Chart) */}
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm p-6 rounded-xl border border-gray-800 flex flex-col">
          <h2 className="text-base font-bold text-gray-200 [html:not(.dark)_&]:text-slate-900 mb-6 flex items-center gap-2">
            Profitability by Asset
          </h2>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats.pairData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{fill: '#9CA3AF', fontSize: 12}} width={80} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#2a2a2a'}} />
                <Bar dataKey="profit" name="Net P/L ($)" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.pairData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Day of the Week (Bar Chart) */}
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm p-6 rounded-xl border border-gray-800 flex flex-col">
          <h2 className="text-base font-bold text-gray-200 [html:not(.dark)_&]:text-slate-900 mb-6 flex items-center gap-2">
            Performance by Day
          </h2>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#2a2a2a'}} />
                <Bar dataKey="profit" name="Net P/L ($)" radius={[4, 4, 0, 0]} barSize={28}>
                   {stats.dayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#3B82F6' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Long vs Short Direction (Pie) */}
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm p-6 rounded-xl border border-gray-800 flex flex-col">
          <h2 className="text-base font-bold text-gray-200 [html:not(.dark)_&]:text-slate-900 mb-6 flex items-center gap-2">
            Directional Bias
          </h2>
          <div className="flex-1 min-h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.dirData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.dirData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DIR_COLORS[index % DIR_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trades by Session (Pie) */}
        <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm p-6 rounded-xl border border-gray-800 flex flex-col">
          <h2 className="text-base font-bold text-gray-200 [html:not(.dark)_&]:text-slate-900 mb-6 flex items-center gap-2">
            Trades by Session
          </h2>
          <div className="flex-1 min-h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sessionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.sessionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Statistics;
