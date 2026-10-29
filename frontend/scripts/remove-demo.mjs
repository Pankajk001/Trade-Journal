import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
const env = Object.fromEntries(
  (await readFile(new URL("../.env.local", import.meta.url), "utf8"))
    .split(/\r?\n/)
    .filter((line) => line.includes("="))
    .map((line) => [
      line.slice(0, line.indexOf("=")),
      line.slice(line.indexOf("=") + 1).trim(),
    ]),
);
if (!process.env.DEMO_EMAIL || !process.env.DEMO_PASSWORD)
  throw new Error("Provide account credentials through environment variables.");
const client = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const check = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};
const tag = "journal-preview-v1";
try {
  const { user } = check(
    await client.auth.signInWithPassword({
      email: process.env.DEMO_EMAIL,
      password: process.env.DEMO_PASSWORD,
    }),
  );
  const stable = (label) => {
    const h = createHash("sha256")
      .update(user.id + ":" + tag + ":" + label)
      .digest("hex");
    return (
      h.slice(0, 8) +
      "-" +
      h.slice(8, 12) +
      "-4" +
      h.slice(13, 16) +
      "-a" +
      h.slice(17, 20) +
      "-" +
      h.slice(20, 32)
    );
  };
  const targets = {};
  for (const [table, count, label] of [
    ["trades", 16, "trade"],
    ["strategies", 3, "strategy"],
    ["mistakes", 2, "mistake"],
    ["notes", 2, "note"],
  ]) {
    const ids = Array.from({ length: count }, (_, i) =>
      stable(label + "-" + (table === "trades" ? i + 1 : i)),
    );
    const column = table === "trades" ? "details" : "data";
    targets[table] = check(
      await client
        .from(table)
        .select("*")
        .eq("user_id", user.id)
        .in("id", ids)
        .eq(column + "->>demoSet", tag),
    );
  }
  const reviews = check(
    await client
      .from("daily_reviews")
      .select("*")
      .eq("user_id", user.id)
      .in("day", ["2026-10-20", "2026-10-26", "2026-10-28"]),
  );
  targets.daily_reviews = reviews.filter(
    (r) =>
      r.plan ===
        "DEMO: Mark the prior session range. Take only a setup that passes the playbook checklist. Stop after two planned losses." &&
      r.lesson ===
        "DEMO: Write the invalidation before entering. Review the decision separately from the result." &&
      r.reflection ===
        (r.day.endsWith("28")
          ? "DEMO: Stayed out because no clear setup developed. Protected attention and capital."
          : "DEMO: Reviewed the sample executions. Patience at the planned level produced a clearer entry than chasing the first candle.") &&
      r.no_trade_reason ===
        (r.day.endsWith("28") ? "DEMO: No qualifying setup." : ""),
  );
  const accounts = check(
    await client
      .from("accounts")
      .select("*")
      .eq("id", stable("account"))
      .eq("user_id", user.id),
  );
  targets.accounts = accounts.filter(
    (a) => a.name === "Demo Studio · Sample trades" && a.kind === "Demo",
  );
  console.log(
    "Identified sample records: " +
      JSON.stringify(
        Object.fromEntries(
          Object.entries(targets).map(([table, rows]) => [table, rows.length]),
        ),
      ),
  );
  if (process.argv.includes("--apply")) {
    const backupDir = new URL("../../backups/", import.meta.url);
    await mkdir(backupDir, { recursive: true });
    const backupFile = new URL(
      "demo-cleanup-" +
        new Date().toISOString().replace(/[:.]/g, "-") +
        ".json",
      backupDir,
    );
    await writeFile(
      backupFile,
      JSON.stringify(
        { createdAt: new Date().toISOString(), records: targets },
        null,
        2,
      ),
    );
    const removed = {};
    for (const table of ["trades", "notes", "mistakes", "daily_reviews"]) {
      const ids = targets[table].map((r) => r.id);
      removed[table] = ids.length
        ? check(
            await client
              .from(table)
              .delete()
              .eq("user_id", user.id)
              .in("id", ids)
              .select("id"),
          ).length
        : 0;
    }
    for (const table of ["strategies", "accounts"]) {
      removed[table] = 0;
      for (const record of targets[table]) {
        const references = check(
          await client
            .from("trades")
            .select("id")
            .eq(table === "accounts" ? "account_id" : "strategy_id", record.id)
            .limit(1),
        );
        if (!references.length)
          removed[table] += check(
            await client
              .from(table)
              .delete()
              .eq("user_id", user.id)
              .eq("id", record.id)
              .select("id"),
          ).length;
      }
    }
    console.log("Removed sample records: " + JSON.stringify(removed));
    console.log(
      "Recovery backup saved in ignored backups/ directory. Existing non-sample records were preserved.",
    );
  } else
    console.log(
      "Preview only. Use --apply to remove these identified sample records.",
    );
  await client.auth.signOut({ scope: "local" });
} catch (error) {
  console.error("Sample cleanup stopped: " + error.message);
  process.exitCode = 1;
}
