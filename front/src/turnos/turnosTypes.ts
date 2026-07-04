import { TipoDocumento } from "../shared/catalogosApi";

export type { TipoDocumento };

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

export const SELECTORES_VACIOS: SelectoresDisponibilidad = {
  centros: [], servicios: [], practicas: [], profesionales: [],
};

export function parseIsoDateTimeParts(value: string): {
  year: number; month: number; day: number; hour: number; minute: number;
} | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;
  return {
    year: Number(match[1]), month: Number(match[2]), day: Number(match[3]),
    hour: Number(match[4]), minute: Number(match[5]),
  };
}

export function formatFechaHora(value: string): string {
  const parts = parseIsoDateTimeParts(value);
  if (parts) {
    const dd = String(parts.day).padStart(2, "0");
    const mm = String(parts.month).padStart(2, "0");
    const yyyy = parts.year;
    const hh = String(parts.hour).padStart(2, "0");
    const min = String(parts.minute).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export function estadoTurnoLabel(estado: EstadoTurnoPaciente): string {
  const map: Record<EstadoTurnoPaciente, string> = {
    AGENDADO: "Agendado",
    CONSUMIDO: "Consumido",
    AUSENTE: "Ausente",
    CANCELADO_POR_AGENDA: "Cancelado por agenda",
    CANCELADO_POR_BLOQUEO: "Cancelado por bloqueo",
    CANCELADO_POR_PACIENTE: "Cancelado por paciente",
  };
  return map[estado] ?? estado;
}
