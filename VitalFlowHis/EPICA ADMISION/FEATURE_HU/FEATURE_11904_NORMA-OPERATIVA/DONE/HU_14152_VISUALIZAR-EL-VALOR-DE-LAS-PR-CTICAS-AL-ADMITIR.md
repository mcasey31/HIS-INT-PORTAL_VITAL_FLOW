# HU 14152 - Visualizar el valor de las prácticas al admitir un paciente - Desarrollada en otra HU (revisar)

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14152/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Conocer el valor de la consulta Para: Generar el encuentro(admisión confirmada) o generar un evento de caja para que el paciente pueda abonar su atención. 

 Descripción y comportamiento: Una vez consultado el servicio de convenios en el proceso de admitir un paciente HU:11917, y este devuelva los valores de las prácticas, estos deben mostrarse en pantalla como se explica a continuación: 
 De acuerdo a los posibles escenarios explicados en la HU:15377, Hay dos casos para mostrar los valores de las prácticas y qué evento se ejecutará. 
 Primer caso: se atribuye al primer escenario de la HU: 15377: Generador de eventos de cobro al admitir un paciente. El valor de la consulta se mostrara en cero y se indicara que esta 100% convenida, como se indica en el mockup y se confirma la admisión desde al botón "CONFIRMAR ADMISI "N" 
 Datos y Valores a mostrar: - Valor de consulta: Prácticas 100% convenidas por el financiador. Como se indica el mockup. 
- Valor total de la consulta (se toma del campo monto_total_prestaciones de la HU:14504: Especificación técnica integración al módulo convenio) 
- Total a Pagar: Para este escenario se especifica en $0.00 
 Acción de los botones: - Botón Salir: Sale de la pantalla y regresa a la grilla de búsqueda de paciente. Cancela lo realizado. 
- Botón Anterior: Regresa a la pantalla de agregar o quitar prácticas. Mantiene datos e imágenes ingresadas. 
- Botón Confirmar Admisión: Ejecuta el primer escenario de la HU: del 15377: Generador de eventos de cobro al admitir un paciente. 
 
 Segundo caso: se atribuye a los escenarios dos y tres de la HU: 15377: Generador de eventos de cobro al admitir un paciente. 
 El valor de la consulta indicará el valor por práctica y total a cancelar por caja, como se indica en el mockup y se generará el evento a caja desde al botón "GENERAR EVENTO DE CAJA"
 
 
 Datos y Valores a mostrar: Valor de consulta: Mostrar los valores de las prácticas en una grilla: en la columna1 se indica el nombre de la práctica, en la columna2 el Copago: "monto_porcentaje_cobertura", se toman de la HU:4504: Especificación técnica integración) 
Total: Valor que el paciente debe pagar en caja (monto_total_copago de la HU: 14504). Al lado del monto total a pagar, debe visualizarse el símbolo del lápiz, sin acción (Se desarrollará en la HU 16081). 
 Acción de los botones: - Botón Salir: Sale de la pantalla y regresa a la grilla de búsqueda de paciente. Cancela lo realizado. 
- Botón Anterior: Regresa a la pantalla de agregar o quitar prácticas. Mantiene datos e imágenes ingresadas. 
- Botón Generar Evento de Caja: Ejecuta el escenario dos o tres de la HU:15377: Generador de eventos de cobro al admitir un paciente. 
 
 Acción mutua de ambos casos: Una vez que se ejecute el botón de Confirmar Admisión o Botón Generar Evento de Caja, se debe emitir una respuesta, evidenciando si se generó o no la acción, debe mostrarse en un tooltip el mensaje y luego deberá redireccionar a la grilla de pacientes admitidos. Ver los mockups. El Mensaje del tooltip debe hacer referencia al escenario que se este desarrollando, ya sea "Confirmar Admisión" o "Generar Evento de Caja". 
 
 Evento OK
 
 
 
 
 
 Error al generar el evento.
 
 
 https://xd.adobe.com/view/fd77a7b3-765d-4189-a3d8-463b8f4d0f94-a824/

## Azure Criterios de Aceptacion
- Se debe visualizar los totales por práctica, total a abonar por consulta y total a pagar por caja, en caso de aplicar, de lo contrario mostrar en cero. 
- Se debe totalizar el valor a pagar por el paciente, en caso de aplicar, 
- Los botones de acción pueden variar de acuerdo a los escenarios que resulta de la consulta de convenio. 
- Una vez que se ejecute el botón de confirmar admisión o generador de evento, este debe alertar si se genero la acción o no, y redireccionará a la grilla de admitidos, en caso de ser positiva la acción.

## Azure Tasks
- Test Case 23594: QA - Validar el valor de la consulta cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23605: QA - Validar botón "SALIR" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23615: QA - Validar el toast de información "Se admitió al paciente XXX y queda en Sala de espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23596: QA - Validar el valor de la consulta cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23601: QA - Validar el campo "Total a pagar" cuando la práctica NO está convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23603: QA - Validar botón "SALIR" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23595: QA - Validar el valor de la consulta cuando la práctica NO está convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23604: QA - Validar botón "SALIR" cuando la práctica NO está convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23619: QA - Validar el formato y la longitud en cada campo cuando la práctica NO esté convenida, o tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23610: QA - Verificar que NO exista el botón "CONFIRMAR ADMISI "N" cuando la práctica NO esté convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23608: QA - Validar botón "ANTERIOR" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23607: QA - Validar botón "ANTERIOR" cuando la práctica NO está convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23602: QA - Validar el campo "Total a pagar" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14270: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16690: Diseño tecnico | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23482: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23612: QA - Validar botón "GENERAR EVENTO DE CAJA" cuando la práctica NO esté convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23600: QA - Validar el campo "Total a pagar" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23618: QA - Validar el formato y la longitud en cada campo cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23616: QA - Validar el toast de información "Se generó el evento de caja al paciente XXX. Diríjase a la sección de caja para emitir el cobro" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23481: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 14230: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 23597: QA - Validar el campo "Valor total" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23611: QA - Verificar que NO exista el botón "CONFIRMAR ADMISI "N" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23617: QA - Validar el toast de información "Se admitió al paciente XXX y queda en Sala de espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23613: QA - Validar botón "GENERAR EVENTO DE CAJA" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23599: QA - Verificar que NO exista el campo "Valor total" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14229: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 23609: QA - Validar botón "CONFIRMAR ADMISI "N" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23598: QA - Verificar que NO exista el campo "Valor total" cuando la práctica NO esté convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23614: QA - Verificar que NO exista el botón "GENERAR EVENTO DE CAJA" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23606: QA - Validar botón "ANTERIOR" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder



