create or replace function api.get_department(_id bigint) returns jsonb as $$
    select jsonb_build_object('department', department) from api.department where id = _id;
$$ language sql;