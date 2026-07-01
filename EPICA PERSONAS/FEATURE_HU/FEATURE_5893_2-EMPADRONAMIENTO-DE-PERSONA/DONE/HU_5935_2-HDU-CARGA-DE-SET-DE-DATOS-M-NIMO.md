# HU 5935 - 2. HdU- Carga de set de datos mínimo

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5935/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de sistema ODI 

 Quiero: Cargar set de datos mínimo 

 Para: Realizar empadronamiento 

 

 Descripción y comportamiento: 

 Desde el proceso de empadronamiento de personas, en la pantalla de carga de datos contaremos con los siguientes marcos de registro (pantalla 1): 

 

 Marco de encabezado: (ver HdeU) 

 Empadronar persona: ? 

 Nombre (autocomplete, arrastrar datos desde modal de búsqueda) (campo de texto libre) * ? 

 
Otro nombre (campo de texto libre) ? 

 
Apellido (autocomplete, arrastrar ? ) (campo de texto libre) * ? 

 
Otro apellido (campo de texto libre) ? 

 
Nombre social (campo de texto libre) ? 

 
Tipo de documento (select) (autocomplete, arrastrar ? ) ? (DNI, CUIL, CUIT, Cédula de Identidad Pais Limitrofe, Pasaporte, DNMadre) * ? 

 
Numero de documento (autocomplete, arrastrar ? ) (texto) * ? 

 
Fecha de nacimiento (autocomplete, arrastrar ? ) (date) (dd/mm/aaaa) * ? 

 
Sexo biológico (select) (autocomplete, arrastrar ? ) ? (masculino, femenino, indeterminado) * ? 

 
Género autopercibido (select) (Hombre o masculino, Mujer o femenino, No binario, Prefiere no responder) ? 

 
 *Campos de carácter obligatorio ? 

 

 El set de datos mínimos vendrá cargado con los datos de la búsqueda que originó la llamada al módulo de empadronamiento (Tipo y numero de documento-Nombre(s) y apellido(s)-Fecha de nacimiento-sexo biológico). 

 SI la búsqueda de candidatos se realizó mediante el escaneo de DNI, los únicos campos editables serán Nombre (s) y Apellido (s) y el check de ?opresenta documentación ? quedará seleccionado e inhabilitado. 

 Para editar los campos precargados con datos de la búsqueda, se deberá hacer click en el icono de edición (lápiz). Al hacer click en el "lapiz" el sistema alertará con un mensaje modal que diga "Si edita un dato de este campo se realziará una nueva búsqueda de candidatos" con un unico botón de Aceptar que cierra el modal y habilitará la edición en ese campo. Cuando se termine de editar uno de estos campos y el elemento en pantalla pierda foco, el sistema realizará una nueva búsqueda de candidatos con los datos actuales, de haber sido modificados. Si hubiera candidatos que coincidan con los nuevos datos de búsqueda se presentará una ventana modal con los candidatos que presenten coincidencia, (HdU) . Si se selecciona un candidato, se volverá a la pantalla desde donde se disparó la búsqueda originalmente. Si se cancela esta pantalla se volverá a la de búsqueda de candidatos. Si la nueva búsqueda con los datos editados no arroja ningún candidato, el proceso de empadronamiento seguirá adelante e informará en pantalla un mensaje modal "No se encontraron candidatos con los nuevos datos de búsqueda" con un botón de Aceptar que cierra el modal.. 

 Estados posibles de empadronamiento de personas: 

 Carga de datos manual (Trascripción) 

 
 1.1) Con presentación de documentación (Estado Permanente) 

 1.2) Sin presentación de documentación (Estado Temporal) 

 Escaneo DNI (Estado Validado) 

 
 

 Esta historia continua en: 

 Carga de datos de contacto: ? (ver HdeU) 

 
Carga de dirección: ? (ver HdeU) 

 
Carga de persona de contacto: ? (ver HdeU) 

 
 

 Link de pantallas: 

 Buscar persona (adobe.com) (pág. 11)

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 - Por proceso para iniciar cualquier empadronamiento, siempre se debe realizar primero una búsqueda de candidatos 
- Los datos del set de datos mínimo deberán venir precargados desde la búsqueda de candidatos. 
- Si se escanea DNI los datos editables para el empadronamiento serán exclusivamente nombre, otros nombres, apellido, otros apellidos. 
 

 - Si se editaran campos de set de datos minimo provenientes de la busqueda, se debera lanza run nueva busqueda de candidatos con los datos cambiados (si se hubiera cambiado algo) al momento de perder foco el campo en cuestion. 
- Si la busqueda no arroja candidatos sigue el empadronamiento avisando que no nhay resultados 
- Si la busqueda arroja candidatos, el proceso de empadronamiento se interrumpe, el usuario debera seleccionar un candidato, y volver al modulo de llamada original (adimision por ejemplo) o a la pantalla de busqueda de candidatos en el caso de cancelar estos resultados

## Azure Tasks
- Bug 7190: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Temporal - Error en la Grilla de Información | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7186: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Validado - Error Grilla de Informacion | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6283: FE-Pruebas unitarias | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6529: QA - Verificar la existencia del icono de edición (lápiz) en cada campo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6491: QA - Ejecucion de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 7107: QA - Verificar nueva búsqueda de candidatos luego de la Edicion (lapiz) - Candidato Coincidente - Error al Enter | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6531: QA - Verificar nueva búsqueda de candidatos luego de la Edicion (lapiz) - Candidato Coincidente | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6555: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Inactivo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6209: FE-Disparar búsqueda de personas en edición de uno de los datos del set de datos minimos | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7196: QA - Verificar el funcionamiento del campo Genero Autopercibido - La descripcion No se ve completa | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6624: BE - Unit Test Empadronar Persona | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Task 6542: BE - obtener tipo genero autopercibido | Estado: Done
 - Asignado a: Maximiliano Ezequiel Rios
- Task 6208: FE-Nueva funcionalidad en inputs. Botón editar | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7215: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - Temporal - Error en el Modal | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6623: BE - Empadronar Persona | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Bug 7192: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Permanente - Error en Grilla de Informacion | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6526: QA - Verificar Datos Precargados del Set de Datos Minimos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7195: QA - Verificar el funcionamiento del campo Genero Autopercibido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6530: QA - Verificar el funcionamiento del Icono de Edición (lapiz) - Nueva Busqueda de Candidatos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7095: QA - Verificar el funcionamiento del Icono de Edición (lapiz) - Nueva Busqueda de Candidatos - Error Boton Aceptar | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6490: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 6207: FE-Integración combos | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7217: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - palabra permanente incompleta - Error en Modal | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7205: QA - Verificar el funcionamiento del Icono de Edición (lapiz) - Nueva Busqueda de Candidatos Failed - Error Descripción del Error | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 7685: QA - En Set de datos Minimos verificar el funcionamiento de los campos Tipo de Documento, Fecha de Nacimiento, Sexo Biologico | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7155: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - Inactivo - Error | Estado: Done
- Bug 7213: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - Validado - Error en Modal | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7124: QA - Verificar nueva búsqueda de candidatos luego de la Edicion (lapiz) - Candidato NO Coincidente" - Error Boton Aceptar | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 6947: DEV - FE - Falta dato cargaPorEscaneoDNI en la carga set de datos mínimos | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 7163: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Temporal | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7165: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - Validado | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6528: QA - Verificar Pantalla con campos del Set de Datos Minimos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7166: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - Temporal | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6556: QA - Verificar luego del Escaneo de DNI los campos Editables | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7116: DEV - FE - Si se escanea dni nombres y apellidos únicos datos editables | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7686: QA - En Set de datos Minimos verificar el funcionamiento de los campos Tipo de Documento, Fecha de Nacimiento, Sexo Biologico - Error Mensaje en Pantalla | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 6206: FE-Maquetado formulario set de datos minamos | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 7151: QA - Verificar los estados posibles en el Empadronamiento de Persona - Luego de la Edicion (lapiz) - Inactivo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6527: QA - Verificar el check de ?opresenta documentación ? luego del Escaneo de DNI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7164: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Permanente | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6543: BE - Unit Test obtener tipo genero autopercibido | Estado: Done
 - Asignado a: Maximiliano Ezequiel Rios



