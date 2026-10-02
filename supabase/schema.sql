-- VK Home Solutions CRM — database setup
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It is safe to run on a brand-new project only (it creates the tables).

-- ============================================================
-- 1. PROFILES — one row per user (Owen, Jack)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

-- Automatically create a profile whenever a new login account is added.
-- The name comes from the "full_name" user metadata, or the email if missing.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. BUYERS — cash buyers list
-- ============================================================
create table public.buyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text,
  email text,
  areas text[] not null default '{}',            -- cities and/or zip codes
  min_price numeric,
  max_price numeric,
  property_types text[] not null default '{}',   -- e.g. {Single-family, Multi-family}
  rehab_preference text not null default 'Either'
    check (rehab_preference in ('Rehab', 'Turnkey', 'Either')),
  notes text,
  active boolean not null default true,
  created_by uuid references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. LEADS — one row per seller / property
-- ============================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),

  -- Seller
  seller_name text not null,
  phone text,
  email text,

  -- Property
  property_address text,
  city text,
  state text,
  zip text,
  property_type text,
  property_condition text,
  occupancy text,

  -- Lead info
  lead_source text,
  motivation text,
  timeline text,
  asking_price numeric,
  notes text,

  -- Pipeline
  stage text not null default 'New Lead'
    check (stage in ('New Lead', 'Contacted', 'Qualified', 'Offer Made',
                     'Under Contract', 'Assigned', 'Closed', 'Dead',
                     'Long-Term Follow-Up')),
  position double precision not null default 0,  -- order of the card in its column

  -- Follow-up
  next_follow_up_date date,

  -- Deal calculator
  arv numeric,
  repair_estimate numeric,
  mao_percent numeric not null default 70,
  offer_price numeric,
  contract_price numeric,       -- what you pay the seller
  assignment_price numeric,     -- what the buyer pays for the contract
  assigned_buyer_id uuid references public.buyers (id) on delete set null,
  closed_at date,

  created_by uuid references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_stage_idx on public.leads (stage, position);
create index leads_follow_up_idx on public.leads (next_follow_up_date);

-- ============================================================
-- 4. ACTIVITIES — the activity log
-- ============================================================
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  user_id uuid references public.profiles (id) default auth.uid(),
  type text not null
    check (type in ('Call', 'Text', 'Email', 'Note', 'Stage change',
                    'Follow-up set', 'Lead created')),
  content text,
  from_stage text,
  to_stage text,
  created_at timestamptz not null default now()
);

create index activities_lead_idx on public.activities (lead_id, created_at desc);

-- ============================================================
-- AUTOMATIC BEHAVIOR
-- ============================================================

-- Keep updated_at current.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();
create trigger buyers_updated_at before update on public.buyers
  for each row execute function public.set_updated_at();

-- Stamp closed_at the first time a lead reaches "Closed".
create function public.set_closed_at()
returns trigger
language plpgsql
as $$
begin
  if new.stage = 'Closed' and new.closed_at is null then
    new.closed_at = current_date;
  end if;
  return new;
end;
$$;

create trigger leads_closed_at before insert or update of stage on public.leads
  for each row execute function public.set_closed_at();

-- Write activity log entries for new leads, stage changes and follow-up changes.
create function public.log_lead_changes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (lead_id, type, content, to_stage)
    values (new.id, 'Lead created', 'Lead added', new.stage);

    if new.next_follow_up_date is not null then
      insert into public.activities (lead_id, type, content)
      values (new.id, 'Follow-up set',
              'Next follow-up set to ' || to_char(new.next_follow_up_date, 'Mon DD, YYYY'));
    end if;
    return new;
  end if;

  if new.stage is distinct from old.stage then
    insert into public.activities (lead_id, type, content, from_stage, to_stage)
    values (new.id, 'Stage change', old.stage || ' → ' || new.stage, old.stage, new.stage);
  end if;

  if new.next_follow_up_date is distinct from old.next_follow_up_date then
    insert into public.activities (lead_id, type, content)
    values (new.id, 'Follow-up set',
            case when new.next_follow_up_date is null
                 then 'Follow-up date cleared'
                 else 'Next follow-up set to ' || to_char(new.next_follow_up_date, 'Mon DD, YYYY')
            end);
  end if;

  return new;
end;
$$;

create trigger leads_log_changes after insert or update on public.leads
  for each row execute function public.log_lead_changes();

-- ============================================================
-- SECURITY — only logged-in users (Owen and Jack) can see or change data
-- ============================================================
alter table public.profiles enable row level security;
alter table public.buyers enable row level security;
alter table public.leads enable row level security;
alter table public.activities enable row level security;

create policy "Team can read profiles" on public.profiles
  for select to authenticated using (true);
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());

create policy "Team full access to buyers" on public.buyers
  for all to authenticated using (true) with check (true);

create policy "Team full access to leads" on public.leads
  for all to authenticated using (true) with check (true);

create policy "Team can read activities" on public.activities
  for select to authenticated using (true);
create policy "Team can add activities as themselves" on public.activities
  for insert to authenticated with check (user_id = auth.uid());
create policy "Users can delete own activities" on public.activities
  for delete to authenticated using (user_id = auth.uid());
