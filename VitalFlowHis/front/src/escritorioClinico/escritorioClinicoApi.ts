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
  turnoId: string | null;
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
  turnoId?: string | null
): Promise<SolicitudEstudioResponse[]> {
  const params = new URLSearchParams();
  if (turnoId) params.set("turnoId", turnoId);
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

export type VademecumItem = {
  id: number;
  principioActivo: string;
  troquel: string;
  producto: string;
  cobertura: string | null;
};

export async function buscarVademecum(search: string): Promise<VademecumItem[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  return httpClient.get<VademecumItem[]>(`/api/v1/vademecum?${params.toString()}`);
}

export type RegistrarRecetaItem = {
  medicamentoCodigo: string;
  medicamentoSistema: string;
  medicamentoDisplay: string;
  dosisTexto?: string | null;
  frecuenciaTexto?: string | null;
  duracionDias?: number | null;
  indicacion?: string | null;
};

export type RegistrarRecetaRequest = {
  pacienteId: string;
  encuentroId?: string | null;
  turnoId?: string | null;
  prescriptorUsuarioId: string;
  prescriptorMatricula: string;
  organizacionOid: string;
  rdiarProfile?: string;
  fhirBundleJson: string;
  items: RegistrarRecetaItem[];
};

export type RegistrarRecetaResponse = {
  recetaId: string;
  estado: string;
  creadoEn: string;
  cantidadItems: number;
};

export async function registrarRecetaDigital(request: RegistrarRecetaRequest): Promise<RegistrarRecetaResponse> {
  return httpClient.post<RegistrarRecetaResponse>("/api/v1/recetas", request);
}

export type RecetaResumenResponse = {
  recetaId: string;
  pacienteId: string;
  estado: string;
  rdiarProfile: string;
  creadoEn: string;
  cantidadItems: number;
  itemsResumen?: string | null;
};

export async function obtenerRecetasPaciente(pacienteId: string): Promise<RecetaResumenResponse[]> {
  return httpClient.get<RecetaResumenResponse[]>(`/api/v1/recetas?pacienteId=${encodeURIComponent(pacienteId)}`);
}
