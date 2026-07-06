[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$PointFile,
    [string]$Remote = "origin",
    [string]$VercelCwd = "VitalFlowHis/front",
    [switch]$RollbackMain,
    [switch]$RollbackVercel,
    [switch]$Yes,
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

function Assert-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $Name"
    }
}

function Invoke-CapturedProcess {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,
        [Parameter(Mandatory = $true)]
        [string]$Arguments,
        [Parameter(Mandatory = $true)]
        [string]$WorkingDirectory
    )

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $FilePath
    $psi.Arguments = $Arguments
    $psi.WorkingDirectory = $WorkingDirectory
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $psi
    [void]$proc.Start()
    $stdOut = $proc.StandardOutput.ReadToEnd()
    $stdErr = $proc.StandardError.ReadToEnd()
    $proc.WaitForExit()

    return [pscustomobject]@{
        ExitCode = $proc.ExitCode
        StdOut   = $stdOut
        StdErr   = $stdErr
    }
}

Assert-Command git
Assert-Command vercel

$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
    throw "Not inside a git repository"
}

Set-Location $repoRoot

if (-not (Test-Path $PointFile)) {
    throw "Rollback point file not found: $PointFile"
}

$raw = Get-Content -Path $PointFile -Raw
$point = $raw | ConvertFrom-Json

if (-not $RollbackMain -and -not $RollbackVercel) {
    $RollbackMain = $true
    $RollbackVercel = $true
}

if (-not $Yes -and -not $WhatIf) {
    throw "This action changes remote state. Re-run with -Yes (or -WhatIf to preview)."
}

if ($RollbackMain) {
    $targetHash = [string]$point.git.main.hash
    if ([string]::IsNullOrWhiteSpace($targetHash)) {
        throw "Rollback point does not contain git.main.hash"
    }

    $cmd = "git push --force-with-lease $Remote $targetHash`:main"
    Write-Host "Main rollback command:" -ForegroundColor Cyan
    Write-Host "  $cmd" -ForegroundColor DarkGray

    if (-not $WhatIf) {
        git -c gc.auto=0 -c maintenance.auto=false fetch --all --prune --no-tags | Out-Null
        git push --force-with-lease $Remote "$targetHash`:main"
    }
}

if ($RollbackVercel) {
    $deploymentUrl = [string]$point.vercel.currentDeploymentUrl
    if ([string]::IsNullOrWhiteSpace($deploymentUrl)) {
        throw "Rollback point does not contain vercel.currentDeploymentUrl"
    }

    $vercelPath = if ([System.IO.Path]::IsPathRooted($VercelCwd)) {
        $VercelCwd
    } else {
        Join-Path $repoRoot $VercelCwd
    }

    if (-not (Test-Path $vercelPath)) {
        throw "Vercel cwd not found: $vercelPath"
    }

    Write-Host "Vercel rollback command:" -ForegroundColor Cyan
    Write-Host "  vercel rollback $deploymentUrl --yes" -ForegroundColor DarkGray

    if (-not $WhatIf) {
        Push-Location $vercelPath
        try {
            $rollbackCmd = "vercel rollback `"$deploymentUrl`" --yes"
            $scope = [string]$point.vercel.scope
            if (-not [string]::IsNullOrWhiteSpace($scope)) {
                $rollbackCmd += " --scope `"$scope`""
            }

            $result = Invoke-CapturedProcess -FilePath "cmd.exe" -Arguments "/d /c $rollbackCmd" -WorkingDirectory $vercelPath
            if ($result.ExitCode -ne 0) {
                $combined = ($result.StdOut + "`n" + $result.StdErr).Trim()
                throw "vercel rollback failed with exit code $($result.ExitCode). Output: $combined"
            }
        }
        finally {
            Pop-Location
        }
    }
}

if ($WhatIf) {
    Write-Host "Preview complete (WhatIf). No changes applied." -ForegroundColor Yellow
} else {
    Write-Host "Rollback actions completed." -ForegroundColor Green
}
