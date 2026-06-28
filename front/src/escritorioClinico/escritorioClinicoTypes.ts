import type { TurnoAdmision } from "../admision/admisionTypes";

export type EscritorioClinicoPageProps = {
  onCancelSeleccionServicio?: () => void;
};

export type UseEscritorioClinicoOptions = {
  onCancelSeleccionServicio?: () => void;
};

export type EvolucionAmbulatoriaResponse = {
  evolucionId: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  problemasAsociados: string[];
  texto?: string;
};

export type CrearEvolucionAmbulatoriaRequest = {
  turnoId: string;
  pacienteId: string;
  especialidad: string;
  profesional: string;
  texto: string;
  problemasAsociados: string[];
};

export type CrearEvolucionAmbulatoriaResponse = {
  evolucionId: string;
};

export type ProblemaCronicoResponse = {
  problemaCronicoId: string;
  descripcion: string;
  categoria: string;
  fechaInicio: string;
  evolucionesAsociadas: number;
};

export type AsignarProblemaRequest = {
  descripcion: string;
  categoria: string;
  fechaInicio?: string;
};

export type AsignarProblemaResponse = {
  problemaCronicoId: string;
};

export const CATEGORIAS_PROBLEMA = [
  "Activo",
  "Antecedente familiar",
  "Cronico",
  "Procedimiento",
  "Resuelto",
] as const;

export type ModoIngreso = "plantilla" | "megafono";

export type OrigenPanoramica = "ver" | "historia" | "megafono";

export type AccionSalidaEncuentro = "CERRAR_ENCUENTRO" | "ENVIAR_OBSERVACION" | "ENVIAR_LISTA_ESPERA" | "NO_ATENDIDO";

export type RegistroPanoramica = {
  id: string;
  fechaHora: string;
  titulo: string;
  detalle: string;
  evolucionesAsociadas?: number;
  problemasAsociados?: string[];
};

export type SeccionPanoramica = {
  key: string;
  titulo: string;
  registros: RegistroPanoramica[];
};

export type EvolucionListadoItem = {
  id: string;
  fechaHora: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  practica: string;
  problemasAsociados: string[];
  texto?: string;
};

export type EvolucionCreadaLocal = {
  id: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  problemasAsociados: string[];
  texto: string;
};

export type SolicitudesEstudiosPorFecha = Record<string, string[]>;

export type ObservacionesPorPracticaFecha = Record<string, Record<string, string>>;

export type SolicitudEstudioRecord = {
  id: string;
  turnoId: string;
  pacienteId: string;
  fechaSolicitada: string;
  practica: string;
  observacion?: string;
  estado: string;
};

export type GuardarSolicitudesEstudiosRequest = {
  pacienteId: string;
  items: { fechaSolicitada: string; practica: string; observacion?: string }[];
};

export type GuardarSolicitudesEstudiosResponse = {
  cantidad: number;
};

export type PersonaCandidataBusqueda = {
  id: string;
  apellidosNombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  email?: string;
  telefono?: string;
};

export type RecetarioLaunchContext = {
  standard: "RDIar";
  profile: string;
  sourceSystem: "ODI";
  patient: {
    display: string;
    identifier: string;
  };
  encounter: {
    turnoId: string;
    servicio: string;
    efector: string;
  };
  issuedAt: string;
};

export const ESTADO_EN_SALA_ESPERA = "EN_SALA_DE_ESPERA";
export const ESTADO_EN_OBSERVACION = "EN_OBSERVACION";
export const ESTADO_EN_ATENCION = "EN_ATENCION";
export const PROFESIONAL_POR_DEFECTO = "Profesional asignado";
export const PROFESIONAL_LEGACY_PLACEHOLDER = "Equipo profesional asignado";
export const EVOLUCIONES_LOCALES_STORAGE_KEY = "vitalflow:hca:evoluciones-locales";
export const EFECTOR_ID_STORAGE_KEY = "vitalflow:hca:efector-id";

export const RECETARIO_URL = import.meta.env.VITE_RECETARIO_URL?.trim() ?? "";
export const RECETARIO_PROFILE = import.meta.env.VITE_RECETARIO_PROFILE?.trim() || "RDI_Ar_0_2_5";
export const SISTEMAS_CLINICOS_URL = import.meta.env.VITE_SISTEMAS_CLINICOS_URL?.trim() ?? "";

export function estadoEsLlamable(estado: string): boolean {
  const normalized = estado.trim().toUpperCase();
  return normalized === ESTADO_EN_SALA_ESPERA || normalized === ESTADO_EN_OBSERVACION;
}

export function estadoLabel(estado: string): string {
  return estado.split("_").join(" ");
}

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftIsoDate(isoDate: string, days: number): string {
  const base = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(base.getTime())) {
    return todayIsoDate();
  }
  base.setDate(base.getDate() + days);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatAgendaDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("es-AR");
}

export function formatDateTime(value: string): {
  fecha: string;
  hora: string;
} {
  if (value.includes("T")) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        fecha: parsed.toLocaleDateString("es-AR"),
        hora: parsed.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit"
        })
      };
    }
  }
  const [fecha = value, hora = "--:--"] = value.split(" ");
  return { fecha, hora };
}

export function formatLlegada(value: string | null): string {
  if (!value) {
    return "-";
  }
  if (value.includes("T")) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
  const parts = value.split(" ");
  return parts.length > 1 ? parts[1] : value;
}

export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function formatProfesionalDisplayName(username: string | null): string {
  const value = (username ?? "").trim();
  if (!value) {
    return PROFESIONAL_POR_DEFECTO;
  }
  const localPart = value.split("@")[0]?.trim() ?? value;
  const normalized = localPart.replace(/[._-]+/g, " ").trim();
  const target = normalized || localPart;
  return target.split(/\s+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ");
}

export function normalizeProfesionalLabel(value: string | null | undefined, profesionalActual: string): string {
  const raw = (value ?? "").trim();
  if (!raw) {
    return profesionalActual;
  }
  if (normalizeText(raw) === normalizeText(PROFESIONAL_LEGACY_PLACEHOLDER)) {
    return profesionalActual;
  }
  return raw;
}

export function parseTurnoDateTime(turnoLabel: string): number {
  const normalized = turnoLabel.trim();
  const explicitMatch = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (explicitMatch) {
    const [, dd, mm, yyyy, hh, min] = explicitMatch;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), 0, 0).getTime();
  }
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

export function sortByMostRecent(registros: RegistroPanoramica[]): RegistroPanoramica[] {
  return [...registros].sort((a, b) => {
    const da = Date.parse(a.fechaHora);
    const db = Date.parse(b.fechaHora);
    if (!Number.isNaN(da) && !Number.isNaN(db)) {
      return db - da;
    }
    return b.fechaHora.localeCompare(a.fechaHora);
  });
}

export function buildUltimaAtencionAmbulatoria(evoluciones: EvolucionAmbulatoriaResponse[]): RegistroPanoramica[] {
  if (evoluciones.length === 0) {
    return [];
  }
  const ultima = evoluciones[0];
  return [{
    id: ultima.evolucionId,
    fechaHora: ultima.fechaAtencion,
    titulo: "Ultima evolucion ambulatoria",
    detalle: `${ultima.especialidad} | ${ultima.profesional}`,
    problemasAsociados: ultima.problemasAsociados
  }];
}

export function buildListadoEvoluciones(evoluciones: EvolucionAmbulatoriaResponse[]): EvolucionListadoItem[] {
  return evoluciones.map(evolucion => {
    const { fecha } = formatDateTime(evolucion.fechaAtencion);
    return {
      id: evolucion.evolucionId,
      fechaHora: evolucion.fechaAtencion,
      fechaAtencion: fecha,
      especialidad: evolucion.especialidad,
      profesional: evolucion.profesional,
      practica: "Consulta medica",
      problemasAsociados: evolucion.problemasAsociados
    };
  });
}

export function hasValidEvolucionContent(value: string): boolean {
  const plain = extractPlainTextFromHtml(value);
  const alnumChars = (plain.match(/[A-Za-z0-9]/g) ?? []).map(item => item.toLowerCase());
  if (alnumChars.length < 4) {
    return false;
  }
  return new Set(alnumChars).size > 1;
}

export function extractPlainTextFromHtml(value: string): string {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/<\/p>/gi, " ").replace(/<\/div>/gi, " ").replace(/<\/li>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

export function canIntegrarRecetario(turno: TurnoAdmision | null): boolean {
  if (!turno) return false;
  if (!RECETARIO_URL) return false;
  return turno.paciente !== "Por identificar" && turno.documento !== "-";
}

export function canIntegrarSistemasClinicos(turno: TurnoAdmision | null): boolean {
  if (!turno) return false;
  if (!SISTEMAS_CLINICOS_URL) return false;
  return turno.paciente !== "Por identificar" && turno.documento !== "-";
}

export function buildSistemasClinicosUrl(turno: TurnoAdmision): string {
  const target = new URL(SISTEMAS_CLINICOS_URL);
  target.searchParams.set("tipoDocumento", turno.documento.includes(" ") ? turno.documento.split(" ")[0] ?? "DNI" : "DNI");
  target.searchParams.set("numeroDocumento", turno.documento.includes(" ") ? turno.documento.split(" ").slice(1).join(" ") : turno.documento);
  return target.toString();
}

export function buildEvolucionScopeKey(turno: TurnoAdmision): string {
  const documento = (turno.documento ?? "").trim();
  if (documento && documento !== "-") {
    return documento.toUpperCase().replace(/[^A-Z0-9]/g, "");
  }
  return turno.id;
}

export function normalizeEvolucionScopeToken(value: string): string {
  return (value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function parseStoredEvolucionesLocales(raw: string | null): Record<string, EvolucionCreadaLocal[]> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const entries = Object.entries(parsed as Record<string, unknown>).map(([key, value]) => {
      if (!Array.isArray(value)) return [key, []] as const;
      const list = value.filter((item): item is EvolucionCreadaLocal => {
        if (!item || typeof item !== "object") return false;
        const candidate = item as Partial<EvolucionCreadaLocal>;
        return typeof candidate.id === "string" && typeof candidate.fechaAtencion === "string" && typeof candidate.especialidad === "string" && typeof candidate.profesional === "string" && Array.isArray(candidate.problemasAsociados) && typeof candidate.texto === "string";
      });
      return [key, list] as const;
    });
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

export function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

export function sanitizeRichTextHtml(value: string): string {
  return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "").replace(/\son\w+\s*=\s*"[^"]*"/gi, "").replace(/\son\w+\s*=\s*'[^']*'/gi, "").replace(/\sstyle\s*=\s*"[^"]*"/gi, "").replace(/\sstyle\s*=\s*'[^']*'/gi, "");
}

// --- Medication search types ---

export interface MedicamentoResponse {
  id: number;
  principioActivo: string;
  presentacion: string;
  producto: string;
  laboratorio: string;
  familia: string;
  forma: string;
}

// --- Existing receta API types ---

export interface RecetaDigitalResumenResponse {
  recetaId: string;
  pacienteId: string;
  estado: string;
  rdiarProfile: string;
  creadoEn: string;
  cantidadItems: number;
}

export interface RecetaDigitalDetalleResponse {
  recetaId: string;
  pacienteId: string;
  encuentroId?: string;
  turnoId?: string;
  estado: string;
  creadoEn: string;
  items: RecetaDigitalItemResponse[];
}

export interface RecetaDigitalItemResponse {
  itemId: string;
  medicamentoCodigo: string;
  medicamentoSistema: string;
  medicamentoDisplay: string;
  dosisTexto?: string;
  frecuenciaTexto?: string;
  duracionDias?: number;
  indicacion?: string;
  estado: string;
}

export interface AnularRecetaDigitalResponse {
  recetaId: string;
  estadoAnterior: string;
  estadoNuevo: string;
}

export interface CrearPrescripcionRequest {
  pacienteId: string;
  turnoId: string;
  medicamentoId: number;
  medicamentoDisplay: string;
  dosisTexto?: string;
  frecuenciaTexto?: string;
  duracionDias?: number;
  indicacion?: string;
}

export interface CrearPrescripcionResponse {
  recetaId: string;
  estado: string;
  creadoEn: string;
}

export interface BuscarMedicamentosResponse {
  items: MedicamentoResponse[];
  totalCount: number;
  pagina: number;
  paginaSize: number;
}

export function buildRecetarioLaunchContext(turno: TurnoAdmision): RecetarioLaunchContext {
  return {
    standard: "RDIar",
    profile: RECETARIO_PROFILE,
    sourceSystem: "ODI",
    patient: {
      display: turno.paciente,
      identifier: turno.documento
    },
    encounter: {
      turnoId: turno.id,
      servicio: turno.servicio,
      efector: turno.efector
    },
    issuedAt: new Date().toISOString()
  };
}

export function buildRecetarioUrl(turno: TurnoAdmision): string {
  const launchContext = buildRecetarioLaunchContext(turno);
  const encodedContext = toBase64Url(JSON.stringify(launchContext));
  const target = new URL(RECETARIO_URL);
  target.searchParams.set("origen", "odi");
  target.searchParams.set("standard", "RDIar");
  target.searchParams.set("profile", RECETARIO_PROFILE);
  target.searchParams.set("launch", encodedContext);
  return target.toString();
}

export function buildPanoramica(
  turno: TurnoAdmision | null,
  evolucionesAmbulatorias: EvolucionAmbulatoriaResponse[],
  problemasCronicos: RegistroPanoramica[]
): SeccionPanoramica[] {
  if (!turno) return [];
  const ultimaAtencionAmbulatoria = buildUltimaAtencionAmbulatoria(evolucionesAmbulatorias);
  const toTen = (rows: RegistroPanoramica[]) => sortByMostRecent(rows).slice(0, 10);
  return [
    { key: "problemas-cronicos", titulo: "Problemas cronicos", registros: toTen(problemasCronicos) },
    { key: "historia-clinica", titulo: "Historia clinica", registros: [] },
    { key: "internaciones", titulo: "Estudios previos de internacion", registros: [] },
    { key: "intervenciones", titulo: "Intervenciones quirurgicas", registros: [] },
    { key: "ultima-atencion", titulo: "Ultima atencion ambulatoria", registros: toTen(ultimaAtencionAmbulatoria) },
    { key: "alertas", titulo: "Alertas", registros: [] },
    { key: "recordatorios", titulo: "Recordatorios individuales generales", registros: [] }
  ];
}
