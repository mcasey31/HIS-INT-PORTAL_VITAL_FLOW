# Mock Front - Feature 7005 Gestion de Agenda

## Fuente
- Tasks relevadas desde Azure DevOps (Feature 7005 y PBIs hijos).
- HU base de esta carpeta (EPICA->FEATURE->HU).

## Pantallas incluidas
- P1: Busqueda y Listado de Agendas (PBI 11196).
- P2: Alta/Edicion de Agenda (PBI 7014 + 8988).
- P3: Detalle de Agenda (PBI 11235 + 13017).
- P4: Modal Copiar Agenda (PBI 11205).
- P5: Turnos Cancelados desde Agenda (PBI 16697).

## P1 - Busqueda y Listado de Agendas

Wireframe:

+-----------------------------------------------------------------------------------+
| AGENDA > Listado                                                                  |
|-----------------------------------------------------------------------------------|
| Filtros: [Agenda v] [Servicio v] [Efector v] [Practica v] [Estado v] [Buscar]   |
|-----------------------------------------------------------------------------------|
| Codigo | Nombre Agenda | Servicio | Profesional | Estado | Bloques | Acciones    |
| AG-001 | Clinica AM     | Clinica  | Diaz, Ana   | Activa |   12    | Ver Editar  |
| AG-002 | Guardia PM     | Guardia  | Perez, Leo  | Inact. |    8    | Ver Copiar  |
+-----------------------------------------------------------------------------------+

## P2 - Alta/Edicion de Agenda

Wireframe:

+-----------------------------------------------------------------------------------+
| Nueva Agenda / Editar Agenda                                                      |
|-----------------------------------------------------------------------------------|
| Codigo*      [________________]   Nombre*            [________________________]   |
| Tipo agenda* [v______________]    Tipo efector*      [v______________]            |
| Prestador*   [v______________]    Servicio*          [v______________]            |
| Fecha desde* [____-__-__]         Fecha hasta        [____-__-__]                 |
| Observacion  [_______________________________________________________________]    |
| [ ] Agenda visible para turnos espontaneos                                        |
|-----------------------------------------------------------------------------------|
| [Cancelar]                                                      [Guardar Agenda]  |
+-----------------------------------------------------------------------------------+

## P3 - Detalle de Agenda

Wireframe:

+-----------------------------------------------------------------------------------+
| Detalle de Agenda - AG-001                                                        |
|-----------------------------------------------------------------------------------|
| Estado: [Activa]  Servicio: Clinica Medica  Profesional: Diaz, Ana                |
| Vigencia: 2026-01-01 a 2026-12-31                                                  |
| Observacion: Agenda principal de consultorio 3                                     |
|-----------------------------------------------------------------------------------|
| Bloques activos                                                                    |
| Fecha       | Desde | Hasta | Intervalo | Tipo bloque | Estado                     |
| 2026-06-02  | 08:00 | 12:00 | 20 min    | Programado  | Activo                     |
| 2026-06-02  | 13:00 | 17:00 | 20 min    | Programado  | Activo                     |
|-----------------------------------------------------------------------------------|
| [Inactivar/Activar] [Editar] [Copiar] [Ver Turnos Cancelados]                    |
+-----------------------------------------------------------------------------------+

## P4 - Modal Copiar Agenda

Wireframe:

+-------------------------------------------------------------+
| Copiar Agenda                                               |
|-------------------------------------------------------------|
| Agenda origen: AG-001 - Clinica AM                          |
| Nuevo codigo* [________________]                            |
| Nuevo nombre* [__________________________]                  |
| Fecha desde* [____-__-__]  Fecha hasta [____-__-__]         |
|-------------------------------------------------------------|
| [Cancelar]                                  [Confirmar]     |
+-------------------------------------------------------------+

## P5 - Turnos Cancelados desde Agenda

Wireframe:

+-----------------------------------------------------------------------------------+
| Turnos cancelados - Agenda AG-001                                                 |
|-----------------------------------------------------------------------------------|
| Filtros: [Rango fecha] [Motivo v] [Servicio v] [Buscar]                          |
|-----------------------------------------------------------------------------------|
| Fecha/Hora        | Paciente         | Motivo cancelacion | Estado | Accion      |
| 2026-06-01 09:20  | Gomez, Lucia     | Bloqueo agenda     | Cancel | Ver detalle |
| 2026-06-01 10:00  | Mendez, Raul     | Reprogramacion     | Cancel | Ver detalle |
+-----------------------------------------------------------------------------------+

## Criterios UX para la primera version
- Mismo patron de filtro en P1 y P5.
- Estado de agenda visible como chip en listado, formulario y detalle.
- Navegacion lineal: Listado -> Detalle -> Editar/Copiar -> Volver.
- Validaciones en cliente para fechas y longitud de observacion.

## Proximo paso de implementacion
- Construir estas 5 pantallas como componentes React y conectar con endpoints ya implementados en back.
