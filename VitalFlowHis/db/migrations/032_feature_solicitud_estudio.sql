CREATE TABLE IF NOT EXISTS sch_hca.solicitud_estudio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turno_id VARCHAR(255) NOT NULL,
    paciente_id VARCHAR(255) NOT NULL,
    fecha_solicitada DATE NOT NULL,
    practica VARCHAR(255) NOT NULL,
    observacion TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by VARCHAR(80),
    updated_by VARCHAR(80)
);

CREATE INDEX IF NOT EXISTS idx_solicitud_estudio_turno
    ON sch_hca.solicitud_estudio (turno_id);

CREATE INDEX IF NOT EXISTS idx_solicitud_estudio_paciente
    ON sch_hca.solicitud_estudio (paciente_id);
