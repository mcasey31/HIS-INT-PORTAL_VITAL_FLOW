# Modelo de Roles Padre/Hijo con Centros y Features

Fecha: 2026-06-02

## Objetivo

Disenar un modelo de autorizacion donde:
- Un rol hijo hereda configuraciones del rol padre.
- El hijo puede cambiar alcance por centro.
- Admin queda como excepcion global.
- Centro y feature se tratan como objetos de autorizacion.

## Objetos base

1. Rol (`sch_seguridad.rol`)
2. Feature (`sch_seguridad.rol_feature_permiso.feature_key`)
3. Centro (`sch_seguridad.rol_centro_alcance.centro_id`)
4. Asignacion de usuario (`sch_seguridad.usuario_rol` con centro)

## Regla de herencia

1. Si `parent_rol_id` es null, el rol es base.
2. Si un rol tiene padre:
- Si `hereda_features=true`, toma features del padre y aplica overrides propios.
- Si `hereda_centros=true`, toma centros del padre y aplica overrides propios.
- Si `hereda_centros=false`, define centros de forma explicita (caso recomendado para hijos por sede/centro).
3. `es_admin_global=true` ignora restriccion por centro y tiene alcance total.

## Resolucion de permisos efectivos

Permiso efectivo para una accion:

1. Resolver arbol de roles desde hijo a padre.
2. Construir conjunto de features efectivas:
- primero heredadas,
- luego overrides del rol actual.
3. Construir conjunto de centros efectivos:
- heredados si corresponde,
- sobreescritos por rol actual si `hereda_centros=false`.
4. Aplicar contexto de sesion (`centro_id` seleccionado en login o cambio de contexto).
5. Autorizar solo si:
- feature permitida,
- centro habilitado,
- usuario con rol activo.

## Ejemplos

### Ejemplo A: Admin (excepcion)

- Rol: `Administrador`
- `es_admin_global=true`
- Sin padre
- Resultado: acceso total a modulos/features/centros.

### Ejemplo B: Administrativo Padre + Hijo por Centro

- Rol padre: `Administrativo Base`
- Features: `turnos.ver`, `turnos.crear`, `admision.ingresar`
- Centros: no definidos en padre (o herencia desactivada)

- Rol hijo 1: `Administrativo Centro 1`
- Padre: `Administrativo Base`
- `hereda_features=true`
- `hereda_centros=false`
- Centros: `Centro 1`

- Rol hijo 2: `Administrativo Centro 2`
- Mismo padre y features
- Centros: `Centro 2`

### Ejemplo C: Medico multi-centro centralizado

- Rol: `Medico Centralizado`
- Puede tener varios centros en `rol_centro_alcance`.
- En login el usuario elige centro de contexto.
- El sistema filtra agenda/turnos/admision por centro seleccionado.

## Implementacion sugerida en etapas

1. Etapa 1: Persistencia
- Tablas de rol-feature y rol-centro.
- Campos de jerarquia en rol (`parent_rol_id`, `hereda_*`, `es_admin_global`).

2. Etapa 2: ABM de Roles
- CRUD de roles con selector de padre.
- Editor de features por rol.
- Editor de alcance por centro por rol.

3. Etapa 3: Sesion con centro
- Login con seleccion de centro si el usuario tiene mas de uno.
- Claim `centroId` en token.

4. Etapa 4: Enforcement
- Middleware/policies por feature + centro.
- Filtros por centro en servicios de negocio.
