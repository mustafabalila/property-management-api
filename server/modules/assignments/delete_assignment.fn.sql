create or replace function api.delete_assignment(_id bigint) returns void as $$
    begin
        delete from api.assignment where id = _id;
    end;
$$ language plpgsql;
