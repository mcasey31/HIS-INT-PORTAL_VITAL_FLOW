CREATE SCHEMA IF NOT EXISTS sch_facturador;

CREATE TABLE IF NOT EXISTS sch_facturador.t_prestaciones (
    id BIGINT PRIMARY KEY,
    codigo VARCHAR(30),
    descripcion VARCHAR(160)
);

CREATE TABLE IF NOT EXISTS sch_facturador.t_episodios_generales (
    id BIGINT PRIMARY KEY,
    id_financiador BIGINT,
    id_plan BIGINT,
    id_ambito BIGINT,
    id_filial BIGINT
);

CREATE OR REPLACE VIEW sch_facturador.v_episodios_generales AS
SELECT
    e.id,
    e.id_financiador,
    e.id_plan,
    e.id_ambito,
    e.id_filial
FROM sch_facturador.t_episodios_generales e;

CREATE TABLE IF NOT EXISTS sch_facturador.t_prestaciones_episodios (
    id BIGINT PRIMARY KEY,
    id_episodio_general BIGINT NOT NULL,
    id_prestacion BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sch_facturador.t_prefacturas (
    id BIGINT PRIMARY KEY,
    id_lote BIGINT
);

CREATE TABLE IF NOT EXISTS sch_facturador.t_episodios_homologados (
    id BIGINT PRIMARY KEY,
    id_prefactura BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sch_facturador.t_prestaciones_episodios_homologadas (
    id BIGINT PRIMARY KEY,
    id_episodio_homologado BIGINT NOT NULL,
    id_prestacion_episodio BIGINT NOT NULL,
    id_prestacion_catalogo BIGINT
);

CREATE TABLE IF NOT EXISTS sch_facturador.t_procesamientos (
    id BIGINT PRIMARY KEY,
    id_lote BIGINT NOT NULL,
    id_prestacion_episodio BIGINT NOT NULL,
    id_episodio BIGINT,
    id_plan BIGINT,
    id_ambito BIGINT,
    id_prestacion_referencia BIGINT,
    codigo_prestacion_referencia VARCHAR(30),
    descripcion_prestacion_referencia VARCHAR(160)
);
