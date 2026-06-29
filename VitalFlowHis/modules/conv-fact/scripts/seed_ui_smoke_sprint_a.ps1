param(
    [string]$BaseUrl = "http://localhost:8000/api/v1"
)

$ErrorActionPreference = "Stop"

$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$catalogoCodigo = "CAT-UI-$ts"

$catalogo = Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos" -ContentType "application/json" -Body (@{
    codigo = $catalogoCodigo
    descripcion = "Catalogo UI Smoke"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos/$($catalogo.id)/prestaciones" -ContentType "application/json" -Body (@{
    codigo = "PRE-UI-$ts-A"
    descripcion = "Prestacion UI A"
    modulo = $false
    prioridad = $null
} | ConvertTo-Json) | Out-Null

Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos/$($catalogo.id)/prestaciones" -ContentType "application/json" -Body (@{
    codigo = "PRE-UI-$ts-B"
    descripcion = "Prestacion UI B"
    modulo = $true
    prioridad = 5
} | ConvertTo-Json) | Out-Null

Write-Host "OK: datos UI smoke generados"
Write-Host "catalogo_id=$($catalogo.id) codigo=$catalogoCodigo"