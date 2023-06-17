create or replace function api.get_building(_id bigint) returns jsonb as $$
    select jsonb_build_object('building', building) from api.building where id = _id;
$$ language sql;