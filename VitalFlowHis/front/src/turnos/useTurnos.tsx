import { getTiposDocumento, TipoDocumento } from "../shared/catalogosApi";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { asignarSobreturno, asignarTurno, AsignarTurnoRequest, AsignarSobreturnoRequest, buscarDisponibilidadHoraria, BuscarDisponibilidadRequest, DisponibilidadSlot, EstadoTurnoPaciente, finalizarVigenciaFinanciadorPaciente, FinanciadorPlan, getTurnosPaciente, getSelectoresDisponibilidad, guardarFinanciadorPaciente, identificarPacientePorDocumento, PacienteIdentificado, SelectoresDisponibilidad, TurnoPaciente } from "./turnosApi";
import { actualizarEstadoTurno } from "../admision/admisionApi";
type TurnosPageProps = {};
type FinanciadorCatalogoItem = {
  id: string;
  nombre: string;
  planes: Array<{
    id: string;
    nombre: string;
  }>;
};
const CATALOGO_FINANCIADORES: FinanciadorCatalogoItem[] = [{
  id: "30000000-0000-0000-0000-000000000001",
  nombre: "OSDE",
  planes: [{
    id: "30000000-0000-0000-0000-000000000102",
    nombre: "210"
  }, {
    id: "30000000-0000-0000-0000-000000000101",
    nombre: "310"
  }, {
    id: "30000000-0000-0000-0000-000000000103",
    nombre: "410"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000002",
  nombre: "IOMA",
  planes: [{
    id: "30000000-0000-0000-0000-000000000201",
    nombre: "GOLD"
  }, {
    id: "30000000-0000-0000-0000-000000000202",
    nombre: "I700"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000004",
  nombre: "Swiss Medical",
  planes: [{
    id: "30000000-0000-0000-0000-000000000401",
    nombre: "SMG20"
  }, {
    id: "30000000-0000-0000-0000-000000000402",
    nombre: "SMG50"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000005",
  nombre: "PAMI",
  planes: [{
    id: "30000000-0000-0000-0000-000000000501",
    nombre: "General"
  }, {
    id: "30000000-0000-0000-0000-000000000502",
    nombre: "Plus"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000003",
  nombre: "Privado Particular",
  planes: [{
    id: "30000000-0000-0000-0000-000000000301",
    nombre: "Privado Particular"
  }]
}];
const SELECTORES_VACIOS: SelectoresDisponibilidad = {
  centros: [],
  servicios: [],
  practicas: [],
  profesionales: []
};

function parseIsoDateTimeParts(value: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5])
  };
}
export function useTurnos() {
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
        if (tipos.length > 0 && !tipos.some(item => item.codigo === tipoDocumento)) {
          setTipoDocumento(tipos[0].codigo);
        }
      }

      if (selectoresResult.status === "fulfilled") {
        setSelectores(selectoresResult.value);
      }

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
    if (centrosSeleccionados.length === 0) {
      return selectores.servicios;
    }
    return selectores.servicios.filter(servicio => servicio.centroIds.some(id => centrosSeleccionados.includes(id)));
  }, [selectores.servicios, centrosSeleccionados]);
  const practicasDisponibles = useMemo(() => {
    return selectores.practicas.filter(practica => {
      const matchServicio = servicioId ? practica.servicioId === servicioId : true;
      const matchCentro = centrosSeleccionados.length === 0 ? true : practica.centroIds.some(id => centrosSeleccionados.includes(id));
      return matchServicio && matchCentro;
    });
  }, [selectores.practicas, servicioId, centrosSeleccionados]);
  const profesionalesDisponibles = useMemo(() => {
    return selectores.profesionales.filter(profesional => {
      const matchCentro = centrosSeleccionados.length === 0 ? true : profesional.centroIds.some(id => centrosSeleccionados.includes(id));
      const matchServicio = servicioId ? profesional.servicioIds.includes(servicioId) : true;
      const matchPractica = practicaId ? profesional.practicaIds.includes(practicaId) : true;
      return matchCentro && matchServicio && matchPractica;
    });
  }, [selectores.profesionales, centrosSeleccionados, servicioId, practicaId]);
  useEffect(() => {
    if (servicioId && !serviciosDisponibles.some(item => item.id === servicioId)) {
      setServicioId("");
    }
  }, [servicioId, serviciosDisponibles]);
  useEffect(() => {
    if (practicaId && !practicasDisponibles.some(item => item.id === practicaId)) {
      setPracticaId("");
    }
  }, [practicaId, practicasDisponibles]);
  useEffect(() => {
    if (profesionalId && !profesionalesDisponibles.some(item => item.id === profesionalId)) {
      setProfesionalId("");
    }
  }, [profesionalId, profesionalesDisponibles]);
  useEffect(() => {
    if (!practicaId) {
      return;
    }
    const practica = selectores.practicas.find(item => item.id === practicaId);
    if (!practica) {
      return;
    }
    if (servicioId !== practica.servicioId) {
      setServicioId(practica.servicioId);
    }
  }, [practicaId, servicioId, selectores.practicas]);
  useEffect(() => {
    setSlots([]);
    setSelectedSlotId(null);
    setConfirmAsignacionModalOpen(false);
  }, [centrosSeleccionados, servicioId, practicaId, profesionalId, financiadorPlanId]);
  const financiadoresVigentes: FinanciadorPlan[] = useMemo(() => {
    if (!paciente) {
      return [];
    }
    return financiadoresPaciente.filter(item => item.vigente);
  }, [paciente, financiadoresPaciente]);
  const financiadorCatalogoSeleccionado = useMemo(() => CATALOGO_FINANCIADORES.find(item => item.id === financiadorFormId) ?? null, [financiadorFormId]);
  const planesDisponiblesForm = financiadorCatalogoSeleccionado?.planes ?? [];
  const esEdicionFinanciador = financiadorEditandoId !== null;
  const esCombinacionDuplicada = useMemo(() => {
    if (!financiadorFormId || !planFormId || !numeroAfiliadoForm.trim()) {
      return false;
    }
    const afiliadoNormalizado = numeroAfiliadoForm.trim().toUpperCase();
    return financiadoresVigentes.some(item => {
      if (esEdicionFinanciador && item.id === financiadorEditandoId) {
        return false;
      }
      const itemFinanciador = item.financiadorId ?? "";
      const itemPlan = item.planId ?? "";
      const itemAfiliado = (item.numeroAfiliado ?? "").trim().toUpperCase();
      return itemFinanciador === financiadorFormId && itemPlan === planFormId && itemAfiliado === afiliadoNormalizado;
    });
  }, [esEdicionFinanciador, financiadorEditandoId, financiadorFormId, financiadoresVigentes, numeroAfiliadoForm, planFormId]);
  const puedeGuardarFinanciador = financiadorFormId.trim().length > 0 && planFormId.trim().length > 0 && numeroAfiliadoForm.trim().length > 0 && !esCombinacionDuplicada;
  const puedeBuscarDisponibilidad = Boolean(paciente) && financiadorPlanId.trim().length > 0 && centrosSeleccionados.length > 0 && servicioId.trim().length > 0 && practicaId.trim().length > 0;
  const selectedSlot = useMemo(() => selectedSlotId ? slots.find(item => item.id === selectedSlotId) ?? null : null, [slots, selectedSlotId]);
  const selectedSlotSobreturno = useMemo(() => slotSobreturnoId ? slots.find(item => item.id === slotSobreturnoId) ?? null : null, [slots, slotSobreturnoId]);
  const contactoEditado = contactoEmail.trim() !== contactoEmailOriginal.trim() || contactoTelefono.trim() !== contactoTelefonoOriginal.trim();
  const emailValido = contactoEmail.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoEmail.trim());
  const telefonoNormalizado = contactoTelefono.replace(/\D/g, "").trim();
  const telefonoValido = telefonoNormalizado.length === 0 || /^\d{6,15}$/.test(telefonoNormalizado);
  const puedeConfirmarAsignacion = Boolean(selectedSlot && paciente) && emailValido && telefonoValido;
  const financiadorSeleccionado = useMemo(() => financiadoresVigentes.find(item => item.id === financiadorPlanId) ?? null, [financiadoresVigentes, financiadorPlanId]);
  const copagoEstimado = useMemo(() => {
    if (!financiadorSeleccionado) {
      return "-";
    }
    if (financiadorSeleccionado.financiador.toUpperCase().includes("PRIVADO")) {
      return "$ 4.500";
    }
    return "$ 0";
  }, [financiadorSeleccionado]);
  const onConsultarPaciente = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingIdentificacion(true);
    setError(null);
    setInfo(null);
    try {
      const candidatos = await identificarPacientePorDocumento(tipoDocumento, numeroDocumento.trim());
      if (candidatos.length === 1) {
        const candidato = candidatos[0];
        setPaciente(candidato);
        setFinanciadoresPaciente(candidato.financiadores);
        setResultadoIdentificacion("single");
        const primerFinanciador = candidato.financiadores.find(item => item.vigente);
        setFinanciadorPlanId(primerFinanciador ? primerFinanciador.id : "");
        setInfo(`Paciente identificado: ${candidato.apellidosNombres}.`);
        return;
      }
      setPaciente(null);
      setFinanciadoresPaciente([]);
      setFinanciadorPlanId("");
      setSlots([]);
      setSelectedSlotId(null);
      setWarningAsignacion(null);
      if (candidatos.length === 0) {
        setResultadoIdentificacion("none");
        setInfo("No se encontro una persona candidata. Continua por Identificacion de personas para identificar paciente.");
      } else {
        setResultadoIdentificacion("multiple");
        setInfo("Se encontraron multiples personas. Continua por Identificacion de personas para identificar paciente.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo consultar paciente.";
      setError(message);
    } finally {
      setLoadingIdentificacion(false);
    }
  };
  const onToggleCentro = (centroId: string) => {
    setCentrosSeleccionados(prev => prev.includes(centroId) ? prev.filter(id => id !== centroId) : [...prev, centroId]);
  };
  const onBuscarDisponibilidad = async () => {
    if (!paciente || !puedeBuscarDisponibilidad) {
      return;
    }
    setLoadingDisponibilidad(true);
    setError(null);
    setWarningAsignacion(null);
    const request: BuscarDisponibilidadRequest = {
      pacienteId: paciente.id,
      financiadorPlanId,
      centroIds: centrosSeleccionados,
      servicioId,
      practicaId,
      profesionalId: profesionalId || undefined
    };
    try {
      const result = await buscarDisponibilidadHoraria(request);
      setSlots(result);
      setSelectedSlotId(null);
      if (result.length === 0) {
        setInfo("No se encontraron horarios disponibles para los filtros aplicados.");
      } else {
        setInfo(`Se encontraron ${result.length} horarios para los filtros seleccionados.`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo buscar disponibilidad.";
      setError(message);
    } finally {
      setLoadingDisponibilidad(false);
    }
  };
  const resetFinanciadorForm = () => {
    setFinanciadorEditandoId(null);
    setFinanciadorFormId("");
    setPlanFormId("");
    setNumeroAfiliadoForm("");
    setFinanciadorModalError(null);
  };
  const onAbrirModalFinanciador = () => {
    if (!paciente) {
      return;
    }
    setFinanciadorModalOpen(true);
    setFinanciadorModalInfo(null);
    setFinanciadorModalError(null);
    resetFinanciadorForm();
  };
  const onCerrarModalFinanciador = () => {
    setFinanciadorModalOpen(false);
    setFinanciadorModalInfo(null);
    resetFinanciadorForm();
  };
  const onEditarFinanciador = (financiador: FinanciadorPlan) => {
    const esPrivado = financiador.financiador.toUpperCase().includes("PRIVADO");
    if (esPrivado) {
      setFinanciadorModalError("El financiador Privado/Particular no puede editarse.");
      return;
    }
    setFinanciadorEditandoId(financiador.id);
    setFinanciadorFormId(financiador.financiadorId ?? "");
    setPlanFormId(financiador.planId ?? "");
    setNumeroAfiliadoForm(financiador.numeroAfiliado ?? "");
    setFinanciadorModalError(null);
    setFinanciadorModalInfo(`Editando ${financiador.financiador} - ${financiador.plan}.`);
  };
  const onFinalizarVigencia = async (financiador: FinanciadorPlan) => {
    if (!paciente) {
      return;
    }

    const esPrivado = financiador.financiador.toUpperCase().includes("PRIVADO");
    if (esPrivado) {
      setFinanciadorModalError("El financiador Privado/Particular no puede finalizar vigencia.");
      return;
    }

    try {
      await finalizarVigenciaFinanciadorPaciente(paciente.id, financiador.id);
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo finalizar la vigencia.";
      setFinanciadorModalError(message);
      return;
    }

    const next = financiadoresPaciente.map(item => item.id === financiador.id ? {
      ...item,
      vigente: false
    } : item);
    setFinanciadoresPaciente(next);
    setPaciente(prev => prev ? {
      ...prev,
      financiadores: next
    } : prev);
    const vigentesRestantes = next.filter(item => item.vigente);
    if (!vigentesRestantes.some(item => item.id === financiadorPlanId)) {
      setFinanciadorPlanId(vigentesRestantes[0]?.id ?? "");
    }
    if (financiadorEditandoId === financiador.id) {
      resetFinanciadorForm();
    }
    setFinanciadorModalInfo(`Se finalizo vigencia para ${financiador.financiador} - ${financiador.plan}.`);
    setFinanciadorModalError(null);
  };
  const onGuardarFinanciador = async () => {
    if (!paciente) {
      return;
    }

    if (!puedeGuardarFinanciador) {
      return;
    }
    const financiadorCatalogo = CATALOGO_FINANCIADORES.find(item => item.id === financiadorFormId);
    const planCatalogo = financiadorCatalogo?.planes.find(item => item.id === planFormId);
    if (!financiadorCatalogo || !planCatalogo) {
      setFinanciadorModalError("Seleccione financiador y plan validos.");
      return;
    }

    let persisted: FinanciadorPlan;
    try {
      persisted = await guardarFinanciadorPaciente(paciente.id, {
        financiadorId: financiadorCatalogo.id,
        planId: planCatalogo.id,
        numeroAfiliado: numeroAfiliadoForm.trim().toUpperCase(),
        reemplazarFinanciadorPlanId: esEdicionFinanciador ? financiadorEditandoId ?? undefined : undefined
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo guardar financiador/plan.";
      setFinanciadorModalError(message);
      return;
    }

    let next = financiadoresPaciente;
    if (esEdicionFinanciador && financiadorEditandoId) {
      next = next.map(item => item.id === financiadorEditandoId ? {
        ...item,
        vigente: false
      } : item);
    }
    next = [...next.filter(item => item.id !== persisted.id), persisted];
    setFinanciadoresPaciente(next);
    setPaciente(prev => prev ? {
      ...prev,
      financiadores: next
    } : prev);
    setFinanciadorPlanId(persisted.id);
    setFinanciadorModalError(null);
    setFinanciadorModalInfo(esEdicionFinanciador ? `Se actualizo financiador/plan y se finalizo vigencia de la combinacion anterior.` : `Se agrego el financiador ${persisted.financiador} - ${persisted.plan}.`);
    setInfo("Datos de financiador/plan actualizados correctamente.");
    resetFinanciadorForm();
  };
  const cargarTurnosPaciente = async (pacienteId: string, historial: boolean) => {
    setLoadingTurnosPaciente(true);
    try {
      const response = await getTurnosPaciente(pacienteId, historial, 1, 10);
      setTurnosPaciente(response.items);
      setTotalTurnosPaciente(response.total);
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudieron cargar los turnos del paciente.";
      setError(message);
      setTurnosPaciente([]);
      setTotalTurnosPaciente(0);
    } finally {
      setLoadingTurnosPaciente(false);
    }
  };
  const onAbrirConfirmacionAsignacion = (slot: DisponibilidadSlot) => {
    if (!paciente) {
      return;
    }
    setSelectedSlotId(slot.id);
    const emailDefault = (paciente.email ?? "").trim();
    const telefonoDefault = (paciente.telefono ?? "").replace(/\D/g, "").trim();
    setContactoEmailOriginal(emailDefault);
    setContactoTelefonoOriginal(telefonoDefault);
    setContactoEmail(emailDefault);
    setContactoTelefono(telefonoDefault);
    setGuardarContactoEnPerfil(false);
    setConfirmAsignacionModalOpen(true);
  };
  const onCancelarAsignacion = () => {
    setConfirmAsignacionModalOpen(false);
    setGuardarContactoEnPerfil(false);
  };
  const onCerrarAsignacionExitosaModal = () => {
    setAsignacionExitosaModalOpen(false);
  };
  const onAbrirModalSobreturno = (slot: DisponibilidadSlot) => {
    setSlotSobreturnoId(slot.id);
    setHoraSobreturno(slot.rangoHoraInicio);
    setSobreturnoError(null);
    setSobreturnoModalOpen(true);
  };
  const onCerrarModalSobreturno = () => {
    setSobreturnoModalOpen(false);
    setSlotSobreturnoId(null);
    setHoraSobreturno("");
    setSobreturnoError(null);
  };
  const horaDentroDeRango = (hora: string, desde: string, hasta: string) => {
    if (!/^\d{2}:\d{2}$/.test(hora) || !/^\d{2}:\d{2}$/.test(desde) || !/^\d{2}:\d{2}$/.test(hasta)) {
      return false;
    }
    return hora >= desde && hora <= hasta;
  };
  const onConfirmarSobreturno = async () => {
    if (!paciente || !selectedSlotSobreturno || !financiadorPlanId) {
      return false;
    }
    if (!horaDentroDeRango(horaSobreturno, selectedSlotSobreturno.rangoHoraInicio, selectedSlotSobreturno.rangoHoraFin)) {
      setSobreturnoError("La hora no es valida dentro del rango horario.");
      return false;
    }
    setAsignandoTurno(true);
    setSobreturnoError(null);
    setWarningAsignacion(null);
    setError(null);
    const request: AsignarSobreturnoRequest = {
      pacienteId: paciente.id,
      slotId: selectedSlotSobreturno.id,
      financiadorPlanId,
      fecha: selectedSlotSobreturno.fecha,
      hora: horaSobreturno
    };
    try {
      const response = await asignarSobreturno(request);
      setSlots(prev => prev.map(item => {
        if (item.id !== selectedSlotSobreturno.id) {
          return item;
        }
        const restantes = Math.max((item.sobreTurnosDisponibles ?? 0) - 1, 0);
        return {
          ...item,
          hora: horaSobreturno,
          estado: "ASIGNADO",
          sobreTurnosDisponibles: restantes,
          mensaje: `Sobreturno asignado (${horaSobreturno})`
        };
      }));
      setInfo(response.message);
      onCerrarModalSobreturno();
      await cargarTurnosPaciente(paciente.id, verHistorialTurnos);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo asignar el sobreturno.";
      setError(message);
      return false;
    } finally {
      setAsignandoTurno(false);
    }
  };
  const onConfirmarAsignacion = async () => {
    if (!paciente || !selectedSlot || !financiadorPlanId || !puedeConfirmarAsignacion) {
      return false;
    }
    setAsignandoTurno(true);
    setError(null);
    setWarningAsignacion(null);
    const request: AsignarTurnoRequest = {
      pacienteId: paciente.id,
      slotId: selectedSlot.id,
      financiadorPlanId,
      email: contactoEmail.trim() || undefined,
      telefono: telefonoNormalizado || undefined,
      guardarContactoEnPerfil: guardarContactoEnPerfil && contactoEditado,
      centro: selectedSlot.centro,
      servicio: selectedSlot.servicio,
      practica: selectedSlot.practica,
      profesional: selectedSlot.profesional,
      fecha: selectedSlot.fecha,
      hora: selectedSlot.hora
    };
    try {
      const result = await asignarTurno(request);
      setSlots(prev => prev.map(item => item.id === selectedSlot.id ? {
        ...item,
        estado: "ASIGNADO",
        mensaje: "Turno asignado"
      } : item));
      if (result.warning) {
        setWarningAsignacion(result.warning);
      }
      if (result.notificacionEmail) {
        setInfo(`${result.message} ${result.notificacionEmail.mensajeResumen} Destino: ${result.notificacionEmail.destinatario}. Centro: ${result.notificacionEmail.centro}.`);
      } else if (request.guardarContactoEnPerfil && (request.email || request.telefono)) {
        setInfo(`${result.message} Se actualizaron datos de contactabilidad en el perfil del paciente.`);
      } else if (!request.email) {
        setInfo(`${result.message} El paciente no cuenta con correo para enviar comprobante (gestion por proceso).`);
      } else {
        setInfo(result.message);
      }
      setConfirmAsignacionModalOpen(false);
      setAsignacionExitosaMensaje("Turno asignado");
      setAsignacionExitosaModalOpen(true);
      await cargarTurnosPaciente(paciente.id, verHistorialTurnos);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo asignar el turno seleccionado.";
      setError(message);
      return false;
    } finally {
      setAsignandoTurno(false);
    }
  };
  useEffect(() => {
    if (!paciente) {
      setTurnosPaciente([]);
      setTotalTurnosPaciente(0);
      setFinanciadoresPaciente([]);
      return;
    }
    void cargarTurnosPaciente(paciente.id, verHistorialTurnos);
  }, [paciente, verHistorialTurnos]);
  const estadoTurnoLabel = (estado: EstadoTurnoPaciente) => {
    switch (estado) {
      case "AGENDADO":
        return "Agendado";
      case "CONSUMIDO":
        return "Consumido";
      case "AUSENTE":
        return "Ausente";
      case "CANCELADO_POR_AGENDA":
        return "Cancelado por agenda";
      case "CANCELADO_POR_BLOQUEO":
        return "Cancelado por bloqueo";
      case "CANCELADO_POR_PACIENTE":
        return "Cancelado por paciente";
      default:
        return estado;
    }
  };
  const formatFechaHora = (value: string) => {
    const parts = parseIsoDateTimeParts(value);
    if (parts) {
      const dd = String(parts.day).padStart(2, "0");
      const mm = String(parts.month).padStart(2, "0");
      const yyyy = parts.year;
      const hh = String(parts.hour).padStart(2, "0");
      const min = String(parts.minute).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };
  return {
    tiposDocumento,
    setTiposDocumento,
    selectores,
    setSelectores,
    tipoDocumento,
    setTipoDocumento,
    numeroDocumento,
    setNumeroDocumento,
    paciente,
    setPaciente,
    financiadoresPaciente,
    setFinanciadoresPaciente,
    financiadorPlanId,
    setFinanciadorPlanId,
    resultadoIdentificacion,
    setResultadoIdentificacion,
    loadingIdentificacion,
    setLoadingIdentificacion,
    centrosSeleccionados,
    setCentrosSeleccionados,
    servicioId,
    setServicioId,
    practicaId,
    setPracticaId,
    profesionalId,
    setProfesionalId,
    loadingDisponibilidad,
    setLoadingDisponibilidad,
    asignandoTurno,
    setAsignandoTurno,
    slots,
    setSlots,
    selectedSlotId,
    setSelectedSlotId,
    confirmAsignacionModalOpen,
    setConfirmAsignacionModalOpen,
    contactoEmailOriginal,
    setContactoEmailOriginal,
    contactoTelefonoOriginal,
    setContactoTelefonoOriginal,
    contactoEmail,
    setContactoEmail,
    contactoTelefono,
    setContactoTelefono,
    guardarContactoEnPerfil,
    setGuardarContactoEnPerfil,
    warningAsignacion,
    setWarningAsignacion,
    asignacionExitosaModalOpen,
    setAsignacionExitosaModalOpen,
    asignacionExitosaMensaje,
    setAsignacionExitosaMensaje,
    sobreturnoModalOpen,
    setSobreturnoModalOpen,
    slotSobreturnoId,
    setSlotSobreturnoId,
    horaSobreturno,
    setHoraSobreturno,
    sobreturnoError,
    setSobreturnoError,
    verHistorialTurnos,
    setVerHistorialTurnos,
    loadingTurnosPaciente,
    setLoadingTurnosPaciente,
    turnosPaciente,
    setTurnosPaciente,
    totalTurnosPaciente,
    setTotalTurnosPaciente,
    financiadorModalOpen,
    setFinanciadorModalOpen,
    financiadorEditandoId,
    setFinanciadorEditandoId,
    financiadorFormId,
    setFinanciadorFormId,
    planFormId,
    setPlanFormId,
    numeroAfiliadoForm,
    setNumeroAfiliadoForm,
    financiadorModalError,
    setFinanciadorModalError,
    financiadorModalInfo,
    setFinanciadorModalInfo,
    error,
    setError,
    info,
    setInfo,
    centrosDisponibles,
    serviciosDisponibles,
    practicasDisponibles,
    profesionalesDisponibles,
    financiadoresVigentes,
    financiadorCatalogoSeleccionado,
    planesDisponiblesForm,
    esEdicionFinanciador,
    esCombinacionDuplicada,
    puedeGuardarFinanciador,
    puedeBuscarDisponibilidad,
    selectedSlot,
    selectedSlotSobreturno,
    contactoEditado,
    emailValido,
    telefonoValido,
    puedeConfirmarAsignacion,
    financiadorSeleccionado,
    copagoEstimado,
    onConsultarPaciente,
    onToggleCentro,
    onBuscarDisponibilidad,
    resetFinanciadorForm,
    onAbrirModalFinanciador,
    onCerrarModalFinanciador,
    onEditarFinanciador,
    onFinalizarVigencia,
    onGuardarFinanciador,
    cargarTurnosPaciente,
    onAbrirConfirmacionAsignacion,
    onCancelarAsignacion,
    onCerrarAsignacionExitosaModal,
    onAbrirModalSobreturno,
    onCerrarModalSobreturno,
    horaDentroDeRango,
    onConfirmarSobreturno,
    onConfirmarAsignacion,
    estadoTurnoLabel,
    formatFechaHora,
    turnoACancelarId,
    setTurnoACancelarId,
    cancelandoTurnoId,
    cancelacionExitosa,
    setCancelacionExitosa,
    onConfirmarCancelacion: async (turnoId: string) => {
      setCelandoTurnoId(turnoId);
      try {
        await actualizarEstadoTurno(turnoId, { estado: "CANCELADO_POR_ADMINSTRACION", motivo: "Cancelado por administración desde el HIS" });
        setTurnoACancelarId(null);
        setCancelacionExitosa("Turno cancelado exitosamente.");
        if (paciente) await cargarTurnosPaciente(paciente.id, verHistorialTurnos);
      } catch {
        setInfo("Error al cancelar el turno. Intente nuevamente.");
      } finally {
        setCelandoTurnoId(null);
      }
    },
  };
}