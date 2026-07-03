# HU 23250 - Visualizar las normas operativas de acuerdo al convenio del paciente al admitirlo.

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/23250/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de admisión Quiero: Visualizar normas operativas Para: Realizar una correcta admisión 
 Descripción y comportamiento: Como mejora de la historia ITEM 13945, al momento de admitir un paciente, sea con turno programado o demanda espontanea el sistema deberá realizar una consulta al área de convenios, para consultar las normas operativas requeridas para la atención, tal como se muestran en pantalla. Cabe destacar que las normas operativas no son a nivel practica (Autorización-Ome-OP, etc) sino para el encuentro en si. 
 
 
 Las normas estarán configuradas en el área de convenios como "documentos requeridos para la admisión". 
 En caso de no recibir respuesta del módulo de convenios, se mostrará un mensaje de error tal como se indica en la siguiente pantalla.

## Azure Criterios de Aceptacion
- La información que devuelva el servicio de convenios se mostrará en el apartado "Normas operativas" y no será condicionante para la admisión del paciente ya que se muestra a modo informativo como ayuda para el admisionista. 
- En caso de no recibir respuesta en la consulta a convenios el sistema mostrará un mensjaje de error.

## Azure Tasks
- Task 23251: Análisis, diseño y escritura funcional | Estado: To Do
 - Asignado a: Sebastian Hernandez Garandan



