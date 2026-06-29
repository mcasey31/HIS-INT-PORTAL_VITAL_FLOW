# Estrategia de Desarrollo Dockerizada - Modulo Convenios y Facturacion ODI

## Objetivo

Definir una estrategia de construccion webapp separada en backend, frontend y base de datos para evolucionar el modulo de Convenios y Facturacion con despliegue dockerizado.

## Frontend

- Webapp modular por dominio: modulos, clasificaciones, nomenclador, tarifarios, convenios, prestador, prefacturas, facturas, normas operativas y general.
- Rutas y permisos por modulo para limitar acceso por rol.
- Componentes reutilizables de ABM, filtros, tablas y formularios.
- Trazabilidad HU -> pantalla UX Adobe en cada entrega.

## Backend

- API REST versionada por contextos funcionales:
  - Catalogos y nomenclador
  - Convenios y prestadores
  - Tarifarios y normas operativas
  - Prefacturacion y facturacion
  - Seguridad y auditoria
- Reglas de negocio centralizadas en backend para evitar logica duplicada en frontend.
- Procesos asincronos para validaciones y consolidaciones masivas.

## Base de datos

- Modelo relacional con separacion logica por esquemas de dominio.
- Entidades maestras con vigencia y estados (activo/inactivo).
- Integridad referencial entre nomenclador, tarifarios, convenios, prestadores y facturacion.
- Auditoria de cambios y trazabilidad de eventos transaccionales.

## Dockerizacion

- Stack recomendado con docker compose:
  - frontend
  - backend
  - db
  - worker (opcional para jobs)
  - redis (opcional para cache/colas)
- Variables de entorno por perfil dev/test.
- Volumen persistente para base de datos y logs.

## Orden sugerido de implementacion

1. Base funcional: Modulos, Clasificaciones y Nomenclador.
2. Valorizacion y contratos: Tarifarios, Convenios y Prestador.
3. Flujo transaccional: Prefacturas y Facturas.
4. Control transversal: Normas Operativas.
5. Capa transversal y observabilidad: General.

## Dependencias entre dominios

- Modulos -> habilita navegacion y permisos para todos los dominios.
- Clasificaciones + Nomenclador -> base de datos maestra de prestaciones.
- Nomenclador -> entrada obligatoria para Tarifarios.
- Tarifarios + Convenios + Prestador -> validaciones de Prefacturas.
- Prefacturas -> insumo directo de Facturas.
- Normas Operativas -> controles transversales sobre Convenios, Prefacturas y Facturas.
- General -> soporte de acceso, operacion y reportabilidad.
