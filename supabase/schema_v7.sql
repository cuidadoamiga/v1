-- ============================================================
-- schema_v7: tabla moderators + reescritura completa de RLS
-- ============================================================

-- 1. Tabla moderators
create table if not exists moderators (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  role      text not null check (role in ('mod', 'owner')),
  created_at timestamptz default now()
);

alter table moderators enable row level security;

-- Cada moderadora puede leer su propia fila
create policy "Moderadora puede leer su propio rol"
  on moderators for select
  to authenticated
  using (auth.uid() = user_id);

-- Owner puede leer todas las filas
create policy "Owner puede leer todos los moderadores"
  on moderators for select
  to authenticated
  using (
    exists (select 1 from moderators m where m.user_id = auth.uid() and m.role = 'owner')
  );

-- ============================================================
-- 2. Eliminar políticas antiguas demasiado amplias en cases
-- ============================================================
drop policy if exists "Moderadoras pueden leer todos los casos"       on cases;
drop policy if exists "Moderadoras pueden actualizar casos"           on cases;
drop policy if exists "Moderadoras pueden eliminar casos"             on cases;
drop policy if exists "Moderadoras pueden insertar casos"             on cases;

-- ============================================================
-- 3. Nuevas políticas en cases
-- ============================================================

-- Público (anon) puede insertar solo con estado = 'pendiente'
create policy "Publico puede reportar casos pendientes"
  on cases for insert
  to anon
  with check (estado = 'pendiente');

-- Moderadoras pueden leer todos los casos
create policy "Moderadoras pueden leer todos los casos"
  on cases for select
  to authenticated
  using (
    exists (select 1 from moderators where user_id = auth.uid())
  );

-- Moderadoras pueden actualizar (votar/cambiar estado)
create policy "Moderadoras pueden actualizar casos"
  on cases for update
  to authenticated
  using (
    exists (select 1 from moderators where user_id = auth.uid())
  );

-- Solo el owner puede eliminar casos
create policy "Solo owner puede eliminar casos"
  on cases for delete
  to authenticated
  using (
    exists (select 1 from moderators where user_id = auth.uid() and role = 'owner')
  );

-- Owner puede insertar casos directamente (con cualquier estado)
create policy "Owner puede insertar casos directos"
  on cases for insert
  to authenticated
  with check (
    exists (select 1 from moderators where user_id = auth.uid() and role = 'owner')
  );

-- ============================================================
-- 4. Reescribir políticas en validaciones
-- ============================================================
drop policy if exists "Moderadoras pueden leer validaciones"    on validaciones;
drop policy if exists "Moderadoras pueden insertar validaciones" on validaciones;

create policy "Moderadoras pueden leer validaciones"
  on validaciones for select
  to authenticated
  using (exists (select 1 from moderators where user_id = auth.uid()));

create policy "Moderadoras pueden insertar validaciones"
  on validaciones for insert
  to authenticated
  with check (exists (select 1 from moderators where user_id = auth.uid()));

-- ============================================================
-- 5. Reescribir políticas en solicitudes_moderadoras
-- ============================================================
drop policy if exists "Moderadoras pueden leer solicitudes"    on solicitudes_moderadoras;
drop policy if exists "Moderadoras pueden eliminar solicitudes" on solicitudes_moderadoras;

create policy "Moderadoras pueden leer solicitudes"
  on solicitudes_moderadoras for select
  to authenticated
  using (exists (select 1 from moderators where user_id = auth.uid()));

-- Solo owner puede eliminar solicitudes
create policy "Solo owner puede eliminar solicitudes"
  on solicitudes_moderadoras for delete
  to authenticated
  using (
    exists (select 1 from moderators where user_id = auth.uid() and role = 'owner')
  );

-- ============================================================
-- 6. Registrar al owner en la tabla moderators
-- Reemplazá <UUID-DEL-OWNER> con el UUID real de cuidadoamiga@proton.me
-- Lo encontrás en Supabase > Authentication > Users
-- ============================================================
-- insert into moderators (user_id, role) values ('<UUID-DEL-OWNER>', 'owner')
-- on conflict (user_id) do update set role = 'owner';
