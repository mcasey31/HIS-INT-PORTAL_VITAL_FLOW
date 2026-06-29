# Estado Funcional del Chat

## 1. Objetivo del ciclo

Implementar y estabilizar el flujo funcional de:

- Estructura Interna
- Convenios
- Facturacion

con foco en no romper Facturacion, reforzar navegacion operativa y avanzar CRUD real sobre BBDD para Centros y Sociedades.

## 2. Decisiones funcionales confirmadas

### 2.1 Facturacion

- Se preservo el comportamiento operativo esperado.
- Se evitó mezclar reglas en la solapa de Facturacion.
- Se sostuvo separacion funcional por modulo.

### 2.2 Estructura Interna

- Se consolido menu lateral fijo tipo arbol para navegacion.
- Se reforzo el enfoque SAP-like solicitado: menu principal a la izquierda y pantalla de trabajo a la derecha.
- Se elimino duplicacion de cajas de submenu para reducir ruido visual.

### 2.3 Centros (Prestadores y Locaciones)

- Se implemento soporte CRUD operativo sobre BBDD local.
- Se incorporaron filtros de grilla en Prestadores y Locaciones.
- Se habilito alta/edicion y cambio de estado.
- Se paso a modelo de interaccion con popup para alta/visualizacion/modificacion de Prestador.
- Se incorporo accion por fila con menu tipo hamburguesa para operaciones de registro.
- Se incorporo switch para activar/inactivar.

### 2.4 Sociedades

Se implemento paso funcional `Sociedades` en Estructura con submenus:

- Financiador
- Planes

Regla funcional aplicada:

1. Primero se crea Financiador.
2. Luego se crean Planes asociados al financiador seleccionado.

## 3. Cambios backend relevantes

### 3.1 Prestadores

- Se agrego endpoint de detalle para edicion completa sin perdida de campos:
  - `GET /api/v1/prestadores/{prestador_id}/detalle`

### 3.2 Auditoria

- Se ajusto el registro de auditoria para capturar actor dinamico desde payload cuando se informa `usuario`.
- Se mantuvo timestamp de evento en tabla de auditoria.
- Se incorporo `usuario` en contratos de patch de estado para:
  - Financiadores
  - Planes

Resultado:

- Cuando se activa/inactiva, queda traza de accion, actor y fecha.

## 4. Criterios de UX aplicados

- Menos botones visibles por defecto.
- Operaciones de registro movidas a menu contextual por fila.
- Formulario de alta/edicion movido a popup para no saturar layout.
- Mantenimiento del menu fijo izquierdo como ancla de navegacion.

## 5. Estado actual

### Confirmado

- Navegacion de Estructura estable.
- Sociedades con jerarquia Financiador -> Planes.
- Centros con operativa de ABM + estado.
- Auditoria con actor y fecha para cambios de estado.

### Pendiente sugerido

- Unificar iconografia de menu contextual (hamburguesa visual final).
- Cierre automatico de popup al guardar exitoso (si se decide).
- Ajustes finos de accesibilidad (teclado y foco en popup/menu fila).

## 6. Regla de despliegue seguida

Despues de cada cambio de codigo se ejecuto rebuild/restart de Docker para dejar los cambios activos inmediatamente.
