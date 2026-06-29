import './EscritorioClinico.css';
import { EscritorioClinicoHeader, EscritorioClinicoFiltros, EscritorioClinicoListado, EscritorioClinicoPanoramica } from "./components/EscritorioClinicoComponents";
import { EscritorioClinicoModales } from "./components/EscritorioClinicoModales";
import { useEscritorioClinico } from "./useEscritorioClinico";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUnsavedChanges } from "../navigation/UnsavedChangesContext";
import { actualizarEstadoTurno, buscarTurnosAdmision, cerrarEncuentroTurno, getSelectoresAdmision, obtenerEncuentroTurno, SelectoresAdmision, TurnoAdmision } from "../admision/admisionApi";
import { EvolucionAmbulatoriaResponse, obtenerEvolucionesAmbulatoriasPaciente } from "./escritorioClinicoApi";
import { useNavigate } from "react-router-dom";
type EscritorioClinicoPageProps = {
  onCancelSeleccionServicio?: () => void;
};
type ModoIngreso = "plantilla" | "megafono";
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
const PROFESIONAL_ACTUAL = "Equipo profesional asignado";
const RECETARIO_URL = import.meta.env.VITE_RECETARIO_URL?.trim() ?? "";
const RECETARIO_PROFILE = import.meta.env.VITE_RECETARIO_PROFILE?.trim() || "RDI_Ar_0_2_5";
function estadoEsLlamable(estado: string): boolean {
  const normalized = estado.trim().toUpperCase();
  return normalized === ESTADO_EN_SALA_ESPERA || normalized === ESTADO_EN_OBSERVACION;
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
export function sanitizeRichTextHtml(value: string): string {
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
export function EscritorioClinicoPage({ onCancelSeleccionServicio }: EscritorioClinicoPageProps) {
  const navigate = useNavigate();
  const state = useEscritorioClinico({
    onCancelSeleccionServicio: () => {
      if (onCancelSeleccionServicio) {
        onCancelSeleccionServicio();
        return;
      }
      navigate("/");
    }
  });
  const { markUnsavedChanges, clearUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    const hasDraftEvolucion = state.showAgregarEvolucionModal && (
      state.evolucionTextoDraft.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, "").trim().length > 0
      || state.evolucionProblemasTextoDraft.trim().length > 0
    );

    const hasDraftSolicitud = state.showSolicitarEstudiosModal && (
      state.searchQueryPracticasIzquierda.trim().length > 0
      || state.searchQueryPracticasDerecha.trim().length > 0
      || state.selectedPracticasIzquierda.length > 0
      || state.selectedPracticasDerecha.length > 0
      || state.totalEstudiosSolicitados > 0
    );

    const hasDraftObservacion = Boolean(state.observacionPracticaModalData)
      && state.observacionPracticaText.trim().length > 0;

    if (hasDraftEvolucion || hasDraftSolicitud || hasDraftObservacion) {
      markUnsavedChanges();
      return;
    }

    clearUnsavedChanges();
  }, [
    clearUnsavedChanges,
    markUnsavedChanges,
    state.observacionPracticaModalData,
    state.observacionPracticaText,
    state.evolucionProblemasTextoDraft,
    state.evolucionTextoDraft,
    state.searchQueryPracticasDerecha,
    state.searchQueryPracticasIzquierda,
    state.selectedPracticasDerecha,
    state.selectedPracticasIzquierda,
    state.showAgregarEvolucionModal,
    state.showSolicitarEstudiosModal,
    state.totalEstudiosSolicitados,
  ]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("vitalflow:hca-vista", {
      detail: {
        vista: state.selectedTurno ? "panoramica" : "agenda"
      }
    }));
  }, [state.selectedTurno]);
  
  return (
    <section className="hc-page" aria-label="Escritorio clinico">
      <EscritorioClinicoHeader state={state} />
      {!state.selectedTurno ? <EscritorioClinicoFiltros state={state} /> : null}
      
      {state.error ? <p className="hc-error">{state.error}</p> : null}
      {state.solicitudToast ? <p className="hc-toast-success" role="status" aria-live="polite">{state.solicitudToast}</p> : null}

      <nav className="hc-breadcrumb" aria-label="Navegacion historia clinica">
        <span className="hc-breadcrumb-item">Historia Clinica</span>
        <span className="hc-breadcrumb-sep">&gt;&gt;</span>
        {!state.selectedTurno ? <span className="hc-breadcrumb-item">Agenda Asistencial</span> : state.origenPanoramica === "historia" ? <button type="button" className="hc-breadcrumb-step" onClick={() => state.setSelectedTurnoId(null)}>
            Agenda Asistencial
          </button> : <span className="hc-breadcrumb-item hc-breadcrumb-item-locked" title="Si ingreso por Megafono, debe salir desde el flujo de Salir.">
            Agenda Asistencial
          </span>}
        {state.selectedTurno ? <>
            <span className="hc-breadcrumb-sep">&gt;&gt;</span>
            <span className="hc-breadcrumb-item hc-breadcrumb-item-current">Panoramica</span>
          </> : null}
      </nav>

      <div className={`hc-layout ${state.selectedTurno ? "hc-layout-panoramica" : "hc-layout-listado"}`}>
        {state.selectedTurno ? <EscritorioClinicoPanoramica state={state} /> : <EscritorioClinicoListado state={state} />}
      </div>

      <EscritorioClinicoModales state={state} />
    </section>
  );
}