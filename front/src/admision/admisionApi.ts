import { httpClient } from "../shared/httpClient";
import type { BuscarTurnosAdmisionRequest, ConfirmarArriboTurnoRequest, ConfirmarArriboTurnoResponse, ActualizarEstadoTurnoRequest, ActualizarEstadoTurnoResponse, EncuentroAdmisionResponse, CerrarEncuentroRequest, CerrarEncuentroResponse, SelectoresAdmision, PacienteIdentificadoAdmision, TurnoAdmision } from "./admisionTypes";

export async function getSelectoresAdmision(): Promise<SelectoresAdmision> {
  return httpClient.get<SelectoresAdmision>(`/api/v1/admision/landing/selectores`);
}

export async function identificarPacienteAdmision(
  tipoDocumento: string,
  numeroDocumento: string
): Promise<PacienteIdentificadoAdmision[]> {
  const params = new URLSearchParams({ tipoDocumento, numeroDocumento });
  return httpClient.get<PacienteIdentificadoAdmision[]>(`/api/v1/turnos/identificacion/paciente?${params.toString()}`);
}

export async function buscarTurnosAdmision(
  request: BuscarTurnosAdmisionRequest
): Promise<TurnoAdmision[]> {
  return httpClient.post<TurnoAdmision[]>(`/api/v1/admision/landing/buscar`, request);
}

export async function confirmarArriboTurno(
  turnoId: string,
  request: ConfirmarArriboTurnoRequest
): Promise<ConfirmarArriboTurnoResponse> {
  return httpClient.post<ConfirmarArriboTurnoResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/arribo`, request);
}

export async function actualizarEstadoTurno(
  turnoId: string,
  request: ActualizarEstadoTurnoRequest
): Promise<ActualizarEstadoTurnoResponse> {
  return httpClient.post<ActualizarEstadoTurnoResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/estado`, request);
}

export async function obtenerEncuentroTurno(
  turnoId: string
): Promise<EncuentroAdmisionResponse> {
  return httpClient.get<EncuentroAdmisionResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/encuentro`);
}

export async function cerrarEncuentroTurno(
  turnoId: string,
  request: CerrarEncuentroRequest
): Promise<CerrarEncuentroResponse> {
  return httpClient.post<CerrarEncuentroResponse>(`/api/v1/admision/turnos/${encodeURIComponent(turnoId)}/encuentro/cerrar`, request);
}

export async function llamarPacienteTurnera(turnoId: string): Promise<{ ok: boolean; paciente: string; estado: string }> {
  return httpClient.post<{ ok: boolean; paciente: string; estado: string }>("/api/v1/turnera/llamar", { turnoId });
}
