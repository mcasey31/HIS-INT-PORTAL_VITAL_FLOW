# Plan de Saneamiento Local por Modulos

Objetivo: estabilizar UX y funcionalidad en local, modulo por modulo, antes de volver al flujo Git prolijo por feature.

## 1) Regla de trabajo durante saneamiento

- No mergear a `develop` ni `main` hasta cerrar checklist.
- Trabajar en una rama tecnica de saneamiento local.
- Agrupar cambios por modulo y validar build despues de cada bloque.
- Registrar hallazgos en este mismo documento.

## 2) Entorno de prueba recomendado

- Front dev: `http://localhost:5173`
- Front docker/nginx: `http://localhost:5175`
- Usuario sugerido: `admin`

Validar cada cambio en ambos frentes:

1. `5173` para iterar rapido.
2. `5175` para comportamiento cercano a despliegue.

## 3) Ciclo por modulo (siempre igual)

Para cada modulo repetir este ciclo:

1. Recorrido base de pantalla (carga, scroll, foco, responsive).
2. Caso feliz principal.
3. Casos borde (sin datos, errores, cancelaciones).
4. Navegacion entre modulos con cambios sin guardar.
5. Logout/login y persistencia de estado.
6. Build local del front.

## 4) Checklist por modulo

### Home

- [ ] Carga sin errores de consola.
- [ ] Nombre de usuario correcto en bienvenida.
- [ ] Fecha/hora dinamica correcta.
- [ ] Accesos directos navegando al modulo correcto.

### Personas

- [ ] Busqueda por documento.
- [ ] Cambio a busqueda por set minimo.
- [ ] Flujo de empadronamiento guiado.
- [ ] Sin superposicion de campos.
- [ ] Grillas legibles y seleccion de candidato.
- [ ] Modal escaneo DNI y mensajes.
- [ ] Guardas de cambios sin guardar.

### Agenda

- [ ] Landing y filtros avanzados sin falsos positivos de dirty state.
- [ ] Alta agenda.
- [ ] Edicion agenda.
- [ ] Copia agenda.
- [ ] Bloques fijos/variables/demanda.
- [ ] Validaciones visuales de formularios.

### Turnos

- [ ] Busqueda y seleccion de paciente.
- [ ] Asignacion normal.
- [ ] Sobreturno.
- [ ] Confirmaciones/cancelaciones.
- [ ] Guardas de cambios sin guardar.

### Admision

- [ ] Landing y filtros.
- [ ] Estados del paciente.
- [ ] Acciones principales sin error visual.
- [ ] Navegacion y consistencia con otros modulos.

### Escritorio Clinico

- [ ] Carga de listado y panoramica.
- [ ] Evolucion: abrir, editar, guardar, cancelar.
- [ ] Solicitud de estudios y observaciones.
- [ ] Receta digital (si aplica entorno).
- [ ] Guardas de cambios sin guardar sin falsos positivos.

### Estructura Interna

- [ ] ABMs basicos.
- [ ] Altas y ediciones.
- [ ] Tabla/listado sin solapamientos.

### Shell global (topbar, perfil, modulos)

- [ ] Boton de modulos abre/cierra correcto.
- [ ] Perfil arriba derecha consistente.
- [ ] Logout desde perfil redirige a `/login`.
- [ ] `/login` accesible en sesion activa para pruebas.
- [ ] Scroll correcto (sin "pantalla infinita").

## 5) Registro de hallazgos

Usar esta plantilla por cada bug detectado:

- Modulo:
- Pantalla:
- Paso para reproducir:
- Resultado actual:
- Resultado esperado:
- Severidad: Alta / Media / Baja
- Estado: Pendiente / En curso / Resuelto / Validado

## 6) Criterio de salida (Definition of Done)

Se considera cerrado el saneamiento local cuando:

- Todos los items del checklist estan en OK.
- No quedan issues de severidad alta.
- Build de front en verde.
- Validacion manual completa en `5173` y `5175`.

## 7) Reenganche con Git prolijo por feature

Una vez estable:

1. Consolidar cambios de saneamiento en una sola PR tecnica a `develop`.
2. Mergear con checks en verde.
3. Desde ese baseline, volver a flujo normal por feature:
   - `feature/HU-xxxx-descripcion`
   - PR pequena
   - review
   - merge

Nota: en lugar de "pull overall" al final, el enfoque seguro es fijar un baseline estable en `develop` y desde ahi crear features nuevas.

## 8) Backlog funcional (pendiente)

- Armar HU: FUSIONAR PERSONAS.
   - Objetivo: consolidar dos personas duplicadas en una sola identidad canonica.
   - Requisito minimo: mantener trazabilidad de historial y referencias clinicas/administrativas.