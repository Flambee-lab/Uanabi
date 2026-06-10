-- Wizard de Invitación a Marcas — tabla de persistencia
-- Ejecutar en Supabase → SQL Editor

create table if not exists public.invitaciones_marcas (
  id uuid primary key default gen_random_uuid(),
  evento_id text not null,
  marca_nombre text not null,
  productos_solicitados text[] not null default '{}',
  entregables_ofrecidos text[] not null default '{}',
  fecha_limite_entrega date,
  mensaje_extra text,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

-- Columnas anti-fricción (ejecutar si la tabla ya existía)
alter table public.invitaciones_marcas add column if not exists cantidad_estimada text;
alter table public.invitaciones_marcas add column if not exists direccion_entrega text;
alter table public.invitaciones_marcas add column if not exists horario_recepcion text;
alter table public.invitaciones_marcas add column if not exists contacto_en_sitio text;
alter table public.invitaciones_marcas add column if not exists whatsapp text;
alter table public.invitaciones_marcas add column if not exists mensaje_respuesta text;

create index if not exists invitaciones_marcas_evento_id_idx
  on public.invitaciones_marcas (evento_id);

create index if not exists invitaciones_marcas_estado_idx
  on public.invitaciones_marcas (estado);

alter table public.invitaciones_marcas enable row level security;

-- MVP: permitir insert/select autenticados (ajustar en producción)
drop policy if exists "invitaciones_insert_authenticated" on public.invitaciones_marcas;
create policy "invitaciones_insert_authenticated"
  on public.invitaciones_marcas
  for insert
  to authenticated
  with check (true);

drop policy if exists "invitaciones_select_authenticated" on public.invitaciones_marcas;
create policy "invitaciones_select_authenticated"
  on public.invitaciones_marcas
  for select
  to authenticated
  using (true);
