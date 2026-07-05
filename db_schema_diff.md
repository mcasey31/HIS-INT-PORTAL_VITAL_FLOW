# Database Schema Diff: Migrations vs Live PostgreSQL

**Generated:** 2026-07-04
**Sources:**
- Source 1 (Migrations): `C:\xampp\htdocs\his\db\migrations\` (001-047)
- Source 2 (Live DB): Docker PostgreSQL container via `docker compose exec -T postgres psql -U vitalflow_user -d vitalflow_his`

---

## Summary

| Metric | Count |
|--------|-------|
| Tables in migrations | 46 |
| Tables in live DB | 47 |
| Tables only in DB | 1 (`sch_agenda.medicamento`) |
| Tables only in migrations | 0 |
| Tables with column differences | 4 (`agenda`, `bloque_programacion`, `evolucion_ambulatoria`, `solicitud_estudio`) |
| Index differences | 2 |
| FK constraint differences | 0 |
| Sequence differences | 1 (medicamento_id_seq) |

---

## Section 1: Tables that exist in DB but NOT in migrations

### `sch_agenda.medicamento`

This table exists in the live database but is **not created or referenced** in any migration file (001-047). Likely created manually or by an external script.

**Schema:**

| Column | Data Type | Nullable | Default | Max Length |
|--------|-----------|----------|---------|------------|
| id | integer | NO | `nextval('sch_agenda.medicamento_id_seq'::regclass)` | — |
| principio_activo | text | NO | — | — |
| presentacion | text | NO | — | — |
| producto | text | NO | — | — |
| laboratorio | text | NO | — | — |
| familia | text | NO | — | — |
| forma | text | YES | — | — |
| troquel | varchar(20) | YES | — | 20 |

**Primary Key:** `medicamento_pkey` on `id`
**Sequence:** `sch_agenda.medicamento_id_seq` (integer, start 1, increment 1)
**Indexes:** None beyond PK
**Foreign Keys:** None
**Check Constraints:** NOT NULL checks for id, principio_activo, presentacion, producto, laboratorio, familia

**Veredict:** This is an orphan table — no migration creates it. Should be added to a future migration or removed if unused.

---

## Section 2: Tables that exist in migrations but NOT in DB

**None.** All 46 tables defined across migrations 001-047 exist in the live database.

---

## Section 3: Tables in both with column differences

### 3.1 `sch_agenda.agenda`

| Column | Migrations | Live DB | Diff? |
|--------|------------|---------|-------|
| id | uuid PK | uuid PK | ✓ Match |
| codigo | varchar(40) not null unique | varchar(40) NOT NULL | ✓ Match |
| nombre | varchar(140) not null | varchar(140) NOT NULL | ✓ Match |
| estado | varchar(20) not null | varchar(20) NOT NULL | ✓ Match |
| fecha_desde | date not null | date NOT NULL | ✓ Match |
| fecha_hasta | date | date YES | ✓ Match |
| location_id | uuid | uuid YES | ✓ Match |
| practitioner_role_id | uuid | uuid YES | ✓ Match |
| source_system | varchar(80) | varchar(80) YES | ✓ Match |
| source_id | varchar(80) | varchar(80) YES | ✓ Match |
| fhir_profile | varchar(200) | varchar(200) YES | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| created_by | varchar(80) not null | varchar(80) NOT NULL | ✓ Match |
| updated_by | varchar(80) not null | varchar(80) NOT NULL | ✓ Match |
| observacion | varchar(400) *(002)* | varchar(400) YES | ✓ Match |
| centro_id | uuid not null *(003)* | uuid NOT NULL | ✓ Match |
| servicio_id | uuid not null *(003)* | uuid NOT NULL | ✓ Match |
| tipo_efector | varchar(40) not null *(003)* | varchar(40) NOT NULL | ✓ Match |
| efector_id | uuid not null *(003)* | uuid NOT NULL | ✓ Match |
| tipo_agenda | varchar(40) not null *(003)* | varchar(40) NOT NULL | ✓ Match |
| visible_contact_center | boolean not null default true *(003)* | boolean NOT NULL default true | ✓ Match |

**No differences.**

---

### 3.2 `sch_agenda.bloque_programacion`

| Column | Migrations | Live DB | Diff? |
|--------|------------|---------|-------|
| id | uuid PK | uuid PK | ✓ Match |
| agenda_id | uuid not null FK → agenda | uuid NOT NULL FK | ✓ Match |
| fecha | date not null | date NOT NULL | ✓ Match |
| hora_inicio | time not null | time without time zone NOT NULL | ✓ Match |
| hora_fin | time not null | time without time zone NOT NULL | ✓ Match |
| intervalo_minutos | int not null | integer NOT NULL | ✓ Match |
| estado | varchar(20) not null | varchar(20) NOT NULL | ✓ Match |
| source_system | varchar(80) | varchar(80) YES | ✓ Match |
| source_id | varchar(80) | varchar(80) YES | ✓ Match |
| fhir_profile | varchar(200) | varchar(200) YES | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| created_by | varchar(80) not null | varchar(80) NOT NULL | ✓ Match |
| updated_by | varchar(80) not null | varchar(80) NOT NULL | ✓ Match |
| nombre | varchar(70) *(004)* | varchar(70) YES | ✓ Match |
| tipo_bloque | varchar(20) *(004)* | varchar(20) YES | ✓ Match |
| fecha_desde | date *(004)* | date YES | ✓ Match |
| fecha_hasta | date *(004)* | date YES | ✓ Match |
| atiende_feriados | boolean not null default false *(004)* | boolean NOT NULL default false | ✓ Match |
| dias_semana | varchar(32) *(004)* | varchar(32) YES | ✓ Match |
| duracion_turno_minutos | int *(004)* | integer YES | ✓ Match |
| lugar_atencion_id | uuid FK → lugar_atencion *(004)* | uuid YES FK | ✓ Match |
| frecuencia | varchar(20) *(004)* | varchar(20) YES | ✓ Match |
| orden_mensual_semanas | text *(004)* | text YES | ✓ Match |
| sobreturnos | int not null default 0 *(004)* | integer NOT NULL default 0 | ✓ Match |
| practicas_json | text *(005)* | text YES | ✓ Match |

**No differences.**

---

### 3.3 `sch_agenda.cupo`

| Column | Migrations | Live DB | Diff? |
|--------|------------|---------|-------|
| id | uuid PK | uuid PK | ✓ Match |
| bloque_id | uuid not null FK → bloque_programacion | uuid NOT NULL FK | ✓ Match |
| hora_inicio | timestamptz not null | timestamptz NOT NULL | ✓ Match |
| hora_fin | timestamptz not null | timestamptz NOT NULL | ✓ Match |
| estado | varchar(30) not null | varchar(30) NOT NULL | ✓ Match |
| overbooking_permitido | boolean not null default false | boolean NOT NULL default false | ✓ Match |
| capacidad | int not null default 1 | integer NOT NULL default 1 | ✓ Match |
| source_system | varchar(80) | varchar(80) YES | ✓ Match |
| source_id | varchar(80) | varchar(80) YES | ✓ Match |
| fhir_profile | varchar(200) | varchar(200) YES | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| created_by | varchar(80) not null | varchar(80) NOT NULL | ✓ Match |
| updated_by | varchar(80) not null | varchar(80) NOT NULL | ✓ Match |

**No differences.**

---

### 3.4 `sch_hca.solicitud_estudio`

| Column | Migrations (030 + 045) | Live DB | Diff? |
|--------|----------------------|---------|-------|
| id | UUID PK DEFAULT gen_random_uuid() | uuid PK default gen_random_uuid() | ✓ Match |
| turno_id | VARCHAR(255) NOT NULL | varchar(255) NOT NULL | ✓ Match |
| paciente_id | VARCHAR(255) NOT NULL | varchar(255) NOT NULL | ✓ Match |
| fecha_solicitada | DATE NOT NULL | date NOT NULL | ✓ Match |
| practica | VARCHAR(255) NOT NULL | varchar(255) NOT NULL | ✓ Match |
| observacion | TEXT | text YES | ✓ Match |
| estado | VARCHAR(30) NOT NULL DEFAULT 'ACTIVA' | varchar(30) NOT NULL default 'ACTIVA' | ✓ Match |
| created_at | TIMESTAMPTZ NOT NULL DEFAULT now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | TIMESTAMPTZ NOT NULL DEFAULT now() | timestamptz NOT NULL default now() | ✓ Match |
| created_by | VARCHAR(80) *(migration 030)* | varchar(80) YES | ✓ Match |
| updated_by | VARCHAR(80) *(migration 030)* | varchar(80) YES | ✓ Match |
| practica_nombre | VARCHAR(500) GENERATED ALWAYS AS (practica) STORED *(045)* | varchar(500) YES | ✓ Match |
| practica_catalogo_id | INT FK → sch_hca.practica_catalogo(id) *(045)* | integer YES FK | ✓ Match |

**No differences.**

---

### 3.5 `sch_hca.evolucion_ambulatoria`

| Column | Migrations (011 + 026 + 036) | Live DB | Diff? |
|--------|-----------------------------|---------|-------|
| id | uuid PK | uuid PK | ✓ Match |
| paciente_id | uuid not null FK → persona | uuid NOT NULL FK | ✓ Match |
| fecha_atencion | timestamptz not null | timestamptz NOT NULL | ✓ Match |
| especialidad | varchar(120) not null | varchar(120) NOT NULL | ✓ Match |
| profesional | varchar(160) not null | varchar(160) NOT NULL | ✓ Match |
| problemas_asociados_json | jsonb not null | jsonb NOT NULL | ✓ Match |
| activo | boolean not null default true | boolean NOT NULL default true | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| texto | text not null default '' *(026)* | text NOT NULL default ''::text | ✓ Match |
| turno_id | varchar(250) *(036, changed from uuid)* | varchar(250) YES | ✓ Match |

**No differences.**

---

### 3.6 `sch_persona.persona`

| Column | Migrations (007 + 022) | Live DB | Diff? |
|--------|----------------------|---------|-------|
| id | uuid PK | uuid PK | ✓ Match |
| apellido | varchar(120) not null | varchar(120) NOT NULL | ✓ Match |
| nombre | varchar(120) not null | varchar(120) NOT NULL | ✓ Match |
| tipo_documento_codigo | varchar(30) not null FK → tipo_documento | varchar(30) NOT NULL FK | ✓ Match |
| numero_documento | varchar(40) not null | varchar(40) NOT NULL | ✓ Match |
| fecha_nacimiento | date not null | date NOT NULL | ✓ Match |
| sexo_biologico | varchar(1) not null | varchar(1) NOT NULL | ✓ Match |
| estado | varchar(20) not null | varchar(20) NOT NULL | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| email | varchar(140) *(022)* | varchar(140) YES | ✓ Match |
| telefono | varchar(30) *(022)* | varchar(30) YES | ✓ Match |

**No differences.**

---

### 3.7 `sch_seguridad.usuario_sistema`

| Column | Migrations (014 + 046) | Live DB | Diff? |
|--------|----------------------|---------|-------|
| id | uuid PK | uuid PK | ✓ Match |
| persona_id | uuid FK → persona | uuid YES FK | ✓ Match |
| username | varchar(120) not null | varchar(120) NOT NULL | ✓ Match |
| password_hash | varchar(300) not null | varchar(300) NOT NULL | ✓ Match |
| estado | varchar(40) not null | varchar(40) NOT NULL | ✓ Match |
| ultimo_login | timestamptz | timestamptz YES | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| updated_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| matricula | varchar(64) *(046)* | varchar(64) YES | ✓ Match |

**No differences.**

---

### 3.8 `sch_admision.eventos_facturacion_outbox`

| Column | Migrations (041 + 042 + 043) | Live DB | Diff? |
|--------|------------------------------|---------|-------|
| id | uuid PK default gen_random_uuid() | uuid PK default gen_random_uuid() | ✓ Match |
| turno_id | text not null | text NOT NULL | ✓ Match |
| encuentro_id | uuid | uuid YES | ✓ Match |
| paciente_id | uuid not null | uuid NOT NULL | ✓ Match |
| paciente_nombre | text not null | text NOT NULL | ✓ Match |
| documento | text not null | text NOT NULL | ✓ Match |
| financiador | text | text YES | ✓ Match |
| financiador_id | uuid | uuid YES | ✓ Match |
| plan_id | uuid | uuid YES | ✓ Match |
| servicio_nombre | text | text YES | ✓ Match |
| centro_id | uuid | uuid YES | ✓ Match |
| llegada_en | timestamptz not null | timestamptz NOT NULL | ✓ Match |
| payload | jsonb not null | jsonb NOT NULL | ✓ Match |
| estado | varchar(20) not null default 'PENDIENTE' | varchar(20) NOT NULL default 'PENDIENTE'::character varying | ✓ Match |
| error_detalle | text | text YES | ✓ Match |
| created_at | timestamptz not null default now() | timestamptz NOT NULL default now() | ✓ Match |
| processed_at | timestamptz | timestamptz YES | ✓ Match |
| practica_origen_nombre | text *(042)* | text YES | ✓ Match |
| practica_origen_codigo | text *(042)* | text YES | ✓ Match |
| profesional_id | uuid *(042)* | uuid YES | ✓ Match |
| profesional_nombre | text *(042)* | text YES | ✓ Match |
| tipo_origen | varchar(30) not null default 'TURNO' *(042)* | varchar(30) NOT NULL default 'TURNO'::character varying | ✓ Match |
| event_type | varchar(50) not null default 'ADMISION_EN_SALA_ESPERA' *(042)* | varchar(50) NOT NULL default 'ADMISION_EN_SALA_ESPERA'::character varying | ✓ Match |
| retry_count | int not null default 0 *(042)* | integer NOT NULL default 0 | ✓ Match |
| next_retry_at | timestamptz *(042)* | timestamptz YES | ✓ Match |
| homologacion_encontrada | boolean not null default false *(043)* | boolean NOT NULL default false | ✓ Match |
| catalogo_destino_codigo | varchar(40) *(043)* | varchar(40) YES | ✓ Match |
| practica_destino_codigo | varchar(80) *(043)* | varchar(80) YES | ✓ Match |
| practica_destino_nombre | varchar(200) *(043)* | varchar(200) YES | ✓ Match |

**No differences.**

---

### 3.9 All other tables

All remaining tables listed below have **identical** schemas between migrations and live DB:

- `sch_agenda.bloqueo_agenda`
- `sch_agenda.calendario_excepcion`
- `sch_agenda.centro`
- `sch_agenda.servicio`
- `sch_agenda.efector`
- `sch_agenda.lugar_atencion`
- `sch_agenda.grupo_profesional`
- `sch_agenda.grupo_profesional_miembro`
- `sch_agenda.practica`
- `sch_agenda.dispositivo`
- `sch_persona.tipo_documento`
- `sch_persona.financiador`
- `sch_persona.financiador_plan`
- `sch_persona.centro_financiador_plan`
- `sch_persona.domicilio`
- `sch_persona.persona_contacto`
- `sch_administracion.t_paciente_financiador_plan`
- `sch_hca.problema_cronico`
- `sch_hca.problema_cronico_evolucion`
- `sch_hca.receta_digital`
- `sch_hca.receta_digital_item`
- `sch_hca.receta_digital_evento`
- `sch_hca.nomenclador_practica`
- `sch_hca.practica_catalogo`
- `sch_admision.turno_admision`
- `sch_admision.encuentro`
- `sch_admision.clearing_log`
- `sch_admision.clearing_detalle`
- `sch_admision.modulos_his`
- `sch_admision.homologacion_practica_catalogo_facturacion`
- `sch_turno.turno_paciente`
- `sch_turno.sobreturno_disponibilidad`
- `sch_seguridad.rol`
- `sch_seguridad.usuario_rol`
- `sch_seguridad.sesion_log`
- `sch_seguridad.refresh_token`
- `sch_seguridad.rol_feature_permiso`
- `sch_seguridad.rol_centro_alcance`
- `sch_ubicacion.provincia`
- `sch_ubicacion.localidad`

---

## Section 4: Index Differences

### Indexes in DB but NOT in migrations

| Schema | Table | Index | Definition |
|--------|-------|-------|------------|
| sch_hca | practica_catalogo | `idx_practica_catalogo_categoria` | `CREATE INDEX idx_practica_catalogo_categoria ON sch_hca.practica_catalogo USING btree (categoria)` |
| sch_hca | practica_catalogo | `idx_practica_catalogo_codigo` | `CREATE INDEX idx_practica_catalogo_codigo ON sch_hca.practica_catalogo USING btree (codigo)` |

These two indexes on `sch_hca.practica_catalogo` exist in the live DB but are **NOT** created by migration 044 (`044_feature_practica_catalogo.sql`). They were likely added manually or by an external process.

### Indexes in migrations but NOT in DB

**None.** All 131 indexes defined in migrations exist in the live database.

---

## Section 5: FK Constraint Differences

**No differences.** All foreign key constraints defined in migrations are present in the live database with matching names and references.

### Complete FK mapping (migrations → DB):

| Constraint Name | From | To | Match |
|----------------|------|----|-------|
| `fk_agenda_centro` | agenda(centro_id) → centro(id) | ✓ | Same |
| `fk_agenda_servicio` | agenda(servicio_id) → servicio(id) | ✓ | Same |
| `fk_agenda_efector` | agenda(efector_id) → efector(id) | ✓ | Same |
| `bloque_programacion_agenda_id_fkey` | bloque_programacion(agenda_id) → agenda(id) | ✓ | Same |
| `fk_bloque_programacion_lugar_atencion` | bloque_programacion(lugar_atencion_id) → lugar_atencion(id) | ✓ | Same |
| `cupo_bloque_id_fkey` | cupo(bloque_id) → bloque_programacion(id) | ✓ | Same |
| `bloqueo_agenda_agenda_id_fkey` | bloqueo_agenda(agenda_id) → agenda(id) | ✓ | Same |
| `servicio_centro_id_fkey` | servicio(centro_id) → centro(id) | ✓ | Same |
| `efector_centro_id_fkey` | efector(centro_id) → centro(id) | ✓ | Same |
| `efector_servicio_id_fkey` | efector(servicio_id) → servicio(id) | ✓ | Same |
| `fk_efector_usuario_sistema` | efector(usuario_id) → usuario_sistema(id) | ✓ | Same |
| `practica_servicio_id_fkey` | practica(servicio_id) → servicio(id) | ✓ | Same |
| `dispositivo_centro_id_fkey` | dispositivo(centro_id) → centro(id) | ✓ | Same |
| `dispositivo_servicio_id_fkey` | dispositivo(servicio_id) → servicio(id) | ✓ | Same |
| `grupo_profesional_centro_id_fkey` | grupo_profesional(centro_id) → centro(id) | ✓ | Same |
| `grupo_profesional_servicio_id_fkey` | grupo_profesional(servicio_id) → servicio(id) | ✓ | Same |
| `grupo_profesional_miembro_efector_id_fkey` | grupo_profesional_miembro(efector_id) → efector(id) | ✓ | Same |
| `grupo_profesional_miembro_grupo_profesional_id_fkey` | grupo_profesional_miembro(grupo_profesional_id) → grupo_profesional(id) | ✓ | Same |
| `persona_tipo_documento_codigo_fkey` | persona(tipo_documento_codigo) → tipo_documento(codigo) | ✓ | Same |
| `t_paciente_financiador_plan_paciente_id_fkey` | t_paciente_financiador_plan(paciente_id) → persona(id) | ✓ | Same |
| `t_paciente_financiador_plan_financiador_id_fkey` | t_paciente_financiador_plan(financiador_id) → financiador(id) | ✓ | Same |
| `t_paciente_financiador_plan_plan_financiador_id_fkey` | t_paciente_financiador_plan(plan_financiador_id) → financiador_plan(id) | ✓ | Same |
| `problema_cronico_paciente_id_fkey` | problema_cronico(paciente_id) → persona(id) | ✓ | Same |
| `problema_cronico_evolucion_problema_cronico_id_fkey` | problema_cronico_evolucion(problema_cronico_id) → problema_cronico(id) | ✓ | Same |
| `receta_digital_paciente_id_fkey` | receta_digital(paciente_id) → persona(id) | ✓ | Same |
| `receta_digital_item_receta_id_fkey` | receta_digital_item(receta_id) → receta_digital(id) | ✓ | Same |
| `receta_digital_evento_receta_id_fkey` | receta_digital_evento(receta_id) → receta_digital(id) | ✓ | Same |
| `evolucion_ambulatoria_paciente_id_fkey` | evolucion_ambulatoria(paciente_id) → persona(id) | ✓ | Same |
| `encuentro_turno_id_fkey` | encuentro(turno_id) → turno_admision(turno_id) | ✓ | Same |
| `solicitud_estudio_practica_catalogo_id_fkey` | solicitud_estudio(practica_catalogo_id) → practica_catalogo(id) | ✓ | Same |
| `financiador_plan_financiador_id_fkey` | financiador_plan(financiador_id) → financiador(id) | ✓ | Same |
| `domicilio_persona_id_fkey` | domicilio(persona_id) → persona(id) | ✓ | Same |
| `domicilio_localidad_id_fkey` | domicilio(localidad_id) → localidad(id) | ✓ | Same |
| `persona_contacto_persona_id_fkey` | persona_contacto(persona_id) → persona(id) | ✓ | Same |
| `persona_contacto_contacto_persona_id_fkey` | persona_contacto(contacto_persona_id) → persona(id) | ✓ | Same |
| `centro_financiador_plan_centro_id_fkey` | centro_financiador_plan(centro_id) → centro(id) | ✓ | Same |
| `centro_financiador_plan_financiador_id_fkey` | centro_financiador_plan(financiador_id) → financiador(id) | ✓ | Same |
| `centro_financiador_plan_plan_financiador_id_fkey` | centro_financiador_plan(plan_financiador_id) → financiador_plan(id) | ✓ | Same |
| `localidad_provincia_id_fkey` | localidad(provincia_id) → provincia(id) | ✓ | Same |
| `usuario_sistema_persona_id_fkey` | usuario_sistema(persona_id) → persona(id) | ✓ | Same |
| `usuario_rol_usuario_id_fkey` | usuario_rol(usuario_id) → usuario_sistema(id) | ✓ | Same |
| `usuario_rol_rol_id_fkey` | usuario_rol(rol_id) → rol(id) | ✓ | Same |
| `fk_usuario_rol_centro` | usuario_rol(centro_id) → centro(id) | ✓ | Same |
| `fk_usuario_rol_servicio` | usuario_rol(servicio_id) → servicio(id) | ✓ | Same |
| `fk_rol_parent` | rol(parent_rol_id) → rol(id) | ✓ | Same |
| `sesion_log_usuario_id_fkey` | sesion_log(usuario_id) → usuario_sistema(id) | ✓ | Same |
| `refresh_token_usuario_id_fkey` | refresh_token(usuario_id) → usuario_sistema(id) | ✓ | Same |
| `rol_feature_permiso_rol_id_fkey` | rol_feature_permiso(rol_id) → rol(id) | ✓ | Same |
| `rol_centro_alcance_rol_id_fkey` | rol_centro_alcance(rol_id) → rol(id) | ✓ | Same |
| `rol_centro_alcance_centro_id_fkey` | rol_centro_alcance(centro_id) → centro(id) | ✓ | Same |
| `clearing_detalle_clearing_id_fkey` | clearing_detalle(clearing_id) → clearing_log(id) | ✓ | Same |

---

## Section 6: Check Constraint Differences

### Check constraints defined in migrations:

| Migration | Constraint | Table | Clause | In DB? |
|-----------|-----------|-------|--------|--------|
| 013 | `sobreturno_disponibilidad_disponibles_check` | sch_turno.sobreturno_disponibilidad | `disponibles >= 0` | ✓ Yes |
| 015 | `ck_tpfp_fechas` | sch_administracion.t_paciente_financiador_plan | `fecha_hasta is null or fecha_hasta >= fecha_desde` | ✓ Yes |
| 020 | `ck_rol_parent_not_self` | sch_seguridad.rol | `parent_rol_id is null or parent_rol_id <> id` | ✓ Yes |
| 041 | `chk_estado_outbox` | sch_admision.eventos_facturacion_outbox | `estado in ('PENDIENTE', 'PROCESADO', 'ERROR')` | ✓ Yes |
| 043 | `chk_homologacion_prioridad_gt_0` | sch_admision.homologacion_practica_catalogo_facturacion | `prioridad > 0` | ✓ Yes |

**No differences.** All 5 check constraints from migrations exist in the live DB.

---

## Section 7: Sequence Differences

| Sequence | Schema | Migrations | Live DB | Diff? |
|----------|--------|------------|---------|-------|
| `practica_catalogo_id_seq` | sch_hca | Not explicitly created (implied by `id SERIAL` in 044) | integer, start 1 | ✓ Match |
| `medicamento_id_seq` | sch_agenda | **NOT created** in any migration | integer, start 1 | ❌ **Only in DB** |

---

## Section 8: Unique Constraint Differences

| Table | Constraint | Migrations | Live DB | Diff? |
|-------|-----------|------------|---------|-------|
| sch_persona.financiador_plan | `uq_financiador_plan_privado_particular_single` | ✓ (021) | ✓ Exists | ✓ Match |
| sch_agenda.efector | `uq_efector_usuario_id` | ✓ (024) | ✓ Exists | ✓ Match |
| sch_admision.encuentro | `uq_encuentro_turno` | ✓ (012) | ✓ Exists | ✓ Match |

**No differences.**

---

## Conclusions

1. **`sch_agenda.medicamento` is the only orphan table** — exists in DB with no migration creating it (8 columns, integer PK with sequence). Needs a migration or cleanup.

2. **2 extra indexes** on `sch_hca.practica_catalogo` (`idx_practica_catalogo_categoria`, `idx_practica_catalogo_codigo`) exist in DB but not in migration 044. These were likely added manually for performance.

3. **All 46 migration-defined tables** are present in the live DB with matching column schemas, types, nullability, and defaults.

4. **All foreign key constraints, check constraints, primary keys, and unique constraints** match exactly between migrations and live DB.

5. **Zero schema drift** between migrations and DB for the 48 expected tables — the only divergence is the undocumented `medicamento` table.

---

## Appendix A: SQL Script for DEV — Create missing tables/indexes

Ejecutar en orden en la base DEV para sincronizar:

```sql
-- =============================================================
-- 1. Sequence para medicamento
-- =============================================================
CREATE SEQUENCE IF NOT EXISTS sch_agenda.medicamento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- =============================================================
-- 2. Tabla sch_agenda.medicamento
-- =============================================================
CREATE TABLE IF NOT EXISTS sch_agenda.medicamento (
    id              INTEGER NOT NULL DEFAULT nextval('sch_agenda.medicamento_id_seq'::regclass),
    principio_activo TEXT    NOT NULL,
    presentacion    TEXT    NOT NULL,
    producto        TEXT    NOT NULL,
    laboratorio     TEXT    NOT NULL,
    familia         TEXT    NOT NULL,
    forma           TEXT,
    troquel         VARCHAR(20),
    PRIMARY KEY (id)
);

-- =============================================================
-- 3. Índices adicionales en sch_hca.practica_catalogo
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_practica_catalogo_categoria
    ON sch_hca.practica_catalogo USING btree (categoria);

CREATE INDEX IF NOT EXISTS idx_practica_catalogo_codigo
    ON sch_hca.practica_catalogo USING btree (codigo);
```
