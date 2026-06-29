import { getTiposDocumento, TipoDocumento } from "../shared/catalogosApi";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AgendaDetail, AgendaSummary, getAgendaById, getAgendas } from "../agenda/agendaApi";
import { actualizarEstadoTurno, buscarTurnosAdmision, confirmarArriboTurno, FinanciadorPlanAdmision, getSelectoresAdmision, identificarPacienteAdmision, obtenerEventoFacturacionTurno, PacienteIdentificadoAdmision, SelectoresAdmision, TurnoAdmision } from "./admisionApi";
import { useAuth } from "../auth/AuthContext";
type AdmisionPageProps = {};
type FinanciadorCatalogoItem = {
  id: string;
  nombre: string;
  planes: Array<{
    id: string;
    nombre: string;
  }>;
};
type FinanciadorPacienteAdmision = {
  id: string;
  financiadorId: string;
  planId: string;
  financiador: string;
  plan: string;
  numeroAfiliado: string;
  vigente: boolean;
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
    id: "30000000-0000-0000-0000-000000000202",
    nombre: "I700"
  }, {
    id: "30000000-0000-0000-0000-000000000201",
    nombre: "GOLD"
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
  nombre: "Privado/Particular",
  planes: [{
    id: "30000000-0000-0000-0000-000000000301",
    nombre: "Privado Particular"
  }]
}];
const SELECTORES_EMPTY: SelectoresAdmision = {
  servicios: [],
  practicas: [],
  tiposEfector: [],
  efectores: [],
  estados: []
};
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function isAgendaVigenteEnFecha(agenda: AgendaSummary, fechaIso: string): boolean {
  const desde = agenda.fechaDesde?.slice(0, 10);
  const hasta = agenda.fechaHasta?.slice(0, 10);
  if (!desde) {
    return false;
  }
  if (fechaIso < desde) {
    return false;
  }
  if (hasta && fechaIso > hasta) {
    return false;
  }
  return true;
}
function parseNombreFinanciadorPlan(nombre: string): {
  financiador: string;
  plan: string;
} {
  const value = nombre.trim();
  if (!value) {
    return {
      financiador: "",
      plan: ""
    };
  }
  const separators = ["|", "-", "/"];
  for (const separator of separators) {
    const index = value.indexOf(separator);
    if (index > 0 && index < value.length - 1) {
      return {
        financiador: value.slice(0, index).trim(),
        plan: value.slice(index + 1).trim()
      };
    }
  }
  return {
    financiador: value,
    plan: "General"
  };
}
function normalizarAfiliado(afiliado: string): string {
  return afiliado.replace(/[^0-9]/g, "").slice(0, 18);
}
function isPrivadoFinanciador(financiador: FinanciadorPacienteAdmision): boolean {
  const full = `${financiador.financiador} ${financiador.plan}`.toUpperCase();
  return full.includes("PRIVADO") || full.includes("PARTICULAR");
}
function mapFinanciadoresPaciente(financiadores: FinanciadorPlanAdmision[]): FinanciadorPacienteAdmision[] {
  return financiadores.map((item, index) => {
    const financiadorRaw = (item.financiador ?? "").trim();
    const planRaw = (item.plan ?? "").trim();
    const parsed = parseNombreFinanciadorPlan(`${financiadorRaw} | ${planRaw}`);
    const byId = item.financiadorId ? CATALOGO_FINANCIADORES.find(entry => entry.id === item.financiadorId) : null;
    const byName = CATALOGO_FINANCIADORES.find(entry => {
      if (!financiadorRaw) {
        return false;
      }
      return financiadorRaw.toUpperCase().includes(entry.nombre.toUpperCase());
    });
    const financiadorCatalogo = byId ?? byName ?? CATALOGO_FINANCIADORES[CATALOGO_FINANCIADORES.length - 1];
    const planCatalogo = item.planId
      ? financiadorCatalogo.planes.find(plan => plan.id === item.planId)
      : financiadorCatalogo.planes.find(plan => plan.nombre.toUpperCase() === planRaw.toUpperCase());
    return {
      id: item.id || `fin-adm-${index + 1}`,
      financiadorId: item.financiadorId ?? financiadorCatalogo.id,
      planId: item.planId ?? planCatalogo?.id ?? financiadorCatalogo.planes[0]?.id ?? "",
      financiador: financiadorRaw || parsed.financiador || financiadorCatalogo.nombre,
      plan: planRaw || parsed.plan || planCatalogo?.nombre || financiadorCatalogo.planes[0]?.nombre || "General",
      numeroAfiliado: normalizarAfiliado(item.numeroAfiliado ?? ""),
      vigente: item.vigente
    };
  });
}
export function useAdmision() {
  const { centroId } = useAuth();
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [loadingIdentificacion, setLoadingIdentificacion] = useState(false);
  const [candidatosPaciente, setCandidatosPaciente] = useState<PacienteIdentificadoAdmision[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteIdentificadoAdmision | null>(null);
  const [cabeceraExpandida, setCabeceraExpandida] = useState(false);
  const [financiadoresPaciente, setFinanciadoresPaciente] = useState<FinanciadorPacienteAdmision[]>([]);
  const [financiadorPlanId, setFinanciadorPlanId] = useState("");
  const [elegibilidadManual, setElegibilidadManual] = useState<Record<string, boolean>>({});
  const [financiadorModalOpen, setFinanciadorModalOpen] = useState(false);
  const [financiadorEditandoId, setFinanciadorEditandoId] = useState<string | null>(null);
  const [financiadorFormId, setFinanciadorFormId] = useState("");
  const [planFormId, setPlanFormId] = useState("");
  const [numeroAfiliadoForm, setNumeroAfiliadoForm] = useState("");
  const [financiadorModalError, setFinanciadorModalError] = useState<string | null>(null);
  const [financiadorModalInfo, setFinanciadorModalInfo] = useState<string | null>(null);
  const [selectores, setSelectores] = useState<SelectoresAdmision>(SELECTORES_EMPTY);
  const [servicioId, setServicioId] = useState("");
  const [practicaId, setPracticaId] = useState("");
  const [tipoEfector, setTipoEfector] = useState("");
  const [efectorId, setEfectorId] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState(toIsoDate(new Date()));
  const [turnos, setTurnos] = useState<TurnoAdmision[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [arribandoId, setArribandoId] = useState<string | null>(null);
  const [actualizandoEstadoId, setActualizandoEstadoId] = useState<string | null>(null);
  const [modoArriboProgramado, setModoArriboProgramado] = useState(false);
  const [turnosPacienteDia, setTurnosPacienteDia] = useState<TurnoAdmision[]>([]);
  const [turnoSeleccionadoId, setTurnoSeleccionadoId] = useState<string | null>(null);
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroFinanciador, setFiltroFinanciador] = useState("");
  const [modalProgramadoOpen, setModalProgramadoOpen] = useState(false);
  const [pasoModalProgramado, setPasoModalProgramado] = useState<1 | 2>(1);
  const [loadingPacienteProgramado, setLoadingPacienteProgramado] = useState(false);
  const [modalPracticasOpen, setModalPracticasOpen] = useState(false);
  const [loadingPracticasModal, setLoadingPracticasModal] = useState(false);
  const [bloquePracticasNombre, setBloquePracticasNombre] = useState("");
  const [practicasDisponiblesModal, setPracticasDisponiblesModal] = useState<string[]>([]);
  const [practicasSeleccionadasModal, setPracticasSeleccionadasModal] = useState<string[]>([]);
  const [practicasPorTurno, setPracticasPorTurno] = useState<Record<string, string[]>>({});
  const [practicaAEliminar, setPracticaAEliminar] = useState<string | null>(null);
  const [modalDemandaOpen, setModalDemandaOpen] = useState(false);
  const [pasoModalDemanda, setPasoModalDemanda] = useState<1 | 2>(1);
  const [loadingAgendasDemanda, setLoadingAgendasDemanda] = useState(false);
  const [agendasDemandaHoy, setAgendasDemandaHoy] = useState<AgendaSummary[]>([]);
  const [agendaDemandaId, setAgendaDemandaId] = useState("");
  const [agendaDemandaDetalle, setAgendaDemandaDetalle] = useState<AgendaDetail | null>(null);
  const [bloqueDemandaId, setBloqueDemandaId] = useState("");
  const [servicioDemandaId, setServicioDemandaId] = useState("");
  const [practicaDemandaId, setPracticaDemandaId] = useState("");
  const [turnoOfertaId, setTurnoOfertaId] = useState("");
  const [turnoDiscrepancia, setTurnoDiscrepancia] = useState<TurnoAdmision | null>(null);
  const [modalSinTurnosOpen, setModalSinTurnosOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [admissionSuccessMessage, setAdmissionSuccessMessage] = useState<string | null>(null);
  const fechaSistemaHoy = toIsoDate(new Date());
  const fechaEsHoy = fecha === fechaSistemaHoy;
  const practicasDisponibles = useMemo(() => {
    if (!servicioId) {
      return selectores.practicas;
    }
    return selectores.practicas.filter(item => item.servicioId === servicioId);
  }, [selectores.practicas, servicioId]);
  const efectoresDisponibles = useMemo(() => {
    return selectores.efectores.filter(item => {
      const byServicio = servicioId ? item.servicioId === servicioId : true;
      const byTipo = tipoEfector ? item.tipoEfector === tipoEfector : true;
      return byServicio && byTipo;
    });
  }, [selectores.efectores, servicioId, tipoEfector]);
  const financiadoresVigentes = useMemo(() => financiadoresPaciente.filter(item => item.vigente), [financiadoresPaciente]);
  const financiadorSeleccionado = useMemo(() => financiadoresVigentes.find(item => item.id === financiadorPlanId) ?? null, [financiadorPlanId, financiadoresVigentes]);
  const financiadorCatalogoSeleccionado = useMemo(() => CATALOGO_FINANCIADORES.find(item => item.id === financiadorFormId) ?? null, [financiadorFormId]);
  const planesDisponiblesForm = financiadorCatalogoSeleccionado?.planes ?? [];
  const esEdicionFinanciador = financiadorEditandoId !== null;
  const esCombinacionDuplicada = useMemo(() => {
    if (!financiadorFormId || !planFormId) {
      return false;
    }
    return financiadoresVigentes.some(item => {
      if (esEdicionFinanciador && item.id === financiadorEditandoId) {
        return false;
      }
      return item.financiadorId === financiadorFormId && item.planId === planFormId;
    });
  }, [esEdicionFinanciador, financiadorEditandoId, financiadorFormId, financiadoresVigentes, planFormId]);
  const numeroAfiliadoValido = /^\d{18}$/.test(numeroAfiliadoForm);
  const puedeGuardarFinanciador = financiadorFormId.trim().length > 0 && planFormId.trim().length > 0 && numeroAfiliadoValido && !esCombinacionDuplicada;
  const requiereElegibilidadManual = useMemo(() => {
    if (!financiadorSeleccionado) return false;
    return !isPrivadoFinanciador(financiadorSeleccionado);
  }, [financiadorSeleccionado]);
  const elegibilidadCompleta = useMemo(() => {
    if (!financiadorSeleccionado) return false;
    if (!requiereElegibilidadManual) return true;
    return elegibilidadManual[financiadorSeleccionado.id] === true;
  }, [elegibilidadManual, financiadorSeleccionado, requiereElegibilidadManual]);
  const puedeAdmitirPaciente = Boolean(pacienteSeleccionado && financiadorSeleccionado && elegibilidadCompleta);
  // Si hay paciente identificado, la grilla muestra solo sus turnos activos del dia
  const turnosBase = useMemo(() => {
    if (!pacienteSeleccionado) return turnos;
    const docPaciente = `${pacienteSeleccionado.tipoDocumento}${pacienteSeleccionado.numeroDocumento}`
      .replace(/\s+/g, "").toUpperCase();
    return turnos.filter(item => {
      const docTurno = item.documento.replace(/\s+/g, "").toUpperCase();
      return docTurno.length > 0 && docTurno !== "-" && docTurno.includes(docPaciente);
    });
  }, [pacienteSeleccionado, turnos]);
  const turnosVisibles = useMemo(() => {
    const pacienteLike = filtroPaciente.trim().toUpperCase();
    const financiadorLike = filtroFinanciador.trim().toUpperCase();
    return turnosBase.filter(item => {
      const byPaciente = pacienteLike.length === 0 ? true : item.paciente.toUpperCase().includes(pacienteLike);
      const byFinanciador = financiadorLike.length === 0 ? true : item.financiador.toUpperCase().includes(financiadorLike);
      return byPaciente && byFinanciador;
    });
  }, [filtroFinanciador, filtroPaciente, turnosBase]);
  const turnoSeleccionado = useMemo(() => turnoSeleccionadoId ? turnosVisibles.find(item => item.id === turnoSeleccionadoId) ?? null : null, [turnoSeleccionadoId, turnosVisibles]);
  useEffect(() => {
    if (!turnoSeleccionadoId) {
      return;
    }

    if (!turnoSeleccionado || turnoSeleccionado.estado !== "PROGRAMADO") {
      setTurnoSeleccionadoId(null);
    }
  }, [turnoSeleccionadoId, turnoSeleccionado]);
  const turnoSeleccionadoConPaciente = Boolean(turnoSeleccionado && turnoSeleccionado.documento && turnoSeleccionado.documento !== "-" && turnoSeleccionado.paciente && turnoSeleccionado.paciente !== "Por identificar");
  const puedeConfirmarArriboProgramado = Boolean(turnoSeleccionado && turnoSeleccionado.estado === "PROGRAMADO" && puedeAdmitirPaciente && fechaEsHoy);
  // Habilitado cuando hay un turno PROGRAMADO seleccionado (con o sin paciente buscado previamente)
  const puedeIniciarAdmitirProgramado = Boolean(fechaEsHoy && turnoSeleccionado && turnoSeleccionado.estado === "PROGRAMADO");
  const puedeIniciarAtencionProgramada = Boolean(turnoSeleccionado && turnoSeleccionado.estado === "EN_SALA_DE_ESPERA");
  const puedeFinalizarAtencionProgramada = Boolean(turnoSeleccionado && (turnoSeleccionado.estado === "EN_ATENCION" || turnoSeleccionado.estado === "EN_OBSERVACION"));
  const practicasTurnoSeleccionado = useMemo(() => {
    if (!turnoSeleccionado) {
      return [];
    }
    return practicasPorTurno[turnoSeleccionado.id] ?? [];
  }, [practicasPorTurno, turnoSeleccionado]);
  const puedeGestionarPracticasTurno = Boolean(pacienteSeleccionado && turnoSeleccionado && turnoSeleccionado.estado === "PROGRAMADO");
  const practicasDemandaDisponibles = useMemo(() => {
    if (!servicioDemandaId) {
      return [];
    }
    return selectores.practicas.filter(item => item.servicioId === servicioDemandaId).filter(item => item.nombre.toUpperCase().includes("CONSULTA"));
  }, [selectores.practicas, servicioDemandaId]);
  const agendasDemandaFiltradas = useMemo(() => {
    if (!servicioDemandaId) {
      return [];
    }
    const agendasServicio = agendasDemandaHoy.filter(item => item.servicioId === servicioDemandaId);
    const espontaneas = agendasServicio.filter(item => item.tipoAgenda.toUpperCase().includes("ESPONT"));
    return espontaneas.length > 0 ? espontaneas : agendasServicio;
  }, [agendasDemandaHoy, servicioDemandaId]);
  const agendaDemandaSeleccionada = useMemo(() => agendasDemandaFiltradas.find(item => item.id === agendaDemandaId) ?? null, [agendaDemandaId, agendasDemandaFiltradas]);
  const turnosOfertaDemanda = useMemo(() => {
    if (!agendaDemandaSeleccionada || agendaDemandaSeleccionada.tipoAgenda.toUpperCase().includes("ESPONT")) {
      return [];
    }
    const hoy = new Date().toLocaleDateString("es-AR");
    return turnos.filter(item => item.estado === "PROGRAMADO").filter(item => item.servicio === agendaDemandaSeleccionada.servicio).filter(item => item.efector === agendaDemandaSeleccionada.efector).filter(item => item.turno.startsWith(hoy));
  }, [agendaDemandaSeleccionada, turnos]);
  const edadPaciente = useMemo(() => {
    if (!pacienteSeleccionado?.fechaNacimiento) {
      return "-";
    }
    const nacimiento = new Date(pacienteSeleccionado.fechaNacimiento);
    if (Number.isNaN(nacimiento.getTime())) {
      return "-";
    }
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || mes === 0 && hoy.getDate() < nacimiento.getDate()) {
      edad -= 1;
    }
    return String(Math.max(edad, 0));
  }, [pacienteSeleccionado]);
  const fechaNacimientoPaciente = useMemo(() => {
    if (!pacienteSeleccionado?.fechaNacimiento) {
      return "-";
    }
    const nacimiento = new Date(pacienteSeleccionado.fechaNacimiento);
    if (Number.isNaN(nacimiento.getTime())) {
      return pacienteSeleccionado.fechaNacimiento;
    }
    return nacimiento.toLocaleDateString("es-AR");
  }, [pacienteSeleccionado]);
  const iconoSexo = useMemo(() => {
    const sexo = (pacienteSeleccionado?.sexoBiologico ?? "").trim().toUpperCase();
    if (sexo.startsWith("F")) {
      return "♀";
    }
    if (sexo.startsWith("M")) {
      return "♂";
    }
    return "●";
  }, [pacienteSeleccionado]);
  useEffect(() => {
    if (practicaId && !practicasDisponibles.some(item => item.id === practicaId)) {
      setPracticaId("");
    }
  }, [practicaId, practicasDisponibles]);
  useEffect(() => {
    if (efectorId && !efectoresDisponibles.some(item => item.id === efectorId)) {
      setEfectorId("");
    }
  }, [efectorId, efectoresDisponibles]);
  useEffect(() => {
    if (!servicioDemandaId) {
      setPracticaDemandaId("");
      return;
    }
    if (practicaDemandaId && practicasDemandaDisponibles.some(item => item.id === practicaDemandaId)) {
      return;
    }
    setPracticaDemandaId(practicasDemandaDisponibles[0]?.id ?? "");
  }, [practicaDemandaId, practicasDemandaDisponibles, servicioDemandaId]);
  useEffect(() => {
    if (!agendaDemandaId) {
      setAgendaDemandaDetalle(null);
      setBloqueDemandaId("");
      return;
    }
    const run = async () => {
      try {
        const detail = await getAgendaById(agendaDemandaId);
        setAgendaDemandaDetalle(detail);
        setBloqueDemandaId(detail.bloques[0]?.id ?? "");
      } catch {
        setAgendaDemandaDetalle(null);
        setBloqueDemandaId("");
      }
    };
    void run();
  }, [agendaDemandaId]);
  useEffect(() => {
    if (modoArriboProgramado) {
      setTurnoSeleccionadoId(null);
    }
  }, [modoArriboProgramado]);
  useEffect(() => {
    if (financiadoresVigentes.length === 0) {
      setFinanciadorPlanId("");
      setElegibilidadManual({});
      return;
    }
    if (!financiadoresVigentes.some(item => item.id === financiadorPlanId)) {
      setFinanciadorPlanId(financiadoresVigentes[0].id);
    }
    setElegibilidadManual(prev => {
      const next: Record<string, boolean> = {};
      financiadoresVigentes.forEach(item => {
        next[item.id] = prev[item.id] ?? isPrivadoFinanciador(item);
      });
      return next;
    });
  }, [financiadoresVigentes, financiadorPlanId]);
  const resetFinanciadorForm = () => {
    setFinanciadorEditandoId(null);
    setFinanciadorFormId("");
    setPlanFormId("");
    setNumeroAfiliadoForm("");
    setFinanciadorModalError(null);
  };
  const inicializarCoberturaPaciente = (paciente: PacienteIdentificadoAdmision) => {
    const mapped = mapFinanciadoresPaciente(paciente.financiadores ?? []);
    setFinanciadoresPaciente(mapped);
    const primerVigente = mapped.find(item => item.vigente);
    setFinanciadorPlanId(primerVigente?.id ?? "");
    const elegibilidadInicial: Record<string, boolean> = {};
    mapped.filter(item => item.vigente).forEach(item => {
      elegibilidadInicial[item.id] = isPrivadoFinanciador(item);
    });
    setElegibilidadManual(elegibilidadInicial);
  };
  const onAbrirModalFinanciador = () => {
    if (!pacienteSeleccionado) {
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
  const onEditarFinanciador = (financiador: FinanciadorPacienteAdmision) => {
    if (isPrivadoFinanciador(financiador)) {
      setFinanciadorModalError("El financiador Privado/Particular no puede editarse.");
      return;
    }
    setFinanciadorEditandoId(financiador.id);
    setFinanciadorFormId(financiador.financiadorId);
    setPlanFormId(financiador.planId);
    setNumeroAfiliadoForm(financiador.numeroAfiliado);
    setFinanciadorModalError(null);
    setFinanciadorModalInfo(`Editando ${financiador.financiador} | ${financiador.plan}.`);
  };
  const onFinalizarVigencia = (financiador: FinanciadorPacienteAdmision) => {
    if (isPrivadoFinanciador(financiador)) {
      setFinanciadorModalError("El financiador Privado/Particular no puede finalizar vigencia.");
      return;
    }
    const next = financiadoresPaciente.map(item => item.id === financiador.id ? {
      ...item,
      vigente: false
    } : item);
    setFinanciadoresPaciente(next);
    setElegibilidadManual(prev => ({
      ...prev,
      [financiador.id]: false
    }));
    if (financiadorEditandoId === financiador.id) {
      resetFinanciadorForm();
    }
    setFinanciadorModalInfo(`Se finalizo vigencia para ${financiador.financiador} | ${financiador.plan}.`);
    setFinanciadorModalError(null);
  };
  const onGuardarFinanciador = () => {
    if (!puedeGuardarFinanciador) {
      return;
    }
    const financiadorCatalogo = CATALOGO_FINANCIADORES.find(item => item.id === financiadorFormId);
    const planCatalogo = financiadorCatalogo?.planes.find(item => item.id === planFormId);
    if (!financiadorCatalogo || !planCatalogo) {
      setFinanciadorModalError("Seleccione financiador y plan validos.");
      return;
    }
    let next = financiadoresPaciente;
    if (esEdicionFinanciador && financiadorEditandoId) {
      next = next.map(item => item.id === financiadorEditandoId ? {
        ...item,
        vigente: false
      } : item);
      setElegibilidadManual(prev => ({
        ...prev,
        [financiadorEditandoId]: false
      }));
    }
    const nuevoFinanciadorId = `adm-fin-${financiadorFormId}-${planFormId}-${Date.now()}`;
    const nuevo: FinanciadorPacienteAdmision = {
      id: nuevoFinanciadorId,
      financiadorId: financiadorCatalogo.id,
      planId: planCatalogo.id,
      financiador: financiadorCatalogo.nombre,
      plan: planCatalogo.nombre,
      numeroAfiliado: normalizarAfiliado(numeroAfiliadoForm),
      vigente: true
    };
    next = [...next, nuevo];
    setFinanciadoresPaciente(next);
    setFinanciadorPlanId(nuevo.id);
    setElegibilidadManual(prev => ({
      ...prev,
      [nuevo.id]: isPrivadoFinanciador(nuevo)
    }));
    setFinanciadorModalError(null);
    setFinanciadorModalInfo(esEdicionFinanciador ? "Se actualizo financiador/plan y se finalizo vigencia de la combinacion anterior." : `Se agrego el financiador ${nuevo.financiador} | ${nuevo.plan}.`);
    setInfo("Datos de financiador/plan actualizados correctamente.");
    resetFinanciadorForm();
  };
  const loadTurnos = async () => {
    setSearching(true);
    setError(null);
    try {
      const data = await buscarTurnosAdmision({
        servicioId: servicioId || undefined,
        practicaId: practicaId || undefined,
        tipoEfector: tipoEfector || undefined,
        efectorId: efectorId || undefined,
        estado: estado || undefined,
        fecha: fecha || undefined
      });
      setTurnos(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudieron buscar turnos de admision.";
      setError(message);
      setTurnos([]);
    } finally {
      setSearching(false);
    }
  };
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tipos, data] = await Promise.all([getTiposDocumento(), getSelectoresAdmision()]);
        setTiposDocumento(tipos);
        if (tipos.length > 0 && !tipos.some(item => item.codigo === tipoDocumento)) {
          setTipoDocumento(tipos[0].codigo);
        }
        setSelectores(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : "No se pudo inicializar admision.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    void loadTurnos();
  }, [loading, servicioId, practicaId, tipoEfector, efectorId, estado, fecha]);
  const onBuscar = async (event: FormEvent) => {
    event.preventDefault();
    await loadTurnos();
  };
  const onIdentificarPaciente = async (event: FormEvent) => {
    event.preventDefault();
    if (!tipoDocumento || !numeroDocumento.trim()) {
      setError("Debe completar tipo y numero de documento para identificar paciente.");
      return;
    }
    setLoadingIdentificacion(true);
    setError(null);
    setInfo(null);
    setCandidatosPaciente([]);
    setPacienteSeleccionado(null);
    setModoArriboProgramado(false);
    setTurnosPacienteDia([]);
    setTurnoSeleccionadoId(null);
    try {
      const data = await identificarPacienteAdmision(tipoDocumento, numeroDocumento.trim());
      setCandidatosPaciente(data);
      if (data.length === 0) {
        setInfo("No se encontraron pacientes con ese documento.");
      } else if (data.length === 1) {
        setPacienteSeleccionado(data[0]);
        inicializarCoberturaPaciente(data[0]);
        setCabeceraExpandida(false);
        setInfo("Paciente identificado correctamente.");
      } else {
        setInfo(`Se encontraron ${data.length} pacientes. Seleccione uno para continuar.`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo identificar paciente.";
      setError(message);
    } finally {
      setLoadingIdentificacion(false);
    }
  };
  const onConfirmarArribo = async (turnoId: string) => {
    setArribandoId(turnoId);
    setError(null);
    setInfo(null);
    setAdmissionSuccessMessage(null);
    try {
      if (!fechaEsHoy)
      {
        setError("Solo es posible admitir pacientes en la fecha actual del sistema.");
        return;
      }

      if (!pacienteSeleccionado) {
        setError("Debe identificar y seleccionar un paciente antes de admitir.");
        return;
      }
      if (!financiadorSeleccionado) {
        setError("Debe seleccionar o agregar un financiador vigente para continuar con la admision.");
        return;
      }
      if (!elegibilidadCompleta) {
        setError("Debe verificar manualmente la elegibilidad en todos los financiadores activos no privados.");
        return;
      }
      // Práctica asistencial: fuente primaria = prácticas explícitamente asociadas al turno.
      // Si el turno aún no tiene práctica registrada en estado (flujo sin confirmar práctica),
      // se envía como undefined — el backend acepta el campo como opcional.
      const practicaNombreOrigen = practicasTurnoSeleccionado[0] ?? undefined;

      const data = await confirmarArriboTurno(turnoId, {
        pacienteId: pacienteSeleccionado.id,
        paciente: pacienteSeleccionado.apellidosNombres,
        documento: `${pacienteSeleccionado.tipoDocumento} ${pacienteSeleccionado.numeroDocumento}`,
        financiador: `${financiadorSeleccionado.financiador} | ${financiadorSeleccionado.plan}`,
        financiadorId: financiadorSeleccionado.financiadorId || undefined,
        planId: financiadorSeleccionado.planId || undefined,
        servicioNombre: turnoSeleccionado?.servicio || undefined,
        centroId: centroId && centroId !== "global" ? centroId : undefined,
        practicaOrigenNombre: practicaNombreOrigen,
        profesionalNombre: turnoSeleccionado?.efector || undefined,
        tipoOrigen: "TURNO",
      });

      const eventoFacturacion = await obtenerEventoFacturacionTurno(turnoId).catch(() => null);

      // Refleja el nuevo estado en pantalla de forma inmediata.
      setTurnos((prev) =>
        prev.map((item) =>
          item.id === turnoId
            ? {
                ...item,
                estado: data.estado,
                estadoTurno: data.estadoTurno,
                llegada: data.llegada
              }
            : item
        )
      );
      setTurnosPacienteDia((prev) =>
        prev.map((item) =>
          item.id === turnoId
            ? {
                ...item,
                estado: data.estado,
                estadoTurno: data.estadoTurno,
                llegada: data.llegada
              }
            : item
        )
      );

      await loadTurnos();
      setPacienteSeleccionado(null);
      setCandidatosPaciente([]);
      setCabeceraExpandida(false);
      setModoArriboProgramado(false);
      setTurnosPacienteDia([]);
      setTurnoSeleccionadoId(null);
      setFinanciadoresPaciente([]);
      setFinanciadorPlanId("");
      setElegibilidadManual({});
      setAdmissionSuccessMessage("Paciente Admitido OK");
      if (eventoFacturacion) {
        setInfo(`Facturacion: ${eventoFacturacion.estado}${eventoFacturacion.processedAt ? ` (${eventoFacturacion.processedAt})` : ""}${eventoFacturacion.errorDetalle ? ` - ${eventoFacturacion.errorDetalle}` : ""}`);
      } else if (data.facturacionEventoEstado) {
        setInfo(`Facturacion: ${data.facturacionEventoEstado}${data.facturacionEventoDetalle ? ` - ${data.facturacionEventoDetalle}` : ""}`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo confirmar arribo.";
      setError(message);
    } finally {
      setArribandoId(null);
    }
  };
  const normalizarDocumento = (value: string): string => {
    return value.replace(/\s+/g, "").toUpperCase();
  };
  const normalizarFinanciador = (value: string): string => {
    const compact = value.replace(/\s+/g, " ").trim().toUpperCase();
    return compact === "-" ? "" : compact;
  };
  useEffect(() => {
    if (!turnoSeleccionado || financiadoresVigentes.length === 0) {
      return;
    }

    const financiadorTurno = normalizarFinanciador(turnoSeleccionado.financiador);
    if (!financiadorTurno) {
      return;
    }

    const coincidencia = financiadoresVigentes.find(item => {
      const label = normalizarFinanciador(`${item.financiador} | ${item.plan}`);
      return label === financiadorTurno;
    });

    if (coincidencia && coincidencia.id !== financiadorPlanId) {
      setFinanciadorPlanId(coincidencia.id);
    }
  }, [turnoSeleccionado, financiadoresVigentes, financiadorPlanId]);
  const onFiltrarTurnosPacienteDelDia = async () => {
    if (!pacienteSeleccionado) {
      return;
    }
    setError(null);
    setInfo(null);
    setModoArriboProgramado(true);
    setSearching(true);
    setTurnoSeleccionadoId(null);
    try {
      const turnosHoy = await buscarTurnosAdmision({
        fecha: toIsoDate(new Date())
      });
      const documentoPaciente = normalizarDocumento(`${pacienteSeleccionado.tipoDocumento}${pacienteSeleccionado.numeroDocumento}`);
      const filtrados = turnosHoy.filter(item => {
        const documentoTurno = normalizarDocumento(item.documento);
        return documentoTurno.length > 0 && documentoTurno.includes(documentoPaciente);
      });
      setTurnosPacienteDia(filtrados);
      if (filtrados.length === 0) {
        setModalSinTurnosOpen(true);
        setInfo("No hay turnos del paciente para la fecha actual.");
      } else {
        setInfo(`Se encontraron ${filtrados.length} turnos del paciente para hoy.`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudieron consultar turnos del paciente para hoy.";
      setError(message);
      setTurnosPacienteDia([]);
    } finally {
      setSearching(false);
    }
  };
  const parseDocumentoTurno = (value: string): {
    tipoDocumento: string;
    numeroDocumento: string;
  } | null => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "-") {
      return null;
    }
    const parts = trimmed.split(/\s+/g).filter(part => part.length > 0);
    if (parts.length < 2) {
      return null;
    }
    return {
      tipoDocumento: parts[0].toUpperCase(),
      numeroDocumento: parts.slice(1).join("")
    };
  };
  const normalizarNombre = (value: string): string => {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9\s,]/g, " ").replace(/\s+/g, " ").trim();
  };
  const onAbrirAdmitirProgramadoDesdeTurno = async () => {
    if (!turnoSeleccionado) {
      setError("Debe seleccionar un turno para continuar.");
      return;
    }
    if (!fechaEsHoy) {
      setError("Solo es posible admitir pacientes en la fecha actual del sistema.");
      return;
    }
    if (turnoSeleccionado.estado !== "PROGRAMADO") {
      setError("El turno seleccionado debe estar en estado PROGRAMADO.");
      return;
    }
    const doc = parseDocumentoTurno(turnoSeleccionado.documento);
    if (!doc) {
      setError("No se pudo resolver tipo y numero de documento desde el turno seleccionado.");
      return;
    }
    setLoadingPacienteProgramado(true);
    setError(null);
    setInfo(null);
    try {
      const candidatos = await identificarPacienteAdmision(doc.tipoDocumento, doc.numeroDocumento);
      if (candidatos.length === 0) {
        setError("No se pudo identificar paciente para el turno seleccionado.");
        return;
      }
      const nombreTurno = normalizarNombre(turnoSeleccionado.paciente);
      const candidato = candidatos.find(item => normalizarNombre(item.apellidosNombres) === nombreTurno) ?? candidatos.find(item => normalizarNombre(item.apellidosNombres).includes(nombreTurno)) ?? candidatos[0];
      setPacienteSeleccionado(candidato);
      inicializarCoberturaPaciente(candidato);
      setCabeceraExpandida(false);
      setPasoModalProgramado(1);
      setModalProgramadoOpen(true);
      setInfo("Paciente identificado desde el turno seleccionado.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo identificar paciente desde el turno seleccionado.";
      setError(message);
    } finally {
      setLoadingPacienteProgramado(false);
    }
  };
  const onConfirmarPacienteProgramado = async () => {
    if (!puedeConfirmarArriboProgramado) {
      setError("Debe validar cobertura/elegibilidad y mantener un turno Programado seleccionado.");
      return;
    }
    setModalProgramadoOpen(false);
    await onAdmitirTurnoSeleccionado();
  };
  const onAdmitirPacienteProgramado = async () => {
    if (!turnoSeleccionado) {
      setError("Debe seleccionar un turno para continuar.");
      return;
    }

    if (!fechaEsHoy) {
      setError("Solo es posible admitir pacientes en la fecha actual del sistema.");
      return;
    }

    if (pacienteSeleccionado) {
      const docTurno = parseDocumentoTurno(turnoSeleccionado.documento);
      if (docTurno)
      {
        const docPaciente = normalizarDocumento(`${pacienteSeleccionado.tipoDocumento}${pacienteSeleccionado.numeroDocumento}`);
        const docTurnoNormalizado = normalizarDocumento(`${docTurno.tipoDocumento}${docTurno.numeroDocumento}`);
        if (!docTurnoNormalizado.includes(docPaciente))
        {
          setError("El paciente identificado no coincide con el documento del turno seleccionado.");
          return;
        }
      }

      setPasoModalProgramado(1);
      setModalProgramadoOpen(true);
      return;
    }

    await onAbrirAdmitirProgramadoDesdeTurno();
  };
  const requiereConfirmacionDiscrepancia = (turno: TurnoAdmision): boolean => {
    if (!financiadorSeleccionado) {
      return false;
    }
    const financiadorTurno = normalizarFinanciador(turno.financiador);
    if (!financiadorTurno) {
      return false;
    }
    const financiadorPaciente = normalizarFinanciador(`${financiadorSeleccionado.financiador} | ${financiadorSeleccionado.plan}`);
    return financiadorTurno !== financiadorPaciente;
  };
  const onAdmitirTurnoSeleccionado = async () => {
    if (!turnoSeleccionado) {
      setError("Debe seleccionar un turno programado para confirmar arribo.");
      return;
    }
    if (turnoSeleccionado.estado !== "PROGRAMADO") {
      setError("Solo se puede admitir un turno en estado PROGRAMADO.");
      return;
    }
    if (requiereConfirmacionDiscrepancia(turnoSeleccionado)) {
      setTurnoDiscrepancia(turnoSeleccionado);
      return;
    }
    await onConfirmarArribo(turnoSeleccionado.id);
  };
  const onAceptarDiscrepanciaFinanciador = async () => {
    if (!turnoDiscrepancia) {
      return;
    }
    const turnoId = turnoDiscrepancia.id;
    setTurnoDiscrepancia(null);
    await onConfirmarArribo(turnoId);
  };
  const onCambiarEstadoTurnoSeleccionado = async (estadoDestino: string, descripcion: string) => {
    if (!turnoSeleccionado) {
      setError("Debe seleccionar un turno para actualizar estado.");
      return;
    }
    if (!fechaEsHoy) {
      setError("Solo es posible actualizar estados en la fecha actual del sistema.");
      return;
    }
    setActualizandoEstadoId(turnoSeleccionado.id);
    setError(null);
    setInfo(null);
    try {
      await actualizarEstadoTurno(turnoSeleccionado.id, {
        estado: estadoDestino
      });
      setInfo(descripcion);
      await loadTurnos();
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo actualizar el estado del turno.";
      setError(message);
    } finally {
      setActualizandoEstadoId(null);
    }
  };
  const onIniciarAtencionTurnoSeleccionado = async () => {
    await onCambiarEstadoTurnoSeleccionado("EN_ATENCION", "Paciente enviado a atencion.");
  };
  const onFinalizarAtencionTurnoSeleccionado = async (estadoFinal: "ATENDIDO" | "NO_ATENDIDO") => {
    const mensaje = estadoFinal === "ATENDIDO" ? "Atencion finalizada con estado ATENDIDO." : "Atencion finalizada con estado NO_ATENDIDO.";
    await onCambiarEstadoTurnoSeleccionado(estadoFinal, mensaje);
  };
  const onMoverFechaAdmision = (dias: number) => {
    const base = new Date(`${fecha}T00:00:00`);
    const seed = Number.isNaN(base.getTime()) ? new Date() : base;
    seed.setDate(seed.getDate() + dias);
    setFecha(toIsoDate(seed));
  };
  const onAbrirDemandaEspontanea = async () => {
    if (!pacienteSeleccionado) {
      setError("Debe identificar paciente para iniciar demanda espontanea.");
      return;
    }
    setError(null);
    setInfo(null);
    setLoadingAgendasDemanda(true);
    try {
      const agendas = await getAgendas(undefined, true);
      const hoy = toIsoDate(new Date());
      const vigentesHoy = agendas.filter(item => isAgendaVigenteEnFecha(item, hoy));
      setAgendasDemandaHoy(vigentesHoy);
      setServicioDemandaId(servicioId || vigentesHoy[0]?.servicioId || "");
      setPracticaDemandaId("");
      setAgendaDemandaId("");
      setAgendaDemandaDetalle(null);
      setBloqueDemandaId("");
      setTurnoOfertaId("");
      setPasoModalDemanda(1);
      setModalDemandaOpen(true);
      if (vigentesHoy.length === 0) {
        setInfo("No hay agendas activas para demanda espontanea en la fecha actual.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudieron cargar agendas para demanda espontanea.";
      setError(message);
    } finally {
      setLoadingAgendasDemanda(false);
    }
  };
  const onConfirmarDemandaEspontanea = () => {
    if (!agendaDemandaSeleccionada || !practicaDemandaId) {
      setError("Debe completar servicio, practica y agenda para continuar.");
      return;
    }
    const tipoAgenda = agendaDemandaSeleccionada.tipoAgenda.toUpperCase();
    if (!tipoAgenda.includes("ESPONT") && turnoOfertaId) {
      setTurnoSeleccionadoId(turnoOfertaId);
      setModoArriboProgramado(true);
      setModalDemandaOpen(false);
      setInfo("Se asigno turno disponible en agenda programada. Continúe con el circuito de turno programado.");
      return;
    }
    setModalDemandaOpen(false);
    if (tipoAgenda.includes("ESPONT")) {
      setInfo("Demanda espontanea asociada a agenda espontanea. Continúe con validacion de practicas y cierre de admision.");
      return;
    }
    setInfo("Demanda espontanea en agenda programada iniciada. Se preve la generacion de slot DEP en el cierre del circuito.");
  };
  const onCerrarAdmissionSuccess = () => {
    setAdmissionSuccessMessage(null);
  };
  const onAbrirAgregarPracticas = async () => {
    if (!turnoSeleccionado) {
      setError("Debe seleccionar un turno para gestionar practicas.");
      return;
    }
    setLoadingPracticasModal(true);
    setError(null);
    try {
      const hoy = toIsoDate(new Date());
      const agendas = await getAgendas(undefined, true);
      const agenda = agendas.filter(item => isAgendaVigenteEnFecha(item, hoy)).find(item => item.servicio === turnoSeleccionado.servicio && item.efector === turnoSeleccionado.efector);
      if (!agenda) {
        setError("No se encontro agenda activa para el turno seleccionado.");
        return;
      }
      const detail = await getAgendaById(agenda.id);
      const bloque = detail.bloques[0];
      const practicasBloque = (bloque?.practicas ?? []).map(item => item.nombre.trim()).filter(item => item.length > 0);
      const practicasActuales = practicasPorTurno[turnoSeleccionado.id] ?? [];
      const faltantes = practicasBloque.filter(item => !practicasActuales.some(actual => actual.toUpperCase() === item.toUpperCase()));
      setBloquePracticasNombre(bloque?.nombre ?? "Bloque de programacion");
      setPracticasDisponiblesModal(faltantes);
      setPracticasSeleccionadasModal([]);
      setModalPracticasOpen(true);
      if (faltantes.length === 0) {
        setInfo("No hay practicas adicionales para agregar en este bloque.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudieron cargar practicas para el turno seleccionado.";
      setError(message);
    } finally {
      setLoadingPracticasModal(false);
    }
  };
  const onConfirmarAgregarPracticas = () => {
    if (!turnoSeleccionado) {
      return;
    }
    if (practicasSeleccionadasModal.length === 0) {
      setError("Seleccione al menos una practica para agregar.");
      return;
    }
    setPracticasPorTurno(prev => {
      const actuales = prev[turnoSeleccionado.id] ?? [];
      const merged = [...actuales];
      practicasSeleccionadasModal.forEach(item => {
        if (!merged.some(actual => actual.toUpperCase() === item.toUpperCase())) {
          merged.push(item);
        }
      });
      return {
        ...prev,
        [turnoSeleccionado.id]: merged
      };
    });
    setModalPracticasOpen(false);
    setInfo(`Practicas agregadas: ${practicasSeleccionadasModal.join(", ")}.`);
  };
  const onSolicitarEliminarPractica = (practica: string) => {
    setError(null);
    setPracticaAEliminar(practica);
  };
  const onConfirmarEliminarPractica = () => {
    if (!turnoSeleccionado || !practicaAEliminar) {
      return;
    }
    setPracticasPorTurno(prev => {
      const actuales = prev[turnoSeleccionado.id] ?? [];
      return {
        ...prev,
        [turnoSeleccionado.id]: actuales.filter(item => item !== practicaAEliminar)
      };
    });
    setInfo(`Practica eliminada: ${practicaAEliminar}.`);
    setPracticaAEliminar(null);
  };
  return {
    tiposDocumento,
    setTiposDocumento,
    tipoDocumento,
    setTipoDocumento,
    numeroDocumento,
    setNumeroDocumento,
    loadingIdentificacion,
    setLoadingIdentificacion,
    candidatosPaciente,
    setCandidatosPaciente,
    pacienteSeleccionado,
    setPacienteSeleccionado,
    cabeceraExpandida,
    setCabeceraExpandida,
    financiadoresPaciente,
    setFinanciadoresPaciente,
    financiadorPlanId,
    setFinanciadorPlanId,
    elegibilidadManual,
    setElegibilidadManual,
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
    selectores,
    setSelectores,
    servicioId,
    setServicioId,
    practicaId,
    setPracticaId,
    tipoEfector,
    setTipoEfector,
    efectorId,
    setEfectorId,
    estado,
    setEstado,
    fecha,
    setFecha,
    turnos,
    setTurnos,
    loading,
    setLoading,
    searching,
    setSearching,
    arribandoId,
    setArribandoId,
    actualizandoEstadoId,
    setActualizandoEstadoId,
    fechaEsHoy,
    modoArriboProgramado,
    setModoArriboProgramado,
    turnosPacienteDia,
    setTurnosPacienteDia,
    turnoSeleccionadoId,
    setTurnoSeleccionadoId,
    mostrarFiltrosAvanzados,
    setMostrarFiltrosAvanzados,
    filtroPaciente,
    setFiltroPaciente,
    filtroFinanciador,
    setFiltroFinanciador,
    modalProgramadoOpen,
    setModalProgramadoOpen,
    pasoModalProgramado,
    setPasoModalProgramado,
    loadingPacienteProgramado,
    setLoadingPacienteProgramado,
    modalPracticasOpen,
    setModalPracticasOpen,
    loadingPracticasModal,
    setLoadingPracticasModal,
    bloquePracticasNombre,
    setBloquePracticasNombre,
    practicasDisponiblesModal,
    setPracticasDisponiblesModal,
    practicasSeleccionadasModal,
    setPracticasSeleccionadasModal,
    practicasPorTurno,
    setPracticasPorTurno,
    practicaAEliminar,
    setPracticaAEliminar,
    modalDemandaOpen,
    setModalDemandaOpen,
    pasoModalDemanda,
    setPasoModalDemanda,
    loadingAgendasDemanda,
    setLoadingAgendasDemanda,
    agendasDemandaHoy,
    setAgendasDemandaHoy,
    agendaDemandaId,
    setAgendaDemandaId,
    agendaDemandaDetalle,
    setAgendaDemandaDetalle,
    bloqueDemandaId,
    setBloqueDemandaId,
    servicioDemandaId,
    setServicioDemandaId,
    practicaDemandaId,
    setPracticaDemandaId,
    turnoOfertaId,
    setTurnoOfertaId,
    turnoDiscrepancia,
    setTurnoDiscrepancia,
    modalSinTurnosOpen,
    setModalSinTurnosOpen,
    error,
    setError,
    info,
    setInfo,
    admissionSuccessMessage,
    setAdmissionSuccessMessage,
    practicasDisponibles,
    efectoresDisponibles,
    financiadoresVigentes,
    financiadorSeleccionado,
    financiadorCatalogoSeleccionado,
    planesDisponiblesForm,
    esEdicionFinanciador,
    esCombinacionDuplicada,
    numeroAfiliadoValido,
    puedeGuardarFinanciador,
    requiereElegibilidadManual,
    elegibilidadCompleta,
    puedeAdmitirPaciente,
    turnosBase,
    turnosVisibles,
    turnoSeleccionado,
    puedeConfirmarArriboProgramado,
    puedeIniciarAdmitirProgramado,
    puedeIniciarAtencionProgramada,
    puedeFinalizarAtencionProgramada,
    practicasTurnoSeleccionado,
    puedeGestionarPracticasTurno,
    practicasDemandaDisponibles,
    agendasDemandaFiltradas,
    agendaDemandaSeleccionada,
    turnosOfertaDemanda,
    edadPaciente,
    fechaNacimientoPaciente,
    iconoSexo,
    resetFinanciadorForm,
    inicializarCoberturaPaciente,
    onAbrirModalFinanciador,
    onCerrarModalFinanciador,
    onEditarFinanciador,
    onFinalizarVigencia,
    onGuardarFinanciador,
    loadTurnos,
    onBuscar,
    onIdentificarPaciente,
    onConfirmarArribo,
    normalizarDocumento,
    normalizarFinanciador,
    onFiltrarTurnosPacienteDelDia,
    parseDocumentoTurno,
    normalizarNombre,
    onAbrirAdmitirProgramadoDesdeTurno,
    onConfirmarPacienteProgramado,
    onAdmitirPacienteProgramado,
    requiereConfirmacionDiscrepancia,
    onAdmitirTurnoSeleccionado,
    onAceptarDiscrepanciaFinanciador,
    onIniciarAtencionTurnoSeleccionado,
    onFinalizarAtencionTurnoSeleccionado,
    onMoverFechaAdmision,
    onAbrirDemandaEspontanea,
    onConfirmarDemandaEspontanea,
    onCerrarAdmissionSuccess,
    onAbrirAgregarPracticas,
    onConfirmarAgregarPracticas,
    onSolicitarEliminarPractica,
    onConfirmarEliminarPractica
  };
}