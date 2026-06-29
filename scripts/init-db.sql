-- ================================================
-- Init Database - PostgreSQL
-- ================================================

-- Create schemas if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS sch_agenda;
CREATE SCHEMA IF NOT EXISTS sch_turno;
CREATE SCHEMA IF NOT EXISTS sch_fhir;
CREATE SCHEMA IF NOT EXISTS sch_persona;
CREATE SCHEMA IF NOT EXISTS sch_seguridad;

-- ================================================
-- HIS Agenda Tables
-- ================================================

-- Centro (Healthcare facility)
CREATE TABLE IF NOT EXISTS sch_agenda.centro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(500),
    telefono VARCHAR(20),
    mail VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_sch_agenda_centro_nombre_canonico
    ON sch_agenda.centro (lower(btrim(nombre)));

-- Servicio (Medical specialty)
CREATE TABLE IF NOT EXISTS sch_agenda.servicio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_id UUID NOT NULL REFERENCES sch_agenda.centro(id) ON DELETE CASCADE,
    codigo VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(centro_id, codigo)
);

-- Lugar de atención (Consultation room, lab, etc.)
CREATE TABLE IF NOT EXISTS sch_agenda.lugar_atencion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_id UUID NOT NULL REFERENCES sch_agenda.centro(id) ON DELETE CASCADE,
    codigo VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50), -- consultorio, lab, sala-espera, etc.
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(centro_id, codigo)
);

-- Efector (Practitioner/Provider)
CREATE TABLE IF NOT EXISTS sch_agenda.efector (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_id UUID NOT NULL REFERENCES sch_agenda.centro(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL REFERENCES sch_agenda.servicio(id) ON DELETE CASCADE,
    codigo VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    tipo_efector VARCHAR(50) DEFAULT 'PROFESIONAL', -- PROFESIONAL, ADMINISTRATIVO, etc.
    licencia_numero VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(centro_id, codigo)
);

CREATE OR REPLACE FUNCTION sch_agenda.fn_validar_profesional_con_usuario_persona()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF upper(coalesce(NEW.tipo_efector, '')) <> 'PROFESIONAL' THEN
        RETURN NEW;
    END IF;

    IF NEW.usuario_id IS NULL THEN
        RAISE EXCEPTION 'Los efectores profesionales deben tener un usuario del sistema asociado.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM sch_seguridad.usuario_sistema u
        WHERE u.id = NEW.usuario_id
          AND u.persona_id IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'El usuario asociado al efector profesional debe existir y tener una persona vinculada.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validar_profesional_con_usuario_persona ON sch_agenda.efector;

CREATE TRIGGER trg_validar_profesional_con_usuario_persona
BEFORE INSERT OR UPDATE ON sch_agenda.efector
FOR EACH ROW
EXECUTE FUNCTION sch_agenda.fn_validar_profesional_con_usuario_persona();

-- Agenda (Schedule)
CREATE TABLE IF NOT EXISTS sch_agenda.agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centro_id UUID NOT NULL REFERENCES sch_agenda.centro(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL REFERENCES sch_agenda.servicio(id) ON DELETE CASCADE,
    efector_id UUID NOT NULL REFERENCES sch_agenda.efector(id) ON DELETE CASCADE,
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'ACTIVA', -- ACTIVA, INACTIVA, SUSPENDIDA
    tipo_agenda VARCHAR(50), -- PROGRAMADA, SOBRE-TURNOS, etc.
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE NOT NULL,
    visible_contact_center BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bloque de programación (Programming block)
CREATE TABLE IF NOT EXISTS sch_agenda.bloque_programacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agenda_id UUID NOT NULL REFERENCES sch_agenda.agenda(id) ON DELETE CASCADE,
    lugar_atencion_id UUID NOT NULL REFERENCES sch_agenda.lugar_atencion(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    intervalo_minutos INT DEFAULT 30,
    duracion_turno_minutos INT DEFAULT 30,
    sobreturnos INT DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'ACTIVO',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(agenda_id, fecha, hora_inicio)
);

-- Cupo (Slot/Appointment slot)
CREATE TABLE IF NOT EXISTS sch_agenda.cupo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bloque_id UUID NOT NULL REFERENCES sch_agenda.bloque_programacion(id) ON DELETE CASCADE,
    hora_inicio TIMESTAMPTZ NOT NULL,
    hora_fin TIMESTAMPTZ NOT NULL,
    estado VARCHAR(50) DEFAULT 'libre', -- libre, reservado, bloqueado
    capacidad INT DEFAULT 1,
    overbooking_permitido BOOLEAN DEFAULT false,
    version INT DEFAULT 0, -- For optimistic locking
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(bloque_id, hora_inicio)
);

-- ================================================
-- Turnos (Appointments)
-- ================================================

CREATE TABLE IF NOT EXISTS sch_turno.turno_paciente (
    id VARCHAR(100) PRIMARY KEY,
    paciente_id VARCHAR(100) NOT NULL,
    centro_id UUID NOT NULL REFERENCES sch_agenda.centro(id),
    servicio_id UUID NOT NULL REFERENCES sch_agenda.servicio(id),
    efector_id UUID NOT NULL REFERENCES sch_agenda.efector(id),
    cupo_id UUID NOT NULL REFERENCES sch_agenda.cupo(id),
    fecha_hora TIMESTAMPTZ NOT NULL,
    estado VARCHAR(50) DEFAULT 'PROGRAMADO', -- PROGRAMADO, EN_ATENCION, CUMPLIDO, CANCELADO, NO_ASISTIO
    motivo TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- FHIR Integration Audit Trail
-- ================================================

CREATE TABLE IF NOT EXISTS sch_fhir.integration_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correlation_id VARCHAR(80) NOT NULL,
    idempotency_key VARCHAR(80),
    operation_name VARCHAR(100) NOT NULL,
    resource_type VARCHAR(40), -- Schedule, Slot, Appointment, Location
    resource_id VARCHAR(200),
    request_method VARCHAR(10), -- GET, POST, PUT, DELETE
    request_path VARCHAR(500),
    request_body TEXT,
    response_code INT,
    response_body TEXT,
    request_timestamp TIMESTAMPTZ NOT NULL,
    response_timestamp TIMESTAMPTZ NOT NULL,
    source_system VARCHAR(80), -- portal, his-internal, etc.
    error_detail TEXT,
    jwt_sub VARCHAR(200),
    jwt_scopes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_sch_fhir_correlation_id ON sch_fhir.integration_audit(correlation_id);
CREATE INDEX idx_sch_fhir_idempotency_key ON sch_fhir.integration_audit(idempotency_key);
CREATE INDEX idx_sch_fhir_resource ON sch_fhir.integration_audit(resource_type, resource_id);
CREATE INDEX idx_sch_fhir_timestamp ON sch_fhir.integration_audit(request_timestamp DESC);

-- ================================================
-- Portal Tables
-- ================================================

-- Ya existentes en Portal Prisma, solo crear refs aquí si needed
-- (Prisma maneja la creación de tablas Portal via migrations)
