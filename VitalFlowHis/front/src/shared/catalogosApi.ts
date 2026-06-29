import { httpClient } from "./httpClient";

export type TipoDocumento = {
  codigo: string;
  nombre: string;
  descripcion?: string;
};

export async function getTiposDocumento(): Promise<TipoDocumento[]> {
  return httpClient.get<TipoDocumento[]>(`/api/v1/personas/tipos-documento`);
}
