import Decimal from "decimal.js";
export function money(value, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value || 0);
}
export function dayKey(value, timezone = "Asia/Kolkata") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  return ["year", "month", "day"]
    .map((k) => parts.find((p) => p.type === k).value)
    .join("-");
}
export function calculateStats(trades, timezone = "Asia/Kolkata") {
  const closed = trades
    .filter(
      (t) =>
        t.tradeStatus === "Closed" &&
        t.netPnl != null &&
        Number.isFinite(Number(t.netPnl)),
    )
    .sort(
      (a, b) => new Date(a.closedAt || a.date) - new Date(b.closedAt || b.date),
    );
  let net = new Decimal(0),
    grossWin = new Decimal(0),
    grossLoss = new Decimal(0),
    peak = new Decimal(0),
    drawdown = new Decimal(0);
  let wins = 0,
    losses = 0,
    breakevens = 0,
    winStreak = 0,
    lossStreak = 0,
    maxWinStreak = 0,
    maxLossStreak = 0;
  const daily = Object.create(null),
    pairs = Object.create(null),
    sessions = Object.create(null),
    weekdays = Object.create(null),
    strategies = Object.create(null),
    rValues = [];
  for (const t of closed) {
    const pnl = new Decimal(t.netPnl);
    net = net.plus(pnl);
    if (pnl.gt(0)) {
      wins++;
      grossWin = grossWin.plus(pnl);
      winStreak++;
      lossStreak = 0;
    } else if (pnl.lt(0)) {
      losses++;
      grossLoss = grossLoss.plus(pnl.abs());
      lossStreak++;
      winStreak = 0;
    } else {
      breakevens++;
      winStreak = 0;
      lossStreak = 0;
    }
    maxWinStreak = Math.max(maxWinStreak, winStreak);
    maxLossStreak = Math.max(maxLossStreak, lossStreak);
    peak = Decimal.max(peak, net);
    drawdown = Decimal.max(drawdown, peak.minus(net));
    const day = dayKey(t.closedAt || t.date, timezone);
    daily[day] ||= { date: day, pnl: new Decimal(0), trades: 0 };
    daily[day].pnl = daily[day].pnl.plus(pnl);
    daily[day].trades++;
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: timezone,
    }).format(new Date(t.closedAt || t.date));
    for (const [bucket, key] of [
      [pairs, t.pair],
      [sessions, t.session || "Unspecified"],
      [weekdays, weekday],
      [strategies, t.strategyName || "No strategy"],
    ]) {
      bucket[key] ||= { name: key, profit: new Decimal(0), trades: 0 };
      bucket[key].profit = bucket[key].profit.plus(pnl);
      bucket[key].trades++;
    }
    if (Number(t.initialRisk) > 0) rValues.push(pnl.div(t.initialRisk));
  }
  let cumulative = new Decimal(0);
  const dailyData = Object.values(daily)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => {
      cumulative = cumulative.plus(d.pnl);
      return { ...d, pnl: d.pnl.toNumber(), equity: cumulative.toNumber() };
    });
  const breakdown = (b) =>
    Object.values(b).map((v) => ({ ...v, profit: v.profit.toNumber() }));
  return {
    totalTrades: closed.length,
    wins,
    losses,
    breakevens,
    winRate: closed.length ? (wins / closed.length) * 100 : 0,
    totalProfit: net.toNumber(),
    profitFactor: grossLoss.gt(0) ? grossWin.div(grossLoss).toNumber() : null,
    avgWin: wins ? grossWin.div(wins).toNumber() : 0,
    avgLoss: losses ? grossLoss.div(losses).toNumber() : 0,
    expectancy: closed.length ? net.div(closed.length).toNumber() : 0,
    maxDrawdown: drawdown.toNumber(),
    avgR: rValues.length
      ? Decimal.sum(...rValues)
          .div(rValues.length)
          .toNumber()
      : null,
    rSample: rValues.length,
    maxWinStreak,
    maxLossStreak,
    dailyData,
    equityCurve: dailyData,
    pairData: breakdown(pairs),
    sessionData: breakdown(sessions),
    dayData: breakdown(weekdays),
    strategyData: breakdown(strategies),
    recentTrades: [...closed].reverse().slice(0, 5),
    winLossData: [
      { name: "Wins", value: wins },
      { name: "Losses", value: losses },
      { name: "Breakeven", value: breakevens },
    ],
  };
}
