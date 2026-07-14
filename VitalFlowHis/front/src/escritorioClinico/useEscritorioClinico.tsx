import { useEffect, useMemo, useRef, useState } from "react";
import { actualizarEstadoTurno, buscarTurnosAdmision, cerrarEncuentroTurno, getSelectoresAdmision, obtenerEncuentroTurno, SelectoresAdmision, TurnoAdmision } from "../admision/admisionApi";
import { CrearEvolucionAmbulatoriaResponse, EvolucionAmbulatoriaResponse, PracticaCatalogoItem, SolicitudEstudioItem, crearEvolucionAmbulatoria, getSolicitudesEstudio, obtenerCatalogoPracticas, obtenerCategoriasCatalogo, obtenerEvolucionesAmbulatoriasPaciente, syncSolicitudesEstudio } from "./escritorioClinicoApi";
import { useAuth } from "../auth/AuthContext";
type UseEscritorioClinicoOptions = {
  onCancelSeleccionServicio?: () => void;
};
type ModoIngreso = "plantilla" | "megafono";
type OrigenPanoramica = "ver" | "historia" | "megafono";
type AccionSalidaEncuentro = "CERRAR_ENCUENTRO" | "ENVIAR_OBSERVACION" | "ENVIAR_LISTA_ESPERA" | "NO_ATENDIDO";
type RegistroPanoramica = {
  id: string;
  fechaHora: string;
  titulo: string;
  detalle: string;
  evolucionesAsociadas?: number;
  problemasAsociados?: string[];
};
type SeccionPanoramica = {
  key: string;
  titulo: string;
  registros: RegistroPanoramica[];
};
type EvolucionListadoItem = {
  id: string;
  fechaHora: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  practica: string;
  problemasAsociados: string[];
  texto?: string;
};
type EvolucionCreadaLocal = {
  id: string;
  fechaAtencion: string;
  especialidad: string;
  profesional: string;
  problemasAsociados: string[];
  texto: string;
};
type SolicitudesEstudiosPorFecha = Record<string, string[]>;
type ObservacionesPorPracticaFecha = Record<string, Record<string, string>>;
const ESTADO_EN_SALA_ESPERA = "EN_SALA_DE_ESPERA";
const ESTADO_EN_OBSERVACION = "EN_OBSERVACION";
const ESTADO_EN_ATENCION = "EN_ATENCION";
const PROFESIONAL_POR_DEFECTO = "Profesional asignado";
const PROFESIONAL_LEGACY_PLACEHOLDER = "Equipo profesional asignado";
const EVOLUCIONES_LOCALES_STORAGE_KEY = "vitalflow:hca:evoluciones-locales";
const RECETARIO_URL = import.meta.env.VITE_RECETARIO_URL?.trim() ?? "";
const RECETARIO_PROFILE = import.meta.env.VITE_RECETARIO_PROFILE?.trim() || "RDI_Ar_0_2_5";
function estadoEsLlamable(estado: string): boolean {
  const normalized = estado.trim().toUpperCase();
  return normalized === ESTADO_EN_SALA_ESPERA || normalized === ESTADO_EN_OBSERVACION || normalized === "PROGRAMADO";
}
function estadoLabel(estado: string): string {
  return estado.split("_").join(" ");
}
function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function shiftIsoDate(isoDate: string, days: number): string {
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
function formatAgendaDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("es-AR");
}
function formatDateTime(value: string): {
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
  return {
    fecha,
    hora
  };
}
function formatLlegada(value: string | null): string {
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
function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
function formatProfesionalDisplayName(username: string | null): string {
  const value = (username ?? "").trim();
  if (!value) {
    return PROFESIONAL_POR_DEFECTO;
  }
  const localPart = value.split("@")[0]?.trim() ?? value;
  const normalized = localPart.replace(/[._-]+/g, " ").trim();
  const target = normalized || localPart;
  return target
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
function normalizeProfesionalLabel(value: string | null | undefined, profesionalActual: string): string {
  const raw = (value ?? "").trim();
  if (!raw) {
    return profesionalActual;
  }
  if (normalizeText(raw) === normalizeText(PROFESIONAL_LEGACY_PLACEHOLDER)) {
    return profesionalActual;
  }
  return raw;
}
function parseTurnoDateTime(turnoLabel: string): number {
  const normalized = turnoLabel.trim();
  const explicitMatch = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (explicitMatch) {
    const [, dd, mm, yyyy, hh, min] = explicitMatch;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), 0, 0).getTime();
  }
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}
function sortByMostRecent(registros: RegistroPanoramica[]): RegistroPanoramica[] {
  return [...registros].sort((a, b) => {
    const da = Date.parse(a.fechaHora);
    const db = Date.parse(b.fechaHora);
    if (!Number.isNaN(da) && !Number.isNaN(db)) {
      return db - da;
    }
    return b.fechaHora.localeCompare(a.fechaHora);
  });
}
function buildProblemasCronicos(turno: TurnoAdmision): RegistroPanoramica[] {
  // Escenario sin datos para pacientes sin identificar y validacion de panorama.
  if (turno.paciente === "Por identificar" || turno.documento === "-") {
    return [];
  }
  return [{
    id: "pc-01",
    fechaHora: "2026-05-29T10:15:00",
    titulo: "Hipertension arterial",
    detalle: "Diagnostico cronico activo",
    evolucionesAsociadas: 5
  }, {
    id: "pc-02",
    fechaHora: "2026-05-20T08:50:00",
    titulo: "Diabetes tipo 2",
    detalle: "Con control metabolico",
    evolucionesAsociadas: 3
  }, {
    id: "pc-03",
    fechaHora: "2026-05-03T09:10:00",
    titulo: "Dislipidemia",
    detalle: "Tratamiento farmacologico vigente",
    evolucionesAsociadas: 2
  }, {
    id: "pc-04",
    fechaHora: "2026-04-22T11:40:00",
    titulo: "Obesidad",
    detalle: "Seguimiento nutricional",
    evolucionesAsociadas: 1
  }, {
    id: "pc-05",
    fechaHora: "2026-03-26T16:20:00",
    titulo: "Asma persistente",
    detalle: "Control por neumonologia",
    evolucionesAsociadas: 4
  }, {
    id: "pc-06",
    fechaHora: "2026-03-10T14:05:00",
    titulo: "Insuficiencia venosa cronica",
    detalle: "Compresion elastica indicada",
    evolucionesAsociadas: 1
  }, {
    id: "pc-07",
    fechaHora: "2026-02-18T09:00:00",
    titulo: "Artrosis de rodilla",
    detalle: "Manejo de dolor y kinesiologia",
    evolucionesAsociadas: 2
  }, {
    id: "pc-08",
    fechaHora: "2026-01-14T12:35:00",
    titulo: "Hipotiroidismo",
    detalle: "Levotiroxina en dosis estable",
    evolucionesAsociadas: 3
  }, {
    id: "pc-09",
    fechaHora: "2025-12-20T10:10:00",
    titulo: "Rinitis alergica",
    detalle: "Tratamiento estacional",
    evolucionesAsociadas: 1
  }, {
    id: "pc-10",
    fechaHora: "2025-11-09T08:45:00",
    titulo: "Lumbalgia cronica",
    detalle: "Plan de ejercicios domiciliarios",
    evolucionesAsociadas: 2
  }, {
    id: "pc-11",
    fechaHora: "2025-10-01T17:25:00",
    titulo: "Insomnio cronico",
    detalle: "Higiene del sueno y seguimiento",
    evolucionesAsociadas: 1
  }];
}
function buildUltimaAtencionAmbulatoria(evoluciones: EvolucionAmbulatoriaResponse[]): RegistroPanoramica[] {
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
function buildListadoEvoluciones(evoluciones: EvolucionAmbulatoriaResponse[]): EvolucionListadoItem[] {
  return evoluciones.map(evolucion => {
    const {
      fecha
    } = formatDateTime(evolucion.fechaAtencion);
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
function hasValidEvolucionContent(value: string): boolean {
  const plain = extractPlainTextFromHtml(value);
  const alnumChars = (plain.match(/[A-Za-z0-9]/g) ?? []).map(item => item.toLowerCase());
  if (alnumChars.length < 4) {
    return false;
  }
  return new Set(alnumChars).size > 1;
}
function extractPlainTextFromHtml(value: string): string {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/<\/p>/gi, " ").replace(/<\/div>/gi, " ").replace(/<\/li>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
function canIntegrarRecetario(turno: TurnoAdmision | null): boolean {
  if (!turno) {
    return false;
  }
  if (!RECETARIO_URL) {
    return false;
  }
  return turno.paciente !== "Por identificar" && turno.documento !== "-";
}
function buildEvolucionScopeKey(turno: TurnoAdmision): string {
  const documento = (turno.documento ?? "").trim();
  if (documento && documento !== "-") {
    return documento.toUpperCase().replace(/[^A-Z0-9]/g, "");
  }
  return turno.id;
}
function normalizeEvolucionScopeToken(value: string): string {
  return (value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function parseStoredEvolucionesLocales(raw: string | null): Record<string, EvolucionCreadaLocal[]> {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const entries = Object.entries(parsed as Record<string, unknown>).map(([key, value]) => {
      if (!Array.isArray(value)) {
        return [key, []] as const;
      }
      const list = value.filter(item => {
        if (!item || typeof item !== "object") {
          return false;
        }
        const candidate = item as Partial<EvolucionCreadaLocal>;
        return typeof candidate.id === "string" && typeof candidate.fechaAtencion === "string" && typeof candidate.especialidad === "string" && typeof candidate.profesional === "string" && Array.isArray(candidate.problemasAsociados) && typeof candidate.texto === "string";
      }) as EvolucionCreadaLocal[];
      return [key, list] as const;
    });
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}
type RecetarioLaunchContext = {
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
function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}
function sanitizeRichTextHtml(value: string): string {
  return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "").replace(/\son\w+\s*=\s*"[^"]*"/gi, "").replace(/\son\w+\s*=\s*'[^']*'/gi, "").replace(/\sstyle\s*=\s*"[^"]*"/gi, "").replace(/\sstyle\s*=\s*'[^']*'/gi, "");
}
function buildRecetarioLaunchContext(turno: TurnoAdmision): RecetarioLaunchContext {
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
function buildRecetarioUrl(turno: TurnoAdmision): string {
  const launchContext = buildRecetarioLaunchContext(turno);
  const encodedContext = toBase64Url(JSON.stringify(launchContext));
  const target = new URL(RECETARIO_URL);
  target.searchParams.set("origen", "odi");
  target.searchParams.set("standard", "RDIar");
  target.searchParams.set("profile", RECETARIO_PROFILE);
  target.searchParams.set("launch", encodedContext);
  return target.toString();
}
function buildPanoramica(turno: TurnoAdmision | null, evolucionesAmbulatorias: EvolucionAmbulatoriaResponse[]): SeccionPanoramica[] {
  if (!turno) {
    return [];
  }
  const paciente = turno.paciente === "Por identificar" ? "Paciente sin identificar" : turno.paciente;
  const doc = turno.documento === "-" ? "Sin documento" : turno.documento;
  const problemasCronicos = buildProblemasCronicos(turno);
  const ultimaAtencionAmbulatoria = buildUltimaAtencionAmbulatoria(evolucionesAmbulatorias);
  const baseRows: Record<string, RegistroPanoramica[]> = {
    "problemas-cronicos": problemasCronicos,
    "historia-clinica": [{
      id: "hc-01",
      fechaHora: "2026-05-28T15:12:00",
      titulo: `Ultimo ingreso de ${paciente}`,
      detalle: `Documento ${doc}`
    }, {
      id: "hc-02",
      fechaHora: "2026-05-10T11:10:00",
      titulo: "Anamnesis general",
      detalle: "Revision por clinica medica"
    }],
    "internaciones": [{
      id: "in-01",
      fechaHora: "2025-11-04T13:20:00",
      titulo: "Internacion breve",
      detalle: "Dolor abdominal agudo"
    }],
    "estudios-complementarios": [{
      id: "ec-01",
      fechaHora: "2026-05-27T09:30:00",
      titulo: "Laboratorio general",
      detalle: "Hemograma y bioquimica"
    }, {
      id: "ec-02",
      fechaHora: "2026-05-21T16:00:00",
      titulo: "Ecografia abdominal",
      detalle: "Sin hallazgos relevantes"
    }, {
      id: "ec-03",
      fechaHora: "2026-05-17T12:45:00",
      titulo: "Radiografia torax",
      detalle: "Control anual"
    }, {
      id: "ec-04",
      fechaHora: "2026-05-12T08:20:00",
      titulo: "Electrocardiograma",
      detalle: "Ritmo sinusal"
    }, {
      id: "ec-05",
      fechaHora: "2026-04-27T14:00:00",
      titulo: "Perfil lipidico",
      detalle: "Leve aumento LDL"
    }, {
      id: "ec-06",
      fechaHora: "2026-04-10T11:10:00",
      titulo: "TSH",
      detalle: "Valores normales"
    }, {
      id: "ec-07",
      fechaHora: "2026-03-30T09:00:00",
      titulo: "Glucemia ayuno",
      detalle: "En seguimiento"
    }, {
      id: "ec-08",
      fechaHora: "2026-03-12T10:40:00",
      titulo: "Orina completa",
      detalle: "Sin alteraciones"
    }, {
      id: "ec-09",
      fechaHora: "2026-02-18T09:20:00",
      titulo: "Creatinina",
      detalle: "Funcion renal estable"
    }, {
      id: "ec-10",
      fechaHora: "2026-01-21T15:40:00",
      titulo: "Urea",
      detalle: "Control de rutina"
    }, {
      id: "ec-11",
      fechaHora: "2025-12-18T10:10:00",
      titulo: "Ionograma",
      detalle: "Dentro de parametros"
    }, {
      id: "ec-12",
      fechaHora: "2025-11-11T09:45:00",
      titulo: "Proteinograma",
      detalle: "Sin cambios"
    }],
    "intervenciones": [{
      id: "iq-01",
      fechaHora: "2024-08-15T08:00:00",
      titulo: "Colecistectomia laparoscopica",
      detalle: "Alta a las 48 hs"
    }],
    "ultima-atencion": ultimaAtencionAmbulatoria,
    alertas: [{
      id: "al-01",
      fechaHora: "2026-05-30T08:00:00",
      titulo: "Alergia medicamentosa",
      detalle: "Penicilina (alerta alta)"
    }, {
      id: "al-02",
      fechaHora: "2026-05-21T10:30:00",
      titulo: "Riesgo cardiovascular",
      detalle: "Control estricto de TA en cada consulta"
    }],
    recordatorios: [{
      id: "re-01",
      fechaHora: "2026-05-31T09:00:00",
      titulo: "Recordatorio individual",
      detalle: "Solicitar laboratorio de control en 30 dias"
    }, {
      id: "re-02",
      fechaHora: "2026-05-25T12:00:00",
      titulo: "Recordatorio general",
      detalle: "Verificar esquema de vacunacion en proximas consultas"
    }]
  };
  const toTen = (rows: RegistroPanoramica[]) => sortByMostRecent(rows).slice(0, 10);
  return [{
    key: "problemas-cronicos",
    titulo: "Problemas cronicos",
    registros: toTen(baseRows["problemas-cronicos"])
  }, {
    key: "historia-clinica",
    titulo: "Historia clinica",
    registros: toTen(baseRows["historia-clinica"])
  }, {
    key: "internaciones",
    titulo: "Estudios previos de internacion",
    registros: toTen(baseRows.internaciones)
  }, {
    key: "estudios-complementarios",
    titulo: "Estudios complementarios",
    registros: toTen(baseRows["estudios-complementarios"])
  }, {
    key: "intervenciones",
    titulo: "Intervenciones quirurgicas",
    registros: toTen(baseRows.intervenciones)
  }, {
    key: "ultima-atencion",
    titulo: "Ultima atencion ambulatoria",
    registros: toTen(baseRows["ultima-atencion"])
  }, {
    key: "alertas",
    titulo: "Alertas",
    registros: toTen(baseRows.alertas)
  }, {
    key: "recordatorios",
    titulo: "Recordatorios individuales generales",
    registros: toTen(baseRows.recordatorios)
  }];
}
export function useEscritorioClinico({ onCancelSeleccionServicio }: UseEscritorioClinicoOptions = {}) {
  const { roles, username } = useAuth();
  const profesionalActual = useMemo(() => formatProfesionalDisplayName(username), [username]);
  const isAdminUsuario = roles.some(role => normalizeText(role) === "administrador");
  const isMedicoUsuario = roles.some(role => normalizeText(role) === "medico");
  const [selectores, setSelectores] = useState<SelectoresAdmision | null>(null);
  const [turnos, setTurnos] = useState<TurnoAdmision[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceSelectionError, setServiceSelectionError] = useState<string | null>(null);
  const [agendaMensaje, setAgendaMensaje] = useState<string | null>(null);
  const [showSinAgendaModal, setShowSinAgendaModal] = useState(false);
  const [encuentroEstado, setEncuentroEstado] = useState<string>("SIN_ENCUENTRO");
  const [estadoPacienteId, setEstadoPacienteId] = useState<string | null>(null);
  const [evolucionesAmbulatorias, setEvolucionesAmbulatorias] = useState<EvolucionAmbulatoriaResponse[]>([]);
  const [fechaAgenda, setFechaAgenda] = useState(todayIsoDate());
  const [servicioId, setServicioId] = useState("");
  const [servicioPendienteId, setServicioPendienteId] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(false);
  const [showServicioModal, setShowServicioModal] = useState(false);
  const [showLugarAtencionModal, setShowLugarAtencionModal] = useState(false);
  const [lugarAtencionPendienteId, setLugarAtencionPendienteId] = useState("");
  const [lugarAtencionError, setLugarAtencionError] = useState<string | null>(null);
  const [efectorId, setEfectorId] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [query, setQuery] = useState("");
  const [selectedTurnoId, setSelectedTurnoId] = useState<string | null>(null);
  const [turnoVistaRapidaId, setTurnoVistaRapidaId] = useState<string | null>(null);
  const [pendingLlamadoTurnoId, setPendingLlamadoTurnoId] = useState<string | null>(null);
  const [modoIngreso, setModoIngreso] = useState<ModoIngreso>("plantilla");
  const [origenPanoramica, setOrigenPanoramica] = useState<OrigenPanoramica>("ver");
  const [contadorLlamados, setContadorLlamados] = useState<Record<string, number>>({});
  const [showEvolucionesListado, setShowEvolucionesListado] = useState(false);
  const [showAgregarEvolucionModal, setShowAgregarEvolucionModal] = useState(false);
  const [showSalidaEncuentroModal, setShowSalidaEncuentroModal] = useState(false);
  const [accionSalidaEncuentro, setAccionSalidaEncuentro] = useState<AccionSalidaEncuentro | "">("");
  const [evolucionesFiltroProfesional, setEvolucionesFiltroProfesional] = useState("");
  const [evolucionesFiltroServicio, setEvolucionesFiltroServicio] = useState("");
  const [evolucionTextoDraft, setEvolucionTextoDraft] = useState("");
  const [evolucionProblemasTextoDraft, setEvolucionProblemasTextoDraft] = useState("");
  const [evolucionFormError, setEvolucionFormError] = useState<string | null>(null);
  const [evolucionesLocalesPorTurno, setEvolucionesLocalesPorTurno] = useState<Record<string, EvolucionCreadaLocal[]>>(() => {
    if (typeof window === "undefined") {
      return {};
    }
    return parseStoredEvolucionesLocales(window.localStorage.getItem(EVOLUCIONES_LOCALES_STORAGE_KEY));
  });
  const [showSolicitudEstudiosModal, setShowSolicitudEstudiosModal] = useState(false);
  const [showFechaPrimeraPracticaModal, setShowFechaPrimeraPracticaModal] = useState(false);
  const [showObservacionModal, setShowObservacionModal] = useState(false);
  const [fechaSolicitudNueva, setFechaSolicitudNueva] = useState(todayIsoDate());
  const [fechaSolicitudActiva, setFechaSolicitudActiva] = useState("");
  const [busquedaPracticas, setBusquedaPracticas] = useState("");
  const [busquedaPracticasDerecha, setBusquedaPracticasDerecha] = useState("");
  const [practicasSeleccionadasIzquierda, setPracticasSeleccionadasIzquierda] = useState<string[]>([]);
  const [practicasSeleccionadasDerecha, setPracticasSeleccionadasDerecha] = useState<string[]>([]);
  const [practicaObservacionActiva, setPracticaObservacionActiva] = useState<string | null>(null);
  const [observacionDraft, setObservacionDraft] = useState("");
  const [observacionesPorTurno, setObservacionesPorTurno] = useState<Record<string, ObservacionesPorPracticaFecha>>({});
  const [solicitudScopeTurnoId, setSolicitudScopeTurnoId] = useState<string | null>(null);
  const [solicitudOrigen, setSolicitudOrigen] = useState<"general" | "evolucion">("general");
  const [canalEnvioSolicitudes, setCanalEnvioSolicitudes] = useState<"impresion" | "correo">("impresion");
  const [solicitudToast, setSolicitudToast] = useState<string | null>(null);
  const [solicitudError, setSolicitudError] = useState<string | null>(null);
  const [solicitudesEstudiosPorTurno, setSolicitudesEstudiosPorTurno] = useState<Record<string, SolicitudesEstudiosPorFecha>>({});
  const [catalogoPracticas, setCatalogoPracticas] = useState<PracticaCatalogoItem[]>([]);
  const [catalogoCategorias, setCatalogoCategorias] = useState<string[]>([]);
  const [catalogoLoading, setCatalogoLoading] = useState(false);
  const [catalogoSearch, setCatalogoSearch] = useState("");
  const [catalogoCategoriaFiltro, setCatalogoCategoriaFiltro] = useState("");
  const evolucionEditorRef = useRef<HTMLDivElement | null>(null);
  const lugarAtencionPreguntadoRef = useRef(false);
  const selectedTurno = useMemo(() => turnos.find(t => t.id === selectedTurnoId) ?? null, [selectedTurnoId, turnos]);
  const turnoVistaRapida = useMemo(() => turnos.find(t => t.id === turnoVistaRapidaId) ?? null, [turnoVistaRapidaId, turnos]);
  const pendingLlamadoTurno = useMemo(() => turnos.find(t => t.id === pendingLlamadoTurnoId) ?? null, [pendingLlamadoTurnoId, turnos]);
  const pacienteEnAtencionConflicto = useMemo(() => {
    if (!pendingLlamadoTurno) {
      return null;
    }
    return turnos.find(turno => turno.id !== pendingLlamadoTurno.id && turno.estado === ESTADO_EN_ATENCION) ?? null;
  }, [pendingLlamadoTurno, turnos]);
  const turnosFiltrados = useMemo(() => {
    const turnosOrdenados = [...turnos].sort((a, b) => {
      const diff = parseTurnoDateTime(a.turno) - parseTurnoDateTime(b.turno);
      if (diff !== 0) {
        return diff;
      }
      return a.id.localeCompare(b.id);
    });
    const turnosConConsultorioAplicado = isMedicoUsuario && !isAdminUsuario && efectorId
      ? turnosOrdenados.filter(turno => turno.efector === efectorId)
      : turnosOrdenados;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return turnosConConsultorioAplicado;
    }
    return turnosConConsultorioAplicado.filter(turno => turno.paciente.toLowerCase().includes(normalizedQuery) || turno.documento.toLowerCase().includes(normalizedQuery) || turno.servicio.toLowerCase().includes(normalizedQuery) || turno.efector.toLowerCase().includes(normalizedQuery));
  }, [turnos, query, isMedicoUsuario, isAdminUsuario, efectorId]);
  const evolucionScopeKeys = useMemo(() => {
    if (!selectedTurno) {
      return [] as string[];
    }
    const byDocumento = buildEvolucionScopeKey(selectedTurno);
    return Array.from(new Set([byDocumento, selectedTurno.id]));
  }, [selectedTurno]);

  const evolucionesLocalesPaciente = useMemo(() => {
    if (!selectedTurno || evolucionScopeKeys.length === 0) {
      return [] as EvolucionCreadaLocal[];
    }

    const scopeKey = buildEvolucionScopeKey(selectedTurno);
    const scopeKeyNormalized = normalizeEvolucionScopeToken(scopeKey);
    const turnoIdNormalized = normalizeEvolucionScopeToken(selectedTurno.id);
    const legacyDocumentoRaw = (selectedTurno.documento ?? "").trim().toUpperCase();

    const seen = new Set<string>();
    const merged: EvolucionCreadaLocal[] = [];
    for (const [storedKey, storedItems] of Object.entries(evolucionesLocalesPorTurno)) {
      const storedKeyNormalized = normalizeEvolucionScopeToken(storedKey);
      const perteneceAlPaciente =
        storedKey === scopeKey ||
        storedKey === selectedTurno.id ||
        storedKey === legacyDocumentoRaw ||
        storedKeyNormalized === scopeKeyNormalized ||
        storedKeyNormalized === turnoIdNormalized;
      if (!perteneceAlPaciente) {
        continue;
      }
      for (const item of storedItems) {
        if (seen.has(item.id)) {
          continue;
        }
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [selectedTurno, evolucionScopeKeys, evolucionesLocalesPorTurno]);

  const evolucionesAmbulatoriasConLocales = useMemo(() => {
    if (!selectedTurno) {
      return evolucionesAmbulatorias;
    }

    const localesAmbulatorias: EvolucionAmbulatoriaResponse[] = evolucionesLocalesPaciente.map(item => ({
      evolucionId: item.id,
      fechaAtencion: item.fechaAtencion,
      especialidad: item.especialidad,
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual),
      problemasAsociados: item.problemasAsociados
    }));

    const backendNormalizadas = evolucionesAmbulatorias.map(item => ({
      ...item,
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
    }));

    return [...localesAmbulatorias, ...backendNormalizadas].sort((a, b) => {
      const da = Date.parse(a.fechaAtencion);
      const db = Date.parse(b.fechaAtencion);
      if (!Number.isNaN(da) && !Number.isNaN(db)) {
        return db - da;
      }
      return b.fechaAtencion.localeCompare(a.fechaAtencion);
    });
  }, [selectedTurno, evolucionesAmbulatorias, evolucionesLocalesPaciente, profesionalActual]);

  const panoramica = useMemo(() => buildPanoramica(selectedTurno, evolucionesAmbulatoriasConLocales), [selectedTurno, evolucionesAmbulatoriasConLocales]);
  const evolucionesCombinadas = useMemo(() => {
    if (!selectedTurno) {
      return buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
        ...item,
        profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
      }));
    }
    const base = buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
      ...item,
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
    }));
    const locales = evolucionesLocalesPaciente.map(item => {
      const {
        fecha
      } = formatDateTime(item.fechaAtencion);
      return {
        id: item.id,
        fechaHora: item.fechaAtencion,
        fechaAtencion: fecha,
        especialidad: item.especialidad,
        profesional: normalizeProfesionalLabel(item.profesional, profesionalActual),
        practica: "Consulta medica",
        problemasAsociados: item.problemasAsociados,
        texto: item.texto
      } satisfies EvolucionListadoItem;
    });
    return [...locales, ...base];
  }, [selectedTurno, evolucionesAmbulatorias, evolucionesLocalesPaciente, profesionalActual]);
  const listadoEvoluciones = useMemo(() => evolucionesCombinadas, [evolucionesCombinadas]);
  const profesionalesEvoluciones = useMemo(() => Array.from(new Set(listadoEvoluciones.map(item => item.profesional))).sort((a, b) => a.localeCompare(b, "es", {
    sensitivity: "base"
  })), [listadoEvoluciones]);
  const serviciosEvoluciones = useMemo(() => Array.from(new Set(listadoEvoluciones.map(item => item.especialidad))).sort((a, b) => a.localeCompare(b, "es", {
    sensitivity: "base"
  })), [listadoEvoluciones]);
  const listadoEvolucionesFiltradas = useMemo(() => {
    return listadoEvoluciones.filter(item => !evolucionesFiltroProfesional || item.profesional === evolucionesFiltroProfesional).filter(item => !evolucionesFiltroServicio || item.especialidad === evolucionesFiltroServicio).sort((a, b) => {
      const da = Date.parse(a.fechaHora);
      const db = Date.parse(b.fechaHora);
      if (!Number.isNaN(da) && !Number.isNaN(db)) {
        return db - da;
      }
      return b.fechaHora.localeCompare(a.fechaHora);
    });
  }, [listadoEvoluciones, evolucionesFiltroProfesional, evolucionesFiltroServicio]);
  const canLlamar = selectedTurno ? estadoEsLlamable(selectedTurno.estado) : false;
  const pacienteEnAtencion = selectedTurno?.estado === ESTADO_EN_ATENCION;
  const esVisualizacionHC = origenPanoramica === "historia" && !pacienteEnAtencion;
  const puedeAbrirEvoluciones = Boolean(selectedTurno && !esVisualizacionHC);
  const puedeSolicitarEstudios = Boolean(selectedTurno && !esVisualizacionHC);
  const esDiaActual = fechaAgenda === todayIsoDate();
  const serviciosDisponibles = selectores?.servicios ?? [];
  const practicasDisponibles = useMemo(() => {
    if (!servicioId) {
      return [];
    }
    return (selectores?.practicas ?? []).filter(practica => practica.servicioId === servicioId).map(practica => practica.nombre).filter((value, index, arr) => arr.indexOf(value) === index).sort((a, b) => a.localeCompare(b, "es", {
      sensitivity: "base"
    }));
  }, [selectores, servicioId]);
  const draftSolicitudScopeId = selectedTurno ? `draft-evol-${selectedTurno.id}` : "";
  const solicitudScopeId = solicitudScopeTurnoId ?? selectedTurno?.id ?? null;
  const solicitudesTurnoSeleccionado = useMemo(() => solicitudScopeId ? solicitudesEstudiosPorTurno[solicitudScopeId] ?? {} : {}, [solicitudScopeId, solicitudesEstudiosPorTurno]);
  const fechasSolicitudesOrdenadas = useMemo(() => Object.keys(solicitudesTurnoSeleccionado).sort((a, b) => a.localeCompare(b)), [solicitudesTurnoSeleccionado]);
  const practicasFechaActiva = useMemo(() => fechaSolicitudActiva ? solicitudesTurnoSeleccionado[fechaSolicitudActiva] ?? [] : [], [solicitudesTurnoSeleccionado, fechaSolicitudActiva]);
  const observacionesFechaActiva = useMemo(() => {
    if (!solicitudScopeId || !fechaSolicitudActiva) {
      return {};
    }
    return observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva] ?? {};
  }, [solicitudScopeId, fechaSolicitudActiva, observacionesPorTurno]);
  const practicasFiltradasIzquierda = useMemo(() => {
    const filtro = busquedaPracticas.trim().toLowerCase();
    if (filtro.length < 3) {
      return [];
    }
    return practicasDisponibles.filter(practica => !practicasFechaActiva.includes(practica)).filter(practica => practica.toLowerCase().includes(filtro));
  }, [busquedaPracticas, practicasDisponibles, practicasFechaActiva]);
  const totalEstudiosSolicitados = useMemo(() => Object.values(solicitudesTurnoSeleccionado).reduce((acc, list) => acc + list.length, 0), [solicitudesTurnoSeleccionado]);
  const totalEstudiosSolicitadosTurno = useMemo(() => selectedTurno ? Object.values(solicitudesEstudiosPorTurno[selectedTurno.id] ?? {}).reduce((acc, list) => acc + list.length, 0) : 0, [selectedTurno, solicitudesEstudiosPorTurno]);
  const totalEstudiosSolicitadosDraftEvolucion = useMemo(() => draftSolicitudScopeId ? Object.values(solicitudesEstudiosPorTurno[draftSolicitudScopeId] ?? {}).reduce((acc, list) => acc + list.length, 0) : 0, [draftSolicitudScopeId, solicitudesEstudiosPorTurno]);
  const evolucionProblemasTextoNormalizado = useMemo(() => extractPlainTextFromHtml(evolucionProblemasTextoDraft), [evolucionProblemasTextoDraft]);
  const evolucionProblemasEtiquetas = useMemo(() => {
    const raw = evolucionProblemasTextoNormalizado;
    if (!raw) {
      return [];
    }
    const items = raw
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(Boolean);
    if (items.length === 0 && raw.trim()) {
      return [raw.trim()];
    }
    return Array.from(new Set(items));
  }, [evolucionProblemasTextoNormalizado]);
  const canGuardarEvolucion = useMemo(
    () => hasValidEvolucionContent(evolucionTextoDraft) && evolucionProblemasEtiquetas.length > 0,
    [evolucionTextoDraft, evolucionProblemasEtiquetas]
  );
  const canAplicarFormatoEvolucion = useMemo(() => evolucionTextoDraft.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, "").trim().length > 0, [evolucionTextoDraft]);
  const cumpleRegistroMinimoSalidaEncuentro = useMemo(() => {
    const draftCumple = hasValidEvolucionContent(evolucionTextoDraft) && evolucionProblemasEtiquetas.length > 0;
    if (draftCumple) {
      return true;
    }
    if (selectedTurno) {
      const localesTurno = evolucionesLocalesPaciente;
      const existeLocalValida = localesTurno.some(item => hasValidEvolucionContent(item.texto) && item.problemasAsociados.length > 0);
      if (existeLocalValida) {
        return true;
      }
    }

    // El backend del listado actual no expone texto de evolución; si existe evolución con etiquetas,
    // se considera válida para no bloquear salidas de encuentros históricos.
    return evolucionesAmbulatorias.some(item => item.problemasAsociados.length > 0);
  }, [evolucionTextoDraft, evolucionProblemasEtiquetas, selectedTurno, evolucionesLocalesPaciente, evolucionesAmbulatorias]);
  const canSolicitarEstudiosDesdeEvolucion = useMemo(
    () => extractPlainTextFromHtml(evolucionTextoDraft).length > 0 && evolucionProblemasEtiquetas.length > 0,
    [evolucionTextoDraft, evolucionProblemasEtiquetas]
  );
  useEffect(() => {
    setEvolucionesLocalesPorTurno(prev => {
      let changed = false;
      const next: Record<string, EvolucionCreadaLocal[]> = {};
      for (const [key, items] of Object.entries(prev)) {
        next[key] = items.map(item => {
          const profesionalNormalizado = normalizeProfesionalLabel(item.profesional, profesionalActual);
          if (profesionalNormalizado === item.profesional) {
            return item;
          }
          changed = true;
          return {
            ...item,
            profesional: profesionalNormalizado
          };
        });
      }
      return changed ? next : prev;
    });
  }, [profesionalActual]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(EVOLUCIONES_LOCALES_STORAGE_KEY, JSON.stringify(evolucionesLocalesPorTurno));
  }, [evolucionesLocalesPorTurno]);
  const efectoresDisponibles = useMemo(() => {
    if (isMedicoUsuario && !isAdminUsuario) {
      const consultorios = Array.from(new Set(turnos.map(turno => turno.efector).filter(nombre => nombre && nombre !== "-")));
      return consultorios.map(nombre => ({
        id: nombre,
        nombre,
        tipoEfector: "CONSULTORIO",
        servicioId
      }));
    }
    return (selectores?.efectores ?? []).filter(efector => !servicioId || efector.servicioId === servicioId);
  }, [isMedicoUsuario, isAdminUsuario, turnos, servicioId, selectores]);
  const servicioActualNombre = useMemo(() => serviciosDisponibles.find(servicio => servicio.id === servicioId)?.nombre ?? "-", [serviciosDisponibles, servicioId]);
  const lugarAtencionNombre = useMemo(() => {
    if (isMedicoUsuario && !isAdminUsuario) {
      if (efectorId) {
        return efectorId;
      }
      return efectoresDisponibles[0]?.nombre ?? turnos[0]?.efector ?? "-";
    }
    return efectoresDisponibles.find(efector => efector.id === efectorId)?.nombre ?? "-";
  }, [isMedicoUsuario, isAdminUsuario, turnos, efectoresDisponibles, efectorId]);
  const horarioConfigurado = useMemo(() => turnos[0]?.turno ? `${turnos[0].turno} hs` : "-", [turnos]);
  async function loadSelectores() {
    const data = await getSelectoresAdmision();
    setSelectores(data);
    if (isMedicoUsuario && !isAdminUsuario) {
      if (data.servicios.length === 0) {
        setServicioId("");
        setServicioPendienteId("");
        setServicioSeleccionado(false);
        setShowServicioModal(false);
        setEfectorId("");
        setServiceSelectionError("No tiene agenda activa para el dia de hoy.");
        setError("No tiene agenda activa para el dia de hoy.");
        return;
      }
      if (data.servicios.length === 1) {
        const servicioAsignado = data.servicios[0];
        setServicioId(servicioAsignado.id);
        setServicioPendienteId(servicioAsignado.id);
        setServicioSeleccionado(true);
        setShowServicioModal(false);
        setServiceSelectionError(null);
        setError(null);
        setEfectorId("");
        return;
      }
      setServicioId("");
      setServicioPendienteId("");
      setServicioSeleccionado(false);
      setShowServicioModal(true);
      setEfectorId("");
      setServiceSelectionError(null);
      setError(null);
      return;
    }
    if (data.servicios.length > 0) {
      // El ingreso a HC requiere seleccionar servicio explicitamente.
      setServicioId("");
      setServicioPendienteId("");
      setServicioSeleccionado(false);
      setShowServicioModal(true);
      setServiceSelectionError(null);
      setEfectorId("");
      return;
    }
    setServicioId("");
    setServicioPendienteId("");
    setServicioSeleccionado(false);
    setShowServicioModal(false);
    setEfectorId("");
    setServiceSelectionError("No hay servicios disponibles para ingresar al módulo de Historia Clinica.");
  }
  function confirmarServicioIngreso() {
    if (!servicioPendienteId) {
      setServiceSelectionError("Debe seleccionar un servicio para ingresar.");
      return;
    }
    setServicioId(servicioPendienteId);
    const efectoresServicio = (selectores?.efectores ?? []).filter(efector => efector.servicioId === servicioPendienteId);
    setEfectorId(efectoresServicio[0]?.id ?? "");
    setServicioSeleccionado(true);
    setShowServicioModal(false);
    setServiceSelectionError(null);
    setError(null);
  }
  function confirmarCambioLugarAtencion() {
    if (!lugarAtencionPendienteId) {
      setLugarAtencionError("Debe seleccionar un lugar de atencion.");
      return;
    }
    setEfectorId(lugarAtencionPendienteId);
    setShowLugarAtencionModal(false);
    setLugarAtencionError(null);
    setAgendaMensaje("Se cambio el lugar de atencion correctamente para el dia de hoy.");
  }
  function cancelarServicioIngreso() {
    setShowServicioModal(false);
    setServiceSelectionError(null);
    onCancelSeleccionServicio?.();
  }
  function limpiarSolicitudesScope(scopeId: string) {
    setSolicitudesEstudiosPorTurno(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, scopeId)) {
        return prev;
      }
      const next = {
        ...prev
      };
      delete next[scopeId];
      return next;
    });
    setObservacionesPorTurno(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, scopeId)) {
        return prev;
      }
      const next = {
        ...prev
      };
      delete next[scopeId];
      return next;
    });
  }
  async function cargarCatalogoPracticas() {
    setCatalogoLoading(true);
    try {
      const [practicas, categorias] = await Promise.all([
        obtenerCatalogoPracticas(),
        obtenerCategoriasCatalogo()
      ]);
      setCatalogoPracticas(practicas);
      setCatalogoCategorias(categorias);
    } catch (err) {
      console.error("Error al cargar catálogo de prácticas:", err);
      setCatalogoPracticas([]);
      setCatalogoCategorias([]);
    } finally {
      setCatalogoLoading(false);
    }
  }
  function abrirSolicitudEstudiosConScope(scopeId: string, origen: "general" | "evolucion") {
    const existentes = solicitudesEstudiosPorTurno[scopeId] ?? {};
    const fechas = Object.keys(existentes).sort((a, b) => a.localeCompare(b));
    setSolicitudScopeTurnoId(scopeId);
    setSolicitudOrigen(origen);
    setFechaSolicitudNueva(todayIsoDate());
    setFechaSolicitudActiva(fechas[0] ?? "");
    setBusquedaPracticas("");
    setPracticasSeleccionadasIzquierda([]);
    setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null);
    setCanalEnvioSolicitudes("impresion");
    setShowSolicitudEstudiosModal(true);
  }
  function abrirSolicitudEstudios() {
    if (!selectedTurno) {
      setError("Debe seleccionar un paciente para solicitar estudios.");
      return;
    }
    if (!puedeSolicitarEstudios) {
      setError("Solicitar estudios esta deshabilitado en modo visualizacion HC.");
      return;
    }
    abrirSolicitudEstudiosConScope(selectedTurno.id, "general");
  }
  function abrirSolicitudEstudiosDesdeEvolucion() {
    if (!selectedTurno) {
      return;
    }
    if (!canSolicitarEstudiosDesdeEvolucion) {
      setEvolucionFormError("Solicitar estudios se habilita con texto y al menos un problema cargado.");
      return;
    }
    abrirSolicitudEstudiosConScope(`draft-evol-${selectedTurno.id}`, "evolucion");
  }
  function abrirAgregarEvolucion() {
    if (!selectedTurno) {
      setError("Debe seleccionar un paciente para agregar una evolucion.");
      return;
    }
    setEvolucionTextoDraft("");
    setEvolucionProblemasTextoDraft("");
    setEvolucionFormError(null);
    limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
    setShowAgregarEvolucionModal(true);
  }
  function abrirEvoluciones() {
    if (!selectedTurno) {
      setError("Debe seleccionar un paciente para acceder a evoluciones.");
      return;
    }
    if (!puedeAbrirEvoluciones) {
      setError("Evoluciones esta deshabilitado en modo visualizacion HC.");
      return;
    }
    setShowEvolucionesListado(true);
    setError(null);
  }
  function aplicarFormatoEvolucion(comando: "bold" | "italic" | "underline" | "strikeThrough" | "insertUnorderedList" | "indent") {
    if (!canAplicarFormatoEvolucion) {
      return;
    }
    if (!evolucionEditorRef.current) {
      return;
    }
    evolucionEditorRef.current.focus();
    document.execCommand(comando, false);
    setEvolucionTextoDraft(sanitizeRichTextHtml(evolucionEditorRef.current.innerHTML));
  }
  async function guardarEvolucionNueva() {
    if (!selectedTurno) {
      return;
    }
    if (!estadoPacienteId) {
      setEvolucionFormError("Paciente no identificado. No se puede guardar la evolucion.");
      return;
    }
    if (!hasValidEvolucionContent(evolucionTextoDraft)) {
      limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
      setEvolucionFormError("La evolucion requiere al menos 4 caracteres alfanumericos no repetidos.");
      return;
    }
    if (evolucionProblemasEtiquetas.length === 0) {
      limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
      setEvolucionFormError("Debe registrar al menos un problema en texto libre.");
      return;
    }
    const draftScopeId = `draft-evol-${selectedTurno.id}`;
    const draftSolicitudes = solicitudesEstudiosPorTurno[draftScopeId] ?? {};
    const draftObservaciones = observacionesPorTurno[draftScopeId] ?? {};
    if (Object.keys(draftSolicitudes).length > 0) {
      setSolicitudesEstudiosPorTurno(prev => {
        const target = prev[selectedTurno.id] ?? {};
        const merged: SolicitudesEstudiosPorFecha = {
          ...target
        };
        for (const [fecha, practicas] of Object.entries(draftSolicitudes)) {
          merged[fecha] = Array.from(new Set([...(merged[fecha] ?? []), ...practicas]));
        }
        const next = {
          ...prev,
          [selectedTurno.id]: merged
        };
        delete next[draftScopeId];
        return next;
      });
      setObservacionesPorTurno(prev => {
        const target = prev[selectedTurno.id] ?? {};
        const merged: ObservacionesPorPracticaFecha = {
          ...target
        };
        for (const [fecha, observacionesFecha] of Object.entries(draftObservaciones)) {
          merged[fecha] = {
            ...(merged[fecha] ?? {}),
            ...observacionesFecha
          };
        }
        const next = {
          ...prev,
          [selectedTurno.id]: merged
        };
        delete next[draftScopeId];
        return next;
      });
    }
    const texto = sanitizeRichTextHtml(evolucionTextoDraft).trim();
    try {
      const response = await crearEvolucionAmbulatoria({
        pacienteId: estadoPacienteId,
        turnoId: selectedTurno.id,
        texto,
        problemas: [...evolucionProblemasEtiquetas],
        especialidad: selectedTurno.servicio,
        profesional: profesionalActual
      });
      setEvolucionesAmbulatorias(prev => [{
        evolucionId: response.evolucionId,
        fechaAtencion: response.fechaAtencion,
        especialidad: selectedTurno.servicio,
        profesional: profesionalActual,
        problemasAsociados: [...evolucionProblemasEtiquetas]
      }, ...prev]);
    } catch {
      setEvolucionFormError("Error al guardar la evolucion. Verifique la conexion e intente de nuevo.");
      return;
    }
    setShowAgregarEvolucionModal(false);
    setEvolucionTextoDraft("");
    setEvolucionProblemasTextoDraft("");
    setEvolucionFormError(null);
    setSolicitudScopeTurnoId(null);
    mostrarToastSolicitud("Evolucion guardada correctamente.");
  }
  function mostrarToastSolicitud(message: string) {
    setSolicitudToast(message);
  }
  function imprimirSolicitudesPracticas() {
    if (!selectedTurno) {
      setSolicitudError("Debe seleccionar un paciente para imprimir las solicitudes.");
      return;
    }
    if (!solicitudScopeId) {
      return;
    }
    if (totalEstudiosSolicitados === 0) {
      setSolicitudError("No hay practicas cargadas para imprimir.");
      return;
    }
    const popup = window.open("", "_blank", "noopener,noreferrer,width=980,height=760");
    if (!popup) {
      setSolicitudError("No se pudo abrir la ventana de impresion. Verifica bloqueador de ventanas.");
      return;
    }
    const secciones = fechasSolicitudesOrdenadas.map(fecha => {
      const practicas = solicitudesTurnoSeleccionado[fecha] ?? [];
      if (practicas.length === 0) {
        return "";
      }
      const items = practicas.map(practica => {
        const observacion = observacionesPorTurno[solicitudScopeId]?.[fecha]?.[practica]?.trim();
        const observacionHtml = observacion ? `<p class="obs"><strong>Observacion:</strong> ${escapeHtml(observacion)}</p>` : "";
        return `<li><span>${escapeHtml(practica)}</span>${observacionHtml}</li>`;
      }).join("");
      return `
          <section class="orden-section">
            <h2>Fecha de solicitud: ${escapeHtml(formatAgendaDate(fecha))}</h2>
            <ul>${items}</ul>
          </section>
        `;
    }).join("");
    const html = `
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Solicitud de practicas</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #1b1b1b; }
          h1 { margin: 0 0 12px; font-size: 22px; }
          .meta { margin: 0 0 16px; font-size: 13px; line-height: 1.5; }
          .orden-section { border: 1px solid #d6dfe8; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
          .orden-section h2 { margin: 0 0 8px; font-size: 16px; }
          .orden-section ul { margin: 0; padding-left: 20px; }
          .orden-section li { margin-bottom: 6px; }
          .obs { margin: 4px 0 0; font-size: 13px; color: #2d4f72; }
        </style>
      </head>
      <body>
        <h1>Solicitud de practicas medicas</h1>
        <p class="meta">
          <strong>Paciente:</strong> ${escapeHtml(selectedTurno.paciente)}<br />
          <strong>Documento:</strong> ${escapeHtml(selectedTurno.documento)}<br />
          <strong>Servicio:</strong> ${escapeHtml(selectedTurno.servicio)}<br />
          <strong>Lugar de atencion:</strong> ${escapeHtml(selectedTurno.efector)}
        </p>
        ${secciones}
      </body>
      </html>
    `;
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
    mostrarToastSolicitud("Orden enviada a impresion.");
    setSolicitudError(null);
  }
  function agregarFechaSolicitud() {
    if (!solicitudScopeId) {
      return;
    }
    const hoy = todayIsoDate();
    if (fechaSolicitudNueva < hoy) {
      setSolicitudError("No puede agregar fechas anteriores a la actual.");
      return;
    }
    const existentes = solicitudesEstudiosPorTurno[solicitudScopeId] ?? {};
    if (Object.prototype.hasOwnProperty.call(existentes, fechaSolicitudNueva)) {
      setSolicitudError("No pueden repetirse las fechas.");
      return;
    }
    setSolicitudesEstudiosPorTurno(prev => ({
      ...prev,
      [solicitudScopeId]: {
        ...(prev[solicitudScopeId] ?? {}),
        [fechaSolicitudNueva]: []
      }
    }));
    setFechaSolicitudActiva(fechaSolicitudNueva);
    setPracticasSeleccionadasIzquierda([]);
    setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null);
  }
  function moverPracticasSeleccionadasADerecha() {
    if (!solicitudScopeId) {
      return;
    }
    if (practicasSeleccionadasIzquierda.length === 0) {
      return;
    }
    if (!fechaSolicitudActiva) {
      setFechaSolicitudNueva(todayIsoDate());
      setShowFechaPrimeraPracticaModal(true);
      setSolicitudError(null);
      return;
    }
    const existentes = solicitudesTurnoSeleccionado[fechaSolicitudActiva] ?? [];
    const nuevas = practicasSeleccionadasIzquierda.filter(item => !existentes.includes(item));
    if (nuevas.length === 0) {
      setSolicitudError("La practica no puede repetirse dentro de la misma fecha.");
      return;
    }
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const prevPracticas = turnoMap[fechaSolicitudActiva] ?? [];
      return {
        ...prev,
        [solicitudScopeId]: {
          ...turnoMap,
          [fechaSolicitudActiva]: [...prevPracticas, ...nuevas]
        }
      };
    });
    setPracticasSeleccionadasIzquierda([]);
    setSolicitudError(null);
  }
  function moverPracticasSeleccionadasAIzquierda() {
    if (!solicitudScopeId || !fechaSolicitudActiva) {
      return;
    }
    if (practicasSeleccionadasDerecha.length === 0) {
      return;
    }
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const prevPracticas = turnoMap[fechaSolicitudActiva] ?? [];
      return {
        ...prev,
        [solicitudScopeId]: {
          ...turnoMap,
          [fechaSolicitudActiva]: prevPracticas.filter(item => !practicasSeleccionadasDerecha.includes(item))
        }
      };
    });
    setObservacionesPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const fechaMap = turnoMap[fechaSolicitudActiva] ?? {};
      const nextFechaMap: Record<string, string> = {};
      for (const [practica, observacion] of Object.entries(fechaMap)) {
        if (!practicasSeleccionadasDerecha.includes(practica)) {
          nextFechaMap[practica] = observacion;
        }
      }
      return {
        ...prev,
        [solicitudScopeId]: {
          ...turnoMap,
          [fechaSolicitudActiva]: nextFechaMap
        }
      };
    });
    setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null);
  }
  function togglePracticaCatalogo(item: PracticaCatalogoItem) {
    if (!solicitudScopeId) {
      return;
    }
    const fecha = fechaSolicitudActiva;
    if (!fecha) {
      setFechaSolicitudNueva(todayIsoDate());
      setShowFechaPrimeraPracticaModal(true);
      return;
    }
    const existentes = solicitudesTurnoSeleccionado[fecha] ?? [];
    const yaSeleccionada = existentes.includes(item.nombre);
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const prevPracticas = turnoMap[fecha] ?? [];
      const nextPracticas = yaSeleccionada
        ? prevPracticas.filter(p => p !== item.nombre)
        : [...prevPracticas, item.nombre];
      return {
        ...prev,
        [solicitudScopeId]: {
          ...turnoMap,
          [fecha]: nextPracticas
        }
      };
    });
    if (yaSeleccionada) {
      setObservacionesPorTurno(prev => {
        const turnoMap = prev[solicitudScopeId] ?? {};
        const fechaMap = turnoMap[fecha] ?? {};
        const nextFechaMap = { ...fechaMap };
        delete nextFechaMap[item.nombre];
        return {
          ...prev,
          [solicitudScopeId]: {
            ...turnoMap,
            [fecha]: nextFechaMap
          }
        };
      });
    }
  }
  function abrirObservacionPractica(practica: string) {
    if (!solicitudScopeId || !fechaSolicitudActiva) {
      return;
    }
    const existente = observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva]?.[practica] ?? "";
    setPracticaObservacionActiva(practica);
    setObservacionDraft(existente);
    setShowObservacionModal(true);
    setSolicitudError(null);
  }
  function guardarObservacionPractica() {
    if (!solicitudScopeId || !fechaSolicitudActiva || !practicaObservacionActiva) {
      return;
    }
    const texto = observacionDraft.trim();
    if (!texto) {
      return;
    }
    const observacionPrevia = observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva]?.[practicaObservacionActiva];
    setObservacionesPorTurno(prev => ({
      ...prev,
      [solicitudScopeId]: {
        ...(prev[solicitudScopeId] ?? {}),
        [fechaSolicitudActiva]: {
          ...(prev[solicitudScopeId]?.[fechaSolicitudActiva] ?? {}),
          [practicaObservacionActiva]: texto
        }
      }
    }));
    setShowObservacionModal(false);
    setPracticaObservacionActiva(null);
    setObservacionDraft("");
    mostrarToastSolicitud(observacionPrevia ? "Observacion editada correctamente." : "Observacion agregada correctamente.");
  }
  function eliminarObservacionPractica(practica: string) {
    if (!solicitudScopeId || !fechaSolicitudActiva) {
      return;
    }
    setObservacionesPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const fechaMap = turnoMap[fechaSolicitudActiva] ?? {};
      if (!Object.prototype.hasOwnProperty.call(fechaMap, practica)) {
        return prev;
      }
      const nextFechaMap = {
        ...fechaMap
      };
      delete nextFechaMap[practica];
      return {
        ...prev,
        [solicitudScopeId]: {
          ...turnoMap,
          [fechaSolicitudActiva]: nextFechaMap
        }
      };
    });
    mostrarToastSolicitud("Observacion eliminada correctamente.");
  }
  function confirmarFechaPrimeraPractica() {
    if (!solicitudScopeId) {
      return;
    }
    const hoy = todayIsoDate();
    if (fechaSolicitudNueva < hoy) {
      setSolicitudError("No puede agregar fechas anteriores a la actual.");
      return;
    }
    const existentes = solicitudesEstudiosPorTurno[solicitudScopeId] ?? {};
    if (Object.prototype.hasOwnProperty.call(existentes, fechaSolicitudNueva)) {
      setSolicitudError("No pueden repetirse las fechas.");
      return;
    }
    setSolicitudesEstudiosPorTurno(prev => ({
      ...prev,
      [solicitudScopeId]: {
        ...(prev[solicitudScopeId] ?? {}),
        [fechaSolicitudNueva]: [...practicasSeleccionadasIzquierda]
      }
    }));
    setFechaSolicitudActiva(fechaSolicitudNueva);
    setPracticasSeleccionadasIzquierda([]);
    setShowFechaPrimeraPracticaModal(false);
    setSolicitudError(null);
  }
  async function guardarSolicitudesEstudio() {
    if (!estadoPacienteId || !solicitudScopeId) return;
    const scopeData = solicitudesEstudiosPorTurno[solicitudScopeId];
    if (!scopeData) return;
    const items: SolicitudEstudioItem[] = [];
    for (const [fecha, practicas] of Object.entries(scopeData)) {
      for (const nombre of practicas) {
        const observacion = observacionesPorTurno[solicitudScopeId]?.[fecha]?.[nombre] ?? null;
        items.push({ practicaNombre: nombre, fechaSolicitada: fecha, observacion });
      }
    }
    try {
      await syncSolicitudesEstudio(estadoPacienteId, solicitudScopeId, items);
    } catch (err) {
      console.error("Error al guardar solicitudes:", err);
    }
  }
  async function loadTurnos() {
    setLoading(true);
    setError(null);
    try {
      const data = await buscarTurnosAdmision({
        servicioId: servicioId || undefined,
        efectorId: isMedicoUsuario && !isAdminUsuario ? undefined : efectorId || undefined,
        estado: estadoFiltro || undefined,
        fecha: fechaAgenda
      });
      setTurnos(data);
      if (isMedicoUsuario && !isAdminUsuario) {
        const consultorios = Array.from(new Set(data.map(item => item.efector).filter(nombre => nombre && nombre !== "-")));
        const consultorioDefault = consultorios[0] ?? "";
        setEfectorId(prev => prev && consultorios.includes(prev) ? prev : consultorioDefault);

        // Primer ingreso medico del dia: pedir confirmacion explicita del lugar de atencion.
        if (!lugarAtencionPreguntadoRef.current && consultorioDefault) {
          setLugarAtencionPendienteId(consultorioDefault);
          setLugarAtencionError(null);
          setShowLugarAtencionModal(true);
          lugarAtencionPreguntadoRef.current = true;
        }
      }
      setSelectedTurnoId(prev => prev && data.some(item => item.id === prev) ? prev : null);
      if (data.length === 0 && esDiaActual) {
        setShowSinAgendaModal(true);
        if (isMedicoUsuario && !isAdminUsuario) {
          setError("No tiene agenda activa para el dia de hoy.");
        }
      } else {
        setShowSinAgendaModal(false);
        if (isMedicoUsuario && !isAdminUsuario) {
          setError(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el listado de pacientes.");
    } finally {
      setLoading(false);
    }
  }
  function updateTurnoState(turnoId: string, estado: string) {
    setTurnos(prev => prev.map(item => item.id === turnoId ? {
      ...item,
      estado
    } : item));
  }
  async function llamarPaciente(turno: TurnoAdmision) {
    if (!estadoEsLlamable(turno.estado)) {
      return;
    }
    setWorking(true);
    setError(null);
    try {
      if (turno.estado.trim().toUpperCase() === "PROGRAMADO") {
        await actualizarEstadoTurno(turno.id, {
          estado: ESTADO_EN_SALA_ESPERA,
          motivo: "RECONCILIAR_ARRIBO_PARA_LLAMADO"
        });
        updateTurnoState(turno.id, ESTADO_EN_SALA_ESPERA);
      }
      const response = await actualizarEstadoTurno(turno.id, {
        estado: ESTADO_EN_ATENCION,
        motivo: "LLAMADO_DESDE_PANORAMICA"
      });
      updateTurnoState(turno.id, response.estado);
      setContadorLlamados(prev => ({
        ...prev,
        [turno.id]: (prev[turno.id] ?? 0) + 1
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo llamar al paciente.");
    } finally {
      setWorking(false);
    }
  }
  async function abrirHistoriaClinica(turno: TurnoAdmision) {
    setModoIngreso("plantilla");
    setOrigenPanoramica("historia");
    setSelectedTurnoId(turno.id);
    setError(null);
  }
  function verTurno(turno: TurnoAdmision) {
    setTurnoVistaRapidaId(turno.id);
    setError(null);
  }
  async function abrirDesdeMegafono(turno: TurnoAdmision) {
    if (!estadoEsLlamable(turno.estado) || working) {
      return;
    }
    setError(null);
    setPendingLlamadoTurnoId(turno.id);
  }
  async function confirmarLlamadoMegafono() {
    if (!pendingLlamadoTurno) {
      setPendingLlamadoTurnoId(null);
      return;
    }
    setModoIngreso("megafono");
    setOrigenPanoramica("megafono");
    setSelectedTurnoId(pendingLlamadoTurno.id);
    setPendingLlamadoTurnoId(null);
    await llamarPaciente(pendingLlamadoTurno);
  }
  async function confirmarSalidaEncuentro() {
    if (!selectedTurno || !accionSalidaEncuentro) {
      return;
    }
    setWorking(true);
    setError(null);
    try {
      if (accionSalidaEncuentro === "CERRAR_ENCUENTRO") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) {
          setError("Cerrar encuentro requiere paciente en atencion.");
          return;
        }
        if (!cumpleRegistroMinimoSalidaEncuentro) {
          setError("Debe registrar texto y al menos una etiqueta de problemas en la evolución para continuar.");
          return;
        }
        const response = await cerrarEncuentroTurno(selectedTurno.id, {
          estadoPacienteFinal: "ATENDIDO"
        });
        updateTurnoState(selectedTurno.id, response.estadoPacienteFinal);
        setEncuentroEstado(response.estadoEncuentro);
        setAgendaMensaje("Se cambió el estado del encuentro a Atendido");
        setSelectedTurnoId(null);
      }
      if (accionSalidaEncuentro === "ENVIAR_OBSERVACION") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) {
          setError("Enviar a observación requiere paciente en atención.");
          return;
        }
        if (!cumpleRegistroMinimoSalidaEncuentro) {
          setError("Debe registrar texto y al menos una etiqueta de problemas en la evolución para continuar.");
          return;
        }
        const response = await actualizarEstadoTurno(selectedTurno.id, {
          estado: ESTADO_EN_OBSERVACION,
          motivo: "SALIDA_DESDE_ENCUENTRO"
        });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se envió el paciente a observación");
      }
      if (accionSalidaEncuentro === "ENVIAR_LISTA_ESPERA") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) {
          setError("Enviar a lista de espera requiere paciente en atención.");
          return;
        }
        const response = await actualizarEstadoTurno(selectedTurno.id, {
          estado: ESTADO_EN_SALA_ESPERA,
          motivo: "SALIDA_DESDE_ENCUENTRO"
        });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se envió el paciente a lista de espera");
      }
      if (accionSalidaEncuentro === "NO_ATENDIDO") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA) {
          setError("No atendido requiere paciente en atención o en sala de espera.");
          return;
        }
        const response = await cerrarEncuentroTurno(selectedTurno.id, {
          estadoPacienteFinal: "NO_ATENDIDO"
        });
        updateTurnoState(selectedTurno.id, response.estadoPacienteFinal);
        setEncuentroEstado(response.estadoEncuentro);
        setAgendaMensaje("Se cambió el estado del encuentro a No atendido");
        setSelectedTurnoId(null);
      }
      setShowSalidaEncuentroModal(false);
      setAccionSalidaEncuentro("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la acción de salida.");
    } finally {
      setWorking(false);
    }
  }
  function abrirRecetaDigital() {
    if (!selectedTurno) {
      setError("Debe seleccionar un paciente para acceder al recetario.");
      return;
    }
    if (!RECETARIO_URL) {
      setError("No se configuro VITE_RECETARIO_URL para integrar Receta Digital.");
      return;
    }
    if (selectedTurno.paciente === "Por identificar" || selectedTurno.documento === "-") {
      setError("El paciente debe estar identificado para acceder a Receta Digital.");
      return;
    }
    setError(null);
    const url = buildRecetarioUrl(selectedTurno);
    window.open(url, "_blank", "noopener,noreferrer");
  }
  useEffect(() => {
    void loadSelectores();
  }, [isAdminUsuario, isMedicoUsuario]);
  useEffect(() => {
    if (!selectores) {
      return;
    }
    if (!servicioSeleccionado || !servicioId) {
      return;
    }
    void loadTurnos();
  }, [selectores, servicioSeleccionado, servicioId, efectorId, estadoFiltro, fechaAgenda]);

  useEffect(() => {
    // Cambio de fecha: volver a solicitar lugar de atencion en el primer refresh del nuevo dia.
    lugarAtencionPreguntadoRef.current = false;
  }, [fechaAgenda]);
  useEffect(() => {
    if (!selectedTurnoId) {
      setEncuentroEstado("SIN_ENCUENTRO");
      setEstadoPacienteId(null);
      setEvolucionesAmbulatorias([]);
      setShowEvolucionesListado(false);
      setShowAgregarEvolucionModal(false);
      return;
    }
    let active = true;
    void (async () => {
      try {
        const response = await obtenerEncuentroTurno(selectedTurnoId);
        const [evoluciones, solicitudes] = await Promise.all([
          obtenerEvolucionesAmbulatoriasPaciente(response.pacienteId, 20),
          getSolicitudesEstudio(response.pacienteId, selectedTurnoId)
        ]);
        if (active) {
          setEncuentroEstado(response.estado);
          setEstadoPacienteId(response.pacienteId);
          setEvolucionesAmbulatorias(evoluciones);
          const scopeId = selectedTurnoId;
          const solicitudesAgrupadas: Record<string, SolicitudesEstudiosPorFecha> = {};
          const observacionesAgrupadas: Record<string, ObservacionesPorPracticaFecha> = {};
          for (const s of solicitudes) {
            if (!solicitudesAgrupadas[scopeId]) solicitudesAgrupadas[scopeId] = {};
            if (!solicitudesAgrupadas[scopeId][s.fechaSolicitada]) solicitudesAgrupadas[scopeId][s.fechaSolicitada] = [];
            solicitudesAgrupadas[scopeId][s.fechaSolicitada].push(s.practicaNombre);
            if (s.observacion) {
              if (!observacionesAgrupadas[scopeId]) observacionesAgrupadas[scopeId] = {};
              if (!observacionesAgrupadas[scopeId][s.fechaSolicitada]) observacionesAgrupadas[scopeId][s.fechaSolicitada] = {};
              observacionesAgrupadas[scopeId][s.fechaSolicitada][s.practicaNombre] = s.observacion;
            }
          }
          setSolicitudesEstudiosPorTurno(solicitudesAgrupadas);
          setObservacionesPorTurno(observacionesAgrupadas);
        }
      } catch {
        if (active) {
          setEncuentroEstado("SIN_ENCUENTRO");
          setEstadoPacienteId(null);
          setEvolucionesAmbulatorias([]);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedTurnoId]);
  useEffect(() => {
    if (!solicitudToast) {
      return;
    }
    const timer = window.setTimeout(() => {
      setSolicitudToast(null);
    }, 2800);
    return () => {
      window.clearTimeout(timer);
    };
  }, [solicitudToast]);

  const prevModalRef = useRef(showSolicitudEstudiosModal);
  useEffect(() => {
    if (prevModalRef.current === true && showSolicitudEstudiosModal === false) {
      void guardarSolicitudesEstudio();
    }
    prevModalRef.current = showSolicitudEstudiosModal;
  }, [showSolicitudEstudiosModal]);

  const showLlamarMegafonoModal = pendingLlamadoTurnoId !== null;
  const showVistaRapidaModal = turnoVistaRapidaId !== null;
  const setLlamarMegafonoModal = (open: boolean) => {
    if (!open) {
      setPendingLlamadoTurnoId(null);
    }
  };
  const setVistaRapidaModal = (open: boolean) => {
    if (!open) {
      setTurnoVistaRapidaId(null);
    }
  };
  const showSolicitarEstudiosModal = showSolicitudEstudiosModal;
  const setShowSolicitarEstudiosModal = setShowSolicitudEstudiosModal;
  useEffect(() => {
    if (showSolicitudEstudiosModal) {
      void cargarCatalogoPracticas();
      setCatalogoSearch("");
      setCatalogoCategoriaFiltro("");
    }
  }, [showSolicitudEstudiosModal]);
  const catalogoFiltrado = useMemo(() => {
    let items = catalogoPracticas;
    if (catalogoCategoriaFiltro) {
      items = items.filter(p => p.categoria === catalogoCategoriaFiltro);
    }
    const q = catalogoSearch.trim().toLowerCase();
    if (q.length > 0) {
      items = items.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(q))
      );
    }
    return items;
  }, [catalogoPracticas, catalogoCategoriaFiltro, catalogoSearch]);
  const catalogoAgrupado = useMemo(() => {
    const grupos = new Map<string, PracticaCatalogoItem[]>();
    for (const item of catalogoFiltrado) {
      const cat = item.categoria ?? "Sin categoria";
      if (!grupos.has(cat)) {
        grupos.set(cat, []);
      }
      grupos.get(cat)!.push(item);
    }
    return Array.from(grupos.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [catalogoFiltrado]);
  const isEstudioDesdeEvolucion = solicitudOrigen === "evolucion";
  const opcionesPracticasIzquierda = practicasFiltradasIzquierda.map(practica => ({
    id: practica,
    nombre: practica
  }));
  const opcionesPracticasDerecha = practicasFechaActiva.map(practica => ({
    id: practica,
    nombre: practica
  }));
  const searchQueryPracticasIzquierda = busquedaPracticas;
  const setSearchQueryPracticasIzquierda = setBusquedaPracticas;
  const searchQueryPracticasDerecha = busquedaPracticasDerecha;
  const setSearchQueryPracticasDerecha = setBusquedaPracticasDerecha;
  const selectedPracticasIzquierda = practicasSeleccionadasIzquierda;
  const setSelectedPracticasIzquierda = setPracticasSeleccionadasIzquierda;
  const selectedPracticasDerecha = practicasSeleccionadasDerecha;
  const setSelectedPracticasDerecha = setPracticasSeleccionadasDerecha;
  const solicitudesScopeActual = solicitudScopeId ?? "";
  const solicitudesPorScope = {
    [solicitudesScopeActual]: observacionesFechaActiva
  };
  const observacionPracticaModalData = practicaObservacionActiva ? {
    id: practicaObservacionActiva,
    nombre: practicaObservacionActiva
  } : null;
  const setObservacionPracticaModalData = (value: {
    id: string;
    nombre: string;
  } | null) => {
    setPracticaObservacionActiva(value?.id ?? null);
  };
  const observacionPracticaText = observacionDraft;
  const setObservacionPracticaText = setObservacionDraft;
  const salidaEncuentroError = error;

  return {
    isAdminUsuario,
    isMedicoUsuario,
    selectores,
    setSelectores,
    turnos,
    setTurnos,
    loading,
    setLoading,
    working,
    setWorking,
    error,
    setError,
    serviceSelectionError,
    setServiceSelectionError,
    agendaMensaje,
    setAgendaMensaje,
    showSinAgendaModal,
    setShowSinAgendaModal,
    encuentroEstado,
    setEncuentroEstado,
    estadoPacienteId,
    evolucionesAmbulatorias,
    setEvolucionesAmbulatorias,
    fechaAgenda,
    setFechaAgenda,
    servicioId,
    setServicioId,
    servicioPendienteId,
    setServicioPendienteId,
    servicioSeleccionado,
    setServicioSeleccionado,
    showServicioModal,
    setShowServicioModal,
    showLugarAtencionModal,
    setShowLugarAtencionModal,
    lugarAtencionPendienteId,
    setLugarAtencionPendienteId,
    lugarAtencionError,
    setLugarAtencionError,
    efectorId,
    setEfectorId,
    estadoFiltro,
    setEstadoFiltro,
    query,
    setQuery,
    selectedTurnoId,
    setSelectedTurnoId,
    turnoVistaRapidaId,
    setTurnoVistaRapidaId,
    turnoVistaRapida,
    pendingLlamadoTurnoId,
    setPendingLlamadoTurnoId,
    modoIngreso,
    setModoIngreso,
    origenPanoramica,
    setOrigenPanoramica,
    contadorLlamados,
    setContadorLlamados,
    showEvolucionesListado,
    setShowEvolucionesListado,
    showAgregarEvolucionModal,
    setShowAgregarEvolucionModal,
    showSalidaEncuentroModal,
    setShowSalidaEncuentroModal,
    accionSalidaEncuentro,
    setAccionSalidaEncuentro,
    evolucionesFiltroProfesional,
    setEvolucionesFiltroProfesional,
    evolucionesFiltroServicio,
    setEvolucionesFiltroServicio,
    evolucionTextoDraft,
    setEvolucionTextoDraft,
    evolucionProblemasTextoDraft,
    setEvolucionProblemasTextoDraft,
    evolucionFormError,
    setEvolucionFormError,
    evolucionesLocalesPorTurno,
    setEvolucionesLocalesPorTurno,
    showSolicitudEstudiosModal,
    setShowSolicitudEstudiosModal,
    showFechaPrimeraPracticaModal,
    setShowFechaPrimeraPracticaModal,
    showObservacionModal,
    setShowObservacionModal,
    fechaSolicitudNueva,
    setFechaSolicitudNueva,
    fechaSolicitudActiva,
    setFechaSolicitudActiva,
    busquedaPracticas,
    setBusquedaPracticas,
    busquedaPracticasDerecha,
    setBusquedaPracticasDerecha,
    practicasSeleccionadasIzquierda,
    setPracticasSeleccionadasIzquierda,
    practicasSeleccionadasDerecha,
    setPracticasSeleccionadasDerecha,
    practicaObservacionActiva,
    setPracticaObservacionActiva,
    observacionDraft,
    setObservacionDraft,
    observacionesPorTurno,
    setObservacionesPorTurno,
    solicitudScopeTurnoId,
    setSolicitudScopeTurnoId,
    solicitudOrigen,
    setSolicitudOrigen,
    canalEnvioSolicitudes,
    setCanalEnvioSolicitudes,
    solicitudToast,
    setSolicitudToast,
    solicitudError,
    setSolicitudError,
    solicitudesEstudiosPorTurno,
    setSolicitudesEstudiosPorTurno,
    catalogoPracticas,
    catalogoCategorias,
    catalogoLoading,
    catalogoSearch,
    setCatalogoSearch,
    catalogoCategoriaFiltro,
    setCatalogoCategoriaFiltro,
    catalogoFiltrado,
    catalogoAgrupado,
    cargarCatalogoPracticas,
    togglePracticaCatalogo,
    evolucionEditorRef,
    selectedTurno,
    pendingLlamadoTurno,
    pacienteEnAtencionConflicto,
    turnosFiltrados,
    panoramica,
    evolucionesCombinadas,
    listadoEvoluciones,
    profesionalesEvoluciones,
    serviciosEvoluciones,
    listadoEvolucionesFiltradas,
    canLlamar,
    puedeAbrirEvoluciones,
    puedeSolicitarEstudios,
    esDiaActual,
    formatAgendaDate,
    shiftIsoDate,
    estadoLabel,
    formatLlegada,
    estadoEsLlamable,
    formatDateTime,
    canIntegrarRecetario,
    PROFESIONAL_ACTUAL: profesionalActual,
    ESTADO_EN_ATENCION,
    ESTADO_EN_SALA_ESPERA,
    serviciosDisponibles,
    practicasDisponibles,
    draftSolicitudScopeId,
    solicitudScopeId,
    solicitudesTurnoSeleccionado,
    fechasSolicitudesOrdenadas,
    practicasFechaActiva,
    observacionesFechaActiva,
    practicasFiltradasIzquierda,
    totalEstudiosSolicitados,
    totalEstudiosSolicitadosTurno,
    totalEstudiosSolicitadosDraftEvolucion,
    evolucionProblemasEtiquetas,
    canGuardarEvolucion,
    canAplicarFormatoEvolucion,
    cumpleRegistroMinimoSalidaEncuentro,
    canSolicitarEstudiosDesdeEvolucion,
    showSolicitarEstudiosModal,
    setShowSolicitarEstudiosModal,
    isEstudioDesdeEvolucion,
    opcionesPracticasIzquierda,
    opcionesPracticasDerecha,
    searchQueryPracticasIzquierda,
    setSearchQueryPracticasIzquierda,
    searchQueryPracticasDerecha,
    setSearchQueryPracticasDerecha,
    selectedPracticasIzquierda,
    setSelectedPracticasIzquierda,
    selectedPracticasDerecha,
    setSelectedPracticasDerecha,
    solicitudesScopeActual,
    solicitudesPorScope,
    observacionPracticaModalData,
    setObservacionPracticaModalData,
    observacionPracticaText,
    setObservacionPracticaText,
    showLlamarMegafonoModal,
    setLlamarMegafonoModal,
    showVistaRapidaModal,
    setVistaRapidaModal,
    salidaEncuentroError,
    efectoresDisponibles,
    servicioActualNombre,
    lugarAtencionNombre,
    horarioConfigurado,
    loadSelectores,
    cancelarServicioIngreso,
    confirmarServicioIngreso,
    confirmarCambioLugarAtencion,
    limpiarSolicitudesScope,
    guardarSolicitudesEstudio,
    abrirSolicitudEstudiosConScope,
    abrirSolicitudEstudios,
    abrirSolicitudEstudiosDesdeEvolucion,
    abrirEvoluciones,
    abrirAgregarEvolucion,
    aplicarFormatoEvolucion,
    guardarEvolucionNueva,
    mostrarToastSolicitud,
    imprimirSolicitudesPracticas,
    agregarFechaSolicitud,
    moverPracticasSeleccionadasADerecha,
    moverPracticasSeleccionadasAIzquierda,
    abrirObservacionPractica,
    guardarObservacionPractica,
    eliminarObservacionPractica,
    confirmarFechaPrimeraPractica,
    loadTurnos,
    updateTurnoState,
    llamarPaciente,
    abrirHistoriaClinica,
    verTurno,
    abrirDesdeMegafono,
    confirmarLlamadoMegafono,
    confirmarSalidaEncuentro,
    abrirRecetaDigital
  };
}