$ErrorActionPreference = 'Stop'

$hisBaseUrl = if ($env:HIS_BASE_URL) { $env:HIS_BASE_URL.TrimEnd('/') } else { 'http://localhost:3011/api' }
$login = Invoke-RestMethod -Uri "$hisBaseUrl/v1/auth/login" -Method POST -ContentType 'application/json' -Body '{"username":"admin","password":"admin"}'
$token = $login.accessToken
$hisId = '8376a007-e9e6-455c-818e-a4cc41f46db1'
$headers = @{ Authorization = "Bearer $token" }

$future = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$hisId/turnos?historial=false&page=1&pageSize=20" -Method GET -Headers $headers
$past = Invoke-RestMethod -Uri "$hisBaseUrl/v1/turnos/pacientes/$hisId/turnos?historial=true&page=1&pageSize=20" -Method GET -Headers $headers

Write-Host 'FUTURE:'
$future.items | Select-Object id, estado, fechaHora | ConvertTo-Json -Depth 5
Write-Host 'PAST:'
$past.items | Select-Object id, estado, fechaHora | ConvertTo-Json -Depth 5
