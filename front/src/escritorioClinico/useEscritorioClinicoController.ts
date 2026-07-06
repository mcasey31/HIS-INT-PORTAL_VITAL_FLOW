import { useEffect, useMemo, useState } from "react";
import { obtenerEvolucionesAmbulatoriasPaciente, obtenerProblemasCronicosPaciente, listarRecetasPaciente, obtenerRecetaDigital, buscarPersonaPorDocumento } from "./escritorioClinicoApi";
import { obtenerEncuentroTurno } from "../admision/admisionApi";
import type { EvolucionAmbulatoriaResponse, RecetaDigitalDetalleResponse, RecetaDigitalResumenResponse, RegistroPanoramica } from "./escritorioClinicoTypes";
import { UseEscritorioClinicoOptions, ESTADO_ACTIVA, DEFAULT_DOCUMENT_TYPE, ROL_ADMINISTRADOR, ROL_MEDICO, ESTADO_EN_ATENCION, ESTADO_EN_SALA_ESPERA, formatProfesionalDisplayName, normalizeText, formatAgendaDate, shiftIsoDate, estadoLabel, formatLlegada, estadoEsLlamable, formatDateTime, canIntegrarRecetario, canIntegrarSistemasClinicos } from "./escritorioClinicoTypes";
import { useAuth } from "../auth/AuthContext";
import { useTurnosAgenda } from "./hooks/useTurnosAgenda";
import { useEvoluciones } from "./hooks/useEvoluciones";
import { useSolicitudEstudios } from "./hooks/useSolicitudEstudios";
import { useBuscarPaciente } from "./hooks/useBuscarPaciente";
import { usePrescripcion } from "./hooks/usePrescripcion";

export function useEscritorioClinicoController({ onCancelSeleccionServicio }: UseEscritorioClinicoOptions = {}) {
  const { roles, username } = useAuth();
  const profesionalActual = useMemo(() => formatProfesionalDisplayName(username), [username]);
  const isAdminUsuario = roles.some(role => normalizeText(role) === ROL_ADMINISTRADOR);
  const isMedicoUsuario = roles.some(role => normalizeText(role) === ROL_MEDICO);

  const a = useTurnosAgenda(isAdminUsuario, isMedicoUsuario, profesionalActual, onCancelSeleccionServicio);

  const [encuentroEstado, setEncuentroEstado] = useState<string>("SIN_ENCUENTRO");
  const [encuentroPacienteId, setEncuentroPacienteId] = useState<string | null>(null);
  const [encuentroCreadoEn, setEncuentroCreadoEn] = useState<string | null>(null);
  const [evolucionesAmbulatorias, setEvolucionesAmbulatorias] = useState<EvolucionAmbulatoriaResponse[]>([]);
  const [problemasCronicos, setProblemasCronicos] = useState<RegistroPanoramica[]>([]);
  const [prescripcionModuleRecetas, setPrescripcionModuleRecetas] = useState<RecetaDigitalResumenResponse[]>([]);
  const [recetasDetalle, setRecetasDetalle] = useState<Record<string, RecetaDigitalDetalleResponse>>({});

  const [showAsignarProblemaModal, setShowAsignarProblemaModal] = useState(false);
  const [problemaNuevaDescripcion, setProblemaNuevaDescripcion] = useState("");
  const [problemaNuevaCategoria, setProblemaNuevaCategoria] = useState("crónico");
  const [problemaNuevaFechaInicio, setProblemaNuevaFechaInicio] = useState("");
  const [problemaFormError, setProblemaFormError] = useState<string | null>(null);
  const [showSistemasClinicosModal, setShowSistemasClinicosModal] = useState(false);

  const s = useSolicitudEstudios(a.selectedTurno, a.turnos, a.puedeSolicitarEstudios, profesionalActual, a.lugarAtencionNombre, a.servicioActualNombre, a.setError);
  const p = usePrescripcion(a.selectedTurno, profesionalActual, encuentroPacienteId, setEncuentroPacienteId, prescripcionModuleRecetas, setPrescripcionModuleRecetas, recetasDetalle, setRecetasDetalle, buscarPersonaPorDocumento, DEFAULT_DOCUMENT_TYPE, a.setError);
  const e = useEvoluciones(a.selectedTurno, profesionalActual, encuentroPacienteId, setEncuentroPacienteId, evolucionesAmbulatorias, setEvolucionesAmbulatorias, problemasCronicos, setProblemasCronicos, s.solicitudesEstudiosPorTurno, s.setSolicitudesEstudiosPorTurno, s.observacionesPorTurno, s.setObservacionesPorTurno, a.setWorking, s.mostrarToastSolicitud);
  const b = useBuscarPaciente(a.turnos, (turnoId: string) => { b.setShowBuscarPacienteModal(false); a.setModoIngreso("plantilla"); a.setOrigenPanoramica("historia"); a.setSelectedTurnoId(turnoId); a.setError(null); }, (nombre: string) => { a.setAgendaMensaje(`Paciente encontrado: ${nombre}. No tiene turno en la agenda actual.`); });

  useEffect(() => {
    if (!a.selectedTurnoId) {
      setEncuentroEstado("SIN_ENCUENTRO"); setEncuentroPacienteId(null); setEncuentroCreadoEn(null);
      setEvolucionesAmbulatorias([]); setProblemasCronicos([]);
      setPrescripcionModuleRecetas([]); setRecetasDetalle({});
      e.limpiarDatosEvolucion();
      return;
    }
    let active = true;
    const turnoId = a.selectedTurnoId;
    void (async () => {
      try {
        const response = await obtenerEncuentroTurno(turnoId);
        const [evolucionesData, problemas, recetas] = await Promise.all([
          obtenerEvolucionesAmbulatoriasPaciente(response.pacienteId, 20),
          obtenerProblemasCronicosPaciente(response.pacienteId),
          listarRecetasPaciente(response.pacienteId)
        ]);
        if (active) {
          setEncuentroEstado(response.estado); setEncuentroPacienteId(response.pacienteId); setEncuentroCreadoEn(response.creadoEn);
          setEvolucionesAmbulatorias(evolucionesData);
          setPrescripcionModuleRecetas(recetas);
          const activas = recetas.filter(r => r.estado === ESTADO_ACTIVA);
          if (activas.length > 0) {
            const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
            const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
            for (const result of results) {
              if (result.status === "fulfilled") detalles[result.value.recetaId] = result.value;
            }
            if (Object.keys(detalles).length > 0) setRecetasDetalle(detalles);
          }
          setProblemasCronicos(problemas.map(p => ({ id: p.problemaCronicoId, fechaHora: p.fechaInicio, titulo: p.descripcion, detalle: `${p.categoria} | ${p.fechaInicio}`, evolucionesAsociadas: p.evolucionesAsociadas })));
        }
      } catch {
        if (active) {
          setEncuentroEstado("SIN_ENCUENTRO"); setEncuentroPacienteId(null);
          setEvolucionesAmbulatorias([]); setProblemasCronicos([]);
          const fallbackPid = a.selectedTurno?.pacienteId ?? null;
          if (fallbackPid) {
            try {
              const recetas = await listarRecetasPaciente(fallbackPid);
              setPrescripcionModuleRecetas(recetas);
              const activas = recetas.filter(r => r.estado === ESTADO_ACTIVA);
              if (activas.length > 0) {
                const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
                const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
                for (const result of results) {
                  if (result.status === "fulfilled") detalles[result.value.recetaId] = result.value;
                }
                if (Object.keys(detalles).length > 0) setRecetasDetalle(detalles);
              }
            } catch {}
          }
        }
      }
      if (active) void s.loadSolicitudesEstudios(turnoId);
    })();
    return () => { active = false; };
  }, [a.selectedTurnoId]);

  useEffect(() => {
    if (!s.solicitudToast) return;
    const timer = window.setTimeout(() => s.setSolicitudToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [s.solicitudToast]);

  function abrirEvoluciones() {
    if (!a.selectedTurno) { a.setError("Debe seleccionar un paciente para acceder a evoluciones."); return; }
    if (!a.puedeAbrirEvoluciones) { a.setError("Evoluciones esta deshabilitado en modo visualizacion HC."); return; }
    e.setShowEvolucionesListado(true); a.setError(null);
  }

  function abrirAgregarEvolucion() {
    if (!a.selectedTurno) { a.setError("Debe seleccionar un paciente para agregar una evolucion."); return; }
    e.abrirAgregarEvolucion();
  }

  function abrirSolicitudEstudiosDesdeEvolucion() {
    if (!a.selectedTurno) return;
    if (!e.canSolicitarEstudiosDesdeEvolucion) { e.setEvolucionFormError("Solicitar estudios se habilita con texto y al menos un problema cargado."); return; }
    s.abrirSolicitudEstudiosConScope(`draft-evol-${a.selectedTurno.id}`, "evolucion");
  }

  const solicitudesScopeActual = s.solicitudScopeId ?? "";
  const showLlamarMegafonoModal = a.pendingLlamadoTurnoId !== null;
  const showVistaRapidaModal = a.turnoVistaRapidaId !== null;

  const opcionesPracticasIzquierda = s.practicasFiltradasIzquierda;
  const opcionesPracticasDerecha = s.practicasFechaActiva.map((practica: string) => ({ id: practica, nombre: practica }));

  function handleAsignarProblemaWrapper() {
    return e.handleAsignarProblema(problemaNuevaDescripcion, problemaNuevaCategoria, problemaNuevaFechaInicio, setProblemaFormError);
  }

  function confirmarSalidaEncuentroWrapper() {
    return a.confirmarSalidaEncuentro(e.accionSalidaEncuentro, e.cumpleRegistroMinimoSalidaEncuentro);
  }

  function abrirSistemasClinicos() {
    if (!a.selectedTurno || !a.selectedTurno.pacienteId) {
      a.setError("Debe seleccionar un paciente para acceder a sistemas clinicos.");
      return;
    }
    setShowSistemasClinicosModal(true);
  }

  async function confirmarAccederSistemasClinicos() {
    setShowSistemasClinicosModal(false);
    const pid = encuentroPacienteId ?? a.selectedTurno?.pacienteId ?? null;
    if (!pid) return;
    if (!canIntegrarSistemasClinicos) {
      window.open(`${window.location.origin}/#/ficha-paciente?id=${pid}`, "_blank");
      return;
    }
    try {
      const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, (a.selectedTurno?.documento ?? "").replace(/[^0-9]/g, ""));
      if (candidatos.length === 0) { a.setError("No se encontro el paciente en el sistema de origen."); return; }
      window.open(`/his/ficha-paciente?id=${candidatos[0].id}`, "_blank");
    } catch {
      a.setError("Error al buscar paciente en sistemas clinicos.");
    }
  }

  return {
    isAdminUsuario, isMedicoUsuario,
    PROFESIONAL_ACTUAL: profesionalActual,
    ESTADO_EN_ATENCION, ESTADO_EN_SALA_ESPERA,
    formatAgendaDate, shiftIsoDate, estadoLabel, formatLlegada, estadoEsLlamable,
    formatDateTime, canIntegrarRecetario, canIntegrarSistemasClinicos,
    profesionalActual,

    ...a, ...s, ...p, ...e, ...b,

    encuentroEstado, setEncuentroEstado,
    encuentroPacienteId, encuentroCreadoEn, setEncuentroCreadoEn,
    evolucionesAmbulatorias, setEvolucionesAmbulatorias,

    showLlamarMegafonoModal,
    setLlamarMegafonoModal: (open: boolean) => { if (!open) a.setPendingLlamadoTurnoId(null); },
    showVistaRapidaModal,
    setVistaRapidaModal: (open: boolean) => { if (!open) a.setTurnoVistaRapidaId(null); },
    showSolicitarEstudiosModal: s.showSolicitudEstudiosModal,
    setShowSolicitarEstudiosModal: s.setShowSolicitudEstudiosModal,
    isEstudioDesdeEvolucion: s.solicitudOrigen === "evolucion",
    searchQueryPracticasIzquierda: s.busquedaPracticas,
    setSearchQueryPracticasIzquierda: s.setBusquedaPracticas,
    searchQueryPracticasDerecha: s.busquedaPracticasDerecha,
    setSearchQueryPracticasDerecha: s.setBusquedaPracticasDerecha,
    selectedPracticasIzquierda: s.practicasSeleccionadasIzquierda,
    setSelectedPracticasIzquierda: s.setPracticasSeleccionadasIzquierda,
    selectedPracticasDerecha: s.practicasSeleccionadasDerecha,
    setSelectedPracticasDerecha: s.setPracticasSeleccionadasDerecha,
    solicitudesScopeActual,
    solicitudesPorScope: { [solicitudesScopeActual]: s.observacionesFechaActiva },
    observacionPracticaModalData: s.practicaObservacionActiva ? { id: s.practicaObservacionActiva, nombre: s.practicaObservacionActiva } : null,
    setObservacionPracticaModalData: (value: { id: string; nombre: string } | null) => { s.setPracticaObservacionActiva(value?.id ?? null); },
    observacionPracticaText: s.observacionDraft,
    setObservacionPracticaText: s.setObservacionDraft,
    salidaEncuentroError: a.error,

    abrirEvoluciones, abrirAgregarEvolucion,
    abrirSolicitudEstudiosDesdeEvolucion,

    prescripcionError: p.prescripcionModuleError,
    showAsignarProblemaModal, setShowAsignarProblemaModal,
    problemaNuevaDescripcion, setProblemaNuevaDescripcion,
    problemaNuevaCategoria, setProblemaNuevaCategoria,
    problemaNuevaFechaInicio, setProblemaNuevaFechaInicio,
    problemaFormError, setProblemaFormError,
    handleAsignarProblema: handleAsignarProblemaWrapper,
    confirmarSalidaEncuentro: confirmarSalidaEncuentroWrapper,
    abrirSistemasClinicos,
    showSistemasClinicosModal, setShowSistemasClinicosModal,
    confirmarAccederSistemasClinicos,
    opcionesPracticasIzquierda, opcionesPracticasDerecha,
  };
}
