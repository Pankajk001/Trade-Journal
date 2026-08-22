import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { useTheme } from '../../context/ThemeContext';

const MockChart = ({ className = "w-full h-full min-h-[300px]" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: 'solid', color: theme === 'dark' ? '#000000' : '#ffffff' },
        textColor: theme === 'dark' ? '#d1d4dc' : '#334155',
        attributionLogo: false,
      },
      grid: {
        vertLines: {
          color: theme === 'dark' ? '#1e1e1e' : '#e2e8f0',
          style: 3, 
        },
        horzLines: {
          color: theme === 'dark' ? '#1e1e1e' : '#e2e8f0',
          style: 3,
        },
      },
      crosshair: {
        mode: 1, // Normal mode
        vertLine: { color: '#758696', width: 1, style: 3, labelBackgroundColor: '#758696' },
        horzLine: { color: '#758696', width: 1, style: 3, labelBackgroundColor: '#758696' },
      },
      timeScale: {
        borderColor: theme === 'dark' ? '#2a2e39' : '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? '#2a2e39' : '#e2e8f0',
      },
      handleScroll: false, // Disable for landing page so it doesn't trap scroll
      handleScale: false,
    });

    chartRef.current = chart;

    // Add Candlestick Series using v5 API
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#089981', // TradingView Buy Green
      downColor: '#f23645', // TradingView Sell Red
      borderDownColor: '#f23645',
      borderUpColor: '#089981',
      wickDownColor: '#f23645',
      wickUpColor: '#089981',
    });

    // Generate some simulated realistic data
    const generateData = () => {
      const data = [];
      let time = Math.floor(Date.now() / 1000) - (100 * 24 * 60 * 60); // Start 100 days ago
      let lastClose = 150.00;

      for (let i = 0; i < 100; i++) {
        const volatility = lastClose * 0.02; // 2% daily volatility
        const open = lastClose + (Math.random() - 0.5) * (volatility * 0.5);
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
        const low = Math.min(open, close) - Math.random() * (volatility * 0.5);

        data.push({
          time: time + (i * 24 * 60 * 60),
          open,
          high,
          low,
          close,
        });

        lastClose = close;
      }
      return data;
    };

    const dummyData = generateData();
    candleSeries.setData(dummyData);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update colors when theme changes without recreating chart
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: { type: 'solid', color: theme === 'dark' ? '#000000' : '#ffffff' },
          textColor: theme === 'dark' ? '#d1d4dc' : '#334155',
          attributionLogo: false,
        },
        grid: {
          vertLines: { color: theme === 'dark' ? '#1e1e1e' : '#e2e8f0' },
          horzLines: { color: theme === 'dark' ? '#1e1e1e' : '#e2e8f0' },
        },
        timeScale: { borderColor: theme === 'dark' ? '#2a2e39' : '#e2e8f0' },
        rightPriceScale: { borderColor: theme === 'dark' ? '#2a2e39' : '#e2e8f0' }
      });
    }
  }, [theme]);

  return <div ref={chartContainerRef} className={className} />;
};

export default MockChart;
