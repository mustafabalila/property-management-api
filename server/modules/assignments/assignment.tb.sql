create type api.assignment_status as enum ('unassigned', 'assigned', 'in_progress', 'completed', 'canceled');

create table api.assignment (
    id bigserial primary key,
    property_id bigint not null references api.property(id) on delete cascade,
    member_id bigint references api.staff_member(id) on delete set null,
    department_id bigint not null references api.department(id) on delete cascade,
    description text not null,
    due_date date not null,
    status api.assignment_status not null default 'unassigned',
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
