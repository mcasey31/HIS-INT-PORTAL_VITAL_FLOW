# Rollback Runbook (main + Vercel)

Este flujo crea un punto de rollback antes de promover a `main` y antes de publicar en Vercel.

## 1) Crear punto de rollback

Ejecutar desde el root del repo:

```powershell
./scripts/release/create-rollback-point.ps1 -CreateTag -PushTag
```

Salida esperada:
- Archivo JSON en `scripts/release/rollback-points/`.
- Hash actual de `origin/main`.
- Deployment URL actualmente activo en alias de Vercel (`his-prod-smoky`).
- Tag de respaldo remoto (`rollback/main-YYYYMMDD-HHMMSS`).

## 2) Promocion normal

1. PR a `dev`.
2. Validaciones QA.
3. Promocion `qa -> main`.
4. Deploy a Vercel.

## 3) Rollback rapido si algo falla

Preview (sin cambios):

```powershell
./scripts/release/rollback-from-point.ps1 -PointFile ./scripts/release/rollback-points/<archivo>.json -WhatIf
```

Rollback efectivo (main + Vercel):

```powershell
./scripts/release/rollback-from-point.ps1 -PointFile ./scripts/release/rollback-points/<archivo>.json -Yes
```

Rollback solo `main`:

```powershell
./scripts/release/rollback-from-point.ps1 -PointFile ./scripts/release/rollback-points/<archivo>.json -RollbackMain -Yes
```

Rollback solo Vercel:

```powershell
./scripts/release/rollback-from-point.ps1 -PointFile ./scripts/release/rollback-points/<archivo>.json -RollbackVercel -Yes
```

## Notas

- `rollback-from-point.ps1` usa `git push --force-with-lease` sobre `main`; usar solo en incidente.
- Vercel rollback restaura el deployment guardado en el punto JSON.
- Recomendado: luego del rollback, correr `vercel-postdeploy-smoke.ps1` para confirmar estabilidad.
