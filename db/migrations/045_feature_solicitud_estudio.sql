-- Solicitud de estudio: persiste las prácticas solicitadas por turno/paciente
-- La tabla ya existe en la BD, solo agregamos columnas faltantes si no existen

ALTER TABLE sch_hca.solicitud_estudio
    ADD COLUMN IF NOT EXISTS practica_nombre VARCHAR(500) GENERATED ALWAYS AS (practica) STORED;

ALTER TABLE sch_hca.solicitud_estudio
    ADD COLUMN IF NOT EXISTS practica_catalogo_id INT REFERENCES sch_hca.practica_catalogo(id);
