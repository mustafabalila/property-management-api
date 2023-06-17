create or replace function api.insert_building(_building jsonb) returns void as $$
    declare
        _name text := _building->>'name';
        _address text := _building->>'address';
        _city text := _building->>'city';
        _state text := _building->>'state';
        _description text := _building->>'description';
        _managed_by bigint := nullif((_building->>'managed_by')::bigint, 0);

        _latitude numeric := (_building->'coordinates'->>'latitude')::numeric;
        _longitude numeric := (_building->'coordinates'->>'longitude')::numeric;
        _coordinates point := point(_latitude, _longitude);
    begin

        if exists(select 1 from api.building where name = _name and city = _city) then
            raise exception 'Building % already exists in %', _name, _city;
        end if;

        insert into api.building (name, address, city, state, coordinates, description, managed_by)
        values (_name, _address, _city, _state, _coordinates, _description, _managed_by);
    end;
$$ language plpgsql;