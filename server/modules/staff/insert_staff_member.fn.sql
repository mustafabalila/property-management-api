create or replace function api.insert_staff_member(_member jsonb) returns void as $$
    declare
        _name text := _member->>'name';
        _email text := _member->>'email';
        _phone text := _member->>'phone';
    begin

        if exists(select 1 from api.staff_member where email = _email) then
            raise exception 'A member already exists with email %', _email;
        end if;

        insert into api.staff_member (name, email, phone) values (_name, _email, _phone);
    end;
$$ language plpgsql;