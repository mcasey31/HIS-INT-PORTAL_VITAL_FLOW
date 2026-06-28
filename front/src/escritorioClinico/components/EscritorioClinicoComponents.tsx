import { useState, useEffect } from "react";
import { useEscritorioClinicoController } from "../useEscritorioClinicoController";
type useEscritorioClinicoState = ReturnType<typeof useEscritorioClinicoController>;
import { sanitizeRichTextHtml, CATEGORIAS_PROBLEMA } from "../escritorioClinicoTypes";

const estadoChipClass = (estado: string) => `hc-chip hc-chip-${estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TemporizadorAtencion({ creadoEn }: { creadoEn: string }) {
  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    const update = () => {
      const start = new Date(creadoEn).getTime();
      if (isNaN(start)) return;
      setElapsed(formatElapsed(Date.now() - start));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [creadoEn]);
  if (!elapsed) return null;
  return <span className="hc-timer-atencion" title="Tiempo de atención">⏱ {elapsed}</span>;
}

export function EscritorioClinicoHeader({ state }: { state: useEscritorioClinicoState }) {
  const {
    formatAgendaDate, fechaAgenda, setFechaAgenda, shiftIsoDate, loadTurnos, loading, working,
    servicioActualNombre, horarioConfigurado, lugarAtencionNombre, esDiaActual, efectoresDisponibles,
    setLugarAtencionPendienteId, setLugarAtencionError, setShowLugarAtencionModal, efectorId, isAdminUsuario, isMedicoUsuario,
    PROFESIONAL_ACTUAL, abrirBuscarPaciente
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
          <button type="button" onClick={state.abrirBuscarPaciente}>
            Buscar Paciente
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
    abrirHistoriaClinica, abrirDesdeMegafono, estadoEsLlamable, working, esDiaActual, verTurno,
    solicitudesEstudiosPorTurno
  } = state;

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
              <li key={turno.id} className={selected ? "is-selected" : ""}>
                <div className="hc-pacientes-grid" role="row">
                  <div className="hc-cell">
                    <p className="hc-cell-main">{turno.turno}</p>
                  </div>

                  <div className={`hc-cell ${turno.llegada ? "hc-cell-llegada" : ""}`}>
                    {turno.llegada ? <p><span className="hc-llegada-check" title="Recepcionado">✓</span> {llegadaLabel}</p> : <p>{llegadaLabel}</p>}
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
                    <span className={estadoChipClass(turno.estado)}>{turno.estado === "ATENDIDO" ? <><span className="hc-atendido-check" aria-hidden="true">✓</span> {estadoLabel(turno.estado)}</> : estadoLabel(turno.estado)}</span>
                    <span className="hc-chip">Llamados: {llamados}</span>
                    {solicitudesEstudiosPorTurno[turno.id] && Object.keys(solicitudesEstudiosPorTurno[turno.id]).length > 0 ? (
                      <span className="hc-chip hc-chip-estudios" title="Estudios solicitados">
                        Est: {Object.values(solicitudesEstudiosPorTurno[turno.id]).reduce((acc, arr) => acc + arr.length, 0)}
                      </span>
                    ) : null}
                  </div>

                  <div className="hc-paciente-actions">
                    <button type="button" className="hc-icon-button" title="Ver datos del turno" aria-label="Ver datos del turno" onClick={() => verTurno(turno)}>
                      <span aria-hidden="true">👁</span>
                    </button>
                    <button type="button" className="hc-icon-button" title={turno.llegada ? "Abrir historia clinica" : "El paciente no ha registrado ingreso (sin arribo)"} aria-label="Abrir historia clinica" onClick={() => void abrirHistoriaClinica(turno)} disabled={!turno.llegada}>
                      <span aria-hidden="true">📋</span>
                    </button>
                    <button type="button" className="hc-icon-button" title={turno.llegada ? "Llamar por megafono" : "El paciente no ha registrado ingreso (sin arribo)"} aria-label="Llamar por megafono" onClick={() => void abrirDesdeMegafono(turno)} disabled={!turno.llegada || !estadoEsLlamable(turno.estado) || working || !esDiaActual}>
                      <span aria-hidden="true">📣</span>
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
    selectedTurno, estadoLabel, modoIngreso, encuentroEstado, encuentroCreadoEn, abrirEvoluciones, abrirSolicitudEstudios,
    totalEstudiosSolicitadosTurno, abrirRecetaDigital, canIntegrarRecetario, abrirDesdeMegafono, canLlamar, working,
    abrirBuscarMedicamento,
    esDiaActual, setAccionSalidaEncuentro, setShowSalidaEncuentroModal, setSelectedTurnoId, panoramica, formatDateTime,
    origenPanoramica, puedeAbrirEvoluciones, puedeSolicitarEstudios,
    setEvolucionesFiltroProfesional, setEvolucionesFiltroServicio, setShowEvolucionesListado,
    showAsignarProblemaModal, setShowAsignarProblemaModal,
    abrirSistemasClinicos, canIntegrarSistemasClinicos,
    solicitudesEstudiosPorTurno
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
           <div className="hc-panoramica-info-compact">
            <h4>Panoramica de Historia Clinica</h4>
            <p>
              <strong>{selectedTurno.paciente}</strong> — {selectedTurno.documento} — {selectedTurno.financiador} — Estado: {estadoLabel(selectedTurno.estado)}
              {" — "}Encuentro: {estadoLabel(encuentroEstado)}
              {encuentroEstado === "ABIERTO" && encuentroCreadoEn ? <> — <TemporizadorAtencion creadoEn={encuentroCreadoEn} /></> : null}
            </p>
          </div>

          {selectedTurno && solicitudesEstudiosPorTurno[selectedTurno.id] && Object.keys(solicitudesEstudiosPorTurno[selectedTurno.id]).length > 0 ? (
            <div className="hc-panoramica-solicitudes">
              <h4>Estudios solicitados:</h4>
              <ul className="hc-solicitudes-lista">
                {Object.entries(solicitudesEstudiosPorTurno[selectedTurno.id]).map(([fecha, practicas]) =>
                  practicas.map(practica => (
                    <li key={`${fecha}-${practica}`} className="hc-tag-pill">{practica} <small>{fecha}</small></li>
                  ))
                )}
              </ul>
            </div>
          ) : null}

          <div className="hc-panoramica-actions">
            <button type="button" className="btn-panoramica btn-panoramica-evoluciones" onClick={abrirEvoluciones} disabled={!puedeAbrirEvoluciones}>
              📝 Evoluciones
            </button>
            <button type="button" className="btn-panoramica btn-panoramica-estudios" onClick={abrirSolicitudEstudios} disabled={!puedeSolicitarEstudios}>
              🔬 Estudios ({totalEstudiosSolicitadosTurno})
            </button>
            <button type="button" className="btn-panoramica btn-panoramica-receta" onClick={abrirRecetaDigital} disabled={!selectedTurno || !selectedTurno.llegada || selectedTurno.paciente === "Por identificar"}>
              💊 Prescribir
            </button>
            <button type="button" className="btn-panoramica btn-panoramica-sistemas" onClick={abrirSistemasClinicos} disabled={!canIntegrarSistemasClinicos(selectedTurno) || !selectedTurno?.llegada}>
              💻 Sist. Clínicos
            </button>
            <button type="button" className="btn-panoramica btn-panoramica-llamar" onClick={() => void abrirDesdeMegafono(selectedTurno)} disabled={!canLlamar || working || !esDiaActual}>
              📣 Llamar
            </button>
            {puedeSalirEncuentro ? <button type="button" className="btn-panoramica btn-panoramica-cerrar" onClick={() => {
                setAccionSalidaEncuentro("");
                setShowSalidaEncuentroModal(true);
              }} disabled={working || !esDiaActual}>
                🚪 Cerrar atención
              </button> : null}
            {puedeVolverListado ? <button type="button" className="btn-panoramica btn-panoramica-volver" onClick={() => setSelectedTurnoId(null)}>
                ⬅️ Volver al listado
              </button> : null}
          </div>
        </header>

        <div className="hc-grid">
          <article className="hc-card">
            <h4>Estudios complementarios {selectedTurno && solicitudesEstudiosPorTurno[selectedTurno.id] ? `(${Object.values(solicitudesEstudiosPorTurno[selectedTurno.id]).reduce((acc, arr) => acc + arr.length, 0)})` : ""}</h4>
            {!selectedTurno || !solicitudesEstudiosPorTurno[selectedTurno.id] ? <p className="hc-card-empty">No dispone datos</p> : Object.keys(solicitudesEstudiosPorTurno[selectedTurno.id]).length === 0 ? <p className="hc-card-empty">Sin estudios solicitados</p> : <ul>
              {Object.entries(solicitudesEstudiosPorTurno[selectedTurno.id]).flatMap(([fecha, practicas]) =>
                practicas.map(practica => (
                  <li key={`${fecha}-${practica}`}>
                    <p className="hc-row-title">{practica}</p>
                    <p className="hc-row-meta">Fecha: {fecha}</p>
                  </li>
                ))
              )}
            </ul>}
          </article>
          {panoramica?.map(seccion => {
            const isProblemas = seccion.key === "problemas-cronicos";
            return <article key={seccion.key} className={`hc-card${isProblemas ? " hc-card-problemas" : ""}`}>
            <h4>{seccion.titulo}</h4>

            {isProblemas ? renderProblemasGrouped(seccion.registros, showAsignarProblemaModal, setShowAsignarProblemaModal) : <>
              {seccion.registros.length === 0 ? <p className="hc-card-empty">No dispone datos</p> : <ul>
                {seccion.registros.map(registro => {
                  const { fecha, hora } = formatDateTime(registro.fechaHora);
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

                    <p className="hc-row-meta">Fecha: {fecha} | Hora: {hora}</p>
                  </li>;
                })}
              </ul>}
            </>}
          </article>;
          })}
        </div>
      </>}
    </section>
  );
}

function renderProblemasGrouped(
  registros: useEscritorioClinicoState["panoramica"][number]["registros"],
  showModal: boolean,
  setShowModal: (v: boolean) => void
) {
  const grouped: Record<string, typeof registros> = {};
  for (const cat of CATEGORIAS_PROBLEMA) {
    grouped[cat] = [];
  }
  for (const r of registros) {
    const [categoria] = r.detalle.split(" | ");
    const cat = categoria ?? "Activo";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  }

  return <div className="hc-problemas-container">
    <button type="button" className="btn-outline hc-asignar-problema-btn" onClick={() => setShowModal(true)}>
      + Asignar Problema
    </button>
    {CATEGORIAS_PROBLEMA.map(cat => {
      const items = grouped[cat] ?? [];
      return <div key={cat} className="hc-problema-categoria">
        <h5 className="hc-problema-categoria-titulo">{cat}</h5>
        {items.length === 0 ? <p className="hc-card-empty">No dispone de ningun problema {cat.toLowerCase()}</p> : <ul>
          {items.map(item => {
            const fecha = item.fechaHora;
            return <li key={item.id}>
              <p className="hc-row-title">{item.titulo}</p>
              <p className="hc-row-meta">Fecha de inicio: {fecha}</p>
            </li>;
          })}
        </ul>}
      </div>;
    })}
  </div>;
}

export function BuscarPacienteModal({ state }: { state: useEscritorioClinicoState }) {
  const {
    showBuscarPacienteModal, cerrarBuscarPaciente,
    buscarPacienteTipoDoc, setBuscarPacienteTipoDoc,
    buscarPacienteNumDoc, setBuscarPacienteNumDoc,
    buscarPacienteCandidatos, buscarPacienteSeleccionado,
    buscarPacienteError, buscarPacienteLoading,
    showSetMinimoSearch, buscarPacienteNombre, setBuscarPacienteNombre,
    buscarPacienteApellido, setBuscarPacienteApellido,
    buscarPacienteFechaNacimiento, setBuscarPacienteFechaNacimiento,
    buscarPacienteSexoBiologico, setBuscarPacienteSexoBiologico,
    buscarPacienteSetMinimoLoading,
    handleBuscarPacientePorDocumento, handleBuscarPacientePorSetMinimo,
    handleSeleccionarPacienteFueraAgenda, handleVolverBuscarPaciente, working
  } = state;

  if (!showBuscarPacienteModal) return null;

  return <div className="modal-backdrop" onClick={() => cerrarBuscarPaciente()}>
    <div className="modal-content hc-buscar-paciente-modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Buscar paciente</h3>
        <button type="button" className="modal-close" onClick={() => cerrarBuscarPaciente()}>&times;</button>
      </div>
      <div className="modal-body">
        {buscarPacienteError ? <p className="hc-problema-error">{buscarPacienteError}</p> : null}

        {buscarPacienteSeleccionado ? <div className="hc-buscar-paciente-resultado">
          <p className="hc-buscar-paciente-nombre">{buscarPacienteSeleccionado.apellidosNombres}</p>
          <p>Documento: {buscarPacienteSeleccionado.tipoDocumento} {buscarPacienteSeleccionado.numeroDocumento}</p>
          <p>Fecha de nacimiento: {buscarPacienteSeleccionado.fechaNacimiento}</p>
          <p>Sexo: {buscarPacienteSeleccionado.sexoBiologico}</p>
          <div className="confirm-actions" style={{ marginTop: "1rem" }}>
            <button type="button" className="btn-outline" onClick={() => handleVolverBuscarPaciente()}>Volver</button>
            <button type="button" className="btn-outline" onClick={() => cerrarBuscarPaciente()}>Cerrar</button>
          </div>
        </div> : <>
          <div className="hc-buscar-paciente-form">
            <label>
              Tipo de documento
              <select value={buscarPacienteTipoDoc} onChange={e => setBuscarPacienteTipoDoc(e.target.value)}>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cedula">Cedula</option>
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label>
              Numero de documento
              <input type="text" value={buscarPacienteNumDoc} onChange={e => setBuscarPacienteNumDoc(e.target.value)} placeholder="Ingrese numero de documento" />
            </label>
            <button type="button" onClick={() => void handleBuscarPacientePorDocumento()} disabled={buscarPacienteLoading || !buscarPacienteNumDoc.trim()}>
              {buscarPacienteLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {buscarPacienteCandidatos.length > 0 ? <div className="hc-buscar-paciente-resultados">
            <h4>Candidatos encontrados</h4>
            <ul>
              {buscarPacienteCandidatos.map(c => <li key={c.id}>
                <button type="button" className="hc-buscar-paciente-candidato" onClick={() => handleSeleccionarPacienteFueraAgenda(c)} disabled={working}>
                  <strong>{c.apellidosNombres}</strong>
                  <span>{c.tipoDocumento} {c.numeroDocumento}</span>
                  <span>{c.fechaNacimiento} | {c.sexoBiologico}</span>
                </button>
              </li>)}
            </ul>
          </div> : null}

          {showSetMinimoSearch ? <div className="hc-buscar-paciente-set-minimo">
            <h4>Busqueda por set minimo de datos</h4>
            <label>
              Nombre
              <input type="text" value={buscarPacienteNombre} onChange={e => setBuscarPacienteNombre(e.target.value)} placeholder="Nombre" />
            </label>
            <label>
              Apellido
              <input type="text" value={buscarPacienteApellido} onChange={e => setBuscarPacienteApellido(e.target.value)} placeholder="Apellido" />
            </label>
            <label>
              Fecha de nacimiento
              <input type="date" value={buscarPacienteFechaNacimiento} onChange={e => setBuscarPacienteFechaNacimiento(e.target.value)} />
            </label>
            <label>
              Sexo biologico
              <select value={buscarPacienteSexoBiologico} onChange={e => setBuscarPacienteSexoBiologico(e.target.value)}>
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="X">X</option>
              </select>
            </label>
            <button type="button" onClick={() => void handleBuscarPacientePorSetMinimo()} disabled={buscarPacienteSetMinimoLoading || !buscarPacienteNombre.trim() || !buscarPacienteApellido.trim() || !buscarPacienteFechaNacimiento.trim() || !buscarPacienteSexoBiologico.trim()}>
              {buscarPacienteSetMinimoLoading ? "Buscando..." : "Buscar por set minimo"}
            </button>
          </div> : null}
        </>}
      </div>
      {!buscarPacienteSeleccionado ? <div className="modal-footer">
        <button type="button" className="btn-outline" onClick={() => cerrarBuscarPaciente()}>Cerrar</button>
      </div> : null}
    </div>
  </div>;
}

export function AsignarProblemaModal({ state }: { state: useEscritorioClinicoState }) {
  const {
    showAsignarProblemaModal, setShowAsignarProblemaModal,
    problemaNuevaDescripcion, setProblemaNuevaDescripcion,
    problemaNuevaCategoria, setProblemaNuevaCategoria,
    problemaNuevaFechaInicio, setProblemaNuevaFechaInicio,
    problemaFormError, handleAsignarProblema, working
  } = state;

  if (!showAsignarProblemaModal) return null;

  return <div className="modal-backdrop" onClick={() => setShowAsignarProblemaModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Asignar Problema</h3>
        <button type="button" className="modal-close" onClick={() => setShowAsignarProblemaModal(false)}>&times;</button>
      </div>
      <div className="modal-body">
        {problemaFormError ? <p className="hc-problema-error">{problemaFormError}</p> : null}
        <div className="hc-problema-form-group">
          <label htmlFor="prob-categoria">Categoria</label>
          <select id="prob-categoria" value={problemaNuevaCategoria} onChange={e => setProblemaNuevaCategoria(e.target.value)}>
            {CATEGORIAS_PROBLEMA.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="hc-problema-form-group">
          <label htmlFor="prob-fecha">Fecha de inicio</label>
          <input id="prob-fecha" type="date" value={problemaNuevaFechaInicio} onChange={e => setProblemaNuevaFechaInicio(e.target.value)} />
        </div>
        <div className="hc-problema-form-group">
          <label htmlFor="prob-descripcion">Problema</label>
          <input id="prob-descripcion" type="text" placeholder="Escriba el nombre del problema" value={problemaNuevaDescripcion} onChange={e => setProblemaNuevaDescripcion(e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn-outline" onClick={() => setShowAsignarProblemaModal(false)}>Cancelar</button>
        <button type="button" className="btn-primary" onClick={() => void handleAsignarProblema()} disabled={working || !problemaNuevaDescripcion.trim()}>
          {working ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  </div>;
}
