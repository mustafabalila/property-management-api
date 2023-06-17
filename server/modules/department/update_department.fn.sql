create or replace function api.update_department(_department jsonb) returns void as $$
    declare
        _id bigint := (_department->>'id')::bigint;
        _name text := _department->>'name';
    begin

        if exists(select 1 from api.department where name = _name and id != _id) then
            raise exception 'A department with this name already exists';
        end if;

        update api.department set name = _name where id = _id;
    end;
$$ language plpgsql;
