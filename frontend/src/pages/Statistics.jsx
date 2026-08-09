import { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
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
        const { data } = await axios.get('/api/trades/stats'); // Re-using existing stats endpoint for now, or extending it
        // We will mock advanced data based on the dummy trades returned in recentTrades
        
        // Calculate session performance
        const sessionCount = { London: 0, 'New York': 0, Asian: 0, Sydney: 0, Other: 0 };
        const strategyCount = {};

        if (data.recentTrades) {
          data.recentTrades.forEach(t => {
            if (sessionCount[t.session] !== undefined) sessionCount[t.session] += 1;
            
            if (strategyCount[t.strategyName]) {
              strategyCount[t.strategyName] += 1;
            } else {
              strategyCount[t.strategyName] = 1;
            }
          });
        }

        const sessionData = Object.keys(sessionCount)
          .filter(k => sessionCount[k] > 0)
          .map(k => ({ name: k, value: sessionCount[k] }));

        const strategyData = Object.keys(strategyCount).map(k => ({
          name: k,
          trades: strategyCount[k]
        }));

        setStats({
          ...data,
          sessionData,
          strategyData
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

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Advanced Statistics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trades by Session (Pie) */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Trades by Session</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sessionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.sessionData.map((entry, index) => (
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

        {/* Trades by Strategy (Bar) */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Most Used Strategies</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.strategyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} />
                <RechartsTooltip 
                  cursor={{fill: '#374151'}}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                />
                <Bar dataKey="trades" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Statistics;
