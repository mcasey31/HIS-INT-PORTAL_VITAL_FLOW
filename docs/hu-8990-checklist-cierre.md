# HU 8990 - Checklist de Cierre

Fecha de cierre tecnico: 2026-05-30
Estado: CERRADA
Epic: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N

## Alcance validado

1. Alta de bloque de Demanda Espontanea por tipo de agenda.
2. Validacion de campos obligatorios en frontend antes de guardar.
3. Validacion de horario (hora inicio menor a hora fin).
4. Validacion de vigencia del bloque dentro de vigencia de agenda.
5. Bloque nuevo se crea activo por defecto.
6. Al menos una practica medica obligatoria para Demanda Espontanea.
7. Gestion de cupos incluida en la configuracion del bloque:
   - Duracion de turno configurable.
   - Sobreturnos configurables.
8. Disponibilidad recalculada contemplando cupos base + sobreturnos.

## Evidencia tecnica

Frontend:
- front/src/agenda/AgendaPage.tsx
  - Formulario HU 8990 con campos de duracion y sobreturnos.
  - Boton Guardar deshabilitado hasta cumplir criterios minimos.
  - Payload de alta de bloque envia practicas, duracion y sobreturnos.

Backend:
- back/src/VitalFlow.His.Api/Application/Agenda/Services/AgendaService.cs
  - Regla de negocio: practica obligatoria en Demanda Espontanea.
  - Calculo de cupos: floor(rango/intervalo) + sobreturnos.

Verificaciones:
- Build frontend: OK.
- Build backend: OK.
- Deploy docker backend/frontend: OK.

## Criterios de aceptacion (estado)

- CA1 Alta de bloque de demanda: CUMPLE.
- CA2 Validaciones obligatorias: CUMPLE.
- CA3 Validaciones de horario y vigencia: CUMPLE.
- CA4 Gestion de cupos en demanda: CUMPLE.
- CA5 Disponibilidad consistente con configuracion: CUMPLE.

## Riesgos y pendientes fuera de HU 8990

1. Integracion real con modulo Turnos para lista de pacientes a cancelar sigue pendiente de HU 7795.
2. Reglas avanzadas de cupo por tipo de slot y mas escenarios pertenecen a HU posteriores (por ejemplo HU 15375 / HU 15394).
