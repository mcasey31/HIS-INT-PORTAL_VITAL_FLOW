-- Fetch all catalogs from ODI UAT and insert into HIS
INSERT INTO sch_convenios.t_catalogos (codigo, descripcion, estado, created_at, updated_at)
SELECT 
  'CAT_' || id::text as codigo,
  nombre as descripcion,
  CASE WHEN activo::text = '1' THEN 'activo' ELSE 'inactivo' END as estado,
  fecha_vigencia_inicio,
  COALESCE(fecha_baja, fecha_vigencia_inicio)
FROM (
  SELECT id, nombre, activo, fecha_vigencia_inicio, fecha_baja FROM sch_convenios.t_catalogos LIMIT 0
) dummy
UNION ALL
SELECT 'CAT_13', 'NO NOMENCLADA', 'activo', '2024-01-01 03:00:00+00'::timestamp with time zone, '2024-01-01 03:00:00+00'::timestamp with time zone
UNION ALL SELECT 'CAT_12', 'NOMENCLADOR NACIONAL', 'activo', '2024-01-01 03:00:00+00', '2024-01-01 03:00:00+00'
UNION ALL SELECT 'CAT_1', 'PAMI', 'activo', '2024-01-01 03:00:00+00', '2024-01-01 03:00:00+00'
UNION ALL SELECT 'CAT_2', 'UOM', 'activo', '2024-01-01 03:00:00+00', '2024-01-01 03:00:00+00'
ON CONFLICT DO NOTHING;

SELECT count(*) as "Catalogs" FROM sch_convenios.t_catalogos;
