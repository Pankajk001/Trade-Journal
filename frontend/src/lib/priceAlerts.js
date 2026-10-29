import { findMarket } from "./markets.js";

export const ALERT_LIMIT = 20;
export function alertFeed(symbol) {
  const market = findMarket(symbol);
  if (market?.category === "Metals")
    return {
      name: "Gold API spot",
      url: `https://api.gold-api.com/price/${market.pair.slice(0, 3)}`,
    };
  if (market?.category === "Crypto")
    return {
      name: "Coinbase last trade",
      url: `https://api.exchange.coinbase.com/products/${market.pair.slice(0, -3)}-USD/ticker`,
    };
  return null;
}
export function freshQuote(data, symbol, now = Date.now()) {
  const market = findMarket(symbol);
  const price = Number(data?.price);
  const at = Date.parse(
    market?.category === "Metals" ? data?.updatedAt : data?.time,
  );
  if (
    !alertFeed(symbol) ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isFinite(at) ||
    now - at > 120_000 ||
    at - now > 30_000
  )
    throw new Error(
      "No fresh price. Monitoring will retry; stale prices cannot trigger alerts.",
    );
  if (
    market.category === "Metals" &&
    (data.symbol !== market.pair.slice(0, 3) ||
      (data.currency && data.currency !== "USD"))
  )
    throw new Error("Unexpected price feed response.");
  return { price, at };
}
export function matchesAlert(alert, quote, now = Date.now()) {
  return (
    alert.status === "active" &&
    quote &&
    now - quote.at <= 120_000 &&
    quote.at - now <= 30_000 &&
    (alert.condition === "above"
      ? quote.price >= alert.target
      : quote.price <= alert.target)
  );
}
export function validAlerts(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (a) =>
        a &&
        typeof a.id === "string" &&
        alertFeed(a.symbol) &&
        ["above", "below"].includes(a.condition) &&
        Number.isFinite(a.target) &&
        a.target > 0 &&
        ["active", "paused", "triggered"].includes(a.status),
    )
    .slice(0, ALERT_LIMIT);
}
