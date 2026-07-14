import { FormEvent, useEffect, useMemo, useState } from "react";
import { getTiposDocumento } from "../shared/catalogosApi";
import { actualizarEstadoTurno } from "../admision/admisionApi";
import type {
  TipoDocumento, SelectoresDisponibilidad, PacienteIdentificado, FinanciadorPlan,
  DisponibilidadSlot, TurnoPaciente,
  BuscarDisponibilidadRequest, AsignarTurnoRequest, AsignarSobreturnoRequest, AsignarTurnoResponse,
} from "./turnosTypes";
import { SELECTORES_VACIOS, CATALOGO_FINANCIADORES } from "./turnosTypes";
import {
  identificarPacientePorDocumento, getSelectoresDisponibilidad,
  getTurnosPaciente, buscarDisponibilidadHoraria,
  asignarTurno, asignarSobreturno, guardarFinanciadorPaciente,
  finalizarVigenciaFinanciadorPaciente,
} from "./turnosApi";

export function useTurnosController() {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [selectores, setSelectores] = useState<SelectoresDisponibilidad>(SELECTORES_VACIOS);
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [paciente, setPaciente] = useState<PacienteIdentificado | null>(null);
  const [financiadoresPaciente, setFinanciadoresPaciente] = useState<FinanciadorPlan[]>([]);
  const [financiadorPlanId, setFinanciadorPlanId] = useState("");
  const [resultadoIdentificacion, setResultadoIdentificacion] = useState<"idle" | "single" | "none" | "multiple">("idle");
  const [loadingIdentificacion, setLoadingIdentificacion] = useState(false);
  const [centrosSeleccionados, setCentrosSeleccionados] = useState<string[]>([]);
  const [servicioId, setServicioId] = useState("");
  const [practicaId, setPracticaId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
  const [asignandoTurno, setAsignandoTurno] = useState(false);
  const [slots, setSlots] = useState<DisponibilidadSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [confirmAsignacionModalOpen, setConfirmAsignacionModalOpen] = useState(false);
  const [contactoEmailOriginal, setContactoEmailOriginal] = useState("");
  const [contactoTelefonoOriginal, setContactoTelefonoOriginal] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");
  const [contactoTelefono, setContactoTelefono] = useState("");
  const [guardarContactoEnPerfil, setGuardarContactoEnPerfil] = useState(false);
  const [warningAsignacion, setWarningAsignacion] = useState<string | null>(null);
  const [asignacionExitosaModalOpen, setAsignacionExitosaModalOpen] = useState(false);
  const [asignacionExitosaMensaje, setAsignacionExitosaMensaje] = useState("Turno asignado.");
  const [sobreturnoModalOpen, setSobreturnoModalOpen] = useState(false);
  const [slotSobreturnoId, setSlotSobreturnoId] = useState<string | null>(null);
  const [horaSobreturno, setHoraSobreturno] = useState("");
  const [sobreturnoError, setSobreturnoError] = useState<string | null>(null);
  const [verHistorialTurnos, setVerHistorialTurnos] = useState(false);
  const [turnoACancelarId, setTurnoACancelarId] = useState<string | null>(null);
  const [cancelandoTurnoId, setCelandoTurnoId] = useState<string | null>(null);
  const [cancelacionExitosa, setCancelacionExitosa] = useState<string | null>(null);
  const [loadingTurnosPaciente, setLoadingTurnosPaciente] = useState(false);
  const [turnosPaciente, setTurnosPaciente] = useState<TurnoPaciente[]>([]);
  const [totalTurnosPaciente, setTotalTurnosPaciente] = useState(0);
  const [financiadorModalOpen, setFinanciadorModalOpen] = useState(false);
  const [financiadorEditandoId, setFinanciadorEditandoId] = useState<string | null>(null);
  const [financiadorFormId, setFinanciadorFormId] = useState("");
  const [planFormId, setPlanFormId] = useState("");
  const [numeroAfiliadoForm, setNumeroAfiliadoForm] = useState("");
  const [financiadorModalError, setFinanciadorModalError] = useState<string | null>(null);
  const [financiadorModalInfo, setFinanciadorModalInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const [tiposResult, selectoresResult] = await Promise.allSettled([getTiposDocumento(), getSelectoresDisponibilidad()]);
      if (tiposResult.status === "fulfilled") {
        const tipos = tiposResult.value;
        setTiposDocumento(tipos);
        if (tipos.length > 0 && !tipos.some(item => item.codigo === tipoDocumento)) setTipoDocumento(tipos[0].codigo);
      }
      if (selectoresResult.status === "fulfilled") setSelectores(selectoresResult.value);
      if (tiposResult.status === "rejected" && selectoresResult.status === "rejected") {
        const tiposError = tiposResult.reason instanceof Error ? tiposResult.reason.message : "tipos-documento";
        const selectoresError = selectoresResult.reason instanceof Error ? selectoresResult.reason.message : "selectores";
        setError(`No se pudo inicializar modulo de turnos: ${tiposError}; ${selectoresError}`);
      }
    };
    void run();
  }, [tipoDocumento]);

  const centrosDisponibles = selectores.centros;
  const serviciosDisponibles = useMemo(() => {
    if (centrosSeleccionados.length === 0) return selectores.servicios;
    return selectores.servicios.filter(s => s.centroIds.some(id => centrosSeleccionados.includes(id)));
  }, [selectores.servicios, centrosSeleccionados]);
  const practicasDisponibles = useMemo(() => {
    return selectores.practicas.filter(p => {
      const ms = servicioId ? p.servicioId === servicioId : true;
      const mc = centrosSeleccionados.length === 0 ? true : p.centroIds.some(id => centrosSeleccionados.includes(id));
      return ms && mc;
    });
  }, [selectores.practicas, servicioId, centrosSeleccionados]);
  const profesionalesDisponibles = useMemo(() => {
    return selectores.profesionales.filter(p => {
      const mc = centrosSeleccionados.length === 0 ? true : p.centroIds.some(id => centrosSeleccionados.includes(id));
      const ms = servicioId ? p.servicioIds.includes(servicioId) : true;
      const mp = practicaId ? p.practicaIds.includes(practicaId) : true;
      return mc && ms && mp;
    });
  }, [selectores.profesionales, centrosSeleccionados, servicioId, practicaId]);

  useEffect(() => { if (servicioId && !serviciosDisponibles.some(i => i.id === servicioId)) setServicioId(""); }, [servicioId, serviciosDisponibles]);
  useEffect(() => { if (practicaId && !practicasDisponibles.some(i => i.id === practicaId)) setPracticaId(""); }, [practicaId, practicasDisponibles]);
  useEffect(() => { if (profesionalId && !profesionalesDisponibles.some(i => i.id === profesionalId)) setProfesionalId(""); }, [profesionalId, profesionalesDisponibles]);
  useEffect(() => {
    if (!practicaId) return;
    const practica = selectores.practicas.find(i => i.id === practicaId);
    if (practica && servicioId !== practica.servicioId) setServicioId(practica.servicioId);
  }, [practicaId, servicioId, selectores.practicas]);
  useEffect(() => {
    setSlots([]); setSelectedSlotId(null); setConfirmAsignacionModalOpen(false);
  }, [centrosSeleccionados, servicioId, practicaId, profesionalId, financiadorPlanId]);

  const financiadoresVigentes = useMemo(() => {
    if (!paciente) return [];
    return financiadoresPaciente.filter(i => i.vigente);
  }, [paciente, financiadoresPaciente]);
  const financiadorCatalogoSeleccionado = useMemo(() => CATALOGO_FINANCIADORES.find(i => i.id === financiadorFormId) ?? null, [financiadorFormId]);
  const planesDisponiblesForm = financiadorCatalogoSeleccionado?.planes ?? [];
  const esEdicionFinanciador = financiadorEditandoId !== null;
  const esCombinacionDuplicada = useMemo(() => {
    if (!financiadorFormId || !planFormId || !numeroAfiliadoForm.trim()) return false;
    const an = numeroAfiliadoForm.trim().toUpperCase();
    return financiadoresVigentes.some(i => {
      if (esEdicionFinanciador && i.id === financiadorEditandoId) return false;
      return (i.financiadorId ?? "") === financiadorFormId && (i.planId ?? "") === planFormId && (i.numeroAfiliado ?? "").trim().toUpperCase() === an;
    });
  }, [esEdicionFinanciador, financiadorEditandoId, financiadorFormId, financiadoresVigentes, numeroAfiliadoForm, planFormId]);
  const puedeGuardarFinanciador = financiadorFormId.trim().length > 0 && planFormId.trim().length > 0 && numeroAfiliadoForm.trim().length > 0 && !esCombinacionDuplicada;
  const puedeBuscarDisponibilidad = Boolean(paciente) && financiadorPlanId.trim().length > 0 && centrosSeleccionados.length > 0 && servicioId.trim().length > 0 && practicaId.trim().length > 0;
  const selectedSlot = useMemo(() => selectedSlotId ? slots.find(i => i.id === selectedSlotId) ?? null : null, [slots, selectedSlotId]);
  const selectedSlotSobreturno = useMemo(() => slotSobreturnoId ? slots.find(i => i.id === slotSobreturnoId) ?? null : null, [slots, slotSobreturnoId]);
  const contactoEditado = contactoEmail.trim() !== contactoEmailOriginal.trim() || contactoTelefono.trim() !== contactoTelefonoOriginal.trim();
  const emailValido = contactoEmail.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoEmail.trim());
  const telefonoNormalizado = contactoTelefono.replace(/\D/g, "").trim();
  const telefonoValido = telefonoNormalizado.length === 0 || /^\d{6,15}$/.test(telefonoNormalizado);
  const puedeConfirmarAsignacion = Boolean(selectedSlot && paciente) && emailValido && telefonoValido;
  const financiadorSeleccionado = useMemo(() => financiadoresVigentes.find(i => i.id === financiadorPlanId) ?? null, [financiadoresVigentes, financiadorPlanId]);
  const copagoEstimado = useMemo(() => {
    if (!financiadorSeleccionado) return "-";
    return financiadorSeleccionado.financiador.toUpperCase().includes("PRIVADO") ? "$ 4.500" : "$ 0";
  }, [financiadorSeleccionado]);

  const onConsultarPaciente = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingIdentificacion(true); setError(null); setInfo(null);
    try {
      const candidatos = await identificarPacientePorDocumento(tipoDocumento, numeroDocumento.trim());
      if (candidatos.length === 1) {
        const c = candidatos[0];
        setPaciente(c); setFinanciadoresPaciente(c.financiadores); setResultadoIdentificacion("single");
        const pf = c.financiadores.find(i => i.vigente);
        setFinanciadorPlanId(pf ? pf.id : ""); setInfo(`Paciente identificado: ${c.apellidosNombres}.`);
        return;
      }
      setPaciente(null); setFinanciadoresPaciente([]); setFinanciadorPlanId(""); setSlots([]); setSelectedSlotId(null); setWarningAsignacion(null);
      setResultadoIdentificacion(candidatos.length === 0 ? "none" : "multiple");
      setInfo(candidatos.length === 0
        ? "No se encontro una persona candidata. Continua por Identificacion de personas para identificar paciente."
        : "Se encontraron multiples personas. Continua por Identificacion de personas para identificar paciente.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo consultar paciente.";
      setError(message);
    } finally { setLoadingIdentificacion(false); }
  };

  const onToggleCentro = (centroId: string) => setCentrosSeleccionados(prev => prev.includes(centroId) ? prev.filter(id => id !== centroId) : [...prev, centroId]);

  const onBuscarDisponibilidad = async () => {
    if (!paciente || !puedeBuscarDisponibilidad) return;
    setLoadingDisponibilidad(true); setError(null); setWarningAsignacion(null);
    const request: BuscarDisponibilidadRequest = { pacienteId: paciente.id, financiadorPlanId, centroIds: centrosSeleccionados, servicioId, practicaId, profesionalId: profesionalId || undefined };
    try {
      const result = await buscarDisponibilidadHoraria(request);
      setSlots(result); setSelectedSlotId(null);
      setInfo(result.length === 0 ? "No se encontraron horarios disponibles para los filtros aplicados." : `Se encontraron ${result.length} horarios para los filtros seleccionados.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo buscar disponibilidad.");
    } finally { setLoadingDisponibilidad(false); }
  };

  const resetFinanciadorForm = () => { setFinanciadorEditandoId(null); setFinanciadorFormId(""); setPlanFormId(""); setNumeroAfiliadoForm(""); setFinanciadorModalError(null); };

  const onAbrirModalFinanciador = () => {
    if (!paciente) return;
    setFinanciadorModalOpen(true); setFinanciadorModalInfo(null); setFinanciadorModalError(null); resetFinanciadorForm();
  };
  const onCerrarModalFinanciador = () => { setFinanciadorModalOpen(false); setFinanciadorModalInfo(null); resetFinanciadorForm(); };

  const onEditarFinanciador = (financiador: FinanciadorPlan) => {
    if (financiador.financiador.toUpperCase().includes("PRIVADO")) { setFinanciadorModalError("El financiador Privado/Particular no puede editarse."); return; }
    setFinanciadorEditandoId(financiador.id); setFinanciadorFormId(financiador.financiadorId ?? ""); setPlanFormId(financiador.planId ?? ""); setNumeroAfiliadoForm(financiador.numeroAfiliado ?? "");
    setFinanciadorModalError(null); setFinanciadorModalInfo(`Editando ${financiador.financiador} - ${financiador.plan}.`);
  };

  const onFinalizarVigencia = async (financiador: FinanciadorPlan) => {
    if (!paciente) return;
    if (financiador.financiador.toUpperCase().includes("PRIVADO")) { setFinanciadorModalError("El financiador Privado/Particular no puede finalizar vigencia."); return; }
    try { await finalizarVigenciaFinanciadorPaciente(paciente.id, financiador.id); }
    catch (e) { setFinanciadorModalError(e instanceof Error ? e.message : "No se pudo finalizar la vigencia."); return; }
    const next = financiadoresPaciente.map(i => i.id === financiador.id ? { ...i, vigente: false } : i);
    setFinanciadoresPaciente(next); setPaciente(prev => prev ? { ...prev, financiadores: next } : prev);
    const vigentes = next.filter(i => i.vigente);
    if (!vigentes.some(i => i.id === financiadorPlanId)) setFinanciadorPlanId(vigentes[0]?.id ?? "");
    if (financiadorEditandoId === financiador.id) resetFinanciadorForm();
    setFinanciadorModalInfo(`Se finalizo vigencia para ${financiador.financiador} - ${financiador.plan}.`); setFinanciadorModalError(null);
  };

  const onGuardarFinanciador = async () => {
    if (!paciente || !puedeGuardarFinanciador) return;
    const fc = CATALOGO_FINANCIADORES.find(i => i.id === financiadorFormId);
    const pc = fc?.planes.find(i => i.id === planFormId);
    if (!fc || !pc) { setFinanciadorModalError("Seleccione financiador y plan validos."); return; }
    let persisted: FinanciadorPlan;
    try {
      persisted = await guardarFinanciadorPaciente(paciente.id, {
        financiadorId: fc.id, planId: pc.id, numeroAfiliado: numeroAfiliadoForm.trim().toUpperCase(),
        reemplazarFinanciadorPlanId: esEdicionFinanciador ? financiadorEditandoId ?? undefined : undefined,
      });
    } catch (e) { setFinanciadorModalError(e instanceof Error ? e.message : "No se pudo guardar financiador/plan."); return; }
    let next = financiadoresPaciente;
    if (esEdicionFinanciador && financiadorEditandoId) next = next.map(i => i.id === financiadorEditandoId ? { ...i, vigente: false } : i);
    next = [...next.filter(i => i.id !== persisted.id), persisted];
    setFinanciadoresPaciente(next); setPaciente(prev => prev ? { ...prev, financiadores: next } : prev);
    setFinanciadorPlanId(persisted.id);
    setFinanciadorModalError(null);
    setFinanciadorModalInfo(esEdicionFinanciador ? "Se actualizo financiador/plan y se finalizo vigencia de la combinacion anterior." : `Se agrego el financiador ${persisted.financiador} - ${persisted.plan}.`);
    setInfo("Datos de financiador/plan actualizados correctamente."); resetFinanciadorForm();
  };

  const cargarTurnosPaciente = async (pacienteId: string, historial: boolean) => {
    setLoadingTurnosPaciente(true);
    try {
      const response = await getTurnosPaciente(pacienteId, historial, 1, 10);
      setTurnosPaciente(response.items); setTotalTurnosPaciente(response.total);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudieron cargar los turnos del paciente.";
      setError(msg); setTurnosPaciente([]); setTotalTurnosPaciente(0);
    } finally { setLoadingTurnosPaciente(false); }
  };

  const onAbrirConfirmacionAsignacion = (slot: DisponibilidadSlot) => {
    if (!paciente) return;
    setSelectedSlotId(slot.id);
    const emailDefault = (paciente.email ?? "").trim();
    const telefonoDefault = (paciente.telefono ?? "").replace(/\D/g, "").trim();
    setContactoEmailOriginal(emailDefault); setContactoTelefonoOriginal(telefonoDefault);
    setContactoEmail(emailDefault); setContactoTelefono(telefonoDefault);
    setGuardarContactoEnPerfil(false); setConfirmAsignacionModalOpen(true);
  };
  const onCancelarAsignacion = () => { setConfirmAsignacionModalOpen(false); setGuardarContactoEnPerfil(false); };
  const onCerrarAsignacionExitosaModal = () => setAsignacionExitosaModalOpen(false);

  const onAbrirModalSobreturno = (slot: DisponibilidadSlot) => { setSlotSobreturnoId(slot.id); setHoraSobreturno(slot.rangoHoraInicio); setSobreturnoError(null); setSobreturnoModalOpen(true); };
  const onCerrarModalSobreturno = () => { setSobreturnoModalOpen(false); setSlotSobreturnoId(null); setHoraSobreturno(""); setSobreturnoError(null); };

  const horaDentroDeRango = (hora: string, desde: string, hasta: string) => {
    if (!/^\d{2}:\d{2}$/.test(hora) || !/^\d{2}:\d{2}$/.test(desde) || !/^\d{2}:\d{2}$/.test(hasta)) return false;
    return hora >= desde && hora <= hasta;
  };

  const onConfirmarSobreturno = async () => {
    if (!paciente || !selectedSlotSobreturno || !financiadorPlanId) return false;
    if (!horaDentroDeRango(horaSobreturno, selectedSlotSobreturno.rangoHoraInicio, selectedSlotSobreturno.rangoHoraFin)) { setSobreturnoError("La hora no es valida dentro del rango horario."); return false; }
    setAsignandoTurno(true); setSobreturnoError(null); setWarningAsignacion(null); setError(null);
    const request: AsignarSobreturnoRequest = { pacienteId: paciente.id, slotId: selectedSlotSobreturno.id, financiadorPlanId, fecha: selectedSlotSobreturno.fecha, hora: horaSobreturno };
    try {
      const response = await asignarSobreturno(request);
      setSlots(prev => prev.map(i => i.id !== selectedSlotSobreturno.id ? i : { ...i, hora: horaSobreturno, estado: "ASIGNADO", sobreTurnosDisponibles: Math.max((i.sobreTurnosDisponibles ?? 0) - 1, 0), mensaje: `Sobreturno asignado (${horaSobreturno})` }));
      setInfo(response.message); onCerrarModalSobreturno();
      await cargarTurnosPaciente(paciente.id, verHistorialTurnos);
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo asignar el sobreturno."); return false; }
    finally { setAsignandoTurno(false); }
  };

  const onConfirmarAsignacion = async (): Promise<boolean> => {
    if (!paciente || !selectedSlot || !financiadorPlanId || !puedeConfirmarAsignacion) return false;
    setAsignandoTurno(true); setError(null); setWarningAsignacion(null);
    const request: AsignarTurnoRequest = {
      pacienteId: paciente.id, slotId: selectedSlot.id, financiadorPlanId,
      email: contactoEmail.trim() || undefined, telefono: telefonoNormalizado || undefined,
      guardarContactoEnPerfil: guardarContactoEnPerfil && contactoEditado,
      centro: selectedSlot.centro, servicio: selectedSlot.servicio, practica: selectedSlot.practica,
      profesional: selectedSlot.profesional, fecha: selectedSlot.fecha, hora: selectedSlot.hora,
    };
    try {
      const result = await asignarTurno(request);
      setSlots(prev => prev.map(i => i.id === selectedSlot.id ? { ...i, estado: "ASIGNADO", mensaje: "Turno asignado" } : i));
      if (result.warning) setWarningAsignacion(result.warning);
      if (result.notificacionEmail) setInfo(`${result.message} ${result.notificacionEmail.mensajeResumen} Destino: ${result.notificacionEmail.destinatario}. Centro: ${result.notificacionEmail.centro}.`);
      else if (request.guardarContactoEnPerfil && (request.email || request.telefono)) setInfo(`${result.message} Se actualizaron datos de contactabilidad en el perfil del paciente.`);
      else if (!request.email) setInfo(`${result.message} El paciente no cuenta con correo para enviar comprobante (gestion por proceso).`);
      else setInfo(result.message);
      setConfirmAsignacionModalOpen(false); setAsignacionExitosaMensaje("Turno asignado"); setAsignacionExitosaModalOpen(true);
      await cargarTurnosPaciente(paciente.id, verHistorialTurnos);
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo asignar el turno seleccionado."); return false; }
    finally { setAsignandoTurno(false); }
  };

  useEffect(() => {
    if (!paciente) { setTurnosPaciente([]); setTotalTurnosPaciente(0); setFinanciadoresPaciente([]); return; }
    void cargarTurnosPaciente(paciente.id, verHistorialTurnos);
  }, [paciente, verHistorialTurnos]);

  const onConfirmarCancelacion = async (turnoId: string) => {
    setCelandoTurnoId(turnoId);
    try {
      await actualizarEstadoTurno(turnoId, { estado: "CANCELADO_POR_ADMINSTRACION", motivo: "Cancelado por administración desde el HIS" });
      setTurnoACancelarId(null); setCancelacionExitosa("Turno cancelado exitosamente.");
      if (paciente) await cargarTurnosPaciente(paciente.id, verHistorialTurnos);
    } catch { setInfo("Error al cancelar el turno. Intente nuevamente."); }
    finally { setCelandoTurnoId(null); }
  };

  return {
    tiposDocumento, tipoDocumento, numeroDocumento, paciente,
    financiadoresPaciente, financiadorPlanId, resultadoIdentificacion, loadingIdentificacion,
    centrosSeleccionados, servicioId, practicaId, profesionalId,
    loadingDisponibilidad, asignandoTurno, slots, selectedSlotId,
    confirmAsignacionModalOpen, contactoEmail, contactoTelefono, guardarContactoEnPerfil,
    warningAsignacion, asignacionExitosaModalOpen, asignacionExitosaMensaje,
    sobreturnoModalOpen, horaSobreturno, sobreturnoError, verHistorialTurnos,
    loadingTurnosPaciente, turnosPaciente, totalTurnosPaciente,
    financiadorModalOpen, financiadorFormId, planFormId, numeroAfiliadoForm,
    financiadorModalError, financiadorModalInfo, error, info,
    turnoACancelarId, cancelandoTurnoId, cancelacionExitosa,

    setTipoDocumento, setNumeroDocumento, setFinanciadorPlanId,
    setServicioId, setPracticaId, setProfesionalId, setVerHistorialTurnos,
    setTurnoACancelarId, setCancelacionExitosa, setHoraSobreturno,
    setFinanciadorFormId, setPlanFormId, setNumeroAfiliadoForm,
    setContactoEmail, setContactoTelefono, setGuardarContactoEnPerfil,

    centrosDisponibles, serviciosDisponibles, practicasDisponibles, profesionalesDisponibles,
    financiadoresVigentes, financiadorCatalogoSeleccionado, planesDisponiblesForm,
    esEdicionFinanciador, esCombinacionDuplicada, puedeGuardarFinanciador, puedeBuscarDisponibilidad,
    selectedSlot, selectedSlotSobreturno, contactoEditado, emailValido, telefonoValido,
    puedeConfirmarAsignacion, financiadorSeleccionado, copagoEstimado,

    onConsultarPaciente, onToggleCentro, onBuscarDisponibilidad,
    resetFinanciadorForm, onAbrirModalFinanciador, onCerrarModalFinanciador,
    onEditarFinanciador, onFinalizarVigencia, onGuardarFinanciador,
    cargarTurnosPaciente, onAbrirConfirmacionAsignacion, onCancelarAsignacion,
    onCerrarAsignacionExitosaModal, onAbrirModalSobreturno, onCerrarModalSobreturno,
    horaDentroDeRango, onConfirmarSobreturno, onConfirmarAsignacion, onConfirmarCancelacion,
  };
}
