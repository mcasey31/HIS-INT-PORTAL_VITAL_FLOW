# Integracion Operativa

Esta carpeta documenta como operar HIS + Portal + Integracion desde una sola raiz, manteniendo segmentacion para evitar impactos cruzados.

## Contenido

- 01-operacion-desde-raiz.md
  - Comandos diarios para controlar servicios desde la raiz.
  - Segmentacion por sistema y por scope.
- 02-gestion-git-multiproyecto.md
  - Como versionar cuando HIS y Portal son repos separados.
  - Que se sube y que no se sube al hacer push.

## Estado actual detectado

- La raiz de Integracion no tiene repositorio Git inicializado.
- VitalFlowHis si tiene su propio .git.
- VitalFlowPortal si tiene su propio .git.

Esto significa que hoy los pushes se hacen por separado, uno por HIS y otro por Portal.
