-- UANABI Brands — rol de marca en perfiles + templates de rechazo
-- Ejecutar en Supabase → SQL Editor

alter table public.profiles add column if not exists role text not null default 'host';
alter table public.profiles add column if not exists cuit text;
alter table public.profiles add column if not exists razon_social text;
alter table public.profiles add column if not exists brand_category text;
alter table public.profiles add column if not exists corporate_email text;
alter table public.profiles add column if not exists brand_instagram text;
alter table public.profiles add column if not exists brand_catalog_offers text[] not null default '{}';
alter table public.profiles add column if not exists brand_website text;
alter table public.profiles add column if not exists brand_description text;
alter table public.profiles add column if not exists brand_logo_url text;
alter table public.profiles add column if not exists brand_tiktok text;
alter table public.profiles add column if not exists brand_linkedin text;
alter table public.profiles add column if not exists corporate_email_verified boolean not null default false;
alter table public.profiles add column if not exists verification_submitted boolean not null default false;
alter table public.profiles add column if not exists verification_status text;
alter table public.profiles add column if not exists brand_verified boolean not null default false;
alter table public.profiles add column if not exists template_stock text;
alter table public.profiles add column if not exists template_audiencia text;
alter table public.profiles add column if not exists template_nicho text;
alter table public.profiles add column if not exists brand_products jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists brand_preferred_niches text[] not null default '{}';
alter table public.profiles add column if not exists brand_contact_whatsapp text;

create index if not exists profiles_role_idx on public.profiles (role);

-- Invitaciones: permitir update de estado y mensaje_respuesta (panel de marcas)
drop policy if exists "invitaciones_update_authenticated" on public.invitaciones_marcas;
create policy "invitaciones_update_authenticated"
  on public.invitaciones_marcas
  for update
  to authenticated
  using (true)
  with check (true);

-- Valores por defecto sugeridos para templates (opcional en seed)
comment on column public.profiles.template_stock is 'Template rechazo: agenda completa / sin stock';
comment on column public.profiles.template_audiencia is 'Template rechazo: audiencia insuficiente';
comment on column public.profiles.template_nicho is 'Template rechazo: incompatibilidad de nicho';
