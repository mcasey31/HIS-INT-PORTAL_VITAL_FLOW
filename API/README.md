# API His — Guía para el equipo Android

Documentación de consumo de la API para la app móvil de **recepción / sala de espera**.

## Índice

| Documento | Contenido |
|---|---|
| [01-conexion-y-autenticacion.md](01-conexion-y-autenticacion.md) | URLs, login, `centroId`, refresh, change-password |
| [02-recepcion.md](02-recepcion.md) | Flujo completo de recepción y sala de espera |

## Alcance actual

Implementado y verificado para el rol `Recepcion`:

- Consulta del tablero del día con paginación.
- Check-in del paciente.
- Cambio de estado del turno y cierre del encuentro.
- Consulta de pacientes por documento.
- Detalle y anulación de turnos.

**Fuera de alcance por ahora:** recetas (el flujo queda para una etapa posterior) y
agenda/disponibilidad de turnos (solo roles administrativos).

## Roles

El backend asigna permisos por rol. El rol va en el claim `role` del JWT.

| Rol | Puede |
|---|---|
| `Recepcion` | Todo lo de recepción + consulta de recetas. **No** puede crear recetas, empadronar personas ni modificar datos maestros. |
| `Medico` | Consulta y creación de recetas, historia clínica. |
| `Administrador` | Acceso total. |

`Recepcion` fue creado para separar el mostrador del acto médico. Si la app necesita
otra cosa, se ajusta el backend, no el cliente.

## Base de la API

- Local: `http://localhost:3011/api/v1`
- Dispositivo real (misma red Wi-Fi): `http://<IP-DE-TU-PC>:3011/api/v1`

> **Importante:** el backend debe estar escuchando en `0.0.0.0`, no en `localhost`,
> para que el teléfono pueda alcanzarlo. Ver
> [01-conexion-y-autenticacion.md](01-conexion-y-autenticacion.md#binder-a-la-red).