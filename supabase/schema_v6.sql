alter table cases add column if not exists proceso_judicial text check (proceso_judicial in ('en_proceso', 'cerrado'));
