import './Agenda.css';
import { useAgenda } from "./useAgenda";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { addBloque, AgendaDetail, BloquePracticaRequest, CreateGrupoProfesionalMiembroRequest, AgendaSummary, copyAgenda, createGrupoProfesional, createAgenda, DiaSemanaOption, EfectorOption, getCentros, getAgendaById, getAgendas, getDiasSemana, getDisponibilidad, getEfectores, getFrecuenciasBloque, getLugaresAtencion, getPracticas, PracticaOption, getServicios, getTiposAgenda, getTiposEfector, getTurnosACancelar, SelectorOption, setAgendaEstado, TurnoACancelar, removeBloquePractica, updateBloque, updateAgenda } from "./agendaApi";
import { useUnsavedChanges } from "../navigation/UnsavedChangesContext";
import { XdCard } from "../ui/XdCard";
type AgendaPageProps = {
  openHu7027Token?: number;
};
export function AgendaPage({
  openHu7027Token = 0
}: AgendaPageProps) {
  const { markUnsavedChanges, clearUnsavedChanges } = useUnsavedChanges();
  const [agendaStep, setAgendaStep] = useState<"consulta" | "alta" | "detalle" | "edicion" | "bloques">("consulta");
  const [showSaveErrorModal, setShowSaveErrorModal] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [bloqueVisualizado, setBloqueVisualizado] = useState<AgendaDetail["bloques"][number] | null>(null);
  const {
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
  } = useAgenda();

  const bloqueAgendaFechaDesde = selectedAgenda?.fechaDesde ?? "";
  const bloqueAgendaFechaHasta = selectedAgenda?.fechaHasta ?? "";
  const bloqueFechaDesdeMin = bloqueAgendaFechaDesde || undefined;
  const bloqueFechaDesdeMax = bloqueAgendaFechaHasta || undefined;
  const bloqueFechaHastaMin = bloqueFechaDesde || bloqueAgendaFechaDesde || undefined;
  const bloqueFechaHastaMax = bloqueAgendaFechaHasta || undefined;

  useEffect(() => {
    if (successMessage) {
      clearUnsavedChanges();
    }
  }, [clearUnsavedChanges, successMessage]);

  useEffect(() => {
    if (agendaStep === "bloques" && error) {
      setSaveErrorMessage(error);
      setShowSaveErrorModal(true);
    }
  }, [agendaStep, error]);

  const handlePotentialEdit = (event: FormEvent<HTMLElement>) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement
      || target instanceof HTMLSelectElement
      || target instanceof HTMLTextAreaElement
    ) {
      markUnsavedChanges();
    }
  };

  const handleLimpiarConsulta = () => {
    onLimpiarConsulta();
    clearUnsavedChanges();
  };

  const openAltaAgendaStep = () => {
    setAgendaStep("alta");
    setShowAdvanced(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const openDetalleAgendaStep = (agendaId: string) => {
    setSelectedAgendaId(agendaId);
    setAgendaStep("detalle");
    setShowAdvanced(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const openEdicionAgendaStep = (agendaId: string) => {
    setSelectedAgendaId(agendaId);
    setAgendaStep("edicion");
    setShowAdvanced(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const openBloquesAgendaStep = (agendaId: string) => {
    setSelectedAgendaId(agendaId);
    setAgendaStep("bloques");
    setShowAdvanced(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const closeActiveAgendaStep = () => {
    setAgendaStep("consulta");
    setShowAdvanced(false);
  };

  const handleCreateAgenda = async (event: FormEvent<HTMLFormElement>) => {
    const created = await onCreateAgenda(event);
    if (!created) {
      return;
    }
    setSelectedAgendaId(created.id);
    setAgendaStep("bloques");
    setShowAdvanced(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const renderDiasSelector = () => (
    <div className="agenda-days-grid">
      {diasSemana.map((dia) => (
        <label key={dia.codigo} className="agenda-day-option">
          <input
            type="checkbox"
            checked={bloqueDias.includes(dia.codigo)}
            onChange={() => toggleDiaBloque(dia.codigo)}
          />
          {dia.nombre}
        </label>
      ))}
    </div>
  );

  const diasLabels: Record<string, string> = {
    L: "Lunes", M: "Martes", X: "Miercoles", J: "Jueves",
    V: "Viernes", S: "Sabado", D: "Domingo"
  };

  const renderBloquesResumen = (editable: boolean) => {
    if (!selectedAgenda) return null;

    return (
      <div className="agenda-bloques-section">
        <div className="agenda-bloques-header">
          <h4>Bloques de programacion</h4>
          {editable ? (
            <div className="agenda-bloques-header-actions">
              <button
                type="button"
                className="btn-outline-sm"
                onClick={() => openBloquesAgendaStep(selectedAgenda.id)}
              >
                + Agregar bloque de programacion
              </button>
            </div>
          ) : null}
        </div>
        {selectedAgenda.bloques.length === 0 ? (
          <p className="agenda-bloques-empty">Esta agenda aun no tiene bloques configurados.</p>
        ) : (
          <div className="agenda-bloques-table-wrap">
            <table className="agenda-bloques-table">
              <thead>
                <tr>
                  <th>Programacion</th>
                  <th>Dias</th>
                  <th>Horario</th>
                  <th>Fecha desde-hasta</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedAgenda.bloques.map((bloque) => (
                  <tr key={bloque.id}>
                    <td>
                      <span className="agenda-bloque-nombre">{bloque.nombre}</span>
                      <span className="agenda-bloque-tipo">{bloque.tipoBloque}</span>
                    </td>
                    <td>{bloque.dias.map(d => diasLabels[d] ?? d).join("-") || "-"}</td>
                    <td>{bloque.horaInicio?.slice(0, 5)} a {bloque.horaFin?.slice(0, 5)}</td>
                    <td>{bloque.fechaDesde} - {bloque.fechaHasta}</td>
                    <td>
                      <span className={`agenda-bloque-badge ${bloque.activo ? "badge-activo" : "badge-inactivo"}`}>
                        {bloque.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="agenda-bloque-actions">
                      <button
                        type="button"
                        className="btn-icon-sm"
                        title="Visualizar bloque"
                        aria-label="Visualizar bloque"
                        onClick={() => setBloqueVisualizado(bloque)}
                      >
                        👁️
                      </button>
                      {editable ? (
                        <button
                          type="button"
                          className="btn-icon-sm"
                          title="Editar bloque"
                          aria-label="Editar bloque"
                          onClick={() => {
                            openBloquesAgendaStep(selectedAgenda.id);
                            onSelectedBloqueChanged(bloque.id);
                          }}
                        >
                          ✏
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return <section className="agenda-root">
      <section className="agenda-landing card-block">
        <h2>Gestion de agendas</h2>
        {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
        {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}
        <div className="landing-filters">
          <label>
            Centros
            <select value={centroId} onChange={e => setCentroId(e.target.value)}>
              <option value="">Seleccionar centros</option>
              {centros.map(centro => <option key={centro.id} value={centro.id}>
                  {centro.nombre}
                </option>)}
            </select>
          </label>
          <label>
            Servicio
            <select value={servicioId} onChange={e => setServicioId(e.target.value)} disabled={!centroId}>
              <option value="">Escribir servicio</option>
              {servicios.map(servicio => <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>)}
            </select>
          </label>
          <label>
            Tipo de efector
            <select value={tipoEfector} onChange={e => setTipoEfector(e.target.value)}>
              <option value="">Seleccionar tipo de efector</option>
              {tiposEfector.map(tipo => <option key={tipo} value={tipo}>
                  {tipo}
                </option>)}
            </select>
          </label>
          <label>
            Efector
            <select value={efectorId} onChange={e => setEfectorId(e.target.value)} disabled={!tipoEfector || !servicioId}>
              <option value="">Escribir efector</option>
              {efectores.map(efector => <option key={efector.id} value={efector.id}>
                  {efector.nombre}
                </option>)}
            </select>
          </label>
        </div>
        <div className="landing-actions">
          <button type="button" className="btn-link" onClick={handleLimpiarConsulta}>Limpiar consulta</button>
          <button type="button" className="btn-link" onClick={() => {
          setShowAdvancedFilters(prev => !prev);
        }}>
            Filtros avanzados
          </button>
        </div>

        {showAdvancedFilters ? <div className="landing-advanced-filters">
            <label>
              Codigo o nombre
              <input value={advancedQuery} onChange={e => setAdvancedQuery(e.target.value)} />
            </label>
            <label>
              Tipo de agenda
              <select value={advancedTipoAgenda} onChange={e => setAdvancedTipoAgenda(e.target.value)}>
                <option value="">Todos</option>
                {tiposAgenda.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </label>
            <label>
              Visible contact center
              <select value={advancedVisibleCC} onChange={e => setAdvancedVisibleCC(e.target.value as "all" | "yes" | "no")}>
                <option value="all">Todos</option>
                <option value="yes">Si</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              Vigencia desde
              <input type="date" value={advancedFechaDesde} onChange={e => setAdvancedFechaDesde(e.target.value)} />
            </label>
            <label>
              Vigencia hasta
              <input type="date" value={advancedFechaHasta} onChange={e => setAdvancedFechaHasta(e.target.value)} />
            </label>
          </div> : null}

        <div className="landing-create-agenda">
          <button type="button" className="btn-primary btn-primary--large" onClick={openAltaAgendaStep}>
            Agregar agenda
          </button>
        </div>

        {!loading && fullyFilteredAgendas.length === 0 ? <div className="landing-empty">
            <div className="empty-icon" aria-hidden>🗎</div>
            <p><strong>No dispones de ninguna agenda.</strong></p>
            <p>Agrega agenda</p>
          </div> : null}

        {!loading && fullyFilteredAgendas.length > 0 ? <div className="landing-results">
            <p className="landing-results-title">Resultados: {fullyFilteredAgendas.length} agendas</p>
            <ul>
              {fullyFilteredAgendas.map(agenda => <li key={agenda.id}>
                  <div className="landing-result-main">
                    <button type="button" className="landing-result-link" onClick={() => openDetalleAgendaStep(agenda.id)}>
                      <strong>{agenda.codigo}</strong> - {agenda.nombre}
                    </button>
                    <span>{agenda.activa ? "Activa" : "Inactiva"}</span>
                  </div>
                  <div className="landing-result-actions">
                    <button type="button" className="btn-icon-action" onClick={() => openDetalleAgendaStep(agenda.id)}>
                      Ver
                    </button>
                    <button
                      type="button"
                      className="btn-icon-action btn-icon-action-edit"
                      onClick={() => openEdicionAgendaStep(agenda.id)}
                      title="Editar agenda"
                      aria-label="Editar agenda"
                    >
                      ✏
                    </button>
                    <button type="button" className="btn-icon-action" onClick={() => openBloquesAgendaStep(agenda.id)}>
                      Crear bloque
                    </button>
                  </div>
                </li>)}
            </ul>
          </div> : null}
      </section>

      {showAdvanced && agendaStep === "alta" ? (
        <section className="agenda-page agenda-step-page">
          <div className="advanced-header">
            <div>
              <p className="agenda-step-kicker">Paso 2 de 2</p>
              <h3>Alta de agenda</h3>
            </div>
            <button type="button" className="btn-link" onClick={closeActiveAgendaStep}>Volver a consulta</button>
          </div>

          {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
          {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}

          <form onSubmit={handleCreateAgenda} className="card-block agenda-form create-form vf-form" onChangeCapture={handlePotentialEdit}>
            <h2>Alta de Agenda</h2>
            <p className="agenda-form-note">El codigo de agenda se genera automaticamente por el sistema.</p>
            <div>
              <label>
                Nombre
                <input value={nombre} onChange={e => setNombre(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Centro
                <select value={centroId} onChange={e => setCentroId(e.target.value)}>
                  <option value="">Seleccione centro</option>
                  {centros.map(centro => <option key={centro.id} value={centro.id}>{centro.nombre}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Servicio
                <select value={servicioId} onChange={e => setServicioId(e.target.value)} disabled={!centroId}>
                  <option value="">Seleccione servicio</option>
                  {servicios.map(servicio => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Tipo efector
                <select value={tipoEfector} onChange={e => setTipoEfector(e.target.value)}>
                  <option value="">Seleccione tipo</option>
                  {tiposEfector.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Efector
                <select value={efectorId} onChange={e => setEfectorId(e.target.value)} disabled={!centroId || !servicioId || !tipoEfector}>
                  <option value="">Seleccione efector</option>
                  {efectores.map(efector => <option key={efector.id} value={efector.id}>{efector.nombre}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Tipo de agenda
                <select value={tipoAgenda} onChange={e => setTipoAgenda(e.target.value)}>
                  <option value="">Seleccione tipo de agenda</option>
                  {tiposAgenda.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Fecha desde
                <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Fecha hasta
                <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Observacion
                <input value={observacion} onChange={e => setObservacion(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={visibleContactCenter} onChange={e => setVisibleContactCenter(e.target.checked)} />
                Visible para contact center
              </label>
            </div>
            <button type="submit" disabled={!canSubmit}>Crear agenda</button>
          </form>
        </section>
      ) : null}

      {showAdvanced && agendaStep === "bloques" ? (
        <section className="agenda-page agenda-step-page">
          <div className="advanced-header">
            <div>
              <p className="agenda-step-kicker">Paso 3 de 3</p>
              <h3>Crear bloque</h3>
            </div>
            <button type="button" className="btn-link" onClick={closeActiveAgendaStep}>Volver a consulta</button>
          </div>

          {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
          {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}

          {selectedAgenda && selectedAgenda.bloques.length > 0 ? (
            <section className="card-block vf-form agenda-existing-blocks">
              <h4>Editar bloque existente</h4>
              <div>
                <label>
                  Bloque
                  <select value={selectedBloqueId} onChange={e => onSelectedBloqueChanged(e.target.value)}>
                    <option value="">Seleccione bloque</option>
                    {selectedAgenda.bloques.map((bloque) => (
                      <option key={bloque.id} value={bloque.id}>{bloque.nombre} ({bloque.tipoBloque})</option>
                    ))}
                  </select>
                </label>
              </div>

              {selectedBloqueId ? (
                <p className="agenda-block-context">
                  Vigencia del bloque: <strong>{bloqueFechaDesde}</strong> a <strong>{bloqueFechaHasta}</strong>
                </p>
              ) : null}

              {selectedBloqueId ? (
                <form className="agenda-form create-form vf-form" onSubmit={onEditarBloque} onChangeCapture={handlePotentialEdit}>
                  <div>
                    <label>
                      Fecha puntual de la ocurrencia
                      <input type="date" value={bloqueFecha} onChange={e => setBloqueFecha(e.target.value)} />
                    </label>
                  </div>
                  <div>
                    <label>
                      Hora inicio
                      <input type="time" value={bloqueHoraInicio} onChange={e => setBloqueHoraInicio(e.target.value)} />
                    </label>
                  </div>
                  <div>
                    <label>
                      Hora fin
                      <input type="time" value={bloqueHoraFin} onChange={e => setBloqueHoraFin(e.target.value)} />
                    </label>
                  </div>
                  <div>
                    <label>
                      Intervalo (min)
                      <input type="number" min={1} value={bloqueIntervaloMinutos} onChange={e => setBloqueIntervaloMinutos(e.target.value)} />
                    </label>
                  </div>
                  <button type="submit">Guardar edicion de bloque</button>
                </form>
              ) : null}
            </section>
          ) : null}

          {!selectedAgenda ? (
            <div className="card-block vf-form">
              <p>Cargando agenda recien creada...</p>
            </div>
          ) : selectedAgenda.tipoAgenda === "DEMANDA_ESPONTANEA" ? (
            <form id="hu-8990-form" onSubmit={onAgregarBloqueDemanda} className="card-block agenda-form create-form vf-form" onChangeCapture={handlePotentialEdit}>
              <h2>HU Crear Bloque - Demanda espontanea</h2>
              <p className="agenda-block-context">Agenda: <strong>{selectedAgenda.codigo}</strong> - {selectedAgenda.nombre}</p>

              <div>
                <label>
                  Nombre del bloque
                  <input required value={bloqueNombre} onChange={e => setBloqueNombre(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Fecha desde
                  <input type="date" required min={bloqueFechaDesdeMin} max={bloqueFechaDesdeMax} value={bloqueFechaDesde} onChange={e => setBloqueFechaDesde(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Fecha hasta
                  <input type="date" required min={bloqueFechaHastaMin} max={bloqueFechaHastaMax} value={bloqueFechaHasta} onChange={e => setBloqueFechaHasta(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Hora inicio
                  <input type="time" required value={bloqueHoraInicio} onChange={e => setBloqueHoraInicio(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Hora fin
                  <input type="time" required value={bloqueHoraFin} onChange={e => setBloqueHoraFin(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Duracion turno (min)
                  <input type="number" required min={1} value={bloqueDuracionTurno} onChange={e => setBloqueDuracionTurno(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Sobreturnos
                  <input type="number" required min={0} value={bloqueSobreturnos} onChange={e => setBloqueSobreturnos(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Lugar de atencion
                  <select required value={bloqueLugarAtencionId} onChange={e => setBloqueLugarAtencionId(e.target.value)}>
                    <option value="">Seleccione lugar</option>
                    {lugaresAtencion.map((lugar) => <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>)}
                  </select>
                </label>
              </div>

              <div>
                <p>Dias de atencion</p>
                {renderDiasSelector()}
              </div>

              <div>
                <label>
                  Buscar practica
                  <input value={practicasQuery} onChange={e => setPracticasQuery(e.target.value)} placeholder="Filtrar practicas" />
                </label>
              </div>
              <div className="agenda-practicas-grid">
                {practicasFiltradas.map((practica) => (
                  <label key={practica.nombre} className="agenda-day-option">
                    <input
                      type="checkbox"
                      checked={demandaPracticasSeleccionadas.includes(practica.nombre)}
                      onChange={() => togglePracticaDemanda(practica.nombre)}
                    />
                    {practica.nombre}
                  </label>
                ))}
              </div>

              {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
              {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}

              <button type="submit" disabled={!canSubmitBloqueDemanda}>Guardar bloque de demanda espontanea</button>
            </form>
          ) : (
            <form id="programacion-selector" onSubmit={programadaBloqueTipo === "VARIABLE" ? onAgregarBloqueVariable : onAgregarBloqueFijo} className="card-block agenda-form create-form vf-form" onChangeCapture={handlePotentialEdit}>
              <h2>HU Crear Bloque - Agenda programada</h2>
              <p className="agenda-block-context">Agenda: <strong>{selectedAgenda.codigo}</strong> - {selectedAgenda.nombre}</p>

              <div>
                <label>
                  Tipo de bloque
                  <select value={programadaBloqueTipo} onChange={e => setProgramadaBloqueTipo(e.target.value as "FIJA" | "VARIABLE") }>
                    <option value="FIJA">FIJA</option>
                    <option value="VARIABLE">VARIABLE</option>
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Nombre del bloque
                  <input required value={bloqueNombre} onChange={e => setBloqueNombre(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Fecha desde
                  <input type="date" required min={bloqueFechaDesdeMin} max={bloqueFechaDesdeMax} value={bloqueFechaDesde} onChange={e => setBloqueFechaDesde(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Fecha hasta
                  <input type="date" required min={bloqueFechaHastaMin} max={bloqueFechaHastaMax} value={bloqueFechaHasta} onChange={e => setBloqueFechaHasta(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Hora inicio
                  <input type="time" required value={bloqueHoraInicio} onChange={e => setBloqueHoraInicio(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Hora fin
                  <input type="time" required value={bloqueHoraFin} onChange={e => setBloqueHoraFin(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Duracion turno (min)
                  <input type="number" required min={1} value={bloqueDuracionTurno} onChange={e => setBloqueDuracionTurno(e.target.value)} disabled={programadaBloqueTipo === "VARIABLE"} />
                </label>
              </div>
              <div>
                <label>
                  Sobreturnos
                  <input type="number" required min={0} value={bloqueSobreturnos} onChange={e => setBloqueSobreturnos(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  Lugar de atencion
                  <select required value={bloqueLugarAtencionId} onChange={e => setBloqueLugarAtencionId(e.target.value)}>
                    <option value="">Seleccione lugar</option>
                    {lugaresAtencion.map((lugar) => <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={bloqueAtiendeFeriados} onChange={e => setBloqueAtiendeFeriados(e.target.checked)} />
                  Atiende feriados
                </label>
              </div>
              <div>
                <label>
                  Frecuencia
                  <select required value={bloqueFrecuencia} onChange={e => setBloqueFrecuencia(e.target.value)}>
                    {frecuenciasBloque.map((frecuencia) => <option key={frecuencia} value={frecuencia}>{frecuencia}</option>)}
                  </select>
                </label>
              </div>
              {bloqueFrecuencia === "ORDEN_MENSUAL" ? (
                <div>
                  <p>Semanas del mes (max 2)</p>
                  <div className="agenda-weeks-grid">
                    {[1, 2, 3, 4, 5].map((semana) => (
                      <label key={semana} className="agenda-day-option">
                        <input
                          type="checkbox"
                          checked={bloqueOrdenMensual.includes(semana)}
                          onChange={() => toggleOrdenMensual(semana)}
                        />
                        Semana {semana}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p>Dias de atencion</p>
                {renderDiasSelector()}
              </div>

              <div>
                <label>
                  Buscar practica
                  <input value={practicasQuery} onChange={e => setPracticasQuery(e.target.value)} placeholder="Filtrar practicas" />
                </label>
              </div>
              <div>
                <label>
                  Practica
                  <select value={practicaNombre} onChange={e => setPracticaNombre(e.target.value)}>
                    <option value="">Seleccione practica</option>
                    {practicasFiltradas.map((practica) => <option key={practica.nombre} value={practica.nombre}>{practica.nombre}</option>)}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Duracion practica (opcional)
                  <input type="number" min={1} value={practicaDuracion} onChange={e => setPracticaDuracion(e.target.value)} />
                </label>
              </div>
              <div className="agenda-inline-actions">
                <button type="button" className="btn-outline" onClick={onAgregarPractica}>Agregar practica</button>
              </div>

              {bloquePracticas.length > 0 ? (
                <ul className="agenda-practicas-list">
                  {bloquePracticas.map((practica, index) => (
                    <li key={`${practica.nombre}-${index}`}>
                      <span>{practica.nombre} {practica.duracionMinutos ? `(${practica.duracionMinutos} min)` : ""}</span>
                      <button type="button" className="btn-link" onClick={() => onEliminarPractica(index)}>Quitar</button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
              {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}

              <button type="submit">{programadaBloqueTipo === "VARIABLE" ? "Guardar bloque variable" : "Guardar bloque fijo"}</button>
            </form>
          )}
        </section>
      ) : null}

      {showVariableConfirmModal ? (
        <div className="agenda-modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmar bloque variable">
          <div className="agenda-modal-card">
            <h3>Confirmar bloque variable</h3>
            <p>Se va a crear un bloque variable para la agenda seleccionada. Desea continuar?</p>
            <div className="agenda-inline-actions">
              <button type="button" className="btn-outline" onClick={() => setShowVariableConfirmModal(false)}>Cancelar</button>
              <button type="button" onClick={() => void onConfirmarAgregarBloqueVariable()}>Confirmar</button>
            </div>
          </div>
        </div>
      ) : null}

      {showSaveErrorModal ? (
        <div className="agenda-modal-backdrop" role="dialog" aria-modal="true" aria-label="Error al guardar bloque">
          <div className="agenda-modal-card">
            <h3>No se pudo guardar el bloque</h3>
            <p>{saveErrorMessage || "Ocurrio un error al intentar guardar."}</p>
            <div className="agenda-inline-actions">
              <button
                type="button"
                onClick={() => {
                  setShowSaveErrorModal(false);
                  setSaveErrorMessage("");
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showAdvanced && agendaStep === "detalle" ? (
        <section className="agenda-page agenda-step-page">
          <div className="advanced-header">
            <div>
              <p className="agenda-step-kicker">Paso 2 de 2</p>
              <h3>Detalle de agenda</h3>
            </div>
            <div className="agenda-inline-actions">
              {selectedAgenda ? (
                <button type="button" className="btn-icon-action" onClick={() => openBloquesAgendaStep(selectedAgenda.id)}>
                  Crear bloque
                </button>
              ) : null}
              <button type="button" className="btn-link" onClick={closeActiveAgendaStep}>Volver a consulta</button>
            </div>
          </div>

          {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
          {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}

          <div className="card-block vf-form">
            {!selectedAgenda ? <p>Cargando detalle...</p> : (
              <div className="agenda-detail-grid" aria-label="Datos de la agenda">
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Codigo</span>
                  <strong className="agenda-detail-value">{selectedAgenda.codigo}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Nombre</span>
                  <strong className="agenda-detail-value">{selectedAgenda.nombre}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Centro</span>
                  <strong className="agenda-detail-value">{selectedAgenda.centro}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Servicio</span>
                  <strong className="agenda-detail-value">{selectedAgenda.servicio}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Tipo efector</span>
                  <strong className="agenda-detail-value">{selectedAgenda.tipoEfector}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Efector</span>
                  <strong className="agenda-detail-value">{selectedAgenda.efector}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Tipo agenda</span>
                  <strong className="agenda-detail-value">{selectedAgenda.tipoAgenda}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Fecha desde</span>
                  <strong className="agenda-detail-value">{selectedAgenda.fechaDesde}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Fecha hasta</span>
                  <strong className="agenda-detail-value">{selectedAgenda.fechaHasta ?? "-"}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Visible CC</span>
                  <strong className="agenda-detail-value">{selectedAgenda.visibleContactCenter ? "Si" : "No"}</strong>
                </div>
                <div className="agenda-detail-item">
                  <span className="agenda-detail-label">Estado</span>
                  <strong className="agenda-detail-value">{selectedAgenda.activa ? "Activa" : "Inactiva"}</strong>
                </div>
                <div className="agenda-detail-item agenda-detail-item-wide">
                  <span className="agenda-detail-label">Observacion</span>
                  <strong className="agenda-detail-value">{selectedAgenda.observacion ?? "-"}</strong>
                </div>
              </div>
            )}
          </div>

          {renderBloquesResumen(true)}
        </section>
      ) : null}

      {showAdvanced && agendaStep === "edicion" ? (
        <section className="agenda-page agenda-step-page">
          <div className="advanced-header">
            <div>
              <p className="agenda-step-kicker">Paso 2 de 2</p>
              <h3>Editar agenda</h3>
            </div>
            <div className="agenda-inline-actions">
              {selectedAgenda ? (
                <button type="button" className="btn-icon-action" onClick={() => openBloquesAgendaStep(selectedAgenda.id)}>
                  Crear bloque
                </button>
              ) : null}
              <button type="button" className="btn-link" onClick={closeActiveAgendaStep}>Volver a consulta</button>
            </div>
          </div>

          {successMessage ? <p className="agenda-feedback agenda-feedback-success">{successMessage}</p> : null}
          {error ? <p className="agenda-feedback agenda-feedback-error">{error}</p> : null}

          <form onSubmit={onGuardarCambios} className="card-block agenda-form create-form vf-form" onChangeCapture={handlePotentialEdit}>
            {!selectedAgenda ? <p>Cargando agenda...</p> : (
              <>
                <div>
                  <label>
                    Codigo
                    <input value={editCodigo} onChange={e => setEditCodigo(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label>
                    Nombre
                    <input value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label>
                    Centro
                    <input value={selectedAgenda.centro} disabled />
                  </label>
                </div>
                <div>
                  <label>
                    Servicio
                    <input value={selectedAgenda.servicio} disabled />
                  </label>
                </div>
                <div>
                  <label>
                    Tipo efector
                    <input value={selectedAgenda.tipoEfector} disabled />
                  </label>
                </div>
                <div>
                  <label>
                    Efector
                    <input value={selectedAgenda.efector} disabled />
                  </label>
                </div>
                <div>
                  <label>
                    Tipo de agenda
                    <select value={editTipoAgenda} onChange={e => setEditTipoAgenda(e.target.value)}>
                      <option value="">Seleccione tipo de agenda</option>
                      {tiposAgenda.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    Fecha desde
                    <input type="date" value={editFechaDesde} onChange={e => setEditFechaDesde(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label>
                    Fecha hasta
                    <input type="date" value={editFechaHasta} onChange={e => setEditFechaHasta(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label>
                    Observacion
                    <input value={editObservacion} onChange={e => setEditObservacion(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" checked={editVisibleContactCenter} onChange={e => setEditVisibleContactCenter(e.target.checked)} />
                    Visible para contact center
                  </label>
                </div>
                <button type="submit">Guardar cambios</button>
              </>
            )}
          </form>

          {renderBloquesResumen(true)}
        </section>
      ) : null}

      {bloqueVisualizado ? (
        <div className="agenda-modal-backdrop" role="dialog" aria-modal="true" aria-label="Detalle del bloque de programacion">
          <div className="agenda-modal-card agenda-modal-card--wide">
            <h3>Detalle del bloque de programacion</h3>
            <div className="agenda-bloque-view-grid">
              <div className="agenda-bloque-view-item"><span>ID</span><strong>{bloqueVisualizado.id}</strong></div>
              <div className="agenda-bloque-view-item"><span>Nombre</span><strong>{bloqueVisualizado.nombre}</strong></div>
              <div className="agenda-bloque-view-item"><span>Tipo de bloque</span><strong>{bloqueVisualizado.tipoBloque}</strong></div>
              <div className="agenda-bloque-view-item"><span>Estado</span><strong>{bloqueVisualizado.activo ? "Activo" : "Inactivo"}</strong></div>
              <div className="agenda-bloque-view-item"><span>Fecha desde</span><strong>{bloqueVisualizado.fechaDesde}</strong></div>
              <div className="agenda-bloque-view-item"><span>Fecha hasta</span><strong>{bloqueVisualizado.fechaHasta}</strong></div>
              <div className="agenda-bloque-view-item"><span>Fecha puntual</span><strong>{bloqueVisualizado.fecha}</strong></div>
              <div className="agenda-bloque-view-item"><span>Hora inicio</span><strong>{bloqueVisualizado.horaInicio}</strong></div>
              <div className="agenda-bloque-view-item"><span>Hora fin</span><strong>{bloqueVisualizado.horaFin}</strong></div>
              <div className="agenda-bloque-view-item"><span>Duracion turno (min)</span><strong>{bloqueVisualizado.duracionTurnoMinutos}</strong></div>
              <div className="agenda-bloque-view-item"><span>Intervalo (min)</span><strong>{bloqueVisualizado.intervaloMinutos}</strong></div>
              <div className="agenda-bloque-view-item"><span>Sobreturnos</span><strong>{bloqueVisualizado.sobreturnos}</strong></div>
              <div className="agenda-bloque-view-item"><span>Atiende feriados</span><strong>{bloqueVisualizado.atiendeFeriados ? "Si" : "No"}</strong></div>
              <div className="agenda-bloque-view-item"><span>Frecuencia</span><strong>{bloqueVisualizado.frecuencia}</strong></div>
              <div className="agenda-bloque-view-item"><span>Dias</span><strong>{bloqueVisualizado.dias.map(d => diasLabels[d] ?? d).join(" - ") || "-"}</strong></div>
              <div className="agenda-bloque-view-item"><span>Lugar atencion ID</span><strong>{bloqueVisualizado.lugarAtencionId}</strong></div>
              <div className="agenda-bloque-view-item"><span>Lugar atencion</span><strong>{bloqueVisualizado.lugarAtencionNombre || "-"}</strong></div>
              <div className="agenda-bloque-view-item agenda-bloque-view-item-wide"><span>Orden mensual (semanas)</span><strong>{bloqueVisualizado.ordenMensualSemanas.length > 0 ? bloqueVisualizado.ordenMensualSemanas.join(", ") : "-"}</strong></div>
              <div className="agenda-bloque-view-item agenda-bloque-view-item-wide"><span>Practicas</span><strong>{bloqueVisualizado.practicas.length > 0 ? bloqueVisualizado.practicas.map(p => `${p.nombre}${p.duracionMinutos ? ` (${p.duracionMinutos} min)` : ""}`).join(" | ") : "-"}</strong></div>
            </div>
            <div className="agenda-inline-actions">
              <button type="button" onClick={() => setBloqueVisualizado(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>;
}