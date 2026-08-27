import { useState, useEffect, useMemo } from 'react';
import tradeService from '../services/tradeService';

const MOCK_TRADES = [
  {
    _id: '1',
    pair: 'BTCUSD',
    market: 'Crypto',
    direction: 'Short',
    winLoss: 'Win',
    netPnl: 450.50,
    rMultiple: 2.5,
    riskPercentage: 1,
    lotSize: 0.5,
    duration: '4 hrs',
    date: '2026-07-30T10:00:00Z',
    setupRef: 'Trend Following',
    executionRef: 'Breakout',
    mistakes: ['FOMO'],
    lessons: 'Patience paid off on this setup.',
    user: { name: 'Pankaj Kumar' },
    screenshotHTF: 'https://images.unsplash.com/photo-1621504450181-5d156f065317?q=80&w=1000&auto=format&fit=crop',
    screenshotBeforeEntry: 'https://images.unsplash.com/photo-1621504450181-5d156f065317?q=80&w=1000&auto=format&fit=crop',
  },
  {
    _id: '2',
    pair: 'EURUSD',
    market: 'Forex',
    direction: 'Long',
    winLoss: 'Loss',
    netPnl: -150.00,
    rMultiple: -1,
    riskPercentage: 1,
    lotSize: 1.0,
    duration: '2 hrs',
    date: '2026-07-29T14:30:00Z',
    setupRef: 'Reversal',
    mistakes: ['Early Entry'],
    lessons: 'Wait for confirmation.',
    user: { name: 'Pankaj Kumar' },
    screenshotHTF: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    _id: '3',
    pair: 'SOLUSD',
    market: 'Crypto',
    direction: 'Long',
    winLoss: 'Win',
    netPnl: 890.00,
    rMultiple: 4.2,
    riskPercentage: 2,
    lotSize: 100,
    duration: '1 day',
    date: '2026-07-28T09:15:00Z',
    setupRef: 'Support Bounce',
    user: { name: 'Alex T.' },
    screenshotHTF: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1000&auto=format&fit=crop',
  }
];

export const usePublicTrades = (initialFilter = 'All Trades') => {
  const [publicTrades, setPublicTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    const fetchPublicTrades = async () => {
      try {
        setLoading(true);
        const data = await tradeService.getPublicTrades();
        setPublicTrades(data);
        setError(null);
      } catch (err) {
        console.warn('API unavailable, falling back to mock data for presentation.', err);
        setPublicTrades(MOCK_TRADES);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTrades();
  }, []);

  const filteredTrades = useMemo(() => {
    if (activeFilter === 'All Trades') return publicTrades;
    if (activeFilter === 'Wins') return publicTrades.filter(t => t.winLoss === 'Win');
    if (activeFilter === 'Losses') return publicTrades.filter(t => t.winLoss === 'Loss');
    return publicTrades.filter(t => t.market?.toLowerCase() === activeFilter.toLowerCase());
  }, [publicTrades, activeFilter]);

  const categoryCounts = useMemo(() => {
    return {
      Crypto: publicTrades.filter(t => t.market?.toLowerCase() === 'crypto').length,
      Forex: publicTrades.filter(t => t.market?.toLowerCase() === 'forex').length,
      Wins: publicTrades.filter(t => t.winLoss === 'Win').length,
      Losses: publicTrades.filter(t => t.winLoss === 'Loss').length,
    };
  }, [publicTrades]);

  return {
    publicTrades,
    filteredTrades,
    categoryCounts,
    loading,
    error,
    activeFilter,
    setActiveFilter
  };
};

export default usePublicTrades;
