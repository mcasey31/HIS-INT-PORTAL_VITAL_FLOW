# Feature Convenios

## Resumen

- Features relevadas: 1
- HUs relevadas: 9
- HUs con link Adobe UX: 0

## Que hace

Gestiona convenios y condiciones contractuales.

## Como se relaciona

Integra prestador + tarifarios para condiciones de facturacion.

## Features y EPIC

- Feature #6459: ABM Convenios | Estado: New | EPIC: CONVENIOS (#6458) | HUs: 9 | HUs con Adobe: 0

## Matriz HU y UX Adobe

| HU ID | Titulo | Estado | UX Adobe |
|---|---|---|---|
| 6462 | Alta cabecera de convenio | New | Sin link Adobe detectado |
| 6463 | Editar cabecera de convenio | New | Sin link Adobe detectado |
| 6460 | Gestionar Tarifario de medicamentos y descartables de un convenio | New | Sin link Adobe detectado |
| 6468 | Gestionar tarifario de convenio | New | Sin link Adobe detectado |
| 6466 | Gestionar normas operativas del convenio | New | Sin link Adobe detectado |
| 6467 | Gestionar coseguros del convenio | New | Sin link Adobe detectado |
| 13104 | Agregar configuraciÃ³n de inclusiones de los convenios a travÃ©s de clasificaciones | Done | Sin link Adobe detectado |
| 6464 | Inactivar convenio | New | Sin link Adobe detectado |
| 6461 | Grilla listado de convenios | Approved | Sin link Adobe detectado |

## Verificacion puntual de evidencia UX

- Resultado: no se detectaron enlaces de Adobe en ninguna HU de Convenios.
- Total HUs revisadas: 9.
- HUs con links en descripcion/criterios: 5 (todos son referencias internas a work items de Azure, no maquetas UX).
- HUs sin ningun link de apoyo: 4.

| HU ID | Titulo HU | Tiene links | Tipo de evidencia encontrada |
|---|---|---|---|
| 6462 | Alta cabecera de convenio | Si | Links internos a HUs relacionadas |
| 6463 | Editar cabecera de convenio | Si | Links internos a HUs relacionadas |
| 6460 | Gestionar Tarifario de medicamentos y descartables de un convenio | No | Sin evidencia de UX asociada |
| 6468 | Gestionar tarifario de convenio | Si | Link interno a HU relacionada |
| 6466 | Gestionar normas operativas del convenio | No | Sin evidencia de UX asociada |
| 6467 | Gestionar coseguros del convenio | No | Sin evidencia de UX asociada |
| 13104 | Agregar configuraciÃ³n de inclusiones de los convenios a travÃ©s de clasificaciones | No | Sin evidencia de UX asociada |
| 6464 | Inactivar convenio | Si | Links internos a HUs relacionadas |
| 6461 | Grilla listado de convenios | Si | Links internos a HUs relacionadas |

## Backlog de diseno UX faltante (propuesto)

1. UX-CONV-01: flujo end-to-end de convenios.
	Alcance: mapa de navegacion y estados desde grilla, alta, edicion, inactivacion y configuraciones.
	HUs impactadas: 6461, 6462, 6463, 6464.
2. UX-CONV-02: pantalla Grilla listado de convenios.
	Alcance: columnas, filtros, acciones por fila, estados y permisos.
	HU impactada: 6461.
3. UX-CONV-03: pantalla Alta cabecera de convenio.
	Alcance: formulario, validaciones, tabs, comportamiento de guardado y errores.
	HU impactada: 6462.
4. UX-CONV-04: pantalla Edicion cabecera de convenio.
	Alcance: campos editables/no editables, control de cambios y versionado.
	HU impactada: 6463.
5. UX-CONV-05: pantalla Inactivar convenio.
	Alcance: modal de confirmacion, motivo, impactos y trazabilidad.
	HU impactada: 6464.
6. UX-CONV-06: pantalla Gestionar tarifario de convenio.
	Alcance: asociacion de tarifas, vigencias, importes y reglas de actualizacion.
	HUs impactadas: 6468, 6460.
7. UX-CONV-07: pantalla Gestionar normas operativas del convenio.
	Alcance: alta/edicion de reglas, prioridad y conflictos entre reglas.
	HU impactada: 6466.
8. UX-CONV-08: pantalla Gestionar coseguros del convenio.
	Alcance: tipos de coseguro, calculo y validaciones por prestacion.
	HU impactada: 6467.
9. UX-CONV-09: pantalla Inclusiones por clasificaciones.
	Alcance: seleccion por clasificacion, reglas de inclusion/exclusion y vista previa de impacto.
	HU impactada: 13104.

## Criterio de cierre recomendado para Convenios

- Cada HU debe tener al menos un enlace de diseno funcional vigente (Adobe o Figma) en descripcion o criterios de aceptacion.
- Cada pantalla debe explicitar estados vacios, estados de error, permisos por rol y reglas de validacion.
- La navegacion debe estar trazada entre grilla, cabecera, tarifario, normas, coseguros e inclusiones.
