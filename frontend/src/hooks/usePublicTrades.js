import { useState, useEffect, useMemo } from 'react';
import tradeService from '../services/tradeService';

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
        console.error('Error fetching public trades', err);
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
