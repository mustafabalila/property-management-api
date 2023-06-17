create or replace function api.get_staff_member(_id bigint) returns jsonb as $$
    select jsonb_build_object('member', staff_member) from api.staff_member where id = _id;
$$ language sql;