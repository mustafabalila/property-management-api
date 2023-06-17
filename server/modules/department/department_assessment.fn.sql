create table api.department_assessment (
    id bigserial primary key,
    department_id bigint references api.department (id) on delete cascade not null,
    staff_member_id bigint references api.staff_member (id) on delete cascade not null,
    created_at timestamptz not null default now()
);

create unique index department_assessment_unique_idx on api.department_assessment (department_id, staff_member_id);