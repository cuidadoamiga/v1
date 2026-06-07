-- Tabla de solicitudes de moderadoras
create table if not exists solicitudes_moderadoras (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  mail text not null,
  pais text not null,
  organizacion text,
  motivo text not null,
  como_se_entero text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  creado_at timestamptz default now()
);

alter table solicitudes_moderadoras enable row level security;

-- Solo service role puede leer/actualizar solicitudes
create policy "Admin leer solicitudes" on solicitudes_moderadoras
  for select using (auth.role() = 'service_role');

create policy "Admin actualizar solicitudes" on solicitudes_moderadoras
  for update using (auth.role() = 'service_role');

-- Inserción pública (envío del formulario)
create policy "Insertar solicitud" on solicitudes_moderadoras
  for insert with check (true);

-- Tabla de validaciones (sistema de 3 moderadoras)
create table if not exists validaciones (
  id uuid default gen_random_uuid() primary key,
  caso_id uuid not null references cases(id) on delete cascade,
  moderadora_id uuid not null references auth.users(id),
  decision text not null check (decision in ('aprobado', 'rechazado')),
  motivo_rechazo text,
  created_at timestamptz default now(),
  unique(caso_id, moderadora_id)
);

alter table validaciones enable row level security;

create policy "Moderadoras leer validaciones" on validaciones
  for select using (auth.role() = 'authenticated');

create policy "Moderadoras insertar validacion" on validaciones
  for insert with check (auth.uid() = moderadora_id);

-- Índices
create index if not exists validaciones_caso_idx on validaciones(caso_id);
create index if not exists validaciones_moderadora_idx on validaciones(moderadora_id);
