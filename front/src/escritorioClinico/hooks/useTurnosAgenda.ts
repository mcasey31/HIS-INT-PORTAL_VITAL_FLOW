import { useEffect, useMemo, useRef, useState } from "react";
import { actualizarEstadoTurno, buscarTurnosAdmision, cerrarEncuentroTurno, getSelectoresAdmision } from "../../admision/admisionApi";
import type { TurnoAdmision, SelectoresAdmision } from "../../admision/admisionTypes";
import { VALOR_GUION, TIPO_EFECTOR_CONSULTORIO, todayIsoDate, normalizeText, estadoEsLlamable, parseTurnoDateTime, EFECTOR_ID_STORAGE_KEY } from "../escritorioClinicoTypes";
import { ESTADO_EN_ATENCION, ESTADO_EN_OBSERVACION, ESTADO_EN_SALA_ESPERA, ESTADO_ATENDIDO, ESTADO_NO_ATENDIDO } from "../escritorioClinicoTypes";

export function useTurnosAgenda(
  isAdminUsuario: boolean,
  isMedicoUsuario: boolean,
  profesionalActual: string,
  onCancelSeleccionServicio?: () => void,
) {
  const [selectores, setSelectores] = useState<SelectoresAdmision | null>(null);
  const [turnos, setTurnos] = useState<TurnoAdmision[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceSelectionError, setServiceSelectionError] = useState<string | null>(null);
  const [agendaMensaje, setAgendaMensaje] = useState<string | null>(null);
  const [showSinAgendaModal, setShowSinAgendaModal] = useState(false);
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
  const [modoIngreso, setModoIngreso] = useState<"plantilla" | "megafono">("plantilla");
  const [origenPanoramica, setOrigenPanoramica] = useState<"ver" | "historia" | "megafono">("ver");
  const [contadorLlamados, setContadorLlamados] = useState<Record<string, number>>({});
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

  const canLlamar = selectedTurno && selectedTurno.llegada ? estadoEsLlamable(selectedTurno.estado) : false;
  const pacienteEnAtencion = selectedTurno?.estado === ESTADO_EN_ATENCION;
  const esVisualizacionHC = origenPanoramica === "historia" && !pacienteEnAtencion;
  const puedeAbrirEvoluciones = Boolean(selectedTurno && selectedTurno.llegada && !esVisualizacionHC);
  const puedeSolicitarEstudios = Boolean(selectedTurno && selectedTurno.llegada && !esVisualizacionHC);
  const esDiaActual = fechaAgenda === todayIsoDate();

  const serviciosDisponibles = selectores?.servicios ?? [];

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

  useEffect(() => {
    void loadSelectores();
  }, [isAdminUsuario, isMedicoUsuario]);

  useEffect(() => {
    if (!selectores || !servicioSeleccionado || !servicioId) return;
    void loadTurnos();
  }, [selectores, servicioSeleccionado, servicioId, efectorId, estadoFiltro, fechaAgenda]);

  useEffect(() => { lugarAtencionPreguntadoRef.current = false; }, [fechaAgenda]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(EFECTOR_ID_STORAGE_KEY, efectorId);
  }, [efectorId]);

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

  async function confirmarSalidaEncuentro(accionSalida: string, cumpleRegistroMinimo = false) {
    if (!selectedTurno || !accionSalida) return;
    setWorking(true); setError(null);
    try {
      if (accionSalida === "CERRAR_ENCUENTRO") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) { setError("Cerrar encuentro requiere paciente en atencion."); setWorking(false); return; }
        if (!cumpleRegistroMinimo) { setError("Debe registrar texto y al menos una etiqueta de problemas en la evolucion para continuar."); setWorking(false); return; }
        const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_ATENDIDO, motivo: "SALIDA_DESDE_ENCUENTRO" });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se cambio el estado del turno a Atendido");
        setSelectedTurnoId(null);
      }
      if (accionSalida === "ENVIAR_OBSERVACION") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) { setError("Enviar a observacion requiere paciente en atencion."); setWorking(false); return; }
        if (!cumpleRegistroMinimo) { setError("Debe registrar texto y al menos una etiqueta de problemas en la evolucion para continuar."); setWorking(false); return; }
        const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_EN_OBSERVACION, motivo: "SALIDA_DESDE_ENCUENTRO" });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se envio el paciente a observacion");
      }
      if (accionSalida === "ENVIAR_LISTA_ESPERA") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION) { setError("Enviar a lista de espera requiere paciente en atencion."); setWorking(false); return; }
        const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_EN_SALA_ESPERA, motivo: "SALIDA_DESDE_ENCUENTRO" });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se envio el paciente a lista de espera");
      }
      if (accionSalida === "NO_ATENDIDO") {
        if (selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA) { setError("No atendido requiere paciente en atencion o en sala de espera."); setWorking(false); return; }
        const response = await actualizarEstadoTurno(selectedTurno.id, { estado: ESTADO_NO_ATENDIDO, motivo: "SALIDA_DESDE_ENCUENTRO" });
        updateTurnoState(selectedTurno.id, response.estado);
        setAgendaMensaje("Se cambio el estado del turno a No atendido");
        setSelectedTurnoId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la accion de salida.");
    } finally { setWorking(false); }
  }

  return {
    selectores, setSelectores,
    turnos, setTurnos,
    loading, setLoading,
    working, setWorking,
    error, setError,
    serviceSelectionError, setServiceSelectionError,
    agendaMensaje, setAgendaMensaje,
    showSinAgendaModal, setShowSinAgendaModal,
    fechaAgenda, setFechaAgenda,
    servicioId, setServicioId,
    servicioPendienteId, setServicioPendienteId,
    servicioSeleccionado, setServicioSeleccionado,
    showServicioModal, setShowServicioModal,
    showLugarAtencionModal, setShowLugarAtencionModal,
    lugarAtencionPendienteId, setLugarAtencionPendienteId,
    lugarAtencionError, setLugarAtencionError,
    efectorId, setEfectorId,
    estadoFiltro, setEstadoFiltro,
    query, setQuery,
    selectedTurnoId, setSelectedTurnoId,
    turnoVistaRapidaId, setTurnoVistaRapidaId,
    pendingLlamadoTurnoId, setPendingLlamadoTurnoId,
    modoIngreso, setModoIngreso,
    origenPanoramica, setOrigenPanoramica,
    contadorLlamados, setContadorLlamados,
    selectedTurno, turnoVistaRapida, pendingLlamadoTurno,
    pacienteEnAtencionConflicto,
    turnosFiltrados, canLlamar, pacienteEnAtencion,
    esVisualizacionHC, puedeAbrirEvoluciones, puedeSolicitarEstudios,
    esDiaActual, serviciosDisponibles, efectoresDisponibles,
    servicioActualNombre, lugarAtencionNombre, horarioConfigurado,
    loadSelectores, confirmarServicioIngreso,
    confirmarCambioLugarAtencion, cancelarServicioIngreso,
    loadTurnos, updateTurnoState, llamarPaciente,
    abrirHistoriaClinica, verTurno, abrirDesdeMegafono,
    confirmarLlamadoMegafono, confirmarSalidaEncuentro,
  };
}
