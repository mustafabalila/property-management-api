create or replace function api.unassign_member(_department_id bigint, _member_id bigint) returns void as $$
    begin
        delete from api.department_assessment
        where department_id = _department_id and staff_member_id = _member_id;
    end;
$$ language plpgsql;
