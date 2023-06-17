create or replace function api.update_assignment(_assignment jsonb) returns void as $$
    declare
        _id bigint := (_assignment->>'id')::bigint;
        _property_id bigint := (_assignment->>'property_id')::bigint;
        _department_id bigint := (_assignment->>'department_id')::bigint;
        _member_id bigint := (_assignment->>'member_id')::bigint;
        _description text := _assignment->>'description';
        _due_date date := (_assignment->>'due_date')::date;
        _status api.assignment_status := (_assignment->>'status')::api.assignment_status;
    begin
        update api.assignment set
            property_id = _property_id,
            department_id = _department_id,
            member_id = _member_id,
            description = _description,
            due_date = _due_date,
            status = _status,
            updated_at = now()
        where id = _id;
    end;
$$ language plpgsql;
