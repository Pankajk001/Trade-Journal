import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("storage setup is repeatable and isolates private user folders", async () => {
  const pg = new PGlite();
  const alice = "11111111-1111-4111-8111-111111111111",
    bob = "22222222-2222-4222-8222-222222222222";
  try {
    await pg.exec(`create schema auth; create schema storage; create role authenticated; create role anon;
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function storage.foldername(object_name text) returns text[] language sql immutable as $$ select (string_to_array(object_name,'/'))[1:cardinality(string_to_array(object_name,'/'))-1] $$;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text);
      alter table storage.objects enable row level security;
      grant usage on schema storage,auth to authenticated,anon;
      grant select,insert,update,delete on storage.objects to authenticated,anon;
      grant execute on function auth.uid(),storage.foldername(text) to authenticated,anon;`);
    const migration = await readFile(
      new URL(
        "../../supabase/migrations/002_private_storage.sql",
        import.meta.url,
      ),
      "utf8",
    );
    await pg.exec(migration);
    await pg.exec(migration);
    const {
      rows: [bucket],
    } = await pg.query(
      "select * from storage.buckets where id='journal-images'",
    );
    assert.equal(bucket.public, false);
    assert.equal(Number(bucket.file_size_limit), 5242880);
    assert.deepEqual(bucket.allowed_mime_types, [
      "image/png",
      "image/jpeg",
      "image/webp",
    ]);
    await pg.query(
      "insert into storage.buckets(id,name,public) values ('other-bucket','other-bucket',false)",
    );
    await pg.exec("set role authenticated");
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      alice,
    ]);
    await pg.query(
      "insert into storage.objects(bucket_id,name) values ('journal-images',$1)",
      [alice + "/chart.png"],
    );
    assert.equal(
      (await pg.query("select * from storage.objects")).rows.length,
      1,
    );
    await assert.rejects(() =>
      pg.query(
        "insert into storage.objects(bucket_id,name) values ('journal-images',$1)",
        [bob + "/chart.png"],
      ),
    );
    await assert.rejects(() =>
      pg.query(
        "insert into storage.objects(bucket_id,name) values ('other-bucket',$1)",
        [alice + "/chart.png"],
      ),
    );
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      bob,
    ]);
    assert.equal(
      (await pg.query("select * from storage.objects")).rows.length,
      0,
    );
    assert.equal(
      (await pg.query("delete from storage.objects returning id")).rows.length,
      0,
    );
    await pg.exec("reset role;set role anon");
    assert.equal(
      (await pg.query("select * from storage.objects")).rows.length,
      0,
    );
    await assert.rejects(() =>
      pg.query(
        "insert into storage.objects(bucket_id,name) values ('journal-images',$1)",
        [bob + "/chart.png"],
      ),
    );
    await pg.exec("reset role;set role authenticated");
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      alice,
    ]);
    assert.equal(
      (await pg.query("delete from storage.objects returning id")).rows.length,
      1,
    );
  } finally {
    await pg.close();
  }
});
