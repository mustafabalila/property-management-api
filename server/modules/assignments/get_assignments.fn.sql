create or replace function api.get_assignments(_filter jsonb, _pagination jsonb, _sort jsonb) returns jsonb as $$
    declare
        _page integer := coalesce((_pagination->>'page')::integer, 1);
        _limit integer := coalesce((_pagination->>'limit')::integer, 10);
        _sort_field text := coalesce((_sort->>'field')::text, 'id');
        _sort_order text := coalesce((_sort->>'order')::text, 'asc');

        _property_id bigint := (_filter->>'property_id')::bigint;
        _department_id bigint := (_filter->>'department_id')::bigint;
        _member_id bigint := (_filter->>'member_id')::bigint;
        _status api.assignment_status := (_filter->>'status')::api.assignment_status;
        _due_date date := (_filter->>'due_date')::date;
        _start_date date := (_filter->>'start_date')::date;
        _end_date date := (_filter->>'end_date')::date;

        _count integer;
        _result jsonb;
        _query text;
    begin
        _query = 'select coalesce(jsonb_agg(assignment), ''[]''::jsonb) from (';
        _query = _query || 'select * from api.assignment';
        _query = _query || ' where 1 = 1';

        if _property_id is not null then
            _query = _query || ' and property_id = ' || quote_literal(_property_id);
        end if;

        if _department_id is not null then
            _query = _query || ' and department_id = ' || quote_literal(_department_id);
        end if;

        if _member_id is not null then
            _query = _query || ' and member_id = ' || quote_literal(_member_id);
        end if;

        if _status is not null then
            _query = _query || ' and status = ' || quote_literal(_status);
        end if;

        if _due_date is not null then
            _query = _query || ' and due_date = ' || quote_literal(_due_date);
        end if;

        if _start_date is not null and _end_date is not null then
            _query = _query || ' and due_date between ' || quote_literal(_start_date) || ' and ' || quote_literal(_end_date);
        end if;

        _query = _query || ' order by ' || _sort_field || ' ' || _sort_order;

        _query = _query || ' limit ' || _limit || ' offset ' || (_page - 1) * _limit;

        _query = _query || ') assignment';

        execute _query into _result;

        return _result;
    end;
$$ language plpgsql;