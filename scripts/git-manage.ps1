param(
    [Parameter(Position = 0)]
    [ValidateSet('status', 'pull', 'push', 'push-safe', 'fetch', 'branch', 'log', 'preflight')]
    [string]$Action = 'status',

    [Parameter(Position = 1)]
    [ValidateSet('his', 'portal', 'all')]
    [string]$Target = 'all'
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$Repos = @{
    his = Join-Path $Root 'VitalFlowHis'
    portal = Join-Path $Root 'VitalFlowPortal'
}

function Invoke-Git {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Cmd
    )

    if (-not (Test-Path (Join-Path $Path '.git'))) {
        throw "No se encontro .git en ${Path}"
    }

    Write-Host "[$Name] $Cmd" -ForegroundColor Cyan
    Push-Location $Path
    try {
        Invoke-Expression $Cmd
    } finally {
        Pop-Location
    }

    if ($LASTEXITCODE -ne 0) {
        throw "Comando fallido en $Name (exit $LASTEXITCODE)"
    }

    Write-Host "" 
}

function Invoke-GitCapture {
    param(
        [string]$Path,
        [string]$Cmd,
        [bool]$AllowFail = $false
    )

    Push-Location $Path
    try {
        $output = Invoke-Expression $Cmd 2>&1
    } finally {
        Pop-Location
    }
    if ($LASTEXITCODE -ne 0 -and -not $AllowFail) {
        throw "Comando fallido: $Cmd"
    }
    return [string]::Join("`n", $output)
}

function Test-RepoPreflight {
    param(
        [string]$Name,
        [string]$Path
    )

    if (-not (Test-Path (Join-Path $Path '.git'))) {
        throw "No se encontro .git en ${Path}"
    }

    Write-Host "[$Name] preflight" -ForegroundColor Cyan

    $branch = Invoke-GitCapture -Path $Path -Cmd 'git rev-parse --abbrev-ref HEAD'
    $dirty = Invoke-GitCapture -Path $Path -Cmd 'git status --porcelain'
    if (-not [string]::IsNullOrWhiteSpace($dirty)) {
        throw "[$Name] Hay cambios sin commit en rama $branch"
    }

    Invoke-GitCapture -Path $Path -Cmd 'git fetch --all --prune' | Out-Null

    $upstream = Invoke-GitCapture -Path $Path -Cmd 'git rev-parse --abbrev-ref --symbolic-full-name @{u}' -AllowFail $true
    if ([string]::IsNullOrWhiteSpace($upstream) -or $upstream.Contains('fatal')) {
        throw "[$Name] La rama $branch no tiene upstream configurado"
    }

    $counts = Invoke-GitCapture -Path $Path -Cmd "git rev-list --left-right --count \"$upstream...HEAD\""
    $parts = $counts.Trim().Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)
    if ($parts.Count -lt 2) {
        throw "[$Name] No se pudo calcular divergencia con upstream"
    }

    $behind = [int]$parts[0]
    $ahead = [int]$parts[1]

    if ($behind -gt 0) {
        throw "[$Name] Estas behind por $behind commits. Ejecuta pull antes de push-safe"
    }

    $summary = [PSCustomObject]@{
        Name = $Name
        Branch = $branch.Trim()
        Upstream = $upstream.Trim()
        Ahead = $ahead
        Behind = $behind
    }

    Write-Host "[$Name] OK | branch=$($summary.Branch) upstream=$($summary.Upstream) ahead=$ahead behind=$behind" -ForegroundColor Green
    Write-Host ""
    return $summary
}

$Targets = @()
if ($Target -eq 'all') {
    $Targets = @('his', 'portal')
} else {
    $Targets = @($Target)
}

if ($Action -eq 'preflight' -or $Action -eq 'push-safe') {
    $results = @()
    foreach ($t in $Targets) {
        $results += Test-RepoPreflight -Name $t -Path $Repos[$t]
    }

    if ($Action -eq 'push-safe') {
        foreach ($r in $results) {
            if ($r.Ahead -gt 0) {
                Invoke-Git -Name $r.Name -Path $Repos[$r.Name] -Cmd 'git push'
            } else {
                Write-Host "[$($r.Name)] Sin commits nuevos para push" -ForegroundColor Yellow
                Write-Host ""
            }
        }
    }
} else {
    $GitCmd = switch ($Action) {
        'status' { 'git status -sb' }
        'pull' { 'git pull --ff-only' }
        'push' { 'git push' }
        'fetch' { 'git fetch --all --prune' }
        'branch' { 'git branch -vv' }
        'log' { 'git log --oneline -n 10' }
    }

    foreach ($t in $Targets) {
        Invoke-Git -Name $t -Path $Repos[$t] -Cmd $GitCmd
    }
}
