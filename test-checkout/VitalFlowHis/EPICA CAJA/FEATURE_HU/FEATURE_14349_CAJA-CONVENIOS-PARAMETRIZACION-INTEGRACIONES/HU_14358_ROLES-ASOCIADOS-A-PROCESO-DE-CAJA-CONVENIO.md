# HU 14358 - Roles Asociados a Proceso de Caja-Convenio

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14349_CAJA-CONVENIOS-PARAMETRIZACION-INTEGRACIONES
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14358/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Plataforma ODI. 

Quiero: Tener identificado los distintos roles y funcionalidades en la gestión de caja. 

Para: Validar los accesos a las distintas funcionalidades de caja según el rol asignado. 

 

 Descripción y Comportamiento: 

En el módulo de Caja, se requiere la configuración de tres (3) roles para la gestión. los roles de: Cajero, Coordinador y Tesorero. 

 

Cada rol, habilitará un conjunto específico de funcionalidades, acorde al gestión y responsabilidades asignadas a cada perfil: 
 

Funcionalidades por rol: 

Rol: Cajero 

 El cajero tendrá las siguientes funcionalidades: ? Apertura y
cierre de caja. ? Registro de
ingresos y egresos de dinero. 

 ? Emisión de
comprobantes y facturas. 

 ? Recepción
de cobros y pagos. 

 ? Realización
de arqueos parciales y finales. 

 ? Carga
manual del conteo de efectivo (Manual o por Billetes (Denominación) ). 

 ? Visualización
de movimientos por ciclo operativo. 

 ? Notificación
de diferencias en arqueo a coordinador. 

 Rol: Coordinador 

 El coordinador, tendrá las siguientes funcionalidades. 

 

 ? Validación de arqueos
parciales y finales. 

 ? Consulta y análisis del
historial de arqueos. 

 ? Control y supervisión de
diferencias en arqueos. 

 ? Autorización de
reaperturas de caja si corresponde. 

 ? Visualización de todas
las cajas del equipo a cargo. 

 ? Reporte de incidencias al
tesorero. 

 ? Acceso al resumen por
medio de pago y movimientos. 

Rol: Tesorero. 
 

 El tesorero tendrá las siguientes funcionalidades: 

 ? Acceso total a todos los
movimientos de caja y arqueos. 

 ? Generación y descarga de
reportes. 

 ? Auditoría de diferencias
y aprobación final. 

 ? Supervisión de la
correcta asignación de roles. 

 ? Gestión de permisos y
configuraciones de cajas. 

 ? Definición de políticas
de manejo de efectivo. 

 ? Visualización y control
de todas las cajas del sistema. 

 

Cuadro de roles y Funcionalidades: 

 

 

 
 
 
 
 
 
 
 Centro 
 Modulo 
 Funcionalidades 
 
 Roles 
 
 
 
 
 Gestor Especifico 
 
 
 Cajero 
 Coordinador 
 Tesorero 
 
 
 
 Caja 
 Apertura y cierre de
 caja. 
 x 
 
 
 
 
 
 
 Registro de ingresos
 y egresos de dinero. 
 x 
 
 
 
 
 
 
 Emisión de
 comprobantes y facturas. 
 x 
 
 
 
 
 
 
 Recepción de cobros y
 pagos. 
 x 
 
 
 
 
 
 
 Realización de
 arqueos parciales y finales. 
 x 
 
 
 
 
 
 
 Carga manual del
 conteo de efectivo (Manual o por Billetes (Denominación)). 
 x 
 
 
 
 
 
 
 Visualización de
 movimientos por ciclo operativo. 
 x 
 
 
 
 
 
 
 Notificación de
 diferencias en arqueo a coordinador. 
 x 
 
 
 
 
 
 
 Validación de arqueos
 parciales y finales. 
 
 x 
 
 
 
 
 
 Consulta y análisis
 del historial de arqueos. 
 
 x 
 
 
 
 
 
 Control y supervisión
 de diferencias en arqueos. 
 
 x 
 
 
 
 
 
 Autorización de
 reaperturas de caja si corresponde. 
 
 x 
 
 
 
 
 
 Visualización de
 todas las cajas del equipo a cargo. 
 
 x 
 
 
 
 
 
 Reporte de
 incidencias al tesorero. 
 
 x 
 
 
 
 
 
 Acceso al resumen por
 medio de pago y movimientos. 
 
 x 
 
 
 
 
 
 Acceso total a todos
 los movimientos de caja y arqueos. 
 
 
 x 
 
 
 
 
 Generación y descarga
 de reportes. 
 
 
 x 
 
 
 
 
 Auditoría de
 diferencias y aprobación final. 
 
 
 x 
 
 
 
 
 Supervisión de la
 correcta asignación de roles. 
 
 
 x 
 
 
 
 
 Gestión de permisos y
 configuraciones de cajas. 
 
 
 x 
 
 
 
 
 Definición de
 políticas de manejo de efectivo. 
 
 
 x 
 
 
 
 
 Visualización y
 control de todas las cajas del sistema. 
 
 
 x

## Azure Criterios de Aceptacion
- Cajero debe tener acceso únicamente a su caja. 
- Coordinador puede visualizar todas las cajas y arqueos bajo su
supervisión. 
- Tesorero debe tener acceso total, con permisos de auditoría y
aprobación. 
- Los reportes deben ser descargables según el rol y permisos asignados.

## Azure Tasks
- Task 16497: Análisis y Diseño Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Task 16498: Escritura Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez



