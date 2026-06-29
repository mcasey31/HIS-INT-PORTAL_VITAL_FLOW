param(
  [string]$SourceFile
)

if ([string]::IsNullOrWhiteSpace($SourceFile) -or -not (Test-Path $SourceFile)) {
  throw "SourceFile invalido: $SourceFile"
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$jsonText = (Get-Content -Path $SourceFile -Raw) -replace '^Result:\s*',''
$data = $jsonText | ConvertFrom-Json

function Normalize-Text([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return '' }
  $formD = $text.Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $formD.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$sb.Append($ch)
    }
  }
  return ($sb.ToString().Normalize([Text.NormalizationForm]::FormC)).ToUpperInvariant().Trim()
}

function Slug([string]$text) {
  $n = Normalize-Text $text
  $n = $n -replace '[^A-Z0-9]+','-'
  $n = $n.Trim('-')
  if ([string]::IsNullOrWhiteSpace($n)) { return 'ITEM' }
  return $n
}

function ShortSlug([string]$text, [int]$max = 80) {
  $s = Slug $text
  if ($s.Length -le $max) { return $s }
  return $s.Substring(0, $max).Trim('-')
}

$epicDirs = Get-ChildItem -Directory | Where-Object { $_.Name -like 'EPICA *' }
$report = @()

foreach ($epic in $data.epics) {
  $eNorm = Normalize-Text $epic.title
  $target = $epicDirs | Where-Object {
    (Normalize-Text (($_.Name -replace '^EPICA\s+',''))) -eq $eNorm
  } | Select-Object -First 1

  if (-not $target) {
    $report += "SIN_CARPETA: $($epic.title)"
    continue
  }

  $featuresDir = Join-Path $target.FullName 'FEATURE_HU'
  if (-not (Test-Path $featuresDir)) {
    New-Item -Path $featuresDir -ItemType Directory | Out-Null
  }

  $summary = @()
  $summary += "# Matriz Features y PBIs - EPICA $($epic.title)"
  $summary += ""
  $summary += "- Epic ID: $($epic.id)"
  $summary += "- Estado: $($epic.state)"
  $summary += "- Features: $($epic.features.Count)"

  $pbiTotal = 0

  foreach ($f in $epic.features) {
    $pbiTotal += $f.pbis.Count
    $featureDirName = "FEATURE_{0}_{1}" -f $f.id, (ShortSlug $f.title)
    $featureDir = Join-Path $featuresDir $featureDirName
    if (-not (Test-Path $featureDir)) {
      New-Item -Path $featureDir -ItemType Directory | Out-Null
    }

    $fpath = Join-Path $featureDir 'feature.md'

    $fd = @()
    $fd += "# Feature $($f.id) - $($f.title)"
    $fd += ""
    $fd += "- Estado: $($f.state)"
    $fd += "- Epic: $($epic.title) ($($epic.id))"
    $fd += "- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/$($f.id)/"
    $fd += ""
    $fd += "## PBIs"

    if ($f.pbis.Count -eq 0) {
      $fd += "- Sin PBIs asociados en Azure."
    } else {
      foreach ($p in $f.pbis) {
        $fd += "- PBI $($p.id): $($p.title) | Estado: $($p.state)"
        $fd += "  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/$($p.id)/"
      }
    }

    Set-Content -Path $fpath -Value ($fd -join "`r`n") -Encoding UTF8

    Get-ChildItem -Path $featureDir -File -Filter 'HU_*.md' | Remove-Item -Force
    if ($f.pbis.Count -gt 0) {
      foreach ($p in $f.pbis) {
        $huFile = "HU_{0}_{1}.md" -f $p.id, (ShortSlug $p.title 60)
        $huPath = Join-Path $featureDir $huFile
        $hu = @()
        $hu += "# HU $($p.id) - $($p.title)"
        $hu += ""
        $hu += "- Estado: $($p.state)"
        $hu += "- Feature: $($f.title) ($($f.id))"
        $hu += "- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/$($p.id)/"
        Set-Content -Path $huPath -Value ($hu -join "`r`n") -Encoding UTF8
      }
    }

    $summary += ""
    $summary += "## Feature $($f.id) - $($f.title)"
    $summary += "- Estado: $($f.state)"
    $summary += "- Carpeta: FEATURE_HU/$featureDirName"
    $summary += "- Archivo: FEATURE_HU/$featureDirName/feature.md"
    $summary += "- PBIs: $($f.pbis.Count)"
    foreach ($p in $f.pbis) {
      $summary += "  - PBI $($p.id): $($p.title) | Estado: $($p.state)"
    }
  }

  $summary += ""
  $summary += "- PBIs totales: $pbiTotal"

  $matrixPath = Join-Path $featuresDir 'index.md'
  Set-Content -Path $matrixPath -Value ($summary -join "`r`n") -Encoding UTF8

  $report += "OK: $($target.Name) features=$($epic.features.Count) pbis=$pbiTotal"
}

$report | ForEach-Object { Write-Output $_ }
