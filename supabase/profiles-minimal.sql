-- Ejecutá ESTO primero si solo necesitás levantar la app (tabla profiles)
-- Proyecto: pxteiyvxiwugumgnskef → SQL Editor → New query → Run

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  display_name text,
  whatsapp text,
  categories text[] not null default '{}',
  location text default 'CABA',
  bio text,
  tagline text,
  avatar_url text,
  instagram text,
  tiktok text,
  twitter text,
  youtube text,
  twitch text,
  facebook text,
  instagram_username text,
  tiktok_username text,
  twitter_username text,
  is_instagram_verified boolean not null default false,
  is_tiktok_verified boolean not null default false,
  is_twitter_verified boolean not null default false,
  social_metrics jsonb not null default '{}'::jsonb,
  is_configured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
