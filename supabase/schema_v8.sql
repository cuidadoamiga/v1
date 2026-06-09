-- ============================================================
-- schema_v8: función atómica para votar + auditoría de ediciones
-- ============================================================

-- 1. Función atómica para votar (resuelve race condition)
--    Inserta el voto y actualiza el estado del caso en una sola transacción.
create or replace function votar_caso(
  p_caso_id        uuid,
  p_moderadora_id  uuid,
  p_decision       text,
  p_motivo         text default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_aprobados int;
  v_rechazados int;
  v_nuevo_estado text;
begin
  -- Verificar que el usuario sea moderadora
  if not exists (select 1 from moderators where user_id = p_moderadora_id) then
    raise exception 'No autorizado';
  end if;

  -- Verificar que no haya votado antes
  if exists (
    select 1 from validaciones
    where caso_id = p_caso_id and moderadora_id = p_moderadora_id
  ) then
    raise exception 'Ya votaste este caso';
  end if;

  -- Insertar el voto
  insert into validaciones (caso_id, moderadora_id, decision, motivo_rechazo)
  values (p_caso_id, p_moderadora_id, p_decision, p_motivo);

  -- Contar votos CON LOCK para evitar race condition
  select
    count(*) filter (where decision = 'aprobado'),
    count(*) filter (where decision = 'rechazado')
  into v_aprobados, v_rechazados
  from validaciones
  where caso_id = p_caso_id
  for update;

  -- Determinar nuevo estado
  if v_rechazados > 0 then
    v_nuevo_estado := 'rechazado';
  elsif v_aprobados >= 3 then
    v_nuevo_estado := 'aprobado';
  else
    v_nuevo_estado := 'pendiente';
  end if;

  -- Actualizar caso
  update cases set estado = v_nuevo_estado where id = p_caso_id;

  return jsonb_build_object(
    'estado', v_nuevo_estado,
    'aprobados', v_aprobados,
    'rechazados', v_rechazados
  );
end;
$$;

-- 2. Auditoría de ediciones
alter table cases add column if not exists updated_at timestamptz;

-- Trigger para actualizar updated_at automáticamente
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cases_set_updated_at on cases;
create trigger cases_set_updated_at
  before update on cases
  for each row execute function set_updated_at();

-- Tabla de historial de ediciones
create table if not exists case_edits (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null references cases(id) on delete cascade,
  editor_id       uuid not null references auth.users(id),
  campo           text not null,
  valor_anterior  text,
  valor_nuevo     text,
  edited_at       timestamptz default now()
);

alter table case_edits enable row level security;

create policy "Moderadoras pueden leer ediciones"
  on case_edits for select
  to authenticated
  using (exists (select 1 from moderators where user_id = auth.uid()));
