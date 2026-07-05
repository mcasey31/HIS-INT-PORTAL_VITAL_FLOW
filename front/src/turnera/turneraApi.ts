import type { DisplayTurneraResponse, UltimoLlamadoTurneraResponse, KioscoArriboRequest, KioscoArriboResponse } from "./turneraTypes";

const API_BASE = "/api/v1/turnera";

export async function getDisplay(centroId?: string, efectorId?: string): Promise<DisplayTurneraResponse> {
  const params = new URLSearchParams();
  if (centroId) params.set("centroId", centroId);
  if (efectorId) params.set("efectorId", efectorId);
  const qs = params.toString();
  const res = await fetch(`${API_BASE}/display${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error("Error al obtener display");
  return res.json();
}

export async function getUltimoLlamado(centroId?: string, efectorId?: string): Promise<UltimoLlamadoTurneraResponse> {
  const params = new URLSearchParams();
  if (centroId) params.set("centroId", centroId);
  if (efectorId) params.set("efectorId", efectorId);
  const qs = params.toString();
  const res = await fetch(`${API_BASE}/ultimo-llamado${qs ? "?" + qs : ""}`);
  if (!res.ok) throw new Error("Error al obtener ultimo llamado");
  return res.json();
}

export async function kioscoArribo(request: KioscoArriboRequest): Promise<KioscoArriboResponse> {
  const res = await fetch(`${API_BASE}/kiosco/arribo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error en kiosco" }));
    return { ok: false, mensaje: err.message ?? "Error desconocido", paciente: null, turnoId: null };
  }
  return res.json();
}
