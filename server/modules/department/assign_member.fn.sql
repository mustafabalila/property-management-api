create or replace function api.assign_member(_department_id bigint, _member_id bigint) returns void as $$
    begin
        insert into api.department_assessment(department_id, staff_member_id) 
        values (_department_id, _member_id)
        on conflict do nothing;
    end;
$$ language plpgsql;
