# HU 8989 - Agregar bloque de programación variable

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: New
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/8989/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Crear programación horaria con duración variable Para: Generar una disponibilidad horaria para una agenda
 
 Descripción 
 Desde la funcionalidad de agenda y en el segundo marco de la pantalla, podemos generar un nuevo bloque de programación, como se muestra a continuación. 
 
 Esta opción se activará, una vez que la estructura de la agenda este creada. Al generar un bloque para una agenda, se debe configurar el bloque de programación con la carga de los siguientes datos: 
 Datos a cargar: - Nombre de programación * (campo de texto, 70 caracteres máximo) 
- Seleccionar el tipo de programación: * (Radio button con las opciones de: "Duración Fija" o "Duración Variable"). Para el caso de duración variable, permitirá generar un bloque de programación con slots de 5 min c/u, según el horario definido. (Usar el mismo procedimiento "stored procedure" realizado para programación fija) 
Fecha desde * (para indicar el inicio de la vigencia dd/mm/aaaa) 
Fecha hasta * (para indicar el fin de la vigencia, dd/mm/aaaa) 
- Horario desde * (Horario en el que empezará el primer slot, HH:MM) 
Horario hasta * (Horario en el que terminará el último slot, HH:MM) 
- Selección de días * (L, M,M,J,V,S,D botones de selección) 
- Lugar de atención * (consultorios, box, área-sector información que va a venir, autoselector) 
- Frecuencia * 

 

Semanal: Al seleccionar esta opción la configuración se repetirá todas las semanas que el bloque tenga vigencia. 
Quincenal: la configuración será de semanas alternas iniciando la semana que tenga la fecha desde del bloque. 
Dia de la semana por orden en el mes (Orden mensual): seleccionar el día de la semana por orden en el mes (primer y tercer jueves del mes) 
 
 - Configuración de Prácticas: En la configuración del bloque, se tendrá un marco para configurar las prácticas que van a estar relacionadas con el bloque de programación que se esta configurando. Si se agregan prácticas que no cuentan con una duración definida, se le asignara por default 15 min, este proceso se desarrollará en la HU Product Backlog Item 7029: Agregar prácticas médicas 
- Configuración de gestor de cupo (Habilitará la configuración de gestión de cupo para este bloque de programación, este proceso se desarrollará en la [HU Gestión de Cupos])
 
 Ver datos en el mockup. 
 
 
 
 
 

(*) datos de carácter obligatorio Al final habrá dos botones: Cancelar: cancela la acción y vuelve a la pantalla de la agenda que se está creando/editando. 
 

 
 Guardar: se activará una vez completados todos los campos obligatorios, una vez seleccionado, se deberá mostrar un modal de confirmación. Ver mockup
 

Al seleccionar "SI, GUARDAR" se guardará y generará la disponibilidad horaria configurada. de lo contrario si elijo "VOLVER" nos llevará a la configuración del bloque de programación.
 Al finalizar toda la configuración se generara el bloque de programación (variable) con sus slot de 5 min c/u, las prácticas asociadas y la gestión de cupo en caso de requerirse. 

Nota: La cantidad de slot se define al crear el bloque de programación, tomando en cuenta el rango horario de hora desde y hora hasta y el tiempo por slot definido de 5 min. 

 
 
 https://xd.adobe.com/view/7281821b-7083-4c60-8728-bf3dcde84523-27d2/

## Azure Criterios de Aceptacion
- Fecha inicio no puede ser previa a la fecha de vigencia de la agenda ni posterior a la fecha hasta de la vigencia de la agenda. 
- Fecha hasta no puede ser previa a la fecha inicio ni posterior a la fecha hasta de la vigencia de la agenda.
 
- Validar que el rango de fecha y hora inicio con la fecha y hora hasta deben ser mayor o igual a la duración del slot.
 
- Al dar guardar se guardará la configuración del bloque de programación y se generarán los slot en la agenda. Generando los slot variables que se configuraron en el bloque. Dando como mensaje confirmación exitosa: "Se agregó bloque de programación (Nombre de la agenda)".
 
- Por default al crear un bloque de programación este debe quedar en estado activo. 
 
- No debe permitir guardar la configuración si esta no cuenta con al menos una práctica asociada. 
- Si las practicas agregadas no tienen tiempo de duración, por defecto se agrega 15 min. 
- Si ya existe un bloque activo que se superpone con este, (días y horarios) se debe verificar y realizar el cambio de datos 
- Si el lugar de atención se encuentra ocupado por otro profesional, se debe verificar y realizar el cambio de lugar

## Azure Tasks
- Task 11295: Analisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 11296: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14174: Diseño de interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 15204: Revisión de HU | Estado: Done
 - Asignado a: Manuel Rolando Alvarez



