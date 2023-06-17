create table api.staff_member (
    id bigserial primary key,
    name text not null,
    email text not null,
    phone text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
