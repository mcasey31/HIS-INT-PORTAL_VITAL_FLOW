# DER - Modelo de Datos de Referencia (Evolutivo)

## Estado del documento
- Estado: Provisorio / Evolutivo
- Fecha base: 2026-05-30
- Fuente principal: DER compartido por MARTO (overview integral)
- Fuente complementaria: esquema implementado en migraciones SQL del repo

Este documento funciona como base de referencia de modelo de datos a alto nivel.
Puede cambiar a medida que avance la implementacion funcional por HU.

## Objetivo
- Mantener trazabilidad entre el DER de negocio (integral) y el modelo fisico operativo del proyecto.
- Registrar supuestos y decisiones de modelado para iteraciones futuras.
- Evitar que el DER quede desalineado con el estado real de backend/db.

## Alcance actual (modelo operativo en este repo)
El esquema operativo actual esta centrado en el dominio Agenda y bloques.

### Entidades principales
- `sch_agenda.agenda`
- `sch_agenda.bloque_programacion`
- `sch_agenda.cupo`
- `sch_agenda.bloqueo_agenda`
- `sch_agenda.calendario_excepcion`
- `sch_agenda.lugar_atencion`

### Evolucion reciente por HU
- HU 7027: extension de bloque programacion fija
  - campos de bloque: `nombre`, `tipo_bloque`, `fecha_desde`, `fecha_hasta`, `atiende_feriados`, `dias_semana`, `duracion_turno_minutos`, `lugar_atencion_id`, `frecuencia`, `orden_mensual_semanas`, `sobreturnos`
  - tabla de catalogo: `sch_agenda.lugar_atencion`
- HU 8989: programacion variable
  - campo: `practicas_json` en `sch_agenda.bloque_programacion`
  - soporte de practicas asociadas en payloads y reglas backend
- HU 8990: demanda espontanea
  - usa `tipo_bloque = DEMANDA_ESPONTANEA` en la misma entidad `bloque_programacion`
- HU 11199: crear grupo de profesionales
  - nuevas tablas: `sch_agenda.grupo_profesional`, `sch_agenda.grupo_profesional_miembro`
  - reglas de integridad:
    - un miembro debe ser efector de tipo `PROFESIONAL`
    - el miembro debe pertenecer al mismo `centro/servicio` del grupo

## Vista conceptual de relaciones (operativa)
- `agenda (1) -> (N) bloque_programacion`
- `bloque_programacion (1) -> (N) cupo`
- `agenda (1) -> (N) bloqueo_agenda`
- `bloque_programacion (N) -> (1) lugar_atencion` (FK opcional/obligatoria segun regla de negocio)

## Reglas de consistencia importantes (estado actual)
- Un bloque pertenece a una agenda.
- Bloques nuevos quedan activos por defecto.
- Se validan solapamientos por efector/centro y por lugar de atencion en rango fecha-hora.
- Programacion variable soporta practicas asociadas y duracion de slot fija de 5 min.
- Si una practica no trae duracion, se normaliza a 15 min.

## Relacion con DER integral compartido
El DER integral se toma como referencia de direccion de arquitectura de datos.
Aun cuando algunas entidades/relaciones no esten implementadas en este repo, se consideran parte del mapa objetivo y pueden incorporarse en siguientes HU.

## Politica de actualizacion
Cada cambio de modelo de datos debe registrar:
1. HU o feature que motiva el cambio.
2. Migracion SQL aplicada.
3. Impacto en contratos API (request/response).
4. Impacto en UI (formularios, validaciones, filtros).

## Registro de cambios
- 2026-05-30: Alta de documento base de DER evolutivo.
- 2026-05-30: Consolidado estado operativo de `agenda`, `bloque_programacion`, `lugar_atencion`, `practicas_json`.
- 2026-05-30: Se incorpora modelo base de `grupo_profesional` y `grupo_profesional_miembro` (HU 11199).

## Documentos relacionados
- Ver v2 integral basado en HL7 FHIR: `docs/der-fhir-relacional-overview-v2.md`
