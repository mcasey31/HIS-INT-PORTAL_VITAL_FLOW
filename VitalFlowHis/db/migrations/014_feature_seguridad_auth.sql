-- 014 - Seguridad base: usuarios, roles, relacion usuario_rol y log de sesiones
-- HU SEC-018 / HU SEC-019

create schema if not exists sch_seguridad;

create table if not exists sch_seguridad.rol (
    id uuid primary key,
    nombre varchar(80) not null,
    descripcion varchar(300),
    es_predefinido boolean not null default false,
    created_at timestamptz not null default now()
);

create unique index if not exists uq_rol_nombre_lower
    on sch_seguridad.rol (lower(nombre));

create table if not exists sch_seguridad.usuario_sistema (
    id uuid primary key,
    persona_id uuid references sch_persona.persona(id),
    username varchar(120) not null,
    password_hash varchar(300) not null,
    estado varchar(40) not null,
    ultimo_login timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists uq_usuario_sistema_username_lower
    on sch_seguridad.usuario_sistema (lower(username));

create index if not exists idx_usuario_sistema_estado
    on sch_seguridad.usuario_sistema (estado);

create table if not exists sch_seguridad.usuario_rol (
    usuario_id uuid not null references sch_seguridad.usuario_sistema(id) on delete cascade,
    rol_id uuid not null references sch_seguridad.rol(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (usuario_id, rol_id)
);

create table if not exists sch_seguridad.sesion_log (
    id uuid primary key,
    usuario_id uuid references sch_seguridad.usuario_sistema(id),
    accion varchar(80) not null,
    ip varchar(80),
    user_agent varchar(300),
    resultado varchar(40) not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_sesion_log_usuario_fecha
    on sch_seguridad.sesion_log (usuario_id, created_at desc);

create index if not exists idx_sesion_log_resultado_fecha
    on sch_seguridad.sesion_log (resultado, created_at desc);

create table if not exists sch_seguridad.refresh_token (
    id uuid primary key,
    usuario_id uuid not null references sch_seguridad.usuario_sistema(id) on delete cascade,
    token_hash varchar(128) not null,
    expires_at timestamptz not null,
    revoked_at timestamptz,
    replaced_by_token_hash varchar(128),
    created_ip varchar(80),
    user_agent varchar(300),
    created_at timestamptz not null default now()
);

create unique index if not exists uq_refresh_token_hash
    on sch_seguridad.refresh_token (token_hash);

create index if not exists idx_refresh_token_usuario
    on sch_seguridad.refresh_token (usuario_id, created_at desc);

create index if not exists idx_refresh_token_activo
    on sch_seguridad.refresh_token (token_hash, expires_at)
    where revoked_at is null;

insert into sch_seguridad.rol (id, nombre, descripcion, es_predefinido)
values
    ('50000000-0000-0000-0000-000000000001', 'Administrador', 'Acceso total al sistema HIS', true),
    ('50000000-0000-0000-0000-000000000002', 'Medico', 'Acceso clinico asistencial', true),
    ('50000000-0000-0000-0000-000000000003', 'Administrativo', 'Gestion operativa no clinica', true),
    ('50000000-0000-0000-0000-000000000004', 'Cajero', 'Gestion de caja y cobros', true),
    ('50000000-0000-0000-0000-000000000005', 'Auditor', 'Acceso de auditoria y consulta', true),
    ('50000000-0000-0000-0000-000000000006', 'Enrolamiento Persona', 'Alta y gestion de empadronamiento de personas', true),
    ('50000000-0000-0000-0000-000000000007', 'Administrador Seguridad', 'Gestion de usuarios, roles y ABM de seguridad', true)
on conflict (id) do update
set nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    es_predefinido = excluded.es_predefinido;

insert into sch_seguridad.usuario_sistema (id, persona_id, username, password_hash, estado, ultimo_login)
values
    (
        '50000000-0000-0000-0000-000000000100',
        null,
        'admin',
        'pbkdf2-sha256$100000$AAAAAAAAAAAAAAAAAAAAAA==$SKuMvgo1qvkaCrAitMDDT+SrfOPqgJS7cNPrf9dAW8s=',
        'ACTIVO',
        null
    )
on conflict (id) do update
set username = excluded.username,
    password_hash = excluded.password_hash,
    estado = excluded.estado,
    updated_at = now();

insert into sch_seguridad.usuario_rol (usuario_id, rol_id)
values ('50000000-0000-0000-0000-000000000100', '50000000-0000-0000-0000-000000000001')
on conflict (usuario_id, rol_id) do nothing;
