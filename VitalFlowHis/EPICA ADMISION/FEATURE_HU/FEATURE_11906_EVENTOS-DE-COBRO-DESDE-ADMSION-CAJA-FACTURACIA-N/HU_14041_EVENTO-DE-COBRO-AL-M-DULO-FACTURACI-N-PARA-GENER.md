# HU 14041 - Evento de cobro al módulo facturación para generar cargos al financiador

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11906_EVENTOS-DE-COBRO-DESDE-ADMSION-CAJA-FACTURACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14041/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Generar un evento de cobro al módulo de facturación Para: Al confirmar la admisión se informe de los cargos a facturar al financiador al cierre de mes. 

 

Descripción y comportamiento: Al confirmar la admisión de un paciente y tenga prácticas a realizarse estén convenidas con su financiador, se debe generar la información correspondiente de cobro mediante un servicio de integración al módulo de facturación, con el objetivo de que el área de facturación pueda emitir la factura a los correspondientes financiadores; proceso que suele hacerse en los cierre de cada mes. 

 

Información para armar el evento de cobro: 

id_episodio este dato se toma del campo "id" de tabla Admision_ODI 
id_paciente se toma del campo "id_paciente" de tabla Admision_ODI
 
nombre1_paciente se toma del campo "nombre1_paciente"de tabla Admision_ODI 
nombre2_paciente se toma del campo "nombre2_paciente"de tabla Admision_ODI
 
apellido1_paciente se toma del campo "apellido1_paciente"de tabla Admision_ODI 
apellido2_paciente se toma del campo "apellido2_paciente" de tabla Admision_ODI
 
id_tipo_documento se toma del campo "id_tipo_documento" de tabla Admision_ODI 
nro_documento se toma del campo "numero_documento" de tabla Admision_ODI 
numero_afiliado se toma del campo "numero_afiliado" de tabla Admision_ODI
 
fecha_nacimiento se toma del campo "fecha_nacimeinto" de tabla Admision_ODI
 
id_prestador se toma del campo "id_prestador" de tabla Admision_ODI 
id_ambito se toma del campo "id_ambito" de tabla Admision_ODI 
id_plan se toma del campo "id_plan" de tabla Admision_ODI 
id_filial se toma del campo "id_filial" de tabla Admision_ODI 
id_capita se toma del campo "id_capita" de tabla Admision_ODI 
id_financiador se toma del campo "id_financiador" de tabla Admision_ODI 
fecha_ingreso se toma del campo "fecha_ingreso" de tabla Admision_ODI
 
hora_ingreso se toma del campo "hora_ingreso" de tabla Admision_ODI
 
id_estado_episodio se toma del campo "id_estado_episodio" de tabla Admision_ODI
 
id_tipo_iva se toma del campo "id_tipo_iva" de tabla Admision_ODI 
 
id_gerenciador se toma del campo "id_gerenciador" de tabla Admision_ODI 
motivo se toma del campo "motivo" de tabla Admision_ODI 
historia_clinica se toma del campo "historia_clinica" de tabla Admision_ODI 
id_metodo_registro se toma del campo "id_metodo_registro" de tabla Admision_ODI 
codigo_diagnostico se toma del campo "codigo_diagnostico" de tabla Admision_ODI 
nombre_diagnostico se toma del campo "nombre_diagnostico" de tabla Admision_ODI 
practicas_admisión Las practicas debe tener un proceso de mapeo (homologación) contra las prestaciones que maneja ODI para facturación. * Ver nota y modelo lógico tentativo. 
 

 

 La acción del evento de cobro se generará al admitir al paciente desde el botón "CONFIRMAR ADMISI "N", como se muestra a continuación. 
 
 
 * Nota: En el proceso de admisión, las prácticas que les realizan al paciente, están codificadas de acuerdo a la estructura de Sistemas Clínicos, por eso se requiere un proceso de mapeo (homologación) contra las prestaciones de ODI, para poder facturar desde sistemas ODI. 
 
 
 Modelo DER tentativo para tomar datos de admisión y generar eventos de cobro. https://dbdiagram.io/d/HOMOLOGACION-PRACTICAS-PRESTACIONES-673cda9be9daa85aca0337b0

## Azure Criterios de Aceptacion
- El evento de cobro a facturación debe generarse desde el botón para admitir un paciente.

## Azure Tasks
- Task 14064: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14300: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14065: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



