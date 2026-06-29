# Configuracion GitHub: Proteccion de Ramas (Paso 1)

Este instructivo configura `main` y `develop` para que nadie pueda romper el proyecto por error.

## Requisito previo

- Tener permisos de administrador en el repo.

## 1. Entrar a reglas de ramas

1. Ir al repo en GitHub.
2. Click en `Settings`.
3. En menu izquierdo, abrir `Branches`.
4. En `Branch protection rules`, click en `Add rule`.

## 2. Regla para main

En `Branch name pattern` escribir:

- `main`

Activar estas opciones:

- `Require a pull request before merging`
- `Require approvals` = 1 como minimo
- `Dismiss stale pull request approvals when new commits are pushed`
- `Require status checks to pass before merging`
- `Require branches to be up to date before merging`
- `Do not allow bypassing the above settings`
- `Restrict who can push to matching branches` (opcional, recomendado)
- `Allow force pushes` = desactivado
- `Allow deletions` = desactivado

En `Status checks that are required`, seleccionar:

- `Frontend Build`
- `Backend Build and Tests`

Guardar con `Create` o `Save changes`.

## 3. Regla para develop

Crear otra regla con `Add rule`.

En `Branch name pattern` escribir:

- `develop`

Activar las mismas opciones que en `main`.

En `Status checks that are required`, seleccionar:

- `Frontend Build`
- `Backend Build and Tests`

Guardar cambios.

## 4. Verificacion final

1. Crear una rama feature.
2. Abrir PR contra `develop`.
3. Confirmar que GitHub exige:
   - checks en verde,
   - aprobacion,
   - y bloquea push directo a `develop`/`main`.

Si esos 3 controles aparecen, la proteccion quedo bien aplicada.
