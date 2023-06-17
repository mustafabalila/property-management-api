create or replace function api.insert_department(_department jsonb) returns void as $$
    declare
        _name text := _department->>'name';
    begin

        if exists(select 1 from api.department where name = _name) then
            raise exception 'A department with this name already exists';
        end if;

        insert into api.department (name) values (_name);
    end;
$$ language plpgsql;
