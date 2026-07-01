Set-Location (Split-Path -Parent $PSScriptRoot)

$map = Get-Content "docs\hu-path-map.json" -Raw | ConvertFrom-Json
$export = Get-Content "docs\azure-hu-full-export.json" -Raw
if ($export -match '^Result:\s*') {
  $export = $export -replace '^Result:\s*', ''
}
$data = $export | ConvertFrom-Json

$byId = @{}
foreach ($item in $data.items) {
  $byId[[string]$item.id] = $item
}

function Clean-Html([string]$html) {
  if ([string]::IsNullOrWhiteSpace($html)) { return '' }

  $text = $html -replace '<br\s*/?>', "`n" -replace '</p>', "`n`n" -replace '<li>', '- ' -replace '</li>', "`n"
  $text = $text -replace '<[^>]+>', ''
  $text = [System.Net.WebUtility]::HtmlDecode($text)
  $text = $text -replace "`r", ''
  $text = $text -replace "`n{3,}", "`n`n"
  return $text.Trim()
}

$updated = 0
$missing = 0

foreach ($row in $map.items) {
  $id = [string]$row.id
  $path = $row.path

  if (-not (Test-Path $path)) { continue }
  if (-not $byId.ContainsKey($id)) {
    $missing++
    continue
  }

  $wi = $byId[$id]
  $raw = Get-Content -Path $path -Raw

  # Avoid duplicating previously appended Azure sections
  $raw = [regex]::Replace($raw, "(?ms)\r?\n## Azure Descripcion\r?\n.*$", "")

  $desc = Clean-Html $wi.description
  $ac = Clean-Html $wi.acceptanceCriteria

  $taskLines = @()
  foreach ($t in $wi.tasks) {
    if ($null -eq $t.id) { continue }
    $taskLines += ("- {0} {1}: {2} | Estado: {3}" -f $t.type, $t.id, $t.title, $t.state)
    if (-not [string]::IsNullOrWhiteSpace($t.assignedTo)) {
      $taskLines += ("  - Asignado a: " + $t.assignedTo)
    }
  }

  $append = @()
  $append += ""
  $append += "## Azure Descripcion"
  if ([string]::IsNullOrWhiteSpace($desc)) {
    $append += "- Sin descripcion en Azure."
  } else {
    $append += $desc
  }

  $append += ""
  $append += "## Azure Criterios de Aceptacion"
  if ([string]::IsNullOrWhiteSpace($ac)) {
    $append += "- Sin criterios de aceptacion en Azure."
  } else {
    $append += $ac
  }

  $append += ""
  $append += "## Azure Tasks"
  if ($taskLines.Count -eq 0) {
    $append += "- Sin tasks hijas en Azure."
  } else {
    $append += $taskLines
  }

  $newRaw = $raw.TrimEnd() + "`r`n" + ($append -join "`r`n") + "`r`n"
  Set-Content -Path $path -Value $newRaw -Encoding UTF8
  $updated++
}

Write-Output ("updated={0} missing={1}" -f $updated, $missing)
