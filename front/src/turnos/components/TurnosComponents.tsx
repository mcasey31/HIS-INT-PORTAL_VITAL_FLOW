import { useEffect, useMemo, useState } from "react";
import { useTurnosController } from "../useTurnosController";
import { parseIsoDateTimeParts, formatFechaHora, estadoTurnoLabel } from "../turnosTypes";
type useTurnosState = ReturnType<typeof useTurnosController>;

export function TurnosIdentificacion({ state, navigate }: { state: useTurnosState, navigate: any }) {
  const {
    tiposDocumento, setTipoDocumento, tipoDocumento, setNumeroDocumento, numeroDocumento, loadingIdentificacion, onConsultarPaciente,
    resultadoIdentificacion, paciente, financiadorPlanId, setFinanciadorPlanId, financiadoresVigentes, onAbrirModalFinanciador
  } = state;
  return (
    <section className="turnos-step-card" aria-label="Paso 1 identificacion paciente">
      <h3>Paso 1 obligatorio: Identificacion de paciente</h3>
      <p className="turnos-step-help">
        La busqueda de disponibilidad horaria inicia solo cuando la persona esta identificada como paciente y tiene financiador seleccionado.
      </p>

      <form onSubmit={onConsultarPaciente}>
        <div className="turnos-grid-2">
          <label>
            Tipo de documento
            <select value={tipoDocumento} onChange={event => setTipoDocumento(event.target.value)}>
              {tiposDocumento.map(tipo => <option key={tipo.codigo} value={tipo.codigo}>{tipo.nombre}</option>)}
            </select>
          </label>
          <label>
            Numero de documento
            <input value={numeroDocumento} onChange={event => setNumeroDocumento(event.target.value.toUpperCase())} placeholder="Ingrese numero" />
          </label>
        </div>
        <div className="personas-actions">
          <button type="submit" disabled={loadingIdentificacion || numeroDocumento.trim().length === 0}>
            {loadingIdentificacion ? "Consultando..." : "Consultar paciente"}
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate('/personas')}>
            Ir a Identificacion de personas
          </button>
        </div>
      </form>

      {resultadoIdentificacion === "single" && paciente && (
        <div className="turnos-paciente-ok">
          <p>
            <strong>Paciente:</strong> {paciente.apellidosNombres} - {paciente.tipoDocumento} {paciente.numeroDocumento}
          </p>
          <div className="turnos-financiador-head">
            <label>
              Financiador y plan
              <div className="turnos-financiador-edit-wrap">
                <select value={financiadorPlanId} onChange={event => setFinanciadorPlanId(event.target.value)}>
                  {financiadoresVigentes.map(fin => (
                    <option key={fin.id} value={fin.id}>
                      {fin.financiador} - {fin.plan}
                      {fin.numeroAfiliado ? ` - ${fin.numeroAfiliado}` : ""}
                    </option>
                  ))}
                </select>
                <button type="button" className="icon-edit-btn" onClick={onAbrirModalFinanciador} title="Editar financiador/plan" aria-label="Editar financiador/plan">
                  ✏
                </button>
              </div>
            </label>
            <div className="turnos-pills-row">
              {financiadoresVigentes.map(fin => (
                <span key={fin.id} className={`turnos-pill ${fin.id === financiadorPlanId ? "turnos-pill-selected" : ""}`}>
                  {fin.financiador} {fin.plan}
                </span>
              ))}
            </div>
            <p className="turnos-step-help">Para cambiar financiador/plan use el icono de edicion y gestione vigencias desde el modal.</p>
          </div>
        </div>
      )}

      {resultadoIdentificacion === "multiple" && (
        <div className="turnos-alert turnos-alert-warn">
          <p>La identificacion no devolvio un candidato unico. Continua por Identificacion de personas para resolverlo.</p>
        </div>
      )}
      {resultadoIdentificacion === "none" && (
        <div className="turnos-alert turnos-alert-warn">
          <p>La identificacion no devolvio un candidato unico. Continua por Identificacion de personas para resolverlo.</p>
        </div>
      )}
    </section>
  );
}

export function TurnosBusqueda({ state }: { state: useTurnosState }) {
  const {
    centrosDisponibles, centrosSeleccionados, onToggleCentro, paciente, servicioId, setServicioId, serviciosDisponibles,
    practicaId, setPracticaId, practicasDisponibles, profesionalId, setProfesionalId, profesionalesDisponibles,
    onBuscarDisponibilidad, puedeBuscarDisponibilidad, loadingDisponibilidad
  } = state;
  return (
    <section className="turnos-step-card" aria-label="Paso 2 disponibilidad horaria">
      <h3>Paso 2: Busqueda de disponibilidad</h3>
      <p className="turnos-step-help">Filtros obligatorios: Centro(s), Servicio y Practica. Profesional es opcional.</p>

      <div className="turnos-grid-2">
        <div>
          <span className="turnos-label">Centros *</span>
          <div className="turnos-multi-select">
            {centrosDisponibles.length === 0 ? (
              <p className="turnos-empty-field">No hay centros disponibles. Verifique agenda activa, visible para contact center y con bloque vigente.</p>
            ) : (
              centrosDisponibles.map(centro => (
                <label key={centro.id} className="checkbox-row turnos-checkbox-row">
                  <input type="checkbox" checked={centrosSeleccionados.includes(centro.id)} onChange={() => onToggleCentro(centro.id)} disabled={!paciente} />
                  {centro.nombre}
                </label>
              ))
            )}
          </div>
        </div>

        <label>
          Servicio *
          <select value={servicioId} onChange={event => setServicioId(event.target.value)} disabled={!paciente}>
            <option value="">Seleccione</option>
            {serviciosDisponibles?.map(servicio => (
              <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Practica *
          <select value={practicaId} onChange={event => setPracticaId(event.target.value)} disabled={!paciente}>
            <option value="">Seleccione</option>
            {practicasDisponibles?.map(practica => (
              <option key={practica.id} value={practica.id}>{practica.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Profesional (opcional)
          <select value={profesionalId} onChange={event => setProfesionalId(event.target.value)} disabled={!paciente}>
            <option value="">Todos</option>
            {profesionalesDisponibles?.map(profesional => (
              <option key={profesional.id} value={profesional.id}>{profesional.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="personas-actions">
        <button type="button" onClick={() => void onBuscarDisponibilidad()} disabled={!puedeBuscarDisponibilidad || loadingDisponibilidad}>
          {loadingDisponibilidad ? "Buscando..." : "Buscar disponibilidad"}
        </button>
      </div>

      {!paciente && (
        <div className="turnos-alert">
          Primero debe identificar paciente y seleccionar financiador.
        </div>
      )}
    </section>
  );
}

export function TurnosProximosPaciente({ state }: { state: useTurnosState }) {
  const { paciente, loadingTurnosPaciente, turnosPaciente, turnoACancelarId, setTurnoACancelarId, cancelandoTurnoId, cancelacionExitosa, setCancelacionExitosa } = state;

  if (!paciente) {
    return null;
  }

  const now = new Date();
  const limiteTresMeses = new Date(now);
  limiteTresMeses.setMonth(limiteTresMeses.getMonth() + 3);

  const turnosProgramadosProximos = (turnosPaciente ?? [])
    .filter(turno => {
      if (turno.estado !== "AGENDADO") {
        return false;
      }
      const fecha = new Date(turno.fechaHora);
      return !Number.isNaN(fecha.getTime()) && fecha >= now && fecha <= limiteTresMeses;
    })
    .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
    .slice(0, 9);

  const formatCardMonth = (value: string) => {
    const parts = parseIsoDateTimeParts(value);
    if (parts) {
      const date = new Date(parts.year, parts.month - 1, parts.day);
      return new Intl.DateTimeFormat("es-AR", { month: "short" })
        .format(date)
        .replace(".", "")
        .toUpperCase();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "---";
    }

    return new Intl.DateTimeFormat("es-AR", { month: "short" })
      .format(date)
      .replace(".", "")
      .toUpperCase();
  };

  const formatCardDay = (value: string) => {
    const parts = parseIsoDateTimeParts(value);
    if (parts) {
      return String(parts.day).padStart(2, "0");
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    return String(date.getDate()).padStart(2, "0");
  };

  const formatCardTime = (value: string) => {
    const parts = parseIsoDateTimeParts(value);
    if (parts) {
      return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return <section className="turnos-step-card" aria-label="Proximos turnos del paciente">
      <h3>Turnos del paciente</h3>
      {loadingTurnosPaciente ? <p>Cargando turnos del paciente...</p> : <div className="turnos-proximos-wrapper">
          <div className="turnos-proximos-header">
            <h4>Proximos turnos programados</h4>
            <span className="turnos-proximos-count">{turnosProgramadosProximos.length}</span>
          </div>

          {turnosProgramadosProximos.length === 0 ? <div className="turnos-proximos-empty">Paciente sin turnos proximos.</div> : <div className="turnos-proximos-grid">
              {turnosProgramadosProximos.map(turno => <article key={turno.id} className="turnos-proximo-card">
                  <div className="turnos-proximo-fecha">
                    <span className="turnos-proximo-mes">{formatCardMonth(turno.fechaHora)}</span>
                    <span className="turnos-proximo-dia">{formatCardDay(turno.fechaHora)}</span>
                    <span className="turnos-proximo-hora">{formatCardTime(turno.fechaHora)}</span>
                  </div>
                  <div className="turnos-proximo-info">
                    <p><strong>Servicio:</strong> {turno.servicio}</p>
                    <p><strong>Profesional:</strong> {turno.profesional}</p>
                    <p><strong>Centro:</strong> {turno.centro}</p>
                  </div>
                  <div className="turnos-proximo-actions">
                    <button
                      type="button"
                      className="btn-danger-outline"
                      onClick={() => setTurnoACancelarId(turno.id)}
                      disabled={cancelandoTurnoId === turno.id}
                      aria-label="Cancelar turno"
                    >
                      {cancelandoTurnoId === turno.id ? "Cancelando..." : "✕ Cancelar"}
                    </button>
                  </div>
                </article>)}
            </div>}
        </div>}
    </section>;
}

export function TurnosResultados({ state }: { state: useTurnosState }) {
  const {
    slots, selectedSlotId, onAbrirConfirmacionAsignacion, onAbrirModalSobreturno,
    verHistorialTurnos, setVerHistorialTurnos, loadingTurnosPaciente, turnosPaciente, totalTurnosPaciente,
    cargarTurnosPaciente, paciente, setTurnoACancelarId, cancelandoTurnoId
  } = state;

  const fechasDisponibles = useMemo(() => {
    return Array.from(new Set((slots ?? []).map(slot => slot.fecha)))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [slots]);

  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [mesVisible, setMesVisible] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (fechasDisponibles.length === 0) {
      setFechaSeleccionada("");
      const now = new Date();
      setMesVisible(new Date(now.getFullYear(), now.getMonth(), 1));
      return;
    }

    if (!fechaSeleccionada || !fechasDisponibles.includes(fechaSeleccionada)) {
      setFechaSeleccionada(fechasDisponibles[0]);
    }

    const primeraFecha = new Date(`${fechasDisponibles[0]}T00:00:00`);
    setMesVisible(new Date(primeraFecha.getFullYear(), primeraFecha.getMonth(), 1));
  }, [fechasDisponibles]);

  const slotsFiltrados = fechaSeleccionada
    ? slots.filter(slot => slot.fecha === fechaSeleccionada)
    : slots;

  const formatIsoDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatFechaTitulo = (isoDate: string) => {
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long"
    }).format(date);
  };

  const nombreMesVisible = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric"
  }).format(mesVisible);

  const primerDiaMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1);
  const diasEnMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
  const offsetPrimerDia = (primerDiaMes.getDay() + 6) % 7;

  const celdasCalendario: Array<{ key: string; label: string; iso?: string; disponible: boolean; selected: boolean }> = [];

  for (let i = 0; i < offsetPrimerDia; i++) {
    celdasCalendario.push({ key: `empty-${i}`, label: "", disponible: false, selected: false });
  }

  const fechasSet = new Set(fechasDisponibles);
  for (let day = 1; day <= diasEnMes; day++) {
    const date = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), day);
    const iso = formatIsoDate(date);
    const disponible = fechasSet.has(iso);
    celdasCalendario.push({
      key: iso,
      label: String(day),
      iso,
      disponible,
      selected: fechaSeleccionada === iso
    });
  }

  return (
    <>
      <section className="turnos-step-card" aria-label="Resultados disponibilidad">
        <h3>Resultados de disponibilidad, seleccion y sobreturnos</h3>
        {(!slots || slots.length === 0) ? <p>Sin resultados para mostrar.</p> : <div className="turnos-disponibilidad-layout">
            <aside className="turnos-almanaque-card" aria-label="Almanaque de disponibilidad">
              <p className="turnos-almanaque-selected">{fechaSeleccionada ? formatFechaTitulo(fechaSeleccionada) : "Seleccione un dia"}</p>
              <div className="turnos-almanaque-nav">
                <button type="button" className="btn-outline" onClick={() => setMesVisible(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                  ◀
                </button>
                <strong>{nombreMesVisible}</strong>
                <button type="button" className="btn-outline" onClick={() => setMesVisible(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                  ▶
                </button>
              </div>
              <div className="turnos-almanaque-grid-head">
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>
              </div>
              <div className="turnos-almanaque-grid-body">
                {celdasCalendario.map(celda => <button key={celda.key} type="button" className={`turnos-dia-btn ${celda.disponible ? "is-available" : ""} ${celda.selected ? "is-selected" : ""}`} onClick={() => celda.iso && celda.disponible ? setFechaSeleccionada(celda.iso) : undefined} disabled={!celda.disponible || !celda.iso}>
                    {celda.label}
                  </button>)}
              </div>
              <p className="turnos-almanaque-foot">Horarios disponibles</p>
            </aside>

            <div>
              {!fechaSeleccionada ? <p>Seleccione un dia en el almanaque.</p> : slotsFiltrados.length === 0 ? <p>No hay horarios para el dia seleccionado.</p> : <div className="personas-grid-wrap">
                  <table className="personas-grid turnos-grid">
                    <thead>
                      <tr>
                        <th>Accion</th>
                        <th>Sobreturno</th>
                        <th>Tipo slot</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Centro</th>
                        <th>Servicio</th>
                        <th>Practica</th>
                        <th>Profesional</th>
                        <th>Estado</th>
                        <th>ST disponibles</th>
                        <th>Leyenda</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slotsFiltrados.map(slot => <tr key={slot.id} className={selectedSlotId === slot.id ? "is-selected" : ""}>
                          <td>
                            <button type="button" className="row-select-btn" onClick={() => onAbrirConfirmacionAsignacion(slot)} disabled={slot.estado !== "DISPONIBLE" || slot.tipoSlot === "ST"}>
                              Seleccionar
                            </button>
                          </td>
                          <td>
                            <button type="button" className="row-select-btn turnos-st-btn" onClick={() => onAbrirModalSobreturno(slot)} disabled={slot.tipoSlot !== "ST" || (slot.sobreTurnosDisponibles ?? 0) <= 0 || slot.estado === "ASIGNADO"}>
                              Sobreturno
                            </button>
                          </td>
                          <td>{slot.tipoSlot}</td>
                          <td>{slot.fecha}</td>
                          <td>{slot.hora}</td>
                          <td>{slot.centro}</td>
                          <td>{slot.servicio}</td>
                          <td>{slot.practica}</td>
                          <td>{slot.profesional}</td>
                          <td>
                            <span className={`turnos-estado turnos-estado-${slot.estado.toLowerCase()}`}>{slot.estado}</span>
                          </td>
                          <td>{slot.tipoSlot === "ST" ? slot.sobreTurnosDisponibles ?? 0 : "-"}</td>
                          <td>{slot.mensaje ?? "-"}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>}
            </div>
          </div>}
      </section>

      <section className="turnos-step-card" aria-label="Turnos del paciente">
        <h3>Turnos del paciente</h3>
        <p className="turnos-step-help">
          Se visualizan por defecto 10 turnos ordenados por fecha. Estados contemplados: Agendado, Consumido, Ausente, Cancelado por agenda, Cancelado por bloqueo y Cancelado por paciente.
        </p>

        <div className="turnos-historial-actions">
          <button type="button" className={!verHistorialTurnos ? "btn-outline is-active" : "btn-outline"} onClick={() => setVerHistorialTurnos(false)}>
            Turnos vigentes
          </button>
          <button type="button" className={verHistorialTurnos ? "btn-outline is-active" : "btn-outline"} onClick={() => setVerHistorialTurnos(true)}>
            Historial de turnos
          </button>
        </div>

        {!paciente ? <p>Identifique un paciente para visualizar su grilla de turnos.</p> : loadingTurnosPaciente ? <p>Cargando turnos del paciente...</p> : (!turnosPaciente || turnosPaciente.length === 0) ? <p>{verHistorialTurnos ? "Sin historial de turnos para el paciente." : "Sin turnos vigentes para el paciente."}</p> : <>
            <p className="turnos-step-help">Mostrando {turnosPaciente.length} de {totalTurnosPaciente} turnos.</p>
            <div className="personas-grid-wrap">
              <table className="personas-grid turnos-grid">
                <thead>
                  <tr>
                    <th>Profesional</th>
                    <th>Servicio</th>
                    <th className="turnos-col-centro">Centro</th>
                    <th>Fecha-Hora</th>
                    <th>Estado</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosPaciente.map(turno => <tr key={turno.id}>
                      <td>{turno.profesional}</td>
                      <td>{turno.servicio}</td>
                      <td className="turnos-col-centro">{turno.centro}</td>
                      <td>{formatFechaHora(turno.fechaHora)}</td>
                      <td>
                        <span className={`turnos-estado turnos-estado-${turno.estado.toLowerCase()}`}>{estadoTurnoLabel ? estadoTurnoLabel(turno.estado) : turno.estado}</span>
                      </td>
                      <td>
                        {!verHistorialTurnos && turno.estado === "AGENDADO" ? (
                          <button
                            type="button"
                            className="btn-danger-outline"
                            onClick={() => setTurnoACancelarId(turno.id)}
                            disabled={cancelandoTurnoId === turno.id}
                            aria-label="Cancelar turno"
                          >
                            {cancelandoTurnoId === turno.id ? "Cancelando..." : "Cancelar"}
                          </button>
                        ) : "-"}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </>}
      </section>
    </>
  );
}

export function TurnosModales({ state }: { state: useTurnosState }) {
  const {
    catalogoFinanciadores, error, info, warningAsignacion, sobreturnoModalOpen, selectedSlotSobreturno, horaSobreturno, setHoraSobreturno, sobreturnoError, onCerrarModalSobreturno, asignandoTurno, onConfirmarSobreturno,
    financiadorModalOpen, financiadoresVigentes, financiadorPlanId, onEditarFinanciador, onFinalizarVigencia,
    esEdicionFinanciador, financiadorFormId, setFinanciadorFormId, setPlanFormId, planesDisponiblesForm, planFormId, numeroAfiliadoForm, setNumeroAfiliadoForm, esCombinacionDuplicada, financiadorModalError, financiadorModalInfo, resetFinanciadorForm, onGuardarFinanciador, puedeGuardarFinanciador, onCerrarModalFinanciador,
    confirmAsignacionModalOpen, selectedSlot, paciente, copagoEstimado, financiadorSeleccionado, contactoEmail, setContactoEmail, emailValido, contactoTelefono, setContactoTelefono, telefonoValido, contactoEditado, guardarContactoEnPerfil, setGuardarContactoEnPerfil, onCancelarAsignacion, onConfirmarAsignacion, puedeConfirmarAsignacion,
    asignacionExitosaModalOpen, asignacionExitosaMensaje, onCerrarAsignacionExitosaModal,
    turnoACancelarId, setTurnoACancelarId, cancelandoTurnoId, onConfirmarCancelacion, cancelacionExitosa, setCancelacionExitosa, turnosPaciente
  } = state;

  const turnoParaCancelar = turnoACancelarId ? (turnosPaciente ?? []).find(t => t.id === turnoACancelarId) : null;
  
  return (
    <>
      {error ? <p>{error}</p> : null}
      {info ? <p>{info}</p> : null}
      {warningAsignacion ? <div className="turnos-alert turnos-alert-warn">{warningAsignacion}</div> : null}

      {/* MODAL CONFIRMAR CANCELACION */}
      {turnoACancelarId && turnoParaCancelar ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Cancelar turno">
          <div className="confirm-modal">
            <h3>Cancelar turno</h3>
            <p>¿Confirma la cancelación del siguiente turno?</p>
            <p><strong>Servicio:</strong> {turnoParaCancelar.servicio}</p>
            <p><strong>Profesional:</strong> {turnoParaCancelar.profesional}</p>
            <p><strong>Centro:</strong> {turnoParaCancelar.centro}</p>
            <p><strong>Fecha:</strong> {turnoParaCancelar.fechaHora}</p>
            <p className="admision-elegibilidad-warning">Esta acción no se puede deshacer.</p>
            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={() => setTurnoACancelarId(null)} disabled={cancelandoTurnoId === turnoACancelarId}>
                Volver
              </button>
              <button type="button" className="btn-danger" onClick={() => void onConfirmarCancelacion(turnoACancelarId)} disabled={cancelandoTurnoId === turnoACancelarId}>
                {cancelandoTurnoId === turnoACancelarId ? "Cancelando..." : "Sí, cancelar turno"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL CANCELACION EXITOSA */}
      {cancelacionExitosa ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Turno cancelado">
          <div className="confirm-modal">
            <h3>Turno cancelado</h3>
            <p>{cancelacionExitosa}</p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setCancelacionExitosa(null)}>OK</button>
            </div>
          </div>
        </div>
      ) : null}

      {sobreturnoModalOpen && selectedSlotSobreturno ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Asignar sobreturno">
          <div className="confirm-modal turnos-asignacion-modal">
            <h3>Asignacion de sobreturno</h3>
            <p>
              Slot ST: <strong>{selectedSlotSobreturno.fecha}</strong> - Rango {selectedSlotSobreturno.rangoHoraInicio} a {selectedSlotSobreturno.rangoHoraFin}
            </p>
            <p>
              Sobreturnos disponibles: <strong>{selectedSlotSobreturno.sobreTurnosDisponibles ?? 0}</strong>
            </p>

            <label>
              Hora del sobreturno
              <input type="time" value={horaSobreturno} onChange={event => setHoraSobreturno(event.target.value)} />
            </label>

            {sobreturnoError ? <p className="turnos-input-error">{sobreturnoError}</p> : null}

            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={onCerrarModalSobreturno} disabled={asignandoTurno}>
                Cancelar
              </button>
              <button type="button" onClick={() => void onConfirmarSobreturno()} disabled={asignandoTurno}>
                {asignandoTurno ? "Asignando..." : "Confirmar sobreturno"}
              </button>
            </div>
          </div>
        </div> : null}

      {financiadorModalOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Editar financiador y plan">
          <div className="confirm-modal turnos-financiador-modal">
            <h3>Editar financiador/plan</h3>
            <p className="turnos-step-help">Financiadores activos del paciente. Privado/Particular no admite edicion ni finalizacion de vigencia.</p>

            <div className="turnos-financiadores-list">
              {financiadoresVigentes?.length === 0 ? <p>El paciente no posee financiadores vigentes.</p> : null}
              {financiadoresVigentes?.map(financiador => {
            const esPrivado = financiador.financiador.toUpperCase().includes("PRIVADO");
            return <article key={financiador.id} className="turnos-financiador-item">
                    <div>
                      <strong>
                        {financiador.financiador} - {financiador.plan}
                      </strong>
                      <div className="turnos-pills-row">
                        <span className="turnos-pill turnos-pill-vigente">Vigente</span>
                        {financiador.id === financiadorPlanId ? <span className="turnos-pill turnos-pill-selected">Seleccionado</span> : null}
                        {esPrivado ? <span className="turnos-pill turnos-pill-locked">Sin edicion</span> : null}
                      </div>
                      <small>Nro afiliado: {financiador.numeroAfiliado ?? "No informado"}</small>
                    </div>
                    <div className="turnos-financiador-item-actions">
                      <button
                        type="button"
                        className="icon-edit-btn"
                        onClick={() => onEditarFinanciador(financiador)}
                        disabled={esPrivado}
                        title="Editar financiador"
                        aria-label="Editar financiador"
                      >
                        ✏
                      </button>
                      <button type="button" className="btn-outline" onClick={() => void onFinalizarVigencia(financiador)} disabled={esPrivado}>
                        Finalizar vigencia
                      </button>
                    </div>
                  </article>;
          })}
            </div>

            <div className="turnos-financiador-form">
              <h4>{esEdicionFinanciador ? "Cambiar financiador" : "Agregar financiador"}</h4>
              <div className="turnos-grid-2">
                <label>
                  Financiador
                  <select value={financiadorFormId} onChange={event => {
                setFinanciadorFormId(event.target.value);
                setPlanFormId("");
              }}>
                    <option value="">Seleccione</option>
                    {catalogoFinanciadores.map(item => <option key={item.id} value={item.id}>
                        {item.nombre}
                      </option>)}
                  </select>
                </label>

                <label>
                  Plan
                  <select value={planFormId} onChange={event => setPlanFormId(event.target.value)} disabled={!financiadorFormId}>
                    <option value="">Seleccione</option>
                    {planesDisponiblesForm?.map(plan => <option key={plan.id} value={plan.id}>
                        {plan.nombre}
                      </option>)}
                  </select>
                </label>

                <label>
                  Numero de afiliado
                  <input value={numeroAfiliadoForm} onChange={event => setNumeroAfiliadoForm(event.target.value)} placeholder="Ingrese numero" />
                </label>
              </div>

              {esCombinacionDuplicada ? <p className="turnos-input-error">La combinacion financiador/plan/afiliado ya esta vigente.</p> : null}
              {financiadorModalError ? <p className="turnos-input-error">{financiadorModalError}</p> : null}
              {financiadorModalInfo ? <p className="turnos-step-help">{financiadorModalInfo}</p> : null}

              <div className="confirm-actions">
                <button type="button" className="btn-outline" onClick={resetFinanciadorForm}>
                  Limpiar
                </button>
                <button type="button" onClick={() => void onGuardarFinanciador()} disabled={!puedeGuardarFinanciador}>
                  Guardar
                </button>
              </div>
            </div>

            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={onCerrarModalFinanciador}>
                Cerrar
              </button>
            </div>
          </div>
        </div> : null}

      {confirmAsignacionModalOpen && selectedSlot ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmar asignacion de turno">
          <div className="confirm-modal turnos-asignacion-modal">
            <h3>Confirmar asignacion de turno</h3>
            <p>
              Paciente: <strong>{paciente?.apellidosNombres}</strong>
            </p>
            <p>
              Turno seleccionado: <strong>{selectedSlot.fecha} {selectedSlot.hora}</strong>
            </p>
            <p>
              {selectedSlot.centro} - {selectedSlot.servicio} - {selectedSlot.practica}
            </p>
            <p>Profesional: {selectedSlot.profesional}</p>
            <p>Copago estimado: {copagoEstimado}</p>

            <div className="turnos-email-preview" aria-label="Vista previa de e-mail">
              <h4>Comprobante por e-mail</h4>
              <p>
                El correo incluira el detalle del turno y el <strong>Centro</strong> desde donde se asigno.
              </p>
              <div className="turnos-pills-row">
                <span className="turnos-pill">Paciente: {paciente?.apellidosNombres}</span>
                <span className="turnos-pill">Documento: {paciente?.tipoDocumento} {paciente?.numeroDocumento}</span>
                <span className="turnos-pill">Financiador/Plan: {financiadorSeleccionado?.financiador ?? "-"} {financiadorSeleccionado?.plan ?? ""}</span>
                <span className="turnos-pill">Profesional: {selectedSlot.profesional}</span>
                <span className="turnos-pill">Servicio: {selectedSlot.servicio}</span>
                <span className="turnos-pill turnos-pill-selected">Centro: {selectedSlot.centro}</span>
                <span className="turnos-pill">Dia y hora: {selectedSlot.fecha} {selectedSlot.hora}</span>
              </div>
            </div>

            <div className="turnos-grid-2">
              <label>
                Correo electronico (opcional)
                <input value={contactoEmail} onChange={event => setContactoEmail(event.target.value)} placeholder="correo@dominio.com" />
                {!emailValido ? <span className="turnos-input-error">Formato de email invalido.</span> : null}
              </label>

              <label>
                Telefono (opcional)
                <input value={contactoTelefono} onChange={event => setContactoTelefono(event.target.value.replace(/[^0-9]/g, ""))} placeholder="Solo numeros" />
                {!telefonoValido ? <span className="turnos-input-error">Telefono invalido (6 a 15 digitos).</span> : null}
              </label>
            </div>

            {contactoEditado ? <label className="checkbox-row turnos-checkbox-row">
                <input type="checkbox" checked={guardarContactoEnPerfil} onChange={event => setGuardarContactoEnPerfil(event.target.checked)} />
                Guardar cambios de contacto en perfil del paciente
              </label> : null}

            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={onCancelarAsignacion} disabled={asignandoTurno}>
                Cancelar
              </button>
              <button type="button" onClick={() => void onConfirmarAsignacion()} disabled={!puedeConfirmarAsignacion || asignandoTurno}>
                {asignandoTurno ? "Asignando..." : "Confirmar asignacion"}
              </button>
            </div>
          </div>
        </div> : null}

      {asignacionExitosaModalOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Asignacion exitosa de turno">
          <div className="confirm-modal turnos-asignacion-modal">
            <h3>Turno asignado</h3>
            <p>{asignacionExitosaMensaje}</p>
            <div className="confirm-actions">
              <button type="button" onClick={onCerrarAsignacionExitosaModal}>
                Aceptar
              </button>
            </div>
          </div>
        </div> : null}
    </>
  );
}
