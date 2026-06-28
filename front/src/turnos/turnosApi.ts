import { httpClient } from "../shared/httpClient";
import type {
  PacienteIdentificado, SelectoresDisponibilidad, TurnosPacientePage,
  DisponibilidadSlot, AsignarSobreturnoResponse, AsignarTurnoResponse,
  FinanciadorPlan, BuscarDisponibilidadRequest, AsignarSobreturnoRequest,
  AsignarTurnoRequest, GuardarPacienteFinanciadorRequest,
} from "./turnosTypes";

export async function identificarPacientePorDocumento(
  tipoDocumento: string, numeroDocumento: string
): Promise<PacienteIdentificado[]> {
  const query = new URLSearchParams({ tipoDocumento, numeroDocumento }).toString();
  return httpClient.get<PacienteIdentificado[]>(`/api/v1/turnos/identificacion/paciente?${query}`);
}

export async function getSelectoresDisponibilidad(): Promise<SelectoresDisponibilidad> {
  return httpClient.get<SelectoresDisponibilidad>(`/api/v1/turnos/disponibilidad/selectores`);
}

export async function getTurnosPaciente(
  pacienteId: string, historial: boolean, page = 1, pageSize = 10
): Promise<TurnosPacientePage> {
  const query = new URLSearchParams({ historial: String(historial), page: String(page), pageSize: String(pageSize) }).toString();
  return httpClient.get<TurnosPacientePage>(`/api/v1/turnos/pacientes/${encodeURIComponent(pacienteId)}/turnos?${query}`);
}

export async function buscarDisponibilidadHoraria(request: BuscarDisponibilidadRequest): Promise<DisponibilidadSlot[]> {
  return httpClient.post<DisponibilidadSlot[]>(`/api/v1/turnos/disponibilidad/buscar`, request);
}

export async function asignarSobreturno(request: AsignarSobreturnoRequest): Promise<AsignarSobreturnoResponse> {
  return httpClient.post<AsignarSobreturnoResponse>(`/api/v1/turnos/sobreturnos/asignacion`, request);
}

export async function asignarTurno(request: AsignarTurnoRequest): Promise<AsignarTurnoResponse> {
  return httpClient.post<AsignarTurnoResponse>(`/api/v1/turnos/asignacion`, request);
}

export async function guardarFinanciadorPaciente(
  pacienteId: string, request: GuardarPacienteFinanciadorRequest
): Promise<FinanciadorPlan> {
  return httpClient.post<FinanciadorPlan>(`/api/v1/turnos/pacientes/${encodeURIComponent(pacienteId)}/financiadores`, request);
}

export async function finalizarVigenciaFinanciadorPaciente(
  pacienteId: string, financiadorPlanPacienteId: string
): Promise<void> {
  await httpClient.patch<void>(
    `/api/v1/turnos/pacientes/${encodeURIComponent(pacienteId)}/financiadores/${encodeURIComponent(financiadorPlanPacienteId)}/finalizar-vigencia`,
    {}
  );
}
