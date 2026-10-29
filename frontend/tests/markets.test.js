import test from "node:test";
import assert from "node:assert/strict";
import {
  marketPreferences,
  chartConfig,
  MARKET_SYMBOLS,
  findMarket,
} from "../src/lib/markets.js";
test("market preferences reject unsupported symbols and recover corrupt values", () => {
  assert.deepEqual(marketPreferences(null), {
    symbol: "OANDA:EURUSD",
    interval: "60",
    watchlist: [],
  });
  const prefs = marketPreferences({
    symbol: "NSE:NIFTY",
    interval: "invalid",
    watchlist: ["BITSTAMP:BTCUSD", "NSE:NIFTY", "BITSTAMP:BTCUSD", null],
  });
  assert.equal(prefs.symbol, "OANDA:EURUSD");
  assert.deepEqual(prefs.watchlist, ["BITSTAMP:BTCUSD"]);
  assert.equal(findMarket("https://invalid.example/script"), undefined);
});
test("charts use supported provider symbols and retain provider branding without a data API", () => {
  const config = chartConfig("OANDA:XAUUSD", "15", "dark");
  assert.equal(config.symbol, "OANDA:XAUUSD");
  assert.equal(config.interval, "15");
  assert.equal(config.theme, "dark");
  assert.equal(config.allow_symbol_change, false);
  assert.equal(config.support_host, "https://www.tradingview.com");
  assert.throws(() => chartConfig("NSE:NIFTY", "60", "light"));
  assert.ok(
    MARKET_SYMBOLS.every((item) =>
      ["Forex", "Metals", "Crypto"].includes(item.category),
    ),
  );
  assert.ok(
    MARKET_SYMBOLS.every((item) => !("price" in item) && !("candles" in item)),
  );
});
