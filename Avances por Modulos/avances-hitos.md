# VitalFlow HIS – Avances y Hitos por Módulo

> Documento acumulativo. Se actualiza al cerrar cada módulo o funcionalidad significativa.  
> Fecha de inicio del tracking: 01/06/2026

---

## MÓDULO: AGENDA

### ✅ CERRADO – Agenda Programada Fija con Bloque de Programación
**Fecha de cierre:** 01/06/2026

**Alcance cubierto:**
- Alta de agenda (tipo PROGRAMADA, efector PROFESIONAL)
- Validaciones de creación: código único, fechas, servicio/efector obligatorios
- Feedback visual al guardar: mensaje de éxito + transición automática al paso "Crear Bloque"
- Creación de bloque FIJA: días, horario, intervalo, lugar de atención, prácticas
- Validación de solapamiento (efector + centro + día + horario): popup de error con mensaje del backend
- Visualización de bloques existentes en pantalla Ver y Editar (tabla con columnas: Programación, Días, Horario, Fecha desde-hasta, Estado)
- Edición de bloque existente desde la tabla de bloques
- Botón "Crear bloque" accesible desde listado, Detalle y Edición
- Activación de agenda (estado `activa: true`)
- Verificación de cupos disponibles post-bloque (API `/disponibilidad`)

**Agenda de prueba validada:**
- Código: `MTC1` | Nombre: `AGENDA_TEST_DIAZ`
- Efector: Diaz, Ana – MP123 | Centro: Centro Ambulatorio Central
- Bloque: `BLOQUE MTC1 VALIDO` | FIJA | Domingos 18:00–20:00 | 20 min | Consulta general
- Cupos disponibles: 6/6

---

### 🗂️ BACKLOG – Casos de uso pendientes (Módulo Agenda)

| # | Caso de Uso | Prioridad | Notas |
|---|---|---|---|
| 1 | **Agenda Programada Variable** | Media | Bloques con frecuencia variable / mensual. Formulario de semanas del mes ya parcialmente implementado en frontend. |
| 2 | **Agenda por Demanda Espontánea** | Media | Sin bloques de programación. Flujo diferente: sin días/horarios fijos, cupos por rango. |
| 3 | Gestión de bloqueos de agenda | Baja | Bloquear días/periodos (feriados, ausencias). Entidad `bloqueo_agenda` ya en DB. |
| 4 | Paginación en listado de agendas | Baja | Actualmente muestra hasta N resultados sin paginar. |

---

## MÓDULO: TURNOS

### ✅ CERRADO – Turnos Programado
**Fecha de cierre:** 01/06/2026

**Alcance cubierto:**
- Identificación de paciente por documento con resolución de caso único/múltiple/sin candidatos
- Alta automática como paciente con cobertura por defecto Privado Particular cuando corresponde
- Gestión de financiador/plan en Turnos (alta, edición, finalización con reglas)
- Regla de negocio protegida: Privado Particular no pierde vigencia
- Visualización de turnos del paciente (vigentes e historial)
- Búsqueda de disponibilidad con almanaque y resaltado de días con oferta
- Asignación de turno y sobreturno
- Popup de éxito al confirmar asignación de turno
- Persistencia de asignaciones para que al refrescar no se publique nuevamente el slot como disponible

### 🗂️ BACKLOG – Caso de uso pendiente (Módulo Turnos)

| # | Caso de Uso | Prioridad | Notas |
|---|---|---|---|
| 1 | **Eliminar turnos** | Alta | Falta flujo funcional completo (UI + API + reglas + auditoría). |

---

## MÓDULO: ADMISIÓN

### ✅ CERRADO – Hito Admisión Programada con Turno
**Fecha de cierre:** 01/06/2026

**Alcance cubierto:**
- Identificación de paciente y selección de cobertura vigente
- Filtro de turnos del día y modo de arribo programado
- Confirmación de arribo desde pantalla
- Transiciones operativas desde pantalla: EN_SALA_DE_ESPERA → EN_ATENCION → ATENDIDO / NO_ATENDIDO
- Restricción operativa: turnos no `PROGRAMADO` no se pueden volver a seleccionar desde Admisión

### 🗂️ PENDIENTES ACORDADOS – Admisión (siguiente tramo)

| # | Pendiente | Prioridad | Notas |
|---|---|---|---|
| 1 | Verificar visualización de prácticas del turno | Alta | Confirmar que el detalle de prácticas asociadas llegue y se vea correctamente en Admisión. |
| 2 | Probar flujo de Admisión Espontánea | Alta | Validación funcional punta a punta (UI + reglas + persistencia). |
| 3 | Implementar UNDO de estados por rol Administrador | Media | Caso de uso “deshacer estado” con permisos, trazabilidad y reglas de transición inversa. |

**Próximo alcance acordado:**
- Escenario de consulta ambulatoria (a implementar en siguiente tramo)

---

## MÓDULO: HISTORIA CLÍNICA AMBULATORIA

> Pendiente.

---

## MÓDULO: PERSONAS / ABMs

> Pendiente.

---

## MÓDULO: SEGURIDAD

> Parcialmente implementado: JWT, login, cambio de contraseña, roles. Pantalla de gestión de usuarios pendiente.

---

## MÓDULO: CAJA

> Pendiente.

---

## MÓDULO: AUDITORÍA

> Pendiente.

---

*Actualizar este documento al cerrar cada módulo o funcionalidad relevante.*
