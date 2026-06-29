# E2E CU1 - Persona -> Agenda -> Turno -> Admision -> Episodio

Fecha de ejecucion: 2026-06-02
Ejecutor: Copilot (asistido)
Ambiente: local docker (frontend 5175, backend 5000, postgres 5433)

## Objetivo del escenario

1. Crear persona Jorge Pascal (DNI 11444555).
2. Crear agenda TestIA para Ana Diaz con bloque martes/miercoles 18:00-20:00 cada 15 min, Clinica Medica, Practica Consulta.
3. Tomar turno de hoy 18:00 para Jorge Pascal.
4. Cambiar financiador del paciente a Swiss Plan 20 durante asignacion.
5. Admitir desde Admision y cambiar estado a En Sala de Espera.
6. Verificar creacion de episodio con datos completos.

## Bitacora de ejecucion

- [INICIO] Se inicia flujo E2E completo.
- [PERSONAS] Login admin exitoso.
- [PERSONAS] Se ejecuto enrolamiento directo para DNI 11444555.
- [PERSONAS] Datos cargados:
	- Apellido: Pascal
	- Nombre: Jorge
	- Fecha nacimiento: 1988-03-14
	- Sexo biologico: Masculino
	- Telefono: 1161234567
	- Correo: jorge.pascal@testmail.com
	- Direccion: Comuna 1, Florida 123
	- Persona contacto: Maria Pascal (DNI 22333444), tel 1155566677, mail maria.pascal@testmail.com
- [PERSONAS] Resultado: Persona empadronada Pascal, Jorge (DNI 11444555) con popup de confirmacion.
- [AGENDA] Se ingresa a Gestion de agendas con Centro Ambulatorio Central / Clinica Medica / PROFESIONAL / Diaz, Ana - MP123.
- [AGENDA] Se intenta crear agenda TestIA con rango solicitado 2026-06-01 a 2016-06-30.
- [AGENDA] Resultado validacion: "FechaDesde no puede ser menor al dia de hoy". Se ajusta rango operativo a 2026-06-02 a 2026-06-30 para continuar E2E.
- [AGENDA] Agenda creada: TESTIA - TestIA.
- [AGENDA] Bloque fijo creado en TESTIA:
	- Nombre: Bloque TestIA M-X
	- Vigencia: 2026-06-02 a 2026-06-30
	- Dias: Martes y Miercoles
	- Horario: 18:00:00 a 20:00:00
	- Duracion turno: 15 min
	- Practica: Consulta general (15 min)
- [AGENDA] Confirmacion UI: "Bloque de programacion guardado: Bloque TestIA M-X (tipo FIJA)."
- [TURNOS] Paciente identificado: Pascal, Jorge (DNI 11444555).
- [TURNOS] Financiador actualizado a Swiss Medical - SMG20, afiliado SMG20-11444555.
- [TURNOS] Observacion tecnica: selectores de disponibilidad retornan vacios cuando no hay agendas activas y visibles para contact center; requiere activar agenda para continuar asignacion.
- [AGENDA] Ajuste de estado para continuidad E2E: agenda TESTIA pasa a estado Activa (visible para contact center).
- [TURNOS] Disponibilidad encontrada para 2026-06-02: slots 18:00 a 19:45 cada 15 min (8 horarios).
- [TURNOS] Slot 18:00 seleccionado y asignado para Pascal, Jorge.
- [TURNOS] Confirmacion UI: estado del slot cambia a ASIGNADO + mensaje de comprobante enviado a 11444555@correo.com.
- [TURNOS] Nota de observacion: la tarjeta/tabla de proximos turnos muestra 15:00 (posible desplazamiento de zona horaria respecto al slot 18:00 mostrado en disponibilidad).
- [ADMISION] En landing de Admision se filtra por DNI 11444555 y fecha 2026-06-02.
- [ADMISION] Turno encontrado: 02/06/2026 18:00, paciente Pascal Jorge, financiador Swiss Medical | SMG20, estado PROGRAMADO.
- [ADMISION] Se selecciona turno y se ejecuta accion ADMITIR PACIENTE.
- [ADMISION] Modal de identificacion (paso 1 validar persona / paso 2 validar financiador) completado.
- [ADMISION] Sistema detecta discrepancia de financiador (turno Swiss vs paciente Privado/Particular vigente) y solicita confirmacion.
- [ADMISION] Se acepta cambio propuesto por sistema para continuar admision.
- [ADMISION] Resultado final en grilla: estado EN_SALA_DE_ESPERA y estado de arribo Confirmado.
- [EPISODIO] Validacion DB (sch_admision):
	- turno_id: adm:c5383d10e28b4c088f167387b4bd0ddd:4a2012cf00a14cfdb0ec96604c10f6aa:20260602:1800
	- encuentro_id: enc:adm:c5383d10e28b4c088f167387b4bd0ddd:4a2012cf00a14cfdb0ec96604c10f6aa:20260602:1800
	- estado_arribo: EN_SALA_DE_ESPERA
	- estado_turno: CONSUMIDO
	- estado_encuentro: ABIERTO
	- paciente: Pascal, Jorge (DNI 11444555)

## Evidencias y resultados

- Persona creada y empadronada correctamente.
- Agenda TESTIA creada y bloque fijo M/X 18:00-20:00 cada 15 minutos registrado.
- Slot de las 18:00 visible y asignado al paciente.
- Admision ejecutada con estado final EN_SALA_DE_ESPERA.
- Encuentro/episodio creado en DB y asociado al turno admitido.
- Incidencias observadas:
	- Al crear agenda con fecha desde menor a hoy, API rechaza con validacion esperada.
	- Si la agenda esta INACTIVA, Turnos no devuelve selectores de disponibilidad.
	- Diferencia de hora visual en Turnos (slot 18:00 vs tarjeta 15:00) probable offset horario.
	- En Admision, se mostro discrepancia de financiador y se reemplazo Swiss por Privado/Particular al confirmar.

## Conclusiones

Escenario E2E completado de punta a punta con resultado funcional POSITIVO para CU1.

Se valida la cadena Persona -> Agenda -> Turno -> Admision -> Episodio en ambiente local. El flujo logra:

- Crear y usar paciente real para asignacion de turno.
- Operar agenda y bloque de forma consistente con disponibilidad.
- Admitir el turno y dejar estado operativo en sala de espera.
- Crear encuentro en schema de admision con estado abierto.

Quedan observaciones funcionales para CU2:

- Revisar consistencia de zona horaria en vista de turnos.
- Revisar regla de conciliacion de financiador entre Turnos y Admision para evitar cambios no deseados.
- Considerar activacion automatica o advertencia explicita al crear agendas para uso en Turnos.
