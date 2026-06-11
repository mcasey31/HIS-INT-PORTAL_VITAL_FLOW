import { httpClient } from "../shared/httpClient";



export type PersonaCandidata = {
  id: string;
  apellidosNombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  estado: string;
  porcentajeCoincidencia: number;
  email?: string;
  telefono?: string;
};

export type BuscarSetMinimoRequest = {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  email?: string;
  telefono?: string;
};



export async function buscarPersonasPorDocumento(
  tipoDocumento: string,
  numeroDocumento: string
): Promise<PersonaCandidata[]> {
  const query = new URLSearchParams({ tipoDocumento, numeroDocumento }).toString();
  return httpClient.get<PersonaCandidata[]>(`/api/v1/personas/busqueda?${query}`);
}

export async function empadronarPersonaConSetMinimo(
  request: BuscarSetMinimoRequest
): Promise<PersonaCandidata> {
  return httpClient.post<PersonaCandidata>(`/api/v1/personas/empadronar-set-minimo`, request);
}

export async function actualizarPersonaSetMinimo(
  personaId: string,
  request: BuscarSetMinimoRequest
): Promise<PersonaCandidata> {
  return httpClient.put<PersonaCandidata>(`/api/v1/personas/${personaId}/set-minimo`, request);
}

export async function buscarPersonasPorSetMinimo(
  request: BuscarSetMinimoRequest
): Promise<PersonaCandidata[]> {
  const query = new URLSearchParams({
    tipoDocumento: request.tipoDocumento,
    numeroDocumento: request.numeroDocumento,
    nombre: request.nombre,
    apellido: request.apellido,
    fechaNacimiento: request.fechaNacimiento,
    sexoBiologico: request.sexoBiologico
  }).toString();
  return httpClient.get<PersonaCandidata[]>(`/api/v1/personas/busqueda-set-minimo?${query}`);
}
