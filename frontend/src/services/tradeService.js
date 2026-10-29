import { db, unwrap } from "../lib/supabase";
import Decimal from "decimal.js";
export function tradeView(r) {
  const pnl = r.net_pnl == null ? null : Number(r.net_pnl);
  return {
    ...r.details,
    _id: r.id,
    id: r.id,
    accountId: r.account_id,
    strategyId: r.strategy_id,
    pair: r.instrument,
    direction: r.direction,
    tradeStatus: r.status,
    date: r.traded_at,
    closedAt: r.closed_at,
    netPnl: pnl,
    profitLoss: pnl,
    initialRisk: r.initial_risk,
    reviewed: r.reviewed,
    deletedAt: r.deleted_at,
    rMultiple:
      r.initial_risk && pnl != null
        ? new Decimal(pnl).div(r.initial_risk).toNumber()
        : null,
    winLoss:
      r.status === "Open"
        ? "Open"
        : pnl > 0
          ? "Win"
          : pnl < 0
            ? "Loss"
            : "Breakeven",
  };
}
const service = {
  async all({ deleted = false } = {}) {
    let rows = [],
      offset = 0;
    while (true) {
      let query = db()
        .from("trades")
        .select("*")
        .order("traded_at", { ascending: false })
        .order("id");
      query = deleted
        ? query.not("deleted_at", "is", null)
        : query.is("deleted_at", null);
      const page = unwrap(await query.range(offset, offset + 499));
      rows.push(...page);
      if (page.length < 500) break;
      offset += 500;
    }
    return rows.map(tradeView);
  },
  async getTrades(keyword = "", winLoss = "", session = "", pageNumber = 1) {
    const rows = (await service.all()).filter(
      (t) =>
        (!keyword ||
          (t.pair + " " + (t.strategyName || ""))
            .toLowerCase()
            .includes(keyword.toLowerCase())) &&
        (!winLoss || t.winLoss === winLoss) &&
        (!session || t.session === session),
    );
    return {
      trades: rows.slice((pageNumber - 1) * 20, pageNumber * 20),
      page: pageNumber,
      pages: Math.ceil(rows.length / 20),
      total: rows.length,
    };
  },
  async getTradeById(id) {
    return tradeView(
      unwrap(
        await db()
          .from("trades")
          .select("*")
          .eq("id", id)
          .is("deleted_at", null)
          .single(),
      ),
    );
  },
  async save(input, id) {
    const pnl = input.tradeStatus === "Open" ? null : input.netPnl;
    if (pnl !== null && (pnl === "" || !Number.isFinite(Number(pnl))))
      throw new Error("Enter the broker-reported net result.");
    const row = {
      account_id: input.accountId,
      strategy_id: input.strategyId || null,
      instrument: input.pair.trim().toUpperCase(),
      direction: input.direction,
      status: input.tradeStatus,
      traded_at: new Date(input.date).toISOString(),
      closed_at:
        input.tradeStatus === "Closed"
          ? new Date(input.closedAt).toISOString()
          : null,
      net_pnl: pnl === null ? null : new Decimal(pnl).toFixed(2),
      initial_risk: input.initialRisk
        ? new Decimal(input.initialRisk).toFixed(2)
        : null,
      reviewed: Boolean(input.reviewed),
      details: input.details || {},
    };
    const query = id
      ? db().from("trades").update(row).eq("id", id)
      : db().from("trades").insert(row);
    return tradeView(unwrap(await query.select().single()));
  },
  async deleteTrade(id) {
    unwrap(
      await db()
        .from("trades")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id),
    );
  },
  async restore(id) {
    unwrap(await db().from("trades").update({ deleted_at: null }).eq("id", id));
  },
};
export default service;
