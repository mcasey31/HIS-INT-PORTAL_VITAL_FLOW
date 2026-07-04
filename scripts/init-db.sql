-- ================================================
-- Init Database - PostgreSQL
-- Solo schemas y extensions (tablas via migrations)
-- ================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS sch_agenda;
CREATE SCHEMA IF NOT EXISTS sch_turno;
CREATE SCHEMA IF NOT EXISTS sch_persona;
CREATE SCHEMA IF NOT EXISTS sch_seguridad;
CREATE SCHEMA IF NOT EXISTS sch_hca;
CREATE SCHEMA IF NOT EXISTS sch_admision;
CREATE SCHEMA IF NOT EXISTS sch_administracion;
CREATE SCHEMA IF NOT EXISTS sch_ubicacion;
