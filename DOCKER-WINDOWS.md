# VitalFlow Docker Setup para Windows

## Para Windows (PowerShell)

### Paso 1: Instalar Docker Desktop

1. Descargar: https://www.docker.com/products/docker-desktop
2. Instalar
3. Abrir y esperar a que esté listo (ver icono Docker en taskbar)
4. Habilitar WSL2 si te lo pide

### Paso 2: Verificar instalación

```powershell
docker --version
docker-compose --version
```

Ambos deben mostrar versión (ej: Docker version 24.0.0)

---

## Inicio Rápido en Windows

### Opción A: PowerShell directo (recomendado para Windows)

```powershell
# 1. Navegar a la carpeta del proyecto
cd "C:\Users\marti\OneDrive\Desktop Laptop Samsung\Integracion His_Portal VitalFLow\Integracion His_Portal VitalFLow"

# 2. Iniciar stack
docker-compose -f docker-compose.yml --env-file .env.docker up -d

# 3. Verificar estado
docker-compose ps

# 4. Ver logs
docker-compose logs -f
```

### Opción B: Script PowerShell (crear archivo `docker-manage.ps1`)

```powershell
# docker-manage.ps1

param(
    [Parameter(Position=0)]
    [ValidateSet('up', 'down', 'restart', 'logs', 'status', 'test', 'clean')]
    [string]$Command = 'help',
    
    [Parameter(Position=1)]
    [string]$Service = ''
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ProjectRoot '.env.docker'
$DC = "docker-compose -f $ProjectRoot\docker-compose.yml --env-file $EnvFile"

function Print-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
}

function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

switch ($Command) {
    'up' {
        Print-Header "Iniciando VitalFlow Stack"
        Invoke-Expression "$DC up -d"
        Print-Success "Stack iniciado!"
        Start-Sleep -Seconds 5
        Write-Host ""
        Write-Host "Servicios disponibles:" -ForegroundColor Green
        Write-Host "  Portal:       http://localhost:3000" -ForegroundColor Cyan
        Write-Host "  HIS Backend:  http://localhost:3001/api" -ForegroundColor Cyan
        Write-Host "  Nginx:        http://localhost:80" -ForegroundColor Cyan
        Write-Host "  PostgreSQL:   localhost:5432" -ForegroundColor Cyan
        Write-Host "  Redis:        localhost:6379" -ForegroundColor Cyan
        Invoke-Expression "$DC ps"
    }
    
    'down' {
        Print-Header "Deteniendo VitalFlow Stack"
        Invoke-Expression "$DC down"
        Print-Success "Stack detenido"
    }
    
    'restart' {
        Print-Header "Reiniciando VitalFlow Stack"
        Invoke-Expression "$DC down"
        Start-Sleep -Seconds 2
        Invoke-Expression "$DC up -d"
        Print-Success "Stack reiniciado"
    }
    
    'logs' {
        if ($Service) {
            Print-Info "Mostrando logs de $Service"
            Invoke-Expression "$DC logs -f $Service"
        } else {
            Print-Info "Mostrando logs de todos los servicios"
            Invoke-Expression "$DC logs -f"
        }
    }
    
    'status' {
        Print-Header "Estado de VitalFlow Stack"
        Invoke-Expression "$DC ps"
    }
    
    'test' {
        Print-Header "Health Checks"
        
        Print-Info "Comprobando PostgreSQL..."
        $pgResult = Invoke-Expression "$DC exec -T postgres pg_isready -U vitalflow_user" -ErrorVariable pgErr
        if ($pgErr) {
            Print-Error "PostgreSQL FALLÓ"
        } else {
            Print-Success "PostgreSQL OK"
        }
        
        Print-Info "Comprobando Redis..."
        $redisResult = Invoke-Expression "$DC exec -T redis redis-cli -a redis_secure_password ping" -ErrorVariable redisErr
        if ($redisErr) {
            Print-Error "Redis FALLÓ"
        } else {
            Print-Success "Redis OK"
        }
        
        Print-Info "Comprobando HIS Backend..."
        try {
            $his = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -ErrorAction Stop
            Print-Success "HIS Backend OK"
        } catch {
            Print-Error "HIS Backend FALLÓ"
        }
        
        Print-Info "Comprobando Portal..."
        try {
            $portal = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -ErrorAction Stop
            Print-Success "Portal OK"
        } catch {
            Print-Error "Portal FALLÓ"
        }
    }
    
    'clean' {
        Write-Host "ADVERTENCIA: Esto eliminará containers, volúmenes y redes!" -ForegroundColor Red
        $response = Read-Host "¿Estás seguro? (si/no)"
        if ($response -eq 'si') {
            Invoke-Expression "$DC down -v"
            Print-Success "Limpiado"
        } else {
            Print-Info "Cancelado"
        }
    }
    
    default {
        Write-Host "VitalFlow Docker Management" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Uso: .\docker-manage.ps1 <comando> [servicio]" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Comandos:" -ForegroundColor Yellow
        Write-Host "  up       - Iniciar todo el stack"
        Write-Host "  down     - Detener el stack"
        Write-Host "  restart  - Reiniciar el stack"
        Write-Host "  logs     - Ver logs (usar: .\docker-manage.ps1 logs his_backend)"
        Write-Host "  status   - Ver estado de servicios"
        Write-Host "  test     - Correr health checks"
        Write-Host "  clean    - Limpiar containers, volúmenes, redes"
        Write-Host ""
        Write-Host "Ejemplos:" -ForegroundColor Yellow
        Write-Host "  .\docker-manage.ps1 up"
        Write-Host "  .\docker-manage.ps1 logs his_backend"
        Write-Host "  .\docker-manage.ps1 status"
    }
}
```

### Uso del script PowerShell

```powershell
# Navegar a carpeta del proyecto
cd "C:\Users\...\Integracion Portal_HIs_VitalFlow"

# Hacer ejecutable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Usar el script
.\scripts\docker-manage.ps1 up
.\scripts\docker-manage.ps1 status
.\scripts\docker-manage.ps1 logs
.\scripts\docker-manage.ps1 down
```

---

## Comandos Rápidos en Windows

### Iniciar
```powershell
cd "C:\Users\marti\OneDrive\Desktop Laptop Samsung\Integracion His_Portal VitalFLow\Integracion His_Portal VitalFLow"
docker-compose -f docker-compose.yml --env-file .env.docker up -d
```

### Ver estado
```powershell
docker-compose ps
```

### Ver logs
```powershell
# Todos los logs
docker-compose logs -f

# Logs de un servicio
docker-compose logs -f his_backend
docker-compose logs -f portal_backend
docker-compose logs -f postgres
```

### Entrar a PostgreSQL
```powershell
docker-compose exec postgres psql -U vitalflow_user -d vitalflow_his
```

### Entrar a Redis
```powershell
docker-compose exec redis redis-cli -a redis_secure_password
```

### Detener
```powershell
docker-compose down
```

### Limpiar todo (destructivo)
```powershell
docker-compose down -v
```

---

## Crear Alias en PowerShell (opcional)

Agregar a tu profile de PowerShell (`$PROFILE`):

```powershell
# Alias para Docker Compose
function docker-up { 
    docker-compose -f docker-compose.yml --env-file .env.docker up -d
}

function docker-down { 
    docker-compose down
}

function docker-logs { 
    param([string]$Service)
    if ($Service) {
        docker-compose logs -f $Service
    } else {
        docker-compose logs -f
    }
}

function docker-ps { 
    docker-compose ps
}

function docker-status { 
    docker-compose ps
}

# Uso: docker-up, docker-down, docker-logs his_backend, etc.
```

Para cargar el profile:
```powershell
# Abrir PowerShell profile
notepad $PROFILE

# Agregar las funciones anteriores, guardar

# Recargar profile
& $PROFILE
```

---

## Verificación Rápida

Una vez iniciado:

```powershell
# 1. Verificar que Docker está corriendo
docker version

# 2. Verificar servicios
docker-compose ps

# 3. Probar endpoints
# Portal
Invoke-WebRequest http://localhost:3000/api/health

# HIS API
Invoke-WebRequest http://localhost:3001/api/health

# 4. Conectar a PostgreSQL (si tienes psql instalado)
psql -h localhost -U vitalflow_user -d vitalflow_his
# Password: secure_password_change_me

# 5. Conectar a Redis (si tienes redis-cli instalado)
redis-cli -h localhost -a redis_secure_password ping
```

---

## Troubleshooting en Windows

### "Docker not running"
- Abrir Docker Desktop desde Start Menu
- Esperar a que aparezca "Docker is running"

### "Port already in use"
```powershell
# Ver qué está usando el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplazar PID)
taskkill /PID 1234 /F

# O cambiar puerto en .env.docker
```

### "Cannot find Docker"
```powershell
# Reinstalar Docker Desktop y WSL2
# O agregar Docker al PATH:
# C:\Program Files\Docker\Docker\resources\bin
```

### "WSL 2 installation incomplete"
```powershell
# En PowerShell como Admin
wsl --install
wsl --set-default-version 2
```

---

## Próximos Pasos

1. **Iniciar stack:**
   ```powershell
   cd "C:\Users\marti\OneDrive\Desktop Laptop Samsung\Integracion His_Portal VitalFLow\Integracion His_Portal VitalFLow"
   docker-compose -f docker-compose.yml --env-file .env.docker up -d
   ```

2. **Abrir navegador:**
   - Portal: http://localhost:3000
   - HIS API: http://localhost:3001/api

3. **Ver logs:**
   ```powershell
   docker-compose logs -f
   ```

4. **Empezar desarrollo!**

---

¡Listo! Tu stack Docker está configurado para Windows. 🎉
