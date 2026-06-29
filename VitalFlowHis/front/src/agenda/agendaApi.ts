import { httpClient } from "../shared/httpClient";

export type AgendaSummary = {
  id: string;
  codigo: string;
  nombre: string;
  centroId: string;
  centro: string;
  servicioId: string;
  servicio: string;
  tipoEfector: string;
  efectorId: string;
  efector: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  activa: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
  bloques: number;
  bloqueos: number;
};

export type AgendaDetail = {
  id: string;
  codigo: string;
  nombre: string;
  centroId: string;
  centro: string;
  servicioId: string;
  servicio: string;
  tipoEfector: string;
  efectorId: string;
  efector: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  activa: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
  bloques: {
    id: string;
    nombre: string;
    tipoBloque: string;
    fechaDesde: string;
    fechaHasta: string;
    atiendeFeriados: boolean;
    dias: string[];
    fecha: string;
    horaInicio: string;
    horaFin: string;
    duracionTurnoMinutos: number;
    intervaloMinutos: number;
    lugarAtencionId: string;
    lugarAtencionNombre: string;
    frecuencia: string;
    ordenMensualSemanas: number[];
    practicas: BloquePractica[];
    sobreturnos: number;
    activo: boolean;
  }[];
  bloqueos: {
    id: string;
    inicio: string;
    fin: string;
    tipo: string;
  }[];
};

export type CreateAgendaRequest = {
  nombre: string;
  centroId: string;
  servicioId: string;
  tipoEfector: string;
  efectorId: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
};

export type UpdateAgendaRequest = {
  codigo: string;
  nombre: string;
  centroId: string;
  servicioId: string;
  tipoEfector: string;
  efectorId: string;
  tipoAgenda: string;
  visibleContactCenter: boolean;
  fechaDesde: string;
  fechaHasta?: string;
  observacion?: string;
};

export type SelectorOption = {
  id: string;
  nombre: string;
};

export type EfectorOption = {
  id: string;
  nombre: string;
  tipoEfector: string;
};

export type CopyAgendaRequest = {
  codigo: string;
  nombre: string;
  fechaDesde: string;
  fechaHasta?: string;
};

export type CreateBloqueRequest = {
  nombre: string;
  tipoBloque: string;
  fechaDesde: string;
  fechaHasta: string;
  atiendeFeriados: boolean;
  dias: string[];
  horaInicio: string;
  horaFin: string;
  duracionTurnoMinutos: number;
  lugarAtencionId: string;
  frecuencia: string;
  ordenMensualSemanas: number[];
  practicas?: BloquePracticaRequest[];
  sobreturnos: number;
};

export type BloquePractica = {
  nombre: string;
  duracionMinutos: number;
};

export type BloquePracticaRequest = {
  nombre: string;
  duracionMinutos?: number;
};

export type DiaSemanaOption = {
  codigo: string;
  nombre: string;
};

export type PracticaOption = {
  nombre: string;
  duracionMinutosSugerida?: number;
};

export type UpdateBloqueRequest = {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  intervaloMinutos: number;
};

export type CreateBloqueoRequest = {
  inicio: string;
  fin: string;
  tipo: string;
};

export type DisponibilidadResponse = {
  agendaId: string;
  cuposTotales: number;
  cuposDisponibles: number;
  bloqueosActivos: number;
};

export type TurnoACancelar = {
  turnoId: string;
  paciente: string;
  fechaHora: string;
  estado: string;
};

export type CreateGrupoProfesionalMiembroRequest = {
  efectorId: string;
  rol?: string;
  orden?: number;
};

export type CreateGrupoProfesionalRequest = {
  codigo: string;
  nombre: string;
  centroId: string;
  servicioId: string;
  descripcion?: string;
  miembros: CreateGrupoProfesionalMiembroRequest[];
};

export type GrupoProfesionalResponse = {
  id: string;
  codigo: string;
  nombre: string;
  centroId: string;
  centro: string;
  servicioId: string;
  servicio: string;
  descripcion?: string;
  activo: boolean;
  miembros: {
    id: string;
    efectorId: string;
    efector: string;
    rol?: string;
    orden?: number;
    activo: boolean;
  }[];
};

export async function getAgendas(query?: string, activa?: boolean): Promise<AgendaSummary[]> {
  const params = new URLSearchParams();
  if (query && query.trim().length > 0) {
    params.set("query", query.trim());
  }

  if (typeof activa === "boolean") {
    params.set("activa", String(activa));
  }

  const suffix = params.toString().length > 0 ? `?${params}` : "";
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

export async function getEfectores(
  centroId: string,
  servicioId: string,
  tipoEfector: string,
  query?: string
): Promise<EfectorOption[]> {
  const params = new URLSearchParams({ centroId, servicioId, tipoEfector });
  if (query && query.trim().length > 0) {
    params.set("query", query.trim());
  }

  return httpClient.get<EfectorOption[]>(`/api/v1/agendas/selectores/efectores?${params.toString()}`);
}

export async function getAgendaById(agendaId: string): Promise<AgendaDetail> {
  return httpClient.get<AgendaDetail>(`/api/v1/agendas/${agendaId}`);
}

export async function getLugaresAtencion(query?: string): Promise<SelectorOption[]> {
  const params = new URLSearchParams();
  if (query && query.trim().length > 0) {
    params.set("query", query.trim());
  }

  const suffix = params.toString().length > 0 ? `?${params.toString()}` : "";
  return httpClient.get<SelectorOption[]>(`/api/v1/agendas/selectores/lugares-atencion${suffix}`);
}

export async function getDiasSemana(): Promise<DiaSemanaOption[]> {
  return httpClient.get<DiaSemanaOption[]>(`/api/v1/agendas/selectores/dias-semana`);
}

export async function getFrecuenciasBloque(): Promise<string[]> {
  return httpClient.get<string[]>(`/api/v1/agendas/selectores/frecuencias-bloque`);
}

export async function getPracticas(query?: string): Promise<PracticaOption[]> {
  const params = new URLSearchParams();
  if (query && query.trim().length > 0) {
    params.set("query", query.trim());
  }

  const suffix = params.toString().length > 0 ? `?${params.toString()}` : "";
  return httpClient.get<PracticaOption[]>(`/api/v1/agendas/selectores/practicas${suffix}`);
}

export async function createAgenda(payload: CreateAgendaRequest): Promise<AgendaSummary> {
  return httpClient.post<AgendaSummary>(`/api/v1/agendas`, payload);
}

export async function updateAgenda(
  agendaId: string,
  payload: UpdateAgendaRequest
): Promise<AgendaSummary> {
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

export async function updateBloque(
  agendaId: string,
  bloqueId: string,
  payload: UpdateBloqueRequest
): Promise<void> {
  await httpClient.put<void>(`/api/v1/agendas/${agendaId}/bloques/${bloqueId}`, payload);
}

export async function removeBloquePractica(
  agendaId: string,
  bloqueId: string,
  nombrePractica: string
): Promise<void> {
  await httpClient.delete<void>(`/api/v1/agendas/${agendaId}/bloques/${bloqueId}/practicas?nombre=${encodeURIComponent(nombrePractica)}`);
}

export async function getTurnosACancelar(
  agendaId: string,
  bloqueId: string
): Promise<TurnoACancelar[]> {
  return httpClient.get<TurnoACancelar[]>(`/api/v1/agendas/${agendaId}/bloques/${bloqueId}/turnos-a-cancelar`);
}

export async function addBloqueo(agendaId: string, payload: CreateBloqueoRequest): Promise<void> {
  await httpClient.post<void>(`/api/v1/agendas/${agendaId}/bloqueos`, payload);
}

export async function getDisponibilidad(agendaId: string): Promise<DisponibilidadResponse> {
  return httpClient.get<DisponibilidadResponse>(`/api/v1/agendas/${agendaId}/disponibilidad`);
}

export async function createGrupoProfesional(
  payload: CreateGrupoProfesionalRequest
): Promise<GrupoProfesionalResponse> {
  return httpClient.post<GrupoProfesionalResponse>(`/api/v1/grupos-profesionales`, payload);
}
