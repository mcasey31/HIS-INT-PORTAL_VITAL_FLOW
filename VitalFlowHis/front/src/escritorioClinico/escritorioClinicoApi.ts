import { httpClient } from "../shared/httpClient";

export type EvolucionAmbulatoriaResponse = {
  evolucionId: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  problemasAsociados: string[];
};

export async function obtenerEvolucionesAmbulatoriasPaciente(
  pacienteId: string,
  limit = 20
): Promise<EvolucionAmbulatoriaResponse[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  return httpClient.get<EvolucionAmbulatoriaResponse[]>(`/api/v1/historia-clinica/pacientes/${encodeURIComponent(pacienteId)}/evoluciones-ambulatorias?${params.toString()}`);
}
