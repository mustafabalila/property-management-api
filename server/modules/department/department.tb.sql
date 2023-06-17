create table api.department (
    id bigserial primary key,
    name text unique not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
