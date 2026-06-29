$ErrorActionPreference = "Stop"

Write-Host "[setup-dr-peper] Starting..."

# --- Auth (same flow as regression script) ---
$newPass = "admin"
$bytes = New-Object byte[] 16
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$rng.GetBytes($bytes)
$saltB64 = [Convert]::ToBase64String($bytes)
$iter = 100000
$derive = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($newPass, $bytes, $iter, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
$hashBytes = $derive.GetBytes(32)
$hashB64 = [Convert]::ToBase64String($hashBytes)
$pwdHash = [string]::Join('$', @('pbkdf2-sha256', $iter, $saltB64, $hashB64))
docker exec -i vitalflow_postgres psql -U vitalflow_user -d vitalflow_his -c "update sch_seguridad.usuario_sistema set password_hash='$pwdHash', estado='ACTIVO', updated_at=now() where username='admin';" | Out-Null

$loginBody = @{ username = "admin"; password = $newPass } | ConvertTo-Json
$login = Invoke-RestMethod -UseBasicParsing -Method Post -Uri "http://localhost:3011/api/v1/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.accessToken
$auth = @{ Authorization = "Bearer $token" }
Write-Host "LOGIN_OK=true"

# --- Verificar que existen los selectors ---
$centros = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas/selectores/centros" -Headers $auth
$sanJose = $centros | Where-Object { $_.nombre -eq "Centro San Jose" }
if (-not $sanJose) { throw "ERROR: Centro San Jose no encontrado en BD" }
Write-Host "CENTRO_SAN_JOSE=$($sanJose.id)"

$servicios = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas/selectores/servicios?centroId=$($sanJose.id)" -Headers $auth
$clinica = $servicios | Where-Object { $_.nombre -like "*Clinica*" }
if (-not $clinica) { throw "ERROR: Servicio Clinica Medica no encontrado" }
Write-Host "SERVICIO_CLINICA=$($clinica.id)"

$efectores = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas/selectores/efectores?centroId=$($sanJose.id)&servicioId=$($clinica.id)&tipoEfector=PROFESIONAL" -Headers $auth
$drPeper = $efectores | Where-Object { $_.nombre -like "*Peper*" }
if (-not $drPeper) { throw "ERROR: Efector Dr Peper no encontrado" }
Write-Host "EFECTOR_PEPER=$($drPeper.id)"

$lugares = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas/selectores/lugares-atencion" -Headers $auth
if (-not $lugares -or $lugares.Count -eq 0) { throw "ERROR: No hay lugares de atencion configurados" }
$lugarAtencionId = $lugares[0].id
Write-Host "LUGAR_ATENCION=$lugarAtencionId"

# --- Verificar si ya existe la agenda ---
$agendas = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas" -Headers $auth
$agendaExistente = $agendas | Where-Object { $_.efectorId -eq $drPeper.id }

if ($agendaExistente) {
    Write-Host "AGENDA_EXISTENTE=$($agendaExistente.id) (ya estaba creada)"
    $agendaId = $agendaExistente.id
} else {
    # --- Crear Agenda Dr. Peper ---
    # Use UTC date from backend container to avoid past-date validation
    $hoy = (docker exec vitalflow_his_backend sh -c "date -u +%Y-%m-%d" 2>&1).Trim()
    Write-Host "BACKEND_UTC_DATE=$hoy"
    $agendaBody = @{
        nombre               = "Agenda Dr. Peper - Clinica Medica"
        centroId             = "$($sanJose.id)"
        servicioId           = "$($clinica.id)"
        tipoEfector          = "PROFESIONAL"
        efectorId            = "$($drPeper.id)"
        tipoAgenda           = "PROGRAMADA"
        visibleContactCenter = $true
        fechaDesde           = $hoy
        fechaHasta           = "2026-12-31"
    } | ConvertTo-Json

    $agenda = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas" -Method Post -ContentType "application/json" -Headers $auth -Body $agendaBody
    $agendaId = $agenda.id
    Write-Host "AGENDA_CREADA=$agendaId"
}

# --- Verificar si ya tiene bloque ---
$agendaDetail = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas/$agendaId" -Headers $auth
if ($agendaDetail.bloques -and $agendaDetail.bloques.Count -gt 0) {
    Write-Host "BLOQUE_EXISTENTE=$($agendaDetail.bloques[0].id) (ya estaba creado)"
} else {
    # --- Crear Bloque L/X/V 08:00-16:00, turno cada 20 min, practica Consulta general ---
    # Días en formato corto: L, X, V (como los espera el servicio)
    $hoy = (docker exec vitalflow_his_backend sh -c "date -u +%Y-%m-%d" 2>&1).Trim()
    $bloqueBody = @{
        nombre              = "Turno Clinica Medica L/X/V"
        tipoBloque          = "FIJA"
        fechaDesde          = $hoy
        fechaHasta          = "2026-12-31"
        atiendeFeriados     = $false
        dias                = @("L", "X", "V")
        horaInicio          = "08:00"
        horaFin             = "16:00"
        duracionTurnoMinutos = 20
        lugarAtencionId     = "$lugarAtencionId"
        frecuencia          = "SEMANAL"
        ordenMensualSemanas = @()
        practicas           = @(
            @{ nombre = "Consulta general"; duracionMinutos = 20 }
        )
        sobreturnos         = 2
    } | ConvertTo-Json -Depth 5

    $bloqueResp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3011/api/v1/agendas/$agendaId/bloques" -Method Post -ContentType "application/json" -Headers $auth -Body $bloqueBody
    Write-Host "BLOQUE_CREADO=StatusCode=$($bloqueResp.StatusCode)"
}

# --- Verificar Selectores Disponibilidad (Portal) ---
$selectores = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/turnos/disponibilidad/selectores" -Headers $auth
$centroPortal = $selectores.centros | Where-Object { $_.nombre -like "*San Jose*" }
$servicioPortal = $selectores.servicios | Where-Object { $_.nombre -like "*Clinica*" }
$profPortal = $selectores.profesionales | Where-Object { $_.nombre -like "*Peper*" }

Write-Host "PORTAL_CENTRO_VISIBLE=$(-not ($centroPortal -eq $null))"
Write-Host "PORTAL_SERVICIO_VISIBLE=$(-not ($servicioPortal -eq $null))"
Write-Host "PORTAL_PROFESIONAL_VISIBLE=$(-not ($profPortal -eq $null))"

if ($centroPortal -and $servicioPortal -and $selectores.practicas) {
    $practica = $selectores.practicas | Select-Object -First 1
    # Buscar disponibilidad
    $buscarBody = @{
        pacienteId      = "test-paciente"
        financiadorPlanId = "test-plan"
        centroIds       = @("$($centroPortal.id)")
        servicioId      = "$($servicioPortal.id)"
        practicaId      = "$($practica.id)"
        profesionalId   = $null
    } | ConvertTo-Json

    $disponibilidad = Invoke-RestMethod -UseBasicParsing -Uri "http://localhost:3011/api/v1/turnos/disponibilidad/buscar" -Method Post -ContentType "application/json" -Headers $auth -Body $buscarBody
    Write-Host "SLOTS_DISPONIBLES=$($disponibilidad.Count)"
    if ($disponibilidad.Count -gt 0) {
        Write-Host "PRIMER_SLOT: Fecha=$($disponibilidad[0].fecha) Hora=$($disponibilidad[0].hora) Profesional=$($disponibilidad[0].profesional)"
    }
}

Write-Host "[setup-dr-peper] Done."
