-- Tabla principal de casos
create table if not exists cases (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  fecha date not null,
  tipo text not null check (tipo in ('femicidio', 'abuso', 'acoso')),
  pais text not null,
  descripcion text,
  foto_url text,
  fuentes text[] default '{}',
  lat double precision not null,
  lng double precision not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobado', 'rechazado')),
  creado_at timestamptz default now()
);

-- Índices
create index if not exists cases_estado_idx on cases(estado);
create index if not exists cases_tipo_idx on cases(tipo);
create index if not exists cases_pais_idx on cases(pais);

-- RLS (Row Level Security)
alter table cases enable row level security;

-- Lectura pública solo de casos aprobados
create policy "Leer casos aprobados" on cases
  for select using (estado = 'aprobado');

-- Inserción pública (pasa a pendiente)
create policy "Insertar casos" on cases
  for insert with check (estado = 'pendiente');

-- Solo service role puede actualizar/eliminar
create policy "Admin actualizar" on cases
  for update using (auth.role() = 'service_role');

create policy "Admin eliminar" on cases
  for delete using (auth.role() = 'service_role');
