-- subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  status text not null,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- optional: link users to stripe customer ids
create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  created_at timestamptz not null default now()
);

-- cache of active feature entitlements per user (synced from Stripe)
create table if not exists public.user_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_key text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, feature_key)
);
create index if not exists user_entitlements_user_id_idx on public.user_entitlements(user_id);

-- ha_instances table for multi-HA
create table if not exists public.ha_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  hass_url text not null,
  hass_token text not null,
  created_at timestamptz not null default now()
);
create index if not exists ha_instances_user_id_idx on public.ha_instances(user_id);


-- RLS policies for ha_instances
alter table if exists public.ha_instances enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ha_instances' and policyname = 'ha_instances_select_own'
  ) then
    create policy ha_instances_select_own on public.ha_instances
      for select using (auth.uid() = user_id);
  end if;
end $$;


-- RLS policies for billing_customers (user can manage their own mapping)
alter table if exists public.billing_customers enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'billing_customers' and policyname = 'billing_customers_select_own'
  ) then
    create policy billing_customers_select_own on public.billing_customers
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'billing_customers' and policyname = 'billing_customers_insert_own'
  ) then
    create policy billing_customers_insert_own on public.billing_customers
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'billing_customers' and policyname = 'billing_customers_update_own'
  ) then
    create policy billing_customers_update_own on public.billing_customers
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- RLS policies for user_entitlements (user can manage their own cached features)
alter table if exists public.user_entitlements enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_entitlements' and policyname = 'user_entitlements_select_own'
  ) then
    create policy user_entitlements_select_own on public.user_entitlements
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_entitlements' and policyname = 'user_entitlements_insert_own'
  ) then
    create policy user_entitlements_insert_own on public.user_entitlements
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_entitlements' and policyname = 'user_entitlements_update_own'
  ) then
    create policy user_entitlements_update_own on public.user_entitlements
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'user_entitlements' and policyname = 'user_entitlements_delete_own'
  ) then
    create policy user_entitlements_delete_own on public.user_entitlements
      for delete using (auth.uid() = user_id);
  end if;
end $$;


-- RLS policies for subscriptions (user can upsert their own rows via success page)
alter table if exists public.subscriptions enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'subscriptions_select_own'
  ) then
    create policy subscriptions_select_own on public.subscriptions
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'subscriptions_insert_own'
  ) then
    create policy subscriptions_insert_own on public.subscriptions
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'subscriptions_update_own'
  ) then
    create policy subscriptions_update_own on public.subscriptions
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ha_instances' and policyname = 'ha_instances_insert_own'
  ) then
    create policy ha_instances_insert_own on public.ha_instances
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ha_instances' and policyname = 'ha_instances_update_own'
  ) then
    create policy ha_instances_update_own on public.ha_instances
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ha_instances' and policyname = 'ha_instances_delete_own'
  ) then
    create policy ha_instances_delete_own on public.ha_instances
      for delete using (auth.uid() = user_id);
  end if;
end $$;


