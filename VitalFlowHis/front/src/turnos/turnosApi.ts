import { httpClient } from "../shared/httpClient";



export type FinanciadorPlan = {
  id: string;
  financiadorId?: string;
  planId?: string;
  financiador: string;
  plan: string;
  numeroAfiliado?: string;
  vigente: boolean;
};

export type PacienteIdentificado = {
  id: string;
  apellidosNombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  email?: string;
  telefono?: string;
  esPaciente: boolean;
  financiadores: FinanciadorPlan[];
};

export type CentroTurno = {
  id: string;
  nombre: string;
};

export type ServicioTurno = {
  id: string;
  nombre: string;
  centroIds: string[];
};

export type PracticaTurno = {
  id: string;
  nombre: string;
  servicioId: string;
  centroIds: string[];
  profesionalIds: string[];
};

export type ProfesionalTurno = {
  id: string;
  nombre: string;
  centroIds: string[];
  servicioIds: string[];
  practicaIds: string[];
};

export type SelectoresDisponibilidad = {
  centros: CentroTurno[];
  servicios: ServicioTurno[];
  practicas: PracticaTurno[];
  profesionales: ProfesionalTurno[];
};

export type BuscarDisponibilidadRequest = {
  pacienteId: string;
  financiadorPlanId: string;
  centroIds: string[];
  servicioId: string;
  practicaId: string;
  profesionalId?: string;
};

export type DisponibilidadEstado = "DISPONIBLE" | "CON_CUPO" | "SIN_COBERTURA" | "ASIGNADO";

export type DisponibilidadSlot = {
  id: string;
  fecha: string;
  hora: string;
  tipoSlot: "NORMAL" | "ST";
  rangoHoraInicio: string;
  rangoHoraFin: string;
  centro: string;
  servicio: string;
  practica: string;
  profesional: string;
  estado: DisponibilidadEstado;
  sobreTurnosDisponibles?: number;
  mensaje?: string;
};

export type AsignarTurnoRequest = {
  pacienteId: string;
  slotId: string;
  financiadorPlanId: string;
  email?: string;
  telefono?: string;
  guardarContactoEnPerfil: boolean;
  centro?: string;
  servicio?: string;
  practica?: string;
  profesional?: string;
  fecha?: string;
  hora?: string;
};

export type NotificacionTurnoEmail = {
  destinatario: string;
  asunto: string;
  mensajeResumen: string;
  centro: string;
};

export type AsignarTurnoResponse = {
  ok: boolean;
  turnoId: string;
  warning?: string;
  message: string;
  notificacionEmail?: NotificacionTurnoEmail;
};

export type AsignarSobreturnoRequest = {
  pacienteId: string;
  slotId: string;
  financiadorPlanId: string;
  fecha: string;
  hora: string;
};

export type AsignarSobreturnoResponse = {
  ok: boolean;
  turnoId: string;
  slotId: string;
  message: string;
};

export type EstadoTurnoPaciente =
  | "AGENDADO"
  | "CONSUMIDO"
  | "AUSENTE"
  | "CANCELADO_POR_AGENDA"
  | "CANCELADO_POR_BLOQUEO"
  | "CANCELADO_POR_PACIENTE";

export type TurnoPaciente = {
  id: string;
  profesional: string;
  servicio: string;
  centro: string;
  fechaHora: string;
  estado: EstadoTurnoPaciente;
  motivo?: string;
};

export type TurnosPacientePage = {
  items: TurnoPaciente[];
  total: number;
  page: number;
  pageSize: number;
};

export type GuardarPacienteFinanciadorRequest = {
  financiadorId: string;
  planId: string;
  numeroAfiliado?: string;
  reemplazarFinanciadorPlanId?: string;
};



export async function identificarPacientePorDocumento(
  tipoDocumento: string,
  numeroDocumento: string
): Promise<PacienteIdentificado[]> {
  const query = new URLSearchParams({ tipoDocumento, numeroDocumento }).toString();
  return httpClient.get<PacienteIdentificado[]>(`/api/v1/turnos/identificacion/paciente?${query}`);
}

export async function getSelectoresDisponibilidad(): Promise<SelectoresDisponibilidad> {
  return httpClient.get<SelectoresDisponibilidad>(`/api/v1/turnos/disponibilidad/selectores`);
}

export async function getTurnosPaciente(
  pacienteId: string,
  historial: boolean,
  page = 1,
  pageSize = 10
): Promise<TurnosPacientePage> {
  const query = new URLSearchParams({
    historial: String(historial),
    page: String(page),
    pageSize: String(pageSize),
  }).toString();
  return httpClient.get<TurnosPacientePage>(`/api/v1/turnos/pacientes/${encodeURIComponent(pacienteId)}/turnos?${query}`);
}

export async function buscarDisponibilidadHoraria(
  request: BuscarDisponibilidadRequest
): Promise<DisponibilidadSlot[]> {
  return httpClient.post<DisponibilidadSlot[]>(`/api/v1/turnos/disponibilidad/buscar`, request);
}

export async function asignarSobreturno(
  request: AsignarSobreturnoRequest
): Promise<AsignarSobreturnoResponse> {
  return httpClient.post<AsignarSobreturnoResponse>(`/api/v1/turnos/sobreturnos/asignacion`, request);
}

export async function asignarTurno(
  request: AsignarTurnoRequest
): Promise<AsignarTurnoResponse> {
  return httpClient.post<AsignarTurnoResponse>(`/api/v1/turnos/asignacion`, request);
}

export async function guardarFinanciadorPaciente(
  pacienteId: string,
  request: GuardarPacienteFinanciadorRequest
): Promise<FinanciadorPlan> {
  return httpClient.post<FinanciadorPlan>(
    `/api/v1/turnos/pacientes/${encodeURIComponent(pacienteId)}/financiadores`,
    request
  );
}

export async function finalizarVigenciaFinanciadorPaciente(
  pacienteId: string,
  financiadorPlanPacienteId: string
): Promise<void> {
  await httpClient.patch<void>(
    `/api/v1/turnos/pacientes/${encodeURIComponent(pacienteId)}/financiadores/${encodeURIComponent(financiadorPlanPacienteId)}/finalizar-vigencia`,
    {}
  );
}
