$lines = Get-Content "C:\xampp\htdocs\his\practicasMedicas.txt" -Encoding UTF8
$pageNumbers = @(242, 488, 734, 980, 1226, 1472, 1718, 1964, 2208, 2454, 2700, 2946, 3191, 3419, 3665, 3911, 4157, 4401, 4541)

function Is-Noise($text) {
    if (-not $text) { return $true }
    $t = $text.Trim()
    if (-not $t) { return $true }
    if ($t -match "^\d+/\d+$") { return $true }
    if ($t -eq "Permitida" -or $t -eq "NO Permitida") { return $true }
    if ($t -eq "Abreviaturas Permitidas") { return $true }
    if ($t -eq "ABREVIATURA" -or $t -eq "DEFINICION" -or $t -eq "TIPO JOINT") { return $true }
    if ($t -match "^(Para )?BUSCAR") { return $true }
    if ($t -match "^[a-c]\. presione") { return $true }
    if ($t -match "^[a-c]\. aparecer") { return $true }
    if ($t -match "^[a-c]\. escriba") { return $true }
    if ($t -match "^Glosario de Abreviaturas") { return $true }
    if ($t -match "^Abreviaturas Permitidas$") { return $true }
    return $false
}

$pairs = @()
$prevBound = -1
$pageIdx = 0

foreach ($bound in $pageNumbers) {
    $pageIdx++
    $start = $prevBound + 1
    $end = $bound - 1

    # Collect label count first
    $labelCount = 0
    for ($i = $start; $i -le $end; $i++) {
        $t = $lines[$i]
        if (-not $t) { continue }
        $t = $t.Trim()
        if (($t -eq "Permitida") -or ($t -eq "NO Permitida")) { $labelCount++ }
    }

    if ($labelCount -eq 0) { 
        $prevBound = $bound
        continue 
    }

    # Collect data lines (non-noise)
    $dataLines = @()
    for ($i = $start; $i -le $end; $i++) {
        if (-not (Is-Noise $lines[$i])) {
            $dataLines += $lines[$i].Trim()
        }
    }

    # First N = abbreviations, next N = definitions
    if ($dataLines.Count -lt ($labelCount * 2)) {
        Write-Host "WARNING page ${pageIdx}: expected $($labelCount*2) data lines, got $($dataLines.Count). Skipping last entries."
    }
    
    $abbrevs = $dataLines[0..($labelCount-1)]
    $defs = $dataLines[$labelCount..($labelCount*2-1)]

    for ($j = 0; $j -lt $abbrevs.Count -and $j -lt $defs.Count; $j++) {
        if ($abbrevs[$j] -and $defs[$j] -and $abbrevs[$j].Trim() -and $defs[$j].Trim()) {
            $pairs += ,@($abbrevs[$j].Trim(), $defs[$j].Trim())
        }
    }

    $prevBound = $bound
}

Write-Host "Total pairs extracted: $($pairs.Count)"

# Generate SQL
$sql = @"
-- Migration: Import practicas from glossary PDF
INSERT INTO sch_agenda.practica (id, servicio_id, nombre, duracion_minutos_sugerida, codigo_clinico, activa)
VALUES
"@

$values = @()
$seen = @{}
$dups = 0
foreach ($pair in $pairs) {
    $abbrev = $pair[0]
    $def = $pair[1]
    $key = $abbrev.Trim().ToUpper()
    if ($seen.ContainsKey($key)) { $dups++; continue }
    $seen[$key] = $true

    $abbrevEscaped = $abbrev -replace "'", "''"
    $defEscaped = $def -replace "'", "''"

    $guid = [Guid]::NewGuid().ToString()
    $values += "    ('$guid', '00000000-0000-0000-0000-000000000101', '$defEscaped', NULL, '$abbrevEscaped', true)"
}

$sql += $values -join ",`n"
$sql += ";"

Write-Host "Unique pairs: $($seen.Count)"
Write-Host "Duplicates skipped: $dups"

$sql | Out-File -FilePath "C:\xampp\htdocs\his\db\migrations\039_feature_import_practicas_glosario.sql" -Encoding utf8
Write-Host "Written to db\migrations\039_feature_import_practicas_glosario.sql"
