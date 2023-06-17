create or replace function api.update_property(_property jsonb) returns void as $$
    declare
        _id bigint := (_property->>'id')::bigint;
        _name text := _property->>'name';
        _type text := _property->>'type';
        _bedrooms smallint := (_property->>'bedrooms')::smallint;
        _bathrooms smallint := (_property->>'bathrooms')::smallint;
        _floor_number smallint := (_property->>'floor_number')::smallint;
        _description text := _property->>'description';
        _building_id bigint := nullif((_property->>'building_id')::bigint, 0);
    begin
            
        if exists(select 1 from api.property where name = _name and building_id = _building_id and id != _id) then
            raise exception 'A property with the name % already exists', _name;
        end if;
    
        update api.property set
            name = _name,
            type = _type,
            bedrooms = _bedrooms,
            bathrooms = _bathrooms,
            floor_number = _floor_number,
            description = _description,
            building_id = _building_id
        where id = _id;
    end;
$$ language plpgsql;