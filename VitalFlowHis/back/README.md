# BACK

Esta carpeta contiene servicios y reglas de negocio del HIS.

## Incluye
- APIs (REST) por modulo.
- Casos de uso y logica de dominio.
- Seguridad, permisos, auditoria y validaciones funcionales.
- Repositorios y adaptadores a DB/integraciones.

## No incluye
- Componentes de UI.
- Vistas o templates de frontend.

## Configuracion segura de credenciales (Fase 0 Seguridad)

No guardar secretos reales en archivos versionados.

### PostgreSQL en Docker Compose
- El archivo `docker-compose.yml` consume variables de entorno para DB.
- Crear un archivo `.env` en la raiz del repositorio usando `.env.example` como base.

Variables esperadas:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Connection string en desarrollo local
Para ejecutar el backend fuera de Docker, configurar la connection string con user-secrets:

```powershell
cd back/src/VitalFlow.His.Api
dotnet user-secrets set "ConnectionStrings:VitalFlowHisDb" "Host=localhost;Port=5433;Database=vitalflow_his;Username=YOUR_USER;Password=YOUR_PASSWORD"
```

### Secret de firma JWT
Configurar la clave de firma JWT en user-secrets en desarrollo:

```powershell
cd back/src/VitalFlow.His.Api
dotnet user-secrets set "Jwt:SigningKey" "YOUR_LONG_RANDOM_SIGNING_KEY"
```

En Docker, la clave se inyecta por variable de entorno:
- `JWT_SIGNING_KEY`

## Bootstrap de autenticacion JWT (SEC-001 a SEC-004)

### 1) Aplicar migracion de seguridad
La migracion `db/migrations/014_feature_seguridad_auth.sql` crea tablas de seguridad y seed inicial.

Si la base ya existe con volumen persistido, aplicar manualmente:

```powershell
Get-Content db/migrations/014_feature_seguridad_auth.sql | docker exec -i vitalflow-postgres psql -U postgres -d vitalflow_his
```

### 2) Usuario semilla inicial
- Usuario: `admin`
- Password temporal: `admin`
- Estado inicial: `DEBE_CAMBIAR_PASSWORD`

Nota: esta contrasena es solo de arranque en desarrollo y debe rotarse en la primera implementacion de cambio de password.

### 3) Endpoints de auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

Body de ejemplo para login:

```json
{
	"username": "admin",
	"password": "admin"
}
```

Body de ejemplo para refresh/logout:

```json
{
	"refreshToken": "<token>"
}
```
