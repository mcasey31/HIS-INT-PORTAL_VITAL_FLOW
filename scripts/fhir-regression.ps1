$ErrorActionPreference = "Stop"

Write-Host "[fhir-regression] Starting..."

$newPass = "admin"
$bytes = New-Object byte[] 16
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$rng.GetBytes($bytes)
$saltB64 = [Convert]::ToBase64String($bytes)
$iter = 100000
$derive = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($newPass, $bytes, $iter, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
$hashBytes = $derive.GetBytes(32)
$hashB64 = [Convert]::ToBase64String($hashBytes)
$pwdHash = [string]::Join('$', @('pbkdf2-sha256', $iter, $saltB64, $hashB64))

docker exec -i vitalflow_postgres psql -U vitalflow_user -d vitalflow_his -c "update sch_seguridad.usuario_sistema set password_hash='$pwdHash', estado='ACTIVO', updated_at=now() where username='admin';" | Out-Null

$loginBody = @{ username = "admin"; password = $newPass } | ConvertTo-Json
$login = Invoke-RestMethod -UseBasicParsing -Method Post -Uri "http://localhost:3011/api/v1/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.accessToken
$auth = @{ Authorization = "Bearer $token" }

$schedules = Invoke-RestMethod -UseBasicParsing -Method Get -Uri "http://localhost:3011/fhir/R4/Schedule?_count=1" -Headers $auth
$scheduleId = $schedules.entry[0].resource.id

$slotsFreeUri = "http://localhost:3011/fhir/R4/Slot?schedule=Schedule/$scheduleId&status=free&_count=1"
$slots = Invoke-RestMethod -UseBasicParsing -Method Get -Uri $slotsFreeUri -Headers $auth
$slotId = $slots.entry[0].resource.id

$location = Invoke-RestMethod -UseBasicParsing -Method Get -Uri "http://localhost:3011/fhir/R4/Location?_count=1" -Headers $auth

$idem = [guid]::NewGuid().ToString()
$createBody = @{
  resourceType = "Appointment"
  slot = @(@{ reference = "Slot/$slotId" })
  participant = @(@{ actor = @{ reference = "Patient/REGRESSION" }; status = "accepted" })
  reasonCode = @(@{ text = "Regression script" })
} | ConvertTo-Json -Depth 10

$rCreate = Invoke-WebRequest -UseBasicParsing -Method Post -Uri "http://localhost:3011/fhir/R4/Appointment" -Headers @{ Authorization = "Bearer $token"; "Idempotency-Key" = $idem; "Correlation-Id" = ([guid]::NewGuid().ToString()) } -ContentType "application/json" -Body $createBody
$created = $rCreate.Content | ConvertFrom-Json

$rReplay = Invoke-WebRequest -UseBasicParsing -Method Post -Uri "http://localhost:3011/fhir/R4/Appointment" -Headers @{ Authorization = "Bearer $token"; "Idempotency-Key" = $idem; "Correlation-Id" = ([guid]::NewGuid().ToString()) } -ContentType "application/json" -Body $createBody
$replay = $rReplay.Content | ConvertFrom-Json

$getById = Invoke-RestMethod -UseBasicParsing -Method Get -Uri "http://localhost:3011/fhir/R4/Appointment/$($created.id)" -Headers $auth
$searchByPatient = Invoke-RestMethod -UseBasicParsing -Method Get -Uri "http://localhost:3011/fhir/R4/Appointment?patient=Patient/REGRESSION&_count=5" -Headers $auth

function Invoke-ExpectedFailure($scriptBlock) {
  try {
    & $scriptBlock | Out-Null
    return 200
  } catch {
    if ($_.Exception.Response) {
      return [int]$_.Exception.Response.StatusCode.value__
    }
    throw
  }
}

$status404 = Invoke-ExpectedFailure { Invoke-WebRequest -UseBasicParsing -Method Post -Uri "http://localhost:3011/fhir/R4/Appointment" -Headers @{ Authorization = "Bearer $token"; "Idempotency-Key" = ([guid]::NewGuid().ToString()); "Correlation-Id" = ([guid]::NewGuid().ToString()) } -ContentType "application/json" -Body (@{ resourceType="Appointment"; slot=@(@{reference="Slot/11111111-1111-1111-1111-111111111111"}); participant=@(@{ actor=@{reference="Patient/404"}; status="accepted" }) } | ConvertTo-Json -Depth 10) }
$status409 = Invoke-ExpectedFailure { Invoke-WebRequest -UseBasicParsing -Method Post -Uri "http://localhost:3011/fhir/R4/Appointment" -Headers @{ Authorization = "Bearer $token"; "Idempotency-Key" = ([guid]::NewGuid().ToString()); "Correlation-Id" = ([guid]::NewGuid().ToString()) } -ContentType "application/json" -Body $createBody }
$status422 = Invoke-ExpectedFailure { Invoke-WebRequest -UseBasicParsing -Method Post -Uri "http://localhost:3011/fhir/R4/Appointment" -Headers @{ Authorization = "Bearer $token"; "Idempotency-Key" = ([guid]::NewGuid().ToString()); "Correlation-Id" = ([guid]::NewGuid().ToString()) } -ContentType "application/json" -Body (@{ resourceType="Appointment"; slot=@(@{reference="Slot/$slotId"}); participant=@(@{ actor=@{reference="PractitionerRole/abc"}; status="accepted" }) } | ConvertTo-Json -Depth 10) }

"REG_LOGIN_USER=$($login.username)"
"REG_SCHEDULE_ID=$scheduleId"
"REG_SLOT_ID=$slotId"
"REG_LOCATION_TOTAL=$($location.total)"
"REG_CREATE_STATUS=$($rCreate.StatusCode)"
"REG_REPLAY_STATUS=$($rReplay.StatusCode)"
"REG_CREATED_ID=$($created.id)"
"REG_REPLAY_ID=$($replay.id)"
"REG_GET_BY_ID=$($getById.id)"
"REG_SEARCH_TOTAL=$($searchByPatient.total)"
"REG_404=$status404"
"REG_409=$status409"
"REG_422=$status422"
Write-Host "[fhir-regression] Done."
