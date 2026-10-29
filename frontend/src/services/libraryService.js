import { db, unwrap } from "../lib/supabase";
export const libraryService = (table) => ({
  async list(keyword = "") {
    let rows = [],
      offset = 0;
    while (true) {
      const page = unwrap(
        await db()
          .from(table)
          .select("*")
          .order("created_at", { ascending: false })
          .order("id")
          .range(offset, offset + 499),
      );
      rows.push(...page);
      if (page.length < 500) break;
      offset += 500;
    }
    return rows
      .map((r) => ({ ...r.data, _id: r.id, id: r.id }))
      .filter(
        (r) =>
          !keyword ||
          JSON.stringify(r).toLowerCase().includes(keyword.toLowerCase()),
      );
  },
  async create(input) {
    const data = input instanceof FormData ? Object.fromEntries(input) : input;
    if (Object.values(data).some((v) => v instanceof Blob))
      throw new Error("Attachments are supported on trades.");
    const row = unwrap(
      await db().from(table).insert({ data }).select().single(),
    );
    return { ...row.data, _id: row.id };
  },
  async remove(id) {
    const result = await db().from(table).delete().eq("id", id);
    if (result.error?.code === "23503")
      throw new Error(
        "This strategy is linked to existing trades. Keep it for your trading history.",
      );
    unwrap(result);
  },
});
