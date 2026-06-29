import { FormEvent, useEffect, useMemo, useState } from "react";
import { addBloque, AgendaDetail, BloquePracticaRequest, CreateGrupoProfesionalMiembroRequest, AgendaSummary, copyAgenda, createGrupoProfesional, createAgenda, DiaSemanaOption, EfectorOption, getCentros, getAgendaById, getAgendas, getDiasSemana, getDisponibilidad, getEfectores, getFrecuenciasBloque, getLugaresAtencion, getPracticas, PracticaOption, getServicios, getTiposAgenda, getTiposEfector, getTurnosACancelar, SelectorOption, setAgendaEstado, TurnoACancelar, removeBloquePractica, updateBloque, updateAgenda } from "./agendaApi";
import { XdCard } from "../ui/XdCard";
type AgendaPageProps = {
  openHu7027Token?: number;
};
export function useAgenda({
  openHu7027Token = 0
}: AgendaPageProps = {}) {
  const [agendas, setAgendas] = useState<AgendaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<"all" | "active" | "inactive">("all");
  const [nombre, setNombre] = useState("");
  const [centroId, setCentroId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [tipoEfector, setTipoEfector] = useState("");
  const [efectorId, setEfectorId] = useState("");
  const [tipoAgenda, setTipoAgenda] = useState("");
  const [visibleContactCenter, setVisibleContactCenter] = useState(true);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [observacion, setObservacion] = useState("");
  const [centros, setCentros] = useState<SelectorOption[]>([]);
  const [servicios, setServicios] = useState<SelectorOption[]>([]);
  const [tiposEfector, setTiposEfector] = useState<string[]>([]);
  const [tiposAgenda, setTiposAgenda] = useState<string[]>([]);
  const [efectores, setEfectores] = useState<EfectorOption[]>([]);
  const [selectedAgendaId, setSelectedAgendaId] = useState<string>("");
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaDetail | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<string>("");
  const [editCodigo, setEditCodigo] = useState("");
  const [editNombre, setEditNombre] = useState("");
  const [editCentroId, setEditCentroId] = useState("");
  const [editServicioId, setEditServicioId] = useState("");
  const [editTipoEfector, setEditTipoEfector] = useState("");
  const [editEfectorId, setEditEfectorId] = useState("");
  const [editTipoAgenda, setEditTipoAgenda] = useState("");
  const [editVisibleContactCenter, setEditVisibleContactCenter] = useState(true);
  const [editFechaDesde, setEditFechaDesde] = useState("");
  const [editFechaHasta, setEditFechaHasta] = useState("");
  const [editObservacion, setEditObservacion] = useState("");
  const [copyCodigo, setCopyCodigo] = useState("");
  const [copyNombre, setCopyNombre] = useState("");
  const [copyFechaDesde, setCopyFechaDesde] = useState("");
  const [copyFechaHasta, setCopyFechaHasta] = useState("");
  const [selectedBloqueId, setSelectedBloqueId] = useState("");
  const [bloqueFecha, setBloqueFecha] = useState("");
  const [bloqueHoraInicio, setBloqueHoraInicio] = useState("");
  const [bloqueHoraFin, setBloqueHoraFin] = useState("");
  const [bloqueIntervaloMinutos, setBloqueIntervaloMinutos] = useState("20");
  const [bloqueNombre, setBloqueNombre] = useState("");
  const [bloqueFechaDesde, setBloqueFechaDesde] = useState("");
  const [bloqueFechaHasta, setBloqueFechaHasta] = useState("");
  const [bloqueAtiendeFeriados, setBloqueAtiendeFeriados] = useState(false);
  const [bloqueDias, setBloqueDias] = useState<string[]>([]);
  const [bloqueDuracionTurno, setBloqueDuracionTurno] = useState("20");
  const [bloqueLugarAtencionId, setBloqueLugarAtencionId] = useState("");
  const [bloqueFrecuencia, setBloqueFrecuencia] = useState("SEMANAL");
  const [bloqueOrdenMensual, setBloqueOrdenMensual] = useState<number[]>([]);
  const [bloqueSobreturnos, setBloqueSobreturnos] = useState("0");
  const [practicaNombre, setPracticaNombre] = useState("");
  const [practicaDuracion, setPracticaDuracion] = useState("");
  const [bloquePracticas, setBloquePracticas] = useState<BloquePracticaRequest[]>([]);
  const [demandaPracticasSeleccionadas, setDemandaPracticasSeleccionadas] = useState<string[]>([]);
  const [diasSemana, setDiasSemana] = useState<DiaSemanaOption[]>([]);
  const [frecuenciasBloque, setFrecuenciasBloque] = useState<string[]>([]);
  const [lugaresAtencion, setLugaresAtencion] = useState<SelectorOption[]>([]);
  const [practicasCatalogo, setPracticasCatalogo] = useState<PracticaOption[]>([]);
  const [turnosACancelar, setTurnosACancelar] = useState<TurnoACancelar[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState("");
  const [advancedTipoAgenda, setAdvancedTipoAgenda] = useState("");
  const [advancedVisibleCC, setAdvancedVisibleCC] = useState<"all" | "yes" | "no">("all");
  const [advancedFechaDesde, setAdvancedFechaDesde] = useState("");
  const [advancedFechaHasta, setAdvancedFechaHasta] = useState("");
  const [practicasQuery, setPracticasQuery] = useState("");
  const [grupoCodigo, setGrupoCodigo] = useState("");
  const [grupoNombre, setGrupoNombre] = useState("");
  const [grupoDescripcion, setGrupoDescripcion] = useState("");
  const [grupoCentroId, setGrupoCentroId] = useState("");
  const [grupoServicioId, setGrupoServicioId] = useState("");
  const [grupoServicios, setGrupoServicios] = useState<SelectorOption[]>([]);
  const [grupoProfesionales, setGrupoProfesionales] = useState<EfectorOption[]>([]);
  const [grupoMiembrosIds, setGrupoMiembrosIds] = useState<string[]>([]);
  const [programadaBloqueTipo, setProgramadaBloqueTipo] = useState<"FIJA" | "VARIABLE">("FIJA");
  const [showVariableConfirmModal, setShowVariableConfirmModal] = useState(false);
  const [practicaPendienteEliminar, setPracticaPendienteEliminar] = useState<{
    bloqueId: string;
    nombre: string;
  } | null>(null);
  const filteredLandingAgendas = useMemo(() => {
    return agendas.filter(agenda => {
      if (centroId && agenda.centroId !== centroId) {
        return false;
      }
      if (servicioId && agenda.servicioId !== servicioId) {
        return false;
      }
      if (tipoEfector && agenda.tipoEfector !== tipoEfector) {
        return false;
      }
      if (efectorId && agenda.efectorId !== efectorId) {
        return false;
      }
      return true;
    });
  }, [agendas, centroId, servicioId, tipoEfector, efectorId]);
  const fullyFilteredAgendas = useMemo(() => {
    return filteredLandingAgendas.filter(agenda => {
      if (advancedQuery.trim()) {
        const q = advancedQuery.trim().toLowerCase();
        if (!agenda.codigo.toLowerCase().includes(q) && !agenda.nombre.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (advancedTipoAgenda && agenda.tipoAgenda !== advancedTipoAgenda) {
        return false;
      }
      if (advancedVisibleCC === "yes" && !agenda.visibleContactCenter) {
        return false;
      }
      if (advancedVisibleCC === "no" && agenda.visibleContactCenter) {
        return false;
      }
      if (advancedFechaDesde && agenda.fechaDesde < advancedFechaDesde) {
        return false;
      }
      if (advancedFechaHasta) {
        const agendaHasta = agenda.fechaHasta ?? agenda.fechaDesde;
        if (agendaHasta > advancedFechaHasta) {
          return false;
        }
      }
      return true;
    });
  }, [filteredLandingAgendas, advancedQuery, advancedTipoAgenda, advancedVisibleCC, advancedFechaDesde, advancedFechaHasta]);
  const practicasFiltradas = useMemo(() => {
    const query = practicasQuery.trim().toLowerCase();
    if (!query) {
      return practicasCatalogo;
    }
    return practicasCatalogo.filter(practica => practica.nombre.toLowerCase().includes(query));
  }, [practicasCatalogo, practicasQuery]);
  const canSubmitGrupo = useMemo(() => {
    return grupoCodigo.trim().length > 0 && grupoNombre.trim().length > 0 && grupoCentroId.trim().length > 0 && grupoServicioId.trim().length > 0 && grupoMiembrosIds.length > 0;
  }, [grupoCodigo, grupoNombre, grupoCentroId, grupoServicioId, grupoMiembrosIds]);
  function mapEstadoFiltroToApiValue(): boolean | undefined {
    if (estadoFiltro === "active") {
      return true;
    }
    if (estadoFiltro === "inactive") {
      return false;
    }
    return undefined;
  }
  async function loadAgendas() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAgendas(searchQuery, mapEstadoFiltroToApiValue());
      setAgendas(data);
      const selectedExists = data.some(a => a.id === selectedAgendaId);
      if (!selectedExists) {
        setSelectedAgendaId(data.length > 0 ? data[0].id : "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar agendas");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void loadAgendas();
  }, [searchQuery, estadoFiltro]);
  useEffect(() => {
    async function loadSelectors() {
      try {
        const [centrosData, tiposEfectorData, tiposAgendaData, diasData, frecuenciasData, lugaresData, practicasData] = await Promise.all([getCentros(), getTiposEfector(), getTiposAgenda(), getDiasSemana(), getFrecuenciasBloque(), getLugaresAtencion(), getPracticas()]);
        setCentros(centrosData);
        setTiposEfector(tiposEfectorData);
        setTiposAgenda(tiposAgendaData);
        setDiasSemana(diasData);
        setFrecuenciasBloque(frecuenciasData);
        setLugaresAtencion(lugaresData);
        setPracticasCatalogo(practicasData);
        if (centrosData.length > 0) {
          setCentroId(prev => prev || centrosData[0].id);
          setGrupoCentroId(prev => prev || centrosData[0].id);
        }
        if (tiposEfectorData.length > 0) {
          setTipoEfector(prev => prev || tiposEfectorData[0]);
        }
        if (tiposAgendaData.length > 0) {
          setTipoAgenda(prev => prev || tiposAgendaData[0]);
        }
        if (frecuenciasData.length > 0) {
          setBloqueFrecuencia(prev => prev || frecuenciasData[0]);
        }
        if (lugaresData.length > 0) {
          setBloqueLugarAtencionId(prev => prev || lugaresData[0].id);
        }
        if (practicasData.length > 0) {
          setPracticaNombre(prev => prev || practicasData[0].nombre);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar selectores de agenda");
      }
    }
    void loadSelectors();
  }, []);
  useEffect(() => {
    async function loadServicios() {
      if (!centroId) {
        setServicios([]);
        setServicioId("");
        return;
      }
      try {
        const data = await getServicios(centroId);
        setServicios(data);
        setServicioId(prev => data.some(s => s.id === prev) ? prev : data[0]?.id ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar servicios");
      }
    }
    void loadServicios();
  }, [centroId]);
  useEffect(() => {
    async function loadEfectores() {
      if (!centroId || !servicioId || !tipoEfector) {
        setEfectores([]);
        setEfectorId("");
        return;
      }
      try {
        const data = await getEfectores(centroId, servicioId, tipoEfector);
        setEfectores(data);
        setEfectorId(prev => data.some(e => e.id === prev) ? prev : data[0]?.id ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar efectores");
      }
    }
    void loadEfectores();
  }, [centroId, servicioId, tipoEfector]);
  useEffect(() => {
    async function loadGrupoServicios() {
      if (!grupoCentroId) {
        setGrupoServicios([]);
        setGrupoServicioId("");
        return;
      }
      try {
        const data = await getServicios(grupoCentroId);
        setGrupoServicios(data);
        setGrupoServicioId(prev => data.some(s => s.id === prev) ? prev : data[0]?.id ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar servicios para grupo");
      }
    }
    void loadGrupoServicios();
  }, [grupoCentroId]);
  useEffect(() => {
    async function loadGrupoProfesionales() {
      if (!grupoCentroId || !grupoServicioId) {
        setGrupoProfesionales([]);
        setGrupoMiembrosIds([]);
        return;
      }
      try {
        const data = await getEfectores(grupoCentroId, grupoServicioId, "PROFESIONAL");
        setGrupoProfesionales(data);
        setGrupoMiembrosIds(prev => prev.filter(id => data.some(d => d.id === id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar profesionales para grupo");
      }
    }
    void loadGrupoProfesionales();
  }, [grupoCentroId, grupoServicioId]);
  useEffect(() => {
    async function loadSelectedAgenda() {
      if (!selectedAgendaId) {
        setSelectedAgenda(null);
        return;
      }
      try {
        const detail = await getAgendaById(selectedAgendaId);
        setSelectedAgenda(detail);
        setEditCodigo(detail.codigo);
        setEditNombre(detail.nombre);
        setEditCentroId(detail.centroId);
        setEditServicioId(detail.servicioId);
        setEditTipoEfector(detail.tipoEfector);
        setEditEfectorId(detail.efectorId);
        setEditTipoAgenda(detail.tipoAgenda);
        setEditVisibleContactCenter(detail.visibleContactCenter);
        setEditFechaDesde(detail.fechaDesde);
        setEditFechaHasta(detail.fechaHasta ?? "");
        setEditObservacion(detail.observacion ?? "");
        setCopyCodigo(`${detail.codigo}-COPY`);
        setCopyNombre(`${detail.nombre} (copia)`);
        setCopyFechaDesde(detail.fechaDesde);
        setCopyFechaHasta(detail.fechaHasta ?? "");
        setBloqueFechaDesde(detail.fechaDesde);
        setBloqueFechaHasta(detail.fechaHasta ?? detail.fechaDesde);
        setBloqueNombre("");
        setBloqueAtiendeFeriados(false);
        setBloqueDias([]);
        setBloqueDuracionTurno("20");
        setBloqueSobreturnos("0");
        setBloquePracticas([]);
        setDemandaPracticasSeleccionadas([]);
        setPracticaNombre("");
        setPracticaDuracion("");
        if (detail.bloques.length > 0) {
          const firstBloque = detail.bloques[0];
          setSelectedBloqueId(firstBloque.id);
          setBloqueFecha(firstBloque.fecha);
          setBloqueHoraInicio(firstBloque.horaInicio);
          setBloqueHoraFin(firstBloque.horaFin);
          setBloqueIntervaloMinutos(String(firstBloque.intervaloMinutos));
        } else {
          setSelectedBloqueId("");
          setBloqueFecha("");
          setBloqueHoraInicio("");
          setBloqueHoraFin("");
          setBloqueIntervaloMinutos("20");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar detalle de agenda");
      }
    }
    void loadSelectedAgenda();
  }, [selectedAgendaId]);
  useEffect(() => {
    const selectedStillVisible = fullyFilteredAgendas.some(a => a.id === selectedAgendaId);
    if (!selectedStillVisible) {
      setSelectedAgendaId(fullyFilteredAgendas[0]?.id ?? "");
    }
  }, [fullyFilteredAgendas, selectedAgendaId]);
  useEffect(() => {
    if (openHu7027Token <= 0) {
      return;
    }
    setShowAdvanced(true);
    const agendaObjetivo = agendas.find(agenda => agenda.id === selectedAgendaId) ?? fullyFilteredAgendas[0] ?? agendas[0];
    if (agendaObjetivo) {
      setSelectedAgendaId(agendaObjetivo.id);
    }
    setTimeout(() => {
      const targetId = agendaObjetivo?.tipoAgenda === "DEMANDA_ESPONTANEA" ? "hu-8990-form" : "programacion-selector";
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 120);
  }, [openHu7027Token, agendas, selectedAgendaId, fullyFilteredAgendas]);
  const canSubmit = useMemo(() => {
    return nombre.trim().length > 0 && centroId.trim().length > 0 && servicioId.trim().length > 0 && tipoEfector.trim().length > 0 && efectorId.trim().length > 0 && tipoAgenda.trim().length > 0 && fechaDesde.trim().length > 0;
  }, [nombre, centroId, servicioId, tipoEfector, efectorId, tipoAgenda, fechaDesde]);
  const canSubmitBloqueDemanda = useMemo(() => {
    const duracion = Number(bloqueDuracionTurno);
    const sobreturnos = Number(bloqueSobreturnos);
    const agendaDesde = selectedAgenda?.fechaDesde ?? "";
    const agendaHasta = selectedAgenda?.fechaHasta ?? "";
    const bloqueDentroDeAgenda = !selectedAgenda
      || !bloqueFechaDesde
      || !bloqueFechaHasta
      || (bloqueFechaDesde >= agendaDesde && (!agendaHasta || bloqueFechaHasta <= agendaHasta));
    return bloqueNombre.trim().length > 0 && bloqueFechaDesde.trim().length > 0 && bloqueFechaHasta.trim().length > 0 && bloqueHoraInicio.trim().length > 0 && bloqueHoraFin.trim().length > 0 && bloqueLugarAtencionId.trim().length > 0 && bloqueDias.length > 0 && demandaPracticasSeleccionadas.length > 0 && Number.isFinite(duracion) && duracion > 0 && Number.isFinite(sobreturnos) && sobreturnos >= 0 && bloqueHoraInicio < bloqueHoraFin && bloqueDentroDeAgenda;
  }, [bloqueNombre, bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueHoraFin, bloqueLugarAtencionId, bloqueDias, demandaPracticasSeleccionadas, bloqueDuracionTurno, bloqueSobreturnos]);

  function validarBloqueDentroDeAgenda(fechaDesde: string, fechaHasta: string): string | null {
    if (!selectedAgenda) {
      return null;
    }

    if (!fechaDesde || !fechaHasta) {
      return "Debe completar las fechas del bloque";
    }

    if (fechaHasta < fechaDesde) {
      return "La Fecha hasta no puede ser menor que la Fecha desde";
    }

    if (fechaDesde < selectedAgenda.fechaDesde) {
      return `La fecha desde y hasta del bloque deben estar dentro de la vigencia de la agenda (${selectedAgenda.fechaDesde}${selectedAgenda.fechaHasta ? ` a ${selectedAgenda.fechaHasta}` : ""}).`;
    }

    if (selectedAgenda.fechaHasta && fechaHasta > selectedAgenda.fechaHasta) {
      return `La fecha desde y hasta del bloque deben estar dentro de la vigencia de la agenda (${selectedAgenda.fechaDesde} a ${selectedAgenda.fechaHasta}).`;
    }

    return null;
  }

  function codigoDiaSemanaJs(fecha: Date): string {
    const codigoPorDia = ["D", "L", "M", "X", "J", "V", "S"];
    return codigoPorDia[fecha.getDay()] ?? "";
  }

  function validarBloqueSinHorarioPasado(fechaDesde: string, fechaHasta: string, horaInicio: string, dias: string[]): string | null {
    if (!fechaDesde || !fechaHasta || !horaInicio || dias.length === 0) {
      return null;
    }

    const ahora = new Date();
    const hoyIso = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
    const codigoHoy = codigoDiaSemanaJs(ahora);
    const horaActual = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
    const hoyIncluido = fechaDesde <= hoyIso && fechaHasta >= hoyIso && dias.some(d => d.toUpperCase() === codigoHoy);

    if (hoyIncluido && horaInicio <= horaActual) {
      return "Para fecha de hoy, la hora de inicio debe ser futura respecto a la hora actual del sistema.";
    }

    return null;
  }
  async function onCreateAgenda(event: FormEvent): Promise<AgendaSummary | null> {
    event.preventDefault();
    if (!canSubmit) {
      return null;
    }
    setSuccessMessage(null);
    setError(null);
    try {
      const created = await createAgenda({
        nombre,
        centroId,
        servicioId,
        tipoEfector,
        efectorId,
        tipoAgenda,
        visibleContactCenter,
        fechaDesde,
        fechaHasta: fechaHasta || undefined,
        observacion: observacion || undefined
      });
      setNombre("");
      setEfectorId("");
      setFechaDesde("");
      setFechaHasta("");
      setObservacion("");
      setVisibleContactCenter(true);
      setSelectedAgendaId(created.id);
      setShowAdvanced(true);
      setSuccessMessage(`Agenda ${created.codigo} creada correctamente. Continue con Crear Bloque.`);
      await loadAgendas();
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear agenda");
      return null;
    }
  }
  function toggleGrupoMiembro(efectorId: string) {
    setGrupoMiembrosIds(prev => prev.includes(efectorId) ? prev.filter(id => id !== efectorId) : [...prev, efectorId]);
  }
  async function onCreateGrupoProfesional(event: FormEvent) {
    event.preventDefault();
    if (!canSubmitGrupo) {
      return;
    }
    const miembros: CreateGrupoProfesionalMiembroRequest[] = grupoMiembrosIds.map((efectorId, index) => ({
      efectorId,
      orden: index + 1
    }));
    try {
      await createGrupoProfesional({
        codigo: grupoCodigo.trim(),
        nombre: grupoNombre.trim(),
        centroId: grupoCentroId,
        servicioId: grupoServicioId,
        descripcion: grupoDescripcion.trim().length > 0 ? grupoDescripcion.trim() : undefined,
        miembros
      });
      setGrupoCodigo("");
      setGrupoNombre("");
      setGrupoDescripcion("");
      setGrupoMiembrosIds([]);
      setError(null);
      setSuccessMessage("Se creo el grupo de profesionales correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear grupo de profesionales");
    }
  }
  async function onConsultarDisponibilidad() {
    if (!selectedAgendaId) {
      return;
    }
    try {
      const data = await getDisponibilidad(selectedAgendaId);
      setDisponibilidad(`Cupos totales: ${data.cuposTotales} | Cupos disponibles: ${data.cuposDisponibles} | Bloqueos activos: ${data.bloqueosActivos}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar disponibilidad");
    }
  }
  async function onGuardarCambios(event: FormEvent) {
    event.preventDefault();
    if (!selectedAgendaId) {
      return;
    }
    try {
      await updateAgenda(selectedAgendaId, {
        codigo: editCodigo,
        nombre: editNombre,
        centroId: editCentroId,
        servicioId: editServicioId,
        tipoEfector: editTipoEfector,
        efectorId: editEfectorId,
        tipoAgenda: editTipoAgenda,
        visibleContactCenter: editVisibleContactCenter,
        fechaDesde: editFechaDesde,
        fechaHasta: editFechaHasta || undefined,
        observacion: editObservacion || undefined
      });
      await loadAgendas();
      const refreshed = await getAgendaById(selectedAgendaId);
      setSelectedAgenda(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al editar agenda");
    }
  }
  async function onCopiarAgenda(event: FormEvent) {
    event.preventDefault();
    if (!selectedAgendaId) {
      return;
    }
    try {
      await copyAgenda(selectedAgendaId, {
        codigo: copyCodigo,
        nombre: copyNombre,
        fechaDesde: copyFechaDesde,
        fechaHasta: copyFechaHasta || undefined
      });
      await loadAgendas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al copiar agenda");
    }
  }
  async function onToggleEstado() {
    if (!selectedAgenda) {
      return;
    }
    try {
      await setAgendaEstado(selectedAgenda.id, !selectedAgenda.activa);
      await loadAgendas();
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar estado");
    }
  }
  function onSelectedBloqueChanged(nextBloqueId: string) {
    setSelectedBloqueId(nextBloqueId);
    const bloque = selectedAgenda?.bloques.find(b => b.id === nextBloqueId);
    if (!bloque) {
      return;
    }
    setBloqueFechaDesde(bloque.fechaDesde);
    setBloqueFechaHasta(bloque.fechaHasta);
    setBloqueFecha(bloque.fecha);
    setBloqueHoraInicio(bloque.horaInicio);
    setBloqueHoraFin(bloque.horaFin);
    setBloqueIntervaloMinutos(String(bloque.intervaloMinutos));
    setTurnosACancelar([]);
  }
  function toggleDiaBloque(diaCodigo: string) {
    setBloqueDias(prev => prev.includes(diaCodigo) ? prev.filter(d => d !== diaCodigo) : [...prev, diaCodigo]);
  }
  function toggleOrdenMensual(semana: number) {
    setBloqueOrdenMensual(prev => {
      if (prev.includes(semana)) {
        return prev.filter(s => s !== semana);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, semana];
    });
  }
  function onAgregarPractica() {
    const nombre = practicaNombre.trim();
    if (!nombre) {
      setError("Debe ingresar nombre de practica");
      return;
    }
    if (bloquePracticas.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
      setError("La practica ya fue agregada");
      return;
    }
    const sugerida = practicasCatalogo.find(p => p.nombre === nombre)?.duracionMinutosSugerida;
    const duracion = practicaDuracion.trim().length > 0 ? Number(practicaDuracion) : sugerida;
    if (duracion !== undefined && (!Number.isFinite(duracion) || duracion <= 0)) {
      setError("Duracion de practica invalida");
      return;
    }
    setBloquePracticas(prev => [...prev, {
      nombre,
      duracionMinutos: duracion
    }]);
    setPracticaNombre("");
    setPracticaDuracion("");
    setError(null);
  }
  function onEliminarPractica(index: number) {
    setBloquePracticas(prev => prev.filter((_, i) => i !== index));
  }
  function togglePracticaDemanda(nombrePractica: string) {
    setDemandaPracticasSeleccionadas(prev => prev.includes(nombrePractica) ? prev.filter(n => n !== nombrePractica) : [...prev, nombrePractica]);
  }
  async function onAgregarBloqueFijo(event: FormEvent) {
    event.preventDefault();
    setSuccessMessage(null);
    setError(null);
    if (!selectedAgenda) {
      return;
    }
    if (!bloqueNombre.trim()) {
      setError("Debe ingresar nombre de bloque");
      return;
    }
    const duracionTurno = Number(bloqueDuracionTurno);
    const sobreturnos = Number(bloqueSobreturnos);
    if (!Number.isFinite(duracionTurno) || duracionTurno <= 0) {
      setError("Duracion de turno invalida");
      return;
    }
    if (!Number.isFinite(sobreturnos) || sobreturnos < 0) {
      setError("Sobreturnos invalidos");
      return;
    }
    const rangoError = validarBloqueDentroDeAgenda(bloqueFechaDesde, bloqueFechaHasta);
    if (rangoError) {
      setError(rangoError);
      return;
    }
    const horarioPasadoError = validarBloqueSinHorarioPasado(bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueDias);
    if (horarioPasadoError) {
      setError(horarioPasadoError);
      return;
    }
    if (bloquePracticas.length === 0) {
      setError("Debe agregar al menos una practica asociada");
      return;
    }
    try {
      await addBloque(selectedAgenda.id, {
        nombre: bloqueNombre.trim(),
        tipoBloque: "FIJA",
        fechaDesde: bloqueFechaDesde,
        fechaHasta: bloqueFechaHasta,
        atiendeFeriados: bloqueAtiendeFeriados,
        dias: bloqueDias,
        horaInicio: bloqueHoraInicio,
        horaFin: bloqueHoraFin,
        duracionTurnoMinutos: duracionTurno,
        lugarAtencionId: bloqueLugarAtencionId,
        frecuencia: bloqueFrecuencia,
        ordenMensualSemanas: bloqueFrecuencia === "ORDEN_MENSUAL" ? bloqueOrdenMensual : [],
        practicas: bloquePracticas,
        sobreturnos
      });
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
      await loadAgendas();
      setError(null);
      setSuccessMessage(`Bloque de programacion guardado: ${bloqueNombre.trim()} (tipo FIJA).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar bloque fijo");
    }
  }
  async function onAgregarBloqueDemanda(event: FormEvent) {
    event.preventDefault();
    setSuccessMessage(null);
    setError(null);
    if (!selectedAgenda) {
      return;
    }
    if (!bloqueNombre.trim() || !bloqueFechaDesde || !bloqueFechaHasta || !bloqueHoraInicio || !bloqueHoraFin || !bloqueLugarAtencionId) {
      setError("Debe completar todos los campos obligatorios del bloque de demanda espontanea");
      return;
    }
    if (bloqueDias.length === 0) {
      setError("Debe seleccionar al menos un dia");
      return;
    }
    const rangoError = validarBloqueDentroDeAgenda(bloqueFechaDesde, bloqueFechaHasta);
    if (rangoError) {
      setError(rangoError);
      return;
    }
    const horarioPasadoError = validarBloqueSinHorarioPasado(bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueDias);
    if (horarioPasadoError) {
      setError(horarioPasadoError);
      return;
    }
    if (demandaPracticasSeleccionadas.length === 0) {
      setError("Debe seleccionar al menos una practica medica");
      return;
    }
    const duracionTurno = Number(bloqueDuracionTurno);
    if (!Number.isFinite(duracionTurno) || duracionTurno <= 0) {
      setError("Duracion de turno invalida");
      return;
    }
    const sobreturnos = Number(bloqueSobreturnos);
    if (!Number.isFinite(sobreturnos) || sobreturnos < 0) {
      setError("Sobreturnos invalidos");
      return;
    }
    const practicasDemandaPayload = demandaPracticasSeleccionadas.map(nombre => {
      const sugerida = practicasCatalogo.find(p => p.nombre === nombre)?.duracionMinutosSugerida;
      return {
        nombre,
        duracionMinutos: sugerida
      };
    });
    try {
      await addBloque(selectedAgenda.id, {
        nombre: bloqueNombre.trim(),
        tipoBloque: "DEMANDA_ESPONTANEA",
        fechaDesde: bloqueFechaDesde,
        fechaHasta: bloqueFechaHasta,
        atiendeFeriados: false,
        dias: bloqueDias,
        horaInicio: bloqueHoraInicio,
        horaFin: bloqueHoraFin,
        duracionTurnoMinutos: duracionTurno,
        lugarAtencionId: bloqueLugarAtencionId,
        frecuencia: "SEMANAL",
        ordenMensualSemanas: [],
        practicas: practicasDemandaPayload,
        sobreturnos
      });
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
      await loadAgendas();
      setError(null);
      setSuccessMessage(`Bloque de programacion guardado: ${bloqueNombre.trim()} (tipo DEMANDA_ESPONTANEA).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar bloque de demanda espontanea");
    }
  }
  async function onAgregarBloqueVariable(event: FormEvent) {
    event.preventDefault();
    setSuccessMessage(null);
    setError(null);
    if (!selectedAgenda) {
      return;
    }
    if (!bloqueNombre.trim() || !bloqueFechaDesde || !bloqueFechaHasta || !bloqueHoraInicio || !bloqueHoraFin || !bloqueLugarAtencionId) {
      setError("Debe completar todos los campos obligatorios del bloque variable");
      return;
    }
    if (bloqueDias.length === 0) {
      setError("Debe seleccionar al menos un dia");
      return;
    }
    const rangoError = validarBloqueDentroDeAgenda(bloqueFechaDesde, bloqueFechaHasta);
    if (rangoError) {
      setError(rangoError);
      return;
    }
    const horarioPasadoError = validarBloqueSinHorarioPasado(bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueDias);
    if (horarioPasadoError) {
      setError(horarioPasadoError);
      return;
    }
    const sobreturnos = Number(bloqueSobreturnos);
    if (!Number.isFinite(sobreturnos) || sobreturnos < 0) {
      setError("Sobreturnos invalidos");
      return;
    }
    if (bloquePracticas.length === 0) {
      setError("Debe agregar al menos una practica asociada");
      return;
    }
    setShowVariableConfirmModal(true);
  }
  async function onConfirmarAgregarBloqueVariable() {
    if (!selectedAgenda) {
      return;
    }
    const sobreturnos = Number(bloqueSobreturnos);
    try {
      await addBloque(selectedAgenda.id, {
        nombre: bloqueNombre.trim(),
        tipoBloque: "VARIABLE",
        fechaDesde: bloqueFechaDesde,
        fechaHasta: bloqueFechaHasta,
        atiendeFeriados: bloqueAtiendeFeriados,
        dias: bloqueDias,
        horaInicio: bloqueHoraInicio,
        horaFin: bloqueHoraFin,
        duracionTurnoMinutos: 5,
        lugarAtencionId: bloqueLugarAtencionId,
        frecuencia: bloqueFrecuencia,
        ordenMensualSemanas: bloqueFrecuencia === "ORDEN_MENSUAL" ? bloqueOrdenMensual : [],
        practicas: bloquePracticas,
        sobreturnos
      });
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
      await loadAgendas();
      setError(null);
      setSuccessMessage(`Bloque de programacion guardado: ${bloqueNombre.trim()} (tipo VARIABLE).`);
      setShowVariableConfirmModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar bloque variable");
    }
  }
  async function onEditarBloque(event: FormEvent) {
    event.preventDefault();
    if (!selectedAgenda || !selectedBloqueId) {
      return;
    }
    const intervalo = Number(bloqueIntervaloMinutos);
    if (!Number.isFinite(intervalo) || intervalo <= 0) {
      setError("Intervalo de bloque invalido");
      return;
    }
    const errorHorarioEdicion = validarBloqueSinHorarioPasado(bloqueFecha, bloqueFecha, bloqueHoraInicio, [codigoDiaSemanaJs(new Date(`${bloqueFecha}T00:00:00`))]);
    if (errorHorarioEdicion) {
      setError(errorHorarioEdicion);
      return;
    }
    try {
      await updateBloque(selectedAgenda.id, selectedBloqueId, {
        fecha: bloqueFecha,
        horaInicio: bloqueHoraInicio,
        horaFin: bloqueHoraFin,
        intervaloMinutos: intervalo
      });
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
      const refreshedBloque = refreshed.bloques.find(b => b.id === selectedBloqueId);
      if (refreshedBloque) {
        setBloqueFechaDesde(refreshedBloque.fechaDesde);
        setBloqueFechaHasta(refreshedBloque.fechaHasta);
        setBloqueFecha(refreshedBloque.fecha);
        setBloqueHoraInicio(refreshedBloque.horaInicio);
        setBloqueHoraFin(refreshedBloque.horaFin);
        setBloqueIntervaloMinutos(String(refreshedBloque.intervaloMinutos));
      }
      await loadAgendas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al editar bloque");
    }
  }
  async function onConsultarTurnosACancelar() {
    if (!selectedAgenda || !selectedBloqueId) {
      return;
    }
    try {
      const data = await getTurnosACancelar(selectedAgenda.id, selectedBloqueId);
      setTurnosACancelar(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar turnos a cancelar");
    }
  }
  async function onQuitarPracticaBloque(bloqueId: string, nombrePractica: string) {
    if (!selectedAgenda) {
      return;
    }
    try {
      await removeBloquePractica(selectedAgenda.id, bloqueId, nombrePractica);
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
      await loadAgendas();
      setError(null);
      setSuccessMessage(`Se elimino la practica ${nombrePractica} del bloque`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar practica del bloque");
    }
  }
  function onSolicitarQuitarPracticaBloque(bloqueId: string, nombrePractica: string) {
    setPracticaPendienteEliminar({
      bloqueId,
      nombre: nombrePractica
    });
  }
  async function onConfirmarQuitarPracticaBloque() {
    if (!practicaPendienteEliminar) {
      return;
    }
    await onQuitarPracticaBloque(practicaPendienteEliminar.bloqueId, practicaPendienteEliminar.nombre);
    setPracticaPendienteEliminar(null);
  }
  function onLimpiarConsulta() {
    setSearchQuery("");
    setEstadoFiltro("all");
    setCentroId(centros[0]?.id ?? "");
    setServicioId("");
    setTipoEfector("");
    setEfectorId("");
    setAdvancedQuery("");
    setAdvancedTipoAgenda("");
    setAdvancedVisibleCC("all");
    setAdvancedFechaDesde("");
    setAdvancedFechaHasta("");
  }
  return {
    agendas,
    setAgendas,
    loading,
    setLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    searchQuery,
    setSearchQuery,
    estadoFiltro,
    setEstadoFiltro,
    nombre,
    setNombre,
    centroId,
    setCentroId,
    servicioId,
    setServicioId,
    tipoEfector,
    setTipoEfector,
    efectorId,
    setEfectorId,
    tipoAgenda,
    setTipoAgenda,
    visibleContactCenter,
    setVisibleContactCenter,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    observacion,
    setObservacion,
    centros,
    setCentros,
    servicios,
    setServicios,
    tiposEfector,
    setTiposEfector,
    tiposAgenda,
    setTiposAgenda,
    efectores,
    setEfectores,
    selectedAgendaId,
    setSelectedAgendaId,
    selectedAgenda,
    setSelectedAgenda,
    disponibilidad,
    setDisponibilidad,
    editCodigo,
    setEditCodigo,
    editNombre,
    setEditNombre,
    editCentroId,
    setEditCentroId,
    editServicioId,
    setEditServicioId,
    editTipoEfector,
    setEditTipoEfector,
    editEfectorId,
    setEditEfectorId,
    editTipoAgenda,
    setEditTipoAgenda,
    editVisibleContactCenter,
    setEditVisibleContactCenter,
    editFechaDesde,
    setEditFechaDesde,
    editFechaHasta,
    setEditFechaHasta,
    editObservacion,
    setEditObservacion,
    copyCodigo,
    setCopyCodigo,
    copyNombre,
    setCopyNombre,
    copyFechaDesde,
    setCopyFechaDesde,
    copyFechaHasta,
    setCopyFechaHasta,
    selectedBloqueId,
    setSelectedBloqueId,
    bloqueFecha,
    setBloqueFecha,
    bloqueHoraInicio,
    setBloqueHoraInicio,
    bloqueHoraFin,
    setBloqueHoraFin,
    bloqueIntervaloMinutos,
    setBloqueIntervaloMinutos,
    bloqueNombre,
    setBloqueNombre,
    bloqueFechaDesde,
    setBloqueFechaDesde,
    bloqueFechaHasta,
    setBloqueFechaHasta,
    bloqueAtiendeFeriados,
    setBloqueAtiendeFeriados,
    bloqueDias,
    setBloqueDias,
    bloqueDuracionTurno,
    setBloqueDuracionTurno,
    bloqueLugarAtencionId,
    setBloqueLugarAtencionId,
    bloqueFrecuencia,
    setBloqueFrecuencia,
    bloqueOrdenMensual,
    setBloqueOrdenMensual,
    bloqueSobreturnos,
    setBloqueSobreturnos,
    practicaNombre,
    setPracticaNombre,
    practicaDuracion,
    setPracticaDuracion,
    bloquePracticas,
    setBloquePracticas,
    demandaPracticasSeleccionadas,
    setDemandaPracticasSeleccionadas,
    diasSemana,
    setDiasSemana,
    frecuenciasBloque,
    setFrecuenciasBloque,
    lugaresAtencion,
    setLugaresAtencion,
    practicasCatalogo,
    setPracticasCatalogo,
    turnosACancelar,
    setTurnosACancelar,
    showAdvanced,
    setShowAdvanced,
    showAdvancedFilters,
    setShowAdvancedFilters,
    advancedQuery,
    setAdvancedQuery,
    advancedTipoAgenda,
    setAdvancedTipoAgenda,
    advancedVisibleCC,
    setAdvancedVisibleCC,
    advancedFechaDesde,
    setAdvancedFechaDesde,
    advancedFechaHasta,
    setAdvancedFechaHasta,
    practicasQuery,
    setPracticasQuery,
    grupoCodigo,
    setGrupoCodigo,
    grupoNombre,
    setGrupoNombre,
    grupoDescripcion,
    setGrupoDescripcion,
    grupoCentroId,
    setGrupoCentroId,
    grupoServicioId,
    setGrupoServicioId,
    grupoServicios,
    setGrupoServicios,
    grupoProfesionales,
    setGrupoProfesionales,
    grupoMiembrosIds,
    setGrupoMiembrosIds,
    programadaBloqueTipo,
    setProgramadaBloqueTipo,
    showVariableConfirmModal,
    setShowVariableConfirmModal,
    practicaPendienteEliminar,
    setPracticaPendienteEliminar,
    filteredLandingAgendas,
    fullyFilteredAgendas,
    practicasFiltradas,
    canSubmitGrupo,
    mapEstadoFiltroToApiValue,
    loadAgendas,
    canSubmit,
    canSubmitBloqueDemanda,
    onCreateAgenda,
    toggleGrupoMiembro,
    onCreateGrupoProfesional,
    onConsultarDisponibilidad,
    onGuardarCambios,
    onCopiarAgenda,
    onToggleEstado,
    onSelectedBloqueChanged,
    toggleDiaBloque,
    toggleOrdenMensual,
    onAgregarPractica,
    onEliminarPractica,
    togglePracticaDemanda,
    onAgregarBloqueFijo,
    onAgregarBloqueDemanda,
    onAgregarBloqueVariable,
    onConfirmarAgregarBloqueVariable,
    onEditarBloque,
    onConsultarTurnosACancelar,
    onQuitarPracticaBloque,
    onSolicitarQuitarPracticaBloque,
    onConfirmarQuitarPracticaBloque,
    onLimpiarConsulta
  };
}