# Gestion Git Multiproyecto

## Pregunta clave

"Si pusheo desde Integracion, se sube todo junto aunque HIS y Portal esten en proyectos diferentes?"

## Respuesta corta

Con la configuracion actual: no.

## Estado actual

- Integracion (raiz): no tiene .git
- VitalFlowHis: tiene .git propio
- VitalFlowPortal: tiene .git propio

Consecuencia:
- No existe un push unico desde la raiz de Integracion.
- Debes pushear HIS en su repo y Portal en su repo, por separado.

## Como manejarlo bien (opciones)

## Opcion A - Mantener repos separados (simple y recomendado para equipos separados)

Flujo:
1. Cambias HIS -> commit/push en VitalFlowHis
2. Cambias Portal -> commit/push en VitalFlowPortal
3. Documentas version de integracion en docs o changelog

Pros:
- Aislamiento total de historia Git.
- Menor riesgo de mezclar cambios de dominios.

Contras:
- No hay atomicidad cross-repo en un solo commit.

## Opcion B - Crear repo "meta" de Integracion con submodules (recomendado para control central)

Idea:
- Inicializas Git en la raiz de Integracion.
- Agregas HIS y Portal como submodules.
- El repo meta guarda punteros (commits) de cada subrepo.

Resultado:
- Un push en Integracion actualiza los punteros de version (no copia el codigo de los subrepos).
- Cada subrepo sigue teniendo su propio push real.

Pros:
- Control central desde raiz.
- Versionado coordinado de integracion (que commit de HIS + que commit de Portal combinan bien).

Contras:
- Requiere disciplina con submodules.

## Opcion C - Monorepo real (todo en un solo Git)

Idea:
- Quitar repos internos y mover HIS + Portal al mismo repo raiz.

Pros:
- Un solo commit y un solo push para todo.
- Cambios atomicos cross-sistema.

Contras:
- Pierdes separacion historica de repos.
- Mayor impacto organizativo.

## Recomendacion para tu caso

Como quieres controlar todo desde aca pero mantener sistemas distintos:
- Usa Opcion B (repo meta + submodules).

Asi:
- Operas todo desde la raiz (scripts, docker, docs, release notes).
- Mantienes HIS y Portal desacoplados en sus repos.
- Versionas la integracion como combinacion de commits de ambos.

## Gestion diaria desde la raiz (sin entrar a subcarpetas)

Script:
- scripts/git-manage.ps1

Ejemplos:

1. Ver estado de ambos repos
- .\scripts\git-manage.ps1 status all

2. Ver ramas y tracking
- .\scripts\git-manage.ps1 branch all

3. Actualizar referencias remotas
- .\scripts\git-manage.ps1 fetch all

4. Traer cambios remotos en ambos repos
- .\scripts\git-manage.ps1 pull all

5. Subir cambios de ambos repos
- .\scripts\git-manage.ps1 push all

6. Operar solo HIS o solo Portal
- .\scripts\git-manage.ps1 status his
- .\scripts\git-manage.ps1 push portal

## Push seguro recomendado

Comandos nuevos:

1. Validacion previa en ambos repos
- .\scripts\git-manage.ps1 preflight all

El preflight valida:
- arbol limpio (sin cambios sin commit)
- upstream configurado
- sin commits pendientes de pull (behind)

2. Push seguro automatico
- .\scripts\git-manage.ps1 push-safe all

Comportamiento:
- si algun repo falla preflight, corta con error y no pushea
- si un repo no tiene commits nuevos (ahead=0), lo informa y no empuja
- solo hace push en los repos que estan listos y con cambios

## Checklist de trabajo diario

1. Definir en que sistema haces cambios (HIS, Portal o ambos)
2. Hacer commits en el repo correspondiente
3. Validar integracion desde raiz con docker-manage.ps1
4. Si usas repo meta con submodules: actualizar punteros y pushear repo raiz
5. Registrar cambios en docs/integracion-operativa
