# 02 — API de recepción

Todos los endpoints requieren `Authorization: Bearer <accessToken>` y el rol
`Recepcion` (o superior).

## Flujo del día

```
GET  /admision/landing/selectores          → servicios, estados, filtros
POST /admision/landing/tablero             → tablero del día (paginado)
POST /admision/turnos/{id}/arribo          → check-in del paciente
POST /admision/turnos/{id}/estado          → llamar / noshow / etc.
GET  /admision/turnos/{id}/encuentro       → encuentro activo
POST /admision/turnos/{id}/encuentro/cerrar → cerrar atención
```

## 1. Selectores del tablero

```http
GET /api/v1/admision/landing/selectores
```

Devuelve los servicios, profesionales y financiadores para armar los filtros, más
los **estados válidos y sus transiciones**.

La app debe usar los estados que devuelve este endpoint para habilitar botones, en
lugar de hardcodear la máquina de estados. Así el backend sigue siendo la única
fuente de verdad.

## 2. Tablero del día (paginado)

```http
POST /api/v1/admision/landing/tablero?page=1&pageSize=50
Content-Type: application/json

{
  "fecha": "2026-10-04",
  "servicioId": "",
  "tipoEfector": "",
  "efectorId": "",
  "practicaId": "",
  "estado": ""
}
```

Todos los campos del body son opcionales; sin body devuelve el día completo.

Respuesta:

```json
{
  "items": [ { "...": "TurnoAdmisionResponse" } ],
  "total": 128,
  "page": 1,
  "pageSize": 50
}
```

`page` y `pageSize` van **en el query string**, no en el body.

| Regla | Valor |
|---|---|
| `page` | ≥ 1 |
| `pageSize` | 1 a 200 |

Fuera de rango → **400**.

Cada item:

```json
{
  "id": "a1b2c3d4-...",
  "turno": "04/10/2026 09:00",
  "llegada": "04/10/2026 08:52",
  "pacienteId": "e5f6...",
  "paciente": "Juan Pérez",
  "documento": "DNI 30123456",
  "financiador": "PAMI",
  "servicio": "Consultorios Externos",
  "efector": "Consultorio 1",
  "estado": "EN_SALA_DE_ESPERA",
  "estadoTurno": "PROGRAMADO"
}
```

### Orden

El backend devuelve el tablero ordenado por cercanía a la hora actual. La app
debe **respetar ese orden** al invertirlo por urgencia: quien está esperando hace
rato va primero.

### Endpoint legacy

`POST /api/v1/admision/landing/buscar` devuelve el listado completo como **array
plano**, sin paginar. Existe porque el front web ya lo consume con esa forma.
**No usarlo en la app móvil**: usar `/landing/tablero`.

## 3. Check-in del paciente

```http
POST /api/v1/admision/turnos/{turnoId}/arribo
```

El paciente llega a la sala de espera. Transiciona a `EN_SALA_DE_ESPERA` y
registra la hora de llegada, que es lo que ordena la cola.

## 4. Cambio de estado

```http
POST /api/v1/admision/turnos/{turnoId}/estado
Content-Type: application/json

{ "estado": "EN_ATENCION" }
```

## 5. Estados del circuito

| Estado | Significado |
|---|---|
| `PROGRAMADO` | Turno asignado, el paciente aún no llegó. |
| `EN_SALA_DE_ESPERA` | Check-in hecho, esperando. |
| `EN_ATENCION` | Con el profesional. |
| `ATENDIDO` | Atención finalizada. |
| `AUSENTE` | No assistants (*no show*). |
| `NO_ADMITIDO` | No se admitió el ingreso. |
| `NO_ATENDIDO` | Se fue sin ser atendido. |
| `EN_OBSERVACION` | Pasa a observación. |
| `PENDIENTE_DE_PAGO` | Cerrado, pendiente de cobro. |

No todas las transiciones son válidas desde cualquier estado. El endpoint
responde **409** si la transición no corresponde, y el frontend debe refrescar el
tablero en ese caso.

## 6. Buscar paciente en el mostrador

```http
GET /api/v1/personas/busqueda?tipoDocumento=DNI&numeroDocumento=30123456
```

Devuelve candidatos. `Recepcion` puede consultar, pero **no** puede
empadronar: `POST /personas/empadronar-set-minimo` responde **403** para este
rol, por diseño.

Para confirmar cobertura:

```http
GET /api/v1/personas/{pacienteId}/financiador-activo
```

## 7. Turnos

### Detalle

```http
GET /api/v1/turnos/{turnoId}
```

`404` si no existe.

### Anulación

```http
POST /api/v1/turnos/{turnoId}/anular
Content-Type: application/json

{ "motivo": "El paciente se entera" }
```

Solo se admite desde `AGENDADO` o `PROGRAMADO`. En otro caso → **409**.
Libera el horario del cupo.

## 8. Recetas — solo lectura

`Recepcion` puede **consultar** recetas, pero no crearlas: `POST /api/v1/recetas`
devuelve **403**. Crear una receta es acto médico.

Disponibles para este rol:

```http
GET /api/v1/recetas/estados
GET /api/v1/recetas/buscar?page=1&pageSize=10
GET /api/v1/recetas/{recetaId}
```

> Las recetas quedan **en pausa como funcionalidad**. Está implementado en el
> backend pero no es parte del alcance de esta etapa. Confirmar con el equipo
> antes de construir pantalla.

## 9. Checklist de integración

- [ ] `GET /auth/centros` y selector de centro en el login.
- [ ] Enviar `centroId` en el login para roles no-globales.
- [ ] Manejar `mustChangePassword`.
- [ ] Refresh con reintento único ante 401.
- [ ] Parsear errores en los dos formatos (`message` y `detail`).
- [ ] Tablero con `/landing/tablero`, no `/landing/buscar`.
- [ ] Botones de estado desde `/landing/selectores`.
- [ ] Respetar el orden de la cola.
- [ ] Refrescar ante 409.
- [ ] `usesCleartextTraffic` solo en desarrollo.