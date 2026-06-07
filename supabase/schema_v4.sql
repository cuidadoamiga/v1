-- Permitir a usuarios autenticados (moderadoras) leer todos los casos
create policy "Moderadoras pueden leer todos los casos"
  on cases for select
  to authenticated
  using (true);

-- Permitir a usuarios autenticados actualizar estado de casos
create policy "Moderadoras pueden actualizar casos"
  on cases for update
  to authenticated
  using (true);

-- Permitir a usuarios autenticados eliminar casos
create policy "Moderadoras pueden eliminar casos"
  on cases for delete
  to authenticated
  using (true);

-- Permitir a usuarios autenticados leer validaciones
create policy "Moderadoras pueden leer validaciones"
  on validaciones for select
  to authenticated
  using (true);

-- Permitir a usuarios autenticados insertar validaciones
create policy "Moderadoras pueden insertar validaciones"
  on validaciones for insert
  to authenticated
  with check (true);

-- Permitir a usuarios autenticados leer solicitudes
create policy "Moderadoras pueden leer solicitudes"
  on solicitudes_moderadoras for select
  to authenticated
  using (true);

-- Permitir a usuarios autenticados eliminar solicitudes
create policy "Moderadoras pueden eliminar solicitudes"
  on solicitudes_moderadoras for delete
  to authenticated
  using (true);
