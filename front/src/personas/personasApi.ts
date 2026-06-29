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

export type DomicilioRequest = {
  localidadId: string | null;
  pais: string;
  provincia: string;
  localidad: string;
  calle: string;
  numero: string;
  barrio: string;
  codigoPostal: string;
  piso: string;
  departamento: string;
  comentario: string;
};

export type DomicilioResponse = DomicilioRequest & {
  id: string;
  personaId: string;
};

export async function getDomicilio(personaId: string): Promise<DomicilioResponse> {
  return httpClient.get<DomicilioResponse>(`/api/v1/personas/${personaId}/domicilio`);
}

export async function upsertDomicilio(
  personaId: string,
  request: DomicilioRequest
): Promise<DomicilioResponse> {
  return httpClient.put<DomicilioResponse>(`/api/v1/personas/${personaId}/domicilio`, request);
}

export type PersonaContactoRequest = {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  telefono?: string;
  email?: string;
};

export type PersonaContactoResponse = PersonaContactoRequest & {
  id: string;
  personaId: string;
};

export async function getContactos(personaId: string): Promise<PersonaContactoResponse[]> {
  return httpClient.get<PersonaContactoResponse[]>(`/api/v1/personas/${personaId}/contactos`);
}

export async function createContacto(
  personaId: string,
  request: PersonaContactoRequest
): Promise<PersonaContactoResponse> {
  return httpClient.post<PersonaContactoResponse>(`/api/v1/personas/${personaId}/contactos`, request);
}

export async function deleteContactos(
  personaId: string,
  contactoIds: string[]
): Promise<{ deleted: number }> {
  const ids = contactoIds.join(",");
  return httpClient.delete<{ deleted: number }>(`/api/v1/personas/${personaId}/contactos?ids=${encodeURIComponent(ids)}`);
}
