import { createContext, useState } from 'react';
import tradeService from '../services/tradeService';

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const getTrades = async (keyword = '', winLoss = '', session = '', pageNumber = 1) => {
    try {
      setLoading(true);
      const data = await tradeService.getTrades(keyword, winLoss, session, pageNumber);
      setTrades(data.trades);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createTrade = async (tradeData) => {
    try {
      setLoading(true);
      await tradeService.createTrade(tradeData);
      // Reload trades after creating
      getTrades();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        loading,
        page,
        pages,
        total,
        getTrades,
        createTrade,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};
