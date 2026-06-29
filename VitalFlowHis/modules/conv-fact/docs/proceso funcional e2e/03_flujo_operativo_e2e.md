# Flujo Operativo E2E

## 1. Precondiciones

- Backend y frontend levantados en Docker.
- Catalogos base disponibles.
- Al menos un prestador y una locacion activos.

## 2. Flujo recomendado punta a punta

1. Estructura -> Base de Catalogos
   - Crear o validar catalogo de cobertura.

2. Estructura -> Prestaciones por Catalogo
   - Crear prestaciones necesarias para el caso.

3. Estructura -> Modulos
   - Si aplica, armar composicion modulo.

4. Estructura -> Sociedades -> Financiador
   - Crear financiador objetivo.

5. Estructura -> Sociedades -> Planes
   - Crear planes del financiador.

6. Convenios -> Referencias / Contexto
   - Crear convenio y convenio-plan.
   - Seleccionar tramo activo.

7. Convenios -> Vinculos
   - Asociar prestaciones al convenio-plan.

8. Convenios -> Valorizaciones
   - Definir valor economico por tarifario/prestacion.

9. Facturacion
   - Operar prefactura y factura con el tramo configurado.

## 3. Checkpoints de control

- Si no hay convenio-plan activo, deben quedar bloqueadas operaciones dependientes.
- El cambio de financiador debe limpiar contexto dependiente cuando corresponde.
- La seleccion de centro/prestador debe impactar correctamente en opciones de contexto.

## 4. Criterios minimos UAT

- Alta y edicion de Financiador y Plan sin duplicados invalidos.
- Activacion/inactivacion con traza de auditoria (actor + fecha).
- Vinculo de prestaciones en convenio-plan visible y operable.
- Valorizacion creada y reflejada en grilla del tramo activo.
- Recorrido end-to-end reproducible con al menos dos financiadores.

## 5. Riesgos frecuentes

- Desalineacion entre catalogo ODI y catalogo financiador.
- Estado inactivo en maestros base usados por contexto.
- Falta de tramo activo al intentar operar valorizaciones/facturacion.

## 6. Mitigaciones

- Validaciones previas por paso.
- Uso de filtros en grillas para control rapido.
- Auditoria obligatoria en cambios de estado.
- Pruebas smoke por financiador y por plan.
