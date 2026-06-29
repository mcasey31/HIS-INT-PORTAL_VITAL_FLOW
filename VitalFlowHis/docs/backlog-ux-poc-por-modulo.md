# Backlog UX POC por modulo

Fecha: 2026-05-31

## Objetivo

Registrar observaciones UX detectadas en la POC para tratarlas despues, sin mezclarlas con cambios funcionales inmediatos.

## Hallazgos base

### 1. Exposicion de permisos dentro de la pantalla

- En Personas se muestra un bloque visible de `Permisos de usuario` dentro del canvas principal.
- Esto mezcla configuracion interna con la tarea operativa del usuario.
- Para una POC y para produccion, los permisos no deberian ocupar espacio dentro del flujo principal.

Impacto:

- Ruido visual.
- Rompe foco de tarea.
- Expone un concepto tecnico que no suma al operador.

Referencia actual:

- `front/src/personas/PersonasPage.tsx`

### 2. Navegacion entre modulos sin control de cambios no guardados

- El selector de modulos vive en el shell global.
- Hoy cada boton navega de forma directa con `navigate(...)`.
- No existe guard de navegacion para detectar formularios sucios, cambios en curso o modales abiertos.

Impacto:

- Riesgo de perdida silenciosa de datos.
- Riesgo de abandonar una carga sin confirmacion.
- Riesgo mayor en formularios largos o flujos clinicos.

Referencia actual:

- `front/src/App.tsx`

### 3. Scroll y contencion visual inconsistentes

- Aunque el shell ya tiene scroll interno, persiste percepcion de poca navegabilidad y falta de scroll en pantallas largas.
- Hay que revisar el patron final por modulo, especialmente formularios extensos como Personas.

Impacto:

- Sensacion de pantalla trabada.
- Dificultad para descubrir contenido por debajo del fold.
- Mala experiencia en modo cuadro o viewport contenido.

Referencia actual:

- `front/src/styles.css`

## Backlog transversal

### Shell y navegacion

1. Definir patron de perfil de usuario en esquina superior derecha.
2. Mover identidad, rol y acciones de cuenta a ese menu de perfil.
3. Quitar informacion de permisos del cuerpo de cada modulo salvo casos estrictamente administrativos.
4. Incorporar guard global de cambios no guardados antes de:
   - cambio de modulo
   - logout
   - cambio de ruta interna
   - cierre o refresh de navegador cuando aplique
5. Definir estrategia comun de estados dirty por modulo.
6. Estandarizar un solo scroll primario por pantalla y evitar dobles contenedores scrolleables.

### Criterios funcionales a definir

1. Que se considera `cambio no guardado` en cada modulo.
2. Cuando mostrar confirmacion y cuando permitir salida directa.
3. Si la confirmacion debe ofrecer:
   - guardar y salir
   - salir sin guardar
   - cancelar
4. Que modulos requieren autosave, borrador o recuperacion de estado.

## Backlog por modulo

### Home / Shell

Problemas observados:

- Selector de modulos siempre visible dentro del area de trabajo.
- Logout visible junto a la botonera de modulos.
- Falta un patron de identidad/perfil mas limpio.

Pendientes:

1. Diseñar menu de perfil en topbar, estilo launcher/perfil de aplicacion.
2. Evaluar si el selector de modulos debe quedar fijo, colapsable o detras del icono de grilla.
3. Agregar guard de navegacion para cambios no guardados antes de saltar entre modulos.
4. Definir comportamiento de `Home` cuando hay procesos abiertos en otro modulo.

### Personas

Problemas observados:

- Se muestra `Permisos de usuario` dentro de la pantalla.
- Se expone selector de rol operativo dentro del flujo principal.
- El formulario es largo y necesita una experiencia de scroll mas robusta.

Pendientes:

1. Quitar el bloque `Permisos de usuario` del canvas principal.
2. Quitar el selector `Rol actual` de la UI operativa.
3. Si el rol necesita verse, mostrarlo solo dentro del perfil de usuario.
4. Definir si el cambio de rol es una herramienta de prueba interna y aislarla fuera del flujo normal.
5. Revisar experiencia de scroll en formularios extensos.
6. Agregar deteccion de cambios no guardados para empadronamiento.

### Gestion de agendas

Riesgos:

- Alta, edicion y copia de agendas tienen multiples campos y bloques.
- Cambiar de modulo hoy puede descartar trabajo en curso sin aviso.

Pendientes:

1. Definir dirty state para agenda, bloque, practicas y copias.
2. Agregar confirmacion previa al cambio de modulo.
3. Evaluar barra de acciones persistente con guardar/cancelar.
4. Revisar scroll y jerarquia visual en formularios largos.

### Turnos

Riesgos:

- Hay pasos secuenciales de identificacion, busqueda, seleccion y confirmacion.
- Salir en medio del flujo puede generar perdida de contexto.

Pendientes:

1. Detectar estado en curso cuando hay paciente identificado o slot seleccionado.
2. Confirmar salida antes de cambiar de modulo durante una asignacion.
3. Revisar si los modales abiertos deben bloquear navegacion o pedir confirmacion.

### Admision

Riesgos:

- Puede haber filtros aplicados, paciente seleccionado y acciones de arribo en proceso.
- Navegar sin confirmacion puede romper continuidad operativa.

Pendientes:

1. Detectar paciente seleccionado y accion de admision iniciada como estado dirty.
2. Confirmar salida antes de cambio de modulo.
3. Revisar scroll en listados largos y formularios auxiliares.

### Escritorio clinico

Riesgos:

- Es el modulo mas sensible para perdida de informacion por contener evolucion, problemas y recetas.
- El cambio de modulo sin control es especialmente riesgoso en este flujo.

Pendientes:

1. Definir guard fuerte para evolucion no guardada.
2. Definir guard para receta digital en edicion.
3. Definir guard para problemas cronicos en edicion.
4. Confirmar navegacion antes de salir del encuentro actual.
5. Revisar continuidad visual y scroll de panoramica, historia y formularios clinicos.
6. Integrar un `llamador` de sala de espera (TV/pantallas) para anunciar paciente + consultorio al ejecutar `Llamar`/`Megafono` desde HCA. Estado: Backlog diferido (NO desarrollar en esta iteracion).
7. Incorporar `catalogo de problemas` pre-cargado para evolución (seleccion asistida desde base clínica), reemplazando el ingreso manual en texto libre. Estado: Backlog diferido (NO desarrollar en esta iteracion).

### Estructura Interna

Riesgos:

- Tiene operaciones administrativas con formularios y posibles altas de usuarios.
- Puede requerir tambien politica de confirmacion antes de abandonar cambios.

Pendientes:

1. Detectar formularios sucios.
2. Confirmar cambio de modulo cuando haya alta/edicion sin guardar.
3. Unificar patron visual con el resto de modulos.
4. Seguridad por feature dentro de cada modulo: hoy la autorizacion esta asociada a modulo completo. Disenar matriz de permisos por funcionalidad/pantalla/accion y versionar rol-feature para evolucion posterior.
5. Modelar `Sedes` asociadas a un `Centro` en estructura arbol. Caso objetivo: un centro principal con su direccion/estructura (por ejemplo, 15 consultorios) y sedes A/B con sus propios consultorios, agendas, turnos y admisiones. Operativamente cada sede se gestiona como centro, pero jerarquicamente pertenece al centro padre. Estado: Backlog diferido (NO desarrollar en esta iteracion).
6. Definir `contexto de centro` obligatorio al iniciar sesion para perfiles multi-centro (administrativos y medicos). El rol define accesos a modulos y el centro seleccionado acota datos operativos y permisos efectivos.
7. Diseñar modelo de autorizacion `usuario-rol-centro` para permitir casos como: acceso administrativo general sin habilitacion a todos los centros, y medicos que trabajan en multiples centros de la misma institucion.
8. Implementar ABM de `roles padre/hijo` con herencia de features y override por centro (excepto `Admin` global). Referencia de diseno: docs/modelo-roles-padre-hijo-centro-features.md.

## Orden sugerido de ataque

1. Shell global: perfil de usuario + guard de navegacion + politica de dirty state.
2. Personas: sacar permisos del canvas y corregir scroll.
3. Escritorio clinico: guard de salida por criticidad clinica.
4. Agenda y Turnos: guard de formularios y pasos.
5. Admision y Estructura Interna: alineacion final.

## Decision provisional para POC

Hasta implementar estos puntos:

1. No exponer permisos o roles operativos dentro del cuerpo de los modulos.
2. No asumir que cambiar de modulo es seguro si hay formularios activos.
3. Tratar la navegacion global como area de riesgo funcional, no solo visual.