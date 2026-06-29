# HU 17050 - Auditoría del modulo de admision

## Trazabilidad
- Epic: EPICA AUDITORIA
- Feature: FEATURE_16908_AUDITORIA-DE-ADMISIA-N
- Tipo Azure: Product Backlog Item
- Estado: New
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17050/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Administrador de la plataforma ODI Quiero: Que se registre en base de datos las acciones y eventos en el modulo de admisión. Para: Poder auditar el comportamiento del sistema en los procesos de admisión 

 Descripción y comportamiento: Se requiere que cada vez que un usuario realice un evento de login, creación, modificación y/o eliminación de datos en el modulo de admisión, se registre automáticamente en base toda acción que realice, tomando como condición relevante los siguientes puntos: - Identificador del usuario (ID o usuario)
 
- Fecha y hora exacta (con zona horaria)
 
- Tipo de acción realizada (login, creación, modificación, eliminación, cancelación)
 
- Proceso de la acción (Admisión, agregar/quitar prácticas, llamar paciente, crear encuentro, eximir paciente) 
- Módulo o componente afectado (Admisión)
 
- Registro o datos afectado (Ejemplo: id paciente, nombres, numero de episodio o encuentro) 
- Resultado de la acción (éxito o error)
 
- URL o endpoint accedido (en sistemas web)
 
- Dirección IP del usuario.
 
- Tipo de dispositivo o navegador (user agent)
 
- Sesión o token utilizado
 
- Valor anterior y nuevo del dato modificado (si aplica)
 
- Si fue una acción directa del usuario o automatizada por el sistema
 
- Si provino de una API, interfaz web, móvil, etc.

## Azure Criterios de Aceptacion
- Los registros deben ser inmutables (no editables ni borrables)
 
- Se debe garantizar el almacenamiento seguro y periódico de estos registros.
 
- Se debe establecer un plazo mínimo de conservación (por ejemplo, 2 o 5 años, según normativas).
 
- Solo usuarios autorizados deben poder consultar los registros.

## Azure Tasks
- Task 23962: QA-Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Hernan Alexis Gutierrez
- Task 17074: Análisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 24282: BE - Auditoria | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Task 23961: QA-Diseño de Casos de Prueba | Estado: To Do
 - Asignado a: Hernan Alexis Gutierrez



