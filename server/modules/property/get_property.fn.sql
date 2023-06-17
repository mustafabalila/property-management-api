create or replace function api.get_property(_id bigint) returns jsonb as $$
    select jsonb_build_object('property', property) from api.property where id = _id;
$$ language sql;