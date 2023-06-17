create or replace function api.get_assignments(_id bigint) returns jsonb as $$
    select jsonb_build_object('assignment', assignment) from api.assignment where id = _id;
$$ language sql;