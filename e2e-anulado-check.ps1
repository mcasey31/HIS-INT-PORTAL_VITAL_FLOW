$ErrorActionPreference = 'Stop'

$pacienteId = '8376a007-e9e6-455c-818e-a4cc41f46db1'
$hisBaseUrl = if ($env:HIS_BASE_URL) { $env:HIS_BASE_URL.TrimEnd('/') } else { 'http://localhost:3011/api' }

$login = Invoke-RestMethod -Uri "$hisBaseUrl/v1/auth/login" -Method POST -ContentType 'application/json' -Body '{"username":"admin","password":"Admin123!"}'
$token = $login.accessToken
$headers = @{ Authorization = "Bearer $token" }

$selectores = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/disponibilidad/selectores" -Method GET -Headers $headers
$centroId = $selectores.centros | Select-Object -First 1 -ExpandProperty id
$servicioId = $selectores.servicios | Select-Object -First 1 -ExpandProperty id
$practicaId = $selectores.practicas | Select-Object -First 1 -ExpandProperty id

if (-not $centroId -or -not $servicioId -or -not $practicaId) {
  throw 'No hay selectores activos (centro/servicio/practica) para probar cancelacion.'
}

$buscarBody = @{
  pacienteId = $pacienteId
  financiadorPlanId = 'particular'
  centroIds = @($centroId)
  servicioId = $servicioId
  practicaId = $practicaId
} | ConvertTo-Json -Depth 5

$slots = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/disponibilidad/buscar" -Method POST -Headers $headers -ContentType 'application/json' -Body $buscarBody
if (-not $slots -or $slots.Count -eq 0) {
  throw 'No hay slots para probar cancelacion.'
}

$slot = $slots[0]
Write-Host "Slot elegido: $($slot.id)"

$before = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$pacienteId/turnos?historial=false&page=1&pageSize=50" -Method GET -Headers $headers
$beforeIds = @($before.items | ForEach-Object { $_.id })

$reservaBody = @{ 
  pacienteId = $pacienteId
  slotId = $slot.id
  financiadorPlanId = 'particular'
} | ConvertTo-Json

$null = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/asignacion" -Method POST -Headers $headers -ContentType 'application/json' -Body $reservaBody

$after = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$pacienteId/turnos?historial=false&page=1&pageSize=50" -Method GET -Headers $headers
$turnoNuevo = $after.items |
  Where-Object { $_.id -notin $beforeIds } |
  Sort-Object fechaHora -Descending |
  Select-Object -First 1

if ($null -eq $turnoNuevo) {
  throw 'No se pudo identificar el turno nuevo despues de asignacion.'
}

$turnoId = $turnoNuevo.id
Write-Host "Turno reservado real: $turnoId"

$cancelBody = @{ Estado = 'NO_ADMITIDO'; Motivo = 'Cancelacion E2E ANULADO' } | ConvertTo-Json
$cancel = Invoke-RestMethod -Uri "$hisBaseUrl/v1/admision/turnos/$turnoId/estado" -Method POST -Headers $headers -ContentType 'application/json' -Body $cancelBody
Write-Host "Cancelacion admision: $($cancel.estado)"

$turnos = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$pacienteId/turnos?historial=false&page=1&pageSize=50" -Method GET -Headers $headers
$turno = $turnos.items | Where-Object { $_.id -eq $turnoId } | Select-Object -First 1
if ($null -eq $turno) {
  throw 'No se encontro el turno reservado en listado de turnos.'
}

Write-Host "Estado en turnos: $($turno.estado)"
if ($turno.estado -ne 'ANULADO') {
  throw "Estado esperado ANULADO, actual: $($turno.estado)"
}

Write-Host 'OK: El turno cancelado queda ANULADO en historia de turnos.'
