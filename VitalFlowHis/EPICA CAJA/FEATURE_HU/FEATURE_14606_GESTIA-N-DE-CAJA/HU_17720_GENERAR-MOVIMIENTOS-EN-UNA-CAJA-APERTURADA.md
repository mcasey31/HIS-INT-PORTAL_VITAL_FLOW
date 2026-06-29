# HU 17720 - Generar movimientos en una caja aperturada

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17720/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Cajero(a) 

Quiero: Crear un movimiento en una caja apertutada. Para: Realizar un retiro de efectivo de una caja asignada al cajero. 

 

 

Descripción y comportamiento: Desde la consulta de movimientos HU ITEM 14824, se cuenta con el botón "GENERAR MOVIMIENTO", el cual abrira un modal que permitira registrar un movimiento en una caja activa. Este botón debe estar visible solo para los usuarios con rol de cajeros, ver mockup 

 

 

 

 

 

Al accionar el botón, se abrirá un modal que mostrará los datos del cajero que está generando el movimiento, junto con la información de la caja aperturada por el usuario, incluyendo su estado y ciclo vigente. Dentro del modal se deberán registrar los datos correspondientes al movimiento de extracción de efectivo. (Por el momento, solo estará disponible la opción de retiro de efectivo de una caja). 

 

En el modal debe venir predeterminado con una cabecera(franja de color celeste) con la información antes mencionada, y con el titulo "Generar Movimiento". Ver mockup 

 

 

 Para generar el movimiento se debe registrar los siguientes datos: 

 

- Tipo de Movimiento: (campo tipo select - Vendrá por default "Retiro" e inabilitado para seleccionar otro tipo de movimientos) *
 
- Motivo: (campo tipo texto max 100c: descripción clara del motivo (ej. Extracción de efectivo por gastos operativo)) * 
 
- Destinatario: (campo tipo select - "Coordinador, Tesoriria") 
 
- Monto: (campo tipo money, importe del movimiento.) *
 
 
 En la creación del movimiento se deben tener en cuenta las siguientes consideraciones para el registro: - Responsable del ajuste: Por default (usuario de sistema) * 
- Fecha y hora: Por default la fecha y hora en que se registra el movimiento. * 
 
 Una vez que se complete los datos obligatorios y se haya evidenciado que la caja esata abierta, se podrá habilitar el botón del modal "GENERAR MOVIMIENTO". ver mockup 
 
 
 
 Luego de generar el movimiento, se habilitará la opción de imprimir un reporte duplicado, con el fin de dejar constancia tanto del retiro realizado por el cajero como de la entrega del efectivo al destinatario. Para esta acción, será necesario diseñar un reporte que incluya los datos del movimiento de ?oRetiro ? , correspondiente a la extracción de efectivo de la caja. 
 Dado que en esta etapa del proyecto el reporte no cuenta con otras opciones de descarga, el modal no ofrecerá la posibilidad de cerrarlo ni cancelarlo. Permanecerá activo hasta que se realice la impresión del comprobante, ya sea guardándolo en PDF o imprimiéndolo en papel. Ver Mockup. 
 
 
 
 Al imprimir se debe visualizar en PDF el siguiente reporte: 
 
 
 Una vez finalizado el proceso de creación del movimiento y la impresión del reporte, se debe retornar a la grilla de movimientos, mostrando la lista actualizada e incluyendo el nuevo movimiento registrado. Ver mockup. 
 
 
 
 
 
 En caso de que la caja esté cerrada, al abrir el modal de generación de movimientos, los campos del formulario y el botón ?oGENERAR MOVIMIENTO ? deberán permanecer deshabilitados. Solo el botón ?oCANCELAR ? estará activo, para que el cajero salga y realice primero la apertura de la caja. 
 
 
 
 
 
 En el caso de generar un error al tratar de generar el movimiento, se debe alertar mediente tooltip como se indica en el mockup. 
 
 
 
 
 https://xd.adobe.com/view/706308cc-4d5b-4036-81e0-dc1044a403fb-2530/

## Azure Criterios de Aceptacion
- Para generar un movimiento en una caja, esta debe estar abierta. 
- El cajero solo podrá crear movimientos a la caja que tiene aperturada. 
- Solo el rol de cajeros podrá crear movimientos sobre sus cajas. 
- En esta instancia, solo se podrá generar movimientos de tipo "RETIRO", con clase de movimiento "Egreso" y como concepto lo que es especifica en el campo motivo del modal. 
- Se debe crear el reporte para dejar constancia fisica del retiro

## Azure Tasks
- Task 22612: UX - Mockup Generar movimientos desde caja aperturada | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 20276: Analisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



