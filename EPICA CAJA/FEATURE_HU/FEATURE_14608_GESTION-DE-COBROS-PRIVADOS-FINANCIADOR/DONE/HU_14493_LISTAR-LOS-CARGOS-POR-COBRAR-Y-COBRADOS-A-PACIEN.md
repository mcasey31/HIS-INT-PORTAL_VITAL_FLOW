# HU 14493 - Listar los cargos por cobrar y cobrados a pacientes con pago particulares

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14493/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Listar los cargos por cobrar y conrados a pacientes
con pagos privados. 
Para: Gestionar los cobros en caja por paciente. 

 

 

 

Descripción y comportamiento: Desde el módulo de caja se
requiere consultar y listar los cargos pendientes por cobrar a pacientes que se encuentran
en proceso para ser admitidos, así como los cargos ya cobrados. 

La consulta de pacientes con cargos pendientes (valor a pagar), se deriva de la acción de eventos de cobros a privados ejecutados desde la HU:Item 14040: Evento cobro a privado y puede generar dos posibles escenarios. 

Escenario 1) Se encontraron pacientes con cargos. 

 Se debe listar a los pacientes teniendo en cuenta el siguiente orden de la grilla: 

 

- Fecha 
- Hora turno 
- Episodio (puede venir vacío) 
- Paciente 
- Documento 
- Financiador 
- Servicio 
- Efector 
- Estado de pago 
- Menú contextual 
 ORDEN DEL LISTADO (ESTANDAR): El listado debe estar ordenado por Estado, priorizando en primer orden los Estados Pendientes segun orden de creacion del evento de cobro. Luego debe seguir con los Estados Cobrados, por orden según hora de cobro (sistema) 
 Una vez listado los pacientes se debe permitir: - Filtrar por tipo y número de documento (Se debe permitir filtrar por DNI y número de documentos del listado pre establecido) 
Botón Emitir Pago - Este evento se desarrollará en HU Item 11958: Emitir Cobro a Privados) 
 
 
 
 
 
 
 Escenario 2) No hay pacientes con cargos disponibles. 
 Se debe mostrar un mensaje informando que no hay cargos pendientes por cobrar, ver mockup. 

 
 Caso cuando se buscar por paciente y este no tiene cargos por cobrar i cobrados. 
 

 
 https://xd.adobe.com/view/be9aaf52-6492-4c5f-868c-de12e4a4118d-ebc9/

## Azure Criterios de Aceptacion
- Se debe mostrar los pacientes con pagos pendientes que tengan encuentros abiertos o cerrados. 
- Permitir filtrar del listado por tipo y número de documento del paciente. 
- Al filtar por documento, y no se obtine resultado, al limpiar input del Nro de Documento se debe visualizar la lista previa. 
- Se debe listar ordenando por estado, priorizando los estados "Pendientes de Pago" y fecha más reciente.

## Azure Tasks
- Task 22757: BE - Crear cargos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 22798: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17502: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17456: FE - Integración EP obtenerCargos | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 17455: FE - Buscador Paciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 23247: QA - Ordenamiento de la columna estado | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 14538: Análisis y Diseño Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Bug 23255: QA - Difiere el diseño del estado "Pendiente" en la columna "Estado Pago" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23489: QA - Al cancelar la búsqueda por n° de documento no devuele la vista previa | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17501: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14539: Escritura Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14937: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 22927: FE- Pruebas End to End | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 23552: Cuando se pasa a la segunda página de cargos no permite volver a la anterior | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 17454: FE - Maquetado listado Cargos Pendientes | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 22558: BE - Listar cargos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala



