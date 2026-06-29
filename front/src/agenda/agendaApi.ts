import { httpClient } from "../shared/httpClient";
import type {
  AgendaSummary, AgendaDetail, CreateAgendaRequest, UpdateAgendaRequest,
  SelectorOption, EfectorOption, CopyAgendaRequest, CreateBloqueRequest,
  UpdateBloqueRequest, DiaSemanaOption, PracticaOption, CreateBloqueoRequest,
  DisponibilidadResponse, TurnoACancelar, CreateGrupoProfesionalRequest,
  GrupoProfesionalResponse,
} from "./agendaTypes";

export async function getAgendas(query?: string, activa?: boolean): Promise<AgendaSummary[]> {
  const params = new URLSearchParams();
  if (query?.trim()) params.set("query", query.trim());
  if (typeof activa === "boolean") params.set("activa", String(activa));
  const suffix = params.toString() ? `?${params}` : "";
  return httpClient.get<AgendaSummary[]>(`/api/v1/agendas${suffix}`);
}

export async function getCentros(): Promise<SelectorOption[]> {
  return httpClient.get<SelectorOption[]>(`/api/v1/agendas/selectores/centros`);
}

export async function getServicios(centroId: string): Promise<SelectorOption[]> {
  return httpClient.get<SelectorOption[]>(`/api/v1/agendas/selectores/servicios?centroId=${encodeURIComponent(centroId)}`);
}

export async function getTiposEfector(): Promise<string[]> {
  return httpClient.get<string[]>(`/api/v1/agendas/selectores/tipos-efector`);
}

export async function getTiposAgenda(): Promise<string[]> {
  return httpClient.get<string[]>(`/api/v1/agendas/selectores/tipos-agenda`);
}

export async function getEfectores(centroId: string, servicioId: string, tipoEfector: string, query?: string): Promise<EfectorOption[]> {
  const params = new URLSearchParams({ centroId, servicioId, tipoEfector });
  if (query?.trim()) params.set("query", query.trim());
  return httpClient.get<EfectorOption[]>(`/api/v1/agendas/selectores/efectores?${params}`);
}

export async function getAgendaById(agendaId: string): Promise<AgendaDetail> {
  return httpClient.get<AgendaDetail>(`/api/v1/agendas/${agendaId}`);
}

export async function getLugaresAtencion(query?: string): Promise<SelectorOption[]> {
  const params = query?.trim() ? `?query=${encodeURIComponent(query.trim())}` : "";
  return httpClient.get<SelectorOption[]>(`/api/v1/agendas/selectores/lugares-atencion${params}`);
}

export async function getDiasSemana(): Promise<DiaSemanaOption[]> {
  return httpClient.get<DiaSemanaOption[]>(`/api/v1/agendas/selectores/dias-semana`);
}

export async function getFrecuenciasBloque(): Promise<string[]> {
  return httpClient.get<string[]>(`/api/v1/agendas/selectores/frecuencias-bloque`);
}

export async function getPracticas(query?: string, servicioId?: string): Promise<PracticaOption[]> {
  const params = new URLSearchParams();
  if (query?.trim()) params.set("query", query.trim());
  if (servicioId) params.set("servicioId", servicioId);
  const qs = params.toString();
  return httpClient.get<PracticaOption[]>(`/api/v1/agendas/selectores/practicas${qs ? `?${qs}` : ""}`);
}

export async function createAgenda(payload: CreateAgendaRequest): Promise<AgendaSummary> {
  return httpClient.post<AgendaSummary>(`/api/v1/agendas`, payload);
}

export async function updateAgenda(agendaId: string, payload: UpdateAgendaRequest): Promise<AgendaSummary> {
  return httpClient.put<AgendaSummary>(`/api/v1/agendas/${agendaId}`, payload);
}

export async function copyAgenda(agendaId: string, payload: CopyAgendaRequest): Promise<AgendaSummary> {
  return httpClient.post<AgendaSummary>(`/api/v1/agendas/${agendaId}/copy`, payload);
}

export async function setAgendaEstado(agendaId: string, activa: boolean): Promise<AgendaSummary> {
  return httpClient.patch<AgendaSummary>(`/api/v1/agendas/${agendaId}/estado`, { activa });
}

export async function addBloque(agendaId: string, payload: CreateBloqueRequest): Promise<void> {
  await httpClient.post<void>(`/api/v1/agendas/${agendaId}/bloques`, payload);
}

export async function updateBloque(agendaId: string, bloqueId: string, payload: UpdateBloqueRequest): Promise<void> {
  await httpClient.put<void>(`/api/v1/agendas/${agendaId}/bloques/${bloqueId}`, payload);
}

export async function removeBloquePractica(agendaId: string, bloqueId: string, nombrePractica: string): Promise<void> {
  await httpClient.delete<void>(`/api/v1/agendas/${agendaId}/bloques/${bloqueId}/practicas?nombre=${encodeURIComponent(nombrePractica)}`);
}

export async function getTurnosACancelar(agendaId: string, bloqueId: string): Promise<TurnoACancelar[]> {
  return httpClient.get<TurnoACancelar[]>(`/api/v1/agendas/${agendaId}/bloques/${bloqueId}/turnos-a-cancelar`);
}

export async function addBloqueo(agendaId: string, payload: CreateBloqueoRequest): Promise<void> {
  await httpClient.post<void>(`/api/v1/agendas/${agendaId}/bloqueos`, payload);
}

export async function getDisponibilidad(agendaId: string): Promise<DisponibilidadResponse> {
  return httpClient.get<DisponibilidadResponse>(`/api/v1/agendas/${agendaId}/disponibilidad`);
}

export async function createGrupoProfesional(payload: CreateGrupoProfesionalRequest): Promise<GrupoProfesionalResponse> {
  return httpClient.post<GrupoProfesionalResponse>(`/api/v1/grupos-profesionales`, payload);
}

export async function getGruposProfesionales(centroId?: string, servicioId?: string): Promise<GrupoProfesionalResponse[]> {
  const params = new URLSearchParams();
  if (centroId) params.set("centroId", centroId);
  if (servicioId) params.set("servicioId", servicioId);
  const qs = params.toString();
  return httpClient.get<GrupoProfesionalResponse[]>(`/api/v1/grupos-profesionales${qs ? `?${qs}` : ""}`);
}

export async function getGrupoProfesionalById(id: string): Promise<GrupoProfesionalResponse> {
  return httpClient.get<GrupoProfesionalResponse>(`/api/v1/grupos-profesionales/${id}`);
}

export async function updateGrupoProfesional(id: string, payload: CreateGrupoProfesionalRequest): Promise<GrupoProfesionalResponse> {
  return httpClient.put<GrupoProfesionalResponse>(`/api/v1/grupos-profesionales/${id}`, payload);
}

export async function deleteGrupoProfesional(id: string): Promise<void> {
  return httpClient.delete<void>(`/api/v1/grupos-profesionales/${id}`);
}
