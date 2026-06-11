$ErrorActionPreference = 'Stop'
$loginBody = '{"username":"admin","password":"Admin123!"}'
$login = Invoke-RestMethod -UseBasicParsing -Method Post -Uri 'http://localhost:3011/api/v1/auth/login' -ContentType 'application/json' -Body $loginBody
$auth = @{ Authorization = "Bearer $($login.accessToken)" }

$pacienteId = '8376a007-e9e6-455c-818e-a4cc41f46db1'
$buscarBody = @{
    pacienteId = $pacienteId
    financiadorPlanId = 'particular'
    centroIds = @('c0000000-0000-0000-0000-000000000099')
    servicioId = 'c0000000-0000-0000-0000-000001000001'
    practicaId = 'prac-c0000000-0000-0000-0000-000001000001-consulta-general'
} | ConvertTo-Json -Depth 5

$slots = Invoke-RestMethod -UseBasicParsing -Method Post -Uri 'http://localhost:3011/api/v1/turnos/disponibilidad/buscar' -ContentType 'application/json' -Headers $auth -Body $buscarBody
Write-Host "Slots disponibles: $($slots.Count)"
$slots | Select-Object -First 3 | ConvertTo-Json -Depth 5
