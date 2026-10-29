import { readFile } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import assert from "node:assert/strict";
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
  throw new Error("Supply credentials through the process environment.");
const options = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
};
const client = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
  options,
);
const anonymous = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
  options,
);
const bucket = "journal-images",
  created = [];
const check = (result) => {
  if (result.error) throw new Error(result.error.message);
  return result.data;
};
try {
  const { user } = check(
    await client.auth.signInWithPassword({
      email: process.env.DEMO_EMAIL,
      password: process.env.DEMO_PASSWORD,
    }),
  );
  const bytes = await readFile(
    new URL("../tests/fixtures/chart.png", import.meta.url),
  );
  const path = user.id + "/" + randomUUID() + ".png";
  check(
    await client.storage
      .from(bucket)
      .upload(path, bytes, { contentType: "image/png", upsert: false }),
  );
  created.push(path);
  const downloaded = check(await client.storage.from(bucket).download(path));
  const hash = (data) => createHash("sha256").update(data).digest("hex");
  assert.equal(hash(Buffer.from(await downloaded.arrayBuffer())), hash(bytes));
  const noLogin = await anonymous.storage.from(bucket).download(path);
  assert.ok(noLogin.error, "Anonymous download unexpectedly succeeded.");
  const publicResponse = await fetch(
    env.VITE_SUPABASE_URL + "/storage/v1/object/public/" + bucket + "/" + path,
  );
  assert.equal(
    publicResponse.ok,
    false,
    "A private image was served from the public endpoint.",
  );
  const foreignPath = randomUUID() + "/" + randomUUID() + ".png";
  const foreign = await client.storage
    .from(bucket)
    .upload(foreignPath, bytes, { contentType: "image/png", upsert: false });
  if (!foreign.error) {
    created.push(foreignPath);
    throw new Error("Storage allowed a write outside the owner's folder.");
  }
  console.log(
    JSON.stringify(
      {
        upload: true,
        downloadMatchesOriginal: true,
        anonymousDownloadBlocked: true,
        publicUrlBlocked: true,
        foreignFolderUploadBlocked: true,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error("Storage check failed: " + error.message);
  process.exitCode = 1;
} finally {
  if (created.length) {
    const cleanup = await client.storage.from(bucket).remove(created);
    if (cleanup.error) {
      console.error("Temporary image cleanup failed: " + cleanup.error.message);
      process.exitCode = 1;
    } else console.log("Temporary test images removed.");
  }
  await client.auth.signOut({ scope: "local" });
}
