import { httpClient } from "../shared/httpClient";

export type EvolucionAmbulatoriaResponse = {
  evolucionId: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  problemasAsociados: string[];
};

export type CrearEvolucionAmbulatoriaResponse = {
  evolucionId: string;
  fechaAtencion: string;
};

export type PracticaCatalogoItem = {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  nombreCompleto: string | null;
  bonoB: number;
  bonoC: number;
  activa: boolean;
};

export async function crearEvolucionAmbulatoria(params: {
  pacienteId: string;
  turnoId: string;
  texto: string;
  problemas: string[];
  especialidad: string;
  profesional: string;
}): Promise<CrearEvolucionAmbulatoriaResponse> {
  return httpClient.post<CrearEvolucionAmbulatoriaResponse>(
    "/api/v1/historia-clinica/pacientes/evoluciones-ambulatorias",
    params
  );
}

export async function obtenerCatalogoPracticas(params?: {
  categoria?: string;
  search?: string;
}): Promise<PracticaCatalogoItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.categoria) searchParams.set("categoria", params.categoria);
  if (params?.search) searchParams.set("search", params.search);
  const suffix = searchParams.toString().length > 0 ? `?${searchParams.toString()}` : "";
  return httpClient.get<PracticaCatalogoItem[]>(`/api/v1/practicas/catalogo${suffix}`);
}

export async function obtenerCategoriasCatalogo(): Promise<string[]> {
  return httpClient.get<string[]>("/api/v1/practicas/catalogo/categorias");
}

export type SolicitudEstudioResponse = {
  id: string;
  pacienteId: string;
  turnoId: string;
  practicaNombre: string;
  fechaSolicitada: string;
  observacion: string | null;
};

export type SolicitudEstudioItem = {
  practicaNombre: string;
  fechaSolicitada: string;
  observacion: string | null;
};

export async function getSolicitudesEstudio(
  pacienteId: string,
  turnoId: string
): Promise<SolicitudEstudioResponse[]> {
  const params = new URLSearchParams({ turnoId });
  return httpClient.get<SolicitudEstudioResponse[]>(
    `/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/solicitudes-estudio?${params.toString()}`
  );
}

export async function syncSolicitudesEstudio(
  pacienteId: string,
  turnoId: string,
  solicitudes: SolicitudEstudioItem[]
): Promise<void> {
  await httpClient.post(
    `/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/solicitudes-estudio/sync?turnoId=${encodeURIComponent(turnoId)}`,
    { solicitudes }
  );
}

export async function obtenerEvolucionesAmbulatoriasPaciente(
  pacienteId: string,
  limit = 20
): Promise<EvolucionAmbulatoriaResponse[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  return httpClient.get<EvolucionAmbulatoriaResponse[]>(`/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/evoluciones-ambulatorias?${params.toString()}`);
}
