$ErrorActionPreference = 'Stop'
$hisBaseUrl = if ($env:HIS_BASE_URL) { $env:HIS_BASE_URL.TrimEnd('/') } else { 'http://localhost:3001/api' }
$pacienteId = '8376a007-e9e6-455c-818e-a4cc41f46db1'
$financiadorId = '30000000-0000-0000-0000-000000000003'
$planId = '30000000-0000-0000-0000-000000000301'

if (-not [Guid]::TryParse($financiadorId, [ref]([Guid]::Empty))) {
	throw "Cobertura invalida para E2E: financiadorId no es GUID ($financiadorId)."
}

if (-not [Guid]::TryParse($planId, [ref]([Guid]::Empty))) {
	throw "Cobertura invalida para E2E: planId no es GUID ($planId)."
}

$login = Invoke-RestMethod -Uri "$hisBaseUrl/v1/auth/login" -Method POST -ContentType 'application/json' -Body '{"username":"admin","password":"admin"}'
$headers = @{ Authorization = "Bearer $($login.accessToken)" }
$selectores = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/disponibilidad/selectores" -Method GET -Headers $headers
$practica = $selectores.practicas | Select-Object -First 1
$centro = $selectores.centros | Select-Object -First 1
$servicio = $selectores.servicios | Select-Object -First 1
$buscarBody = @{ pacienteId = $pacienteId; financiadorPlanId = 'particular'; centroIds = @($centro.id); servicioId = $servicio.id; practicaId = $practica.id } | ConvertTo-Json -Depth 5
$slots = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/disponibilidad/buscar" -Method POST -Headers $headers -ContentType 'application/json' -Body $buscarBody
if (-not $slots -or $slots.Count -eq 0) { throw 'No hay slots disponibles para E2E' }
$slot = $slots[0]
$before = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$pacienteId/turnos?historial=false&page=1&pageSize=50" -Method GET -Headers $headers
$beforeIds = @($before.items | ForEach-Object { $_.id })
$reservaBody = @{ pacienteId = $pacienteId; slotId = $slot.id; financiadorPlanId = 'particular' } | ConvertTo-Json
$null = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/asignacion" -Method POST -Headers $headers -ContentType 'application/json' -Body $reservaBody
$after = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$pacienteId/turnos?historial=false&page=1&pageSize=50" -Method GET -Headers $headers
$turnoNuevo = $after.items | Where-Object { $_.id -notin $beforeIds } | Sort-Object fechaHora -Descending | Select-Object -First 1
if ($null -eq $turnoNuevo) { throw 'No se pudo identificar el turno nuevo' }
$turnoId = $turnoNuevo.id
$arriboBody = @{ pacienteId = $pacienteId; paciente = 'Test Paciente'; documento = 'DNI 27483779'; financiador = 'Privado/Particular | Privado Particular'; documentacionValidada = $true; requierePago = $false; pagoRegistrado = $false; practicaCienPorcientoConvenida = $false; financiadorId = $financiadorId; planId = $planId; servicioNombre = $servicio.nombre; centroId = $centro.id; practicaOrigenNombre = $practica.nombre; practicaOrigenCodigo = $practica.id; profesionalNombre = 'Ana Diaz'; tipoOrigen = 'TURNO' } | ConvertTo-Json -Depth 6
$arribo = Invoke-RestMethod -Uri "$hisBaseUrl/v1/admision/turnos/$turnoId/arribo" -Method POST -Headers $headers -ContentType 'application/json' -Body $arriboBody
"E2E_TURNO_ID=$turnoId"
"E2E_ARRIBO_ESTADO=$($arribo.estado)"
"E2E_ARRIBO_EVENTO_ESTADO=$($arribo.facturacionEventoEstado)"
"E2E_ARRIBO_EVENTO_DETALLE=$($arribo.facturacionEventoDetalle)"
