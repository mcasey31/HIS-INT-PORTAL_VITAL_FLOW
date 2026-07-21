import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  AgendaSummary, AgendaDetail, SelectorOption, EfectorOption,
  DiaSemanaOption, PracticaOption, BloquePracticaRequest, TurnoACancelar,
  CreateGrupoProfesionalMiembroRequest, AgendaDetailBloque,
} from "./agendaTypes";
import {
  getAgendas, getCentros, getServicios, getTiposEfector, getTiposAgenda,
  getEfectores, getAgendaById, getLugaresAtencion, getDiasSemana,
  getFrecuenciasBloque, getPracticas, createAgenda, updateAgenda, copyAgenda,
  setAgendaEstado, addBloque, updateBloque, removeBloquePractica,
  getTurnosACancelar, getDisponibilidad, createGrupoProfesional,
} from "./agendaApi";

type AgendaPageProps = { openHu7027Token?: number };

export function useAgendaController({ openHu7027Token = 0 }: AgendaPageProps = {}) {
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
  const [selectedAgendaId, setSelectedAgendaId] = useState("");
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaDetail | null>(null);
  const [disponibilidad, setDisponibilidad] = useState("");
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
  const [practicaPendienteEliminar, setPracticaPendienteEliminar] = useState<{ bloqueId: string; nombre: string } | null>(null);

  const filteredLandingAgendas = useMemo(() => {
    return agendas.filter(a => {
      if (centroId && a.centroId !== centroId) return false;
      if (servicioId && a.servicioId !== servicioId) return false;
      if (tipoEfector && a.tipoEfector !== tipoEfector) return false;
      if (efectorId && a.efectorId !== efectorId) return false;
      return true;
    });
  }, [agendas, centroId, servicioId, tipoEfector, efectorId]);

  const fullyFilteredAgendas = useMemo(() => {
    return filteredLandingAgendas.filter(a => {
      if (advancedQuery.trim()) {
        const q = advancedQuery.trim().toLowerCase();
        if (!a.codigo.toLowerCase().includes(q) && !a.nombre.toLowerCase().includes(q)) return false;
      }
      if (advancedTipoAgenda && a.tipoAgenda !== advancedTipoAgenda) return false;
      if (advancedVisibleCC === "yes" && !a.visibleContactCenter) return false;
      if (advancedVisibleCC === "no" && a.visibleContactCenter) return false;
      if (advancedFechaDesde && a.fechaDesde < advancedFechaDesde) return false;
      if (advancedFechaHasta) { const ah = a.fechaHasta ?? a.fechaDesde; if (ah > advancedFechaHasta) return false; }
      return true;
    });
  }, [filteredLandingAgendas, advancedQuery, advancedTipoAgenda, advancedVisibleCC, advancedFechaDesde, advancedFechaHasta]);

  const practicasFiltradas = useMemo(() => {
    const q = practicasQuery.trim().toLowerCase();
    return q ? practicasCatalogo.filter(p => p.nombre.toLowerCase().includes(q)) : practicasCatalogo;
  }, [practicasCatalogo, practicasQuery]);

  const canSubmitGrupo = grupoCodigo.trim().length > 0 && grupoNombre.trim().length > 0 && grupoCentroId.trim().length > 0 && grupoServicioId.trim().length > 0 && grupoMiembrosIds.length > 0;

  const canSubmit = nombre.trim().length > 0 && centroId.trim().length > 0 && servicioId.trim().length > 0 && tipoEfector.trim().length > 0 && efectorId.trim().length > 0 && tipoAgenda.trim().length > 0 && fechaDesde.trim().length > 0;

  const canSubmitBloqueDemanda = useMemo(() => {
    const duracion = Number(bloqueDuracionTurno);
    const sobreturnos = Number(bloqueSobreturnos);
    const ad = selectedAgenda?.fechaDesde ?? "";
    const ah = selectedAgenda?.fechaHasta ?? "";
    const dentro = !selectedAgenda || !bloqueFechaDesde || !bloqueFechaHasta || (bloqueFechaDesde >= ad && (!ah || bloqueFechaHasta <= ah));
    return bloqueNombre.trim().length > 0 && bloqueFechaDesde.trim().length > 0 && bloqueFechaHasta.trim().length > 0 && bloqueHoraInicio.trim().length > 0 && bloqueHoraFin.trim().length > 0 && bloqueLugarAtencionId.trim().length > 0 && bloqueDias.length > 0 && demandaPracticasSeleccionadas.length > 0 && Number.isFinite(duracion) && duracion > 0 && Number.isFinite(sobreturnos) && sobreturnos >= 0 && bloqueHoraInicio < bloqueHoraFin && dentro;
  }, [bloqueNombre, bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueHoraFin, bloqueLugarAtencionId, bloqueDias, demandaPracticasSeleccionadas, bloqueDuracionTurno, bloqueSobreturnos, selectedAgenda]);

  function mapEstadoFiltroToApiValue(): boolean | undefined {
    if (estadoFiltro === "active") return true;
    if (estadoFiltro === "inactive") return false;
    return undefined;
  }

  async function loadAgendas() {
    setLoading(true);
    try {
      const data = await getAgendas(searchQuery, mapEstadoFiltroToApiValue());
      setAgendas(data);
      if (!data.some(a => a.id === selectedAgendaId)) setSelectedAgendaId(data[0]?.id ?? "");
    } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar agendas"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadAgendas(); }, [searchQuery, estadoFiltro]);

  useEffect(() => {
    async function loadSelectors() {
      const [cR, teR, taR, dR, fR, lR, pR] = await Promise.allSettled([getCentros(), getTiposEfector(), getTiposAgenda(), getDiasSemana(), getFrecuenciasBloque(), getLugaresAtencion(), getPracticas()]);
      const c = cR.status === "fulfilled" ? cR.value : [];
      const te = teR.status === "fulfilled" ? teR.value : [];
      const ta = taR.status === "fulfilled" ? taR.value : [];
      const d = dR.status === "fulfilled" ? dR.value : [];
      const f = fR.status === "fulfilled" ? fR.value : [];
      const l = lR.status === "fulfilled" ? lR.value : [];
      const p = pR.status === "fulfilled" ? pR.value : [];
      setCentros(c); setTiposEfector(te); setTiposAgenda(ta); setDiasSemana(d); setFrecuenciasBloque(f); setLugaresAtencion(l); setPracticasCatalogo(p);
      if (c.length > 0) { setCentroId(prev => prev || c[0].id); setGrupoCentroId(prev => prev || c[0].id); }
      if (te.length > 0) setTipoEfector(prev => prev || te[0]);
      if (ta.length > 0) setTipoAgenda(prev => prev || ta[0]);
      if (f.length > 0) setBloqueFrecuencia(prev => prev || f[0]);
      if (l.length > 0) setBloqueLugarAtencionId(prev => prev || l[0].id);
      if (p.length > 0) setPracticaNombre(prev => prev || p[0].nombre);
      const errors = [cR, teR, taR, dR, fR, lR, pR].filter(r => r.status === "rejected").map(r => (r as PromiseRejectedResult).reason);
      if (errors.length > 0) setError("Error al cargar algunos selectores de agenda");
    }
    void loadSelectors();
  }, []);

  useEffect(() => {
    async function load() {
      if (!centroId) { setServicios([]); setServicioId(""); return; }
      try {
        const data = await getServicios(centroId);
        setServicios(data); setServicioId(prev => data.some(s => s.id === prev) ? prev : data[0]?.id ?? "");
      } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar servicios"); }
    }
    void load();
  }, [centroId]);

  useEffect(() => {
    async function load() {
      if (!centroId || !servicioId || !tipoEfector) { setEfectores([]); setEfectorId(""); return; }
      try {
        const data = await getEfectores(centroId, servicioId, tipoEfector);
        setEfectores(data); setEfectorId(prev => data.some(e => e.id === prev) ? prev : data[0]?.id ?? "");
      } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar efectores"); }
    }
    void load();
  }, [centroId, servicioId, tipoEfector]);

  useEffect(() => {
    async function load() {
      if (!grupoCentroId) { setGrupoServicios([]); setGrupoServicioId(""); return; }
      try {
        const data = await getServicios(grupoCentroId);
        setGrupoServicios(data); setGrupoServicioId(prev => data.some(s => s.id === prev) ? prev : data[0]?.id ?? "");
      } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar servicios para grupo"); }
    }
    void load();
  }, [grupoCentroId]);

  useEffect(() => {
    async function load() {
      if (!grupoCentroId || !grupoServicioId) { setGrupoProfesionales([]); setGrupoMiembrosIds([]); return; }
      try {
        const data = await getEfectores(grupoCentroId, grupoServicioId, "PROFESIONAL");
        setGrupoProfesionales(data); setGrupoMiembrosIds(prev => prev.filter(id => data.some(d => d.id === id)));
      } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar profesionales para grupo"); }
    }
    void load();
  }, [grupoCentroId, grupoServicioId]);

  useEffect(() => {
    async function loadDetail() {
      if (!selectedAgendaId) { setSelectedAgenda(null); return; }
      try {
        const detail = await getAgendaById(selectedAgendaId);
        setSelectedAgenda(detail);
        setEditCodigo(detail.codigo); setEditNombre(detail.nombre); setEditCentroId(detail.centroId);
        setEditServicioId(detail.servicioId); setEditTipoEfector(detail.tipoEfector); setEditEfectorId(detail.efectorId);
        setEditTipoAgenda(detail.tipoAgenda); setEditVisibleContactCenter(detail.visibleContactCenter);
        setEditFechaDesde(detail.fechaDesde); setEditFechaHasta(detail.fechaHasta ?? ""); setEditObservacion(detail.observacion ?? "");
        setCopyCodigo(`${detail.codigo}-COPY`); setCopyNombre(`${detail.nombre} (copia)`);
        setCopyFechaDesde(detail.fechaDesde); setCopyFechaHasta(detail.fechaHasta ?? "");
        setBloqueFechaDesde(detail.fechaDesde); setBloqueFechaHasta(detail.fechaHasta ?? detail.fechaDesde);
        setBloqueNombre(""); setBloqueAtiendeFeriados(false); setBloqueDias([]); setBloqueDuracionTurno("20");
        setBloqueSobreturnos("0"); setBloquePracticas([]); setDemandaPracticasSeleccionadas([]);
        setPracticaNombre(""); setPracticaDuracion("");
        if (detail.bloques.length > 0) {
          const fb = detail.bloques[0]; setSelectedBloqueId(fb.id); setBloqueFecha(fb.fecha);
          setBloqueHoraInicio(fb.horaInicio); setBloqueHoraFin(fb.horaFin); setBloqueIntervaloMinutos(String(fb.intervaloMinutos));
        } else { setSelectedBloqueId(""); setBloqueFecha(""); setBloqueHoraInicio(""); setBloqueHoraFin(""); setBloqueIntervaloMinutos("20"); }
      } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar detalle de agenda"); }
    }
    void loadDetail();
  }, [selectedAgendaId]);

  useEffect(() => {
    const stillVisible = fullyFilteredAgendas.some(a => a.id === selectedAgendaId);
    if (!stillVisible) setSelectedAgendaId(fullyFilteredAgendas[0]?.id ?? "");
  }, [fullyFilteredAgendas, selectedAgendaId]);

  useEffect(() => {
    if (openHu7027Token <= 0) return;
    setShowAdvanced(true);
    const target = agendas.find(a => a.id === selectedAgendaId) ?? fullyFilteredAgendas[0] ?? agendas[0];
    if (target) setSelectedAgendaId(target.id);
    setTimeout(() => {
      const elId = target?.tipoAgenda === "DEMANDA_ESPONTANEA" ? "hu-8990-form" : "programacion-selector";
      document.getElementById(elId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, [openHu7027Token, agendas, selectedAgendaId, fullyFilteredAgendas]);

  async function onCreateAgenda(event: FormEvent): Promise<AgendaSummary | null> {
    event.preventDefault();
    if (!canSubmit) return null;
    setSuccessMessage(null); setError(null);
    try {
      const created = await createAgenda({ nombre, centroId, servicioId, tipoEfector, efectorId, tipoAgenda, visibleContactCenter, fechaDesde, fechaHasta: fechaHasta || undefined, observacion: observacion || undefined });
      setNombre(""); setEfectorId(""); setFechaDesde(""); setFechaHasta(""); setObservacion(""); setVisibleContactCenter(true);
      setSelectedAgendaId(created.id); setShowAdvanced(true);
      setSuccessMessage(`Agenda ${created.codigo} creada correctamente. Continue con Crear Bloque.`);
      await loadAgendas(); return created;
    } catch (err) { setError(err instanceof Error ? err.message : "Error al crear agenda"); return null; }
  }

  function toggleGrupoMiembro(id: string) { setGrupoMiembrosIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }

  async function onCreateGrupoProfesional(event: FormEvent) {
    event.preventDefault();
    if (!canSubmitGrupo) return;
    try {
      await createGrupoProfesional({
        codigo: grupoCodigo.trim(), nombre: grupoNombre.trim(), centroId: grupoCentroId, servicioId: grupoServicioId,
        descripcion: grupoDescripcion.trim() || undefined, miembros: grupoMiembrosIds.map((id, i) => ({ efectorId: id, orden: i + 1 })),
      });
      setGrupoCodigo(""); setGrupoNombre(""); setGrupoDescripcion(""); setGrupoMiembrosIds([]);
      setError(null); setSuccessMessage("Se creo el grupo de profesionales correctamente");
    } catch (err) { setError(err instanceof Error ? err.message : "Error al crear grupo de profesionales"); }
  }

  async function onConsultarDisponibilidad() {
    if (!selectedAgendaId) return;
    try {
      const data = await getDisponibilidad(selectedAgendaId);
      setDisponibilidad(`Cupos totales: ${data.cuposTotales} | Cupos disponibles: ${data.cuposDisponibles} | Bloqueos activos: ${data.bloqueosActivos}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al consultar disponibilidad"); }
  }

  async function onGuardarCambios(event: FormEvent) {
    event.preventDefault();
    if (!selectedAgendaId) return;
    try {
      await updateAgenda(selectedAgendaId, { codigo: editCodigo, nombre: editNombre, centroId: editCentroId, servicioId: editServicioId, tipoEfector: editTipoEfector, efectorId: editEfectorId, tipoAgenda: editTipoAgenda, visibleContactCenter: editVisibleContactCenter, fechaDesde: editFechaDesde, fechaHasta: editFechaHasta || undefined, observacion: editObservacion || undefined });
      await loadAgendas();
      setSelectedAgenda(await getAgendaById(selectedAgendaId));
    } catch (err) { setError(err instanceof Error ? err.message : "Error al editar agenda"); }
  }

  async function onCopiarAgenda(event: FormEvent) {
    event.preventDefault();
    if (!selectedAgendaId) return;
    try { await copyAgenda(selectedAgendaId, { codigo: copyCodigo, nombre: copyNombre, fechaDesde: copyFechaDesde, fechaHasta: copyFechaHasta || undefined }); await loadAgendas(); }
    catch (err) { setError(err instanceof Error ? err.message : "Error al copiar agenda"); }
  }

  async function onToggleEstado() {
    if (!selectedAgenda) return;
    try {
      await setAgendaEstado(selectedAgenda.id, !selectedAgenda.activa);
      await loadAgendas(); setSelectedAgenda(await getAgendaById(selectedAgenda.id));
    } catch (err) { setError(err instanceof Error ? err.message : "Error al cambiar estado"); }
  }

  function onSelectedBloqueChanged(nextBloqueId: string) {
    setSelectedBloqueId(nextBloqueId);
    const b = selectedAgenda?.bloques.find(x => x.id === nextBloqueId);
    if (!b) return;
    setBloqueFechaDesde(b.fechaDesde); setBloqueFechaHasta(b.fechaHasta); setBloqueFecha(b.fecha);
    setBloqueHoraInicio(b.horaInicio); setBloqueHoraFin(b.horaFin); setBloqueIntervaloMinutos(String(b.intervaloMinutos));
    setTurnosACancelar([]);
  }

  const selectedBloque: AgendaDetailBloque | null = useMemo(() => {
    return selectedAgenda?.bloques.find(b => b.id === selectedBloqueId) ?? null;
  }, [selectedAgenda, selectedBloqueId]);

  function toggleDiaBloque(codigo: string) { setBloqueDias(prev => prev.includes(codigo) ? prev.filter(d => d !== codigo) : [...prev, codigo]); }

  function toggleOrdenMensual(semana: number) { setBloqueOrdenMensual(prev => prev.includes(semana) ? prev.filter(s => s !== semana) : prev.length >= 2 ? prev : [...prev, semana]); }

  function onAgregarPractica() {
    const n = practicaNombre.trim();
    if (!n) { setError("Debe ingresar nombre de practica"); return; }
    if (bloquePracticas.some(p => p.nombre.toLowerCase() === n.toLowerCase())) { setError("La practica ya fue agregada"); return; }
    const sugerida = practicasCatalogo.find(p => p.nombre === n)?.duracionMinutosSugerida;
    const duracion = practicaDuracion.trim() ? Number(practicaDuracion) : sugerida;
    if (duracion !== undefined && (!Number.isFinite(duracion) || duracion <= 0)) { setError("Duracion de practica invalida"); return; }
    setBloquePracticas(prev => [...prev, { nombre: n, duracionMinutos: duracion }]);
    setPracticaNombre(""); setPracticaDuracion(""); setError(null);
  }

  function onEliminarPractica(index: number) { setBloquePracticas(prev => prev.filter((_, i) => i !== index)); }

  function togglePracticaDemanda(nombre: string) { setDemandaPracticasSeleccionadas(prev => prev.includes(nombre) ? prev.filter(n => n !== nombre) : [...prev, nombre]); }

  function validarBloqueDentroDeAgenda(fd: string, fh: string): string | null {
    if (!selectedAgenda) return null;
    if (!fd || !fh) return "Debe completar las fechas del bloque";
    if (fh < fd) return "La Fecha hasta no puede ser menor que la Fecha desde";
    if (fd < selectedAgenda.fechaDesde) return `La fecha desde y hasta del bloque deben estar dentro de la vigencia de la agenda (${selectedAgenda.fechaDesde}${selectedAgenda.fechaHasta ? ` a ${selectedAgenda.fechaHasta}` : ""}).`;
    if (selectedAgenda.fechaHasta && fh > selectedAgenda.fechaHasta) return `La fecha desde y hasta del bloque deben estar dentro de la vigencia de la agenda (${selectedAgenda.fechaDesde} a ${selectedAgenda.fechaHasta}).`;
    return null;
  }

  function codigoDiaSemanaJs(date: Date): string {
    return ["D", "L", "M", "X", "J", "V", "S"][date.getDay()] ?? "";
  }

  function validarBloqueSinHorarioPasado(fd: string, fh: string, hi: string, dias: string[]): string | null {
    if (!fd || !fh || !hi || dias.length === 0) return null;
    const ahora = new Date();
    const hoyIso = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
    const codigoHoy = codigoDiaSemanaJs(ahora);
    const hActual = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
    if (fd <= hoyIso && fh >= hoyIso && dias.some(d => d.toUpperCase() === codigoHoy) && hi <= hActual) return "Para fecha de hoy, la hora de inicio debe ser futura respecto a la hora actual del sistema.";
    return null;
  }

  async function onAgregarBloqueFijo(event: FormEvent) {
    event.preventDefault(); setSuccessMessage(null); setError(null);
    if (!selectedAgenda) return;
    if (!bloqueNombre.trim()) { setError("Debe ingresar nombre de bloque"); return; }
    const duracionTurno = Number(bloqueDuracionTurno);
    const sobreturnos = Number(bloqueSobreturnos);
    if (!Number.isFinite(duracionTurno) || duracionTurno <= 0) { setError("Duracion de turno invalida"); return; }
    if (!Number.isFinite(sobreturnos) || sobreturnos < 0) { setError("Sobreturnos invalidos"); return; }
    const rangoErr = validarBloqueDentroDeAgenda(bloqueFechaDesde, bloqueFechaHasta);
    if (rangoErr) { setError(rangoErr); return; }
    const horarioErr = validarBloqueSinHorarioPasado(bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueDias);
    if (horarioErr) { setError(horarioErr); return; }
    if (bloquePracticas.length === 0) { setError("Debe agregar al menos una practica asociada"); return; }
    try {
      await addBloque(selectedAgenda.id, { nombre: bloqueNombre.trim(), tipoBloque: "FIJA", fechaDesde: bloqueFechaDesde, fechaHasta: bloqueFechaHasta, atiendeFeriados: bloqueAtiendeFeriados, dias: bloqueDias, horaInicio: bloqueHoraInicio, horaFin: bloqueHoraFin, duracionTurnoMinutos: duracionTurno, lugarAtencionId: bloqueLugarAtencionId, frecuencia: bloqueFrecuencia, ordenMensualSemanas: bloqueFrecuencia === "ORDEN_MENSUAL" ? bloqueOrdenMensual : [], practicas: bloquePracticas, sobreturnos });
      setSelectedAgenda(await getAgendaById(selectedAgenda.id)); await loadAgendas();
      setError(null); setSuccessMessage(`Bloque de programacion guardado: ${bloqueNombre.trim()} (tipo FIJA).`);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al agregar bloque fijo"); }
  }

  async function onAgregarBloqueDemanda(event: FormEvent) {
    event.preventDefault(); setSuccessMessage(null); setError(null);
    if (!selectedAgenda) return;
    if (!bloqueNombre.trim() || !bloqueFechaDesde || !bloqueFechaHasta || !bloqueHoraInicio || !bloqueHoraFin || !bloqueLugarAtencionId) { setError("Debe completar todos los campos obligatorios del bloque de demanda espontanea"); return; }
    if (bloqueDias.length === 0) { setError("Debe seleccionar al menos un dia"); return; }
    const rangoErr = validarBloqueDentroDeAgenda(bloqueFechaDesde, bloqueFechaHasta);
    if (rangoErr) { setError(rangoErr); return; }
    const horarioErr = validarBloqueSinHorarioPasado(bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueDias);
    if (horarioErr) { setError(horarioErr); return; }
    if (demandaPracticasSeleccionadas.length === 0) { setError("Debe seleccionar al menos una practica medica"); return; }
    const duracionTurno = Number(bloqueDuracionTurno);
    if (!Number.isFinite(duracionTurno) || duracionTurno <= 0) { setError("Duracion de turno invalida"); return; }
    const sobreturnos = Number(bloqueSobreturnos);
    if (!Number.isFinite(sobreturnos) || sobreturnos < 0) { setError("Sobreturnos invalidos"); return; }
    const practicasPayload = demandaPracticasSeleccionadas.map(n => ({ nombre: n, duracionMinutos: practicasCatalogo.find(p => p.nombre === n)?.duracionMinutosSugerida }));
    try {
      await addBloque(selectedAgenda.id, { nombre: bloqueNombre.trim(), tipoBloque: "DEMANDA_ESPONTANEA", fechaDesde: bloqueFechaDesde, fechaHasta: bloqueFechaHasta, atiendeFeriados: false, dias: bloqueDias, horaInicio: bloqueHoraInicio, horaFin: bloqueHoraFin, duracionTurnoMinutos: duracionTurno, lugarAtencionId: bloqueLugarAtencionId, frecuencia: "SEMANAL", ordenMensualSemanas: [], practicas: practicasPayload, sobreturnos });
      setSelectedAgenda(await getAgendaById(selectedAgenda.id)); await loadAgendas();
      setError(null); setSuccessMessage(`Bloque de programacion guardado: ${bloqueNombre.trim()} (tipo DEMANDA_ESPONTANEA).`);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al agregar bloque de demanda espontanea"); }
  }

  async function onAgregarBloqueVariable(event: FormEvent) {
    event.preventDefault(); setSuccessMessage(null); setError(null);
    if (!selectedAgenda) return;
    if (!bloqueNombre.trim() || !bloqueFechaDesde || !bloqueFechaHasta || !bloqueHoraInicio || !bloqueHoraFin || !bloqueLugarAtencionId) { setError("Debe completar todos los campos obligatorios del bloque variable"); return; }
    if (bloqueDias.length === 0) { setError("Debe seleccionar al menos un dia"); return; }
    const rangoErr = validarBloqueDentroDeAgenda(bloqueFechaDesde, bloqueFechaHasta);
    if (rangoErr) { setError(rangoErr); return; }
    const horarioErr = validarBloqueSinHorarioPasado(bloqueFechaDesde, bloqueFechaHasta, bloqueHoraInicio, bloqueDias);
    if (horarioErr) { setError(horarioErr); return; }
    if (!Number.isFinite(Number(bloqueSobreturnos)) || Number(bloqueSobreturnos) < 0) { setError("Sobreturnos invalidos"); return; }
    if (bloquePracticas.length === 0) { setError("Debe agregar al menos una practica asociada"); return; }
    setShowVariableConfirmModal(true);
  }

  async function onConfirmarAgregarBloqueVariable() {
    if (!selectedAgenda) return;
    try {
      await addBloque(selectedAgenda.id, { nombre: bloqueNombre.trim(), tipoBloque: "VARIABLE", fechaDesde: bloqueFechaDesde, fechaHasta: bloqueFechaHasta, atiendeFeriados: bloqueAtiendeFeriados, dias: bloqueDias, horaInicio: bloqueHoraInicio, horaFin: bloqueHoraFin, duracionTurnoMinutos: 5, lugarAtencionId: bloqueLugarAtencionId, frecuencia: bloqueFrecuencia, ordenMensualSemanas: bloqueFrecuencia === "ORDEN_MENSUAL" ? bloqueOrdenMensual : [], practicas: bloquePracticas, sobreturnos: Number(bloqueSobreturnos) });
      setSelectedAgenda(await getAgendaById(selectedAgenda.id)); await loadAgendas();
      setError(null); setSuccessMessage(`Bloque de programacion guardado: ${bloqueNombre.trim()} (tipo VARIABLE).`); setShowVariableConfirmModal(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al agregar bloque variable"); }
  }

  async function onEditarBloque(event: FormEvent) {
    event.preventDefault();
    if (!selectedAgenda || !selectedBloqueId) return;
    const intervalo = Number(bloqueIntervaloMinutos);
    if (!Number.isFinite(intervalo) || intervalo <= 0) { setError("Intervalo de bloque invalido"); return; }
    const horarioErr = validarBloqueSinHorarioPasado(bloqueFecha, bloqueFecha, bloqueHoraInicio, [codigoDiaSemanaJs(new Date(`${bloqueFecha}T00:00:00`))]);
    if (horarioErr) { setError(horarioErr); return; }
    try {
      await updateBloque(selectedAgenda.id, selectedBloqueId, { fecha: bloqueFecha, horaInicio: bloqueHoraInicio, horaFin: bloqueHoraFin, intervaloMinutos: intervalo });
      const refreshed = await getAgendaById(selectedAgenda.id);
      setSelectedAgenda(refreshed);
      const rb = refreshed.bloques.find(b => b.id === selectedBloqueId);
      if (rb) { setBloqueFechaDesde(rb.fechaDesde); setBloqueFechaHasta(rb.fechaHasta); setBloqueFecha(rb.fecha); setBloqueHoraInicio(rb.horaInicio); setBloqueHoraFin(rb.horaFin); setBloqueIntervaloMinutos(String(rb.intervaloMinutos)); }
      await loadAgendas();
    } catch (err) { setError(err instanceof Error ? err.message : "Error al editar bloque"); }
  }

  async function onConsultarTurnosACancelar() {
    if (!selectedAgenda || !selectedBloqueId) return;
    try { setTurnosACancelar(await getTurnosACancelar(selectedAgenda.id, selectedBloqueId)); }
    catch (err) { setError(err instanceof Error ? err.message : "Error al consultar turnos a cancelar"); }
  }

  async function onQuitarPracticaBloque(bloqueId: string, nombrePractica: string) {
    if (!selectedAgenda) return;
    try {
      await removeBloquePractica(selectedAgenda.id, bloqueId, nombrePractica);
      setSelectedAgenda(await getAgendaById(selectedAgenda.id)); await loadAgendas();
      setError(null); setSuccessMessage(`Se elimino la practica ${nombrePractica} del bloque`);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al eliminar practica del bloque"); }
  }

  function onSolicitarQuitarPracticaBloque(bloqueId: string, nombre: string) { setPracticaPendienteEliminar({ bloqueId, nombre }); }

  async function onConfirmarQuitarPracticaBloque() {
    if (!practicaPendienteEliminar) return;
    await onQuitarPracticaBloque(practicaPendienteEliminar.bloqueId, practicaPendienteEliminar.nombre);
    setPracticaPendienteEliminar(null);
  }

  function onLimpiarConsulta() {
    setSearchQuery(""); setEstadoFiltro("all"); setCentroId(centros[0]?.id ?? "");
    setServicioId(""); setTipoEfector(""); setEfectorId(""); setAdvancedQuery(""); setAdvancedTipoAgenda("");
    setAdvancedVisibleCC("all"); setAdvancedFechaDesde(""); setAdvancedFechaHasta("");
  }

  return {
    agendas, loading, error, successMessage, searchQuery, estadoFiltro,
    nombre, centroId, servicioId, tipoEfector, efectorId, tipoAgenda, visibleContactCenter, fechaDesde, fechaHasta, observacion,
    centros, servicios, tiposEfector, tiposAgenda, efectores, selectedAgendaId, selectedAgenda, disponibilidad,
    editCodigo, editNombre, editCentroId, editServicioId, editTipoEfector, editEfectorId, editTipoAgenda, editVisibleContactCenter,
    editFechaDesde, editFechaHasta, editObservacion,
    copyCodigo, copyNombre, copyFechaDesde, copyFechaHasta,
    selectedBloqueId, selectedBloque, bloqueFecha, bloqueHoraInicio, bloqueHoraFin, bloqueIntervaloMinutos,
    bloqueNombre, bloqueFechaDesde, bloqueFechaHasta, bloqueAtiendeFeriados, bloqueDias, bloqueDuracionTurno,
    bloqueLugarAtencionId, bloqueFrecuencia, bloqueOrdenMensual, bloqueSobreturnos,
    practicaNombre, practicaDuracion, bloquePracticas, demandaPracticasSeleccionadas,
    diasSemana, frecuenciasBloque, lugaresAtencion, practicasCatalogo, turnosACancelar,
    showAdvanced, showAdvancedFilters, advancedQuery, advancedTipoAgenda, advancedVisibleCC,
    advancedFechaDesde, advancedFechaHasta, practicasQuery,
    grupoCodigo, grupoNombre, grupoDescripcion, grupoCentroId, grupoServicioId, grupoServicios, grupoProfesionales, grupoMiembrosIds,
    programadaBloqueTipo, showVariableConfirmModal, practicaPendienteEliminar,

    setAgendas, setLoading, setError, setSuccessMessage, setSearchQuery, setEstadoFiltro,
    setNombre, setCentroId, setServicioId, setTipoEfector, setEfectorId, setTipoAgenda, setVisibleContactCenter,
    setFechaDesde, setFechaHasta, setObservacion,
    setCentros, setServicios, setTiposEfector, setTiposAgenda, setEfectores,
    setSelectedAgendaId, setSelectedAgenda, setDisponibilidad,
    setEditCodigo, setEditNombre, setEditCentroId, setEditServicioId, setEditTipoEfector, setEditEfectorId,
    setEditTipoAgenda, setEditVisibleContactCenter, setEditFechaDesde, setEditFechaHasta, setEditObservacion,
    setCopyCodigo, setCopyNombre, setCopyFechaDesde, setCopyFechaHasta,
    setSelectedBloqueId, setBloqueFecha, setBloqueHoraInicio, setBloqueHoraFin, setBloqueIntervaloMinutos,
    setBloqueNombre, setBloqueFechaDesde, setBloqueFechaHasta, setBloqueAtiendeFeriados, setBloqueDias,
    setBloqueDuracionTurno, setBloqueLugarAtencionId, setBloqueFrecuencia, setBloqueOrdenMensual, setBloqueSobreturnos,
    setPracticaNombre, setPracticaDuracion, setBloquePracticas, setDemandaPracticasSeleccionadas,
    setDiasSemana, setFrecuenciasBloque, setLugaresAtencion, setPracticasCatalogo, setTurnosACancelar,
    setShowAdvanced, setShowAdvancedFilters, setAdvancedQuery, setAdvancedTipoAgenda, setAdvancedVisibleCC,
    setAdvancedFechaDesde, setAdvancedFechaHasta, setPracticasQuery,
    setGrupoCodigo, setGrupoNombre, setGrupoDescripcion, setGrupoCentroId, setGrupoServicioId,
    setGrupoServicios, setGrupoProfesionales, setGrupoMiembrosIds,
    setProgramadaBloqueTipo, setShowVariableConfirmModal, setPracticaPendienteEliminar,

    filteredLandingAgendas, fullyFilteredAgendas, practicasFiltradas, canSubmitGrupo,
    canSubmit, canSubmitBloqueDemanda,
    loadAgendas, mapEstadoFiltroToApiValue,
    onCreateAgenda, toggleGrupoMiembro, onCreateGrupoProfesional, onConsultarDisponibilidad,
    onGuardarCambios, onCopiarAgenda, onToggleEstado, onSelectedBloqueChanged,
    toggleDiaBloque, toggleOrdenMensual, onAgregarPractica, onEliminarPractica, togglePracticaDemanda,
    onAgregarBloqueFijo, onAgregarBloqueDemanda, onAgregarBloqueVariable, onConfirmarAgregarBloqueVariable,
    onEditarBloque, onConsultarTurnosACancelar, onQuitarPracticaBloque,
    onSolicitarQuitarPracticaBloque, onConfirmarQuitarPracticaBloque, onLimpiarConsulta,
    codigoDiaSemanaJs,
  };
}
