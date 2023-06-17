create or replace function api.insert_property(_property jsonb) returns void as $$
    declare
        _name text := _property->>'name';
        _type text := _property->>'type';
        _bedrooms smallint := (_property->>'bedrooms')::smallint;
        _bathrooms smallint := (_property->>'bathrooms')::smallint;
        _floor_number smallint := (_property->>'floor_number')::smallint;
        _description text := _property->>'description';
        _building_id bigint := nullif((_property->>'building_id')::bigint, 0);
    begin

        if exists(select 1 from api.property where name = _name and building_id = _building_id) then
            raise exception 'A property with the name % already exists', _name;
        end if;

        insert into api.property (name, type, bedrooms, bathrooms, floor_number, description, building_id)
        values (_name, _type, _bedrooms, _bathrooms, _floor_number, _description, _building_id);
    end;
$$ language plpgsql;