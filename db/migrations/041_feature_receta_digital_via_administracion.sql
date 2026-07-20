-- =====================================================
-- Migracion: Agregar columna via_administracion
-- Tabla: sch_hca.receta_digital_item
-- Fecha: 2026-07-20
-- Rama: arreglo_EC_prescripciones
-- =====================================================
-- Ejecutar:
--   docker exec -i vitalflow_postgres psql -U vitalflow_user -d vitalflow_his -f /dev/stdin < db/migrations/041_feature_receta_digital_via_administracion.sql
-- =====================================================

ALTER TABLE sch_hca.receta_digital_item
    ADD COLUMN IF NOT EXISTS via_administracion varchar(100);
