create table api.property (
    id bigserial primary key,
    building_id bigint references api.building(id) on delete cascade not null,
    name text not null,
    description text,
    type text not null,
    bedrooms smallint not null,
    bathrooms smallint not null,
    floor_number smallint not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
