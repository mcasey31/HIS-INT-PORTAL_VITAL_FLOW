import { useAdmisionController } from "../useAdmisionController";
type useAdmisionState = ReturnType<typeof useAdmisionController>;
import { isPrivadoFinanciador, estadoAdmisionLabel } from "../admisionTypes";

export function AdmisionIdentificacionPaciente({ state }: { state: useAdmisionState }) {
  const {
    pacienteSeleccionado, onIdentificarPaciente, tipoDocumento, setTipoDocumento, tiposDocumento,
    numeroDocumento, setNumeroDocumento, loadingIdentificacion, candidatosPaciente, setPacienteSeleccionado,
    inicializarCoberturaPaciente, setCabeceraExpandida, setInfo
  } = state;

  if (pacienteSeleccionado) return null;

  return (
    <>
      <form className="admision-identificacion" onSubmit={event => void onIdentificarPaciente(event)}>
        <label>
          Tipo de documento
          <select value={tipoDocumento} onChange={event => setTipoDocumento(event.target.value)}>
            {tiposDocumento.map(item => <option key={item.codigo} value={item.codigo}>{item.descripcion ?? item.nombre ?? item.codigo}</option>)}
          </select>
        </label>

        <label>
          Numero de documento
          <input value={numeroDocumento} onChange={event => setNumeroDocumento(event.target.value)} />
        </label>

        <div className="admision-identificacion-actions">
          <button type="submit" disabled={loadingIdentificacion}>
            {loadingIdentificacion ? "Buscando..." : "Buscar paciente"}
          </button>
        </div>
      </form>

      {candidatosPaciente.length > 0 ? <section className="admision-candidatos" aria-label="Candidatos de paciente">
          <h3>Coincidencias de paciente</h3>
          <div className="admision-candidatos-list">
            {candidatosPaciente.map(item => <button key={item.id} type="button" className="btn-outline" onClick={() => {
        setPacienteSeleccionado(item);
        inicializarCoberturaPaciente(item);
        setCabeceraExpandida(false);
        setInfo("Paciente seleccionado para admision.");
      }}>
                {item.apellidosNombres} - {item.tipoDocumento} {item.numeroDocumento}
              </button>)}
          </div>
        </section> : null}
    </>
  );
}

export function AdmisionCabeceraPaciente({ state }: { state: useAdmisionState }) {
  const {
    pacienteSeleccionado, edadPaciente, iconoSexo, fechaNacimientoPaciente, financiadorSeleccionado,
    cabeceraExpandida, setCabeceraExpandida, setPacienteSeleccionado, setModoArriboProgramado, setTurnosPacienteDia,
    setTurnoSeleccionadoId, setFinanciadoresPaciente, setFinanciadorPlanId, setElegibilidadManual, setFinanciadorModalOpen,
    setNumeroDocumento, setCandidatosPaciente, setInfo, financiadoresVigentes, onAbrirModalFinanciador,
    elegibilidadCompleta, onAbrirDemandaEspontanea, loadingAgendasDemanda,
    financiadorPlanId, elegibilidadManual
  } = state;

  if (!pacienteSeleccionado) return null;

  return (
    <section className="admision-cabecera" aria-label="Cabecera de paciente en admision">
      <div className="admision-cabecera-main">
        <div className="admision-cabecera-identidad">
          <p className="admision-cabecera-kicker">Paciente seleccionado</p>
          <p className="admision-cabecera-nombre">{pacienteSeleccionado.apellidosNombres} ({edadPaciente} anos)</p>
        </div>

        <span className="admision-cabecera-sexo" aria-label={`Sexo biologico ${pacienteSeleccionado.sexoBiologico}`}>
          {iconoSexo}
        </span>

        <div className="admision-cabecera-core">
          <div>
            <span className="admision-cabecera-label">Documento</span>
            <p>{pacienteSeleccionado.tipoDocumento} {pacienteSeleccionado.numeroDocumento}</p>
          </div>
          <div>
            <span className="admision-cabecera-label">Fecha de nacimiento</span>
            <p>{fechaNacimientoPaciente}</p>
          </div>
          <div>
            <span className="admision-cabecera-label">Financiador / plan</span>
            <p>{financiadorSeleccionado ? `${financiadorSeleccionado.financiador} | ${financiadorSeleccionado.plan}` : "Sin cobertura seleccionada"}</p>
          </div>
        </div>

        <div className="admision-cabecera-actions">
          <button type="button" className="btn-outline admision-cabecera-toggle" onClick={() => setCabeceraExpandida(prev => !prev)} aria-label={cabeceraExpandida ? "Ocultar detalle de paciente" : "Ver detalle de paciente"}>
            {cabeceraExpandida ? "Ocultar detalle" : "Ver detalle"}
          </button>

          <button type="button" className="btn-outline" onClick={() => {
        setPacienteSeleccionado(null);
        setCabeceraExpandida(false);
        setModoArriboProgramado(false);
        setTurnosPacienteDia([]);
        setTurnoSeleccionadoId(null);
        setFinanciadoresPaciente([]);
        setFinanciadorPlanId("");
        setElegibilidadManual({});
        setFinanciadorModalOpen(false);
        setNumeroDocumento("");
        setCandidatosPaciente([]);
        setInfo("Puede buscar y seleccionar otro paciente.");
      }}>
            CAMBIAR PACIENTE
          </button>
        </div>
      </div>

      {cabeceraExpandida ? <div className="admision-cabecera-detalle">
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Sexo biologico</span>
            <p>{pacienteSeleccionado.sexoBiologico || "No informado"}</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Genero autopercibido</span>
            <p>No informado</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Telefono</span>
            <p>No informado</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Correo electronico</span>
            <p>No informado</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Ubicacion</span>
            <p>No informado</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Direccion</span>
            <p>No informado</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Financiador / plan</span>
            <p>{financiadorSeleccionado ? `${financiadorSeleccionado.financiador} | ${financiadorSeleccionado.plan}` : "-"}</p>
          </article>
          <article className="admision-detalle-card">
            <span className="admision-detalle-label">Nro de afiliado</span>
            <p>{financiadorSeleccionado?.numeroAfiliado || "No informado"}</p>
          </article>
        </div> : null}

      <section className="admision-financiador-head" aria-label="Gestion de financiadores">
        <label>
          Financiador y plan vigente
          <div className="admision-financiador-edit-wrap">
            <select value={financiadorPlanId} onChange={event => setFinanciadorPlanId(event.target.value)}>
              <option value="">Seleccione</option>
              {financiadoresVigentes.map(fin => <option key={fin.id} value={fin.id}>
                  {fin.financiador} | {fin.plan}
                  {fin.numeroAfiliado ? ` - ${fin.numeroAfiliado}` : ""}
                </option>)}
            </select>
            <button
              type="button"
              className="icon-edit-btn"
              onClick={onAbrirModalFinanciador}
              title="Editar financiadores"
              aria-label="Editar financiadores"
            >
              ✏
            </button>
          </div>
        </label>

        <div className="admision-pills-row">
          {financiadoresVigentes.length === 0 ? <span className="admision-pill admision-pill-warning">Sin financiadores vigentes</span> : null}
          {financiadoresVigentes.map(fin => {
        const elegible = elegibilidadManual[fin.id] === true;
        return <span key={fin.id} className={`admision-pill ${fin.id === financiadorPlanId ? "admision-pill-selected" : ""}`}>
                {fin.financiador} {fin.plan} {isPrivadoFinanciador(fin) ? "(Privado)" : elegible ? "(Elegibilidad OK)" : "(Sin verificar)"}
              </span>;
      })}
        </div>

        {financiadorSeleccionado && !isPrivadoFinanciador(financiadorSeleccionado) ? <label className="checkbox-row admision-elegibilidad-check">
            <input type="checkbox" checked={elegibilidadManual[financiadorSeleccionado.id] === true} onChange={event => setElegibilidadManual(prev => ({
        ...prev,
        [financiadorSeleccionado.id]: event.target.checked
      }))} />
            Elegibilidad OK (verificacion manual sobre portal del financiador)
          </label> : <p className="admision-step-help">Para cobertura Privado/Particular no aplica check de elegibilidad manual.</p>}

        {!elegibilidadCompleta ? <p className="admision-elegibilidad-warning">Debe tildar Elegibilidad OK en todos los financiadores activos no privados para habilitar Admitir Paciente.</p> : null}

        <div className="admision-arribo-actions">
          <button type="button" className="btn-outline" onClick={() => void onAbrirDemandaEspontanea()} disabled={loadingAgendasDemanda || !pacienteSeleccionado}>
            {loadingAgendasDemanda ? "Cargando agendas..." : "+ DEMANDA ESPONTANEA"}
          </button>
        </div>
      </section>
    </section>
  );
}

export function AdmisionFiltros({ state }: { state: useAdmisionState }) {
  const {
    onBuscar, servicioId, setServicioId, selectores, practicaId, setPracticaId, practicasDisponibles,
    tipoEfector, setTipoEfector, efectorId, setEfectorId, efectoresDisponibles, fecha, setFecha,
    estado, setEstado, searching, mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados, filtroPaciente,
    setFiltroPaciente, filtroFinanciador, setFiltroFinanciador, onMoverFechaAdmision, fechaEsHoy
  } = state;

  return (
    <form className="admision-filtros" onSubmit={event => void onBuscar(event)}>
      <div className="admision-filtros-main">
        <label>
          Servicio
          <select value={servicioId} onChange={event => setServicioId(event.target.value)}>
            <option value="">Todos</option>
            {selectores.servicios.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
        </label>

        <label>
          Practica
          <select value={practicaId} onChange={event => setPracticaId(event.target.value)}>
            <option value="">Todas</option>
            {practicasDisponibles.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
        </label>

        <label>
          Tipo de efector
          <select value={tipoEfector} onChange={event => setTipoEfector(event.target.value)}>
            <option value="">Todos</option>
            {selectores.tiposEfector.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          Efector
          <select value={efectorId} onChange={event => setEfectorId(event.target.value)}>
            <option value="">Todos</option>
            {efectoresDisponibles.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
        </label>

        <label>
          Fecha del turno
          <div className="admision-fecha-nav">
            <button type="button" className="btn-outline" onClick={() => onMoverFechaAdmision(-1)} aria-label="Dia anterior">
              ◀
            </button>
            <input type="date" value={fecha} onChange={event => setFecha(event.target.value)} />
            <button type="button" className="btn-outline" onClick={() => onMoverFechaAdmision(1)} aria-label="Dia siguiente">
              ▶
            </button>
          </div>
        </label>

        <label>
          Estado
          <select value={estado} onChange={event => setEstado(event.target.value)}>
            <option value="">Todos</option>
            {selectores.estados.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <div className="admision-actions">
          <button type="submit" disabled={searching}>{searching ? "Buscando..." : "Buscar"}</button>
          <button type="button" className="btn-outline" onClick={() => setMostrarFiltrosAvanzados(prev => !prev)}>
            {mostrarFiltrosAvanzados ? "Ocultar filtros avanzados" : "Mostrar filtros avanzados"}
          </button>
        </div>
      </div>

      {mostrarFiltrosAvanzados ? (
        <div className="admision-filtros-avanzados">
          <label>
            Paciente (avanzado)
            <input value={filtroPaciente} onChange={event => setFiltroPaciente(event.target.value)} placeholder="Buscar por nombre y/o apellido" />
          </label>

          <label>
            Financiador (avanzado)
            <input value={filtroFinanciador} onChange={event => setFiltroFinanciador(event.target.value)} placeholder="Buscar por financiador" />
          </label>
        </div>
      ) : null}

      {!fechaEsHoy ? <p className="admision-elegibilidad-warning">Solo es posible admitir y cambiar estados en la fecha actual del sistema. Para otras fechas la vista queda en solo lectura.</p> : null}
    </form>
  );
}

export function AdmisionAccionesTurno({ state }: { state: useAdmisionState }) {
  const {
    turnoSeleccionado, onAdmitirPacienteProgramado, puedeIniciarAdmitirProgramado, arribandoId,
    actualizandoEstadoId, onIniciarAtencionTurnoSeleccionado, onFinalizarAtencionTurnoSeleccionado,
    puedeIniciarAtencionProgramada, puedeFinalizarAtencionProgramada, fechaEsHoy
  } = state;

  return (
    <section className="admision-acciones-turno" aria-label="Acciones de admision">
      <div className="admision-arribo-actions">
        <button
          type="button"
          className={puedeIniciarAdmitirProgramado && arribandoId === null && fechaEsHoy ? "admision-btn-admitir-ready" : undefined}
          onClick={() => void onAdmitirPacienteProgramado()}
          disabled={!puedeIniciarAdmitirProgramado || arribandoId !== null || !fechaEsHoy}
        >
          {arribandoId ? "Confirmando..." : "ADMITIR PACIENTE"}
        </button>
        {turnoSeleccionado && fechaEsHoy && turnoSeleccionado.estado === "EN_SALA_DE_ESPERA" ? (
          <button type="button" className="btn-outline" onClick={() => void onIniciarAtencionTurnoSeleccionado()} disabled={!puedeIniciarAtencionProgramada || actualizandoEstadoId !== null}>
            {actualizandoEstadoId ? "Actualizando..." : "INICIAR ATENCION"}
          </button>
        ) : null}
        {turnoSeleccionado && fechaEsHoy && turnoSeleccionado.estado === "EN_ATENCION" ? (
          <>
            <button type="button" className="btn-outline" onClick={() => void onFinalizarAtencionTurnoSeleccionado("ATENDIDO")} disabled={!puedeFinalizarAtencionProgramada || actualizandoEstadoId !== null}>
              {actualizandoEstadoId ? "Actualizando..." : "FINALIZAR ATENDIDO"}
            </button>
            <button type="button" className="btn-outline" onClick={() => void onFinalizarAtencionTurnoSeleccionado("NO_ATENDIDO")} disabled={!puedeFinalizarAtencionProgramada || actualizandoEstadoId !== null}>
              {actualizandoEstadoId ? "Actualizando..." : "FINALIZAR NO ATENDIDO"}
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function AdmisionListado({ state }: { state: useAdmisionState }) {
  const {
    turnosVisibles, puedeGestionarPracticasTurno, turnoSeleccionado, onAbrirAgregarPracticas,
    loadingPracticasModal, practicasTurnoSeleccionado, onSolicitarEliminarPractica, turnoSeleccionadoId,
    setTurnoSeleccionadoId, fechaEsHoy
  } = state;

  const estadoRowClass = (estado: string) => {
    return `estado-${estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  };

  const estadoChipClass = (estado: string) => {
    return `admision-estado-chip admision-estado-chip-${estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  };

  return (
    <section className={`admision-lista ${fechaEsHoy ? "" : "is-readonly-date"}`.trim()} aria-label="Listado de turnos programados">
      <h3>{`Turnos programados del dia (${turnosVisibles.length})`}</h3>

      {puedeGestionarPracticasTurno ? <article className="admision-practicas-panel" aria-label="Practicas del turno seleccionado">
          <div className="admision-practicas-head">
            <div>
              <h4>Practicas del turno seleccionado</h4>
              <p>
                Turno: <strong>{turnoSeleccionado?.turno}</strong>
              </p>
            </div>

            <button type="button" className="btn-outline" onClick={() => void onAbrirAgregarPracticas()} disabled={loadingPracticasModal}>
              {loadingPracticasModal ? "Cargando..." : "AGREGAR PRACTICAS"}
            </button>
          </div>

          {practicasTurnoSeleccionado.length === 0 ? <p className="admision-step-help">Sin practicas agregadas al turno.</p> : <ul className="admision-practicas-list">
              {practicasTurnoSeleccionado.map(item => <li key={item} className="admision-practica-item">
                  <span>{item}</span>
                  <button type="button" className="btn-outline" onClick={() => onSolicitarEliminarPractica(item)} aria-label={`Eliminar practica ${item}`}>
                    Eliminar
                  </button>
                </li>)}
            </ul>}
        </article> : null}

      {turnosVisibles.length === 0 ? <p>No hay turnos para los filtros seleccionados.</p> : <div className="admision-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Seleccion</th>
                <th>Turno</th>
                <th>Llegada</th>
                <th>Paciente</th>
                <th>Documento</th>
                <th>Financiador</th>
                <th>Servicio</th>
                <th>Efector</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {turnosVisibles.map(item => <tr key={item.id} className={`${turnoSeleccionadoId === item.id ? "is-selected" : ""} ${estadoRowClass(item.estado)}`.trim()}>
                  <td>
                      <button
                        type="button"
                      className={`admision-row-select-btn ${turnoSeleccionadoId === item.id ? item.estado === "PROGRAMADO" ? "is-selected-programado" : "is-selected" : ""}`.trim()}
                        onClick={() => setTurnoSeleccionadoId(item.id)}
                        aria-label="Seleccionar turno"
                        aria-pressed={turnoSeleccionadoId === item.id}
                        disabled={!fechaEsHoy || (item.estado !== "PROGRAMADO" && item.estado !== "EN_SALA_DE_ESPERA" && item.estado !== "EN_ATENCION")}
                      >
                      {turnoSeleccionadoId === item.id ? "Seleccionado" : "Seleccionar"}
                    </button>
                  </td>
                  <td>{item.turno}</td>
                  <td>{item.llegada ?? "-"}</td>
                  <td>{item.paciente}</td>
                  <td>{item.documento}</td>
                  <td>{item.financiador}</td>
                  <td>{item.servicio}</td>
                  <td>{item.efector}</td>
                  <td>
                    <span className={estadoChipClass(item.estado)}>{estadoAdmisionLabel(item.estado)}</span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}

    </section>
  );
}
