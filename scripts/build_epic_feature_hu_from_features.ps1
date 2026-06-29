$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

$rows = @()

Get-ChildItem -Directory | Where-Object { $_.Name -like 'EPICA *' } | ForEach-Object {
  $epicName = $_.Name
  $epicDir = $_.FullName
  $featuresDir = Join-Path $epicDir 'FEATURES'

  if (-not (Test-Path $featuresDir)) {
    $rows += ("{0} | sin FEATURES" -f $epicName)
    return
  }

  $treeRoot = Join-Path $epicDir 'FEATURE_HU'
  if (-not (Test-Path $treeRoot)) {
    New-Item -ItemType Directory -Path $treeRoot | Out-Null
  }

  $featureFiles = Get-ChildItem -Path $featuresDir -File -Filter 'FEATURE_*.md'
  $featureCount = 0
  $huCount = 0

  foreach ($ff in $featureFiles) {
    $featureCount++
    $featureName = [System.IO.Path]::GetFileNameWithoutExtension($ff.Name)
    $featureFolder = Join-Path $treeRoot $featureName
    if (-not (Test-Path $featureFolder)) {
      New-Item -ItemType Directory -Path $featureFolder | Out-Null
    }

    Get-ChildItem -Path $featureFolder -File -Filter 'HU_*.md' -ErrorAction SilentlyContinue | Remove-Item -Force

    Copy-Item -LiteralPath $ff.FullName -Destination (Join-Path $featureFolder 'feature.md') -Force

    $lines = Get-Content -Path $ff.FullName
    foreach ($line in $lines) {
      if ($line -match '^- PBI\s+(\d+):\s+(.+?)\s+\|\s+Estado:\s*(.*)$') {
        $pbiId = $matches[1]
        $pbiTitle = $matches[2].Trim()
        $pbiState = $matches[3].Trim()

        $slug = ($pbiTitle.ToUpper() -replace '[^A-Z0-9]+','-').Trim('-')
        if ($slug.Length -gt 48) { $slug = $slug.Substring(0, 48).Trim('-') }
        if ([string]::IsNullOrWhiteSpace($slug)) { $slug = 'HU' }

        $huFile = "HU_${pbiId}_${slug}.md"
        $huPath = Join-Path $featureFolder $huFile

        $huDoc = @()
        $huDoc += "# HU $pbiId - $pbiTitle"
        $huDoc += ""
        $huDoc += "## Trazabilidad"
        $huDoc += "- Epic: $epicName"
        $huDoc += "- Feature: $featureName"
        $huDoc += "- Tipo Azure: Product Backlog Item"
        $huDoc += "- Estado: $pbiState"
        $huDoc += "- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/$pbiId/"
        $huDoc += ""
        $huDoc += "## User Story"
        $huDoc += "Como [rol]"
        $huDoc += "quiero [capacidad]"
        $huDoc += "para [beneficio]."

        Set-Content -Path $huPath -Value ($huDoc -join "`r`n") -Encoding UTF8
        $huCount++
      }
    }
  }

  $index = @()
  $index += "# Estructura EPICA -> FEATURE -> HU"
  $index += ""
  $index += "- Epic: $epicName"
  $index += "- Features: $featureCount"
  $index += "- HU: $huCount"
  Set-Content -Path (Join-Path $treeRoot 'index.md') -Value ($index -join "`r`n") -Encoding UTF8

  $rows += ("{0} | FEATURE_HU OK | Features:{1} | HU:{2}" -f $epicName, $featureCount, $huCount)
}

$rows | ForEach-Object { Write-Output $_ }
