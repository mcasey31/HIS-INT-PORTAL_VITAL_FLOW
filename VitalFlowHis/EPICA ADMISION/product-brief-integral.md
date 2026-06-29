# Product Brief Integral - EPICA 11177 ADMISION

## Contexto
La epica ADMISION cubre el ingreso del paciente, validaciones iniciales y reglas operativas para iniciar la atencion con trazabilidad y calidad de datos.

- Epic ID: 11177
- Epic nombre: ADMISION
- Link Azure: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11177/

## Objetivo de negocio
Optimizar el flujo de admision para disminuir tiempos de espera, aumentar calidad de registro y mejorar continuidad operativa.

## Alcance funcional
- Entrada de paciente con y sin turno.
- Identificacion de paciente, cobertura y practicas.
- Manejo de estados y reglas de operacion.

## HUs base de la epica
### HU/Feature 13275 - Landing Solapa Admision
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/13275/
- Resultado: vista inicial operativa para gestionar admisiones.

### HU/Feature 11891 - Identificacion de Paciente y Cobertura
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11891/
- Resultado: validacion de identidad y financiacion en el ingreso.

### HU/Feature 13229 - Estados de Pacientes
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/13229/
- Resultado: trazabilidad del estado durante el circuito de admision.

### HU/Feature 12163 - Arribo Paciente Con Turno (Admisión Programada)
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12163/
- Resultado: check-in agil para pacientes con turno reservado.

### HU/Feature 11903 - Identificación Prácticas
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11903/
- Resultado: asociacion correcta de practicas al episodio de admision.

### HU/Feature 11904 - Norma Operativa
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11904/
- Resultado: reglas de negocio unificadas para el front operativo.

### HU/Feature 12165 - Arribo Paciente Sin Turno (Admision Espontánea)
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12165/
- Resultado: admision no programada con priorizacion y control.

### HU/Feature 11901 - Integracion Financiadores
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11901/
- Resultado: validacion de elegibilidad y consistencia de cobertura por integracion.

### HU/Feature 11906 - Eventos de Cobro desde Admsion - Caja / Facturacion
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11906/
- Resultado: generacion de eventos de cobro trazables para paciente, convenio y facturacion.

### HU/Feature 11909 - Encuentro
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11909/
- Resultado: creacion y actualizacion del encuentro asistencial alineado al circuito de admision.

### HU/Feature 14928 - HU generales
- Link: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14928/
- Resultado: funcionalidades transversales de soporte para el ciclo de vida del paciente.

## Criterios de exito
- Menor tiempo promedio de admision.
- Mayor % de admisiones sin errores de identificacion.
- Menor cantidad de correcciones posteriores al ingreso.

## Riesgos clave
- Reglas inconsistentes entre sedes o servicios.
- Integraciones incompletas con cobertura/financiadores.

## Supuesto de relevamiento
En esta vista de backlog no se mostraron PBIs/User Stories de nivel inferior; se tomaron los Features visibles como HUs base para el brief.