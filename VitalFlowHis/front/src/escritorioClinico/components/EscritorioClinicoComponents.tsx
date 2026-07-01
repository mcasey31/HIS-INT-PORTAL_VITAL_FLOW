import { useEscritorioClinico } from "../useEscritorioClinico";
type useEscritorioClinicoState = ReturnType<typeof useEscritorioClinico>;
import { sanitizeRichTextHtml } from "../EscritorioClinicoPage";

const estadoChipClass = (estado: string) => `hc-chip hc-chip-${estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export function EscritorioClinicoHeader({ state }: { state: useEscritorioClinicoState }) {
  const {
    formatAgendaDate, fechaAgenda, setFechaAgenda, shiftIsoDate, loadTurnos, loading, working,
    servicioActualNombre, horarioConfigurado, lugarAtencionNombre, esDiaActual, efectoresDisponibles,
    setLugarAtencionPendienteId, setLugarAtencionError, setShowLugarAtencionModal, efectorId, isAdminUsuario, isMedicoUsuario,
    PROFESIONAL_ACTUAL
  } = state;

  return (
    <>
      <header className="hc-header">
        <div>
          <h2>Escritorio clinico</h2>
          <p>Landing panoramica integrada con estados de atencion.</p>
        </div>
        <div className="hc-header-actions">
          <button type="button" className="btn-outline" onClick={() => setFechaAgenda(prev => shiftIsoDate(prev, -1))}>
            ← Dia anterior
          </button>
          <span className="hc-fecha-badge">{formatAgendaDate(fechaAgenda)}</span>
          <button type="button" className="btn-outline" onClick={() => setFechaAgenda(prev => shiftIsoDate(prev, 1))}>
            Dia siguiente →
          </button>
          <button type="button" className="btn-outline" onClick={() => void loadTurnos()} disabled={loading || working}>
            Actualizar listado
          </button>
        </div>
      </header>

      <section className="panel hc-agenda-header" aria-label="Cabecera agenda asistencial">
        <p><strong>Fecha:</strong> {formatAgendaDate(fechaAgenda)}</p>
        <p><strong>Agenda:</strong> Agenda {servicioActualNombre}</p>
        <p><strong>Servicio:</strong> {servicioActualNombre}</p>
        <p><strong>Profesional/equipo:</strong> {PROFESIONAL_ACTUAL}</p>
        <p><strong>Horario:</strong> {horarioConfigurado}</p>
        <div className="hc-agenda-lugar">
          <p><strong>Lugar de atencion:</strong> {lugarAtencionNombre}</p>
          {isAdminUsuario || isMedicoUsuario ? <button type="button" className="btn-outline" disabled={!esDiaActual || efectoresDisponibles?.length === 0} onClick={() => {
            setLugarAtencionPendienteId(efectorId);
            setLugarAtencionError(null);
            setShowLugarAtencionModal(true);
          }}>
            Cambiar consultorio
          </button> : null}
        </div>
      </section>
    </>
  );
}

export function EscritorioClinicoFiltros({ state }: { state: useEscritorioClinicoState }) {
  const {
    servicioId, serviciosDisponibles, efectorId, setEfectorId, efectoresDisponibles,
    estadoFiltro, setEstadoFiltro, selectores, estadoLabel, query, setQuery, isAdminUsuario, isMedicoUsuario
  } = state;

  return (
    <section className="hc-filters panel" aria-label="Filtros de listado clinico">
      {!isMedicoUsuario || isAdminUsuario ? <>
        <label>
          Servicio
          <select value={servicioId} disabled>
            {serviciosDisponibles?.map(servicio => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
          </select>
        </label>

        <label>
          Efector
          <select value={efectorId} onChange={event => setEfectorId(event.target.value)}>
            <option value="">Todos</option>
            {efectoresDisponibles?.map(efector => <option key={efector.id} value={efector.id}>{efector.nombre}</option>)}
          </select>
        </label>
      </> : null}

      <label>
        Estado
        <select value={estadoFiltro} onChange={event => setEstadoFiltro(event.target.value)}>
          <option value="">Todos</option>
          {(selectores?.estados ?? []).map(estado => <option key={estado} value={estado}>{estadoLabel(estado)}</option>)}
        </select>
      </label>

      <label>
        Buscar paciente
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nombre, documento, servicio o efector" />
      </label>
    </section>
  );
}

export function EscritorioClinicoListado({ state }: { state: useEscritorioClinicoState }) {
  const {
    loading, turnosFiltrados, selectedTurnoId, contadorLlamados, formatLlegada, estadoLabel,
    abrirHistoriaClinica, abrirDesdeMegafono, estadoEsLlamable, working, esDiaActual, verTurno
  } = state;

  const rowClass = (estado: string) =>
    `hc-row-${estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section className="hc-list panel" aria-label="Listado de pacientes">
      <h3>Pacientes del dia</h3>
      {loading ? <p>Cargando pacientes...</p> : null}

      {!loading && turnosFiltrados?.length === 0 ? <p>No hay pacientes para mostrar con los filtros actuales.</p> : null}

      {!loading && turnosFiltrados?.length > 0 ? <>
        <div className="hc-pacientes-grid hc-pacientes-grid-header" role="row">
          <span>Turno</span>
          <span>Llegada</span>
          <span>Paciente</span>
          <span>Financiador</span>
          <span>Practica</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <ul className="hc-pacientes" role="list">
          {turnosFiltrados.map(turno => {
            const selected = turno.id === selectedTurnoId;
            const llamados = contadorLlamados[turno.id] ?? 0;
            const llegadaLabel = formatLlegada(turno.llegada);
            return (
              <li key={turno.id} className={[selected ? "is-selected" : "", rowClass(turno.estado)].filter(Boolean).join(" ")}>
                <div className="hc-pacientes-grid" role="row">
                  <div className="hc-cell">
                    <p className="hc-cell-main">{turno.turno}</p>
                  </div>

                  <div className="hc-cell">
                    <p>{llegadaLabel}</p>
                  </div>

                  <div className="hc-cell">
                    <p className="hc-paciente-title">{turno.paciente}</p>
                    <p className="hc-cell-meta">{turno.documento}</p>
                  </div>

                  <div className="hc-cell">
                    <p>{turno.financiador}</p>
                  </div>

                  <div className="hc-cell">
                    <p>{turno.servicio}</p>
                  </div>

                  <div className="hc-cell hc-cell-estado">
                    <span className={`hc-chip hc-chip-${turno.estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                      {estadoLabel(turno.estado)}
                    </span>
                    {llamados > 0 ? (
                      <span className="hc-chip hc-chip-llamados" title={`Llamado ${llamados} vez${llamados !== 1 ? "es" : ""}`}>
                        📣 {llamados}
                      </span>
                    ) : null}
                  </div>

                  <div className="hc-paciente-actions">
                    <button
                      type="button"
                      className="hc-icon-button hc-icon-btn-ver"
                      title="Ver datos del turno"
                      aria-label="Ver datos del turno"
                      onClick={() => verTurno(turno)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/>
                      </svg>
                      <span className="sr-only">Ver turno</span>
                    </button>
                    <button
                      type="button"
                      className="hc-icon-button hc-icon-btn-hc"
                      title="Abrir historia clinica"
                      aria-label="Abrir historia clinica"
                      onClick={() => void abrirHistoriaClinica(turno)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 11l3 3 8-8"/>
                        <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9"/>
                      </svg>
                      <span className="sr-only">Historia clinica</span>
                    </button>
                    <button
                      type="button"
                      className="hc-icon-button hc-icon-btn-call"
                      title="Llamar por megafono"
                      aria-label="Llamar por megafono"
                      onClick={() => void abrirDesdeMegafono(turno)}
                      disabled={!estadoEsLlamable(turno.estado) || working || !esDiaActual}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 11l19-9-9 19-2-8-8-2z"/>
                      </svg>
                      <span className="sr-only">Llamar</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </> : null}
    </section>
  );
}

export function EscritorioClinicoPanoramica({ state }: { state: useEscritorioClinicoState }) {
  const {
    selectedTurno, estadoLabel, modoIngreso, encuentroEstado, abrirEvoluciones, abrirSolicitudEstudios,
    totalEstudiosSolicitadosTurno, abrirRecetaDigital, canIntegrarRecetario, abrirDesdeMegafono, canLlamar, working,
    esDiaActual, setAccionSalidaEncuentro, setShowSalidaEncuentroModal, setSelectedTurnoId, panoramica, formatDateTime,
    origenPanoramica, puedeAbrirEvoluciones, puedeSolicitarEstudios,
    setEvolucionesFiltroProfesional, setEvolucionesFiltroServicio, setShowEvolucionesListado
  } = state;

  const pacienteEnAtencion = selectedTurno?.estado === "EN_ATENCION";
  const puedeVolverListado = origenPanoramica === "historia";
  const puedeSalirEncuentro = origenPanoramica !== "historia" || pacienteEnAtencion;

  return (
    <section className="hc-panoramica panel" aria-label="Landing panoramica">
      {!selectedTurno ? <div className="hc-empty-panoramica">
        <h3>Panoramica</h3>
        <p>Selecciona un paciente desde Plantilla HC o Megafono para abrir la historia clinica.</p>
      </div> : <>
        <header className="hc-panoramica-header">
          <div>
            <h3>Panoramica de Historia Clinica</h3>
            <p>
              Paciente: <strong>{selectedTurno.paciente}</strong> | Estado: <strong>{estadoLabel(selectedTurno.estado)}</strong>
            </p>
            <p>
              Documento: <strong>{selectedTurno.documento}</strong>
              {" | "}
              Financiador: <strong>{selectedTurno.financiador}</strong>
            </p>
            <p>
              Ingreso por <strong>{modoIngreso === "megafono" ? "Megafono" : "Plantilla HC"}</strong>
              {" | "}
              Encuentro: <strong>{estadoLabel(encuentroEstado)}</strong>
            </p>
          </div>

          <div className="hc-panoramica-actions">
            <button type="button" className="btn-outline" onClick={abrirEvoluciones} disabled={!puedeAbrirEvoluciones}>
              Evoluciones
            </button>
            <button type="button" className="btn-outline" onClick={abrirSolicitudEstudios} disabled={!puedeSolicitarEstudios}>
              Solicitar estudios ({totalEstudiosSolicitadosTurno})
            </button>
            <button type="button" className="btn-receta-digital" onClick={abrirRecetaDigital} disabled={!canIntegrarRecetario(selectedTurno)}>
              Receta Digital
            </button>
            <button type="button" onClick={() => void abrirDesdeMegafono(selectedTurno)} disabled={!canLlamar || working || !esDiaActual}>
              Llamar
            </button>
            {puedeSalirEncuentro ? <button type="button" className="btn-outline" onClick={() => {
                setAccionSalidaEncuentro("");
                setShowSalidaEncuentroModal(true);
              }} disabled={working || !esDiaActual}>
                Salir
              </button> : null}
            {puedeVolverListado ? <button type="button" className="btn-outline" onClick={() => setSelectedTurnoId(null)}>
                Volver al listado
              </button> : null}
          </div>
        </header>

        <div className="hc-grid">
          {panoramica?.map(seccion => <article key={seccion.key} className={`hc-card${seccion.key === "problemas-cronicos" ? " hc-card-problemas" : ""}`}>
            <h4>{seccion.titulo}</h4>

            {seccion.registros.length === 0 ? <p className="hc-card-empty">No dispone datos</p> : <ul>
              {seccion.registros.map(registro => {
                const { fecha, hora } = formatDateTime(registro.fechaHora);
                const isProblemasCronicos = seccion.key === "problemas-cronicos";
                const isUltimaAtencion = seccion.key === "ultima-atencion";
                return <li key={registro.id}>
                  {isUltimaAtencion ? <button type="button" className="hc-evolucion-link" disabled={!puedeAbrirEvoluciones} onClick={() => {
                    if (!puedeAbrirEvoluciones) {
                      return;
                    }
                    setEvolucionesFiltroProfesional("");
                    setEvolucionesFiltroServicio("");
                    setShowEvolucionesListado(true);
                  }}>
                    {fecha} | {registro.detalle}
                  </button> : <>
                    <p className="hc-row-title">{registro.titulo}</p>
                    <p>{registro.detalle}</p>
                  </>}

                  {isUltimaAtencion ? <p>
                    Problemas asociados: {registro.problemasAsociados?.length ? registro.problemasAsociados.join(", ") : "Sin datos"}
                  </p> : null}

                  {isProblemasCronicos ? <>
                    <p className="hc-row-meta">Fecha de creacion: {fecha}</p>
                    <p className="hc-row-meta">Evoluciones asociadas: {registro.evolucionesAsociadas ?? 0}</p>
                  </> : <p className="hc-row-meta">Fecha: {fecha} | Hora: {hora}</p>}
                </li>;
              })}
            </ul>}
          </article>)}
        </div>
      </>}
    </section>
  );
}

// ... the rest of modals will go here...
