# ANDROID — Invocación de la API de recepción

Todos los ejemplos son **reales y verificados** contra el backend. Responses
copiadas de ejecuciones reales.

## Base URL

| Contexto | URL |
|---|---|
| Emulador Android | `http://10.0.2.2:3011/api/v1` |
| Teléfono real (Wi-Fi) | `http://192.168.0.187:3011/api/v1` |

> El puerto es **3011**, no 3001. El 3001 lo tiene otro proceso en esta máquina.

Cleartext en `AndroidManifest.xml` (solo desarrollo):

```xml
<application android:usesCleartextTraffic="true" ...>
```

---

## 1. Listar centros

```bash
curl http://192.168.0.187:3011/api/v1/auth/centros
```

```json
[{"id":"00000000-0000-0000-0000-000000000001","nombre":"Centro Ambulatorio Central"}]
```

## 2. Login

```bash
curl -X POST http://192.168.0.187:3011/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "recepcion",
    "password": "VitalFlow2026!",
    "centroId": "00000000-0000-0000-0000-000000000001"
  }'
```

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

> ### `centroId` es obligatorio
> Sin él el backend responde **401**:
> `"Debe seleccionar un centro para iniciar sesion."`
> Solo `Administrador` (`centroId: "global"`) puede omitirlo.
>
> Si `mustChangePassword` es `true`, pasar por `/auth/change-password` antes de
> operar.

Guardar el token:

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

---

## 3. Filtros del tablero

```bash
curl http://192.168.0.187:3011/api/v1/admision/landing/selectores \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "servicios": [],
  "practicas": [],
  "tiposEfector": [],
  "efectores": [],
  "estados": [
    "PROGRAMADO","EN_SALA_DE_ESPERA","EN_ATENCION","ATENDIDO","AUSENTE",
    "NO_ADMITIDO","NO_ATENDIDO","EN_OBSERVACION","PENDIENTE_DE_PAGO"
  ]
}
```

Usar `estados` para los botones de la app. No hardcodear la lista.

## 4. Tablero paginado

```bash
curl -X POST "http://192.168.0.187:3011/api/v1/admision/landing/tablero?page=1&pageSize=50" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "servicioId": null,
    "practicaId": null,
    "tipoEfector": null,
    "efectorId": null,
    "fecha": "2026-10-04",
    "estado": null
  }'
```

```json
{ "items": [], "total": 0, "page": 1, "pageSize": 50 }
```

Con datos:

```json
{
  "items": [{
    "id": "a1b2c3d4",
    "turno": "04/10/2026 09:00",
    "llegada": "04/10/2026 08:52",
    "pacienteId": "e5f6",
    "paciente": "Maria Lopez",
    "documento": "DNI 30123456",
    "financiador": "PAMI",
    "servicio": "Consultorios Externos",
    "efector": "Consultorio 1",
    "estado": "EN_SALA_DE_ESPERA",
    "estadoTurno": "PROGRAMADO"
  }],
  "total": 1,
  "page": 1,
  "pageSize": 50
}
```

- `page` y `pageSize` van en el **query string**.
- `pageSize` máximo **200**. Fuera de rango → **400**.
- Todos los campos del body son opcionales.

## 5. Buscar paciente

```bash
curl "http://192.168.0.187:3011/api/v1/personas/busqueda?tipoDocumento=DNI&numeroDocumento=30123456" \
  -H "Authorization: Bearer $TOKEN"
```

```json
[{
  "id": "a0000000-0000-0000-0000-000000000001",
  "apellidosNombres": "Lopez, Maria",
  "tipoDocumento": "DNI",
  "numeroDocumento": "30123456",
  "fechaNacimiento": "1985-03-15",
  "sexoBiologico": "F",
  "estado": "ACTIVO",
  "porcentajeCoincidencia": 100,
  "email": null,
  "telefono": null
}]
```

Confirmar cobertura:

```bash
curl "http://192.168.0.187:3011/api/v1/personas/a0000000-0000-0000-0000-000000000001/financiador-activo" \
  -H "Authorization: Bearer $TOKEN"
```

## 6. Check-in del paciente

```bash
curl -X POST http://192.168.0.187:3011/api/v1/admision/turnos/{turnoId}/arribo \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": "a0000000-0000-0000-0000-000000000001",
    "paciente": "Maria Lopez",
    "documento": "DNI 30123456",
    "financiador": "PAMI",
    "documentacionValidada": true,
    "requierePago": false,
    "pagoRegistrado": null,
    "practicaCienPorcientoConvenida": null
  }'
```

Los últimos cuatro son booleanos opcionales (`null` = no informar).

## 7. Cambiar estado

```bash
curl -X POST http://192.168.0.187:3011/api/v1/admision/turnos/{turnoId}/encuentro/cerrar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "estadoPacienteFinal": "ATENDIDO", "motivo": null }'
```

`estadoPacienteFinal` es obligatorio. Omitirlo → **400**.

Transición no válida desde el estado actual → **409**. Refrescar el tablero.

## 8. Detalle de turno

```bash
curl http://192.168.0.187:3011/api/v1/turnos/{turnoId} \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "id": "a1b2c3d4",
  "pacienteId": "e5f6",
  "profesional": "Dra. Ruiz",
  "servicio": "Consultorios Externos",
  "centro": "Centro Ambulatorio Central",
  "fechaHora": "2026-10-04T09:00:00-03:00",
  "estado": "PROGRAMADO",
  "motivo": null,
  "centroId": "00000000-0000-0000-0000-000000000001",
  "servicioId": "...",
  "efectorId": "...",
  "cupoId": null
}
```

No existe → **404**.

## 9. Anular turno

```bash
curl -X POST http://192.168.0.187:3011/api/v1/turnos/{turnoId}/anular \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "motivo": "El paciente no viene" }'
```

> El campo es **`motivo`**, no `motivoAnulacion`.

Respuesta:

```json
{
  "turnoId": "a1b2c3d4",
  "estadoAnterior": "PROGRAMADO",
  "estado": "ANULADO",
  "motivo": "El paciente no viene"
}
```

Solo se anula desde `AGENDADO` o `PROGRAMADO`. Otro estado → **409**.
Libera el horario del cupo.

> **Bug conocido:** `estadoAnterior` hoy devuelve el estado **nuevo** en vez del
> anterior. No usar ese campo para lógica hasta que se corrija.

## 10. Cierre del encuentro

```bash
curl http://192.168.0.187:3011/api/v1/admision/turnos/{turnoId}/encuentro \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://192.168.0.187:3011/api/v1/admision/turnos/{turnoId}/encuentro/cerrar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ }'
```

---

## Código Kotlin (OkHttp + coroutines)

```kotlin
object Api {
    // 10.0.2.2 = localhost del PC visto desde el emulador.
    // Para telefono real usar la IP del PC en la red Wi-Fi.
    private const val BASE = "http://10.0.2.2:3011/api/v1"

    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private var token: String? = null

    suspend fun login(username: String, password: String, centroId: String): LoginResponse {
        val json = """{"username":"$username","password":"$password","centroId":"$centroId"}"""
        val req = Request.Builder()
            .url("$BASE/auth/login")
            .post(json.toRequestBody(JSON))
            .build()

        return client.newCall(req).execute().use { it.parse() }
    }

    suspend fun tablero(page: Int = 1, pageSize: Int = 50, estado: String? = null): Tablero {
        // page y pageSize van en el query string, no en el body.
        val url = "$BASE/admision/landing/tablero?page=$page&pageSize=$pageSize"
        val body = """{"estado":${estado?.let { "\"$it\"" } ?: "null"}}"""

        val req = Request.Builder()
            .url(url)
            .post(body.toRequestBody(JSON))
            .header("Authorization", "Bearer ${requireNotNull(token)}")
            .build()

        return client.newCall(req).execute().use { it.parse() }
    }

    suspend fun anular(turnoId: String, motivo: String) {
        val req = Request.Builder()
            .url("$BASE/turnos/$turnoId/anular")
            .post("""{"motivo":"$motivo"}""".toRequestBody(JSON))
            .header("Authorization", "Bearer ${requireNotNull(token)}")
            .build()
        client.newCall(req).execute().use { it.parse() }
    }
}

private val JSON = "application/json; charset=utf-8".toMediaType()

// El backend responde con dos formatos de error distintos.
// Parsear ambos: 'message' viene de los controllers, 'detail' del middleware.
private fun <T> Response.parse(): T {
    val body = body?.string().orEmpty()
    if (!isSuccessful) {
        val msg = Regex("\"message\"\\s*:\\s*\"([^\"]+)\"")
            .find(body)?.groupValues?.get(1)
            ?: Regex("\"detail\"\\s*:\\s*\"([^\"]+)\"")
                .find(body)?.groupValues?.get(1)
            ?: "Error $code"
        throw ApiException(code, msg)
    }
    return gson.fromJson(body, type)
}
```

## Códigos de error

| Código | Qué hacer |
|---|---|
| 400 | Mostrar `message`. No reintentar. |
| 401 | Token vencido → `/auth/refresh` y reintentar una vez. Si falla, al login. |
| 403 | Rol sin permiso. **No es bug**: la acción no le corresponde. |
| 404 | No encontrado. |
| 409 | Estado no permite la operación. Refrescar tablero. |
| 429 | Rate limit. Login: 10/min. |

## Límites

| Política | Límite |
|---|---|
| `/auth/login`, `/auth/refresh` | 10 por minuto |
| Resto | 200 por minuto |