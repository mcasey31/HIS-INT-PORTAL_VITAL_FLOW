param(
    [Parameter(Position = 0)]
    [ValidateSet('up', 'down', 'restart', 'rebuild', 'logs', 'status', 'health')]
    [string]$Action = 'status',

    [Parameter(Position = 1)]
    [ValidateSet('integration', 'his', 'portal', 'all')]
    [string]$System = 'integration',

    [Parameter(Position = 2)]
    [ValidateSet('all', 'his', 'portal', 'infra')]
    [string]$Scope = 'all'
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot

$Config = @{
    integration = @{
        compose = (Join-Path $Root 'docker-compose.yml')
        env = (Join-Path $Root '.env.docker')
        supportsScope = $true
    }
    his = @{
        compose = (Join-Path $Root 'VitalFlowHis/docker-compose.yml')
        env = (Join-Path $Root 'VitalFlowHis/.env')
        supportsScope = $false
    }
    portal = @{
        compose = (Join-Path $Root 'VitalFlowPortal/docker-compose.yml')
        env = (Join-Path $Root 'VitalFlowPortal/.env')
        supportsScope = $false
    }
}

function Get-IntegrationServicesForScope {
    param([string]$CurrentScope)

    switch ($CurrentScope) {
        'his' { return @('his_backend') }
        'portal' { return @('portal_backend') }
        'infra' { return @('postgres', 'redis', 'nginx') }
        default { return @() }
    }
}

function Invoke-Compose {
    param(
        [string]$ComposeFile,
        [string]$EnvFile,
        [string[]]$SubArgs,
        [string]$Label
    )

    if (-not (Test-Path $ComposeFile)) {
        throw "Compose file not found for ${Label}: ${ComposeFile}"
    }

    $args = @('compose', '-f', $ComposeFile)
    if ($EnvFile -and (Test-Path $EnvFile)) {
        $args += @('--env-file', $EnvFile)
    }
    $args += $SubArgs

    Write-Host "[$Label] docker $($args -join ' ')" -ForegroundColor DarkGray
    & docker @args

    if ($LASTEXITCODE -ne 0) {
        throw "Docker command failed for $Label (exit $LASTEXITCODE)"
    }
}

function Invoke-SystemAction {
    param(
        [string]$TargetSystem,
        [string]$TargetAction,
        [string]$TargetScope
    )

    $cfg = $Config[$TargetSystem]
    if (-not $cfg) {
        throw "Unknown system: $TargetSystem"
    }

    $services = @()
    if ($TargetSystem -eq 'integration') {
        $services = Get-IntegrationServicesForScope -CurrentScope $TargetScope
    }

    switch ($TargetAction) {
        'up' {
            if ($services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('up', '-d', '--no-deps', '--force-recreate') + $services) -Label $TargetSystem
            } else {
                if ($TargetSystem -eq 'integration') {
                    Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('up', '-d', '--force-recreate', '--remove-orphans') -Label $TargetSystem
                } else {
                    Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('up', '-d') -Label $TargetSystem
                }
            }
        }
        'down' {
            if ($TargetSystem -eq 'integration' -and $TargetScope -ne 'all' -and $services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('stop') + $services) -Label $TargetSystem
            } else {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('down') -Label $TargetSystem
            }
        }
        'restart' {
            if ($services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('restart') + $services) -Label $TargetSystem
            } else {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('restart') -Label $TargetSystem
            }
        }
        'rebuild' {
            if ($services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('build') + $services) -Label $TargetSystem
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('up', '-d', '--no-deps', '--force-recreate') + $services) -Label $TargetSystem
            } else {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('build') -Label $TargetSystem
                if ($TargetSystem -eq 'integration') {
                    Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('up', '-d', '--force-recreate', '--remove-orphans') -Label $TargetSystem
                } else {
                    Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('up', '-d') -Label $TargetSystem
                }
            }
        }
        'logs' {
            if ($services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('logs', '-f') + $services) -Label $TargetSystem
            } else {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('logs', '-f') -Label $TargetSystem
            }
        }
        'status' {
            if ($services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('ps') + $services) -Label $TargetSystem
            } else {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('ps') -Label $TargetSystem
            }
        }
        'health' {
            if ($services.Count -gt 0) {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs (@('ps') + $services) -Label $TargetSystem
            } else {
                Invoke-Compose -ComposeFile $cfg.compose -EnvFile $cfg.env -SubArgs @('ps') -Label $TargetSystem
            }
        }
    }
}

function Invoke-IntegrationConsistencyCheck {
    param([string]$CurrentAction, [string]$CurrentScope)

    if ($CurrentAction -notin @('up', 'restart', 'rebuild')) {
        return
    }

    if ($CurrentScope -ne 'all') {
        return
    }

    $checkScript = Join-Path $Root 'scripts/check-environment-consistency.ps1'
    if (-not (Test-Path $checkScript)) {
        Write-Warning "Consistency check script not found: $checkScript"
        return
    }

    Write-Host 'Running post-action environment consistency check...' -ForegroundColor Cyan
    & powershell -ExecutionPolicy Bypass -File $checkScript

    if ($LASTEXITCODE -ne 0) {
        throw "Environment consistency check failed after action '$CurrentAction'."
    }
}

Write-Host "Action: $Action | System: $System | Scope: $Scope" -ForegroundColor Cyan

if ($System -eq 'his') {
    Write-Host "Legacy HIS stack disabled for consistency. Redirecting to integration scope=his." -ForegroundColor Yellow
    $System = 'integration'
    $Scope = 'his'
}

if ($System -eq 'portal') {
    Write-Host "Legacy Portal stack disabled for consistency. Redirecting to integration scope=portal." -ForegroundColor Yellow
    $System = 'integration'
    $Scope = 'portal'
}

if ($System -eq 'all') {
    Write-Host "Running all stacks in parallel can desync data. Redirecting to integration scope=all." -ForegroundColor Yellow
    $System = 'integration'
    $Scope = 'all'
}

if ($System -eq 'all') {
    if ($Action -eq 'logs') {
        throw "For logs with full control, choose one system: integration | his | portal"
    }

    Invoke-SystemAction -TargetSystem 'integration' -TargetAction $Action -TargetScope $Scope
    Invoke-SystemAction -TargetSystem 'his' -TargetAction $Action -TargetScope 'all'
    Invoke-SystemAction -TargetSystem 'portal' -TargetAction $Action -TargetScope 'all'
} else {
    if ($System -ne 'integration' -and $Scope -ne 'all') {
        Write-Host "Scope is only used for integration stack; forcing scope=all for $System" -ForegroundColor Yellow
    }

    $effectiveScope = if ($System -eq 'integration') { $Scope } else { 'all' }
    Invoke-SystemAction -TargetSystem $System -TargetAction $Action -TargetScope $effectiveScope

    if ($System -eq 'integration') {
        Invoke-IntegrationConsistencyCheck -CurrentAction $Action -CurrentScope $effectiveScope
    }
}
