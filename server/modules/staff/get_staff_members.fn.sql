create or replace function api.get_staff_members(_filter jsonb, _pagination jsonb, _sort jsonb) returns jsonb as $$
    declare
        _page integer := coalesce((_pagination->>'page')::integer, 1);
        _limit integer := coalesce((_pagination->>'limit')::integer, 10);
        _sort_field text := coalesce((_sort->>'field')::text, 'id');
        _sort_order text := coalesce((_sort->>'order')::text, 'asc');

        _department_id bigint := (_filter->>'department_id')::bigint;
        _search text := _filter->>'search';
        _count integer;
        _result jsonb;
        _query text;
    begin
        _query = 'select coalesce(jsonb_agg(members), ''[]''::jsonb) from (';
        _query = _query || 'select * from api.staff_member';
        _query = _query || ' where 1 = 1';

        if _search is not null then
            _query = _query || ' and (';
            _query = _query || ' name ilike ' || quote_literal('%' || _search || '%');
            _query = _query || ' or email ilike ' || quote_literal('%' ||  _search || '%');
            _query = _query || ' )';
        end if;

        _query = _query || ' order by ' || _sort_field || ' ' || _sort_order;

        _query = _query || ' limit ' || _limit || ' offset ' || (_page - 1) * _limit;

        _query = _query || ') members';

        execute _query into _result;

        return _result;
    end;
$$ language plpgsql;