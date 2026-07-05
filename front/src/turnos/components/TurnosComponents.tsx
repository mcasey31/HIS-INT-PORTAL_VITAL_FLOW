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
      <div className="turnos-card-header-row">
        <h3>1. Identificación de paciente</h3>
        <button type="button" className="turnos-header-link" onClick={() => navigate('/personas')}>
          Ir a identificación de personas
        </button>
      </div>

      <p className="turnos-step-help">
        La búsqueda de disponibilidad horaria inicia solo cuando la persona está identificada como paciente y tiene financiador seleccionado.
      </p>

      <form onSubmit={onConsultarPaciente} className="turnos-step1-form">
        <div className="turnos-step1-grid">
          {/* Row 1: Tipo Doc, Num Doc, Paciente display */}
          <div className="turnos-grid-row-1">
            <label className="turnos-input-col">
              Tipo de documento
              <select value={tipoDocumento} onChange={event => setTipoDocumento(event.target.value)}>
                {tiposDocumento.map(tipo => <option key={tipo.codigo} value={tipo.codigo}>{tipo.nombre}</option>)}
              </select>
            </label>

            <label className="turnos-input-col">
              Número de documento
              <div className="turnos-search-input-wrapper">
                <input
                  value={numeroDocumento}
                  onChange={event => setNumeroDocumento(event.target.value.toUpperCase())}
                  placeholder="28171003"
                />
                {!paciente && (
                  <button type="submit" className="btn-search-inline" disabled={loadingIdentificacion || numeroDocumento.trim().length === 0}>
                    {loadingIdentificacion ? "..." : "🔍"}
                  </button>
                )}
              </div>
            </label>

            <div className="turnos-input-col turnos-paciente-display-col">
              <span className="turnos-input-label">Paciente</span>
              {paciente ? (
                <div className="turnos-paciente-box-selected">
                  <span className="turnos-paciente-name">
                    {paciente.apellidosNombres} <span className="separator">•</span> DNI: {paciente.numeroDocumento}
                  </span>
                  <span className="turnos-checkmark-circle">✓</span>
                </div>
              ) : (
                <div className="turnos-paciente-box-empty">
                  <span>No se ha seleccionado ningún paciente</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Financiador y Plan (only show when patient is selected) */}
          {paciente && (
            <div className="turnos-grid-row-2">
              <label className="turnos-input-col turnos-financiador-col">
                Financiador y plan
                <div className="turnos-financiador-selector-row">
                  <select value={financiadorPlanId} onChange={event => setFinanciadorPlanId(event.target.value)}>
                    {financiadoresVigentes.map(fin => (
                      <option key={fin.id} value={fin.id}>
                        {fin.financiador} - {fin.plan} {fin.numeroAfiliado ? ` - ${fin.numeroAfiliado}` : ""}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn-edit-financiador" onClick={onAbrirModalFinanciador} title="Editar financiador/plan">
                    ✏️
                  </button>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Buttons for desktop if not patient selected yet */}
        {!paciente && (
          <div className="personas-actions">
            <button type="submit" disabled={loadingIdentificacion || numeroDocumento.trim().length === 0}>
              {loadingIdentificacion ? "Consultando..." : "Consultar paciente"}
            </button>
          </div>
        )}
      </form>

      {/* Warnings & Alerts */}
      {resultadoIdentificacion === "multiple" && (
        <div className="turnos-alert turnos-alert-warn">
          <p>La identificación no devolvió un candidato único. Continúe por Identificación de personas para resolverlo.</p>
        </div>
      )}
      {resultadoIdentificacion === "none" && (
        <div className="turnos-alert turnos-alert-warn">
          <p>La identificación no devolvió un candidato único. Continúe por Identificación de personas para resolverlo.</p>
        </div>
      )}
    </section>
  );
}

export function TurnosBusqueda({ state }: { state: useTurnosState }) {
  const {
    centrosDisponibles, centrosSeleccionados, onToggleCentro, paciente, servicioId, setServicioId, serviciosDisponibles,
    practicaId, setPracticaId, practicasDisponibles, profesionalId, setProfesionalId, profesionalesDisponibles,
    onBuscarDisponibilidad, puedeBuscarDisponibilidad, loadingDisponibilidad,
    fechaSeleccionada, setFechaSeleccionada, fechasDisponibles
  } = state;

  const [mesVisible, setMesVisible] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (fechasDisponibles.length > 0) {
      const primeraFecha = new Date(`${fechasDisponibles[0]}T00:00:00`);
      setMesVisible(new Date(primeraFecha.getFullYear(), primeraFecha.getMonth(), 1));
    }
  }, [fechasDisponibles]);

  const formatIsoDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const nombreMesVisible = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric"
  }).format(mesVisible);

  const primerDiaMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1);
  const diasEnMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
  const offsetPrimerDia = primerDiaMes.getDay(); // Sunday is 0, matching D L M M J V S order

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
    <section className="turnos-step-card turnos-busqueda-horizontal-card" aria-label="Paso 2 disponibilidad horaria">
      <h3>2. Búsqueda de disponibilidad</h3>

      <div className="turnos-busqueda-horizontal-layout">
        
        {/* Column 1: FECHA */}
        <div className="turnos-busqueda-col turnos-busqueda-col-fecha">
          <span className="turnos-label">FECHA</span>
          <div className="turnos-almanaque-card inline-almanaque">
            <div className="turnos-almanaque-nav">
              <button type="button" className="btn-outline-small" onClick={() => setMesVisible(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                ◀
              </button>
              <strong className="turnos-mes-titulo">{nombreMesVisible}</strong>
              <button type="button" className="btn-outline-small" onClick={() => setMesVisible(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                ▶
              </button>
            </div>
            <div className="turnos-almanaque-grid-head">
              <span>D</span>
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
            </div>
            <div className="turnos-almanaque-grid-body">
              {celdasCalendario.map(celda => (
                <button
                  key={celda.key}
                  type="button"
                  className={`turnos-dia-btn ${celda.disponible ? "is-available" : ""} ${celda.selected ? "is-selected" : ""}`}
                  onClick={() => celda.iso && celda.disponible ? setFechaSeleccionada(celda.iso) : undefined}
                  disabled={!celda.disponible || !celda.iso}
                >
                  {celda.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: CENTROS */}
        <div className="turnos-busqueda-col turnos-busqueda-col-centros">
          <span className="turnos-label">CENTROS *</span>
          <div className="turnos-multi-select-checkboxes">
            {centrosDisponibles.length === 0 ? (
              <p className="turnos-empty-field">No hay centros disponibles.</p>
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

        {/* Column 3: DROPDOWNS */}
        <div className="turnos-busqueda-col turnos-busqueda-col-dropdowns">
          <label>
            PROFESIONAL (OPCIONAL)
            <select value={profesionalId} onChange={event => setProfesionalId(event.target.value)} disabled={!paciente}>
              <option value="">Todos</option>
              {profesionalesDisponibles?.map(profesional => (
                <option key={profesional.id} value={profesional.id}>{profesional.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            SERVICIO *
            <select value={servicioId} onChange={event => setServicioId(event.target.value)} disabled={!paciente}>
              <option value="">Seleccione</option>
              {serviciosDisponibles?.map(servicio => (
                <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
              ))}
            </select>
          </label>

          <label>
            PRÁCTICA *
            <select value={practicaId} onChange={event => setPracticaId(event.target.value)} disabled={!paciente}>
              <option value="">Seleccione</option>
              {practicasDisponibles?.map(practica => (
                <option key={practica.id} value={practica.id}>{practica.nombre}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Column 4: BUTTON */}
        <div className="turnos-busqueda-col turnos-busqueda-col-button">
          <button
            type="button"
            className="btn-filtrar-agenda"
            onClick={() => void onBuscarDisponibilidad()}
            disabled={!puedeBuscarDisponibilidad || loadingDisponibilidad}
          >
            {loadingDisponibilidad ? "Buscando..." : "Filtrar Agenda"}
          </button>
        </div>

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
}export function TurnosResultados({ state }: { state: useTurnosState }) {
  const {
    slots, selectedSlotId, onAbrirConfirmacionAsignacion, onAbrirModalSobreturno,
    paciente, fechaSeleccionada,
    verHistorialTurnos, setVerHistorialTurnos, loadingTurnosPaciente, turnosPaciente, totalTurnosPaciente,
    cargarTurnosPaciente, setTurnoACancelarId, cancelandoTurnoId
  } = state;

  const tieneStDisponible = (slot: any) => {
    if (slot.tipoSlot === "ST") {
      return (slot.sobreTurnosDisponibles ?? 0) > 0;
    }
    const stSlot = slots.find(s => s.tipoSlot === "ST" && s.fecha === slot.fecha && s.profesional === slot.profesional);
    return stSlot ? (stSlot.sobreTurnosDisponibles ?? 0) > 0 : false;
  };

  const slotsFiltrados = fechaSeleccionada
    ? slots.filter(slot => slot.fecha === fechaSeleccionada)
    : slots;

  const firstSlot = slots && slots.length > 0 ? slots[0] : null;
  const profesionalNombre = firstSlot ? firstSlot.profesional : "";
  const servicioNombre = firstSlot ? firstSlot.servicio : "";
  const practicaNombre = firstSlot ? firstSlot.practica : "";
  const centroNombre = firstSlot ? firstSlot.centro : "";

  const formatTarjetaDiaSemana = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date);
  };

  const formatTarjetaFecha = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  return (
    <>
      <section className="turnos-step-card" aria-label="Resultados disponibilidad">
        {(!slots || slots.length === 0) ? (
          <p>Sin resultados para mostrar.</p>
        ) : (
          <>
            {firstSlot && (
              <div className="turnos-context-card">
                <div className="turnos-context-left">
                  <div className="turnos-context-avatar-container">
                    <img
                      className="turnos-context-avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOfE-mYKiN6EtF6MMsHxHm3MoW4BjD0IpRvUBaDQXiZUtvDojO8FdOrDGSCALcVlwiOT19xNp_xmEYE23PklJWlhTBUgJ74L4wQ0zYZ2AQ0BUQXLRarc4pO_wlQt5teGr8l8w1CqGa5uK55SS2fXOTL3ysqgmrANsO8F5dUNrMw8xHhQz8WmHT7yeJ7YXHmAL6b2RHh61lCJ_Wfi4a0q3a9OJBZyiXFIb_q09r-6YOk6ocKDJPYzA"
                      alt={profesionalNombre}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="material-symbols-outlined turnos-context-avatar-fallback">account_circle</span>
                  </div>
                  <div className="turnos-context-details">
                    <h4>{profesionalNombre}</h4>
                    <div className="turnos-context-badges">
                      <span className="turnos-context-badge">{servicioNombre}</span>
                      <span className="turnos-context-separator">•</span>
                      <span className="turnos-context-badge">{practicaNombre}</span>
                      <span className="turnos-context-separator">•</span>
                      <span className="turnos-context-centro">{centroNombre}</span>
                    </div>
                  </div>
                </div>
                <div className="turnos-context-right">
                  <p className="turnos-context-weekday">{fechaSeleccionada ? formatTarjetaDiaSemana(fechaSeleccionada) : ""}</p>
                  <p className="turnos-context-date">{fechaSeleccionada ? formatTarjetaFecha(fechaSeleccionada) : ""}</p>
                </div>
              </div>
            )}

            <div className="turnos-resultados-header-row">
              <h3 className="turnos-resultados-titulo">Disponibilidad de turnos</h3>
              <button
                type="button"
                className="btn-forzar-sobreturno"
                onClick={() => {
                  if (slots && slots.length > 0) {
                    onAbrirModalSobreturno(slots[0]);
                  }
                }}
              >
                <span className="plus-sign">+</span> Forzar Sobreturno
              </button>
            </div>

            <div className="personas-grid-wrap">
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
                    <th>ST disp.</th>
                    <th>Leyenda</th>
                  </tr>
                </thead>
                <tbody>
                  {slotsFiltrados.map(slot => {
                    const isStRow = slot.tipoSlot === "ST";
                    const isOccupiedRow = slot.estado === "ASIGNADO" || slot.estado === "CON_CUPO";
                    const isDisponible = slot.estado === "DISPONIBLE" || slot.estado === "SOBRETURNO";
                    const labelSeleccionar = slot.estado === "ASIGNADO" ? "Ocupado" : "Seleccionar";
                    const seleccionarBtnClass = isDisponible ? "row-select-btn btn-seleccionar-active" : "row-select-btn";
                    const isStRowSelected = selectedSlotId === slot.id;

                    let labelSobreturno = "Sobreturno";
                    let isStEnabled = false;
                    let stBtnClass = "row-select-btn";

                    if (slot.tipoSlot === "ST") {
                      labelSobreturno = "Sobreturno";
                      isStEnabled = (slot.sobreTurnosDisponibles ?? 0) > 0 && slot.estado !== "ASIGNADO";
                      stBtnClass = isStEnabled ? "row-select-btn turnos-st-btn-active" : "row-select-btn";
                    } else if (slot.tipoSlot === "Virtual" || slot.estado === "SOBRETURNO") {
                      labelSobreturno = "Asignar ST";
                      isStEnabled = tieneStDisponible(slot);
                      stBtnClass = isStEnabled ? "row-select-btn turnos-st-btn-virtual" : "row-select-btn";
                    } else if (slot.tipoSlot === "NORMAL" && slot.estado === "ASIGNADO") {
                      labelSobreturno = "+ Sobreturno";
                      isStEnabled = tieneStDisponible(slot);
                      stBtnClass = isStEnabled ? "row-select-btn turnos-st-btn-add" : "row-select-btn";
                    } else {
                      labelSobreturno = "Sobreturno";
                      isStEnabled = false;
                      stBtnClass = "row-select-btn";
                    }

                    // Determine row className
                    let rowClassName = isStRowSelected ? "is-selected" : "";
                    if (!rowClassName) {
                      if (isStRow) rowClassName = "turnos-row-st";
                      else if (isOccupiedRow) rowClassName = "turnos-row-occupied";
                    }

                    return (
                      <tr key={slot.id} className={rowClassName}>
                        <td>
                          <button
                            type="button"
                            className={seleccionarBtnClass}
                            onClick={() => slot.tipoSlot === "ST" ? onAbrirModalSobreturno(slot) : onAbrirConfirmacionAsignacion(slot)}
                            disabled={!isDisponible}
                          >
                            {labelSeleccionar}
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={stBtnClass}
                            onClick={() => onAbrirModalSobreturno(slot)}
                            disabled={!isStEnabled}
                          >
                            {labelSobreturno}
                          </button>
                        </td>
                        <td>
                          {slot.tipoSlot === "ST" ? (
                            <span className="turnos-tipo-slot-st">ST</span>
                          ) : slot.tipoSlot === "Virtual" ? (
                            <span className="turnos-tipo-slot-virtual">Virtual</span>
                          ) : (
                            <span className="turnos-tipo-slot-normal">Normal</span>
                          )}
                        </td>
                        <td>{slot.fecha}</td>
                        <td>{slot.hora}</td>
                        <td>{slot.centro}</td>
                        <td>{slot.servicio}</td>
                        <td>{slot.practica}</td>
                        <td>{slot.profesional}</td>
                        <td>
                          <span className={`turnos-estado turnos-estado-${slot.estado.toLowerCase()}`}>
                            {slot.estado}
                          </span>
                        </td>
                        <td>{slot.tipoSlot === "ST" || slot.tipoSlot === "Virtual" || slot.estado === "SOBRETURNO" ? slot.sobreTurnosDisponibles ?? 0 : "-"}</td>
                        <td>{slot.mensaje ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="turnos-tabla-footer">
              <span className="turnos-footer-info">Mostrando registros detallados de agenda médica</span>
              <button type="button" className="turnos-ver-mas-btn">
                Ver más registros <span className="arrow">▼</span>
              </button>
            </div>
          </>
        )}
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
