-- Agregar columna ciudad a cases
alter table cases add column if not exists ciudad text;
create index if not exists cases_ciudad_idx on cases(ciudad);
