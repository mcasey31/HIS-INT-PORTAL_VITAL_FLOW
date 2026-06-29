# Sprint A - Smoke Test UI Reproducible

## Objetivo

Validar rapidamente que ABM Catalogos/Prestaciones funciona en frontend React contra backend FastAPI y PostgreSQL local.

## Prerrequisitos

- Docker stack activo.
- Frontend accesible en http://localhost:8080.
- Backend accesible en http://localhost:8000.

## Preparacion de datos

Ejecutar:

```powershell
Set-Location "c:\MODULO CONV-FACT ODI\MODULOS CONV-FACT ODI"
.\scripts\seed_ui_smoke_sprint_a.ps1
```

Resultado esperado:

- Mensaje "OK: datos UI smoke generados".
- Salida con catalogo_id y codigo generado.

## Checklist UI

1. Abrir http://localhost:8080.
   - Esperado: cabecera "Sprint A - ABM Prestaciones" y backend health en "ok".

2. En seccion Catalogos, filtrar por parte del codigo generado (CAT-UI-...).
   - Esperado: aparece el catalogo creado por script.

3. Click en la fila del catalogo.
   - Esperado: queda resaltada la fila seleccionada.

4. En seccion Prestaciones del catalogo, validar listado inicial.
   - Esperado: aparecen 2 prestaciones (una modulo No y otra modulo Si con prioridad).

5. Probar filtro de prestaciones: modulo=Si.
   - Esperado: queda solo la prestacion con modulo Si.

6. Ejecutar accion Editar sobre una prestacion.
   - Esperado: permite actualizar codigo/descripcion/modulo/prioridad y refresca la grilla.

7. Ejecutar accion Inactivar sobre una prestacion activa.
   - Esperado: estado cambia a inactivo y boton Inactivar deja de mostrarse para esa fila.

8. Ejecutar accion Editar sobre catalogo.
   - Esperado: guarda cambios y se refleja en grilla.

9. Ejecutar accion Inactivar sobre catalogo activo.
   - Esperado: estado cambia a inactivo.

## Criterio de aprobacion

- Todos los pasos 1 a 9 con resultado esperado.
- Sin errores visibles en UI ni respuestas 5xx en backend.