create or replace function api.get_buildings(_filter jsonb, _pagination jsonb, _sort jsonb) returns jsonb as $$
    declare
        _page integer := coalesce((_pagination->>'page')::integer, 1);
        _limit integer := coalesce((_pagination->>'limit')::integer, 10);
        _sort_field text := coalesce((_sort->>'field')::text, 'id');
        _sort_order text := coalesce((_sort->>'order')::text, 'asc');

        _name text := _filter->>'name';
        _city text := _filter->>'city';
        _count integer;
        _result jsonb;
        _query text;
    begin
        _query = 'select coalesce(jsonb_agg(building), ''[]''::jsonb) from (';
        _query = _query || 'select * from api.building';
        _query = _query || ' where 1 = 1';

        if _name is not null then
            _query = _query || ' and name ilike '|| quote_literal('%' || _name || '%');
        end if;

        if _city is not null then
            _query = _query || ' and city ilike ' || quote_literal('%' || _city || '%');
        end if;

        _query = _query || ' order by ' || _sort_field || ' ' || _sort_order;

        _query = _query || ' limit ' || _limit || ' offset ' || (_page - 1) * _limit;

        _query = _query || ') building';

        execute _query into _result;

        return _result;
    end;
$$ language plpgsql;