CREATE TABLE IF NOT EXISTS sch_hca.nomenclador_practica (
    codigo varchar(20) primary key,
    descripcion varchar(300) not null,
    modulo varchar(10),
    activo boolean not null default true,
    created_at timestamptz not null default now()
);
