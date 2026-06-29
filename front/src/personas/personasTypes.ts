import type { PersonaCandidata } from "./personasApi";

export type { PersonaCandidata };

export type PersonasPageProps = Record<string, never>;

export type ScanFlowState = "idle" | "error" | "success";

export type DniScanData = {
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexoBiologico: string;
};

export type ContactoTipo = "" | "TELEFONO" | "CORREO_ELECTRONICO";
export type ContactoUso = "" | "PERSONAL" | "LABORAL" | "OTRO";

export type ContactoDato = {
  id: string;
  tipo: ContactoTipo;
  valor: string;
  uso: ContactoUso;
};

export type PersonaContactoVinculada = {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  apellidosNombres: string;
  sexoEdad: string;
  telefonos: string[];
  email: string;
  estado: "TEMPORAL";
};

export type SetMinimoSnapshot = {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexoBiologico: string;
};

export const CONTACTOS_INICIALES: ContactoDato[] = [
  { id: "contacto-1", tipo: "TELEFONO", valor: "", uso: "" },
  { id: "contacto-2", tipo: "CORREO_ELECTRONICO", valor: "", uso: "" }
];

export const CONTACTOS_PERSONA_CONTACTO_INICIALES: ContactoDato[] = [
  { id: "persona-contacto-1", tipo: "TELEFONO", valor: "", uso: "PERSONAL" },
  { id: "persona-contacto-2", tipo: "CORREO_ELECTRONICO", valor: "", uso: "PERSONAL" }
];

export const DIRECCION_PAISES = ["Argentina", "Uruguay", "Chile", "Paraguay"];

export const DIRECCION_PAIS_DEFAULT = "Argentina";

export function parseApellidosNombres(value: string): { apellido: string; nombre: string } {
  const split = value.split(",", 2);
  return {
    apellido: (split[0] ?? "").trim(),
    nombre: (split[1] ?? "").trim()
  };
}

export function normalizarFechaParaInput(value: string): string {
  const raw = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{8}$/.test(raw)) return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  const slash = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) return `${slash[3]}-${slash[2]}-${slash[1]}`;
  return raw;
}

export function normalizarSexoEscaneo(value: string): string {
  const raw = value.trim().toUpperCase();
  if (raw.startsWith("M")) return "M";
  if (raw.startsWith("F")) return "F";
  if (raw.startsWith("X")) return "X";
  return "";
}

export function parseQrData(rawInput: string): DniScanData | null {
  const raw = rawInput.trim();
  if (!raw) return null;
  if (raw.startsWith("{")) {
    try {
      const payload = JSON.parse(raw) as Record<string, string>;
      const numeroDoc = (payload.numeroDocumento ?? payload.dni ?? payload.documento ?? "").trim();
      const nombreRaw = (payload.nombre ?? payload.nombres ?? "").trim();
      const apellidoRaw = (payload.apellido ?? payload.apellidos ?? "").trim();
      const fecha = normalizarFechaParaInput(payload.fechaNacimiento ?? payload.fecha_nacimiento ?? "");
      const sexo = normalizarSexoEscaneo(payload.sexoBiologico ?? payload.sexo ?? "");
      if (!numeroDoc || !nombreRaw || !apellidoRaw || !fecha || !sexo) return null;
      return { numeroDocumento: numeroDoc.toUpperCase(), nombre: nombreRaw, apellido: apellidoRaw, fechaNacimiento: fecha, sexoBiologico: sexo };
    } catch { return null; }
  }
  const atValues = raw.split("@");
  if (atValues.length >= 7) {
    const apellidoRaw = (atValues[1] ?? "").trim();
    const nombreRaw = (atValues[2] ?? "").trim();
    const sexoRaw = (atValues[3] ?? "").trim();
    const numeroDoc = (atValues[4] ?? "").trim();
    const fechaRaw = (atValues[6] ?? "").trim();
    const fecha = normalizarFechaParaInput(fechaRaw);
    const sexo = normalizarSexoEscaneo(sexoRaw);
    if (!numeroDoc || !nombreRaw || !apellidoRaw || !fecha || !sexo) return null;
    return { numeroDocumento: numeroDoc.toUpperCase(), nombre: nombreRaw, apellido: apellidoRaw, fechaNacimiento: fecha, sexoBiologico: sexo };
  }
  return null;
}

export function normalizarValorContacto(tipo: ContactoTipo, rawValue: string): string {
  if (tipo === "TELEFONO") return rawValue.replace(/[^0-9]/g, "");
  return rawValue;
}

export function calcularEdad(fecha: string): number {
  const nacimiento = new Date(fecha);
  if (Number.isNaN(nacimiento.getTime())) return 0;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - nacimiento.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
  return Math.max(edad, 0);
}
