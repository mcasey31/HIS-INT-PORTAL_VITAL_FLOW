# 01 — Conexión y autenticación

## 1. URLs

| Entorno | Base URL |
|---|---|
| Emulador Android → PC local | `http://10.0.2.2:3011/api/v1` |
| Teléfono real por Wi-Fi | `http://<IP-DEL-PC>:3011/api/v1` |
| `localhost` desde el teléfono | **No funciona.** `localhost` apunta al propio teléfono. |

El emulador usa `10.0.2.2` como alias de `localhost` del host. Desde un teléfono
físico hay que usar la IP real del PC.

### Android cleartext

La API es HTTP plano en desarrollo. Android 9+ bloquea tráfico cleartext por
default. En `AndroidManifest.xml`:

```xml
<application android:usesCleartextTraffic="true" ...>
```

En release hay que usar HTTPS y quitar esto.

## 2. Binder a la red

El backend debe escuchar en `0.0.0.0` para ser alcanzable desde el teléfono.
Está configurado en `back/src/VitalFlow.His.Api/Properties/launchSettings.json`:

```json
"applicationUrl": "http://0.0.0.0:3011"
```

Verificar que quedó aplicando:

```powershell
Get-NetTCPConnection -LocalPort 3011 -State Listen
```

Si aparece `LocalAddress` = `::` en lugar de `0.0.0.0`, hay otro proceso.toml
tomando el puerto. Ver [conflictos de puerto](#5-conflicto-de-puerto).

### Firewall

Si el Windows Firewall bloquea, hace falta una regla de entrada para el puerto:

```powershell
New-NetFirewallRule -DisplayName "His API 3011" -Direction Inbound -LocalPort 3011 -Protocol TCP -Action Allow
```

## 3. Login

### Paso 1 — Listar centros

```http
GET /api/v1/auth/centros
```

Sin autenticación. Devuelve los centros disponibles para iniciar sesión.

```json
[
  { "id": "00000000-0000-0000-0000-000000000001", "nombre": "VitalFlow Central" }
]
```

### Paso 2 — Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "recepcion",
  "password": "VitalFlow2026!",
  "centroId": "00000000-0000-0000-0000-000000000001"
}
```

> ### `centroId` es obligatorio salvo para `global`
>
> El backend responde **401** con este mensaje si falta:
>
> ```json
> { "title": "No autenticado.", "detail": "Debe seleccionar un centro para iniciar sesion." }
> ```
>
> Los usuarios `Administrador` son `global` y pueden omitirlo. Cualquier otro rol
> —incluido `Recepcion`— **debe enviarlo**. La app debería mostrar un selector de
> centro en el login, igual que el front web.

Respuesta 200:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "HRlcJEJFSjDejgXg...",
  "tokenType": "Bearer",
  "expiresInSeconds": 1800,
  "username": "recepcion",
  "roles": ["Recepcion"],
  "centroId": "00000000-0000-0000-0000-000000000001",
  "mustChangePassword": true
}
```

| Campo | Uso |
|---|---|
| `accessToken` | Bearer token, **30 minutos**. |
| `refreshToken` | Renovar el access token. |
| `roles` | Claim `role` del JWT. |
| `centroId` | Centro asignado. `global` si aplica a todos. |
| `mustChangePassword` | Si es `true`, hay que ir a change-password antes de operar. |

### Envío del token

```http
Authorization: Bearer <accessToken>
```

## 4. Cambio de contraseña obligatorio

Si `mustChangePassword` es `true`, el usuario no puede operar con normalidad hasta
que la cambie.

```http
POST /api/v1/auth/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "passwordActual": "VitalFlow2026!",
  "passwordNuevo": "NuevaClave2026!",
  "confirmacionPasswordNuevo": "NuevaClave2026!"
}
```

## 5. Refresh

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{ "refreshToken": "HRlcJEJFSjDejgXg..." }
```

Devuelve un `accessToken` nuevo. Guardar el `refreshToken` que viene en cada
respuesta, porque rota.

## 6. Manejo de sesión en la app

1. Al abrir, pedir `GET /auth/centros` y armar el selector de centro.
2. Login guardando `accessToken` + `refreshToken` en almacenamiento seguro
   (EncryptedSharedPreferences / Keystore). **No** en SharedPreferences plano.
3. Si `mustChangePassword == true`, llevar a la pantalla de cambio antes del
   tablero.
4. En cada request, si vuelve 401, intentar refresh una vez y reintentar.
5. Si el refresh también falla, limpiar sesión y volver al login.

## 7. Códigos de error

| Código | Significado | Qué hacer |
|---|---|---|
| 400 | Request inválido | Mostrar `message` / `detail`. No reintentar. |
| 401 | Sin token, token vencido o sesión inválida | Refresh, o volver al login. |
| 403 | Rol sin permiso | No es un bug: la operación no le corresponde a ese rol. |
| 404 | Recurso inexistente | Mostrar "no encontrado". |
| 409 | Conflicto de estado | La operación no es válida en el estado actual. Refrescar datos. |
| 429 | Rate limit | Esperar y reintentar con backoff. |
| 500 | Error del servidor | Mostrar mensaje genérico. |

Los errores del backend vienen en dos formatos según el origen:

```json
{ "message": "..." }              // desde los controllers
```

```json
{ "type": "...", "title": "No autenticado.", "status": 401, "detail": "...", "instance": "..." }  // desde el middleware
```

**Parsear los dos.** La app debería leer `message` y, si no existe, `detail`.

## 8. Límites de requests

| Política | Límite |
|---|---|
| `/auth/login`, `/auth/refresh` | 10 por minuto |
| Resto | 200 por minuto |

El login está limitado fuerte a propósito. Cachear el token y no reintentar en
loop.

## 9. Por qué la API usa el puerto 3011

La API **no** usa el 3001. En esta máquina el 3001 está tomado por un proceso
**node/Express** (`server/index.js`, fuera del repositorio His) que se dejó
corriendo. Como escucha en `[::]:3001` —IPv6 dual-stack— captura también el
tráfico IPv4 y responde en lugar del backend.

Por eso el puerto de la API es **3011**, en `launchSettings.json`.

### Cómo diagnóstico

Si algún día un endpoint devuelve 401 con cabecera `X-Powered-By: Express` y un
body `{"error":"No autorizado"}`, no es un problema de la API ni del token: se
está hablando con el servidor equivocado.

```powershell
Get-NetTCPConnection -LocalPort 3011 -State Listen | ForEach-Object {
  $pr = Get-Process -Id $_.OwningProcess
  "$($_.LocalAddress) PID=$($_.OwningProcess) $($pr.ProcessName)"
}
```

Ahí tiene que aparecer `VitalFlow.His.Api`. Si aparece `node`, hay otro proceso
tomando el puerto.

En resumen: **la API siempre en 3011.** No cambiar el puerto por analogía con
otros proyectos.

### Nota: no basta con matar el proceso node

El proceso node corre bajo un watcher:

```
npm run dev:server          <- PID raiz
  └─ node --watch server/index.js    <- watcher
       └─ node server/index.js       <- hijo, el que toma el puerto
```

Matar solo el hijo hace que el watcher lo levante de nuevo y vuelva a tomar el
puerto a los pocos segundos. Si alguna vez hay que liberarlo, hay que cortar la
cadena completa desde `npm run dev:server`.

Actualmente **no** se toca: el proceso se deja corriendo y la API vive en 3011.