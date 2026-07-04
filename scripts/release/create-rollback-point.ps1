[CmdletBinding()]
param(
    [string]$Remote = "origin",
    [string]$DevBranch = "dev",
    [string]$QaBranch = "qa",
    [string]$MainBranch = "main",
    [string]$VercelAlias = "https://his-prod-smoky.vercel.app",
    [string]$VercelProject = "his-prod",
    [string]$VercelScope = "martin31casey-1648s-projects",
    [string]$VercelCwd = "VitalFlowHis/front",
    [string]$OutputDir = "scripts/release/rollback-points",
    [string]$Name,
    [switch]$CreateTag,
    [switch]$PushTag
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
git -c gc.auto=0 -c maintenance.auto=false fetch --all --prune --no-tags | Out-Null

$mainRef = "$Remote/$MainBranch"
$devRef = "$Remote/$DevBranch"
$qaRef = "$Remote/$QaBranch"

foreach ($ref in @($mainRef, $devRef, $qaRef)) {
    git show-ref --verify --quiet "refs/remotes/$ref"
    if ($LASTEXITCODE -ne 0) {
        throw "Missing remote branch: $ref"
    }
}

$mainHash = (git rev-parse $mainRef).Trim()
$devHash = (git rev-parse $devRef).Trim()
$qaHash = (git rev-parse $qaRef).Trim()

$vercelPath = if ([System.IO.Path]::IsPathRooted($VercelCwd)) {
    $VercelCwd
} else {
    Join-Path $repoRoot $VercelCwd
}

if (-not (Test-Path $vercelPath)) {
    throw "Vercel cwd not found: $vercelPath"
}

Push-Location $vercelPath
try {
    $inspectCmd = "vercel inspect `"$VercelAlias`""
    if (-not [string]::IsNullOrWhiteSpace($VercelScope)) {
        $inspectCmd += " --scope `"$VercelScope`""
    }

    $result = Invoke-CapturedProcess -FilePath "cmd.exe" -Arguments "/d /c $inspectCmd" -WorkingDirectory $vercelPath
    $inspectOutput = ($result.StdOut + "`n" + $result.StdErr).Trim()
    if ($result.ExitCode -ne 0) {
        throw "vercel inspect failed with exit code $($result.ExitCode). Output: $inspectOutput"
    }
}
finally {
    Pop-Location
}

$deploymentId = $null
$deploymentUrl = $null

if ($inspectOutput -match "(?m)^\s*id\s+(dpl_[A-Za-z0-9]+)\s*$") {
    $deploymentId = $matches[1]
}

if ($inspectOutput -match "(?m)^\s*url\s+(https://[^\s]+)\s*$") {
    $deploymentUrl = $matches[1]
}

if ([string]::IsNullOrWhiteSpace($deploymentUrl)) {
    throw "Could not resolve current deployment URL from: vercel inspect $VercelAlias"
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
if ([string]::IsNullOrWhiteSpace($Name)) {
    $Name = "rollback-main-$stamp"
}

$tagName = "rollback/main-$stamp"
$createdAt = (Get-Date).ToUniversalTime().ToString("o")
$outputBase = if ([System.IO.Path]::IsPathRooted($OutputDir)) {
    $OutputDir
} else {
    Join-Path $repoRoot $OutputDir
}

$outputPath = Join-Path $outputBase "$Name.json"

$outputFolder = Split-Path -Parent $outputPath
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder -Force | Out-Null
}

$data = [ordered]@{
    name = $Name
    createdAtUtc = $createdAt
    createdBy = [Environment]::UserName
    repo = [ordered]@{
        remote = $Remote
        root = $repoRoot
    }
    git = [ordered]@{
        dev = [ordered]@{
            ref = $devRef
            hash = $devHash
        }
        qa = [ordered]@{
            ref = $qaRef
            hash = $qaHash
        }
        main = [ordered]@{
            ref = $mainRef
            hash = $mainHash
        }
    }
    vercel = [ordered]@{
        alias = $VercelAlias
        project = $VercelProject
        scope = $VercelScope
        currentDeploymentId = $deploymentId
        currentDeploymentUrl = $deploymentUrl
    }
    rollback = [ordered]@{
        mainCommand = "git push --force-with-lease $Remote $mainHash`:main"
        vercelCommand = "vercel rollback $deploymentUrl --yes"
    }
}

if ($CreateTag) {
    git tag -a $tagName $mainHash -m "rollback point $Name"
    $data.tag = [ordered]@{
        name = $tagName
        hash = $mainHash
        pushed = $false
    }

    if ($PushTag) {
        git push $Remote $tagName
        $data.tag.pushed = $true
    }
}

$json = $data | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputPath, $json, $utf8NoBom)

Write-Host "Rollback point created:" -ForegroundColor Green
Write-Host "  file: $outputPath" -ForegroundColor DarkGray
Write-Host "  main: $mainHash" -ForegroundColor DarkGray
Write-Host "  vercel deployment: $deploymentUrl" -ForegroundColor DarkGray
if ($CreateTag) {
    Write-Host "  tag: $tagName" -ForegroundColor DarkGray
}
