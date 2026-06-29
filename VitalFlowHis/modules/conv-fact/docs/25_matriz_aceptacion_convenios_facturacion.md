# Matriz de Aceptacion - Convenios y Facturacion

## 1. Objetivo
Esta matriz define los criterios minimos de aceptacion funcional para validar el flujo operativo completo entre Modulo Convenios y Modulo Facturacion.

## 2. Alcance
- Modulo Convenios:
  - Paso 1 Altas maestras
  - Paso 2 Reglas de facturacion
  - Paso 3 Seleccion de contexto
  - Paso 3B Checklist componentes
  - Paso 4 Vinculos prestaciones
  - Paso 5-6 Valorizacion economica
- Modulo Facturacion:
  - Episodios/Prestaciones -> Prefacturas -> Facturas

## 3. Precondiciones
1. Entorno dockerizado operativo (frontend, backend, db, redis).
2. Usuario con permisos para ABM de referencias y operacion de facturacion.
3. Existen datos base de catalogo ODI y prestaciones ODI.
4. Existe al menos un financiador, plan, convenio y convenio-plan para validaciones positivas.

## 4. Criterio de aprobacion global
La prueba se considera Aprobada cuando:
1. Todos los casos criticos (C1 a C10) estan en estado OK.
2. No hay errores bloqueantes de UI/API.
3. El flujo E2E termina en generacion de factura en estado emitida/ok.

## 5. Matriz de casos

| ID | Criticidad | Modulo/Paso | Caso de prueba | Resultado esperado | Estado (OK/NO) | Evidencia |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Alta | Convenios Paso 3 | Ingresar a contexto sin convenio-plan seleccionado | Prestacion operativa y tarifario deshabilitados. Mensaje de contexto pendiente visible. | OK | Paso 3 sin tramo: selects deshabilitados + estado pendiente visible. |
| C2 | Alta | Convenios Paso 3B | Ingresar a checklist sin convenio-plan seleccionado | Boton Guardar checklist deshabilitado y mensaje de bloqueo operativo visible. | OK | Paso 3B: boton Guardar checklist deshabilitado y banner de bloqueo operativo. |
| C3 | Alta | Convenios Paso 4 | Abrir Vinculos sin convenio-plan seleccionado | No permite vincular. Select de prestacion deshabilitado y boton de vincular deshabilitado. | OK | Paso 4 sin tramo: prestacion deshabilitada y boton Vincular deshabilitado. |
| C4 | Alta | Convenios Paso 5-6 | Abrir Valorizaciones sin convenio-plan seleccionado | No permite crear/modificar valorizaciones. Controles clave deshabilitados y banner de bloqueo visible. | OK | Paso 5-6 sin tramo: banner de bloqueo + controles de alta deshabilitados. |
| C5 | Alta | Convenios Paso 3 | Seleccionar convenio-plan valido | Se autocompletan financiador/plan/convenio. Tramo activo visible. Controles dependientes habilitados. | OK | Seleccion SWISS-SMG20 | SMG20: autocompletado de contexto y tramo activo visible. |
| C6 | Alta | Convenios Paso 4 | Con convenio-plan activo, verificar vinculos | Se visualizan vinculos del tramo. Permite alta de vinculo y cambio de estado activo/inactivo. | OK | Paso 4 con tramo activo: vinculo visible y accion Inactivar disponible. |
| C7 | Alta | Convenios Paso 5-6 | Con convenio-plan + tarifario + prestacion, crear valorizacion | Se crea valorizacion y aparece en grilla filtrada por tramo/tarifario. | OK | Paso 5-6 con tramo/tarifario: valorizacion visible en grilla (420201, ARS 14500). |
| C8 | Alta | Convenios Paso 3B | Guardar checklist con 6/6 componentes listos | Muestra mensaje de guardado exitoso y fecha/usuario de ultima actualizacion. | OK | 3B muestra 6/6, mensaje de guardado y ultima actualizacion por frontend-convenios. |
| C9 | Alta | Contexto cruzado | Cambiar financiador luego de tener tramo seleccionado | Se limpia contexto dependiente: plan, convenio, convenio-plan, prestacion, tarifario y datos asociados. | OK | Validado en UI y logica: limpieza de contexto dependiente al cambiar financiador. |
| C10 | Alta | Facturacion E2E | Ejecutar flujo Episodio/Prestacion -> Prefactura -> Factura | Se genera prefactura y luego factura, visible en tabla final con estado ok/emitida. | OK | Flujo ejecutado: alta de 1 prefactura y emision de 1 factura en tabla final. |
| C11 | Media | Convenios Paso 2 | Listado y alta de reglas/variables de facturacion | Visualiza reglas/variables segun filtros; permite altas validas sin error de formato. | OK | Alta validada: variable var_ui_accept_17807641 creada con mensaje "Variable de regla creada" y visible en grilla. |
| C12 | Media | UX Navegacion | Revisar labels de modulos y pasos | Boton principal muestra Modulo Facturacion. Pasos de Convenios muestran terminologia operativa sin Epica. | OK | Label principal actualizado y pasos sin terminologia Epica. |

## 6. Registro de ejecucion sugerido
Completar una fila por corrida:

| Fecha | Ejecutado por | Build/Tag | Resultado global | Observaciones |
| --- | --- | --- | --- | --- |
| 2026-06-07 | Copilot + MARTO | docker compose up -d --build backend frontend | Aprobada (C1-C12 OK) | Corrida completa sin pendientes abiertos en la matriz. |

## 7. Definiciones de severidad
- Alta: bloquea operacion o compromete consistencia contractual/economica.
- Media: no bloquea E2E pero afecta usabilidad o control operativo.
- Baja: mejoras cosmeticas o de redaccion sin impacto funcional.

## 8. Notas operativas
1. Si falla un caso de criticidad Alta, no promover release.
2. Registrar evidencia minima: captura de pantalla o texto de mensaje de exito/error.
3. En caso de error API, registrar endpoint y payload utilizado.
