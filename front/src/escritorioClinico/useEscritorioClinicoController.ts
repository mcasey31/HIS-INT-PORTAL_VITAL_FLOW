import { useEffect, useMemo, useRef, useState } from "react";
import { actualizarEstadoTurno, buscarTurnosAdmision, cerrarEncuentroTurno, getSelectoresAdmision, obtenerEncuentroTurno } from "../admision/admisionApi";
import type { TurnoAdmision, SelectoresAdmision } from "../admision/admisionTypes";
import { getPracticas } from "../agenda/agendaApi";
import type { PracticaOption } from "../agenda/agendaTypes";
import { anularRecetaDigital, asignarProblemaPaciente, buscarMedicamentos, buscarPersonaPorDocumento, buscarPersonaPorSetMinimo, crearPrescripcion, crearEvolucionAmbulatoria, guardarSolicitudesEstudiosTurno, listarRecetasPaciente, obtenerEvolucionesAmbulatoriasPaciente, obtenerFinanciadorActivo, obtenerProblemasCronicosPaciente, obtenerRecetaDigital, obtenerSolicitudesEstudiosTurno } from "./escritorioClinicoApi";
import type { AsignarProblemaRequest, BuscarMedicamentosResponse, CrearEvolucionAmbulatoriaRequest, EvolucionAmbulatoriaResponse, FinanciadorActivoResponse, GuardarSolicitudesEstudiosRequest, MedicamentoResponse, PersonaCandidataBusqueda, ProblemaCronicoResponse, RecetaDigitalDetalleResponse, RecetaDigitalResumenResponse, RegistroPanoramica, SolicitudEstudioRecord } from "./escritorioClinicoTypes";
import {
  UseEscritorioClinicoOptions, ModoIngreso, OrigenPanoramica, AccionSalidaEncuentro,
  EvolucionCreadaLocal, SolicitudesEstudiosPorFecha, ObservacionesPorPracticaFecha,
  ESTADO_EN_SALA_ESPERA, ESTADO_EN_OBSERVACION, ESTADO_EN_ATENCION, ESTADO_ATENDIDO, ESTADO_NO_ATENDIDO, ESTADO_ACTIVA,
  PROFESIONAL_POR_DEFECTO, PROFESIONAL_LEGACY_PLACEHOLDER,   EVOLUCIONES_LOCALES_STORAGE_KEY, EFECTOR_ID_STORAGE_KEY,
  RECETARIO_URL, RECETARIO_PROFILE, SISTEMAS_CLINICOS_URL,
  DEFAULT_DOCUMENT_TYPE, PACIENTE_POR_IDENTIFICAR, VALOR_GUION,
  CONSULTA_MEDICA, ROL_ADMINISTRADOR, ROL_MEDICO, TIPO_EFECTOR_CONSULTORIO,
  todayIsoDate, formatProfesionalDisplayName, estadoEsLlamable, parseTurnoDateTime,
  normalizeText, normalizeProfesionalLabel, buildEvolucionScopeKey, normalizeEvolucionScopeToken,
  parseStoredEvolucionesLocales, buildListadoEvoluciones, hasValidEvolucionContent,
  extractPlainTextFromHtml, buildRecetarioUrl, buildPanoramica, sanitizeRichTextHtml,
  formatAgendaDate, shiftIsoDate, estadoLabel, formatLlegada, formatDateTime,
  canIntegrarRecetario, canIntegrarSistemasClinicos, buildSistemasClinicosUrl, escapeHtml
} from "./escritorioClinicoTypes";
import { useAuth } from "../auth/AuthContext";

export function useEscritorioClinicoController({ onCancelSeleccionServicio }: UseEscritorioClinicoOptions = {}) {
  const { roles, username, profesionalNombre } = useAuth();
  const profesionalActual = useMemo(() => profesionalNombre ?? formatProfesionalDisplayName(username), [username, profesionalNombre]);
  const isAdminUsuario = roles.some(role => normalizeText(role) === ROL_ADMINISTRADOR);
  const isMedicoUsuario = roles.some(role => normalizeText(role) === ROL_MEDICO);

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
  const [recetasDetalle, setRecetasDetalle] = useState<Record<string, RecetaDigitalDetalleResponse>>({});
  const [prescripcionModuleLoading, setPrescripcionModuleLoading] = useState(false);
  const [prescripcionModuleError, setPrescripcionModuleError] = useState<string | null>(null);
  const [prescripcionModuleAnulando, setPrescripcionModuleAnulando] = useState<string | null>(null);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [medicamentoSearchQuery, setMedicamentoSearchQuery] = useState("");
  const [medicamentoSoloGenerico, setMedicamentoSoloGenerico] = useState(false);
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
  const [prescripcionVia, setPrescripcionVia] = useState("Oral");
  const [prescripcionGuardando, setPrescripcionGuardando] = useState(false);
  const [prescripcionError, setPrescripcionError] = useState<string | null>(null);
  const [prescripcionExitosa, setPrescripcionExitosa] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailModalPacienteId, setEmailModalPacienteId] = useState("");
  const [emailModalRecetaIds, setEmailModalRecetaIds] = useState<string[]>([]);
  const medicamentoSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const practicasSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [practicasResultados, setPracticasResultados] = useState<PracticaOption[]>([]);
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
    let filtered = turnos;
    if (isMedicoUsuario && !isAdminUsuario) {
      filtered = filtered.filter(turno => turno.paciente !== PACIENTE_POR_IDENTIFICAR);
      if (efectorId) {
        filtered = filtered.filter(turno => turno.efector === efectorId);
      }
    }
    const sorted = [...filtered].sort((a, b) => {
      const aArrived = a.llegada != null;
      const bArrived = b.llegada != null;
      if (aArrived && !bArrived) return -1;
      if (!aArrived && bArrived) return 1;
      if (aArrived && bArrived) {
        return parseTurnoDateTime(a.llegada!) - parseTurnoDateTime(b.llegada!);
      }
      return parseTurnoDateTime(a.turno) - parseTurnoDateTime(b.turno);
    });
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sorted;
    return sorted.filter(turno =>
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
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual, username),
      problemasAsociados: item.problemasAsociados
    }));
    const backendNormalizadas = evolucionesAmbulatorias.map(item => ({
      ...item,
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual, username)
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
        ...item, profesional: normalizeProfesionalLabel(item.profesional, profesionalActual, username)
      }));
    }
    const base = buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
      ...item, profesional: normalizeProfesionalLabel(item.profesional, profesionalActual, username)
    }));
    const locales = evolucionesLocalesPaciente.map(item => {
      const { fecha } = extractPlainTextFromHtml(item.fechaAtencion) as unknown as { fecha: string };
      const formatted = item.fechaAtencion.includes("T") ? new Date(item.fechaAtencion).toLocaleDateString("es-AR") : item.fechaAtencion.split(" ")[0] ?? item.fechaAtencion;
      return {
        id: item.id,
        fechaHora: item.fechaAtencion,
        fechaAtencion: formatted,
        especialidad: item.especialidad,
        profesional: normalizeProfesionalLabel(item.profesional, profesionalActual, username),
        practica: CONSULTA_MEDICA,
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

  const canLlamar = selectedTurno && (
    selectedTurno.estado === "PROGRAMADO"
    || (selectedTurno.llegada && estadoEsLlamable(selectedTurno.estado))
  );
  const pacienteEnAtencion = selectedTurno?.estado === ESTADO_EN_ATENCION;
  const esVisualizacionHC = origenPanoramica === "historia" && !pacienteEnAtencion;
  const puedeAbrirEvoluciones = Boolean(selectedTurno && selectedTurno.llegada && !esVisualizacionHC);
  const puedeSolicitarEstudios = Boolean(selectedTurno && selectedTurno.llegada && !esVisualizacionHC);
  const esDiaActual = fechaAgenda === todayIsoDate();
  const serviciosDisponibles = selectores?.servicios ?? [];

  useEffect(() => {
    const q = busquedaPracticas.trim();
    if (practicasSearchTimer.current) clearTimeout(practicasSearchTimer.current);
    if (q.length < 2) { setPracticasResultados([]); return; }
    practicasSearchTimer.current = setTimeout(async () => {
      try {
        const results = await getPracticas(q);
        setPracticasResultados(results);
      } catch { setPracticasResultados([]); }
    }, 250);
    return () => { if (practicasSearchTimer.current) clearTimeout(practicasSearchTimer.current); };
  }, [busquedaPracticas]);

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
    return practicasResultados
      .filter((p: PracticaOption) => !practicasFechaActiva.includes(p.nombre));
  }, [practicasResultados, practicasFechaActiva]);

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
          const profesionalNormalizado = normalizeProfesionalLabel(item.profesional, profesionalActual, username);
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
      const consultorios = Array.from(new Set(turnos.map(turno => turno.efector).filter(nombre => nombre && nombre !== VALOR_GUION)));
      return consultorios.map(nombre => ({ id: nombre, nombre, tipoEfector: TIPO_EFECTOR_CONSULTORIO, servicioId }));
    }
    return (selectores?.efectores ?? []).filter((efector: { servicioId: string }) => !servicioId || efector.servicioId === servicioId);
  }, [isMedicoUsuario, isAdminUsuario, turnos, servicioId, selectores]);

  const servicioActualNombre = useMemo(() => serviciosDisponibles.find((servicio: { id: string }) => servicio.id === servicioId)?.nombre ?? VALOR_GUION, [serviciosDisponibles, servicioId]);
  const lugarAtencionNombre = useMemo(() => {
    if (isMedicoUsuario && !isAdminUsuario) {
      if (efectorId) return efectorId;
      return efectoresDisponibles[0]?.nombre ?? turnos[0]?.efector ?? VALOR_GUION;
    }
    return efectoresDisponibles.find((efector: { id: string }) => efector.id === efectorId)?.nombre ?? VALOR_GUION;
  }, [isMedicoUsuario, isAdminUsuario, turnos, efectoresDisponibles, efectorId]);
  const horarioConfigurado = useMemo(() => turnos[0]?.turno ? `${turnos[0].turno} hs` : VALOR_GUION, [turnos]);

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
    const aliasKeys = Array.from(new Set([scopeKey, selectedTurno.id, documentoRaw])).filter(key => key && key !== VALOR_GUION);
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
      if (!pacienteId && selectedTurno.documento && selectedTurno.documento !== VALOR_GUION) {
        const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
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
    setBuscarPacienteTipoDoc(DEFAULT_DOCUMENT_TYPE);
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
        const consultorios = Array.from(new Set(data.map(item => item.efector).filter(nombre => nombre && nombre !== VALOR_GUION)));
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
    if (turno.estado !== ESTADO_EN_ATENCION && (estadoEsLlamable(turno.estado) || turno.estado === "PROGRAMADO")) {
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
          const response = await cerrarEncuentroTurno(selectedTurno.id, { estadoPacienteFinal: ESTADO_ATENDIDO });
          updateTurnoState(selectedTurno.id, response.estadoPacienteFinal);
          setEncuentroEstado(response.estadoEncuentro);
        } else {
          const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_ATENDIDO, motivo: "SALIDA_DESDE_ENCUENTRO" });
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
      if (accionSalidaEncuentro === ESTADO_NO_ATENDIDO) {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA) { setError("No atendido requiere paciente en atencion o en sala de espera."); setWorking(false); return; }
        if (encuentroPacienteId) {
          const response = await cerrarEncuentroTurno(selectedTurno.id, { estadoPacienteFinal: ESTADO_NO_ATENDIDO });
          updateTurnoState(selectedTurno.id, response.estadoPacienteFinal);
          setEncuentroEstado(response.estadoEncuentro);
        } else {
          const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_NO_ATENDIDO, motivo: "SALIDA_DESDE_ENCUENTRO" });
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
    if (selectedTurno.paciente === PACIENTE_POR_IDENTIFICAR || selectedTurno.documento === VALOR_GUION) { setError("El paciente debe estar identificado."); return; }
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
    setShowPrescripcionModule(false);
    setShowMedicamentoModal(true);
  }

  function seleccionarMedicamento(medicamento: MedicamentoResponse) {
    setMedicamentoSeleccionado(medicamento);
    setShowMedicamentoModal(false);
    setPrescripcionDosis("");
    setPrescripcionFrecuencia("");
    setPrescripcionDuracion("");
    setPrescripcionIndicacion("");
    setPrescripcionVia("Oral");
    setPrescripcionError(null);
    setPrescripcionExitosa(false);
    setShowPrescripcionFormModal(true);
  }

  async function guardarPrescripcion() {
    if (!selectedTurno || !medicamentoSeleccionado) return;
    setPrescripcionGuardando(true);
    setPrescripcionError(null);
    try {
      var pid = encuentroPacienteId ?? selectedTurno.pacienteId ?? null;
      if (!pid && selectedTurno.documento && selectedTurno.documento !== VALOR_GUION) {
        const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) pid = candidatos[0].id;
      }
      if (!pid) { setPrescripcionError("No se pudo identificar el paciente."); setPrescripcionGuardando(false); return; }
      if (!encuentroPacienteId) setEncuentroPacienteId(pid);

      const fullIndicacion = prescripcionVia 
        ? `${prescripcionVia}. ${prescripcionIndicacion || ""}`.trim()
        : prescripcionIndicacion;

      await crearPrescripcion({
        pacienteId: pid,
        turnoId: selectedTurno.id,
        medicamentoId: medicamentoSeleccionado.id,
        medicamentoDisplay: `${medicamentoSeleccionado.producto} ${medicamentoSeleccionado.presentacion} — ${medicamentoSeleccionado.principioActivo} — ${medicamentoSeleccionado.laboratorio}`,
        dosisTexto: prescripcionDosis || undefined,
        frecuenciaTexto: prescripcionFrecuencia || undefined,
        duracionDias: prescripcionDuracion ? parseInt(prescripcionDuracion, 10) : undefined,
        indicacion: fullIndicacion || undefined,
      });
      // Close form modal and reopen prescriptions list
      setShowPrescripcionFormModal(false);
      setShowPrescripcionModule(true);
      setPrescripcionModuleLoading(true);
      void cargarRecetasPaciente(pid);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar la prescripcion.";
      setPrescripcionError(message);
    } finally {
      setPrescripcionGuardando(false);
    }
  }

  async function cargarRecetasPaciente(pidOverride?: string) {
    if (!selectedTurno) return;
    var pid = pidOverride ?? encuentroPacienteId ?? selectedTurno.pacienteId ?? null;
    if (!pid && selectedTurno.documento && selectedTurno.documento !== VALOR_GUION) {
      try {
        const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) pid = candidatos[0].id;
      } catch {}
    }
    if (!pid) { setPrescripcionModuleLoading(false); return; }
    try {
      const recetas = await listarRecetasPaciente(pid);
      setPrescripcionModuleRecetas(recetas);
      const activas = recetas.filter(r => r.estado === ESTADO_ACTIVA);
      if (activas.length > 0) {
        const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
        const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
        for (const result of results) {
          if (result.status === "fulfilled") {
            detalles[result.value.recetaId] = result.value;
          }
        }
        if (Object.keys(detalles).length > 0) setRecetasDetalle(detalles);
      }
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
    function extractDoctorNameFromFhir(fhirBundleJson?: string): string | null {
      if (!fhirBundleJson) return null;
      try {
        const bundle = typeof fhirBundleJson === "string" ? JSON.parse(fhirBundleJson) : fhirBundleJson;
        if (bundle && bundle.entry && Array.isArray(bundle.entry)) {
          const practitionerEntry = bundle.entry.find(
            (e: any) => e.resource && e.resource.resourceType === "Practitioner"
          );
          if (practitionerEntry && practitionerEntry.resource) {
            const p = practitionerEntry.resource;
            if (p.name && Array.isArray(p.name) && p.name.length > 0) {
              const nameObj = p.name[0];
              const given = Array.isArray(nameObj.given) ? nameObj.given.join(" ") : (nameObj.given || "");
              const family = nameObj.family || "";
              const text = nameObj.text || `${given} ${family}`.trim();
              if (text) return text;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing FHIR bundle", e);
      }
      return null;
    }

    Promise.all([
      obtenerRecetaDigital(receta.recetaId),
      (async () => {
        var pid = encuentroPacienteId ?? selectedTurno?.pacienteId ?? null;
        if (!pid && selectedTurno?.documento && selectedTurno.documento !== VALOR_GUION) {
          try {
            const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
            if (candidatos.length > 0) pid = candidatos[0].id;
          } catch {}
        }
        if (!pid) return null;
        return obtenerFinanciadorActivo(pid).catch(() => null);
      })()
    ]).then(([detalle, financiador]) => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const items = detalle.items.map(item => {
        const display = item.medicamentoDisplay || "";
        let brand = display;
        let generic = "";
        const match = display.match(/\(([^)]+)\)/);
        if (match) {
          generic = match[1];
          brand = display.replace(/\s*\([^)]+\)/, "").trim();
        }
        return `
          <tr>
            <td>
              <div class="med-item">${brand}</div>
              ${generic ? `<div class="med-sub">${generic}</div>` : ""}
            </td>
            <td>${item.dosisTexto ?? VALOR_GUION}</td>
            <td>${item.frecuenciaTexto ?? VALOR_GUION}</td>
            <td>${item.duracionDias ? item.duracionDias + " días" : VALOR_GUION}</td>
            <td>${item.indicacion ?? VALOR_GUION}</td>
          </tr>
        `;
      }).join("\n");

      const matriculaTexto = detalle.prescriptorMatricula ? `MP ${detalle.prescriptorMatricula}` : "";
      const doctorNombre = extractDoctorNameFromFhir(detalle.fhirBundleJson) || profesionalActual || "Profesional Médico";
      const pacienteNombre = selectedTurno?.paciente ?? "—";
      const pacienteDocumento = selectedTurno?.documento ?? "—";
      const fechaEmision = new Date(detalle.creadoEn).toLocaleDateString("es-AR");
      const planTexto = financiador?.planNombre ? ` (Plan: ${financiador.planNombre})` : "";
      const afiliadoTexto = financiador?.numeroAfiliado ? ` - N° ${financiador.numeroAfiliado}` : "";
      const financiadorTexto = financiador?.financiadorNombre 
        ? `${financiador.financiadorNombre}${planTexto}${afiliadoTexto}` 
        : (selectedTurno?.financiador ?? "—");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Receta Digital - VitalFlow</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 1.5cm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 10pt;
              color: #1e293b;
              line-height: 1.5;
              margin: 0;
              padding: 0;
              background-color: #fff;
            }
            .receta-wrapper {
              max-width: 800px;
              margin: 0 auto;
              padding: 0.5cm;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5cm;
            }
            .logo-container {
              display: flex;
              align-items: center;
            }
            .logo-title {
              font-size: 20pt;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.02em;
              line-height: 1;
              display: block;
            }
            .logo-subtitle {
              font-size: 8pt;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              display: block;
              margin-top: 4px;
            }
            .header-contact {
              text-align: right;
              font-size: 8.5pt;
              color: #475569;
              line-height: 1.4;
            }
            .header-contact p {
              margin: 0;
            }
            .header-separator {
              height: 3px;
              background: linear-gradient(90deg, #0284c7 0%, #0d9488 100%);
              margin: 0.6cm 0;
              border-radius: 2px;
            }
            .patient-card {
              border: 1px solid #e2e8f0;
              border-left: 4px solid #0284c7;
              border-radius: 8px;
              padding: 0.4cm 0.5cm;
              background-color: #f8fafc;
              margin-bottom: 0.8cm;
            }
            .patient-card-header {
              font-size: 8.5pt;
              font-weight: 700;
              color: #0369a1;
              letter-spacing: 0.08em;
              margin-bottom: 0.25cm;
            }
            .patient-grid {
              display: flex;
              justify-content: space-between;
            }
            .grid-col {
              width: 48%;
            }
            .grid-col p {
              margin: 0.15cm 0;
              font-size: 9.5pt;
              color: #334155;
            }
            .grid-col strong {
              color: #1e293b;
              font-weight: 600;
            }
            .prescripcion-header {
              font-size: 12pt;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 0.3cm;
              letter-spacing: -0.01em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 0.2cm;
              margin-bottom: 0.8cm;
            }
            th {
              background-color: #f0f9ff;
              padding: 10px 14px;
              border-bottom: 2px solid #bae6fd;
              text-align: left;
              font-size: 9pt;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #0369a1;
              font-weight: 700;
            }
            td {
              padding: 14px;
              border-bottom: 1px solid #f1f5f9;
              vertical-align: top;
              font-size: 9.5pt;
              color: #334155;
              line-height: 1.5;
            }
            tr:last-child td {
              border-bottom: none;
            }
            .med-item {
              font-weight: 700;
              font-size: 10.5pt;
              color: #0f172a;
            }
            .med-sub {
              font-size: 8.5pt;
              color: #64748b;
              margin-top: 2px;
              font-weight: 400;
            }
            .header-icon {
              width: 14px;
              height: 14px;
              display: inline-block;
              vertical-align: text-bottom;
              margin-right: 6px;
              color: #0284c7;
            }
            .footer-validation-stamp {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 1.5cm;
              padding-top: 0.6cm;
              border-top: 1px dashed #cbd5e1;
            }
            .validation-box {
              display: flex;
              align-items: center;
              width: 60%;
            }
            .qr-code {
              width: 95px;
              height: 95px;
              border: 1px solid #e2e8f0;
              padding: 4px;
              border-radius: 4px;
              margin-right: 16px;
              background: #fff;
            }
            .validation-text {
              font-size: 8pt;
              color: #64748b;
              line-height: 1.4;
            }
            .validation-text p {
              margin: 2px 0;
            }
            .val-title {
              font-weight: 700;
              color: #0f172a;
              font-size: 8.5pt;
            }
            .val-normativa {
              font-style: italic;
              margin-top: 4px !important;
            }
            .stamp-box {
              text-align: center;
              width: 35%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .signature-line {
              width: 180px;
              border-top: 1px solid #475569;
              margin-bottom: 8px;
            }
            .doc-name {
              font-weight: 700;
              font-size: 10.5pt;
              color: #0f172a;
              margin: 0;
            }
            .doc-lic {
              font-size: 8.5pt;
              color: #475569;
              margin: 2px 0 0 0;
            }
            .legal-note {
              text-align: center;
              font-size: 7.5pt;
              color: #94a3b8;
              margin-top: 1cm;
              border-top: 1px solid #f1f5f9;
              padding-top: 0.3cm;
            }
            @media print {
              body {
                background-color: #fff;
              }
              .receta-wrapper {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receta-wrapper">
            <div class="header">
              <div class="logo-container">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0284c7"/>
                  <path d="M12 6v8M8 10h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <div>
                  <span class="logo-title">VitalFlow</span>
                  <span class="logo-subtitle">Centro Médico</span>
                </div>
              </div>
              <div class="header-contact">
                <p>Av. Corrientes 1234, CABA</p>
                <p>Tel: 0810-555-FLOW (3569)</p>
                <p>contacto@vitalflow.com | www.vitalflow.com</p>
              </div>
            </div>
            
            <div class="header-separator"></div>
            
            <div class="patient-card">
              <div class="patient-card-header">DATOS DEL PACIENTE</div>
              <div class="patient-grid">
                <div class="grid-col">
                  <p><strong>Paciente:</strong> ${pacienteNombre}</p>
                  <p><strong>Documento:</strong> ${pacienteDocumento}</p>
                </div>
                <div class="grid-col">
                  <p><strong>Cobertura:</strong> ${financiadorTexto}</p>
                  <p><strong>Fecha de Emisión:</strong> ${fechaEmision}</p>
                </div>
              </div>
            </div>
            
            <div class="prescripcion-header">PRESCRIPCIÓN MÉDICA</div>
            <table>
              <thead>
                <tr>
                  <th style="width:38%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>Medicamento
                  </th>
                  <th style="width:14%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>Dosis
                  </th>
                  <th style="width:16%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Frecuencia
                  </th>
                  <th style="width:12%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>Duración
                  </th>
                  <th style="width:20%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>Indicación
                  </th>
                </tr>
              </thead>
              <tbody>
                ${items}
              </tbody>
            </table>
            
            <div class="footer-validation-stamp">
              <div class="validation-box">
                <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=95&data=${encodeURIComponent('https://his.vitalflow.com/receta/' + detalle.recetaId)}" alt="QR" />
                <div class="validation-text">
                  <p class="val-title">Receta Digital Certificada</p>
                  <p>Escanear para comprobar la autenticidad del documento en la base de datos de VitalFlow.</p>
                  <p class="val-normativa">Documento digital válido según normativas vigentes.</p>
                </div>
              </div>
              
              <div class="stamp-box">
                <div class="signature-line"></div>
                <p class="doc-name">${doctorNombre}</p>
                <p class="doc-lic">${matriculaTexto}</p>
              </div>
            </div>
            
            <div class="legal-note">
              Esta receta es válida por 30 días a partir de su fecha de emisión.
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }).catch(() => setPrescripcionModuleError("Error al obtener detalle de la prescripcion."));
  }

  async function handleEnviarEmail() {
    if (!selectedTurno) return;
    setEmailError(null);
    setEmailSuccess(null);

    var pid = encuentroPacienteId ?? selectedTurno.pacienteId ?? null;
    if (!pid && selectedTurno.documento && selectedTurno.documento !== VALOR_GUION) {
      try {
        const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) pid = candidatos[0].id;
      } catch {}
    }
    if (!pid) { setEmailError("No se pudo identificar el paciente."); return; }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const recetasHoy = prescripcionModuleRecetas.filter(r => r.creadoEn.slice(0, 10) === todayStr);
    if (recetasHoy.length === 0) { setEmailError("No hay recetas prescriptas hoy para enviar."); return; }

    setEmailModalPacienteId(pid);
    setEmailModalRecetaIds(recetasHoy.map(r => r.recetaId));
    setShowEmailModal(true);
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
      const result = await buscarMedicamentos(query.trim(), undefined, undefined, medicamentoSoloGenerico, page, 20);
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
  }, [medicamentoSearchQuery, showMedicamentoModal, medicamentoSoloGenerico]);
  useEffect(() => { window.localStorage.setItem(EFECTOR_ID_STORAGE_KEY, efectorId); }, [efectorId]);

  useEffect(() => {
    if (!selectedTurnoId) {
      setEncuentroEstado("SIN_ENCUENTRO"); setEncuentroPacienteId(null); setEncuentroCreadoEn(null); setEvolucionesAmbulatorias([]); setProblemasCronicos([]);
      setPrescripcionModuleRecetas([]); setRecetasDetalle({});
      setShowEvolucionesListado(false); setShowAgregarEvolucionModal(false); return;
    }
    let active = true;
    void (async () => {
      try {
        const response = await obtenerEncuentroTurno(selectedTurnoId);
        const [evoluciones, problemas, recetas] = await Promise.all([
          obtenerEvolucionesAmbulatoriasPaciente(response.pacienteId, 20),
          obtenerProblemasCronicosPaciente(response.pacienteId),
          listarRecetasPaciente(response.pacienteId)
        ]);
        if (active) {
          setEncuentroEstado(response.estado); setEncuentroPacienteId(response.pacienteId); setEncuentroCreadoEn(response.creadoEn);
          setEvolucionesAmbulatorias(evoluciones);
          setPrescripcionModuleRecetas(recetas);
          const activas = recetas.filter(r => r.estado === ESTADO_ACTIVA);
          if (activas.length > 0) {
            const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
            const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
            for (const result of results) {
              if (result.status === "fulfilled") {
                detalles[result.value.recetaId] = result.value;
              }
            }
            if (Object.keys(detalles).length > 0) setRecetasDetalle(detalles);
          }
          setProblemasCronicos(problemas.map(p => ({
            id: p.problemaCronicoId,
            fechaHora: p.fechaInicio,
            titulo: p.descripcion,
            detalle: `${p.categoria} | ${p.fechaInicio}`,
            evolucionesAsociadas: p.evolucionesAsociadas
          })));
        }
      } catch {
        if (active) {
          setEncuentroEstado("SIN_ENCUENTRO"); setEncuentroPacienteId(null); setEvolucionesAmbulatorias([]); setProblemasCronicos([]);
          const fallbackPid = selectedTurno?.pacienteId ?? null;
          if (fallbackPid) {
            try {
              const recetas = await listarRecetasPaciente(fallbackPid);
              setPrescripcionModuleRecetas(recetas);
              const activas = recetas.filter(r => r.estado === ESTADO_ACTIVA);
              if (activas.length > 0) {
                const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
                const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
                for (const result of results) {
                  if (result.status === "fulfilled") {
                    detalles[result.value.recetaId] = result.value;
                  }
                }
                if (Object.keys(detalles).length > 0) setRecetasDetalle(detalles);
              }
            } catch {}
          }
        }
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
  const opcionesPracticasIzquierda = practicasFiltradasIzquierda.map((p: PracticaOption) => ({ id: p.nombre, nombre: p.nombre, codigoClinico: p.codigoClinico }));
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
    serviciosDisponibles, draftSolicitudScopeId, solicitudScopeId,
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
    abrirBuscarMedicamento, medicamentoSearchQuery, setMedicamentoSearchQuery, medicamentoSearchTimer,
    medicamentoResultados, medicamentoLoading, medicamentoTotalCount,
    medicamentoPagina, setMedicamentoPagina, medicamentoError,
    medicamentoSoloGenerico, setMedicamentoSoloGenerico,
    ejecutarBusquedaMedicamento, medicamentoSeleccionado, setMedicamentoSeleccionado,
    seleccionarMedicamento, showPrescripcionFormModal, setShowPrescripcionFormModal,
    prescripcionDosis, setPrescripcionDosis, prescripcionFrecuencia, setPrescripcionFrecuencia,
    prescripcionDuracion, setPrescripcionDuracion, prescripcionIndicacion, setPrescripcionIndicacion,
    prescripcionVia, setPrescripcionVia,
    prescripcionGuardando, prescripcionError, prescripcionExitosa, guardarPrescripcion,
    showPrescripcionModule, setShowPrescripcionModule,
    prescripcionModuleRecetas, recetasDetalle, prescripcionModuleLoading, prescripcionModuleError,
    prescripcionModuleAnulando, cargarRecetasPaciente, handleAnularReceta, imprimirReceta,
    showEmailModal, setShowEmailModal, emailError, setEmailError, emailSuccess, setEmailSuccess, emailModalPacienteId, emailModalRecetaIds, handleEnviarEmail
  } as const;
}
