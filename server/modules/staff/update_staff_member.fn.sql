create or replace function api.update_staff_member(_member jsonb) returns void as $$
    declare
        _id bigint := (_member->>'id')::bigint;
        _name text := _member->>'name';
        _email text := _member->>'email';
        _phone text := _member->>'phone';

    begin
        update api.staff_member set 
            name = _name,
            email = _email,
            phone = _phone,
            updated_at = now()
        where id = _id;
    end;
$$ language plpgsql;