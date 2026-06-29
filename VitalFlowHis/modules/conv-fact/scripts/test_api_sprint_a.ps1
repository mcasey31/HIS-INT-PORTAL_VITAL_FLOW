param(
    [string]$BaseUrl = "http://localhost:8000/api/v1"
)

$ErrorActionPreference = "Stop"

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw "ASSERT FAIL: $Message"
    }
}

function Assert-StatusCode {
    param(
        [scriptblock]$Action,
        [int]$ExpectedStatus,
        [string]$Message
    )

    try {
        & $Action | Out-Null
        throw "ASSERT FAIL: $Message (no fallo y se esperaba HTTP $ExpectedStatus)"
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -ne $ExpectedStatus) {
            throw "ASSERT FAIL: $Message (esperado HTTP $ExpectedStatus, recibido HTTP $statusCode)"
        }
    }
}

$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$catalogoCodigo = "CAT-TST-$ts"
$catalogoCodigoEditado = "CAT-TST-$ts-ED"
$prestacionCodigo = "PRE-TST-$ts"
$prestacionCodigoEditado = "PRE-TST-$ts-ED"

Write-Host "[1/8] Alta catalogo"
$catalogo = Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos" -ContentType "application/json" -Body (@{
    codigo = $catalogoCodigo
    descripcion = "Catalogo Test Sprint A"
} | ConvertTo-Json)

Assert-True ($catalogo.id -gt 0) "Catalogo debe tener ID"

Write-Host "[2/8] Duplicidad catalogo"
Assert-StatusCode -ExpectedStatus 409 -Message "Debe rechazar catalogo duplicado" -Action {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos" -ContentType "application/json" -Body (@{
        codigo = $catalogoCodigo
        descripcion = "Catalogo duplicado"
    } | ConvertTo-Json)
}

Write-Host "[3/8] Edicion catalogo"
$catalogoEditado = Invoke-RestMethod -Method Put -Uri "$BaseUrl/catalogos/$($catalogo.id)" -ContentType "application/json" -Body (@{
    codigo = $catalogoCodigoEditado
    descripcion = "Catalogo Test Editado"
} | ConvertTo-Json)

Assert-True ($catalogoEditado.codigo -eq $catalogoCodigoEditado) "Catalogo debe quedar editado"

Write-Host "[4/8] Alta prestacion"
$prestacion = Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos/$($catalogo.id)/prestaciones" -ContentType "application/json" -Body (@{
    codigo = $prestacionCodigo
    descripcion = "Prestacion Test"
    modulo = $false
    prioridad = $null
} | ConvertTo-Json)

Assert-True ($prestacion.id -gt 0) "Prestacion debe tener ID"

Write-Host "[5/8] Edicion prestacion + regla modulo/prioridad"
$prestacionEditada = Invoke-RestMethod -Method Put -Uri "$BaseUrl/prestaciones/$($prestacion.id)" -ContentType "application/json" -Body (@{
    codigo = $prestacionCodigoEditado
    descripcion = "Prestacion Test Editada"
    modulo = $true
    prioridad = 11
} | ConvertTo-Json)

Assert-True ($prestacionEditada.modulo -eq $true) "Prestacion editada debe quedar con modulo=true"
Assert-True ($prestacionEditada.prioridad -eq 11) "Prestacion editada debe guardar prioridad"

Write-Host "[6/8] Duplicidad prestacion"
Assert-StatusCode -ExpectedStatus 409 -Message "Debe rechazar prestacion duplicada en catalogo" -Action {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/catalogos/$($catalogo.id)/prestaciones" -ContentType "application/json" -Body (@{
        codigo = $prestacionCodigoEditado
        descripcion = "Prestacion duplicada"
        modulo = $false
    } | ConvertTo-Json)
}

Write-Host "[7/8] Filtros"
$catalogosFiltrados = Invoke-RestMethod -Uri "$BaseUrl/catalogos?codigo=$catalogoCodigoEditado&estado=activo"
Assert-True ($catalogosFiltrados.Count -ge 1) "Filtro de catalogos debe devolver resultados"

$prestacionesFiltradas = Invoke-RestMethod -Uri "$BaseUrl/catalogos/$($catalogo.id)/prestaciones?codigo=$prestacionCodigoEditado&modulo=true"
Assert-True ($prestacionesFiltradas.Count -eq 1) "Filtro de prestaciones debe devolver 1 resultado"

Write-Host "[8/8] Auditoria"
$auditoria = Invoke-RestMethod -Uri "$BaseUrl/auditoria"
Assert-True ($auditoria.eventos.Count -ge 4) "Auditoria debe registrar eventos"

Write-Host "OK: Sprint A API smoke test finalizado"