# Base de Datos VitalFlow HIS

Motor: **PostgreSQL 15**
Puerto: `55432` (por Docker)
Base: `vitalflow_his`
Usuario: `vitalflow_user`

---

## Índice de Schemas

| Schema | Descripción |
|--------|-------------|
| `sch_agenda` | Agenda médica, centros, servicios, efectores, bloques, cupos |
| `sch_turno` | Turnos de pacientes y sobreturnos |
| `sch_persona` | Personas, tipo de documento, financiadores, planes |
| `sch_seguridad` | Usuarios, roles, autenticación, sesiones |
| `sch_admision` | Admisión de turnos y encuentros clínicos |
| `sch_hca` | Historia Clínica Ambulatoria (problemas crónicos, evoluciones, recetas) |
| `sch_fhir` | Auditoría de integración FHIR |
| `sch_administracion` | Administración (paciente-financiador-plan) |

---

## sch_agenda — Agenda Médica

Esquema central de gestión de agendas, centros y profesionales.

### centro
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| codigo | VARCHAR(50) | Código único del centro |
| nombre | VARCHAR(255) | Nombre del centro |
| direccion | VARCHAR(240) | |
| telefono | VARCHAR(80) | |
| mail | VARCHAR(140) | |
| activo | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### servicio
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| centro_id | UUID FK → centro | |
| codigo | VARCHAR(50) | |
| nombre | VARCHAR(255) | |
| descripcion | TEXT | |
| activo | BOOLEAN | Default true |
| UNIQUE | (centro_id, codigo) | |

**Trigger**: `trg_servicio_nombre_semantico_unico` — evita duplicados semánticos (acentos, mayúsculas, espacios) por centro.

### lugar_atencion
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| centro_id | UUID FK → centro | |
| codigo | VARCHAR(50) | |
| nombre | VARCHAR(255) | Ej: "Consultorio 1" |
| tipo | VARCHAR(50) | consultorio, lab, sala-espera |
| activo | BOOLEAN | |
| UNIQUE | (centro_id, codigo) | |

### efector
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| centro_id | UUID FK → centro | |
| servicio_id | UUID FK → servicio | |
| codigo | VARCHAR(50) | |
| nombre | VARCHAR(255) | |
| tipo_efector | VARCHAR(50) | PROFESIONAL, ADMINISTRATIVO |
| licencia_numero | VARCHAR(50) | |
| usuario_id | UUID FK → usuario_sistema | Vinculación con usuario (024) |
| matricula_provincial | VARCHAR(64) | |
| matricula_nacional | VARCHAR(64) | |
| activo | BOOLEAN | |
| UNIQUE | (centro_id, codigo) | |
| UNIQUE | (usuario_id) | |

### agenda
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| centro_id | UUID FK → centro | |
| servicio_id | UUID FK → servicio | |
| efector_id | UUID FK → efector | |
| codigo | VARCHAR(50) UNIQUE | |
| nombre | VARCHAR(255) | |
| descripcion | TEXT | |
| estado | VARCHAR(50) | ACTIVA, INACTIVA, SUSPENDIDA |
| tipo_agenda | VARCHAR(50) | PROGRAMADA, SOBRE-TURNOS |
| fecha_desde | DATE | |
| fecha_hasta | DATE | |
| visible_contact_center | BOOLEAN | Default true |
| observacion | VARCHAR(400) | |
| created_at / updated_at | TIMESTAMPTZ | |

### bloque_programacion
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| agenda_id | UUID FK → agenda | |
| lugar_atencion_id | UUID FK → lugar_atencion | |
| fecha | DATE | |
| hora_inicio | TIME | |
| hora_fin | TIME | |
| intervalo_minutos | INT | Default 30 |
| duracion_turno_minutos | INT | Default 30 |
| sobreturnos | INT | Default 0 |
| estado | VARCHAR(50) | ACTIVO |
| nombre | VARCHAR(70) | |
| tipo_bloque | VARCHAR(20) | FIJA, VARIABLE |
| fecha_desde / fecha_hasta | DATE | |
| atiende_feriados | BOOLEAN | |
| dias_semana | VARCHAR(32) | |
| frecuencia | VARCHAR(20) | SEMANAL, MENSUAL |
| orden_mensual_semanas | TEXT | |
| practicas_json | TEXT | |
| UNIQUE | (agenda_id, fecha, hora_inicio) | |

### cupo (Slot)
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| bloque_id | UUID FK → bloque_programacion | |
| hora_inicio | TIMESTAMPTZ | |
| hora_fin | TIMESTAMPTZ | |
| estado | VARCHAR(50) | libre, reservado, bloqueado |
| capacidad | INT | Default 1 |
| overbooking_permitido | BOOLEAN | Default false |
| version | INT | Optimistic locking |
| UNIQUE | (bloque_id, hora_inicio) | |

### grupo_profesional
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| centro_id | UUID FK → centro | |
| servicio_id | UUID FK → servicio | |
| codigo | VARCHAR(40) | |
| nombre | VARCHAR(140) | |
| descripcion | VARCHAR(300) | |
| activo | BOOLEAN | |

### grupo_profesional_miembro
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| grupo_profesional_id | UUID FK → grupo_profesional | |
| efector_id | UUID FK → efector | Solo tipo PROFESIONAL |
| rol | VARCHAR(40) | |
| orden | INT | |
| activo | BOOLEAN | |
| UNIQUE | (grupo_profesional_id, efector_id) | |

**Trigger**: `trg_validar_miembro_grupo_profesional` — solo permite efectores de tipo PROFESIONAL del mismo centro/servicio.

### bloqueo_agenda
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| agenda_id | UUID FK → agenda | |
| inicio | TIMESTAMPTZ | |
| fin | TIMESTAMPTZ | |
| motivo_codigo | VARCHAR(40) | |
| tipo | VARCHAR(30) | |

### calendario_excepcion
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| fecha | DATE | |
| es_feriado | BOOLEAN | |
| descripcion | VARCHAR(140) | |
| ambito | VARCHAR(20) | |

### practica
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| servicio_id | UUID FK → servicio | |
| nombre | VARCHAR(160) | |
| duracion_minutos_sugerida | INT | |
| codigo_clinico | VARCHAR(40) | |
| activa | BOOLEAN | |

### dispositivo
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| centro_id | UUID FK → centro | |
| servicio_id | UUID FK → servicio | |
| codigo | VARCHAR(40) | |
| nombre | VARCHAR(140) | |
| tipo | VARCHAR(40) | Ej: ECG |
| activo | BOOLEAN | |

---

## sch_turno — Turnos

### turno_paciente
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | VARCHAR(300) PK | Formato libre generado por servicio |
| paciente_id | VARCHAR(80) | |
| profesional | VARCHAR(200) | |
| servicio | VARCHAR(200) | |
| centro | VARCHAR(200) | |
| fecha_hora | TIMESTAMPTZ | |
| estado | VARCHAR(60) | PROGRAMADO, EN_ATENCION, CUMPLIDO, CANCELADO, NO_ASISTIO |
| motivo | VARCHAR(300) | |

### sobreturno_disponibilidad
| Columna | Tipo | Descripción |
|---------|------|-------------|
| st_key | VARCHAR(200) PK | `{agendaId}:{bloqueId}:{fecha}` |
| disponibles | INT | >= 0 |

---

## sch_persona — Personas

### tipo_documento
| Columna | Tipo | Descripción |
|---------|------|-------------|
| codigo | VARCHAR(30) PK | DNI, CUIT_CUIL, PASAPORTE, DNM, CIPL |
| nombre | VARCHAR(80) | |
| activo | BOOLEAN | |

### persona
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| apellido | VARCHAR(120) | |
| nombre | VARCHAR(120) | |
| tipo_documento_codigo | VARCHAR(30) FK → tipo_documento | |
| numero_documento | VARCHAR(40) | |
| fecha_nacimiento | DATE | |
| sexo_biologico | VARCHAR(1) | M / F |
| estado | VARCHAR(20) | ACTIVO, INACTIVO |
| email | VARCHAR(140) | |
| telefono | VARCHAR(30) | |
| UNIQUE INDEX | (tipo_documento_codigo, UPPER(numero_documento)) | |

### financiador
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| codigo | VARCHAR(40) | OSDE, IOMA, PAMI, SWISS_MEDICAL, PRIVADO_PARTICULAR |
| nombre | VARCHAR(140) | |
| activo | BOOLEAN | |

### financiador_plan
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| financiador_id | UUID FK → financiador | |
| codigo | VARCHAR(40) | |
| nombre | VARCHAR(140) | |
| activo | BOOLEAN | |

---

## sch_seguridad — Seguridad y Autenticación

### rol
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| nombre | VARCHAR(80) | Administrador, Medico, Administrativo, Cajero, Auditor, etc. |
| descripcion | VARCHAR(300) | |
| es_predefinido | BOOLEAN | |
| parent_rol_id | UUID FK → rol | Rol padre para jerarquía |
| hereda_features | BOOLEAN | Default true |
| hereda_centros | BOOLEAN | Default false |
| es_admin_global | BOOLEAN | Default false |

### usuario_sistema
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| persona_id | UUID FK → persona | Opcional |
| username | VARCHAR(120) | |
| password_hash | VARCHAR(300) | PBKDF2-SHA256 |
| estado | VARCHAR(40) | ACTIVO, DEBE_CAMBIAR_PASSWORD |
| ultimo_login | TIMESTAMPTZ | |

Default: `admin` / password hasheado.

### usuario_rol
| Columna | Tipo | Descripción |
|---------|------|-------------|
| usuario_id | UUID FK → usuario_sistema | |
| rol_id | UUID FK → rol | |
| centro_id | UUID FK → centro | Alcance por centro |
| servicio_id | UUID FK → servicio | Para roles Médico |
| PK | (usuario_id, rol_id, centro_id) | |

### refresh_token
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| usuario_id | UUID FK | |
| token_hash | VARCHAR(128) | |
| expires_at | TIMESTAMPTZ | |
| revoked_at | TIMESTAMPTZ | |
| replaced_by_token_hash | VARCHAR(128) | Rotación de tokens |

### sesion_log
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| usuario_id | UUID FK | |
| accion | VARCHAR(80) | |
| ip | VARCHAR(80) | |
| user_agent | VARCHAR(300) | |
| resultado | VARCHAR(40) | |

### rol_feature_permiso
| Columna | Tipo | Descripción |
|---------|------|-------------|
| rol_id | UUID FK → rol | |
| feature_key | VARCHAR(160) | |
| permitido | BOOLEAN | |
| origen | VARCHAR(20) | DIRECTO, HEREDADO |
| PK | (rol_id, feature_key) | |

### rol_centro_alcance
| Columna | Tipo | Descripción |
|---------|------|-------------|
| rol_id | UUID FK → rol | |
| centro_id | UUID FK → centro | |
| permitido | BOOLEAN | |
| PK | (rol_id, centro_id) | |

---

## sch_admision — Admisión

### turno_admision
| Columna | Tipo | Descripción |
|---------|------|-------------|
| turno_id | VARCHAR(250) PK | `adm:{agendaId}:{bloqueId}:{fecha}:{hora}` |
| paciente_id | VARCHAR(80) | Null si no admitido |
| paciente_nombre | VARCHAR(300) | |
| documento | VARCHAR(80) | |
| financiador | VARCHAR(200) | |
| estado | VARCHAR(40) | |
| estado_turno | VARCHAR(40) | PROGRAMADO |
| motivo | VARCHAR(300) | |
| llegada_en | TIMESTAMPTZ | |

### encuentro
| Columna | Tipo | Descripción |
|---------|------|-------------|
| encuentro_id | VARCHAR(300) PK | `enc:{turnoId}` |
| turno_id | VARCHAR(250) FK → turno_admision | |
| paciente_id | VARCHAR(80) | |
| estado | VARCHAR(40) | ABIERTO, CERRADO |
| cerrado_en | TIMESTAMPTZ | |
| motivo_cierre | VARCHAR(300) | |
| UNIQUE | (turno_id) | |

---

## sch_hca — Historia Clínica Ambulatoria

### problema_cronico
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| paciente_id | UUID FK → persona | |
| descripcion | VARCHAR(300) | |
| fecha_creacion | TIMESTAMPTZ | |
| activo | BOOLEAN | |

### problema_cronico_evolucion
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| problema_cronico_id | UUID FK → problema_cronico | |
| fecha_evolucion | TIMESTAMPTZ | |
| resumen | VARCHAR(500) | |
| activo | BOOLEAN | |

### evolucion_ambulatoria
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| paciente_id | UUID FK → persona | |
| fecha_atencion | TIMESTAMPTZ | |
| especialidad | VARCHAR(120) | |
| profesional | VARCHAR(160) | |
| problemas_asociados_json | JSONB | |

### receta_digital
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| paciente_id | UUID FK → persona | |
| encuentro_id | UUID | |
| prescriptor_usuario_id | UUID | |
| prescriptor_matricula | VARCHAR(64) | |
| organizacion_oid | VARCHAR(128) | |
| estado | VARCHAR(40) | |
| rdiar_profile | VARCHAR(40) | |
| fhir_bundle_json | JSONB | Bundle FHIR de la receta |
| external_recipe_id | VARCHAR(128) | ID en repositorio externo (RECETARIO) |
| external_repository_uri | VARCHAR(300) | |
| validacion_outcome_json | JSONB | |

### receta_digital_item
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| receta_id | UUID FK → receta_digital | |
| medicamento_codigo | VARCHAR(64) | |
| medicamento_sistema | VARCHAR(200) | |
| medicamento_display | VARCHAR(300) | |
| dosis_texto | VARCHAR(200) | |
| frecuencia_texto | VARCHAR(200) | |
| duracion_dias | INT | |
| indicacion | VARCHAR(500) | |
| estado | VARCHAR(40) | |

### receta_digital_evento
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| receta_id | UUID FK → receta_digital | |
| tipo_evento | VARCHAR(40) | |
| payload_json | JSONB | |

---

## sch_fhir — Auditoría FHIR

### integration_audit
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| correlation_id | VARCHAR(80) | |
| idempotency_key | VARCHAR(80) | |
| operation_name | VARCHAR(100) | |
| resource_type | VARCHAR(40) | Schedule, Slot, Appointment, Location |
| resource_id | VARCHAR(200) | |
| request_method | VARCHAR(10) | |
| request_path | VARCHAR(500) | |
| request_body | TEXT | |
| response_code | INT | |
| response_body | TEXT | |
| source_system | VARCHAR(80) | portal, his-internal |
| jwt_sub | VARCHAR(200) | |
| jwt_scopes | TEXT | |

---

## sch_administracion — Administración

### t_paciente_financiador_plan
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | |
| paciente_id | UUID FK → persona | |
| financiador_id | UUID FK → financiador | |
| plan_financiador_id | UUID FK → financiador_plan | |
| numero_afiliado | VARCHAR(80) | |
| fecha_desde | DATE | |
| fecha_hasta | DATE | Nullable |
| vigente | BOOLEAN | |
| CHECK | (fecha_hasta IS NULL OR fecha_hasta >= fecha_desde) | |

---

## Diagrama de Relaciones (esquemático)

```
centro ──┬── servicio ──┬── practica
         │              ├── efector ──── usuario_sistema
         │              ├── grupo_profesional ── grupo_profesional_miembro ── efector
         │              └── dispositivo
         │
         ├── lugar_atencion
         ├── agenda ──┬── bloque_programacion ──┬── cupo
         │            ├── bloqueo_agenda         └── (turno_paciente)
         │            └── calendario_excepcion
         └── (usuario_rol)

persona ──┬── tipo_documento
          ├── financiador ── financiador_plan
          ├── t_paciente_financiador_plan
          ├── turno_paciente
          ├── turno_admision ── encuentro
          ├── problema_cronico ── problema_cronico_evolucion
          ├── evolucion_ambulatoria
          └── receta_digital ──┬── receta_digital_item
                              └── receta_digital_evento

usuario_sistema ──┬── usuario_rol ──┬── rol ──┬── rol_feature_permiso
                  │                │         └── rol_centro_alcance
                  │                └── centro
                  ├── refresh_token
                  ├── sesion_log
                  └── efector (1:1)
```

---

## Convenciones

| Convención | Regla |
|-------------|-------|
| **IDs** | UUID v4 generados con `gen_random_uuid()` |
| **Auditoría** | Toda tabla tiene `created_at` y `updated_at` |
| **Borrado lógico** | Se usa columna `activo` / `activa` BOOLEAN, no DELETE físico |
| **Soft-delete en HCA** | Columnas `activo` con índices parciales `WHERE activo = true` |
| **FKs** | Con `ON DELETE CASCADE` o `RESTRICT` según el caso |
| **Timezones** | `TIMESTAMPTZ` con zona horaria Argentina |
| **Passwords** | PBKDF2-SHA256 con salt |
| **Naming** | snake_case, prefijo `sch_` para schemas, `t_` para tablas administrativas |
| **Migraciones** | Scripts SQL planos en `db/migrations/` numerados secuencialmente |

---

## Historial de Migraciones

| # | Archivo | Feature |
|---|---------|---------|
| 001 | `001_init_agenda.sql` | Schema inicial de agenda, bloques, cupos |
| 002 | `002_feature_7005_agenda_observacion.sql` | Campo observación en agenda |
| 003 | `003_feature_7014_agenda_campos_y_asociaciones.sql` | centro, servicio, efector + FK en agenda |
| 004 | `004_feature_7027_bloques_programacion_fija.sql` | lugar_atencion, bloque fijo |
| 005 | `005_feature_8989_practicas_bloque_variable.sql` | Prácticas en bloque variable |
| 006 | `006_feature_11199_grupo_profesionales.sql` | Grupos profesionales + trigger |
| 007 | `007_feature_5900_personas_identificacion.sql` | Personas, tipo_documento |
| 008 | `008_feature_abms_estructura_interna.sql` | Financiadores, planes, prácticas, dispositivos |
| 009 | `009_feature_11720_problemas_cronicos.sql` | Problemas crónicos y evolución |
| 010 | `010_feature_22907_receta_digital.sql` | Receta digital (RECETARIO) |
| 011 | `011_feature_11728_evolucion_ambulatoria.sql` | Evolución ambulatoria |
| 012 | `012_feature_admision_core.sql` | Admisión: turno_admision, encuentro |
| 013 | `013_feature_turnos_paciente.sql` | turno_paciente, sobreturno_disponibilidad |
| 014 | `014_feature_seguridad_auth.sql` | Roles, usuarios, refresh_token, sesión |
| 015 | `015_feature_turnos_paciente_financiador.sql` | t_paciente_financiador_plan |
| 016 | `016_feature_turnos_financiadores_catalogo_extendido.sql` | Swiss Medical, PAMI |
| 017 | `017_feature_servicio_nombre_semantico_unico.sql` | Trigger unicidad semántica en servicio |
| 018 | `018_feature_centro_datos_contacto.sql` | Dirección, teléfono, mail en centro |
| 019 | `019_feature_seguridad_rol_centro.sql` | centro_id en usuario_rol |
| 020 | `020_feature_seguridad_roles_jerarquicos.sql` | Roles padre/hijo, feature_permiso, centro_alcance |
| 021 | `021_feature_privado_particular_plan_11.sql` | Unificación plan PRIVADO_PARTICULAR |
| 022 | `022_feature_persona_datos_contacto.sql` | email, teléfono en persona |
| 023 | `023_feature_seguridad_usuario_rol_servicio.sql` | servicio_id en usuario_rol |
| 024 | `024_feature_agenda_efector_usuario_matriculas.sql` | usuario_id, matrículas en efector |

---

## Cómo conectarse

```powershell
# Desde Docker
docker exec -it vitalflow_postgres psql -U vitalflow_user -d vitalflow_his

# Desde psql local
psql -h localhost -p 55432 -U vitalflow_user -d vitalflow_his
```

```sql
-- Ver todos los schemas
\dn

-- Ver tablas de un schema
\dt sch_agenda.*

-- Ver estructura de una tabla
\d sch_agenda.agenda

-- Consultar datos
SELECT * FROM sch_persona.persona;
SELECT * FROM sch_agenda.centro;
SELECT * FROM sch_seguridad.rol;
```
