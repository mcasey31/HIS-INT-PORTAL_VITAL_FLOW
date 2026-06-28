import { useEffect, useMemo, useRef, useState } from "react";
import { actualizarEstadoTurno, buscarTurnosAdmision, cerrarEncuentroTurno, getSelectoresAdmision, obtenerEncuentroTurno } from "../admision/admisionApi";
import type { TurnoAdmision, SelectoresAdmision } from "../admision/admisionTypes";
import { anularRecetaDigital, asignarProblemaPaciente, buscarMedicamentos, buscarPersonaPorDocumento, buscarPersonaPorSetMinimo, crearPrescripcion, crearEvolucionAmbulatoria, guardarSolicitudesEstudiosTurno, listarRecetasPaciente, obtenerEvolucionesAmbulatoriasPaciente, obtenerProblemasCronicosPaciente, obtenerRecetaDigital, obtenerSolicitudesEstudiosTurno } from "./escritorioClinicoApi";
import type { AsignarProblemaRequest, BuscarMedicamentosResponse, CrearEvolucionAmbulatoriaRequest, EvolucionAmbulatoriaResponse, GuardarSolicitudesEstudiosRequest, MedicamentoResponse, PersonaCandidataBusqueda, ProblemaCronicoResponse, RecetaDigitalResumenResponse, RegistroPanoramica, SolicitudEstudioRecord } from "./escritorioClinicoTypes";
import {
  UseEscritorioClinicoOptions, ModoIngreso, OrigenPanoramica, AccionSalidaEncuentro,
  EvolucionCreadaLocal, SolicitudesEstudiosPorFecha, ObservacionesPorPracticaFecha,
  ESTADO_EN_SALA_ESPERA, ESTADO_EN_OBSERVACION, ESTADO_EN_ATENCION,
  PROFESIONAL_POR_DEFECTO, PROFESIONAL_LEGACY_PLACEHOLDER,   EVOLUCIONES_LOCALES_STORAGE_KEY, EFECTOR_ID_STORAGE_KEY,
  RECETARIO_URL, RECETARIO_PROFILE, SISTEMAS_CLINICOS_URL,
  todayIsoDate, formatProfesionalDisplayName, estadoEsLlamable, parseTurnoDateTime,
  normalizeText, normalizeProfesionalLabel, buildEvolucionScopeKey, normalizeEvolucionScopeToken,
  parseStoredEvolucionesLocales, buildListadoEvoluciones, hasValidEvolucionContent,
  extractPlainTextFromHtml, buildRecetarioUrl, buildPanoramica, sanitizeRichTextHtml,
  formatAgendaDate, shiftIsoDate, estadoLabel, formatLlegada, formatDateTime,
  canIntegrarRecetario, canIntegrarSistemasClinicos, buildSistemasClinicosUrl, escapeHtml
} from "./escritorioClinicoTypes";
import { useAuth } from "../auth/AuthContext";

export function useEscritorioClinicoController({ onCancelSeleccionServicio }: UseEscritorioClinicoOptions = {}) {
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
  const [encuentroPacienteId, setEncuentroPacienteId] = useState<string | null>(null);
  const [encuentroCreadoEn, setEncuentroCreadoEn] = useState<string | null>(null);
  const [evolucionesAmbulatorias, setEvolucionesAmbulatorias] = useState<EvolucionAmbulatoriaResponse[]>([]);
  const [problemasCronicos, setProblemasCronicos] = useState<RegistroPanoramica[]>([]);
  const [fechaAgenda, setFechaAgenda] = useState(todayIsoDate());
  const [servicioId, setServicioId] = useState("");
  const [servicioPendienteId, setServicioPendienteId] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(false);
  const [showServicioModal, setShowServicioModal] = useState(false);
  const [showLugarAtencionModal, setShowLugarAtencionModal] = useState(false);
  const [lugarAtencionPendienteId, setLugarAtencionPendienteId] = useState("");
  const [lugarAtencionError, setLugarAtencionError] = useState<string | null>(null);
  const [efectorId, setEfectorId] = useState(() => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(EFECTOR_ID_STORAGE_KEY) ?? "";
});
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
    if (typeof window === "undefined") return {};
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
  const [showAsignarProblemaModal, setShowAsignarProblemaModal] = useState(false);
  const [problemaNuevaDescripcion, setProblemaNuevaDescripcion] = useState("");
  const [problemaNuevaCategoria, setProblemaNuevaCategoria] = useState("Activo");
  const [problemaNuevaFechaInicio, setProblemaNuevaFechaInicio] = useState(todayIsoDate());
  const [problemaFormError, setProblemaFormError] = useState<string | null>(null);
  const [showBuscarPacienteModal, setShowBuscarPacienteModal] = useState(false);
  const [buscarPacienteTipoDoc, setBuscarPacienteTipoDoc] = useState("");
  const [buscarPacienteNumDoc, setBuscarPacienteNumDoc] = useState("");
  const [buscarPacienteCandidatos, setBuscarPacienteCandidatos] = useState<PersonaCandidataBusqueda[]>([]);
  const [buscarPacienteSeleccionado, setBuscarPacienteSeleccionado] = useState<PersonaCandidataBusqueda | null>(null);
  const [buscarPacienteError, setBuscarPacienteError] = useState<string | null>(null);
  const [buscarPacienteLoading, setBuscarPacienteLoading] = useState(false);
  const [showSetMinimoSearch, setShowSetMinimoSearch] = useState(false);
  const [buscarPacienteNombre, setBuscarPacienteNombre] = useState("");
  const [buscarPacienteApellido, setBuscarPacienteApellido] = useState("");
  const [buscarPacienteFechaNacimiento, setBuscarPacienteFechaNacimiento] = useState("");
  const [buscarPacienteSexoBiologico, setBuscarPacienteSexoBiologico] = useState("");
  const [buscarPacienteSetMinimoLoading, setBuscarPacienteSetMinimoLoading] = useState(false);
  const [showSistemasClinicosModal, setShowSistemasClinicosModal] = useState(false);
  const [showPrescripcionModule, setShowPrescripcionModule] = useState(false);
  const [prescripcionModuleRecetas, setPrescripcionModuleRecetas] = useState<RecetaDigitalResumenResponse[]>([]);
  const [prescripcionModuleLoading, setPrescripcionModuleLoading] = useState(false);
  const [prescripcionModuleError, setPrescripcionModuleError] = useState<string | null>(null);
  const [prescripcionModuleAnulando, setPrescripcionModuleAnulando] = useState<string | null>(null);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [medicamentoSearchQuery, setMedicamentoSearchQuery] = useState("");
  const [medicamentoResultados, setMedicamentoResultados] = useState<MedicamentoResponse[]>([]);
  const [medicamentoLoading, setMedicamentoLoading] = useState(false);
  const [medicamentoTotalCount, setMedicamentoTotalCount] = useState(0);
  const [medicamentoPagina, setMedicamentoPagina] = useState(1);
  const [medicamentoError, setMedicamentoError] = useState<string | null>(null);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<MedicamentoResponse | null>(null);
  const [showPrescripcionFormModal, setShowPrescripcionFormModal] = useState(false);
  const [prescripcionDosis, setPrescripcionDosis] = useState("");
  const [prescripcionFrecuencia, setPrescripcionFrecuencia] = useState("");
  const [prescripcionDuracion, setPrescripcionDuracion] = useState("");
  const [prescripcionIndicacion, setPrescripcionIndicacion] = useState("");
  const [prescripcionGuardando, setPrescripcionGuardando] = useState(false);
  const [prescripcionError, setPrescripcionError] = useState<string | null>(null);
  const [prescripcionExitosa, setPrescripcionExitosa] = useState(false);
  const medicamentoSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evolucionEditorRef = useRef<HTMLDivElement | null>(null);
  const lugarAtencionPreguntadoRef = useRef(false);

  const selectedTurno = useMemo(() => turnos.find(t => t.id === selectedTurnoId) ?? null, [selectedTurnoId, turnos]);
  const turnoVistaRapida = useMemo(() => turnos.find(t => t.id === turnoVistaRapidaId) ?? null, [turnoVistaRapidaId, turnos]);
  const pendingLlamadoTurno = useMemo(() => turnos.find(t => t.id === pendingLlamadoTurnoId) ?? null, [pendingLlamadoTurnoId, turnos]);
  const pacienteEnAtencionConflicto = useMemo(() => {
    if (!pendingLlamadoTurno) return null;
    return turnos.find(turno => turno.id !== pendingLlamadoTurno.id && turno.estado === ESTADO_EN_ATENCION) ?? null;
  }, [pendingLlamadoTurno, turnos]);

  const turnosFiltrados = useMemo(() => {
    const turnosOrdenados = [...turnos].sort((a, b) => {
      const diff = parseTurnoDateTime(a.turno) - parseTurnoDateTime(b.turno);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    });
    const turnosConConsultorioAplicado = isMedicoUsuario && !isAdminUsuario && efectorId
      ? turnosOrdenados.filter(turno => turno.efector === efectorId)
      : turnosOrdenados;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return turnosConConsultorioAplicado;
    return turnosConConsultorioAplicado.filter(turno =>
      turno.paciente.toLowerCase().includes(normalizedQuery) ||
      turno.documento.toLowerCase().includes(normalizedQuery) ||
      turno.servicio.toLowerCase().includes(normalizedQuery) ||
      turno.efector.toLowerCase().includes(normalizedQuery)
    );
  }, [turnos, query, isMedicoUsuario, isAdminUsuario, efectorId]);

  const evolucionScopeKeys = useMemo(() => {
    if (!selectedTurno) return [] as string[];
    return Array.from(new Set([buildEvolucionScopeKey(selectedTurno), selectedTurno.id]));
  }, [selectedTurno]);

  const evolucionesLocalesPaciente = useMemo(() => {
    if (!selectedTurno || evolucionScopeKeys.length === 0) return [] as EvolucionCreadaLocal[];
    const scopeKey = buildEvolucionScopeKey(selectedTurno);
    const scopeKeyNormalized = normalizeEvolucionScopeToken(scopeKey);
    const turnoIdNormalized = normalizeEvolucionScopeToken(selectedTurno.id);
    const legacyDocumentoRaw = (selectedTurno.documento ?? "").trim().toUpperCase();
    const seen = new Set<string>();
    const merged: EvolucionCreadaLocal[] = [];
    for (const [storedKey, storedItems] of Object.entries(evolucionesLocalesPorTurno)) {
      const storedKeyNormalized = normalizeEvolucionScopeToken(storedKey);
      const perteneceAlPaciente = storedKey === scopeKey || storedKey === selectedTurno.id ||
        storedKey === legacyDocumentoRaw || storedKeyNormalized === scopeKeyNormalized ||
        storedKeyNormalized === turnoIdNormalized;
      if (!perteneceAlPaciente) continue;
      for (const item of storedItems) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [selectedTurno, evolucionScopeKeys, evolucionesLocalesPorTurno]);

  const evolucionesAmbulatoriasConLocales = useMemo(() => {
    if (!selectedTurno) return evolucionesAmbulatorias;
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
      if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
      return b.fechaAtencion.localeCompare(a.fechaAtencion);
    });
  }, [selectedTurno, evolucionesAmbulatorias, evolucionesLocalesPaciente, profesionalActual]);

  const panoramica = useMemo(() => buildPanoramica(selectedTurno, evolucionesAmbulatoriasConLocales, problemasCronicos), [selectedTurno, evolucionesAmbulatoriasConLocales, problemasCronicos]);

  const evolucionesCombinadas = useMemo(() => {
    if (!selectedTurno) {
      return buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
        ...item, profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
      }));
    }
    const base = buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
      ...item, profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
    }));
    const locales = evolucionesLocalesPaciente.map(item => {
      const { fecha } = extractPlainTextFromHtml(item.fechaAtencion) as unknown as { fecha: string };
      const formatted = item.fechaAtencion.includes("T") ? new Date(item.fechaAtencion).toLocaleDateString("es-AR") : item.fechaAtencion.split(" ")[0] ?? item.fechaAtencion;
      return {
        id: item.id,
        fechaHora: item.fechaAtencion,
        fechaAtencion: formatted,
        especialidad: item.especialidad,
        profesional: normalizeProfesionalLabel(item.profesional, profesionalActual),
        practica: "Consulta medica",
        problemasAsociados: item.problemasAsociados,
        texto: item.texto
      };
    });
    return [...locales, ...base];
  }, [selectedTurno, evolucionesAmbulatorias, evolucionesLocalesPaciente, profesionalActual]);

  const listadoEvoluciones = useMemo(() => evolucionesCombinadas, [evolucionesCombinadas]);
  const profesionalesEvoluciones = useMemo(() => Array.from(new Set(listadoEvoluciones.map(item => item.profesional))).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })), [listadoEvoluciones]);
  const serviciosEvoluciones = useMemo(() => Array.from(new Set(listadoEvoluciones.map(item => item.especialidad))).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })), [listadoEvoluciones]);

  const listadoEvolucionesFiltradas = useMemo(() => {
    return listadoEvoluciones
      .filter(item => !evolucionesFiltroProfesional || item.profesional === evolucionesFiltroProfesional)
      .filter(item => !evolucionesFiltroServicio || item.especialidad === evolucionesFiltroServicio)
      .sort((a, b) => {
        const da = Date.parse(a.fechaHora);
        const db = Date.parse(b.fechaHora);
        if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
        return b.fechaHora.localeCompare(a.fechaHora);
      });
  }, [listadoEvoluciones, evolucionesFiltroProfesional, evolucionesFiltroServicio]);

  const canLlamar = selectedTurno && selectedTurno.llegada ? estadoEsLlamable(selectedTurno.estado) : false;
  const pacienteEnAtencion = selectedTurno?.estado === ESTADO_EN_ATENCION;
  const esVisualizacionHC = origenPanoramica === "historia" && !pacienteEnAtencion;
  const puedeAbrirEvoluciones = Boolean(selectedTurno && selectedTurno.llegada && !esVisualizacionHC);
  const puedeSolicitarEstudios = Boolean(selectedTurno && selectedTurno.llegada && !esVisualizacionHC);
  const esDiaActual = fechaAgenda === todayIsoDate();
  const serviciosDisponibles = selectores?.servicios ?? [];

  const practicasDisponibles = useMemo(() => {
    if (!servicioId) return [];
    return (selectores?.practicas ?? [])
      .filter((practica: { servicioId: string }) => practica.servicioId === servicioId)
      .map((practica: { nombre: string }) => practica.nombre)
      .filter((value: string, index: number, arr: string[]) => arr.indexOf(value) === index)
      .sort((a: string, b: string) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [selectores, servicioId]);

  const draftSolicitudScopeId = selectedTurno ? `draft-evol-${selectedTurno.id}` : "";
  const solicitudScopeId = solicitudScopeTurnoId ?? selectedTurno?.id ?? null;
  const solicitudesTurnoSeleccionado = useMemo(() => solicitudScopeId ? solicitudesEstudiosPorTurno[solicitudScopeId] ?? {} : {}, [solicitudScopeId, solicitudesEstudiosPorTurno]);
  const fechasSolicitudesOrdenadas = useMemo(() => Object.keys(solicitudesTurnoSeleccionado).sort((a, b) => a.localeCompare(b)), [solicitudesTurnoSeleccionado]);
  const practicasFechaActiva = useMemo(() => fechaSolicitudActiva ? solicitudesTurnoSeleccionado[fechaSolicitudActiva] ?? [] : [], [solicitudesTurnoSeleccionado, fechaSolicitudActiva]);
  const observacionesFechaActiva = useMemo(() => {
    if (!solicitudScopeId || !fechaSolicitudActiva) return {};
    return observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva] ?? {};
  }, [solicitudScopeId, fechaSolicitudActiva, observacionesPorTurno]);

  const practicasFiltradasIzquierda = useMemo(() => {
    const filtro = busquedaPracticas.trim().toLowerCase();
    if (filtro.length < 3) return [];
    return practicasDisponibles
      .filter((practica: string) => !practicasFechaActiva.includes(practica))
      .filter((practica: string) => practica.toLowerCase().includes(filtro));
  }, [busquedaPracticas, practicasDisponibles, practicasFechaActiva]);

  const totalEstudiosSolicitados = useMemo(() => Object.values(solicitudesTurnoSeleccionado).reduce((acc, list) => acc + list.length, 0), [solicitudesTurnoSeleccionado]);
  const totalEstudiosSolicitadosTurno = useMemo(() =>
    selectedTurno ? Object.values(solicitudesEstudiosPorTurno[selectedTurno.id] ?? {}).reduce((acc, list) => acc + list.length, 0) : 0,
  [selectedTurno, solicitudesEstudiosPorTurno]);
  const totalEstudiosSolicitadosDraftEvolucion = useMemo(() =>
    draftSolicitudScopeId ? Object.values(solicitudesEstudiosPorTurno[draftSolicitudScopeId] ?? {}).reduce((acc, list) => acc + list.length, 0) : 0,
  [draftSolicitudScopeId, solicitudesEstudiosPorTurno]);

  const evolucionProblemasTextoNormalizado = useMemo(() => extractPlainTextFromHtml(evolucionProblemasTextoDraft), [evolucionProblemasTextoDraft]);
  const evolucionProblemasEtiquetas = useMemo(() => {
    const raw = evolucionProblemasTextoNormalizado;
    if (!raw) return [];
    const items = raw.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);
    if (items.length === 0 && raw.trim()) return [raw.trim()];
    return Array.from(new Set(items));
  }, [evolucionProblemasTextoNormalizado]);

  const canGuardarEvolucion = useMemo(() => hasValidEvolucionContent(evolucionTextoDraft) && evolucionProblemasEtiquetas.length > 0, [evolucionTextoDraft, evolucionProblemasEtiquetas]);
  const canAplicarFormatoEvolucion = useMemo(() => evolucionTextoDraft.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, "").trim().length > 0, [evolucionTextoDraft]);

  const cumpleRegistroMinimoSalidaEncuentro = useMemo(() => {
    if (hasValidEvolucionContent(evolucionTextoDraft) && evolucionProblemasEtiquetas.length > 0) return true;
    if (selectedTurno) {
      const localesTurno = evolucionesLocalesPaciente;
      if (localesTurno.some(item => hasValidEvolucionContent(item.texto) && item.problemasAsociados.length > 0)) return true;
    }
    return evolucionesAmbulatorias.some(item => item.problemasAsociados.length > 0);
  }, [evolucionTextoDraft, evolucionProblemasEtiquetas, selectedTurno, evolucionesLocalesPaciente, evolucionesAmbulatorias]);

  const canSolicitarEstudiosDesdeEvolucion = useMemo(() => extractPlainTextFromHtml(evolucionTextoDraft).length > 0 && evolucionProblemasEtiquetas.length > 0, [evolucionTextoDraft, evolucionProblemasEtiquetas]);

  useEffect(() => {
    setEvolucionesLocalesPorTurno(prev => {
      let changed = false;
      const next: Record<string, EvolucionCreadaLocal[]> = {};
      for (const [key, items] of Object.entries(prev)) {
        next[key] = items.map(item => {
          const profesionalNormalizado = normalizeProfesionalLabel(item.profesional, profesionalActual);
          if (profesionalNormalizado === item.profesional) return item;
          changed = true;
          return { ...item, profesional: profesionalNormalizado };
        });
      }
      return changed ? next : prev;
    });
  }, [profesionalActual]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(EVOLUCIONES_LOCALES_STORAGE_KEY, JSON.stringify(evolucionesLocalesPorTurno));
  }, [evolucionesLocalesPorTurno]);

  const efectoresDisponibles = useMemo(() => {
    if (isMedicoUsuario && !isAdminUsuario) {
      const consultorios = Array.from(new Set(turnos.map(turno => turno.efector).filter(nombre => nombre && nombre !== "-")));
      return consultorios.map(nombre => ({ id: nombre, nombre, tipoEfector: "CONSULTORIO", servicioId }));
    }
    return (selectores?.efectores ?? []).filter((efector: { servicioId: string }) => !servicioId || efector.servicioId === servicioId);
  }, [isMedicoUsuario, isAdminUsuario, turnos, servicioId, selectores]);

  const servicioActualNombre = useMemo(() => serviciosDisponibles.find((servicio: { id: string }) => servicio.id === servicioId)?.nombre ?? "-", [serviciosDisponibles, servicioId]);
  const lugarAtencionNombre = useMemo(() => {
    if (isMedicoUsuario && !isAdminUsuario) {
      if (efectorId) return efectorId;
      return efectoresDisponibles[0]?.nombre ?? turnos[0]?.efector ?? "-";
    }
    return efectoresDisponibles.find((efector: { id: string }) => efector.id === efectorId)?.nombre ?? "-";
  }, [isMedicoUsuario, isAdminUsuario, turnos, efectoresDisponibles, efectorId]);
  const horarioConfigurado = useMemo(() => turnos[0]?.turno ? `${turnos[0].turno} hs` : "-", [turnos]);

  async function loadSelectores() {
    const data = await getSelectoresAdmision();
    setSelectores(data);
    if (isMedicoUsuario && !isAdminUsuario) {
      if (data.servicios.length === 0) {
        setServicioId(""); setServicioPendienteId(""); setServicioSeleccionado(false); setShowServicioModal(false);
        setEfectorId(""); setServiceSelectionError("No tiene agenda activa para el dia de hoy."); setError("No tiene agenda activa para el dia de hoy.");
        return;
      }
      if (data.servicios.length === 1) {
        const servicioAsignado = data.servicios[0];
        setServicioId(servicioAsignado.id); setServicioPendienteId(servicioAsignado.id); setServicioSeleccionado(true);
        setShowServicioModal(false); setServiceSelectionError(null); setError(null); setEfectorId("");
        return;
      }
      setServicioId(""); setServicioPendienteId(""); setServicioSeleccionado(false); setShowServicioModal(true);
      setEfectorId(""); setServiceSelectionError(null); setError(null);
      return;
    }
    if (data.servicios.length > 0) {
      setServicioId(""); setServicioPendienteId(""); setServicioSeleccionado(false); setShowServicioModal(true);
      setServiceSelectionError(null); setEfectorId("");
      return;
    }
    setServicioId(""); setServicioPendienteId(""); setServicioSeleccionado(false); setShowServicioModal(false);
    setEfectorId(""); setServiceSelectionError("No hay servicios disponibles para ingresar al modulo de Historia Clinica.");
  }

  function confirmarServicioIngreso() {
    if (!servicioPendienteId) { setServiceSelectionError("Debe seleccionar un servicio para ingresar."); return; }
    setServicioId(servicioPendienteId);
    const efectoresServicio = (selectores?.efectores ?? []).filter((efector: { servicioId: string }) => efector.servicioId === servicioPendienteId);
    setEfectorId(efectoresServicio[0]?.id ?? "");
    setServicioSeleccionado(true); setShowServicioModal(false); setServiceSelectionError(null); setError(null);
  }

  function confirmarCambioLugarAtencion() {
    if (!lugarAtencionPendienteId) { setLugarAtencionError("Debe seleccionar un lugar de atencion."); return; }
    setEfectorId(lugarAtencionPendienteId); setShowLugarAtencionModal(false); setLugarAtencionError(null);
    setAgendaMensaje("Se cambio el lugar de atencion correctamente para el dia de hoy.");
  }

  function cancelarServicioIngreso() {
    setShowServicioModal(false); setServiceSelectionError(null); onCancelSeleccionServicio?.();
  }

  function limpiarSolicitudesScope(scopeId: string) {
    setSolicitudesEstudiosPorTurno(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, scopeId)) return prev;
      const next = { ...prev }; delete next[scopeId]; return next;
    });
    setObservacionesPorTurno(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, scopeId)) return prev;
      const next = { ...prev }; delete next[scopeId]; return next;
    });
  }

  function abrirSolicitudEstudiosConScope(scopeId: string, origen: "general" | "evolucion") {
    const existentes = solicitudesEstudiosPorTurno[scopeId] ?? {};
    const fechas = Object.keys(existentes).sort((a, b) => a.localeCompare(b));
    setSolicitudScopeTurnoId(scopeId); setSolicitudOrigen(origen);
    setFechaSolicitudNueva(todayIsoDate()); setFechaSolicitudActiva(fechas[0] ?? "");
    setBusquedaPracticas(""); setPracticasSeleccionadasIzquierda([]); setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null); setCanalEnvioSolicitudes("impresion"); setShowSolicitudEstudiosModal(true);
  }

  function abrirSolicitudEstudios() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente para solicitar estudios."); return; }
    if (!puedeSolicitarEstudios) { setError("Solicitar estudios esta deshabilitado en modo visualizacion HC."); return; }
    abrirSolicitudEstudiosConScope(selectedTurno.id, "general");
  }

  function abrirSolicitudEstudiosDesdeEvolucion() {
    if (!selectedTurno) return;
    if (!canSolicitarEstudiosDesdeEvolucion) { setEvolucionFormError("Solicitar estudios se habilita con texto y al menos un problema cargado."); return; }
    abrirSolicitudEstudiosConScope(`draft-evol-${selectedTurno.id}`, "evolucion");
  }

  function abrirAgregarEvolucion() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente para agregar una evolucion."); return; }
    setEvolucionTextoDraft(""); setEvolucionProblemasTextoDraft(""); setEvolucionFormError(null);
    limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`); setShowAgregarEvolucionModal(true);
  }

  function abrirEvoluciones() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente para acceder a evoluciones."); return; }
    if (!puedeAbrirEvoluciones) { setError("Evoluciones esta deshabilitado en modo visualizacion HC."); return; }
    setShowEvolucionesListado(true); setError(null);
  }

  function aplicarFormatoEvolucion(comando: "bold" | "italic" | "underline" | "strikeThrough" | "insertUnorderedList" | "indent") {
    if (!canAplicarFormatoEvolucion || !evolucionEditorRef.current) return;
    evolucionEditorRef.current.focus();
    document.execCommand(comando, false);
    setEvolucionTextoDraft(sanitizeRichTextHtml(evolucionEditorRef.current.innerHTML));
  }

  function guardarEvolucionNueva() {
    if (!selectedTurno) return;
    if (!hasValidEvolucionContent(evolucionTextoDraft)) {
      limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
      setEvolucionFormError("La evolucion requiere al menos 4 caracteres alfanumericos no repetidos."); return;
    }
    if (evolucionProblemasEtiquetas.length === 0) {
      limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
      setEvolucionFormError("Debe registrar al menos un problema en texto libre."); return;
    }
    const draftScopeId = `draft-evol-${selectedTurno.id}`;
    const draftSolicitudes = solicitudesEstudiosPorTurno[draftScopeId] ?? {};
    const draftObservaciones = observacionesPorTurno[draftScopeId] ?? {};
    if (Object.keys(draftSolicitudes).length > 0) {
      setSolicitudesEstudiosPorTurno(prev => {
        const target = prev[selectedTurno.id] ?? {};
        const merged: SolicitudesEstudiosPorFecha = { ...target };
        for (const [fecha, practicas] of Object.entries(draftSolicitudes)) {
          merged[fecha] = Array.from(new Set([...(merged[fecha] ?? []), ...practicas]));
        }
        const next = { ...prev, [selectedTurno.id]: merged };
        delete next[draftScopeId];
        return next;
      });
      setObservacionesPorTurno(prev => {
        const target = prev[selectedTurno.id] ?? {};
        const merged: ObservacionesPorPracticaFecha = { ...target };
        for (const [fecha, observacionesFecha] of Object.entries(draftObservaciones)) {
          merged[fecha] = { ...(merged[fecha] ?? {}), ...observacionesFecha };
        }
        const next = { ...prev, [selectedTurno.id]: merged };
        delete next[draftScopeId];
        return next;
      });
    }
    const nueva: EvolucionCreadaLocal = {
      id: `local-evol-${Date.now()}`,
      fechaAtencion: new Date().toISOString(),
      especialidad: selectedTurno.servicio,
      profesional: profesionalActual,
      problemasAsociados: [...evolucionProblemasEtiquetas],
      texto: sanitizeRichTextHtml(evolucionTextoDraft).trim()
    };
    const scopeKey = buildEvolucionScopeKey(selectedTurno);
    const documentoRaw = (selectedTurno.documento ?? "").trim().toUpperCase();
    const aliasKeys = Array.from(new Set([scopeKey, selectedTurno.id, documentoRaw])).filter(key => key && key !== "-");
    setEvolucionesLocalesPorTurno(prev => {
      const next = { ...prev };
      for (const key of aliasKeys) {
        next[key] = [nueva, ...(next[key] ?? [])];
      }
      return next;
    });
    setShowAgregarEvolucionModal(false); setEvolucionTextoDraft(""); setEvolucionProblemasTextoDraft("");
    setEvolucionFormError(null); setSolicitudScopeTurnoId(null);

    if (encuentroPacienteId) {
      crearEvolucionAmbulatoria({
        turnoId: selectedTurno.id,
        pacienteId: encuentroPacienteId,
        especialidad: selectedTurno.servicio,
        profesional: profesionalActual,
        texto: sanitizeRichTextHtml(evolucionTextoDraft).trim(),
        problemasAsociados: [...evolucionProblemasEtiquetas]
      }).catch(() => {});
    }

    mostrarToastSolicitud("Evolucion guardada correctamente.");
  }

  function mostrarToastSolicitud(message: string) { setSolicitudToast(message); }

  async function handleAsignarProblema() {
    if (!problemaNuevaDescripcion.trim()) { setProblemaFormError("La descripcion del problema es obligatoria."); return; }
    if (!selectedTurno) { setProblemaFormError("No hay paciente seleccionado."); return; }
    setWorking(true);
    try {
      let pacienteId = encuentroPacienteId;
      if (!pacienteId && selectedTurno.documento && selectedTurno.documento !== "-") {
        const candidatos = await buscarPersonaPorDocumento("DNI", selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) {
          pacienteId = candidatos[0].id;
        }
      }
      if (!pacienteId) { setProblemaFormError("No se pudo identificar el paciente. Verifique que tenga documento registrado."); setWorking(false); return; }
      const request: AsignarProblemaRequest = {
        descripcion: problemaNuevaDescripcion.trim(),
        categoria: problemaNuevaCategoria,
        fechaInicio: problemaNuevaFechaInicio ? problemaNuevaFechaInicio.split("-").reverse().join("/") : undefined
      };
      await asignarProblemaPaciente(pacienteId, request);
      const problemas = await obtenerProblemasCronicosPaciente(pacienteId);
      setProblemasCronicos(problemas.map(p => ({
        id: p.problemaCronicoId,
        fechaHora: p.fechaInicio,
        titulo: p.descripcion,
        detalle: `${p.categoria} | ${p.fechaInicio}`,
        evolucionesAsociadas: p.evolucionesAsociadas
      })));
      if (!encuentroPacienteId) setEncuentroPacienteId(pacienteId);
      setShowAsignarProblemaModal(false);
      setProblemaNuevaDescripcion("");
      setProblemaNuevaCategoria("Activo");
      setProblemaNuevaFechaInicio(todayIsoDate());
      setProblemaFormError(null);
      mostrarToastSolicitud("Problema asignado correctamente.");
    } catch (err) {
      setProblemaFormError(err instanceof Error ? err.message : "No se pudo asignar el problema.");
    } finally { setWorking(false); }
  }

  function abrirBuscarPaciente() {
    setBuscarPacienteTipoDoc("DNI");
    setBuscarPacienteNumDoc("");
    setBuscarPacienteCandidatos([]);
    setBuscarPacienteSeleccionado(null);
    setBuscarPacienteError(null);
    setShowSetMinimoSearch(false);
    setBuscarPacienteNombre("");
    setBuscarPacienteApellido("");
    setBuscarPacienteFechaNacimiento("");
    setBuscarPacienteSexoBiologico("");
    setShowBuscarPacienteModal(true);
  }

  async function handleBuscarPacientePorDocumento() {
    if (!buscarPacienteTipoDoc.trim() || !buscarPacienteNumDoc.trim()) {
      setBuscarPacienteError("Debe ingresar tipo y numero de documento.");
      return;
    }
    setBuscarPacienteLoading(true);
    setBuscarPacienteError(null);
    setBuscarPacienteCandidatos([]);
    setShowSetMinimoSearch(false);
    try {
      const candidatos = await buscarPersonaPorDocumento(buscarPacienteTipoDoc.trim(), buscarPacienteNumDoc.trim());
      setBuscarPacienteCandidatos(candidatos);
      if (candidatos.length === 0) {
        setBuscarPacienteError("No se encontraron candidatos para el criterio ingresado. Verifique los datos ingresados o use la busqueda por set minimo.");
        setShowSetMinimoSearch(true);
      }
    } catch (err) {
      setBuscarPacienteError(err instanceof Error ? err.message : "Error al buscar paciente.");
    } finally {
      setBuscarPacienteLoading(false);
    }
  }

  async function handleBuscarPacientePorSetMinimo() {
    if (!buscarPacienteNombre.trim() || !buscarPacienteApellido.trim() || !buscarPacienteFechaNacimiento.trim() || !buscarPacienteSexoBiologico.trim()) {
      setBuscarPacienteError("Debe completar todos los campos de la busqueda por set minimo (nombre, apellido, fecha de nacimiento, sexo).");
      return;
    }
    setBuscarPacienteSetMinimoLoading(true);
    setBuscarPacienteError(null);
    setBuscarPacienteCandidatos([]);
    try {
      const candidatos = await buscarPersonaPorSetMinimo(
        buscarPacienteTipoDoc.trim(),
        buscarPacienteNumDoc.trim(),
        buscarPacienteNombre.trim(),
        buscarPacienteApellido.trim(),
        buscarPacienteFechaNacimiento.trim(),
        buscarPacienteSexoBiologico.trim()
      );
      setBuscarPacienteCandidatos(candidatos);
      if (candidatos.length === 0) {
        setBuscarPacienteError("No se encontraron candidatos con los datos ingresados. Verifique la informacion o contactese con responsable de empadronamiento.");
      }
    } catch (err) {
      setBuscarPacienteError(err instanceof Error ? err.message : "Error al buscar paciente por set minimo.");
    } finally {
      setBuscarPacienteSetMinimoLoading(false);
    }
  }

  function handleSeleccionarPacienteFueraAgenda(paciente: PersonaCandidataBusqueda) {
    setBuscarPacienteSeleccionado(paciente);
    const turnoEnAgenda = turnos.find(t =>
      t.documento.replace(/[^0-9A-Z]/gi, "").toUpperCase() === paciente.numeroDocumento.replace(/[^0-9A-Z]/gi, "").toUpperCase() &&
      normalizeText(t.paciente).includes(normalizeText(paciente.apellidosNombres).substring(0, 6))
    );
    if (turnoEnAgenda) {
      setShowBuscarPacienteModal(false);
      setModoIngreso("plantilla");
      setOrigenPanoramica("historia");
      setSelectedTurnoId(turnoEnAgenda.id);
      setError(null);
      setAgendaMensaje(`Paciente encontrado en la agenda. Abriendo historia clinica de ${paciente.apellidosNombres}.`);
    } else {
      setAgendaMensaje(`Paciente encontrado: ${paciente.apellidosNombres}. No tiene turno en la agenda actual. Seleccione un servicio para continuar.`);
    }
  }

  function handleVolverBuscarPaciente() {
    setBuscarPacienteSeleccionado(null);
    setBuscarPacienteCandidatos([]);
    setBuscarPacienteError(null);
    setShowSetMinimoSearch(false);
    setBuscarPacienteFechaNacimiento("");
    setBuscarPacienteSexoBiologico("");
  }

  function cerrarBuscarPaciente() {
    setShowBuscarPacienteModal(false);
    setBuscarPacienteSeleccionado(null);
    setBuscarPacienteCandidatos([]);
    setBuscarPacienteError(null);
    setShowSetMinimoSearch(false);
    setBuscarPacienteFechaNacimiento("");
    setBuscarPacienteSexoBiologico("");
  }

  function imprimirSolicitudesPracticas() {
    if (!selectedTurno) { setSolicitudError("Debe seleccionar un paciente para imprimir las solicitudes."); return; }
    if (!solicitudScopeId) return;
    if (totalEstudiosSolicitados === 0) { setSolicitudError("No hay practicas cargadas para imprimir."); return; }

    const popup = window.open("", "_blank", "width=980,height=760");
    if (!popup) { setSolicitudError("No se pudo abrir la ventana de impresion. Verifica bloqueador de ventanas."); return; }

    const now = new Date();
    const fechaEmision = now.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const horaEmision = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const numeroComprobante = `SOL-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${selectedTurno.id.slice(0, 6).toUpperCase()}`;

    const practicasHtml = fechasSolicitudesOrdenadas.map(fecha => {
      const practicas = solicitudesTurnoSeleccionado[fecha] ?? [];
      if (practicas.length === 0) return "";
      const fechaStr = formatAgendaDate(fecha);
      const rows = practicas.map((practica, idx) => {
        const observacion = observacionesPorTurno[solicitudScopeId]?.[fecha]?.[practica]?.trim();
        const bgColor = idx % 2 === 0 ? "#f8fbff" : "#ffffff";
        const obsHtml = observacion ? `<tr style="background:${bgColor}"><td colspan="3" style="padding:6px 12px;border-bottom:1px solid #e2ebf5;font-size:12px;color:#3a5d80;font-style:italic">Observacion: ${escapeHtml(observacion)}</td></tr>` : "";
        return `<tr style="background:${bgColor}">
          <td style="padding:8px 12px;border-bottom:1px solid #e2ebf5;font-size:13px;color:#1d3f63;width:40px;text-align:center">${idx + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2ebf5;font-size:13px;color:#1d3f63;font-weight:600">${escapeHtml(practica)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2ebf5;font-size:13px;color:#294b72;text-align:center">Pendiente</td>
        </tr>${obsHtml}`;
      }).join("");
      return `<div class="fecha-group"><p class="fecha-label">Fecha de solicitud: <strong>${escapeHtml(fechaStr)}</strong></p><table class="practicas-table"><thead><tr><th style="width:40px">#</th><th>Practica</th><th style="width:100px">Estado</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }).join("");

    const totalPracticas = fechasSolicitudesOrdenadas.reduce((acc, fecha) => acc + (solicitudesTurnoSeleccionado[fecha]?.length ?? 0), 0);

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Solicitud de Prácticas - ${escapeHtml(selectedTurno.paciente)}</title>
  <style>
    @page { margin: 18mm 15mm 20mm 15mm; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #1b2d3f; line-height: 1.45; background: #fff; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 3px solid #0f6cab; margin-bottom: 18px; }
    .header-left { flex: 1; }
    .header-right { text-align: right; font-size: 12px; color: #5a7492; }
    .system-name { font-size: 20px; font-weight: 800; color: #0f6cab; letter-spacing: 0.02em; }
    .system-subtitle { font-size: 11px; color: #5a7492; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
    .doc-title { font-size: 17px; font-weight: 700; color: #1f3f63; margin-top: 10px; padding: 6px 12px; background: #f0f6ff; border-left: 4px solid #0f6cab; border-radius: 0 6px 6px 0; }

    .comprobante-meta { display: flex; justify-content: space-between; margin-bottom: 16px; padding: 10px 14px; background: #f8fbff; border: 1px solid #d6e4f3; border-radius: 8px; font-size: 12px; color: #3a5d80; }
    .comprobante-meta strong { color: #1d4a7a; }

    .paciente-card { border: 1px solid #d6e4f3; border-radius: 10px; padding: 14px; margin-bottom: 18px; background: linear-gradient(135deg, #fafcff 0%, #f5f9fd 100%); }
    .paciente-card h3 { font-size: 14px; color: #244972; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2ebf5; }
    .paciente-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
    .paciente-field { font-size: 12.5px; }
    .paciente-field .label { color: #5a7492; text-transform: uppercase; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; }
    .paciente-field .value { color: #1d3f63; font-weight: 600; margin-top: 1px; }

    .profesional-card { border: 1px solid #d6e4f3; border-radius: 10px; padding: 14px; margin-bottom: 18px; background: #f8fbff; }
    .profesional-card h3 { font-size: 14px; color: #244972; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #e2ebf5; }
    .profesional-card p { font-size: 12.5px; color: #1d3f63; }

    .fecha-group { margin-bottom: 16px; }
    .fecha-label { font-size: 12px; color: #3a5d80; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em; }
    .fecha-label strong { color: #1d4a7a; }

    .practicas-table { width: 100%; border-collapse: collapse; border: 1px solid #d6e4f3; border-radius: 8px; overflow: hidden; margin-bottom: 4px; }
    .practicas-table thead th { background: #0f6cab; color: #fff; font-size: 11.5px; font-weight: 700; padding: 8px 12px; text-align: left; text-transform: uppercase; letter-spacing: 0.04em; }
    .practicas-table tbody td { border-bottom: 1px solid #e2ebf5; }
    .practicas-table tbody tr:last-child td { border-bottom: none; }

    .firmas { margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .firma-box { text-align: center; }
    .firma-line { border-top: 1px solid #8b99a8; margin-top: 50px; padding-top: 8px; }
    .firma-label { font-size: 11px; color: #5a7492; }
    .firma-name { font-size: 12px; font-weight: 700; color: #1d3f63; }

    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #d6e4f3; display: flex; justify-content: space-between; font-size: 10px; color: #8b99a8; }

    @media print {
      body { background: #fff; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;padding:8px;background:#f0f6ff;border-bottom:1px solid #d6e4f3;font-size:12px;color:#3a5d80">
    Use Ctrl+P o el botón de impresión del navegador para imprimir este comprobante
  </div>

  <div class="header">
    <div class="header-left">
      <div class="system-name">VitalFlow HIS</div>
      <div class="system-subtitle">Sistema de Historia Clinica Electronica</div>
    </div>
    <div class="header-right">
      <div style="font-weight:700;color:#1d4a7a">Fecha de emision</div>
      <div>${fechaEmision} ${horaEmision} hs</div>
    </div>
  </div>

  <div class="doc-title">Solicitud de Praticas Medicas</div>

  <div class="comprobante-meta">
    <span><strong>Comprobante:</strong> ${escapeHtml(numeroComprobante)}</span>
    <span><strong>Total de praticas:</strong> ${totalPracticas}</span>
  </div>

  <div class="paciente-card">
    <h3>Datos del Paciente</h3>
    <div class="paciente-grid">
      <div class="paciente-field"><div class="label">Paciente</div><div class="value">${escapeHtml(selectedTurno.paciente)}</div></div>
      <div class="paciente-field"><div class="label">Documento</div><div class="value">${escapeHtml(selectedTurno.documento)}</div></div>
      <div class="paciente-field"><div class="label">Servicio</div><div class="value">${escapeHtml(selectedTurno.servicio)}</div></div>
      <div class="paciente-field"><div class="label">Lugar de atencion</div><div class="value">${escapeHtml(selectedTurno.efector)}</div></div>
      <div class="paciente-field"><div class="label">Financiador</div><div class="value">${escapeHtml(selectedTurno.financiador)}</div></div>
      <div class="paciente-field"><div class="label">Turno</div><div class="value">${escapeHtml(selectedTurno.turno)}</div></div>
    </div>
  </div>

  <div class="profesional-card">
    <h3>Profesional solicitante</h3>
    <p>${escapeHtml(profesionalActual)}</p>
    <p style="font-size:11px;color:#5a7492;margin-top:2px">${escapeHtml(lugarAtencionNombre)} - ${escapeHtml(servicioActualNombre)}</p>
  </div>

  ${practicasHtml}

  <div class="firmas">
    <div class="firma-box">
      <div class="firma-line">
        <div class="firma-label">Firma del profesional</div>
        <div class="firma-name">${escapeHtml(profesionalActual)}</div>
      </div>
    </div>
    <div class="firma-box">
      <div class="firma-line">
        <div class="firma-label">Aclaracion / Sello del consultorio</div>
        <div class="firma-name">${escapeHtml(lugarAtencionNombre)}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>VitalFlow HIS - Comprobante de solicitud de praticas</span>
    <span>Generado automaticamente el ${fechaEmision} a las ${horaEmision} hs</span>
  </div>
</body>
</html>`;

    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    setTimeout(() => { try { popup.print(); } catch { /* user can print manually */ } }, 300);
    mostrarToastSolicitud("Comprobante enviado a impresion.");
    setSolicitudError(null);
  }

  function agregarFechaSolicitud() {
    if (!solicitudScopeId) return;
    const hoy = todayIsoDate();
    if (fechaSolicitudNueva < hoy) { setSolicitudError("No puede agregar fechas anteriores a la actual."); return; }
    const existentes = solicitudesEstudiosPorTurno[solicitudScopeId] ?? {};
    if (Object.prototype.hasOwnProperty.call(existentes, fechaSolicitudNueva)) { setSolicitudError("No pueden repetirse las fechas."); return; }
    setSolicitudesEstudiosPorTurno(prev => ({ ...prev, [solicitudScopeId]: { ...(prev[solicitudScopeId] ?? {}), [fechaSolicitudNueva]: [] } }));
    setFechaSolicitudActiva(fechaSolicitudNueva); setPracticasSeleccionadasIzquierda([]); setPracticasSeleccionadasDerecha([]); setSolicitudError(null);
  }

  function moverPracticasSeleccionadasADerecha() {
    if (!solicitudScopeId || practicasSeleccionadasIzquierda.length === 0) return;
    const fecha = fechaSolicitudActiva || todayIsoDate();
    if (!fechaSolicitudActiva) setFechaSolicitudActiva(fecha);
    const existentes = solicitudesTurnoSeleccionado[fecha] ?? [];
    const nuevas = practicasSeleccionadasIzquierda.filter(item => !existentes.includes(item));
    if (nuevas.length === 0) { setSolicitudError("La practica no puede repetirse dentro de la misma fecha."); return; }
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fecha]: [...(turnoMap[fecha] ?? []), ...nuevas] } };
    });
    setPracticasSeleccionadasIzquierda([]); setSolicitudError(null);
  }

  function moverPracticasSeleccionadasAIzquierda() {
    if (!solicitudScopeId || !fechaSolicitudActiva || practicasSeleccionadasDerecha.length === 0) return;
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fechaSolicitudActiva]: (turnoMap[fechaSolicitudActiva] ?? []).filter(item => !practicasSeleccionadasDerecha.includes(item)) } };
    });
    setObservacionesPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const fechaMap = turnoMap[fechaSolicitudActiva] ?? {};
      const nextFechaMap: Record<string, string> = {};
      for (const [practica, observacion] of Object.entries(fechaMap)) {
        if (!practicasSeleccionadasDerecha.includes(practica)) nextFechaMap[practica] = observacion;
      }
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fechaSolicitudActiva]: nextFechaMap } };
    });
    setPracticasSeleccionadasDerecha([]); setSolicitudError(null);
  }

  function abrirObservacionPractica(practica: string) {
    if (!solicitudScopeId || !fechaSolicitudActiva) return;
    const existente = observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva]?.[practica] ?? "";
    setPracticaObservacionActiva(practica); setObservacionDraft(existente); setShowObservacionModal(true); setSolicitudError(null);
  }

  function guardarObservacionPractica() {
    if (!solicitudScopeId || !fechaSolicitudActiva || !practicaObservacionActiva) return;
    const texto = observacionDraft.trim();
    if (!texto) return;
    const observacionPrevia = observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva]?.[practicaObservacionActiva];
    setObservacionesPorTurno(prev => ({
      ...prev, [solicitudScopeId]: {
        ...(prev[solicitudScopeId] ?? {}),
        [fechaSolicitudActiva]: { ...(prev[solicitudScopeId]?.[fechaSolicitudActiva] ?? {}), [practicaObservacionActiva]: texto }
      }
    }));
    setShowObservacionModal(false); setPracticaObservacionActiva(null); setObservacionDraft("");
    mostrarToastSolicitud(observacionPrevia ? "Observacion editada correctamente." : "Observacion agregada correctamente.");
  }

  function eliminarObservacionPractica(practica: string) {
    if (!solicitudScopeId || !fechaSolicitudActiva) return;
    setObservacionesPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const fechaMap = turnoMap[fechaSolicitudActiva] ?? {};
      if (!Object.prototype.hasOwnProperty.call(fechaMap, practica)) return prev;
      const nextFechaMap = { ...fechaMap }; delete nextFechaMap[practica];
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fechaSolicitudActiva]: nextFechaMap } };
    });
    mostrarToastSolicitud("Observacion eliminada correctamente.");
  }

  function confirmarFechaPrimeraPractica() {
    if (!solicitudScopeId) return;
    const hoy = todayIsoDate();
    if (fechaSolicitudNueva < hoy) { setSolicitudError("No puede agregar fechas anteriores a la actual."); return; }
    const existentes = solicitudesEstudiosPorTurno[solicitudScopeId] ?? {};
    if (Object.prototype.hasOwnProperty.call(existentes, fechaSolicitudNueva)) { setSolicitudError("No pueden repetirse las fechas."); return; }
    setSolicitudesEstudiosPorTurno(prev => ({ ...prev, [solicitudScopeId]: { ...(prev[solicitudScopeId] ?? {}), [fechaSolicitudNueva]: [...practicasSeleccionadasIzquierda] } }));
    setFechaSolicitudActiva(fechaSolicitudNueva); setPracticasSeleccionadasIzquierda([]); setShowFechaPrimeraPracticaModal(false); setSolicitudError(null);
  }

  async function loadTurnos() {
    setLoading(true); setError(null);
    try {
      const data = await buscarTurnosAdmision({
        servicioId: servicioId || undefined,
        efectorId: isMedicoUsuario && !isAdminUsuario ? undefined : efectorId || undefined,
        estado: estadoFiltro || undefined,
        fecha: fechaAgenda
      });
      setTurnos(data);
      Promise.all(data.map(t => loadSolicitudesEstudios(t.id))).catch(() => {});
      if (isMedicoUsuario && !isAdminUsuario) {
        const consultorios = Array.from(new Set(data.map(item => item.efector).filter(nombre => nombre && nombre !== "-")));
        const consultorioDefault = consultorios[0] ?? "";
        setEfectorId(prev => prev && consultorios.includes(prev) ? prev : consultorioDefault);
        if (!efectorId && !lugarAtencionPreguntadoRef.current && consultorioDefault) {
          setLugarAtencionPendienteId(consultorioDefault); setLugarAtencionError(null);
          setShowLugarAtencionModal(true); lugarAtencionPreguntadoRef.current = true;
        }
      }
      setSelectedTurnoId(prev => prev && data.some(item => item.id === prev) ? prev : null);
      if (data.length === 0 && esDiaActual) {
        setShowSinAgendaModal(true);
        if (isMedicoUsuario && !isAdminUsuario) setError("No tiene agenda activa para el dia de hoy.");
      } else {
        setShowSinAgendaModal(false);
        if (isMedicoUsuario && !isAdminUsuario) setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el listado de pacientes.");
    } finally { setLoading(false); }
  }

  function updateTurnoState(turnoId: string, estado: string) {
    setTurnos(prev => prev.map(item => item.id === turnoId ? { ...item, estado } : item));
  }

  async function loadSolicitudesEstudios(scopeId: string) {
    try {
      const records = await obtenerSolicitudesEstudiosTurno(scopeId);
      if (records.length === 0) return;
      const solicitudes: SolicitudesEstudiosPorFecha = {};
      const observaciones: ObservacionesPorPracticaFecha = {};
      for (const r of records) {
        if (!solicitudes[r.fechaSolicitada]) solicitudes[r.fechaSolicitada] = [];
        if (!solicitudes[r.fechaSolicitada].includes(r.practica)) solicitudes[r.fechaSolicitada].push(r.practica);
        if (r.observacion) {
          if (!observaciones[r.fechaSolicitada]) observaciones[r.fechaSolicitada] = {};
          observaciones[r.fechaSolicitada][r.practica] = r.observacion;
        }
      }
      setSolicitudesEstudiosPorTurno(prev => ({ ...prev, [scopeId]: solicitudes }));
      setObservacionesPorTurno(prev => ({ ...prev, [scopeId]: observaciones }));
    } catch { /* ignore load errors */ }
  }

  async function saveSolicitudesEstudios(scopeId: string) {
    if (scopeId.startsWith("draft-evol-")) return;
    const turno = turnos.find(t => t.id === scopeId);
    if (!turno) return;
    const solicitudes = solicitudesEstudiosPorTurno[scopeId] ?? {};
    if (Object.keys(solicitudes).length === 0) return;
    const observaciones = observacionesPorTurno[scopeId] ?? {};
    const items: { fechaSolicitada: string; practica: string; observacion?: string }[] = [];
    for (const [fecha, practicas] of Object.entries(solicitudes)) {
      for (const practica of practicas) {
        items.push({ fechaSolicitada: fecha, practica, observacion: observaciones[fecha]?.[practica] });
      }
    }
    try {
      await guardarSolicitudesEstudiosTurno(scopeId, { pacienteId: turno.paciente, items });
    } catch {
      mostrarToastSolicitud("Error al guardar los estudios. Intente de nuevo.");
    }
  }

  async function llamarPaciente(turno: TurnoAdmision): Promise<boolean> {
    if (!estadoEsLlamable(turno.estado)) return false;
    setWorking(true); setError(null);
    try {
      const response = await actualizarEstadoTurno(turno.id, { estado: ESTADO_EN_ATENCION, motivo: "LLAMADO_DESDE_PANORAMICA" });
      updateTurnoState(turno.id, response.estado);
      setContadorLlamados(prev => ({ ...prev, [turno.id]: (prev[turno.id] ?? 0) + 1 }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo llamar al paciente.");
      return false;
    } finally { setWorking(false); }
  }

  async function abrirHistoriaClinica(turno: TurnoAdmision) {
    setModoIngreso("plantilla"); setOrigenPanoramica("ver"); setSelectedTurnoId(turno.id); setError(null);
    if (turno.estado !== ESTADO_EN_ATENCION && estadoEsLlamable(turno.estado)) {
      try {
        const response = await actualizarEstadoTurno(turno.id, { estado: ESTADO_EN_ATENCION, motivo: "INICIO_ATENCION" });
        updateTurnoState(turno.id, response.estado);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "No se pudo cambiar a EN_ATENCION";
        setError(msg);
      }
    }
  }

  function verTurno(turno: TurnoAdmision) {
    setTurnoVistaRapidaId(turno.id); setError(null);
  }

  async function abrirDesdeMegafono(turno: TurnoAdmision) {
    if (!estadoEsLlamable(turno.estado) || working) return;
    setError(null); setPendingLlamadoTurnoId(turno.id);
  }

  async function confirmarLlamadoMegafono() {
    if (!pendingLlamadoTurno) { setPendingLlamadoTurnoId(null); return; }
    const pacienteEnAtencion = turnos.find(turno => turno.id !== pendingLlamadoTurno.id && turno.estado === ESTADO_EN_ATENCION);
    if (pacienteEnAtencion) {
      setSelectedTurnoId(pacienteEnAtencion.id); setModoIngreso("plantilla"); setOrigenPanoramica("historia");
      setPendingLlamadoTurnoId(null);
      setError(`Ya existe un paciente en atencion: ${pacienteEnAtencion.paciente}.`); return;
    }
    setPendingLlamadoTurnoId(null);
    const ok = await llamarPaciente(pendingLlamadoTurno);
    if (ok) {
      setModoIngreso("megafono"); setOrigenPanoramica("megafono");
      setSelectedTurnoId(pendingLlamadoTurno.id);
    }
  }

  async function confirmarSalidaEncuentro() {
    if (!selectedTurno || !accionSalidaEncuentro) return;
    setWorking(true); setError(null);
    try {
      if (accionSalidaEncuentro === "CERRAR_ENCUENTRO") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) { setError("Cerrar encuentro requiere paciente en atencion."); setWorking(false); return; }
        if (!cumpleRegistroMinimoSalidaEncuentro) { setError("Debe registrar texto y al menos una etiqueta de problemas en la evolucion para continuar."); setWorking(false); return; }
        if (encuentroPacienteId) {
          const response = await cerrarEncuentroTurno(selectedTurno.id, { estadoPacienteFinal: "ATENDIDO" });
          updateTurnoState(selectedTurno.id, response.estadoPacienteFinal);
          setEncuentroEstado(response.estadoEncuentro);
        } else {
          const response = await actualizarEstadoTurno(selectedTurno.id, { estado: "ATENDIDO", motivo: "SALIDA_DESDE_ENCUENTRO" });
          updateTurnoState(selectedTurno.id, response.estado);
        }
        setAgendaMensaje("Se cambio el estado del turno a Atendido");
        setSelectedTurnoId(null);
      }
      if (accionSalidaEncuentro === "ENVIAR_OBSERVACION") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) { setError("Enviar a observacion requiere paciente en atencion."); setWorking(false); return; }
        if (!cumpleRegistroMinimoSalidaEncuentro) { setError("Debe registrar texto y al menos una etiqueta de problemas en la evolucion para continuar."); setWorking(false); return; }
        const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_EN_OBSERVACION, motivo: "SALIDA_DESDE_ENCUENTRO" });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se envio el paciente a observacion");
      }
      if (accionSalidaEncuentro === "ENVIAR_LISTA_ESPERA") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) { setError("Enviar a lista de espera requiere paciente en atencion."); setWorking(false); return; }
        const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_EN_SALA_ESPERA, motivo: "SALIDA_DESDE_ENCUENTRO" });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se envio el paciente a lista de espera");
      }
      if (accionSalidaEncuentro === "NO_ATENDIDO") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA) { setError("No atendido requiere paciente en atencion o en sala de espera."); setWorking(false); return; }
        if (encuentroPacienteId) {
          const response = await cerrarEncuentroTurno(selectedTurno.id, { estadoPacienteFinal: "NO_ATENDIDO" });
          updateTurnoState(selectedTurno.id, response.estadoPacienteFinal);
          setEncuentroEstado(response.estadoEncuentro);
        } else {
          const response = await actualizarEstadoTurno(selectedTurno.id, { estado: "NO_ATENDIDO", motivo: "SALIDA_DESDE_ENCUENTRO" });
          updateTurnoState(selectedTurno.id, response.estado);
        }
        setAgendaMensaje("Se cambio el estado del turno a No atendido");
        setSelectedTurnoId(null);
      }
      setShowSalidaEncuentroModal(false); setAccionSalidaEncuentro("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la accion de salida.");
    } finally { setWorking(false); }
  }

  function abrirRecetaDigital() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente."); return; }
    if (selectedTurno.paciente === "Por identificar" || selectedTurno.documento === "-") { setError("El paciente debe estar identificado."); return; }
    setError(null);
    setShowPrescripcionModule(true);
    setPrescripcionModuleError(null);
    setPrescripcionModuleRecetas([]);
    setPrescripcionModuleLoading(true);
    void cargarRecetasPaciente();
  }

  function abrirBuscarMedicamento() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente."); return; }
    setError(null);
    setMedicamentoSearchQuery("");
    setMedicamentoResultados([]);
    setMedicamentoTotalCount(0);
    setMedicamentoPagina(1);
    setMedicamentoError(null);
    setMedicamentoSeleccionado(null);
    setShowMedicamentoModal(true);
  }

  function seleccionarMedicamento(medicamento: MedicamentoResponse) {
    setMedicamentoSeleccionado(medicamento);
    setShowMedicamentoModal(false);
    setPrescripcionDosis("");
    setPrescripcionFrecuencia("");
    setPrescripcionDuracion("");
    setPrescripcionIndicacion("");
    setPrescripcionError(null);
    setPrescripcionExitosa(false);
    setShowPrescripcionFormModal(true);
  }

  async function guardarPrescripcion() {
    if (!selectedTurno || !medicamentoSeleccionado) return;
    setPrescripcionGuardando(true);
    setPrescripcionError(null);
    try {
      var pid = encuentroPacienteId;
      if (!pid && selectedTurno.documento && selectedTurno.documento !== "-") {
        const candidatos = await buscarPersonaPorDocumento("DNI", selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) pid = candidatos[0].id;
      }
      if (!pid) { setPrescripcionError("No se pudo identificar el paciente."); setPrescripcionGuardando(false); return; }
      if (!encuentroPacienteId) setEncuentroPacienteId(pid);

      await crearPrescripcion({
        pacienteId: pid,
        turnoId: selectedTurno.id,
        medicamentoId: medicamentoSeleccionado.id,
        medicamentoDisplay: `${medicamentoSeleccionado.producto} - ${medicamentoSeleccionado.presentacion}`,
        dosisTexto: prescripcionDosis || undefined,
        frecuenciaTexto: prescripcionFrecuencia || undefined,
        duracionDias: prescripcionDuracion ? parseInt(prescripcionDuracion, 10) : undefined,
        indicacion: prescripcionIndicacion || undefined,
      });
      setPrescripcionExitosa(true);
      if (showPrescripcionModule) void cargarRecetasPaciente();
    } catch (err) {
      setPrescripcionError("Error al guardar la prescripcion.");
    } finally {
      setPrescripcionGuardando(false);
    }
  }

  async function cargarRecetasPaciente() {
    if (!selectedTurno) return;
    var pid = encuentroPacienteId;
    if (!pid && selectedTurno.documento && selectedTurno.documento !== "-") {
      try {
        const candidatos = await buscarPersonaPorDocumento("DNI", selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) pid = candidatos[0].id;
      } catch {}
    }
    if (!pid) { setPrescripcionModuleLoading(false); return; }
    try {
      const recetas = await listarRecetasPaciente(pid);
      setPrescripcionModuleRecetas(recetas);
    } catch {
      setPrescripcionModuleError("Error al cargar prescripciones.");
    } finally {
      setPrescripcionModuleLoading(false);
    }
  }

  async function handleAnularReceta(recetaId: string) {
    setPrescripcionModuleAnulando(recetaId);
    try {
      await anularRecetaDigital(recetaId, "Anulado por medico");
      void cargarRecetasPaciente();
    } catch {
      setPrescripcionModuleError("Error al anular la prescripcion.");
    } finally {
      setPrescripcionModuleAnulando(null);
    }
  }

  function imprimirReceta(receta: RecetaDigitalResumenResponse) {
    obtenerRecetaDigital(receta.recetaId).then(detalle => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      const items = detalle.items.map(item => `
        <tr>
          <td style="padding: 0.3rem 0.5rem; border-bottom: 1px solid #ccc;">${item.medicamentoDisplay}</td>
          <td style="padding: 0.3rem 0.5rem; border-bottom: 1px solid #ccc;">${item.dosisTexto ?? "-"}</td>
          <td style="padding: 0.3rem 0.5rem; border-bottom: 1px solid #ccc;">${item.frecuenciaTexto ?? "-"}</td>
          <td style="padding: 0.3rem 0.5rem; border-bottom: 1px solid #ccc;">${item.duracionDias ? item.duracionDias + " días" : "-"}</td>
          <td style="padding: 0.3rem 0.5rem; border-bottom: 1px solid #ccc;">${item.indicacion ?? "-"}</td>
        </tr>
      `).join("\n");
      printWindow.document.write(`
        <html><head><meta charset="utf-8">
        <title>Prescripción Médica</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; margin: 2cm; }
          h1 { font-size: 14pt; text-align: center; margin-bottom: 1.5cm; }
          table { width: 100%; border-collapse: collapse; margin-top: 0.5cm; }
          th { background: #eef; padding: 0.3rem 0.5rem; border-bottom: 2px solid #999; text-align: left; }
          .firma { margin-top: 2cm; text-align: center; }
          .firma hr { width: 50%; margin: 0 auto 0.3cm; }
        </style>
        </head><body>
        <h1>RECETA MÉDICA</h1>
        <p><strong>Paciente:</strong> ${selectedTurno?.paciente ?? "—"}</p>
        <p><strong>Documento:</strong> ${selectedTurno?.documento ?? "—"}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-AR")}</p>
        <table><thead><tr>
          <th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th><th>Indicación</th>
        </tr></thead><tbody>${items}</tbody></table>
        <div class="firma">
          <hr><p>Firma y sello del médico</p>
        </div>
        </body></html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }).catch(() => setPrescripcionModuleError("Error al obtener detalle de la prescripcion."));
  }

  async function ejecutarBusquedaMedicamento(query: string, page = 1) {
    if (!query.trim()) {
      setMedicamentoResultados([]);
      setMedicamentoTotalCount(0);
      return;
    }
    setMedicamentoLoading(true);
    setMedicamentoError(null);
    try {
      const result = await buscarMedicamentos(query.trim(), undefined, undefined, page, 20);
      // If current results exist and user navigated pages, replace
      setMedicamentoResultados(result.items);
      setMedicamentoTotalCount(result.totalCount);
      setMedicamentoPagina(page);
    } catch (err) {
      setMedicamentoError("Error al buscar medicamentos.");
      setMedicamentoResultados([]);
    } finally {
      setMedicamentoLoading(false);
    }
  }

  function abrirSistemasClinicos() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente."); return; }
    if (!SISTEMAS_CLINICOS_URL) { setError("No se configuro VITE_SISTEMAS_CLINICOS_URL para integrar Sistemas Clinicos."); return; }
    setError(null);
    setShowSistemasClinicosModal(true);
  }

  function confirmarAccederSistemasClinicos() {
    if (!selectedTurno) return;
    setShowSistemasClinicosModal(false);
    window.open(buildSistemasClinicosUrl(selectedTurno), "_blank", "noopener,noreferrer");
  }

  useEffect(() => { void loadSelectores(); }, [isAdminUsuario, isMedicoUsuario]);
  useEffect(() => {
    if (!selectores || !servicioSeleccionado || !servicioId) return;
    void loadTurnos();
  }, [selectores, servicioSeleccionado, servicioId, efectorId, estadoFiltro, fechaAgenda]);
  useEffect(() => { lugarAtencionPreguntadoRef.current = false; }, [fechaAgenda]);

  useEffect(() => {
    if (medicamentoSearchTimer.current) clearTimeout(medicamentoSearchTimer.current);
    if (!showMedicamentoModal || !medicamentoSearchQuery.trim()) {
      setMedicamentoResultados([]);
      setMedicamentoTotalCount(0);
      return;
    }
    medicamentoSearchTimer.current = setTimeout(() => {
      setMedicamentoPagina(1);
      void ejecutarBusquedaMedicamento(medicamentoSearchQuery, 1);
    }, 400);
    return () => { if (medicamentoSearchTimer.current) clearTimeout(medicamentoSearchTimer.current); };
  }, [medicamentoSearchQuery, showMedicamentoModal]);
  useEffect(() => { window.localStorage.setItem(EFECTOR_ID_STORAGE_KEY, efectorId); }, [efectorId]);

  useEffect(() => {
    if (!selectedTurnoId) {
      setEncuentroEstado("SIN_ENCUENTRO"); setEncuentroPacienteId(null); setEncuentroCreadoEn(null); setEvolucionesAmbulatorias([]); setProblemasCronicos([]);
      setShowEvolucionesListado(false); setShowAgregarEvolucionModal(false); return;
    }
    let active = true;
    void (async () => {
      try {
        const response = await obtenerEncuentroTurno(selectedTurnoId);
        const [evoluciones, problemas] = await Promise.all([
          obtenerEvolucionesAmbulatoriasPaciente(response.pacienteId, 20),
          obtenerProblemasCronicosPaciente(response.pacienteId)
        ]);
        if (active) {
          setEncuentroEstado(response.estado); setEncuentroPacienteId(response.pacienteId); setEncuentroCreadoEn(response.creadoEn);
          setEvolucionesAmbulatorias(evoluciones);
          setProblemasCronicos(problemas.map(p => ({
            id: p.problemaCronicoId,
            fechaHora: p.fechaInicio,
            titulo: p.descripcion,
            detalle: `${p.categoria} | ${p.fechaInicio}`,
            evolucionesAsociadas: p.evolucionesAsociadas
          })));
        }
      } catch {
        if (active) { setEncuentroEstado("SIN_ENCUENTRO"); setEncuentroPacienteId(null); setEvolucionesAmbulatorias([]); setProblemasCronicos([]); }
      }
      if (active) void loadSolicitudesEstudios(selectedTurnoId);
    })();
    return () => { active = false; };
  }, [selectedTurnoId]);

  const prevShowSolicitudRef = useRef(false);
  useEffect(() => {
    if (prevShowSolicitudRef.current && !showSolicitudEstudiosModal) {
      const scopeId = solicitudScopeTurnoId ?? selectedTurnoId ?? "";
      if (scopeId) void saveSolicitudesEstudios(scopeId);
    }
    prevShowSolicitudRef.current = showSolicitudEstudiosModal;
  }, [showSolicitudEstudiosModal, selectedTurnoId]);

  useEffect(() => {
    if (!solicitudToast) return;
    const timer = window.setTimeout(() => setSolicitudToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [solicitudToast]);

  const showLlamarMegafonoModal = pendingLlamadoTurnoId !== null;
  const showVistaRapidaModal = turnoVistaRapidaId !== null;
  const setLlamarMegafonoModal = (open: boolean) => { if (!open) setPendingLlamadoTurnoId(null); };
  const setVistaRapidaModal = (open: boolean) => { if (!open) setTurnoVistaRapidaId(null); };
  const showSolicitarEstudiosModal = showSolicitudEstudiosModal;
  const setShowSolicitarEstudiosModal = setShowSolicitudEstudiosModal;
  const isEstudioDesdeEvolucion = solicitudOrigen === "evolucion";
  const opcionesPracticasIzquierda = practicasFiltradasIzquierda.map((practica: string) => ({ id: practica, nombre: practica }));
  const opcionesPracticasDerecha = practicasFechaActiva.map((practica: string) => ({ id: practica, nombre: practica }));
  const searchQueryPracticasIzquierda = busquedaPracticas;
  const setSearchQueryPracticasIzquierda = setBusquedaPracticas;
  const searchQueryPracticasDerecha = busquedaPracticasDerecha;
  const setSearchQueryPracticasDerecha = setBusquedaPracticasDerecha;
  const selectedPracticasIzquierda = practicasSeleccionadasIzquierda;
  const setSelectedPracticasIzquierda = setPracticasSeleccionadasIzquierda;
  const selectedPracticasDerecha = practicasSeleccionadasDerecha;
  const setSelectedPracticasDerecha = setPracticasSeleccionadasDerecha;
  const solicitudesScopeActual = solicitudScopeId ?? "";
  const solicitudesPorScope = { [solicitudesScopeActual]: observacionesFechaActiva };
  const observacionPracticaModalData = practicaObservacionActiva ? { id: practicaObservacionActiva, nombre: practicaObservacionActiva } : null;
  const setObservacionPracticaModalData = (value: { id: string; nombre: string; } | null) => { setPracticaObservacionActiva(value?.id ?? null); };
  const observacionPracticaText = observacionDraft;
  const setObservacionPracticaText = setObservacionDraft;
  const salidaEncuentroError = error;

  return {
    isAdminUsuario, isMedicoUsuario, selectores, setSelectores, turnos, setTurnos, loading, setLoading,
    working, setWorking, error, setError, serviceSelectionError, setServiceSelectionError,
    agendaMensaje, setAgendaMensaje, showSinAgendaModal, setShowSinAgendaModal,
    encuentroEstado, setEncuentroEstado, encuentroCreadoEn, setEncuentroCreadoEn, evolucionesAmbulatorias, setEvolucionesAmbulatorias,
    fechaAgenda, setFechaAgenda, servicioId, setServicioId, servicioPendienteId, setServicioPendienteId,
    servicioSeleccionado, setServicioSeleccionado, showServicioModal, setShowServicioModal,
    showLugarAtencionModal, setShowLugarAtencionModal, lugarAtencionPendienteId, setLugarAtencionPendienteId,
    lugarAtencionError, setLugarAtencionError, efectorId, setEfectorId, estadoFiltro, setEstadoFiltro,
    query, setQuery, selectedTurnoId, setSelectedTurnoId, turnoVistaRapidaId, setTurnoVistaRapidaId,
    turnoVistaRapida, pendingLlamadoTurnoId, setPendingLlamadoTurnoId, pendingLlamadoTurno,
    modoIngreso, setModoIngreso, origenPanoramica, setOrigenPanoramica,
    contadorLlamados, setContadorLlamados, showEvolucionesListado, setShowEvolucionesListado,
    showAgregarEvolucionModal, setShowAgregarEvolucionModal, showSalidaEncuentroModal, setShowSalidaEncuentroModal,
    accionSalidaEncuentro, setAccionSalidaEncuentro, evolucionesFiltroProfesional, setEvolucionesFiltroProfesional,
    evolucionesFiltroServicio, setEvolucionesFiltroServicio, evolucionTextoDraft, setEvolucionTextoDraft,
    evolucionProblemasTextoDraft, setEvolucionProblemasTextoDraft, evolucionFormError, setEvolucionFormError,
    evolucionesLocalesPorTurno, setEvolucionesLocalesPorTurno,
    showSolicitudEstudiosModal, setShowSolicitudEstudiosModal,
    showSolicitarEstudiosModal, setShowSolicitarEstudiosModal,
    showFechaPrimeraPracticaModal, setShowFechaPrimeraPracticaModal,
    showObservacionModal, setShowObservacionModal, fechaSolicitudNueva, setFechaSolicitudNueva,
    fechaSolicitudActiva, setFechaSolicitudActiva, busquedaPracticas, setBusquedaPracticas,
    busquedaPracticasDerecha, setBusquedaPracticasDerecha,
    practicasSeleccionadasIzquierda, setPracticasSeleccionadasIzquierda,
    practicasSeleccionadasDerecha, setPracticasSeleccionadasDerecha,
    practicaObservacionActiva, setPracticaObservacionActiva, observacionDraft, setObservacionDraft,
    observacionesPorTurno, setObservacionesPorTurno, solicitudScopeTurnoId, setSolicitudScopeTurnoId,
    solicitudOrigen, setSolicitudOrigen, canalEnvioSolicitudes, setCanalEnvioSolicitudes,
    solicitudToast, setSolicitudToast, solicitudError, setSolicitudError,
    solicitudesEstudiosPorTurno, setSolicitudesEstudiosPorTurno,
    evolucionEditorRef, selectedTurno, pacienteEnAtencionConflicto,
    turnosFiltrados, panoramica, evolucionesCombinadas, listadoEvoluciones,
    profesionalesEvoluciones, serviciosEvoluciones, listadoEvolucionesFiltradas,
    canLlamar, puedeAbrirEvoluciones, puedeSolicitarEstudios, esDiaActual,
    formatAgendaDate, shiftIsoDate, estadoLabel, formatLlegada, estadoEsLlamable,
    formatDateTime, canIntegrarRecetario,
    PROFESIONAL_ACTUAL: profesionalActual,
    ESTADO_EN_ATENCION, ESTADO_EN_SALA_ESPERA,
    serviciosDisponibles, practicasDisponibles, draftSolicitudScopeId, solicitudScopeId,
    solicitudesTurnoSeleccionado, fechasSolicitudesOrdenadas, practicasFechaActiva,
    observacionesFechaActiva, practicasFiltradasIzquierda, totalEstudiosSolicitados,
    totalEstudiosSolicitadosTurno, totalEstudiosSolicitadosDraftEvolucion,
    evolucionProblemasEtiquetas, canGuardarEvolucion, canAplicarFormatoEvolucion,
    cumpleRegistroMinimoSalidaEncuentro, canSolicitarEstudiosDesdeEvolucion,
    isEstudioDesdeEvolucion, opcionesPracticasIzquierda, opcionesPracticasDerecha,
    searchQueryPracticasIzquierda, setSearchQueryPracticasIzquierda,
    searchQueryPracticasDerecha, setSearchQueryPracticasDerecha,
    selectedPracticasIzquierda, setSelectedPracticasIzquierda,
    selectedPracticasDerecha, setSelectedPracticasDerecha,
    solicitudesScopeActual, solicitudesPorScope, observacionPracticaModalData,
    setObservacionPracticaModalData, observacionPracticaText, setObservacionPracticaText,
    showLlamarMegafonoModal, setLlamarMegafonoModal, showVistaRapidaModal, setVistaRapidaModal,
    salidaEncuentroError, efectoresDisponibles, servicioActualNombre, lugarAtencionNombre,
    horarioConfigurado, loadSelectores, cancelarServicioIngreso, confirmarServicioIngreso,
    confirmarCambioLugarAtencion, limpiarSolicitudesScope, abrirSolicitudEstudiosConScope,
    abrirSolicitudEstudios, abrirSolicitudEstudiosDesdeEvolucion, abrirEvoluciones,
    abrirAgregarEvolucion, aplicarFormatoEvolucion, guardarEvolucionNueva,
    showBuscarPacienteModal, setShowBuscarPacienteModal,
    buscarPacienteTipoDoc, setBuscarPacienteTipoDoc,
    buscarPacienteNumDoc, setBuscarPacienteNumDoc,
    buscarPacienteCandidatos, buscarPacienteSeleccionado,
    buscarPacienteError, buscarPacienteLoading,
    showSetMinimoSearch, buscarPacienteNombre, setBuscarPacienteNombre,
    buscarPacienteApellido, setBuscarPacienteApellido,
    buscarPacienteFechaNacimiento, setBuscarPacienteFechaNacimiento,
    buscarPacienteSexoBiologico, setBuscarPacienteSexoBiologico,
    buscarPacienteSetMinimoLoading,
    showAsignarProblemaModal, setShowAsignarProblemaModal,
    problemaNuevaDescripcion, setProblemaNuevaDescripcion,
    problemaNuevaCategoria, setProblemaNuevaCategoria,
    problemaNuevaFechaInicio, setProblemaNuevaFechaInicio,
    problemaFormError, handleAsignarProblema,
    abrirBuscarPaciente, handleBuscarPacientePorDocumento,
    handleBuscarPacientePorSetMinimo,
    handleSeleccionarPacienteFueraAgenda, handleVolverBuscarPaciente, cerrarBuscarPaciente,
    mostrarToastSolicitud, imprimirSolicitudesPracticas, agregarFechaSolicitud,
    moverPracticasSeleccionadasADerecha, moverPracticasSeleccionadasAIzquierda,
    abrirObservacionPractica, guardarObservacionPractica, eliminarObservacionPractica,
    confirmarFechaPrimeraPractica, loadTurnos, updateTurnoState, llamarPaciente,
    abrirHistoriaClinica, verTurno, abrirDesdeMegafono, confirmarLlamadoMegafono,
    confirmarSalidaEncuentro, abrirRecetaDigital,
    showSistemasClinicosModal, setShowSistemasClinicosModal,
    abrirSistemasClinicos, confirmarAccederSistemasClinicos,
    canIntegrarSistemasClinicos,
    showMedicamentoModal, setShowMedicamentoModal,
    abrirBuscarMedicamento, medicamentoSearchQuery, setMedicamentoSearchQuery,
    medicamentoResultados, medicamentoLoading, medicamentoTotalCount,
    medicamentoPagina, setMedicamentoPagina, medicamentoError,
    ejecutarBusquedaMedicamento, medicamentoSeleccionado, setMedicamentoSeleccionado,
    seleccionarMedicamento, showPrescripcionFormModal, setShowPrescripcionFormModal,
    prescripcionDosis, setPrescripcionDosis, prescripcionFrecuencia, setPrescripcionFrecuencia,
    prescripcionDuracion, setPrescripcionDuracion, prescripcionIndicacion, setPrescripcionIndicacion,
    prescripcionGuardando, prescripcionError, prescripcionExitosa, guardarPrescripcion,
    showPrescripcionModule, setShowPrescripcionModule,
    prescripcionModuleRecetas, prescripcionModuleLoading, prescripcionModuleError,
    prescripcionModuleAnulando, cargarRecetasPaciente, handleAnularReceta, imprimirReceta
  } as const;
}
