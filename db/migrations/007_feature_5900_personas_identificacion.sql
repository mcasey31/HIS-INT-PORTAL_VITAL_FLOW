-- HU 5900 - Identificacion de persona por tipo y numero de documento

create schema if not exists sch_persona;

create table if not exists sch_persona.tipo_documento (
    codigo varchar(30) primary key,
    nombre varchar(80) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_persona.persona (
    id uuid primary key,
    apellido varchar(120) not null,
    nombre varchar(120) not null,
    tipo_documento_codigo varchar(30) not null references sch_persona.tipo_documento(codigo),
    numero_documento varchar(40) not null,
    fecha_nacimiento date not null,
    sexo_biologico varchar(1) not null,
    estado varchar(20) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists uq_persona_tipo_numero_upper
    on sch_persona.persona(tipo_documento_codigo, upper(numero_documento));

create index if not exists idx_persona_estado on sch_persona.persona(estado);
create index if not exists idx_persona_apellido_nombre on sch_persona.persona(apellido, nombre);

insert into sch_persona.tipo_documento(codigo, nombre, activo)
values
    ('DNI', 'DNI', true),
    ('CUIT_CUIL', 'CUIT/CUIL', true),
    ('PASAPORTE', 'Pasaporte', true),
    ('DNM', 'DNM', true),
    ('CIPL', 'CIPL', true)
on conflict (codigo) do update
set nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();

insert into sch_persona.persona(id, apellido, nombre, tipo_documento_codigo, numero_documento, fecha_nacimiento, sexo_biologico, estado)
values
    ('10000000-0000-0000-0000-000000000001', 'Perez', 'Juan', 'DNI', '12345678', '1991-02-20', 'M', 'ACTIVO'),
    ('10000000-0000-0000-0000-000000000002', 'Perez', 'Juana', 'DNI', 'F12345678', '1992-05-11', 'F', 'ACTIVO'),
    ('10000000-0000-0000-0000-000000000003', 'Perez', 'Juan M', 'DNI', 'M12345678', '1991-02-20', 'M', 'ACTIVO'),
    ('10000000-0000-0000-0000-000000000004', 'Gomez', 'Ana', 'DNI', '33222111', '1988-08-08', 'F', 'INACTIVO'),
    ('10000000-0000-0000-0000-000000000005', 'Lopez', 'Carlos', 'PASAPORTE', 'AB123456', '1984-01-02', 'M', 'ACTIVO')
on conflict (id) do update
set apellido = excluded.apellido,
    nombre = excluded.nombre,
    tipo_documento_codigo = excluded.tipo_documento_codigo,
    numero_documento = excluded.numero_documento,
    fecha_nacimiento = excluded.fecha_nacimiento,
    sexo_biologico = excluded.sexo_biologico,
    estado = excluded.estado,
    updated_at = now();
