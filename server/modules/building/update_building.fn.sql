create or replace function api.update_building(_building jsonb) returns void as $$
    declare
        _id bigint := (_building->>'id')::bigint;
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
        update api.building set 
            name = _name,
            address = _address,
            city = _city,
            state = _state,
            coordinates = _coordinates,
            description = _description,
            updated_at = now(),
            managed_by = _managed_by
        where id = _id;
    end;
$$ language plpgsql;