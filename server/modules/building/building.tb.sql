create table api.building (
    id bigserial primary key,
    name text not null,
    city text not null,
    state text not null,
    coordinates point not null,
    description text not null,
    managed_by bigint references api.staff_member(id) on delete set null,
    address text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index building_name_city_idx on api.building (name, city);