-- Restore base HIS data (idempotent)
-- Requires psql variable: passhash (pbkdf2-sha256 hash for password 'admin')

create extension if not exists pgcrypto;

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

insert into sch_persona.tipo_documento(codigo, nombre, activo)
values
    ('DNI', 'DNI', true),
    ('CUIT_CUIL', 'CUIT/CUIL', true),
    ('PASAPORTE', 'Pasaporte', true)
on conflict (codigo) do update
set nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();

insert into sch_persona.persona(id, apellido, nombre, tipo_documento_codigo, numero_documento, fecha_nacimiento, sexo_biologico, estado)
values
    ('10000000-0000-0000-0000-000000000001', 'Admin', 'Sistema', 'DNI', '20000001', '1980-01-01', 'M', 'ACTIVO'),
  ('10000000-0000-0000-0000-000000000002', 'Diaz', 'Ana', 'DNI', '28483779', '1988-04-09', 'F', 'ACTIVO'),
    ('10000000-0000-0000-0000-000000000003', 'Perez', 'Juan', 'DNI', '30123456', '1985-03-15', 'M', 'ACTIVO'),
    ('10000000-0000-0000-0000-000000000004', 'Garcia', 'Maria', 'DNI', '30987654', '1989-07-21', 'F', 'ACTIVO'),
    ('a0000000-0000-0000-0000-000000000001', 'Paciente', 'Prueba', 'DNI', '27483779', '1990-05-20', 'F', 'ACTIVO')
on conflict (id) do update
set apellido = excluded.apellido,
    nombre = excluded.nombre,
    tipo_documento_codigo = excluded.tipo_documento_codigo,
    numero_documento = excluded.numero_documento,
    fecha_nacimiento = excluded.fecha_nacimiento,
    sexo_biologico = excluded.sexo_biologico,
    estado = excluded.estado,
    updated_at = now();

insert into sch_agenda.centro (codigo, nombre, direccion, telefono, mail, activo)
values
  ('CENTRO-001', 'Centro Ambulatorio Central', 'Av. Rivadavia 1234, Buenos Aires', '+54-11-4543-1234', 'info@centro-central.com.ar', true),
  ('CENTRO-002', 'Clinica San Roque', 'Calle Mitre 567, La Plata', '+54-221-555-6789', 'contacto@sanroque.com.ar', true),
  ('CENTRO-003', 'Hospital Italiano', 'Gascon 450, CABA', '+54-11-4959-0000', 'info@hospitalitaliano.org.ar', true)
on conflict (codigo) do update
set nombre = excluded.nombre,
    direccion = excluded.direccion,
    telefono = excluded.telefono,
    mail = excluded.mail,
    activo = excluded.activo,
    updated_at = now();

insert into sch_agenda.servicio (centro_id, codigo, nombre, descripcion, activo)
select c.id, x.codigo, x.nombre, x.descripcion, true
from sch_agenda.centro c
join (
    values
        ('CENTRO-001', 'SRV-CARDIO', 'Cardiologia', 'Servicio de Cardiologia'),
        ('CENTRO-001', 'SRV-CLING', 'Clinica General', 'Servicio de Clinica General'),
        ('CENTRO-002', 'SRV-DERM', 'Dermatologia', 'Servicio de Dermatologia')
) as x(centro_codigo, codigo, nombre, descripcion)
  on x.centro_codigo = c.codigo
on conflict (centro_id, codigo) do update
set nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    activo = excluded.activo,
    updated_at = now();

insert into sch_agenda.lugar_atencion (centro_id, codigo, nombre, tipo, activo)
select c.id, x.codigo, x.nombre, x.tipo, true
from sch_agenda.centro c
join (
    values
        ('CENTRO-001', 'LUG-001', 'Consultorio 1', 'consultorio'),
        ('CENTRO-001', 'LUG-002', 'Consultorio 2', 'consultorio'),
        ('CENTRO-001', 'LUG-003', 'Sala de Espera', 'sala-espera')
) as x(centro_codigo, codigo, nombre, tipo)
  on x.centro_codigo = c.codigo
on conflict (centro_id, codigo) do update
set nombre = excluded.nombre,
    tipo = excluded.tipo,
    activo = excluded.activo,
    updated_at = now();

insert into sch_seguridad.rol (id, nombre, descripcion, activo)
values
    ('50000000-0000-0000-0000-000000000001', 'Administrador', 'Acceso total al sistema HIS', true),
    ('50000000-0000-0000-0000-000000000002', 'Medico', 'Acceso clinico asistencial', true),
    ('50000000-0000-0000-0000-000000000003', 'Administrativo', 'Gestion operativa no clinica', true),
    ('50000000-0000-0000-0000-000000000004', 'Cajero', 'Gestion de caja y cobros', true),
  ('50000000-0000-0000-0000-000000000005', 'Auditor', 'Acceso de auditoria y consulta', true),
  ('50000000-0000-0000-0000-000000000007', 'Administrador Seguridad', 'Gestion de usuarios, roles y ABM de seguridad', true)
on conflict (id) do update
set nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    activo = excluded.activo,
    updated_at = now();

insert into sch_seguridad.usuario_sistema (id, username, password_hash, email, persona_id, estado)
values
    ('50000000-0000-0000-0000-000000000100', 'admin', :'passhash', 'admin@local', '10000000-0000-0000-0000-000000000001', 'ACTIVO'),
    ('50000000-0000-0000-0000-000000000101', 'admin_his', :'passhash', 'admin_his@local', '10000000-0000-0000-0000-000000000001', 'ACTIVO'),
    ('50000000-0000-0000-0000-000000000102', 'admin_portal', :'passhash', 'admin_portal@local', '10000000-0000-0000-0000-000000000001', 'ACTIVO'),
    ('50000000-0000-0000-0000-000000000201', 'ana.diaz', :'passhash', 'ana.diaz@local', '10000000-0000-0000-0000-000000000002', 'ACTIVO'),
    ('50000000-0000-0000-0000-000000000202', 'juan.perez', :'passhash', 'juan.perez@local', '10000000-0000-0000-0000-000000000003', 'ACTIVO'),
    ('50000000-0000-0000-0000-000000000203', 'maria.garcia', :'passhash', 'maria.garcia@local', '10000000-0000-0000-0000-000000000004', 'ACTIVO')
on conflict (username) do update
set password_hash = excluded.password_hash,
    email = excluded.email,
    persona_id = excluded.persona_id,
    estado = excluded.estado,
    updated_at = now();

insert into sch_seguridad.usuario_rol (id, usuario_id, rol_id, centro_id)
select gen_random_uuid(), u.id, r.id, c.id
from sch_seguridad.usuario_sistema u
join sch_seguridad.rol r on r.nombre = 'Administrador'
cross join sch_agenda.centro c
where u.username in ('admin', 'admin_his', 'admin_portal')
on conflict (usuario_id, rol_id, centro_id) do nothing;

insert into sch_seguridad.usuario_rol (id, usuario_id, rol_id, centro_id)
select gen_random_uuid(), u.id, r.id, c.id
from sch_seguridad.usuario_sistema u
join sch_seguridad.rol r on r.nombre = 'Administrador Seguridad'
cross join sch_agenda.centro c
where u.username in ('admin', 'admin_his', 'admin_portal')
on conflict (usuario_id, rol_id, centro_id) do nothing;

insert into sch_seguridad.usuario_rol (id, usuario_id, rol_id, centro_id)
select gen_random_uuid(), u.id, r.id, c.id
from (
    values
      ('ana.diaz', 'CENTRO-001'),
      ('juan.perez', 'CENTRO-001'),
      ('maria.garcia', 'CENTRO-002')
) as x(username, centro_codigo)
join sch_seguridad.usuario_sistema u on u.username = x.username
join sch_seguridad.rol r on r.nombre = 'Medico'
join sch_agenda.centro c on c.codigo = x.centro_codigo
on conflict (usuario_id, rol_id, centro_id) do nothing;

insert into sch_agenda.efector (centro_id, servicio_id, usuario_id, codigo, nombre, tipo_efector, licencia_numero, activo)
select c.id, s.id, u.id, x.codigo, x.nombre, 'PROFESIONAL', x.licencia, true
from (
    values
      ('ana.diaz', 'CENTRO-001', 'SRV-CLING', 'PROF-ANA', 'Dra. Ana Diaz', 'MP12345'),
      ('juan.perez', 'CENTRO-001', 'SRV-CARDIO', 'PROF-JUAN', 'Dr. Juan Perez', 'MP22334'),
      ('maria.garcia', 'CENTRO-002', 'SRV-DERM', 'PROF-MARIA', 'Dra. Maria Garcia', 'MP33445')
) as x(username, centro_codigo, servicio_codigo, codigo, nombre, licencia)
join sch_seguridad.usuario_sistema u on u.username = x.username
join sch_agenda.centro c on c.codigo = x.centro_codigo
join sch_agenda.servicio s on s.centro_id = c.id and s.codigo = x.servicio_codigo
on conflict (centro_id, codigo) do update
set servicio_id = excluded.servicio_id,
    usuario_id = excluded.usuario_id,
    nombre = excluded.nombre,
    tipo_efector = excluded.tipo_efector,
    licencia_numero = excluded.licencia_numero,
    activo = excluded.activo,
    updated_at = now();

insert into sch_agenda.agenda (centro_id, servicio_id, efector_id, codigo, nombre, descripcion, estado, tipo_agenda, fecha_desde, fecha_hasta, visible_contact_center)
select c.id, s.id, e.id, x.codigo, x.nombre, x.descripcion, 'ACTIVA', 'PROGRAMADA', current_date, current_date + interval '120 days', true
from (
    values
      ('CENTRO-001', 'SRV-CLING', 'PROF-ANA', 'AGENDA-ANA-LXV', 'Agenda Ana Diaz L/X/V', 'Agenda base para atencion ambulatoria L/X/V'),
      ('CENTRO-001', 'SRV-CARDIO', 'PROF-JUAN', 'AGENDA-JUAN-MJ', 'Agenda Juan Perez M/J', 'Agenda cardiologia base M/J'),
      ('CENTRO-002', 'SRV-DERM', 'PROF-MARIA', 'AGENDA-MARIA-LV', 'Agenda Maria Garcia L/V', 'Agenda dermatologia base L/V')
) as x(centro_codigo, servicio_codigo, efector_codigo, codigo, nombre, descripcion)
join sch_agenda.centro c on c.codigo = x.centro_codigo
join sch_agenda.servicio s on s.centro_id = c.id and s.codigo = x.servicio_codigo
join sch_agenda.efector e on e.centro_id = c.id and e.codigo = x.efector_codigo
on conflict (codigo) do update
set centro_id = excluded.centro_id,
    servicio_id = excluded.servicio_id,
    efector_id = excluded.efector_id,
    nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    estado = excluded.estado,
    tipo_agenda = excluded.tipo_agenda,
    fecha_desde = excluded.fecha_desde,
    fecha_hasta = excluded.fecha_hasta,
    visible_contact_center = excluded.visible_contact_center,
    updated_at = now();

insert into sch_agenda.bloque_programacion (agenda_id, lugar_atencion_id, fecha, hora_inicio, hora_fin, intervalo_minutos, duracion_turno_minutos, sobreturnos, estado)
select a.id,
       l.id,
       d::date as fecha,
       cfg.hora_inicio::time,
       cfg.hora_fin::time,
       30,
       30,
       2,
       'ACTIVO'
from (
    values
      ('AGENDA-ANA-LXV', 'LUG-001', '08:00', '12:00', array[1,3,5]),
      ('AGENDA-JUAN-MJ', 'LUG-002', '09:00', '13:00', array[2,4]),
      ('AGENDA-MARIA-LV', 'LUG-001', '14:00', '18:00', array[1,5])
) as cfg(agenda_codigo, lugar_codigo, hora_inicio, hora_fin, dow)
join sch_agenda.agenda a on a.codigo = cfg.agenda_codigo
join sch_agenda.lugar_atencion l on l.centro_id = a.centro_id and l.codigo = cfg.lugar_codigo
join generate_series(current_date, current_date + interval '28 days', interval '1 day') d
  on extract(isodow from d) = any(cfg.dow)
on conflict (agenda_id, fecha, hora_inicio) do nothing;

insert into sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido)
select b.id,
       timezone('America/Argentina/Buenos_Aires', b.fecha::timestamp + b.hora_inicio + make_interval(mins => gs.minuto)) as hora_inicio,
       timezone('America/Argentina/Buenos_Aires', b.fecha::timestamp + b.hora_inicio + make_interval(mins => gs.minuto + b.duracion_turno_minutos)) as hora_fin,
       'libre',
       1,
       false
from sch_agenda.bloque_programacion b
join lateral (
    select generate_series(
        0,
        greatest(0, ((extract(epoch from (b.hora_fin - b.hora_inicio))/60)::int - b.duracion_turno_minutos)),
        greatest(1, b.intervalo_minutos)
    ) as minuto
) gs on true
on conflict (bloque_id, hora_inicio) do nothing;

select 'seed_ok' as status;
select 'centros' as entidad, count(*) as total from sch_agenda.centro
union all select 'servicios', count(*) from sch_agenda.servicio
union all select 'lugares', count(*) from sch_agenda.lugar_atencion
union all select 'efectores', count(*) from sch_agenda.efector
union all select 'agendas', count(*) from sch_agenda.agenda
union all select 'bloques', count(*) from sch_agenda.bloque_programacion
union all select 'cupos', count(*) from sch_agenda.cupo
union all select 'usuarios', count(*) from sch_seguridad.usuario_sistema
union all select 'roles_usuario', count(*) from sch_seguridad.usuario_rol
union all select 'personas', count(*) from sch_persona.persona;
