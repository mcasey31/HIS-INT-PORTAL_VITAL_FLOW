import { httpClient } from "../shared/httpClient";
import type { AnularRecetaDigitalResponse, AsignarProblemaRequest, AsignarProblemaResponse, BuscarMedicamentosResponse, CorreosPacienteResponse, CrearPrescripcionRequest, CrearPrescripcionResponse, CrearEvolucionAmbulatoriaRequest, CrearEvolucionAmbulatoriaResponse, EnviarRecetasEmailRequest, EnviarRecetasEmailResponse, EvolucionAmbulatoriaResponse, FinanciadorActivoResponse, GuardarSolicitudesEstudiosRequest, GuardarSolicitudesEstudiosResponse, PersonaCandidataBusqueda, ProblemaCronicoResponse, RecetaDigitalDetalleResponse, RecetaDigitalResumenResponse, SolicitudEstudioRecord } from "./escritorioClinicoTypes";

export async function obtenerEvolucionesAmbulatoriasPaciente(
  pacienteId: string,
  limit = 20
): Promise<EvolucionAmbulatoriaResponse[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  return httpClient.get<EvolucionAmbulatoriaResponse[]>(`/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/evoluciones-ambulatorias?${params.toString()}`);
}

export async function obtenerProblemasCronicosPaciente(
  pacienteId: string
): Promise<ProblemaCronicoResponse[]> {
  return httpClient.get<ProblemaCronicoResponse[]>(`/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/problemas-cronicos`);
}

export async function crearEvolucionAmbulatoria(
  request: CrearEvolucionAmbulatoriaRequest
): Promise<CrearEvolucionAmbulatoriaResponse> {
  return httpClient.post<CrearEvolucionAmbulatoriaResponse>(`/api/v1/historia-clinica/evoluciones`, request);
}

export async function buscarPersonaPorDocumento(
  tipoDocumento: string,
  numeroDocumento: string
): Promise<PersonaCandidataBusqueda[]> {
  const params = new URLSearchParams({ tipoDocumento, numeroDocumento });
  return httpClient.get<PersonaCandidataBusqueda[]>(`/api/v1/personas/busqueda?${params.toString()}`);
}

export async function buscarPersonaPorSetMinimo(
  tipoDocumento: string,
  numeroDocumento: string,
  nombre: string,
  apellido: string,
  fechaNacimiento: string,
  sexoBiologico: string
): Promise<PersonaCandidataBusqueda[]> {
  const params = new URLSearchParams({ tipoDocumento, numeroDocumento, nombre, apellido, fechaNacimiento, sexoBiologico });
  return httpClient.get<PersonaCandidataBusqueda[]>(`/api/v1/personas/busqueda-set-minimo?${params.toString()}`);
}

export async function asignarProblemaPaciente(
  pacienteId: string,
  request: AsignarProblemaRequest
): Promise<AsignarProblemaResponse> {
  return httpClient.post<AsignarProblemaResponse>(
    `/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/problemas`,
    request
  );
}

export async function obtenerSolicitudesEstudiosTurno(
  turnoId: string
): Promise<SolicitudEstudioRecord[]> {
  return httpClient.get<SolicitudEstudioRecord[]>(
    `/api/v1/historia-clinica/turnos/${encodeURIComponent(turnoId)}/solicitudes-estudios`
  );
}

export async function crearPrescripcion(
  request: CrearPrescripcionRequest
): Promise<CrearPrescripcionResponse> {
  return httpClient.post<CrearPrescripcionResponse>("/api/v1/prescripciones", request);
}

export async function listarRecetasPaciente(
  pacienteId: string
): Promise<RecetaDigitalResumenResponse[]> {
  const params = new URLSearchParams({ pacienteId });
  return httpClient.get<RecetaDigitalResumenResponse[]>(`/api/v1/recetas?${params.toString()}`);
}

export async function obtenerRecetaDigital(
  recetaId: string
): Promise<RecetaDigitalDetalleResponse> {
  return httpClient.get<RecetaDigitalDetalleResponse>(`/api/v1/recetas/${encodeURIComponent(recetaId)}`);
}

export async function anularRecetaDigital(
  recetaId: string,
  motivo?: string
): Promise<AnularRecetaDigitalResponse> {
  return httpClient.post<AnularRecetaDigitalResponse>(`/api/v1/recetas/${encodeURIComponent(recetaId)}/anular`, { motivo });
}

export async function obtenerFinanciadorActivo(
  personaId: string
): Promise<FinanciadorActivoResponse> {
  return httpClient.get<FinanciadorActivoResponse>(`/api/v1/personas/${encodeURIComponent(personaId)}/financiador-activo`);
}

export async function buscarMedicamentos(
  q?: string,
  generico?: string,
  laboratorio?: string,
  soloGenerico?: boolean,
  pagina = 1,
  paginaSize = 20
): Promise<BuscarMedicamentosResponse> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (generico) params.set("generico", generico);
  if (laboratorio) params.set("laboratorio", laboratorio);
  if (soloGenerico) params.set("soloGenerico", "true");
  params.set("pagina", String(pagina));
  params.set("paginaSize", String(paginaSize));
  return httpClient.get<BuscarMedicamentosResponse>(`/api/v1/medicamentos/buscar?${params.toString()}`);
}

export async function guardarSolicitudesEstudiosTurno(
  turnoId: string,
  request: GuardarSolicitudesEstudiosRequest
): Promise<GuardarSolicitudesEstudiosResponse> {
  return httpClient.put<GuardarSolicitudesEstudiosResponse>(
    `/api/v1/historia-clinica/turnos/${encodeURIComponent(turnoId)}/solicitudes-estudios`,
    request
  );
}

export async function obtenerCorreosPaciente(
  personaId: string
): Promise<CorreosPacienteResponse> {
  return httpClient.get<CorreosPacienteResponse>(`/api/v1/personas/${encodeURIComponent(personaId)}/correos`);
}

export async function enviarRecetasEmail(
  request: EnviarRecetasEmailRequest
): Promise<EnviarRecetasEmailResponse> {
  return httpClient.post<EnviarRecetasEmailResponse>("/api/v1/recetas/enviar-email", request);
}
