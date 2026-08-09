import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      const { data } = await axios.get(
        `/api/trades?keyword=${keyword}&winLoss=${winLoss}&session=${session}&pageNumber=${pageNumber}`
      );
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
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.post('/api/trades', tradeData, config);
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
