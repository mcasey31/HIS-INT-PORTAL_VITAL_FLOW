-- 035 - Tabla de personas de contacto vinculadas a una persona

create table if not exists sch_persona.persona_contacto (
    id                  uuid            primary key default gen_random_uuid(),
    persona_id          uuid            not null references sch_persona.persona(id),
    contacto_persona_id uuid            references sch_persona.persona(id),
    nombre              varchar(120)    not null,
    apellido            varchar(120)    not null,
    tipo_documento      varchar(30)     not null default 'DNI',
    numero_documento    varchar(40)     not null,
    fecha_nacimiento    date            not null,
    sexo_biologico      varchar(1)      not null,
    telefono            varchar(200)    not null default '',
    email               varchar(140)    not null default '',
    activo              boolean         not null default true,
    created_at          timestamptz     not null default now(),
    updated_at          timestamptz     not null default now()
);

create index if not exists idx_persona_contacto_persona
    on sch_persona.persona_contacto (persona_id)
    where activo = true;

comment on table sch_persona.persona_contacto is 'Personas de contacto vinculadas a una persona (familiares, responsables)';
comment on column sch_persona.persona_contacto.contacto_persona_id is 'Opcional: referencia a la persona en el sistema si ya existe';
