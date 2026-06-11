Set-Location (Split-Path -Parent $PSScriptRoot)

$huFiles = Get-ChildItem -Path "EPICA *\FEATURE_HU\FEATURE_*\HU_*.md", "EPICA *\FEATURE_HU\FEATURE_*\DONE\HU_*.md" -File -ErrorAction SilentlyContinue
$badPattern = "Ã|Â|â|�"
$corePattern = "Ã|Â"

function Get-BadCount([string]$text) {
    if ([string]::IsNullOrEmpty($text)) { return 0 }
    return ([regex]::Matches($text, $badPattern)).Count
}

$updated = 0
$skipped = 0

foreach ($file in $huFiles) {
    $original = Get-Content -Path $file.FullName -Raw
    $before = Get-BadCount $original
    $beforeCore = ([regex]::Matches($original, $corePattern)).Count

    if ($before -eq 0) {
        $skipped++
        continue
    }

    $latin1 = [System.Text.Encoding]::GetEncoding(28591)
    $utf8 = [System.Text.Encoding]::UTF8
    $fixed = $utf8.GetString($latin1.GetBytes($original))
    $after = Get-BadCount $fixed
    $afterCore = ([regex]::Matches($fixed, $corePattern)).Count

    if (($afterCore -lt $beforeCore) -or (($beforeCore -eq 0) -and ($after -lt $before))) {
        Set-Content -Path $file.FullName -Value $fixed -Encoding UTF8
        $updated++
    }
    else {
        $skipped++
    }
}

Write-Output ("updated={0} skipped={1} total={2}" -f $updated, $skipped, $huFiles.Count)
