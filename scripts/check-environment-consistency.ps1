param(
    [switch]$SkipApiCheck
)

$ErrorActionPreference = 'Stop'

function Test-ContainerRunning {
    param([string]$Name)

    $running = docker ps --format "{{.Names}}" | Select-String -Pattern "^$Name$" -Quiet
    return [bool]$running
}

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }

    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Assert-False {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if ($Condition) {
        throw $Message
    }

    Write-Host "[OK] $Message" -ForegroundColor Green
}

Write-Host "Checking unified environment consistency..." -ForegroundColor Cyan

# Required integration containers
Assert-True (Test-ContainerRunning 'vitalflow_his_backend') 'Integration HIS backend is running (vitalflow_his_backend).'
Assert-True (Test-ContainerRunning 'vitalflow_portal_backend') 'Integration Portal backend is running (vitalflow_portal_backend).'
Assert-True (Test-ContainerRunning 'vitalflow-frontend') 'HIS frontend is running (vitalflow-frontend).'

# Legacy containers must be off
Assert-False (Test-ContainerRunning 'vitalflow-backend') 'Legacy HIS backend is NOT running (vitalflow-backend).'
Assert-False (Test-ContainerRunning 'vitalflow-postgres') 'Legacy HIS postgres is NOT running (vitalflow-postgres).'

# Portal target endpoint
$portalHisBase = docker exec vitalflow_portal_backend sh -lc "printenv HIS_API_BASE_URL" 2>$null
$portalHisBase = ($portalHisBase | Out-String).Trim()
Assert-True ($portalHisBase -eq 'http://host.docker.internal:3011/api') "Portal uses HIS_API_BASE_URL=http://host.docker.internal:3011/api (actual: $portalHisBase)."

# HIS frontend proxy target
$frontendProxyLine = docker exec vitalflow-frontend sh -lc "cat /etc/nginx/conf.d/default.conf | grep proxy_pass" 2>$null
$frontendProxyLine = ($frontendProxyLine | Out-String).Trim()
Assert-True ($frontendProxyLine -match 'proxy_pass\s+http://host\.docker\.internal:3011;') "HIS frontend proxies /api to host.docker.internal:3011 (actual: $frontendProxyLine)."

if (-not $SkipApiCheck) {
    Write-Host "Running quick API consistency check..." -ForegroundColor Cyan

    $loginBody = '{"username":"admin","password":"Admin123!"}'
    $login = Invoke-RestMethod -Method Post -Uri 'http://localhost:3011/api/v1/auth/login' -ContentType 'application/json' -Body $loginBody
    Assert-True (-not [string]::IsNullOrWhiteSpace($login.accessToken)) 'HIS login works on http://localhost:3011/api.'

    $headers = @{ Authorization = "Bearer $($login.accessToken)" }
    $selectores = Invoke-RestMethod -Method Get -Uri 'http://localhost:3011/api/v1/turnos/disponibilidad/selectores' -Headers $headers
    Assert-True ($null -ne $selectores) 'HIS selectores endpoint responds on 3011.'
}

Write-Host 'Environment consistency check PASSED.' -ForegroundColor Green
