# Roadmap Macro - ODI Convenios y Facturacion

## Base de planificacion

- Modalidad: 1 persona
- Sprint: 2 semanas (lunes a viernes)
- Inicio: 08/06/2026
- Foco inicial: ABM
- Horizonte base: 14 sprints

## Estrategia

1. Arrancar por ABM (maestros y configuracion) para estabilizar datos base.
2. Luego avanzar a procesos (prefactura/factura) sobre entidades ya consolidadas.
3. Cerrar con hardening, UAT y salida.

## Roadmap por sprint

### Ola 1 - ABM Core (S1 a S6)

#### Sprint 1 (08/06 - 19/06)

Objetivo: base tecnica + ABM Modulos.

- Backend:
  - CRUD Modulos.
  - Validaciones de estados (activo/inactivo).
  - Auditoria de alta/edicion/baja logica.
- Frontend:
  - Pantallas ABM Modulos (listado, alta, edicion, inactivar).
- Base de datos:
  - Scripts de tablas maestras de modulos.
  - Indices para filtros de grilla.

#### Sprint 2 (22/06 - 03/07)

Objetivo: ABM Componentes + ABM Clasificaciones.

- Backend:
  - CRUD Componentes.
  - CRUD Clasificaciones de prestaciones.
- Frontend:
  - ABM Componentes.
  - ABM Clasificaciones.
- Base de datos:
  - Relaciones componentes-clasificaciones.
  - Integridad referencial.

#### Sprint 3 (06/07 - 17/07)

Objetivo: ABM Nomenclador y Catalogos.

- Backend:
  - CRUD Catalogos.
  - CRUD Prestaciones de catalogo.
  - Filtros y busquedas avanzadas.
- Frontend:
  - Grillas y formularios de nomenclador.
- Base de datos:
  - Ajuste de tablas catalogo/prestaciones.
  - Estrategia de vigencias.

#### Sprint 4 (20/07 - 31/07)

Objetivo: ABM Tarifarios (prestaciones).

- Backend:
  - CRUD Tarifarios.
  - Gestion de prestaciones por tarifario.
  - Endpoint de importacion basica.
- Frontend:
  - ABM Tarifarios.
  - Pantalla de prestaciones por tarifario.
- Base de datos:
  - Tablas de tarifarios y detalle.
  - Historial de vigencias.

#### Sprint 5 (03/08 - 14/08)

Objetivo: ABM Convenios.

- Backend:
  - CRUD Convenios.
  - Asociacion convenio-plan.
  - Estado y vigencia de convenio.
- Frontend:
  - Grilla convenio + cabecera.
  - Alta/edicion/inactivacion.
- Base de datos:
  - Refuerzo relaciones convenios-planes.
  - Constraints de unicidad de codigo.

#### Sprint 6 (17/08 - 28/08)

Objetivo: ABM Prestadores + Sociedades + UTE.

- Backend:
  - CRUD Prestadores.
  - CRUD Sociedades.
  - Vinculo prestador-sociedad/convenio.
- Frontend:
  - ABM Prestadores completo.
  - Vistas de detalle y locaciones.
- Base de datos:
  - Ajuste de relaciones prestadores-convenios.
  - Indices operativos de busqueda.

### Ola 2 - ABM Avanzado y Reglas (S7 a S8)

#### Sprint 7 (31/08 - 11/09)

Objetivo: ABM Normas Operativas + Coseguros.

- Backend:
  - CRUD Normas Operativas.
  - Reglas por convenio-plan.
- Frontend:
  - ABM Normas y Coseguros.
- Base de datos:
  - Tablas de reglas y ambitos.

#### Sprint 8 (14/09 - 25/09)

Objetivo: cierre ABM integral + hardening ABM.

- Backend:
  - Cierre de endpoints faltantes ABM.
  - Validaciones cruzadas entre maestros.
- Frontend:
  - Ajustes UX/validaciones y permisos.
- Base de datos:
  - Afinado de constraints e indices.

### Ola 3 - Proceso Prefacturacion y Facturacion (S9 a S13)

#### Sprint 9 (28/09 - 09/10)

Objetivo: prefacturacion base.

- Listados de episodios procesables.
- Disparo de proceso prefactura.
- Estados de prefactura.

#### Sprint 10 (12/10 - 23/10)

Objetivo: prefacturacion avanzada.

- Edicion de prefactura.
- Reproceso y anulaciones operativas.
- Exportaciones iniciales.

#### Sprint 11 (26/10 - 06/11)

Objetivo: facturacion base.

- Generacion de factura desde prefacturas.
- Grilla/filtros de facturas.
- Cabecera y detalle inicial.

#### Sprint 12 (09/11 - 20/11)

Objetivo: estados de factura + soporte.

- Flujo de estados (emitida/enviada/recibida/cobrada/anulada).
- Soportes magneticos y descargas.

#### Sprint 13 (23/11 - 04/12)

Objetivo: integraciones y cierre funcional.

- Ajustes SAP/HIS segun backlog activo.
- Endurecimiento de errores y auditoria.

### Ola 4 - UAT y Salida (S14)

#### Sprint 14 (07/12 - 18/12)

Objetivo: salida controlada.

- UAT final.
- Correcciones criticas.
- Checklist de go-live.

## Entregables por sprint

- API endpoints terminados y versionados.
- Pantallas frontend operativas.
- Migraciones SQL y rollback.
- Casos de prueba funcionales minimos.
- Registro de auditoria para mutaciones.

## Riesgos y colchones

- Riesgo de cambios de alcance en ABM: reservar 15 por ciento de capacidad por sprint.
- Riesgo de integraciones externas: concentrar spikes en S9-S13.
- Riesgo de datos inconsistentes: validaciones backend obligatorias desde S1.

## Hitos de control

- Fin S3: maestros base listos (modulos, componentes, clasificaciones, nomenclador).
- Fin S6: ABM clave del negocio listo (tarifarios, convenios, prestadores).
- Fin S8: ABM cerrado para operar procesos.
- Fin S13: proceso end-to-end prefactura-factura completo.
- Fin S14: salida UAT aprobada.

## Prioridades de continuidad (corto plazo)

Fecha de corte: 07/06/2026.

### Prioridad 1 - Usabilidad operativa en Convenios (cerrar confusion de pantalla)

Objetivo: simplificar la operacion diaria en pasos Referencias, Reglas y Contexto.

- Mantener selector principal por ID/codigo como camino base.
- Mantener busqueda por descripcion como opcion secundaria (no invasiva).
- Asegurar mensajes claros en casos sin coincidencia y en coincidencias ambiguas.
- Criterio de cierre: usuario puede seleccionar entidad sin conocer ID y sin ruido visual excesivo.

### Prioridad 2 - Consistencia funcional entre pasos dependientes

Objetivo: evitar estados inconsistentes al cambiar Financiador/Plan/Convenio/Convenio-plan.

- Limpiar selecciones hijas cuando cambia el nivel padre.
- Alinear comportamiento entre Referencias, Contexto y Reglas.
- Verificar que los datos visibles (prestaciones/tarifarios) respondan siempre al tramo activo.
- Criterio de cierre: no quedan referencias huerfanas ni seleccion cruzada invalida.

### Prioridad 3 - Cobertura de pruebas y smoke de regresion

Objetivo: proteger lo implementado antes de seguir con nuevas funciones.

- Armar checklist smoke UI para Referencias, Contexto, Reglas y valorizaciones.
- Validar create/update/seleccion para entidades base (financiador, plan, convenio, convenio-plan).
- Incluir casos de busqueda exacta, parcial, ambigua y sin match.
- Criterio de cierre: smoke repetible sin errores criticos en flujo de convenios.

### Prioridad 4 - Hardening tecnico (backend + performance)

Objetivo: estabilizar consulta y escalabilidad de catalogos de seleccion.

- Revisar endpoints de opciones con filtros por estado y por dependencia padre.
- Confirmar indices de soporte para tablas operativas mas consultadas.
- Medir tiempos de respuesta en escenarios con volumen real.
- Criterio de cierre: tiempos estables y sin errores de consulta ambigua.

### Prioridad 5 - Paso a proceso prefactura/factura

Objetivo: una vez estable ABM + reglas + contexto, avanzar con proceso operativo.

- Consolidar readiness de componentes del convenio-plan.
- Encadenar seleccion contractual con prefacturacion de casos reales.
- Priorizar trazabilidad extremo a extremo (episodio -> regla -> valorizacion -> prefactura).
- Criterio de cierre: flujo e2e demostrable en ambiente local dockerizado.
