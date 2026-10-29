// Chart instrument metadata. Independent alert feeds are defined in priceAlerts.js.
export const MARKET_SYMBOLS = [
  ["OANDA:EURUSD", "EURUSD", "Euro / US dollar", "Forex", "OANDA"],
  ["OANDA:GBPUSD", "GBPUSD", "British pound / US dollar", "Forex", "OANDA"],
  ["OANDA:USDJPY", "USDJPY", "US dollar / Japanese yen", "Forex", "OANDA"],
  ["OANDA:AUDUSD", "AUDUSD", "Australian dollar / US dollar", "Forex", "OANDA"],
  ["OANDA:USDCAD", "USDCAD", "US dollar / Canadian dollar", "Forex", "OANDA"],
  ["OANDA:USDCHF", "USDCHF", "US dollar / Swiss franc", "Forex", "OANDA"],
  [
    "OANDA:NZDUSD",
    "NZDUSD",
    "New Zealand dollar / US dollar",
    "Forex",
    "OANDA",
  ],
  ["OANDA:EURJPY", "EURJPY", "Euro / Japanese yen", "Forex", "OANDA"],
  ["OANDA:GBPJPY", "GBPJPY", "British pound / Japanese yen", "Forex", "OANDA"],
  ["OANDA:EURGBP", "EURGBP", "Euro / British pound", "Forex", "OANDA"],
  ["OANDA:XAUUSD", "XAUUSD", "Gold / US dollar", "Metals", "OANDA"],
  ["OANDA:XAGUSD", "XAGUSD", "Silver / US dollar", "Metals", "OANDA"],
  ["BITSTAMP:BTCUSD", "BTCUSD", "Bitcoin / US dollar", "Crypto", "Bitstamp"],
  ["BITSTAMP:ETHUSD", "ETHUSD", "Ethereum / US dollar", "Crypto", "Bitstamp"],
  ["COINBASE:SOLUSD", "SOLUSD", "Solana / US dollar", "Crypto", "Coinbase"],
  ["COINBASE:XRPUSD", "XRPUSD", "XRP / US dollar", "Crypto", "Coinbase"],
  ["COINBASE:ADAUSD", "ADAUSD", "Cardano / US dollar", "Crypto", "Coinbase"],
  ["COINBASE:DOGEUSD", "DOGEUSD", "Dogecoin / US dollar", "Crypto", "Coinbase"],
].map(([symbol, pair, name, category, source]) => ({
  symbol,
  pair,
  name,
  category,
  source,
}));

export const MARKET_INTERVALS = [
  ["1", "1m"],
  ["5", "5m"],
  ["15", "15m"],
  ["60", "1h"],
  ["240", "4h"],
  ["D", "1D"],
  ["W", "1W"],
];
export const findMarket = (symbol) =>
  MARKET_SYMBOLS.find((market) => market.symbol === symbol);
export function marketPreferences(value) {
  return {
    symbol: findMarket(value?.symbol)?.symbol || MARKET_SYMBOLS[0].symbol,
    interval: MARKET_INTERVALS.some(
      ([interval]) => interval === value?.interval,
    )
      ? value.interval
      : "60",
    watchlist: Array.isArray(value?.watchlist)
      ? [...new Set(value.watchlist)].filter((symbol) => findMarket(symbol))
      : [],
  };
}
export function chartConfig(symbol, interval, theme) {
  if (!findMarket(symbol))
    throw new Error("Choose a supported forex, metals or crypto symbol.");
  return {
    autosize: true,
    symbol,
    interval: marketPreferences({ interval }).interval,
    timezone: "Etc/UTC",
    theme: theme === "dark" ? "dark" : "light",
    style: "1",
    locale: "en",
    allow_symbol_change: false,
    hide_side_toolbar: false,
    calendar: false,
    save_image: false,
    support_host: "https://www.tradingview.com",
  };
}
