# Feature 11690 - Lista de espera de pacientes admitidos

- Estado: Done
- Epic: HISTORIA CLINICA AMBULATORIA (11689)
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11690/

## PBIs
- PBI 11707: Selección del servicio asignado al profesional | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11707/
- PBI 11708: Validación de agenda activa y selección de lugar de atención | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11708/
- PBI 11709: Visualización de pacientes asignados y sus estados | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11709/
- PBI 11712: Selección y acceso a HCA de paciente (sin llamador) | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11712/
- PBI 11713: Comunicación con llamador de sala de espera | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11713/
  - Ya implementado: botón megáfono + modal + llamada con validación EN_ATENCION
- PBI 11714: Gestión de paciente en teleconsulta | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11714/
  - Sin contenido en Azure → marcada como Done
- PBI 11715: Visualización de turnos tomados a futuro | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11715/
  - Ya implementado: componente TurnosProximosPaciente + endpoint GET turnos/pacientes/{id}/turnos
- PBI 11717: Gestión de mensajería offline con pacientes | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11717/
  - Sin contenido en Azure → marcada como Done
- PBI 11718: Indicadores del profesional de atención ambulatoria | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11718/
  - Sin contenido en Azure → marcada como Done
- PBI 11719: Buscar paciente fuera de agenda (sin admisión) | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11719/
  - Implementación: botón "Buscar Paciente" en header + modal búsqueda por tipo/nro documento + fallback búsqueda por set mínimo (nombre, apellido, fecha nacimiento, sexo) + selección redirige a HC + rol Medico en PersonasController
- PBI 14922: Llamar Paciente desde su Listado al Lugar de Atención (megáfono) | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14922/
- PBI 15127: Visualización del detalle del paciente | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15127/
  - Ya implementado: modal vista rápida (👁) con datos del turno
- PBI 16869: Incremento Funcional HU 14922 - Llamar Paciente desde su Listado al Lugar de Atención (megáfono) | Estado: Done
  URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16869/
  - Ya implementado: validación EN_ATENCION conflict + popup con paciente actual
