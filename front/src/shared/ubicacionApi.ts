import { httpClient } from "./httpClient";

export type ProvinciaDto = {
  id: string;
  nombre: string;
};

export type LocalidadDto = {
  id: string;
  provinciaId: string;
  nombre: string;
};

export async function getProvincias(): Promise<ProvinciaDto[]> {
  const res = await httpClient.get<{ items: ProvinciaDto[] }>("/api/v1/ubicacion/provincias");
  return res.items;
}

export async function getLocalidades(provinciaId?: string): Promise<LocalidadDto[]> {
  const endpoint = provinciaId
    ? `/api/v1/ubicacion/localidades?provinciaId=${encodeURIComponent(provinciaId)}`
    : "/api/v1/ubicacion/localidades";
  const res = await httpClient.get<{ items: LocalidadDto[] }>(endpoint);
  return res.items;
}
