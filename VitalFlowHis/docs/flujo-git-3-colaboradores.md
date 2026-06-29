# Flujo Git para 3 Colaboradores (Paso a Paso)

Este documento define un flujo simple y seguro para trabajar en paralelo entre 3 personas sin romper el proyecto.

## 1. Modelo de ramas

- `main`: produccion. No se toca directo.
- `develop`: integracion del equipo. No se toca directo.
- `feature/*`: trabajo de cada colaborador.
- `hotfix/*`: arreglos urgentes de produccion.

Regla base:

- Nadie hace `push` directo a `main` ni `develop`.
- Todo cambio entra por Pull Request (PR).

## 2. Roles en un equipo de 3

- Colaborador A: desarrolla features en su rama.
- Colaborador B: desarrolla features en su rama.
- Colaborador C: desarrolla features en su rama.
- Revisor de PR: cualquiera de los otros 2 que no hizo ese cambio.

Ejemplo:

- A abre PR, B revisa.
- B abre PR, C revisa.
- C abre PR, A revisa.

## 3. Primera configuracion en cada computadora (una sola vez)

### 3.1 Clonar el repositorio

```powershell
git clone https://github.com/mcasey31/VitalFlowHis.git
cd VitalFlowHis
```

### 3.2 Configurar identidad Git

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email-real@dominio.com"
```

### 3.3 Descargar ramas remotas

```powershell
git fetch --all --prune
git switch develop
git pull origin develop
```

## 4. Flujo diario por colaborador (feature branch)

Cada colaborador repite este proceso para cada tarea.

### Paso 1: actualizar base local

```powershell
git switch develop
git pull origin develop
```

### Paso 2: crear rama de trabajo

Formato recomendado:

- `feature/HU-1234-descripcion-corta`

Comando:

```powershell
git switch -c feature/HU-1234-descripcion-corta
```

### Paso 3: hacer cambios en local

- Programar.
- Probar localmente.
- Verificar que compila.

### Paso 4: revisar que archivos cambiaron

```powershell
git status
git diff
```

### Paso 5: commit

```powershell
git add .
git commit -m "HU-1234: descripcion concreta del cambio"
```

Si queres dividir en commits chicos:

```powershell
git add ruta/archivo1 ruta/archivo2
git commit -m "HU-1234: parte 1"
git add ruta/archivo3
git commit -m "HU-1234: parte 2"
```

### Paso 6: push de la rama

```powershell
git push -u origin feature/HU-1234-descripcion-corta
```

## 5. Como crear el Pull Request (PR)

Al hacer el primer push, GitHub sugiere el boton para crear PR.

Configuracion del PR:

- Base branch: `develop`
- Compare branch: `feature/HU-1234-descripcion-corta`

Titulo sugerido:

- `HU-1234 - Descripcion corta`

Descripcion sugerida:

- Que problema resuelve.
- Que archivos o modulos toca.
- Como probarlo.
- Evidencias (capturas, logs, notas).

Checklist en el PR:

- Build front OK.
- Build back OK.
- Tests OK.
- Sin secretos en codigo.
- Sin archivos generados innecesarios.

## 6. Como revisar un PR (revisor)

El revisor valida:

- No rompe funcionalidad previa.
- Codigo claro y mantenible.
- Sin cambios peligrosos en config/seguridad.
- Pruebas suficientes.

Resultado de revision:

- `Approve` si esta bien.
- `Request changes` si hay problemas.

## 7. Que hacer si hay conflictos con develop

Si el PR muestra conflictos, el autor del PR los resuelve en su rama.

### Opcion recomendada: merge de develop en feature

```powershell
git switch feature/HU-1234-descripcion-corta
git fetch origin
git merge origin/develop
```

Resolver conflictos en archivos, luego:

```powershell
git add .
git commit -m "Resuelve conflictos con develop"
git push
```

El PR se actualiza automaticamente.

## 8. Como mergear el PR

Cuando el PR tiene:

- checks en verde,
- al menos 1 aprobacion,
- y sin conflictos,

se hace merge a `develop`.

Estrategia recomendada:

- `Squash and merge` para dejar historial limpio por HU.

Despues del merge:

- borrar rama remota de feature.
- cada colaborador actualiza su `develop` local.

```powershell
git switch develop
git pull origin develop
```

## 9. Flujo completo real con 3 colaboradores

Escenario:

- A trabaja HU-100.
- B trabaja HU-101.
- C trabaja HU-102.

Secuencia:

1. A, B, C hacen `git switch develop` + `git pull`.
2. Cada uno crea su `feature/...`.
3. Cada uno desarrolla y hace push.
4. A abre PR a develop, B revisa y aprueba, A mergea.
5. B y C actualizan su rama con cambios nuevos de develop (merge de `origin/develop` en su feature) para evitar roturas.
6. B abre PR, C revisa, B mergea.
7. C repite y mergea.

Resultado: ningun colaborador pisa el trabajo del otro y `develop` se mantiene estable.

## 10. Manejo de ambientes

Separar ambientes evita que un cambio en desarrollo rompa lo productivo.

- `main` -> Produccion.
- `develop` -> Desarrollo compartido (DEV).
- `feature/*` -> Local de cada colaborador y/o preview temporal.

Recomendaciones:

- Variables sensibles en GitHub Secrets (no en archivos versionados).
- `.env.example` versionado, `.env` real no versionado.
- Base de datos distinta por ambiente (DEV, QA, PROD).

## 11. Reglas de proteccion recomendadas en GitHub

Para `main` y `develop`:

- Require pull request before merging.
- Require at least 1 approval.
- Require status checks to pass.
- Block force pushes.
- Block branch deletion.

Con esto, aunque alguien se equivoque, GitHub bloquea mergees riesgosos.

## 12. Comandos utiles de bolsillo

Actualizar todo:

```powershell
git fetch --all --prune
```

Ver ramas:

```powershell
git branch
git branch -r
```

Cambiar de rama:

```powershell
git switch develop
git switch feature/HU-1234-descripcion-corta
```

Estado rapido:

```powershell
git status
```

## 13. Politica simple para no romper nada

- PR chico y frecuente.
- 1 HU por rama.
- 1 revisor minimo.
- CI en verde obligatorio.
- Nada directo a `main` o `develop`.

Si cumplen estas 5 reglas, el trabajo colaborativo se vuelve predecible y seguro.