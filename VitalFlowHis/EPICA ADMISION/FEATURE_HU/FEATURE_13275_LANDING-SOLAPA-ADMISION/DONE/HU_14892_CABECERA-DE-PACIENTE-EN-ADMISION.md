# HU 14892 - Cabecera de Paciente en admision

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_13275_LANDING-SOLAPA-ADMISION
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14892/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: contar con la cabecera de información del paciente Para: Obtener datos relevantes que me permitan conocer su información

 
 Descripción y comportamiento 
 Luego de seleccionar un paciente para poder ser admisionado (Product Backlog Item 12996: Verificación de Elegibilidad de Forma Manual Segun Financiador Plan Asociado a Paciente), se accede a una pantalla donde se presenta una cabecera con la información del paciente. Esta cabecera debe seguir lo definido en el componente desarrollado en la historia de usuario Product Backlog Item 14034: Cabecera de paciente. Los datos que se visualizarán son: Nombres y apellidos (edad) e icono de sexo biológico 
tipo y número de documento 
Fecha de nacimiento 
Financiador Plan 
 
 
 Se tendrá un botón con ícono de flecha que, al ser presionado, desplegará información adicional del paciente.
 
 
 
 Los datos que mostrará el desplegable serán: Genero autopercibido 
teléfono 
correo electrónico 
ubicación 
dirección 
Financiador plan 
Nro de afiliado 
 Estos últimos son los que tiene seleccionados desde que fue admisionado El boton con el que contará será el de "cambiar paciente" que se explica en la HU (Product Backlog Item 13231: Cambiar paciente seleccionado) va a tener el mismo funcionamiento solo que volverá a la pantalla de admision sin el paciente buscado. 
 
 
 
 
 Link de pantalla https://xd.adobe.com/view/69c10981-9942-416b-9f36-fde239f6e051-3c92/screen/37145e9c-24b8-4a16-97e8-83c336e9515c?fullscreen

## Azure Criterios de Aceptacion
- Una vez identificado el paciente se debe mostrar la cabecera colapsada con la la información más relevante 
- Poder desplegar el resto de información del paciente 
- El boton "CAMBIAR PACIENTE" debe volver a la pantalla del buscador de paciente

## Azure Tasks
- Task 14898: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 14897: Analisis Funcional | Estado: Done
 - Asignado a: Natalia Gorriti



