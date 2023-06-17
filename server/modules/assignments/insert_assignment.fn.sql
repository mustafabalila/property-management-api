create or replace function api.insert_assignment (_assignment jsonb) returns void as $$
    declare
        _property_id bigint := (_assignment->>'property_id')::bigint;
        _department_id bigint := (_assignment->>'department_id')::bigint;
        _member_id bigint := (_assignment->>'member_id')::bigint;
        _description text := _assignment->>'description';
        _due_date date := (_assignment->>'due_date')::date;
    begin
        insert into api.assignment (property_id, department_id, member_id, description, due_date)
        values (_property_id, _department_id, _member_id, _description, _due_date);
    end;
$$ language plpgsql;
