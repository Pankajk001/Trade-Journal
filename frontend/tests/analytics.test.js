import test from "node:test";
import assert from "node:assert/strict";
import { calculateStats, dayKey } from "../src/lib/analytics.js";
const trade = (netPnl, index = 0, extra = {}) => ({
  netPnl,
  tradeStatus: "Closed",
  pair: "EURUSD",
  date: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
  ...extra,
});
test("uses the entire history and excludes open trades", () => {
  const result = calculateStats(
    [
      ...Array.from({ length: 12 }, (_, i) => trade(i < 6 ? 100 : -50, i)),
      trade(10000, 13, { tradeStatus: "Open" }),
    ],
    "UTC",
  );
  assert.equal(result.totalTrades, 12);
  assert.equal(result.totalProfit, 300);
  assert.equal(result.avgWin, 100);
  assert.equal(result.avgLoss, 50);
  assert.equal(result.winRate, 50);
  assert.equal(result.expectancy, 25);
  assert.equal(result.maxDrawdown, 300);
  assert.equal(result.profitFactor, 2);
  assert.equal(result.maxWinStreak, 6);
  assert.equal(result.maxLossStreak, 6);
});
test("decimal values remain exact and realised R uses initial risk", () => {
  const result = calculateStats(
    [
      trade("0.1", 0, { initialRisk: "0.1" }),
      trade("0.2", 1, { initialRisk: "0.1" }),
    ],
    "UTC",
  );
  assert.equal(result.totalProfit, 0.3);
  assert.equal(result.avgR, 1.5);
  assert.equal(result.rSample, 2);
});
test("empty history, breakevens, and no losing trades have defined display semantics", () => {
  assert.equal(calculateStats([]).winRate, 0);
  const result = calculateStats([trade(0), trade(100, 1)]);
  assert.equal(result.breakevens, 1);
  assert.equal(result.winRate, 50);
  assert.equal(result.profitFactor, null);
  assert.equal(result.avgR, null);
});
test("groups results on close date in the journal timezone, including weekends", () => {
  assert.equal(dayKey("2026-01-02T23:30:00Z", "Asia/Kolkata"), "2026-01-03");
  const result = calculateStats(
    [trade(20, 0, { closedAt: "2026-01-02T23:30:00Z" })],
    "Asia/Kolkata",
  );
  assert.equal(result.dailyData[0].date, "2026-01-03");
  assert.equal(result.dayData[0].name, "Sat");
});
test("breakevens break consecutive streaks and missing P&L is excluded", () => {
  const s = calculateStats([
    trade(-5),
    trade(0, 1),
    trade(-5, 2),
    trade(null, 3),
  ]);
  assert.equal(s.totalTrades, 3);
  assert.equal(s.maxLossStreak, 1);
  assert.equal(s.maxDrawdown, 10);
});
