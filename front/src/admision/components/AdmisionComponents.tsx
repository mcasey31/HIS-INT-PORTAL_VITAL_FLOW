import { useState } from "react";
import { useAdmisionController } from "../useAdmisionController";
type useAdmisionState = ReturnType<typeof useAdmisionController>;
import { isPrivadoFinanciador, estadoAdmisionLabel, parseDocumentoTurno } from "../admisionTypes";
import type { TurnoAdmision } from "../admisionTypes";
import { identificarPacienteAdmision } from "../admisionApi";
import { listarRecetasPaciente, obtenerRecetaDigital, obtenerFinanciadorActivo } from "../../escritorioClinico/escritorioClinicoApi";
import type { RecetaDigitalResumenResponse, RecetaDigitalDetalleResponse } from "../../escritorioClinico/escritorioClinicoTypes";

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

  const [recetaModalOpen, setRecetaModalOpen] = useState(false);
  const [recetaModalPaciente, setRecetaModalPaciente] = useState("");
  const [recetaModalList, setRecetaModalList] = useState<RecetaDigitalResumenResponse[]>([]);
  const [recetaModalDetalles, setRecetaModalDetalles] = useState<Record<string, RecetaDigitalDetalleResponse>>({});
  const [recetaModalLoading, setRecetaModalLoading] = useState(false);
  const [recetaModalAnulando, setRecetaModalAnulando] = useState<string | null>(null);

  async function handleVerRecetas(item: TurnoAdmision) {
    setRecetaModalOpen(true);
    setRecetaModalPaciente(item.paciente);
    setRecetaModalList([]);
    setRecetaModalDetalles({});
    setRecetaModalLoading(true);
    try {
      const doc = parseDocumentoTurno(item.documento);
      if (!doc) return;
      const candidatos = await identificarPacienteAdmision(doc.tipoDocumento, doc.numeroDocumento);
      if (candidatos.length === 0) return;
      const recetas = await listarRecetasPaciente(candidatos[0].id);
      setRecetaModalList(recetas);
      const activas = recetas.filter(r => r.estado === "ACTIVA");
      if (activas.length > 0) {
        const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
        const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
        for (const result of results) {
          if (result.status === "fulfilled") {
            detalles[result.value.recetaId] = result.value;
          }
        }
        if (Object.keys(detalles).length > 0) setRecetaModalDetalles(detalles);
      }
    } catch {
      setRecetaModalList([]);
    } finally {
      setRecetaModalLoading(false);
    }
  }

  async function imprimirRecetaAdmision(receta: RecetaDigitalResumenResponse) {
    try {
      const detalle = await obtenerRecetaDigital(receta.recetaId);
      var pid = detalle.pacienteId;
      const financiador = await obtenerFinanciadorActivo(pid).catch(() => null);
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      const items = detalle.items.map(item => `
        <tr>
          <td class="med-item">${item.medicamentoDisplay}</td>
          <td>${item.dosisTexto ?? "-"}</td>
          <td>${item.frecuenciaTexto ?? "-"}</td>
          <td>${item.duracionDias ? item.duracionDias + " días" : "-"}</td>
          <td>${item.indicacion ?? "-"}</td>
        </tr>
      `).join("\n");
      const matriculaTexto = detalle.prescriptorMatricula ? `MP ${detalle.prescriptorMatricula}` : "";
      const medicoLabel = detalle.prescriptorMatricula ? `Médico matrícula ${detalle.prescriptorMatricula}` : "Médico";
      const financiadorTexto = financiador?.financiadorNombre ? `${financiador.financiadorNombre}${financiador.numeroAfiliado ? " - N° " + financiador.numeroAfiliado : ""}` : "—";
      printWindow.document.write(`
        <html><head><meta charset="utf-8">
        <title>Prescripción Médica</title>
        <style>
          @page { margin: 2cm; }
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #222; line-height: 1.5; }
          h1 { font-size: 16pt; text-align: center; color: #1a3c5e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.2cm; border-bottom: 3px double #1a3c5e; padding-bottom: 0.4cm; }
          .info-grid { display: flex; flex-wrap: wrap; gap: 0.4rem 2.5rem; margin-bottom: 0.8cm; padding: 0.5cm 0.4cm; border: 1px solid #ccc; border-radius: 4px; background: #fafbfc; }
          .info-grid p { margin: 0.15rem 0; font-size: 10.5pt; }
          .info-grid strong { color: #1a3c5e; }
          table { width: 100%; border-collapse: collapse; margin-top: 0.4cm; }
          th { background: #e8edf3; padding: 0.4rem 0.5rem; border-bottom: 2px solid #8a9eb0; text-align: left; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.04em; color: #2b4b6e; }
          td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #d5dee8; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          .med-item { font-weight: 600; font-size: 11pt; color: #111; }
          .firma { margin-top: 2.5cm; text-align: center; }
          .firma hr { width: 45%; margin: 0 auto 0.3cm; border: none; border-top: 1px solid #555; }
          .firma p { margin: 0.15rem 0; color: #333; }
          .firma .medico-nombre { font-weight: 700; font-size: 12pt; }
          .firma .medico-matricula { font-size: 10pt; color: #555; }
        </style>
        </head><body>
        <h1>Receta Médica</h1>
        <div class="info-grid">
          <p><strong>${medicoLabel}</strong></p>
          <p><strong>Paciente:</strong> ${recetaModalPaciente || "—"}</p>
          <p><strong>Obra Social:</strong> ${financiadorTexto}</p>
          <p><strong>Fecha:</strong> ${new Date(detalle.creadoEn).toLocaleDateString("es-AR")}</p>
        </div>
        <table><thead><tr>
          <th style="width:35%">Medicamento</th><th style="width:15%">Dosis</th><th style="width:18%">Frecuencia</th><th style="width:12%">Duración</th><th style="width:20%">Indicación</th>
        </tr></thead><tbody>${items}</tbody></table>
        <div class="firma">
          <hr>
          <p class="medico-nombre">${medicoLabel}</p>
          <p class="medico-matricula">${matriculaTexto || "Firma y sello del médico"}</p>
        </div>
        </body></html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch {
      // silent
    }
  }

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
                <th>Receta</th>
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
                  <td>
                    <button type="button" className="btn-icon-receta" onClick={() => void handleVerRecetas(item)} disabled={!item.documento || item.documento === "-"} title="Ver recetas">
                      💊
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}

      {recetaModalOpen ? <div className="modal-backdrop">
        <section className="confirm-modal hc-medicamento-modal">
          <div className="modal-header">
            <h3>Recetas — {recetaModalPaciente}</h3>
            <button type="button" className="modal-close" onClick={() => setRecetaModalOpen(false)}>&times;</button>
          </div>
          <div className="modal-body">
            {recetaModalLoading ? <p>Cargando recetas...</p> : recetaModalList.length === 0 ? <p>Sin recetas para este paciente.</p> : <>
              {recetaModalList.map(receta => {
                const detalle = recetaModalDetalles[receta.recetaId];
                return <div key={receta.recetaId} style={{ borderBottom: "1px solid #d5dee8", padding: "0.6rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontWeight: 700, color: "#25466b", margin: 0 }}>
                        {new Date(receta.creadoEn).toLocaleDateString("es-AR")}
                        <span className={`hc-chip hc-chip-${receta.estado.toLowerCase()}`} style={{ marginLeft: "0.5rem" }}>{receta.estado}</span>
                      </p>
                      {detalle ? detalle.items.map(item => (
                        <p key={item.itemId} style={{ margin: "0.2rem 0 0 0.5rem", color: "#556f8d", fontSize: "0.85rem" }}>
                          {item.medicamentoDisplay}{item.dosisTexto ? ` — ${item.dosisTexto}` : ""}{item.frecuenciaTexto ? ` c/ ${item.frecuenciaTexto}` : ""}{item.duracionDias ? ` × ${item.duracionDias}d` : ""}
                        </p>
                      )) : receta.estado === "ACTIVA" ? <p style={{ margin: "0.2rem 0 0 0.5rem", color: "#999", fontSize: "0.82rem" }}>Cargando detalle...</p> : null}
                    </div>
                    <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                      <button type="button" className="btn-panoramica btn-panoramica-receta" style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }} onClick={() => void imprimirRecetaAdmision(receta)} disabled={receta.estado !== "ACTIVA"} title="Imprimir receta">
                        🖨
                      </button>
                    </div>
                  </div>
                </div>;
              })}
            </>}
          </div>
        </section>
      </div> : null}

    </section>
  );
}
