# 🚀 CI/CD Automation Workflow

## Overview

Automated deployment pipeline que se ejecuta automáticamente cada vez que mergeamos cambios a las ramas `dev`, `qa`, y `main`.

**Objetivo:** Garantizar que todos los cambios se desplieguen inmediatamente en los ambientes correspondientes sin intervención manual.

---

## 📋 Flujo de Trabajo

### 1️⃣ Local Developer Flow

```
Developer
  ↓
  Creates feature branch
  ↓
  Commits changes
  ↓
  Push to remote
  ↓
  Create Pull Request to dev
  ↓
  Team reviews + approves
  ↓
  MERGE to dev  ← 🚀 TRIGGER AUTOMÁTICO
```

### 2️⃣ Automated CI/CD Pipeline (al mergearse en dev)

```
TRIGGER: Push a dev branch
  ↓
┌─────────────────────────────────────────┐
│ 🔨 Build & Push Docker Images           │
│ Duration: ~4-5 minutos                  │
├─────────────────────────────────────────┤
│ ✅ Build HIS Backend Dockerfile         │
│ ✅ Build HIS Frontend Dockerfile        │
│ ✅ Build Portal Backend Dockerfile      │
│ ✅ Push to GHCR (GitHub Container Reg)  │
│ ✅ Tag: :dev, :dev-{SHA}, :latest       │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 🌐 Deploy Vercel Frontends              │
│ Duration: ~1-2 minutos                  │
├─────────────────────────────────────────┤
│ ✅ Install Vercel CLI                   │
│ ✅ Deploy HIS Frontend                  │
│    → vitalflow-his-front-dev.vercel.app │
│ ✅ Deploy Portal Frontend               │
│    → vitalflow-dev.vercel.app           │
│ ✅ Set PROD environment                 │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ 📢 Notify Deployment Status             │
│ Duration: ~1-2 segundos                 │
├─────────────────────────────────────────┤
│ ✅ Log deployment success               │
│ ✅ Show URLs for team validation        │
└─────────────────────────────────────────┘
```

**Total time:** ~7-8 minutos desde merge a live

---

## 🔧 Workflows Configurados

### `.github/workflows/deploy-dev.yml`

**Trigger:** Push a rama `dev`

**Jobs:**
1. **build-and-push**: Construye 3 imágenes Docker, pushea a GHCR
2. **deploy-vercel-dev**: Deploy Vercel CLI a ambos frontends
3. **notify**: Notifica resultado

**Ambientes de destino:**
- HIS Frontend: `vitalflow-his-front-dev.vercel.app`
- Portal Frontend: `vitalflow-dev.vercel.app`

---

### `.github/workflows/deploy-qa.yml`

**Trigger:** Push a rama `qa`

**Similar a deploy-dev pero:**
- Usa tags Docker `:qa`
- Deploy a proyecto Vercel QA
- Ambiente intermedio para QA testing

---

### `.github/workflows/deploy-main.yml`

**Trigger:** Push a rama `main`

**Similar a deploy-dev pero:**
- Usa tags Docker `:latest`
- Deploy a proyecto Vercel PRODUCTION
- ⚠️ **PRODUCCIÓN** - usar con cuidado

---

## 📦 Docker Images

Todas las imágenes están alojadas en **GitHub Container Registry (GHCR)**:

```
ghcr.io/mcasey31/his-int-portal_vital_flow/

├── his-backend
│   ├── :dev              (última build dev)
│   ├── :dev-{SHA}        (build específica)
│   └── :latest           (última main)
│
├── his-frontend
│   ├── :dev
│   ├── :dev-{SHA}
│   └── :latest
│
└── portal-backend
    ├── :dev
    ├── :dev-{SHA}
    └── :latest
```

**Documentación:** Cada imagen incluye su Dockerfile original en el repo:
- `VitalFlowHis/back/src/VitalFlow.His.Api/Dockerfile`
- `VitalFlowHis/front/Dockerfile`
- `VitalFlowPortal/Dockerfile.backend`

---

## 🔐 Secrets Configurados en GitHub

Necesarios para que funcione la automatización:

| Secret | Descripción |
|--------|------------|
| `GITHUB_TOKEN` | Auto-creado por GH Actions (GHCR auth) |
| `VERCEL_TOKEN` | Token personal de Vercel (CLI auth) |
| `VERCEL_ORG_ID` | Team ID de Vercel |
| `VERCEL_HIS_FRONTEND_PROJECT_ID` | Project ID HIS Frontend |
| `VERCEL_PORTAL_FRONTEND_PROJECT_ID` | Project ID Portal Frontend |
| `VERCEL_HIS_FRONTEND_QA_PROJECT_ID` | Project ID HIS Frontend QA |
| `VERCEL_PORTAL_FRONTEND_QA_PROJECT_ID` | Project ID Portal Frontend QA |
| `VERCEL_HIS_FRONTEND_MAIN_PROJECT_ID` | Project ID HIS Frontend PROD |
| `VERCEL_PORTAL_FRONTEND_MAIN_PROJECT_ID` | Project ID Portal Frontend PROD |

**Para agregar/revisar:** Settings → Secrets and variables → Actions

---

## 🎯 Cómo Usar

### Para Developers

#### 1. Crear cambio local

```bash
# Crear rama desde dev
git checkout -b feature/my-feature dev

# Hacer cambios
# ...

# Commit
git commit -m "feat: description"
git push origin feature/my-feature
```

#### 2. Crear PR a dev

En GitHub:
1. Ir a Pull Requests
2. Crear nuevo PR: `feature/my-feature` → `dev`
3. Describir cambios
4. Esperar a que team revise

#### 3. Merge a dev (después de aprobación)

**Opción A:** Merge desde GitHub UI
- Click "Merge pull request"
- GitHub Actions **automáticamente** inicia deploy

**Opción B:** Merge desde CLI
```bash
git checkout dev
git merge feature/my-feature
git push origin dev  ← Esto dispara Actions
```

#### 4. Validar en Vercel

Una vez que el workflow completa (~7-8 min):
- HIS Frontend: https://vitalflow-his-front-dev.vercel.app
- Portal Frontend: https://vitalflow-dev.vercel.app

**Todos ven los cambios simultáneamente** ✅

---

### Para DevOps / Maintenance

#### Ver logs del workflow

```bash
# Option 1: GitHub CLI
gh run list --repo mcasey31/HIS-INT-PORTAL_VITAL_FLOW

# Option 2: GitHub Web UI
https://github.com/mcasey31/HIS-INT-PORTAL_VITAL_FLOW/actions
```

#### Re-ejecutar workflow fallido

```bash
gh run rerun {run-id}
```

#### Ver logs específicos de un job

GitHub Web UI → Actions → Select Run → Select Job → View logs

#### Triggerar deploy manual (si necesario)

```bash
git push origin dev  # Triggerea deploy-dev.yml
git push origin qa   # Triggerea deploy-qa.yml
git push origin main # Triggerea deploy-main.yml
```

---

## ⚠️ Limitaciones Conocidas

### Railways Backends (No automático aún)

Los backends de HIS y Portal no se despliegan automáticamente. Se comentó la sección Railway en los workflows.

**Para activar:**
1. Agregar `RAILWAY_TOKEN` a GitHub Secrets
2. Agregar `RAILWAY_PROJECT_ID`
3. Descomentar la sección `deploy-railway-*` en los workflows
4. Push para test

### Node.js Deprecation Warning

Los workflows muestran advertencia sobre Node.js 20 siendo deprecated. Esto es solo una advertencia, no bloquea el deployment.

---

## 🐛 Troubleshooting

### Run falló con "Input required: vercel-token"

**Causa:** Token de Vercel no configurado en secrets
**Solución:** Verificar que `VERCEL_TOKEN` esté en GitHub Secrets

### Run falló con Docker build error

**Causa:** Dockerfile no encontrado o contexto inválido
**Solución:** Verificar que los paths en el workflow coincidan con los Dockerfiles reales

### Cambios no aparecen en Vercel después de deploy

**Causa:** Vercel cache o build issues
**Solución:**
1. Esperar 2-3 minutos para que Vercel rebuild
2. Hard refresh del browser (Ctrl+Shift+R)
3. Revisar logs en Vercel dashboard

### GHCR push rechaza imagen (uppercase error)

**Causa:** Nombres de imagen deben ser lowercase
**Solución:** Asegurar que el nombre de la imagen siempre sea lowercase (ya configurado)

---

## 📊 Status del Proyecto

| Component | Status | Notas |
|-----------|--------|-------|
| Docker Builds | ✅ Working | Todos los builds exitosos |
| Vercel Deploy CLI | ✅ Working | Usando vercel CLI v42.3.0+ |
| HIS Frontend Deploy | ✅ Working | vitalflow-his-front-dev.vercel.app |
| Portal Frontend Deploy | ✅ Working | vitalflow-dev.vercel.app |
| Railway Backend Deploy | ⏳ Commented | Configurar cuando se necesite |

---

## 📝 Commits Relacionados

- `f67238a`: Primer intento con vercel/action@main (falló - action no existe)
- `bb78ba4`: Cambio a amondnet/vercel-action@v42.3.0 (falló - input token issue)
- `cc1bb52`: Cambio definitivo a Vercel CLI directo (✅ WORKING)

---

## 🎓 Referencias

- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

## 🤝 Support

Para preguntas o issues con el CI/CD:
1. Revisar logs en GitHub Actions
2. Consultar esta documentación
3. Contactar a MARTO o DevOps team

**Última actualización:** 2026-07-01

