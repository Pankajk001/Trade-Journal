-- Run once against a new Supabase project.
begin;
create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 name text not null default '', currency text not null default 'USD',
 timezone text not null default 'Asia/Kolkata', created_at timestamptz not null default now()
);
create table public.accounts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users on delete cascade,
 name text not null check(length(trim(name))>0),
 currency text not null default 'USD' check(currency ~ '^[A-Z]{3}$'),
 kind text not null default 'Demo' check(kind in ('Live','Demo','Prop')),
 starting_balance numeric(20,2) not null default 0 check(starting_balance>=0),
 created_at timestamptz not null default now(), unique(id,user_id)
);
create table public.strategies (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users on delete cascade,
 data jsonb not null default '{}', created_at timestamptz not null default now(), unique(id,user_id)
);
create table public.mistakes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users on delete cascade,
 data jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.notes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users on delete cascade,
 data jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.trades (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users on delete cascade,
 account_id uuid not null, strategy_id uuid,
 instrument text not null check(length(trim(instrument))>0),
 direction text not null check(direction in ('Long','Short')),
 status text not null default 'Closed' check(status in ('Open','Closed')),
 traded_at timestamptz not null, closed_at timestamptz,
 net_pnl numeric(20,2), initial_risk numeric(20,2) check(initial_risk>0),
 reviewed boolean not null default false, details jsonb not null default '{}',
 deleted_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 foreign key(account_id,user_id) references public.accounts(id,user_id),
 foreign key(strategy_id,user_id) references public.strategies(id,user_id),
 check(status<>'Closed' or (net_pnl is not null and closed_at is not null)),
 check(closed_at is null or closed_at>=traded_at)
);
create index trades_owner_date on public.trades(user_id,traded_at desc);
create table public.daily_reviews (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users on delete cascade,
 day date not null, plan text not null default '', reflection text not null default '',
 lesson text not null default '', no_trade_reason text not null default '',
 updated_at timestamptz not null default now(), unique(user_id,day)
);
create function public.set_updated_at() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now(); return new; end;
$$;
create trigger trades_updated before update on public.trades for each row execute function public.set_updated_at();
create trigger reviews_updated before update on public.daily_reviews for each row execute function public.set_updated_at();
do $$ declare t text; begin
 foreach t in array array['accounts','strategies','mistakes','notes','trades','daily_reviews'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('create policy owner_access on public.%I for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id)',t);
  execute format('grant select,insert,update,delete on public.%I to authenticated',t);
  execute format('revoke all on public.%I from anon',t);
 end loop;
end $$;
alter table public.profiles enable row level security;
create policy owner_access on public.profiles for all to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
grant select,insert,update on public.profiles to authenticated;
revoke all on public.profiles from anon;
commit;
