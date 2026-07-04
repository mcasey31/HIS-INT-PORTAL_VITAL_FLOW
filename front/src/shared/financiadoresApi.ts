import { httpClient } from "./httpClient";

export type FinanciadorPlanCatalogo = {
  id: string;
  nombre: string;
};

export type FinanciadorCatalogoItem = {
  id: string;
  nombre: string;
  planes: FinanciadorPlanCatalogo[];
};

let cache: FinanciadorCatalogoItem[] | null = null;

export async function getCatalogoFinanciadores(): Promise<FinanciadorCatalogoItem[]> {
  if (cache) return cache;
  const data = await httpClient.get<FinanciadorCatalogoItem[]>("/api/v1/estructura-interna/financiadores/catalogo");
  cache = data;
  return data;
}
