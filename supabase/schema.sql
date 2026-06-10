-- Onbrand MVP: perfiles, evidencias de patrocinio y storage
-- Ejecutar en el SQL Editor de tu proyecto Supabase

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

alter table public.profiles add column if not exists twitter text;
alter table public.profiles add column if not exists youtube text;
alter table public.profiles add column if not exists twitch text;
alter table public.profiles add column if not exists facebook text;
alter table public.profiles add column if not exists instagram_username text;
alter table public.profiles add column if not exists tiktok_username text;
alter table public.profiles add column if not exists twitter_username text;
alter table public.profiles add column if not exists is_instagram_verified boolean not null default false;
alter table public.profiles add column if not exists is_tiktok_verified boolean not null default false;
alter table public.profiles add column if not exists is_twitter_verified boolean not null default false;
alter table public.profiles add column if not exists social_metrics jsonb not null default '{}'::jsonb;

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

-- Evidencias post-evento (cierre de casos de patrocinio)
create table if not exists public.patrocinios_evidencias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  event_id text not null,
  brand_id text not null,
  delivered boolean,
  rating smallint check (rating >= 1 and rating <= 5),
  review text,
  photo_urls text[] not null default '{}',
  status text not null default 'en_revision_admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patrocinios_evidencias_user_event_idx
  on public.patrocinios_evidencias (user_id, event_id);

alter table public.patrocinios_evidencias enable row level security;

drop policy if exists "patrocinios_evidencias_select_own" on public.patrocinios_evidencias;
create policy "patrocinios_evidencias_select_own"
  on public.patrocinios_evidencias for select
  using (auth.uid() = user_id);

drop policy if exists "patrocinios_evidencias_insert_own" on public.patrocinios_evidencias;
create policy "patrocinios_evidencias_insert_own"
  on public.patrocinios_evidencias for insert
  with check (auth.uid() = user_id);

drop policy if exists "patrocinios_evidencias_update_own" on public.patrocinios_evidencias;
create policy "patrocinios_evidencias_update_own"
  on public.patrocinios_evidencias for update
  using (auth.uid() = user_id);

-- Bucket de evidencias (Dashboard → Storage → New bucket: "evidencias", public)
insert into storage.buckets (id, name, public)
values ('evidencias', 'evidencias', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "evidencias_upload_own" on storage.objects;
create policy "evidencias_upload_own"
  on storage.objects for insert
  with check (
    bucket_id = 'evidencias'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "evidencias_select_public" on storage.objects;
create policy "evidencias_select_public"
  on storage.objects for select
  using (bucket_id = 'evidencias');

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
