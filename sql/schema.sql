create table if not exists favorites (
  id            bigint generated always as identity primary key,
  tmdb_id       integer not null unique,
  title         text not null,
  overview      text,
  poster_path   text,
  release_date  date,
  vote_average  numeric(3,1),
  note          text,
  rating        smallint check (rating between 1 and 10),
  created_at    timestamptz not null default now()
);
alter table favorites enable row level security;
-- service_role ключ обходить RLS, тому додаткові політики для бекенду не потрібні
