# 🚀 CI/CD MVP Strategy - Automatización Sin Costo

**Última actualización:** 2026-07-01  
**Status:** ✅ Active  
**Costo:** $0 (Docker + GitHub Actions free tier)

---

## 📋 Esquema General

```
Feature Branch → Dev Branch → QA Branch → Main Branch
                    ↓             ↓            ↓
                  DOCKER        DOCKER      DOCKER + VERCEL (PROD)
                   only          only       
              (Team local)    (Team local)   (Public)
```

---

## 🎯 Estrategia por Rama

### 1️⃣ **DEV Branch** (`dev`)

**Trigger:** `git push origin dev` o merge PR a dev

**Pipeline:**
```
Docker Build & Push to GHCR
    ↓
3 images with :dev tags
    ↓
Team pulls images locally
    ↓
docker-compose up -d
    ↓
All devs see SAME code
```

**URLs:**
- GitHub Actions: https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/actions?query=branch:dev
- Docker Registry: `ghcr.io/mcasey31/his-int-portal_vital_flow/*:dev`

**Costo:** $0 (free Docker build)

**Tiempo:** ~4-5 minutos

---

### 2️⃣ **QA Branch** (`qa`)

**Trigger:** `git push origin qa` o merge PR a qa

**Pipeline:**
```
Docker Build & Push to GHCR
    ↓
3 images with :qa tags
    ↓
Team pulls images locally
    ↓
QA testing on Docker
```

**URLs:**
- GitHub Actions: https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/actions?query=branch:qa
- Docker Registry: `ghcr.io/mcasey31/his-int-portal_vital_flow/*:qa`

**Costo:** $0 (free Docker build)

**Tiempo:** ~4-5 minutos

---

### 3️⃣ **MAIN Branch** (`main`)

**Trigger:** `git push origin main` (or merge after PR approval)

**Pipeline:**
```
Docker Build & Push to GHCR
    ↓
3 images with :latest tags
    ↓
VERCEL DEPLOY (PRODUCTION)
    ↓
HIS Frontend: https://vitalflow-his-front.vercel.app
Portal Frontend: https://vitalflow.vercel.app
```

**URLs:**
- GitHub Actions: https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/actions?query=branch:main
- Docker Registry: `ghcr.io/mcasey31/his-int-portal_vital_flow/*:latest`
- HIS Frontend: https://vitalflow-his-front.vercel.app (production)
- Portal Frontend: https://vitalflow.vercel.app (production)

**Costo:** $0 (Vercel free tier, single account)

**Tiempo:** ~4-5 min Docker + ~2 min Vercel = ~6-7 minutos total

---

## 🔄 Developer Workflow (Día a Día)

### Para ver cambios en DEV:

```powershell
# 1. Feature branch → Commit → Push
git checkout -b feature/my-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature

# 2. Create PR, get review, merge to dev
# (GitHub Actions auto-runs when merged)

# 3. Wait ~5 minutes for Docker build

# 4. Pull latest images
docker pull ghcr.io/mcasey31/his-int-portal_vital_flow/his-backend:dev
docker pull ghcr.io/mcasey31/his-int-portal_vital_flow/his-frontend:dev
docker pull ghcr.io/mcasey31/his-int-portal_vital_flow/portal-backend:dev

# 5. Rebuild & restart
./scripts/docker-manage.ps1 rebuild integration all

# 6. ✅ See changes on localhost
```

### Para ver cambios en QA:

Same as DEV but:
- Merge to `qa` branch
- Pull `:qa` tags instead of `:dev`

### Para desplegar a PRODUCCIÓN:

```
1. All dev complete
2. Create PR from dev → main
3. Review thoroughly ⚠️ (PRODUCTION!)
4. Merge to main
5. Wait ~6-7 minutes
6. Check https://vitalflow.vercel.app (live)
```

---

## 📦 Docker Images

Alojadas en **GitHub Container Registry (GHCR)**

### Registro Base:
```
ghcr.io/mcasey31/his-int-portal_vital_flow/
```

### Imágenes:

**HIS Backend**
- Dev: `his-backend:dev` or `his-backend:dev-{commit-sha}`
- Prod: `his-backend:latest`
- Source: `VitalFlowHis/back/src/VitalFlow.His.Api/Dockerfile`

**HIS Frontend**
- Dev: `his-frontend:dev` or `his-frontend:dev-{commit-sha}`
- Prod: `his-frontend:latest`
- Source: `VitalFlowHis/front/Dockerfile`

**Portal Backend**
- Dev: `portal-backend:dev` or `portal-backend:dev-{commit-sha}`
- Prod: `portal-backend:latest`
- Source: `VitalFlowPortal/Dockerfile.backend`

### Pull Ejemplo:
```bash
docker pull ghcr.io/mcasey31/his-int-portal_vital_flow/his-frontend:dev
```

---

## 🔐 GitHub Secrets Necesarios

| Secret | Valor | Para |
|--------|-------|------|
| `GITHUB_TOKEN` | Auto (GitHub) | GHCR authentication |
| `VERCEL_TOKEN` | tu-token-vercel | Vercel deploy main |
| `VERCEL_ORG_ID` | team_7EfQjf3hFhTic6THfPxLoqVM | Vercel org |
| `VERCEL_HIS_FRONTEND_PROJECT_ID` | prj_SVA6zY5OpkCDrzqQmW7CnhtSJmsx | HIS Frontend project |
| `VERCEL_PORTAL_FRONTEND_PROJECT_ID` | prj_oFTRtJGBnBvMmMwIzhsjNM4ZQR8v | Portal Frontend project |

**Nota:** Solo el acceso a main está configurado con estos secrets. Dev/QA no tiene Vercel deploy.

---

## 📊 Workflows Configurados

### `.github/workflows/deploy-dev.yml`
- **Trigger:** Push a `dev`
- **Jobs:** Build Docker + Notify
- **Duration:** ~5 minutos
- **Output:** GHCR images `:dev` tags

### `.github/workflows/deploy-qa.yml`
- **Trigger:** Push a `qa`
- **Jobs:** Build Docker + Notify
- **Duration:** ~5 minutos
- **Output:** GHCR images `:qa` tags

### `.github/workflows/deploy-main.yml`
- **Trigger:** Push a `main`
- **Jobs:** Build Docker + Vercel Deploy + Notify
- **Duration:** ~6-7 minutos
- **Output:** GHCR images `:latest` + Live on Vercel

---

## ✅ Validación del Pipeline

### Ver que Docker build completó:

**GitHub Actions:**
https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/actions?query=branch:dev

Busca el workflow más reciente → debería mostrar:
```
✅ Build & Push Docker Images (completado)
✅ Notify Deployment (completado)
```

### Confirmar que imágenes están en GHCR:

https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/pkgs/container/his-int-portal_vital_flow%2Fhis-backend/versions

Debería ver:
- Última imagen con tag `:dev` (o `:qa` o `:latest`)
- Timestamp reciente

### Para main: Verificar Vercel deploy

https://vitalflow.vercel.app (Portal Frontend)
https://vitalflow-his-front.vercel.app (HIS Frontend)

---

## 🛠️ Troubleshooting

### Docker build failed en GitHub Actions

1. Check workflow logs: https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/actions
2. Click latest failed run → see error
3. Usually: Dockerfile syntax or missing files
4. Fix locally, push to trigger new build

### Images no aparecen en GHCR

1. Check GITHUB_TOKEN secret (auto-generated, should be OK)
2. Check workflow succeeded
3. Try manual pull: `docker pull ghcr.io/mcasey31/his-int-portal_vital_flow/his-backend:dev`

### Vercel deploy bloqueado en main

1. Check if VERCEL_TOKEN is still valid
2. Check VERCEL_ORG_ID correct
3. Check project IDs in GitHub secrets match Vercel projects
4. Vercel may require approval for new deployment

---

## 💡 Why This Strategy?

**Docker (free) for Dev/QA:**
- Team sees SAME code
- No Vercel pricing limits
- Local testing before prod
- Infinite collaborators (no Vercel limit)

**Vercel (free tier) for Main:**
- Production UI visible
- CDN + Edge functions included
- Only one account (MARTO) deploys
- No team collaboration fees

**Cost:** $0/month (MVP)

---

## 📚 Related Files

- `.github/workflows/deploy-dev.yml` - Dev pipeline
- `.github/workflows/deploy-qa.yml` - QA pipeline
- `.github/workflows/deploy-main.yml` - Production pipeline
- `docker-compose.yml` - Local dev environment
- `VitalFlowHis/front/vercel.json` - HIS Frontend config
- `VitalFlowPortal/vercel.json` - Portal Frontend config

---

## 🎓 Quick Reference

| Action | Command | Time | Result |
|--------|---------|------|--------|
| Push to dev | `git push origin dev` | 5 min | Images at GHCR `:dev` |
| Pull latest dev | `docker pull ghcr.io/.../his-backend:dev` | 1-2 min | Docker image ready |
| Rebuild local | `./scripts/docker-manage.ps1 rebuild` | 2-3 min | All services running |
| Deploy to prod | `git push origin main` | 6-7 min | Live on Vercel + GHCR |

---

**Questions?** Check GitHub Actions logs or ask the team!
