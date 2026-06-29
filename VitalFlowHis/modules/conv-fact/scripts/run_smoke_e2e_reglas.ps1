param(
    [string]$DbContainer = "odi_db",
    [string]$DbName = "odi_db_facturacion",
    [string]$DbUser = "odi_usr_facturacion",
    [switch]$SkipBootstrap
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$bootstrapSql = Join-Path $repoRoot "scripts/local/20260606_e2e_local_bootstrap_sch_facturador.sql"
$smokeSql = Join-Path $repoRoot "scripts/local/20260606_smoke_e2e_reglas_asserts.sql"
$cfgSql = Join-Path $repoRoot "back_facturacion/database/db/sprint0014/20260606_SPR0014_HU31358_31360_reglas_facturacion_config.sql"
$resolverSql = Join-Path $repoRoot "back_facturacion/database/db/sprint0014/20260606_SPR0014_HU31359_31361_fn_resolver_regla_facturacion.sql"
$traceSql = Join-Path $repoRoot "back_facturacion/database/db/sprint0014/20260606_SPR0014_HU31361_sp_prfr_resolver_reglas_facturacion_lote.sql"
$homSql = Join-Path $repoRoot "back_facturacion/database/db/sprint0014/20260606_SPR0014_HU31361_sp_aplicar_resolucion_reglas_homologadas.sql"
$modSql = Join-Path $repoRoot "back_facturacion/database/db/sprint0014/20260606_SPR0014_HU31366_31367_auditoria_y_modulacion.sql"

function Invoke-SqlFile {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        throw "No existe archivo SQL: $Path"
    }

    $sql = Get-Content $Path -Raw
    $sql | docker exec -i $DbContainer psql -U $DbUser -d $DbName -v ON_ERROR_STOP=1 | Out-Host
}

Write-Host "[1/3] Verificando contenedor de DB"
$running = docker ps --format "{{.Names}}" | Select-String -SimpleMatch $DbContainer
if (-not $running) {
    throw "Contenedor no encontrado o detenido: $DbContainer"
}

Write-Host "[2/3] Aplicando precondiciones SQL (bootstrap + objetos sprint0014)"
if (-not $SkipBootstrap) {
    Invoke-SqlFile -Path $bootstrapSql
}
Invoke-SqlFile -Path $cfgSql
Invoke-SqlFile -Path $resolverSql
Invoke-SqlFile -Path $traceSql
Invoke-SqlFile -Path $homSql
Invoke-SqlFile -Path $modSql

Write-Host "[3/3] Ejecutando smoke E2E con asserts"
Invoke-SqlFile -Path $smokeSql

Write-Host "OK: smoke E2E reglas completado" -ForegroundColor Green
