# HU 14504 - Especificación técnica integración al módulo convenio

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11906_EVENTOS-DE-COBRO-DESDE-ADMSION-CAJA-FACTURACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14504/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Procesos ODI Asistencial 

Quiero: Especificar los requerimientos técnicos Para: Consultar mediante integración al módulo de convenio. 

 

Descripción y comportamiento:
 

 

Datos a enviar a convenio para obtener las normas operativas de las prácticas realizadas desde ODI: 

 

Datos relacionados al convenio 

 

- id_plan (int) (*) 
- id_financiador (*) 
- filial 
- capita 
- tipo_iva (*) 
- id_prestador (* 
- id_ambito (*) 
 Datos de la prácticas realizadas: (array) 

 

id_practica (int) (*) 
codigo_practica (varchar) (*) 
nombre_practica (varchar) (*)
 
 
 Nota (*) es un dato obligatorio
 
 

En el proceso de consulta al servicio de convenios, se debe realizarse un proceso de mapeo para homologar de las practicas con respecto a las prestaciones que maneja el módulo de convenios, debido a que las practicas que se usan en turnos y admisión están codificadas de acuerdo a la estructura de Sistemas Clínicos. Ver flujo en el modelo lógico. 
 
 Una vez homologadas y consultadas las prácticas, el servicio de convenios debería devolver los siguientes datos: 
 Datos solicitados: Según las normas operativas por cada prestación se debe obtener: id_prestacion_odi 
nombre_prestacion_odi (Prestación catalogo) 
codigo_prestacion_odi (Prestación catalogo)
 
id_practica_sc
 
nombre_practica_sc 
tipo_valorización
 
monto_prestación 
porcentaje_cobertura 
monto_porcentaje_cobertura(Calculo del valor a pagar en base al porcentaje convenido sobre monto_prestación)
 
monto_copago (si aplica) 
tipo_autorización_requerida (si aplica) 
documentación_requerida 
monto_total_prestaciones 
monto_total_copago 
 
 Una vez confirmada y procesada la información al admitir el paciente, se deben tomar los siguientes campos para armar los eventos de cobros, de a acuerdo a las tablas que se creen para almacenar los datos (ver modelo lógico tentativo) para admisión y practicas admitidas. 
 Modelo DER - Tentativo, tipo ejemplo del flujo lógico. https://dbdiagram.io/d/HOMOLOGACION-PRACTICAS-PRESTACIONES-673cda9be9daa85aca0337b0 
 Datos que se requieren armar para enviar los eventos de cobros. (los nombres de las tablas pueden variar de acuerdo a lo que diseñe por el equipo de base de datos (diseño técnico), ver modelo tentativo -modelo ejemplo. 
 id_episodio este dato se toma del campo "id" de tabla Admision_ODI (tabla del modelo tentativo) 
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
 
 * Nota: En el proceso de admisión, las prácticas que les realizan al paciente, están codificadas de acuerdo a la estructura de Sistemas Clínicos, por eso se requiere un proceso de mapeo (homologación) contra las prestaciones de ODI, para poder facturar desde sistemas ODI, ver flujo en el modelo lógico planteado.

## Azure Criterios de Aceptacion
- Con el análisis técnico realizado para especificar a detalle los datos que se deben a enviar a convenios, los que nos debe devolver y de acuerdo a los procesos requeridos en los eventos de cobro; se requiere con esta HU, actualizar el servicio que consulta a convenio realizado e Product Backlog Item 11917: Consulta al módulo de convenio desde admisión.

## Azure Tasks
- Task 22617: BD - Insertar nuevo componente copago | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14505: Reunión para determinar especificación técnica de integración a convenios | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 22623: BD - GRANTs usuario odi_usr_facturacon en tm_practicas | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 22706: Error al intentar armitir un paciente | Estado: New
 - Asignado a: Eduardo Ynoub
- Task 16465: Modificacion del SP Obtener normas operativas | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14558: Crear estructura para integrarse al convenio | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



