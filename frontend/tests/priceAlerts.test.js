import test from "node:test";
import assert from "node:assert/strict";
import {
  alertFeed,
  freshQuote,
  matchesAlert,
  validAlerts,
} from "../src/lib/priceAlerts.js";
const now = Date.parse("2026-10-29T12:00:00Z");
test("alerts reject stale, future, wrong-asset and invalid quotes", () => {
  const data = {
    symbol: "XAU",
    price: 4000,
    updatedAt: new Date(now).toISOString(),
    currency: "USD",
  };
  assert.equal(freshQuote(data, "OANDA:XAUUSD", now).price, 4000);
  for (const value of [
    { ...data, price: 0 },
    { ...data, price: "oops" },
    { ...data, symbol: "XAG" },
    { ...data, currency: "EUR" },
    { ...data, updatedAt: new Date(now - 120001).toISOString() },
    { ...data, updatedAt: new Date(now + 31000).toISOString() },
  ])
    assert.throws(() => freshQuote(value, "OANDA:XAUUSD", now));
  assert.equal(alertFeed("OANDA:EURUSD"), null);
  assert.throws(() => freshQuote(data, "OANDA:EURUSD", now));
  assert.equal(
    freshQuote(
      { price: "100", time: new Date(now).toISOString() },
      "COINBASE:SOLUSD",
      now,
    ).price,
    100,
  );
});
test("one-shot inclusive conditions only trigger active alerts on fresh samples", () => {
  const a = {
    id: "test",
    symbol: "OANDA:XAUUSD",
    condition: "above",
    target: 4000,
    status: "active",
  };
  assert.ok(matchesAlert(a, { price: 4000, at: now }, now));
  assert.equal(matchesAlert(a, { price: 3999, at: now }, now), false);
  assert.ok(
    matchesAlert({ ...a, condition: "below" }, { price: 3999, at: now }, now),
  );
  for (const status of ["paused", "triggered"])
    assert.equal(
      matchesAlert({ ...a, status }, { price: 4100, at: now }, now),
      false,
    );
  assert.equal(matchesAlert(a, { price: 4100, at: now - 120001 }, now), false);
  assert.deepEqual(
    validAlerts([
      a,
      { ...a, symbol: "OANDA:EURUSD" },
      { ...a, target: -10 },
      null,
    ]),
    [a],
  );
});
