import { db, currentUser, unwrap } from "../lib/supabase";
export const journalService = {
  async accounts() {
    return unwrap(await db().from("accounts").select("*").order("created_at"));
  },
  async createAccount(data) {
    return unwrap(await db().from("accounts").insert(data).select().single());
  },
  async profile() {
    const user = await currentUser();
    const row = unwrap(
      await db().from("profiles").select("*").eq("id", user.id).maybeSingle(),
    );
    return (
      row || {
        id: user.id,
        name: user.user_metadata?.name || "",
        currency: "USD",
        timezone: "Asia/Kolkata",
      }
    );
  },
  async saveProfile(data) {
    const user = await currentUser();
    return unwrap(
      await db()
        .from("profiles")
        .upsert({ ...data, id: user.id })
        .select()
        .single(),
    );
  },
  async review(day) {
    return unwrap(
      await db().from("daily_reviews").select("*").eq("day", day).maybeSingle(),
    );
  },
  async saveReview(data) {
    const user = await currentUser();
    return unwrap(
      await db()
        .from("daily_reviews")
        .upsert({ ...data, user_id: user.id }, { onConflict: "user_id,day" })
        .select()
        .single(),
    );
  },
  async exportData() {
    const tables = [
      "profiles",
      "accounts",
      "trades",
      "strategies",
      "mistakes",
      "notes",
      "daily_reviews",
    ];
    const result = { version: 1, exportedAt: new Date().toISOString() };
    for (const table of tables) {
      let rows = [],
        offset = 0;
      while (true) {
        const page = unwrap(
          await db()
            .from(table)
            .select("*")
            .order("id")
            .range(offset, offset + 499),
        );
        rows.push(...page);
        if (page.length < 500) break;
        offset += 500;
      }
      result[table] = rows;
    }
    return result;
  },
};
