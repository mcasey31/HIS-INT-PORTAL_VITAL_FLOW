# Changelog

## arreglo_EC_prescripciones - 2026-07-20

### Migracion requerida

La columna `via_administracion` **no existe** en la BD del entorno `back/`.
Ejecutar el siguiente comando antes de levantar el backend:

```bash
docker exec -i vitalflow_postgres psql -U vitalflow_user -d vitalflow_his -f /dev/stdin < db/migrations/041_feature_receta_digital_via_administracion.sql
```

O si se tiene acceso directo a psql:

```bash
psql -h localhost -p 55432 -U vitalflow_user -d vitalflow_his -f db/migrations/041_feature_receta_digital_via_administracion.sql
```

La migracion es idempotente (`ADD COLUMN IF NOT EXISTS`), es segura de re-ejecutar.

### Fixed

- Campo `via_administracion` ahora se guarda como campo estructurado en `receta_digital_item` (antes se concatenaba como texto libre en indicaciones).
- Backend `back/` ahora lee y escribe `via_administracion` en endpoints de prescripciones y recetas.

### Added

- Migracion `041_feature_receta_digital_via_administracion.sql` agregada a `db/migrations/`.
- `ViaAdministracion` en `CrearPrescripcionRequest` (backend + frontend).
- `ViaAdministracion` en `RecetaDigitalItemResponse` (backend + frontend).
- Auto-sugerencia de via segun `forma` del medicamento seleccionado.

### Changed (UI/UX)

- Busqueda de medicamentos: columna "Forma" reemplaza "Familia".
- Formulario de prescripcion: labels mejorados, placeholders descriptivos, dosis/frecuencia marcadas como requeridas.
- Listado de prescripciones: muestra detalle completo por item (via, dosis, frecuencia, duracion, indicacion).
- Impresion de recetas: nueva columna "Via de administracion".
- Panoramica: muestra `[via]` en items de recetas activas.
