-- Smoke E2E Reglas Facturacion (idempotente)
-- Uso sugerido:
--   Get-Content scripts/local/20260606_smoke_e2e_reglas_asserts.sql -Raw |
--     docker exec -i odi_db psql -U odi_usr_facturacion -d odi_db_facturacion -v ON_ERROR_STOP=1

BEGIN;

-- Precondiciones minimas
DO $$
BEGIN
    IF to_regprocedure('sch_motor_reglas.fn_resolver_regla_facturacion(bigint,bigint,bigint,bigint,bigint,bigint,bigint,smallint,timestamp with time zone)') IS NULL THEN
        RAISE EXCEPTION 'Falta fn_resolver_regla_facturacion. Cargar scripts sprint0014 de motor de reglas.';
    END IF;

    IF to_regprocedure('sch_facturador.sp_prfr_resolver_reglas_facturacion_lote(bigint[])') IS NULL THEN
        RAISE EXCEPTION 'Falta sp_prfr_resolver_reglas_facturacion_lote. Cargar scripts sprint0014 de traza.';
    END IF;

    IF to_regprocedure('sch_facturador.sp_prfr_aplicar_resolucion_reglas_modulacion_lote(bigint)') IS NULL THEN
        RAISE EXCEPTION 'Falta sp_prfr_aplicar_resolucion_reglas_modulacion_lote. Cargar scripts sprint0014 HU31366_31367.';
    END IF;

    IF to_regprocedure('sch_facturador.sp_prfr_aplicar_resolucion_reglas_homologadas(bigint[])') IS NULL THEN
        RAISE EXCEPTION 'Falta sp_prfr_aplicar_resolucion_reglas_homologadas. Cargar scripts sprint0014 HU31361.';
    END IF;

    IF to_regprocedure('sch_facturador.fn_obtener_auditoria_reglas_facturacion(bigint,bigint,timestamp with time zone,timestamp with time zone)') IS NULL THEN
        RAISE EXCEPTION 'Falta fn_obtener_auditoria_reglas_facturacion. Cargar scripts sprint0014 HU31366_31367.';
    END IF;
END $$;

-- Limpieza de datos de prueba
DELETE FROM sch_motor_reglas.t_reglas_facturacion WHERE nombre LIKE 'SMOKE_E2E_%';

DELETE FROM sch_facturador.t_aplicaciones_reglas_homologacion WHERE id_prefactura IN (9101, 9102);
DELETE FROM sch_facturador.t_aplicaciones_reglas_modulacion WHERE id_lote IN (93001, 93002);
DELETE FROM sch_facturador.t_traza_resolucion_reglas_facturacion WHERE id_prestacion_episodio IN (7201, 7202);
DELETE FROM sch_facturador.t_procesamientos WHERE id IN (8501, 8502);
DELETE FROM sch_facturador.t_prestaciones_episodios_homologadas WHERE id IN (8401, 8402);
DELETE FROM sch_facturador.t_episodios_homologados WHERE id IN (8301, 8302);
DELETE FROM sch_facturador.t_prefacturas WHERE id IN (9101, 9102);
DELETE FROM sch_facturador.t_prestaciones_episodios WHERE id IN (7201, 7202);
DELETE FROM sch_facturador.t_episodios_generales WHERE id IN (6101, 6102);
DELETE FROM sch_facturador.t_prestaciones WHERE id IN (1300, 1400, 9301, 9302, 9303, 9304);

-- Seed controlado
INSERT INTO sch_facturador.t_prestaciones (id, codigo, descripcion) VALUES
(1300, 'ORI-1300', 'Origen con reglas'),
(1400, 'ORI-1400', 'Origen sin reglas'),
(9301, 'DST-9301', 'Destino base'),
(9302, 'DST-9302', 'Destino especifico'),
(9303, 'DST-9303', 'Destino historico'),
(9304, 'DST-9304', 'Destino vigente')
ON CONFLICT (id) DO UPDATE SET codigo = EXCLUDED.codigo, descripcion = EXCLUDED.descripcion;

INSERT INTO sch_facturador.t_episodios_generales (id, id_financiador, id_plan, id_ambito, id_filial) VALUES
(6101, 10, 20, 30, 40),
(6102, 10, 20, 30, 40)
ON CONFLICT (id) DO UPDATE
SET id_financiador = EXCLUDED.id_financiador,
    id_plan = EXCLUDED.id_plan,
    id_ambito = EXCLUDED.id_ambito,
    id_filial = EXCLUDED.id_filial;

INSERT INTO sch_facturador.t_prestaciones_episodios (id, id_episodio_general, id_prestacion) VALUES
(7201, 6101, 1300),
(7202, 6102, 1400)
ON CONFLICT (id) DO UPDATE
SET id_episodio_general = EXCLUDED.id_episodio_general,
    id_prestacion = EXCLUDED.id_prestacion;

INSERT INTO sch_facturador.t_prefacturas (id, id_lote) VALUES
(9101, 93001),
(9102, 93002)
ON CONFLICT (id) DO UPDATE SET id_lote = EXCLUDED.id_lote;

INSERT INTO sch_facturador.t_episodios_homologados (id, id_prefactura) VALUES
(8301, 9101),
(8302, 9102)
ON CONFLICT (id) DO UPDATE SET id_prefactura = EXCLUDED.id_prefactura;

INSERT INTO sch_facturador.t_prestaciones_episodios_homologadas
(id, id_episodio_homologado, id_prestacion_episodio, id_prestacion_catalogo)
VALUES
(8401, 8301, 7201, 1300),
(8402, 8302, 7202, 1400)
ON CONFLICT (id) DO UPDATE
SET id_episodio_homologado = EXCLUDED.id_episodio_homologado,
    id_prestacion_episodio = EXCLUDED.id_prestacion_episodio,
    id_prestacion_catalogo = EXCLUDED.id_prestacion_catalogo;

INSERT INTO sch_facturador.t_procesamientos
(id, id_lote, id_prestacion_episodio, id_episodio, id_plan, id_ambito, id_prestacion_referencia, codigo_prestacion_referencia, descripcion_prestacion_referencia)
VALUES
(8501, 93001, 7201, 6101, 20, 30, 1300, 'ORI-1300', 'Origen con reglas'),
(8502, 93002, 7202, 6102, 20, 30, 1400, 'ORI-1400', 'Origen sin reglas')
ON CONFLICT (id) DO UPDATE
SET id_lote = EXCLUDED.id_lote,
    id_prestacion_episodio = EXCLUDED.id_prestacion_episodio,
    id_episodio = EXCLUDED.id_episodio,
    id_plan = EXCLUDED.id_plan,
    id_ambito = EXCLUDED.id_ambito,
    id_prestacion_referencia = EXCLUDED.id_prestacion_referencia,
    codigo_prestacion_referencia = EXCLUDED.codigo_prestacion_referencia,
    descripcion_prestacion_referencia = EXCLUDED.descripcion_prestacion_referencia;

INSERT INTO sch_motor_reglas.t_reglas_facturacion
(nombre, descripcion, prioridad, tipo_resolucion, id_prestacion_origen, id_prestacion_destino, id_financiador, id_plan, id_centro, id_especialidad, id_complejidad, id_ambito, fecha_vigencia_inicio, fecha_vigencia_fin, activo, usuario_alta)
VALUES
('SMOKE_E2E_BASE', 'Regla base', 80, 'DEFAULT', 1300, 9301, 10, 20, NULL, NULL, NULL, 30, NOW() - INTERVAL '5 day', NOW() + INTERVAL '20 day', TRUE, 'smoke'),
('SMOKE_E2E_ESPECIFICA', 'Regla especifica por centro', 120, 'DIRECTA', 1300, 9302, 10, 20, 40, NULL, NULL, 30, NOW() - INTERVAL '5 day', NOW() + INTERVAL '20 day', TRUE, 'smoke'),
('SMOKE_E2E_HIST_OLD', 'Regla historica expirada', 200, 'DIRECTA', 1300, 9303, 10, 20, 40, NULL, NULL, 30, NOW() - INTERVAL '120 day', NOW() - INTERVAL '60 day', TRUE, 'smoke'),
('SMOKE_E2E_HIST_NEW', 'Regla historica vigente', 150, 'DIRECTA', 1300, 9304, 10, 20, 40, NULL, NULL, 30, NOW() - INTERVAL '10 day', NOW() + INTERVAL '90 day', TRUE, 'smoke');

-- Asserts resolver
DO $$
DECLARE
    v_now_dest bigint;
    v_hist_dest bigint;
    v_nomatch_count int;
BEGIN
    SELECT id_prestacion_destino
      INTO v_now_dest
      FROM sch_motor_reglas.fn_resolver_regla_facturacion(1300, 10, 20, 40, NULL, NULL, 30, NULL, NOW());

    IF v_now_dest IS DISTINCT FROM 9304 THEN
        RAISE EXCEPTION 'ASSERT FAIL resolver NOW: esperado 9304, obtenido %', v_now_dest;
    END IF;

    SELECT id_prestacion_destino
      INTO v_hist_dest
      FROM sch_motor_reglas.fn_resolver_regla_facturacion(1300, 10, 20, 40, NULL, NULL, 30, NULL, NOW() - INTERVAL '90 day');

    IF v_hist_dest IS DISTINCT FROM 9303 THEN
        RAISE EXCEPTION 'ASSERT FAIL resolver HIST: esperado 9303, obtenido %', v_hist_dest;
    END IF;

    SELECT count(*)
      INTO v_nomatch_count
      FROM sch_motor_reglas.fn_resolver_regla_facturacion(1400, 10, 20, 40, NULL, NULL, 30, NULL, NOW());

    IF v_nomatch_count <> 0 THEN
        RAISE EXCEPTION 'ASSERT FAIL resolver NO-MATCH: esperado 0, obtenido %', v_nomatch_count;
    END IF;
END $$;

-- Cadena E2E
CALL sch_facturador.sp_prfr_resolver_reglas_facturacion_lote(ARRAY[7201,7202]);
CALL sch_facturador.sp_prfr_aplicar_resolucion_reglas_modulacion_lote(93001);
CALL sch_facturador.sp_prfr_aplicar_resolucion_reglas_modulacion_lote(93002);
CALL sch_facturador.sp_prfr_aplicar_resolucion_reglas_homologadas(ARRAY[9101,9102]);

-- Asserts E2E
DO $$
DECLARE
    v_traza_rule_7201 bigint;
    v_traza_rule_7202 bigint;
    v_mod_rows int;
    v_hom_rows int;
    v_aud_rows int;
BEGIN
    SELECT id_regla
      INTO v_traza_rule_7201
      FROM sch_facturador.t_traza_resolucion_reglas_facturacion
     WHERE id_prestacion_episodio = 7201
     ORDER BY fecha_resolucion DESC, id DESC
     LIMIT 1;

    IF v_traza_rule_7201 IS NULL THEN
        RAISE EXCEPTION 'ASSERT FAIL traza 7201: se esperaba regla resuelta';
    END IF;

    SELECT id_regla
      INTO v_traza_rule_7202
      FROM sch_facturador.t_traza_resolucion_reglas_facturacion
     WHERE id_prestacion_episodio = 7202
     ORDER BY fecha_resolucion DESC, id DESC
     LIMIT 1;

    IF v_traza_rule_7202 IS NOT NULL THEN
        RAISE EXCEPTION 'ASSERT FAIL traza 7202: no debia resolver regla';
    END IF;

    SELECT count(*)
      INTO v_mod_rows
      FROM sch_facturador.t_aplicaciones_reglas_modulacion
     WHERE id_lote = 93001
       AND id_prestacion_origen = 1300
       AND id_prestacion_destino = 9304;

    IF v_mod_rows <> 1 THEN
        RAISE EXCEPTION 'ASSERT FAIL modulacion: esperado 1 aplicacion, obtenido %', v_mod_rows;
    END IF;

    SELECT count(*)
      INTO v_hom_rows
      FROM sch_facturador.t_aplicaciones_reglas_homologacion
     WHERE id_prefactura = 9101
       AND id_prestacion_catalogo_anterior = 1300
       AND id_prestacion_catalogo_nuevo = 9304;

    IF v_hom_rows <> 1 THEN
        RAISE EXCEPTION 'ASSERT FAIL homologacion: esperado 1 aplicacion, obtenido %', v_hom_rows;
    END IF;

    SELECT count(*)
      INTO v_aud_rows
      FROM sch_facturador.fn_obtener_auditoria_reglas_facturacion(9101, 93001, NOW() - INTERVAL '2 day', NOW() + INTERVAL '1 day');

    IF v_aud_rows < 2 THEN
        RAISE EXCEPTION 'ASSERT FAIL auditoria: esperado al menos 2 eventos, obtenido %', v_aud_rows;
    END IF;
END $$;

-- Salida resumida
SELECT 'SMOKE_OK' AS estado,
       (SELECT count(*) FROM sch_facturador.t_aplicaciones_reglas_modulacion WHERE id_lote = 93001) AS modulacion_aplicada,
       (SELECT count(*) FROM sch_facturador.t_aplicaciones_reglas_homologacion WHERE id_prefactura = 9101) AS homologacion_aplicada,
       (SELECT count(*) FROM sch_facturador.fn_obtener_auditoria_reglas_facturacion(9101, 93001, NOW() - INTERVAL '2 day', NOW() + INTERVAL '1 day')) AS auditoria_eventos;

COMMIT;
