# HU 16967 - Cargar Feriados x Base(BBDD)

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_16964_CALENDARIOS-FERIADOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16967/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: Tener identificados en base de datos los días feriados en el año Para: Poder validar la asignación de turnos a paciente excluyendo estos días. 

 Descripción y comportamiento: Se requiere crear una base con los días feriados, no laborables y días turísticos donde se tenga identificado los siguientes datos: - Año (yyyy) (*) 
- Fecha (día y mes) (*) 
- Día de la semana (*) 
- Tipo de Festividad (*) 
- Observaciones 
- Condicional. 
Laborable (*) 
 Se adjunta un excel con estos datos para el año 2025. 
 
 
 

 
 
 
 
 
 
 
 
 Días feriados, no laborables y
 turisticos en Argentina para el año 2025 
 
 
 
 
 Año 
 Fecha 
 Día de la semana 
 Festividad 
 Observaciones 
 condicional 
 laborable 
 
 
 2025 
 1 de enero 
 Miércoles 
 Año Nuevo 
 Inamovible 
 
 NO 
 
 
 2025 
 3 de marzo 
 Lunes 
 Carnaval 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 4 de marzo 
 Martes 
 Carnaval 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 24 de marzo 
 24 de marzo 
 Día de la Memoria por la Verdad y la Justicia 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 2 de abril 
 Miércoles 
 Día del Veterano y de los caídos en
 la guerra de Malvinas 
 Inamovible 
 
 NO 
 
 
 2025 
 14 de abril 
 Lunes 
 Primeros dos días de
 la Pascua Judía 
 
 b 
 SI 
 
 
 2025 
 17 de abril 
 Jueves 
 Jueves Santo 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 18 de abril 
 Viernes 
 Viernes Santo 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 1 de mayo 
 Jueves 
 Día del Trabajador 
 Inamovible 
 
 NO 
 
 
 2025 
 2 de mayo 
 Viernes 
 Feriado turístico 
 Día no laborable con
 fines turísticos. 
 
 NO 
 
 
 2025 
 25 de mayo 
 Domingo 
 Día de la Revolución
 de Mayo 
 Cae domingo 
 
 NO 
 
 
 2025 
 16 de junio 
 Martes 
 Paso a la
 Inmortalidad del Gral. Don Martín Miguel de Güemes 
 Posibilidad de
 trasladarse al 16/6 
 
 NO 
 
 
 2025 
 17 de junio 
 Martes 
 Paso a la
 Inmortalidad del Gral. Don Martín Miguel de Güemes 
 Posibilidad de
 trasladarse al 16/6 
 
 SI 
 
 
 2025 
 20 de junio 
 Viernes 
 Paso a la
 Inmortalidad del Gral. Manuel Belgrano 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 26 de junio 
 Jueves 
 Año Nuevo
 Islámico 
 
 c 
 SI 
 
 
 2025 
 9 de julio 
 Miércoles 
 Día de la
 Independencia 
 Inamovible 
 
 NO 
 
 
 2025 
 17 de agosto 
 Domingo 
 Paso a la
 Inmortalidad del Gral. José de San Martín 
 Posibilidad de
 trasladarse al 18/8 LUNES 
 
 NO 
 
 
 2025 
 18 de agosto 
 Lunes 
 Paso a la
 Inmortalidad del Gral. José de San Martín 
 Posibilidad de
 trasladarse al 18/8 LUNES 
 
 NO 
 
 
 2025 
 23 de septiembre 
 Martes 
 Año Nuevo Judío 
 Días no laborables 
 b 
 SI 
 
 
 2025 
 24 de septiembre 
 Miercoles 
 Año Nuevo Judío 
 Días no laborables 
 b 
 SI 
 
 
 2025 
 2 de octubre 
 Jueves 
 Día del Perdón 
 Días no laborables 
 b 
 SI 
 
 
 2025 
 12 de octubre 
 Domingo 
 Día del Respeto a la
 Diversidad Cultural 
 Posibilidad de
 trasladarse al 13/10 LUNES 
 
 NO 
 
 
 2025 
 21 de noviembre 
 Viernes 
 Día no laborable con
 fines turísticos 
 
 
 NO 
 
 
 2025 
 20 de noviembre 
 Jueves 
 Día de la Soberanía
 Nacional 
 Inamovible
 --trasladarse del 20 al 24 
 
 SI 
 
 
 2025 
 24 de noviembre 
 Lunes 
 Día de la Soberanía
 Nacional 
 Inamovible
 --trasladarse del 20 al 24 
 
 NO 
 
 
 2025 
 8 de diciembre 
 Lunes 
 Día de la Inmaculada
 Concepción de María 
 Fin de semana largo 
 
 NO 
 
 
 2025 
 25 de diciembre 
 Jueves 
 Navidad 
 Inamovible 
 
 NO 
 
 Nota (*): ?<Dato obligatorio Leyendas (condicionales) (a) Ley Nº 26.199 dictada en conmemoración del genocidio sufrido por el pueblo armenio. 
 (b) Sólo para habitantes que profesen la Religión Judía.
 (c) Solo para los habitantes que profesen la Religión Islámica.
 (d) Los fines de semana con fines turísticos conforme lo prescriptos por el art. 7

## Azure Criterios de Aceptacion
- La base debe ser flexible a edición, ya que hay registros de días feriados que puede ser trasladados de días. 
- Se debe poder agregar cada nuevo año, los registros feriados para dicho año.

## Azure Tasks
- Task 23497: BD - creación inserts | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 16968: Análisis, Diseño y Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23554: Carga de datos | Estado: Done
 - Asignado a: Eduardo Ynoub



