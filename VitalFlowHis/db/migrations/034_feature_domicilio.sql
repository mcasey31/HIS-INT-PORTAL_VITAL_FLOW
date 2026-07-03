CREATE TABLE IF NOT EXISTS sch_persona.domicilio (
    id              uuid            primary key default gen_random_uuid(),
    persona_id      uuid            not null references sch_persona.persona(id),
    localidad_id    varchar(10)     references sch_ubicacion.localidad(id),
    pais            varchar(60)     not null default 'Argentina',
    provincia       varchar(120)    not null default '',
    localidad       varchar(200)    not null default '',
    calle           varchar(200)    not null default '',
    numero          varchar(20)     not null default '',
    barrio          varchar(200)    not null default '',
    codigo_postal   varchar(20)     not null default '',
    piso            varchar(10)     not null default '',
    departamento    varchar(10)     not null default '',
    comentario      varchar(280)    not null default '',
    activo          boolean         not null default true,
    created_at      timestamptz     not null default now(),
    updated_at      timestamptz     not null default now()
);

CREATE INDEX IF NOT EXISTS idx_domicilio_persona_activo
    ON sch_persona.domicilio (persona_id)
    WHERE activo = true;
