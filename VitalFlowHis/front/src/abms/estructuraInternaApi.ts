import { httpClient } from "../shared/httpClient";

export type CampoEstructuraInterna = {
  nombre: string;
  tipo: string;
  obligatorio: boolean;
  referencia?: string;
};

export type NodoEstructuraInterna = {
  id: string;
  titulo: string;
  tabla: string;
  descripcion: string;
  campos: CampoEstructuraInterna[];
};

export type RegistroNodo = {
  nodoId: string;
  id: string;
  campos: Record<string, string | null>;
};

export type TipoDocumentoEstructura = {
  codigo: string;
  nombre: string;
};

export type PersonaIdentificadaEstructura = {
  id: string;
  apellidosNombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  estado: string;
  porcentajeCoincidencia: number;
};

export async function getNodosEstructuraInterna(): Promise<NodoEstructuraInterna[]> {
  return httpClient.get<NodoEstructuraInterna[]>(`/api/v1/estructura-interna/nodos`);
}

export async function getTiposDocumentoEstructura(): Promise<TipoDocumentoEstructura[]> {
  return httpClient.get<TipoDocumentoEstructura[]>(`/api/v1/estructura-interna/tipos-documento`);
}

export async function buscarPersonaEstructura(
  tipoDocumento: string,
  numeroDocumento: string
): Promise<PersonaIdentificadaEstructura[]> {
  const query = new URLSearchParams({ tipoDocumento, numeroDocumento }).toString();
  return httpClient.get<PersonaIdentificadaEstructura[]>(`/api/v1/estructura-interna/personas/busqueda?${query}`);
}

export async function getRegistrosNodo(nodoId: string): Promise<RegistroNodo[]> {
  return httpClient.get<RegistroNodo[]>(`/api/v1/estructura-interna/${encodeURIComponent(nodoId)}/registros`);
}

export async function getPrestacionesFacturacionVitalflow(): Promise<RegistroNodo[]> {
  return httpClient.get<RegistroNodo[]>(`/api/v1/estructura-interna/prestaciones-facturacion-vitalflow/registros`);
}

export async function saveRegistroNodo(
  nodoId: string,
  campos: Record<string, string>
): Promise<RegistroNodo> {
  return httpClient.post<RegistroNodo>(`/api/v1/estructura-interna/${encodeURIComponent(nodoId)}/registros`, { campos });
}
