# Guia de control de versiones: dev, qa, main y ramas personales

## 1) Objetivo
Esta guia define como trabajar con ramas personales y como integrar cambios sin romper la rama `dev`.

## 2) Estructura de ramas
- `main`: version estable para produccion.
- `qa`: rama de validacion funcional.
- `dev`: rama de integracion continua del equipo.
- Ramas personales por colaborador: por ejemplo `marto`, `ana`, `juan`.
- Ramas de trabajo cortas (sobre rama personal): por ejemplo `marto/HU-14929-filtro-admision`.

## 3) Regla de oro
- No hacer push directo a `dev`, `qa` o `main`.
- Todo cambio entra por Pull Request (PR).
- Si los checks no pasan, no se mergea.

## 4) Flujo recomendado (dia a dia)
1. Actualizar `dev` local:
   - `git checkout dev`
   - `git pull origin dev`
2. Actualizar rama personal desde `dev`:
   - `git checkout marto`
   - `git merge dev`
3. Crear rama de trabajo desde rama personal:
   - `git checkout -b marto/HU-xxxx-descripcion-corta`
4. Desarrollar, commitear y pushear:
   - `git add .`
   - `git commit -m "HU-xxxx: descripcion"`
   - `git push -u origin marto/HU-xxxx-descripcion-corta`
5. Abrir PR hacia `dev`.
6. Esperar checks + review.
7. Merge con `Squash and merge`.
8. Borrar rama de trabajo (local y remota).

## 5) Requisitos minimos para merge a dev
- Build backend OK.
- Build frontend OK.
- Lint/format OK.
- Tests unitarios OK.
- Smoke test funcional OK.
- Al menos 1 aprobacion de otro colaborador.
- Rama actualizada con `dev` (sin conflictos pendientes).

## 6) Como evitar que dev se rompa
- PR chicos y tematicos (un problema por PR).
- No mezclar refactors grandes con cambios funcionales.
- Resolver conflictos en la rama del autor antes del merge.
- Si un merge rompe `dev`, hacer `Revert` inmediato del PR.
- Nunca hacer hotfix directo en `dev` sin PR.

## 7) Promocion entre niveles
1. Personal -> `dev`:
   - Integracion continua de features.
2. `dev` -> `qa`:
   - Corte de version para validacion QA (por sprint o por lote).
3. `qa` -> `main`:
   - Solo con aprobacion funcional completa.

## 8) Proteccion de ramas (GitHub)
Configurar en GitHub para `dev`, `qa`, `main`:
- Require a pull request before merging.
- Require approvals (minimo 1).
- Require status checks to pass.
- Require branches to be up to date before merging.
- Dismiss stale approvals when new commits are pushed.
- Block force pushes.
- Block branch deletion.

## 9) Convencion de nombres
- Rama personal: `nombre` (ejemplo `marto`).
- Rama de trabajo: `nombre/HU-####-descripcion-corta`.
- Commits: `HU-####: accion concreta`.
- PR title: `[HU-####] resumen corto`.

## 10) Checklist rapido antes de crear PR
- [ ] Mi rama fue actualizada con `dev`.
- [ ] No quedan conflictos.
- [ ] Build local exitoso.
- [ ] Tests relevantes ejecutados.
- [ ] Cambios acotados al objetivo de la HU.
- [ ] Describi impacto y plan de rollback en la descripcion del PR.

## 11) Comandos utiles
### Crear ramas base (ya creadas)
- `git checkout -b dev`
- `git push -u origin dev`
- `git checkout -b qa`
- `git push -u origin qa`

### Crear rama personal
- `git checkout dev`
- `git pull origin dev`
- `git checkout -b marto`
- `git push -u origin marto`

### Mantener rama personal al dia
- `git checkout dev`
- `git pull origin dev`
- `git checkout marto`
- `git merge dev`

## 12) Politica de rollback
- Si falla algo en `dev` despues de merge:
  1. Revert del PR en GitHub.
  2. Verificar pipeline en verde.
  3. Corregir en nueva rama y reabrir PR.

## 13) Responsabilidades del equipo
- Autor del PR: calidad tecnica y funcional del cambio.
- Reviewer: validar impacto, riesgos y regresiones.
- Integrador (rotativo): cuidar estabilidad de `dev` y coordinar cortes a `qa`.

---
Ultima actualizacion: 2026-06-28
