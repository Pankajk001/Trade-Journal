import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("database enforces owner isolation, account ownership, valid closed trades, and recovery", async () => {
  const pg = new PGlite();
  try {
    await pg.exec(`create schema auth; create role authenticated; create role anon;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth,public to authenticated,anon;
 grant execute on function auth.uid() to authenticated,anon;`);
    await pg.exec(
      await readFile(
        new URL("../../supabase/migrations/001_journal.sql", import.meta.url),
        "utf8",
      ),
    );
    const alice = "11111111-1111-4111-8111-111111111111",
      bob = "22222222-2222-4222-8222-222222222222";
    await pg.query("insert into auth.users values ($1),($2)", [alice, bob]);
    await pg.exec("set role authenticated");
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      alice,
    ]);
    const {
      rows: [account],
    } = await pg.query(
      "insert into public.accounts(name,currency) values ('Alice account','USD') returning id",
    );
    await pg.query("insert into profiles(id,name) values ($1,'Alice')", [
      alice,
    ]);
    const {
      rows: [trade],
    } = await pg.query(
      "insert into trades(account_id,instrument,direction,status,traded_at,closed_at,net_pnl) values ($1,'EURUSD','Long','Closed',now(),now(),0) returning id",
      [account.id],
    );
    await assert.rejects(() =>
      pg.query(
        "insert into trades(account_id,instrument,direction,status,traded_at) values ($1,'BTCUSD','Long','Closed',now())",
        [account.id],
      ),
    );
    await assert.rejects(() =>
      pg.query(
        "update trades set closed_at=traded_at-interval '1 hour' where id=$1",
        [trade.id],
      ),
    );
    await pg.query("update trades set deleted_at=now() where id=$1", [
      trade.id,
    ]);
    assert.equal(
      (await pg.query("select id from trades where deleted_at is null")).rows
        .length,
      0,
    );
    await pg.query("update trades set deleted_at=null where id=$1", [trade.id]);
    assert.equal(
      (await pg.query("select id from trades where deleted_at is null")).rows
        .length,
      1,
    );
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      bob,
    ]);
    assert.equal((await pg.query("select * from accounts")).rows.length, 0);
    assert.equal((await pg.query("select * from trades")).rows.length, 0);
    assert.equal((await pg.query("select * from profiles")).rows.length, 0);
    assert.equal(
      (await pg.query("update trades set net_pnl=999 returning id")).rows
        .length,
      0,
    );
    await assert.rejects(() =>
      pg.query("insert into accounts(name,user_id) values ('Spoofed',$1)", [
        alice,
      ]),
    );
    await assert.rejects(() =>
      pg.query(
        "insert into trades(account_id,instrument,direction,status,traded_at) values ($1,'BTCUSD','Long','Open',now())",
        [account.id],
      ),
    );
    await assert.rejects(() =>
      pg.query("insert into profiles(id,name) values ($1,'Spoof')", [alice]),
    );
    await pg.exec("reset role; set role anon");
    await assert.rejects(() => pg.query("select * from trades"));
  } finally {
    await pg.close();
  }
});
