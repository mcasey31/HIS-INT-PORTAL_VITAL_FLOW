import { useEscritorioClinicoController } from "../useEscritorioClinicoController";
type useEscritorioClinicoState = ReturnType<typeof useEscritorioClinicoController>;
import { sanitizeRichTextHtml } from "../escritorioClinicoTypes";

export function EscritorioClinicoModales({ state }: { state: useEscritorioClinicoState }) {
  const {
    showEvolucionesListado, setShowEvolucionesListado, evolucionesFiltroProfesional, setEvolucionesFiltroProfesional,
    profesionalesEvoluciones, evolucionesFiltroServicio, setEvolucionesFiltroServicio, serviciosEvoluciones,
    listadoEvolucionesFiltradas, formatDateTime, PROFESIONAL_ACTUAL,
    showAgregarEvolucionModal, setShowAgregarEvolucionModal, selectedTurno, limpiarSolicitudesScope,
    aplicarFormatoEvolucion, canAplicarFormatoEvolucion, evolucionEditorRef, setEvolucionTextoDraft,
    setEvolucionFormError, evolucionTextoDraft, evolucionProblemasTextoDraft, setEvolucionProblemasTextoDraft,
    evolucionProblemasEtiquetas, abrirAgregarEvolucion,
    evolucionFormError, abrirSolicitudEstudiosDesdeEvolucion, canSolicitarEstudiosDesdeEvolucion,
    totalEstudiosSolicitadosDraftEvolucion, guardarEvolucionNueva, canGuardarEvolucion,
    showSalidaEncuentroModal, setShowSalidaEncuentroModal, accionSalidaEncuentro, setAccionSalidaEncuentro,
    ESTADO_EN_ATENCION, ESTADO_EN_SALA_ESPERA, cumpleRegistroMinimoSalidaEncuentro, salidaEncuentroError,
    confirmarSalidaEncuentro, working,
    showSolicitarEstudiosModal, setShowSolicitarEstudiosModal, isEstudioDesdeEvolucion, solicitudError,
    opcionesPracticasIzquierda, opcionesPracticasDerecha, searchQueryPracticasIzquierda, setSearchQueryPracticasIzquierda,
    searchQueryPracticasDerecha, setSearchQueryPracticasDerecha, selectedPracticasIzquierda,
    setSelectedPracticasIzquierda, selectedPracticasDerecha, setSelectedPracticasDerecha,
    moverPracticasSeleccionadasADerecha, moverPracticasSeleccionadasAIzquierda, abrirObservacionPractica,
    eliminarObservacionPractica, solicitudesScopeActual, solicitudesPorScope, imprimirSolicitudesPracticas,
    observacionPracticaModalData, setObservacionPracticaModalData, observacionPracticaText, setObservacionPracticaText,
    guardarObservacionPractica,
    showLlamarMegafonoModal, setLlamarMegafonoModal, confirmarLlamadoMegafono, pendingLlamadoTurno, error, setError,
    showVistaRapidaModal, setVistaRapidaModal, turnoVistaRapida,
    showSistemasClinicosModal, setShowSistemasClinicosModal, confirmarAccederSistemasClinicos,
    showServicioModal, servicioPendienteId, setServicioPendienteId, serviciosDisponibles,
    serviceSelectionError, setServiceSelectionError, confirmarServicioIngreso, cancelarServicioIngreso,
    showLugarAtencionModal, setShowLugarAtencionModal, lugarAtencionPendienteId, setLugarAtencionPendienteId,
    efectoresDisponibles, lugarAtencionError, setLugarAtencionError, confirmarCambioLugarAtencion,
    showMedicamentoModal, setShowMedicamentoModal, medicamentoSearchQuery, setMedicamentoSearchQuery,
    medicamentoResultados, medicamentoLoading, medicamentoTotalCount, medicamentoPagina, medicamentoError,
    ejecutarBusquedaMedicamento, seleccionarMedicamento,
    showPrescripcionFormModal, setShowPrescripcionFormModal, medicamentoSeleccionado,
    prescripcionDosis, setPrescripcionDosis, prescripcionFrecuencia, setPrescripcionFrecuencia,
    prescripcionDuracion, setPrescripcionDuracion, prescripcionIndicacion, setPrescripcionIndicacion,
    prescripcionGuardando, prescripcionError, prescripcionExitosa, guardarPrescripcion,
    showPrescripcionModule, setShowPrescripcionModule,
    prescripcionModuleRecetas, prescripcionModuleLoading, prescripcionModuleError,
    prescripcionModuleAnulando, handleAnularReceta, imprimirReceta, abrirBuscarMedicamento
  } = state;

  return (
    <>
      {showServicioModal ? <div className="modal-backdrop" role="presentation">
        <section className="confirm-modal" role="dialog" aria-modal="true" aria-label="Seleccionar servicio para ingresar a Historia Clinica" onClick={event => event.stopPropagation()}>
          <h3>Seleccionar servicio</h3>
          <p>Para ingresar a Historia Clinica debes seleccionar un servicio.</p>

          <label style={{ display: "block", marginTop: "1rem" }}>
            Servicio obligatorio
            <select style={{ width: "100%", marginTop: "0.5rem" }} value={servicioPendienteId} onChange={event => {
              setServicioPendienteId(event.target.value);
              setServiceSelectionError(null);
            }}>
              <option value="">Seleccionar</option>
              {serviciosDisponibles.map(servicio => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
            </select>
          </label>

          {serviceSelectionError ? <p className="hc-error">{serviceSelectionError}</p> : null}

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={cancelarServicioIngreso}>Cancelar</button>
            <button type="button" onClick={confirmarServicioIngreso} disabled={!servicioPendienteId}>Ingresar</button>
          </div>
        </section>
      </div> : null}

      {showVistaRapidaModal && turnoVistaRapida ? <div className="modal-backdrop" role="presentation" onClick={() => setVistaRapidaModal(false)}>
        <section className="confirm-modal hc-vista-rapida-modal" role="dialog" aria-modal="true" aria-label="Datos del paciente" onClick={event => event.stopPropagation()}>
          <div className="modal-header">
            <h3>Datos del paciente</h3>
            <button type="button" className="modal-close" onClick={() => setVistaRapidaModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <dl className="hc-vista-rapida-grid">
              <div><dt>Turno</dt><dd>{turnoVistaRapida.turno}</dd></div>
              <div><dt>Llegada</dt><dd>{turnoVistaRapida.llegada ?? "-"}</dd></div>
              <div><dt>Paciente</dt><dd>{turnoVistaRapida.paciente}</dd></div>
              <div><dt>Documento</dt><dd>{turnoVistaRapida.documento}</dd></div>
              <div><dt>Financiador</dt><dd>{turnoVistaRapida.financiador}</dd></div>
              <div><dt>Servicio</dt><dd>{turnoVistaRapida.servicio}</dd></div>
              <div><dt>Efector</dt><dd>{turnoVistaRapida.efector}</dd></div>
              <div><dt>Estado</dt><dd>{turnoVistaRapida.estado}</dd></div>
              <div><dt>Estado turno</dt><dd>{turnoVistaRapida.estadoTurno ?? "-"}</dd></div>
              <div><dt>ID turno</dt><dd>{turnoVistaRapida.id}</dd></div>
            </dl>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={() => setVistaRapidaModal(false)}>Cerrar</button>
          </div>
        </section>
      </div> : null}

      {showSistemasClinicosModal ? <div className="modal-backdrop" role="presentation" onClick={() => setShowSistemasClinicosModal(false)}>
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>Acceso a Sistemas Clinicos</h3>
          <p>Esta a punto de acceder a un sistema externo a ODI en modo solo lectura.</p>
          <p>Se abrira una nueva pestana con la historia clinica del paciente en Sistemas Clinicos (SC).</p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setShowSistemasClinicosModal(false)}>Volver</button>
            <button type="button" onClick={() => void confirmarAccederSistemasClinicos()} disabled={working}>
              Si, ingresar
            </button>
          </div>
        </section>
      </div> : null}

      {showEvolucionesListado ? <div className="modal-backdrop" role="presentation" onClick={() => setShowEvolucionesListado(false)}>
        <section className="confirm-modal hc-evoluciones-modal hc-evoluciones-editor-ltr" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <div className="hc-evoluciones-header">
            <h3>Listado de evoluciones</h3>
            <button type="button" onClick={abrirAgregarEvolucion}>Agregar evolucion</button>
          </div>

          <div className="hc-evoluciones-filtros">
            <label>
              Medico efector
              <select value={evolucionesFiltroProfesional} onChange={event => setEvolucionesFiltroProfesional(event.target.value)}>
                <option value="">Todos</option>
                {profesionalesEvoluciones?.map(profesional => <option key={profesional} value={profesional}>{profesional}</option>)}
              </select>
            </label>

            <label>
              Servicio
              <select value={evolucionesFiltroServicio} onChange={event => setEvolucionesFiltroServicio(event.target.value)}>
                <option value="">Todos</option>
                {serviciosEvoluciones?.map(servicio => <option key={servicio} value={servicio}>{servicio}</option>)}
              </select>
            </label>
          </div>

          {listadoEvolucionesFiltradas?.length === 0 ? <p>No dispone datos.</p> : <ul className="hc-evoluciones-list">
            {listadoEvolucionesFiltradas?.map(item => {
              const { fecha, hora } = formatDateTime(item.fechaHora);
              const editableByCurrent = item.profesional === PROFESIONAL_ACTUAL;
              return <li key={item.id}>
                <p className="hc-row-title">{item.profesional} | {item.especialidad} | {item.practica}</p>
                <p className="hc-row-meta">Fecha: {fecha} | Hora: {hora}</p>
                {item.texto ? <div className="hc-evolucion-texto" dangerouslySetInnerHTML={{
                  __html: sanitizeRichTextHtml(item.texto)
                }} /> : null}
                <p>Problemas asociados: {item.problemasAsociados.join(", ")}</p>
                <p className="hc-row-meta">{editableByCurrent ? "Editable por medico efector" : "Solo lectura (otro medico efector)"}</p>
              </li>;
            })}
          </ul>}
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setShowEvolucionesListado(false)}>Cerrar</button>
          </div>
        </section>
      </div> : null}

      {showAgregarEvolucionModal ? <div className="modal-backdrop" role="presentation" onClick={() => {
        if (selectedTurno) {
          limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
        }
        setShowAgregarEvolucionModal(false);
        setEvolucionTextoDraft("");
        setEvolucionProblemasTextoDraft("");
        setEvolucionFormError(null);
      }}>
        <section className="confirm-modal hc-evoluciones-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>Agregar evolucion</h3>

          <label>
            Escribir evolucion
            <div className="hc-evolucion-toolbar" role="toolbar" aria-label="Formato de texto">
              <button type="button" className="btn-outline" onClick={() => aplicarFormatoEvolucion("bold")} disabled={!canAplicarFormatoEvolucion}>N</button>
              <button type="button" className="btn-outline" onClick={() => aplicarFormatoEvolucion("italic")} disabled={!canAplicarFormatoEvolucion}><em>C</em></button>
              <button type="button" className="btn-outline" onClick={() => aplicarFormatoEvolucion("underline")} disabled={!canAplicarFormatoEvolucion}><u>S</u></button>
              <button type="button" className="btn-outline" onClick={() => aplicarFormatoEvolucion("strikeThrough")} disabled={!canAplicarFormatoEvolucion}><s>T</s></button>
              <button type="button" className="btn-outline" onClick={() => aplicarFormatoEvolucion("insertUnorderedList")} disabled={!canAplicarFormatoEvolucion}>• Lista</button>
              <button type="button" className="btn-outline" onClick={() => aplicarFormatoEvolucion("indent")} disabled={!canAplicarFormatoEvolucion}>Sangria</button>
            </div>

            <div ref={evolucionEditorRef} className="hc-evolucion-editor" dir="ltr" contentEditable suppressContentEditableWarning onInput={event => {
              const target = event.currentTarget;
              setEvolucionTextoDraft(sanitizeRichTextHtml(target.innerHTML));
              setEvolucionFormError(null);
            }} />
          </label>
          <p className="hc-solicitudes-help">Debe contener al menos 4 caracteres alfanumericos no repetidos.</p>

          <label>
            Problemas (texto libre)
            <textarea className="hc-evolucion-problemas-input" dir="ltr" value={evolucionProblemasTextoDraft} rows={4} onChange={event => {
              setEvolucionProblemasTextoDraft(event.target.value);
              setEvolucionFormError(null);
            }} placeholder="Ej: Hipertension arterial; dolor lumbar cronico" />
          </label>

          <div className="hc-selected-tags">
            {evolucionProblemasEtiquetas?.length === 0 ? <p className="hc-solicitudes-help">Debe registrar al menos un problema.</p> : evolucionProblemasEtiquetas?.map(problema => <span key={problema} className="hc-tag-pill">{problema}</span>)}
          </div>

          {evolucionFormError ? <p className="hc-error">{evolucionFormError}</p> : null}

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => {
              if (selectedTurno) {
                limpiarSolicitudesScope(`draft-evol-${selectedTurno.id}`);
              }
              setShowAgregarEvolucionModal(false);
              setEvolucionTextoDraft("");
              setEvolucionProblemasTextoDraft("");
              setEvolucionFormError(null);
            }}>Cancelar</button>
            <button type="button" className="btn-outline" onClick={abrirSolicitudEstudiosDesdeEvolucion} disabled={!canSolicitarEstudiosDesdeEvolucion}>
              Solicitar estudio ({totalEstudiosSolicitadosDraftEvolucion})
            </button>
            <button type="button" onClick={guardarEvolucionNueva} disabled={!canGuardarEvolucion}>Guardar</button>
          </div>
        </section>
      </div> : null}

      {/* Salida encuentro modal */}
      {showSalidaEncuentroModal && selectedTurno ? <div className="modal-backdrop" role="presentation" onClick={() => setShowSalidaEncuentroModal(false)}>
        <section className="confirm-modal hc-salida-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <div className="modal-header">
            <h3>Acción de salida</h3>
            <button type="button" className="modal-close" onClick={() => setShowSalidaEncuentroModal(false)}>&times;</button>
          </div>

          <p className="hc-salida-paciente">Paciente: <strong>{selectedTurno.paciente}</strong> — {selectedTurno.documento}</p>
          <p className="hc-salida-estado">Estado actual: <span className={`hc-chip hc-chip-${selectedTurno.estado.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{selectedTurno.estado.replace(/_/g, " ")}</span></p>

          <div className="hc-salida-options">
            <label className={`hc-salida-option hc-salida-cerrar ${accionSalidaEncuentro === "CERRAR_ENCUENTRO" ? "is-active" : ""} ${selectedTurno.estado !== ESTADO_EN_ATENCION ? "is-disabled" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "CERRAR_ENCUENTRO"} onChange={() => setAccionSalidaEncuentro("CERRAR_ENCUENTRO")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION} />
              <div className="hc-salida-icon hc-salida-icon-cerrar">✓</div>
              <div className="hc-salida-text">
                <span className="hc-salida-titulo">Cerrar atención (Atendido)</span>
                <span className="hc-salida-desc">Registra al paciente como atendido y cierra el encuentro.</span>
              </div>
            </label>

            <label className={`hc-salida-option hc-salida-observacion ${accionSalidaEncuentro === "ENVIAR_OBSERVACION" ? "is-active" : ""} ${selectedTurno.estado !== ESTADO_EN_ATENCION ? "is-disabled" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "ENVIAR_OBSERVACION"} onChange={() => setAccionSalidaEncuentro("ENVIAR_OBSERVACION")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION} />
              <div className="hc-salida-icon hc-salida-icon-observacion">⏳</div>
              <div className="hc-salida-text">
                <span className="hc-salida-titulo">Enviar a observación</span>
                <span className="hc-salida-desc">El paciente pasa a estado de observación clínica.</span>
              </div>
            </label>

            <label className={`hc-salida-option hc-salida-espera ${accionSalidaEncuentro === "ENVIAR_LISTA_ESPERA" ? "is-active" : ""} ${selectedTurno.estado !== ESTADO_EN_ATENCION ? "is-disabled" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "ENVIAR_LISTA_ESPERA"} onChange={() => setAccionSalidaEncuentro("ENVIAR_LISTA_ESPERA")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION} />
              <div className="hc-salida-icon hc-salida-icon-espera">⏸</div>
              <div className="hc-salida-text">
                <span className="hc-salida-titulo">Enviar a lista de espera</span>
                <span className="hc-salida-desc">Vuelve a sala de espera para continuar atención.</span>
              </div>
            </label>

            <label className={`hc-salida-option hc-salida-noatendido ${accionSalidaEncuentro === "NO_ATENDIDO" ? "is-active" : ""} ${selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA ? "is-disabled" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "NO_ATENDIDO"} onChange={() => setAccionSalidaEncuentro("NO_ATENDIDO")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA} />
              <div className="hc-salida-icon hc-salida-icon-noatendido">✕</div>
              <div className="hc-salida-text">
                <span className="hc-salida-titulo">No atendido</span>
                <span className="hc-salida-desc">Registra que el paciente no fue atendido.</span>
              </div>
            </label>
          </div>

          {salidaEncuentroError ? <p className="hc-error">{salidaEncuentroError}</p> : null}

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={() => setShowSalidaEncuentroModal(false)}>Cancelar</button>
            <button type="button" onClick={() => void confirmarSalidaEncuentro()} disabled={!accionSalidaEncuentro || working}>
              {working ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </section>
      </div> : null}

      {/* Modals for Solicitar Estudios, Observacion, Megafono, Lugar Atencion */}
      {showSolicitarEstudiosModal ? <div className="modal-backdrop" role="presentation" onClick={() => setShowSolicitarEstudiosModal(false)}>
        <section className="confirm-modal hc-solicitudes-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>{isEstudioDesdeEvolucion ? "Solicitar estudios (desde evolución)" : "Solicitar estudios"}</h3>
          {solicitudError ? <p className="hc-error" style={{ marginBottom: "0.75rem" }}>{solicitudError}</p> : null}
          
          <div className="hc-solicitudes-grid">
            <div className="hc-solicitudes-panel">
              <h4>Prácticas disponibles</h4>
              <input value={searchQueryPracticasIzquierda} onChange={event => setSearchQueryPracticasIzquierda(event.target.value)} placeholder="Buscar practica disponible..." className="hc-solicitudes-search" />
              <ul className="hc-solicitudes-custom-list">
                {opcionesPracticasIzquierda.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasIzquierda.toLowerCase())).map(p => {
                  const isSelected = selectedPracticasIzquierda.includes(p.id);
                  return <li key={p.id} className={isSelected ? "is-selected" : ""} onClick={() => {
                    setSelectedPracticasIzquierda(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                  }}>
                    <span className="hc-practica-check">{isSelected ? "✓" : ""}</span>
                    <span className="hc-practica-nombre">{p.nombre}</span>
                  </li>;
                })}
                {opcionesPracticasIzquierda.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasIzquierda.toLowerCase())).length === 0 ? <li style={{ cursor: "default", color: "#7a92ab", fontStyle: "italic" }}>No se encontraron prácticas</li> : null}
              </ul>
            </div>

            <div className="hc-solicitudes-controls">
              <button type="button" onClick={moverPracticasSeleccionadasADerecha} disabled={selectedPracticasIzquierda.length === 0} title="Mover a seleccionadas">→</button>
              <button type="button" onClick={moverPracticasSeleccionadasAIzquierda} disabled={selectedPracticasDerecha.length === 0} title="Quitar de seleccionadas">←</button>
            </div>

            <div className="hc-solicitudes-panel">
              <h4>Prácticas seleccionadas</h4>
              <input value={searchQueryPracticasDerecha} onChange={event => setSearchQueryPracticasDerecha(event.target.value)} placeholder="Buscar practica seleccionada..." className="hc-solicitudes-search" />
              <ul className="hc-solicitudes-custom-list">
                {opcionesPracticasDerecha.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasDerecha.toLowerCase())).map(p => {
                  const isSelected = selectedPracticasDerecha.includes(p.id);
                  return <li key={p.id} className={isSelected ? "is-selected" : ""} onClick={() => {
                    setSelectedPracticasDerecha(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                  }}>
                    <span className="hc-practica-check">{isSelected ? "✓" : ""}</span>
                    <span className="hc-practica-nombre">{p.nombre}</span>
                  </li>;
                })}
                {opcionesPracticasDerecha.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasDerecha.toLowerCase())).length === 0 ? <li style={{ cursor: "default", color: "#7a92ab", fontStyle: "italic" }}>No hay prácticas seleccionadas</li> : null}
              </ul>
            </div>
          </div>
          
          {opcionesPracticasDerecha.length > 0 ? <div className="hc-solicitudes-observaciones">
            <h4>Observaciones por práctica</h4>
            <p className="hc-solicitudes-help">Seleccione "Observación" para añadir detalles técnicos para el especialista que realizará el estudio.</p>
            <ul className="hc-evoluciones-list">
              {opcionesPracticasDerecha.map(practica => {
                const obs = (solicitudesPorScope[solicitudesScopeActual] ?? {})[practica.id] ?? "";
                return <li key={practica.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ flex: "1 1 0", wordBreak: "break-word", lineHeight: "1.35" }}>{practica.nombre}</span>
                    <button type="button" className="btn-outline" style={{ flexShrink: 0 }} onClick={() => abrirObservacionPractica(practica.id)}>
                      {obs ? "Editar" : "Añadir obs."}
                    </button>
                  </div>
                  {obs ? <p style={{ marginTop: "0.4rem", fontStyle: "italic", fontSize: "0.82rem", color: "#3a5d80" }}>Obs: {obs}</p> : null}
                  {obs ? <button type="button" className="hc-icon-button" style={{ color: "#992d2d", marginTop: "0.2rem" }} onClick={() => eliminarObservacionPractica(practica.id)}>✕</button> : null}
                </li>;
              })}
            </ul>
          </div> : null}

          <div className="confirm-actions">
            {opcionesPracticasDerecha.length > 0 && !isEstudioDesdeEvolucion ? <button type="button" className="btn-outline" onClick={() => void imprimirSolicitudesPracticas()}>Imprimir comprobante</button> : null}
            <button type="button" onClick={() => setShowSolicitarEstudiosModal(false)}>Cerrar / Volver</button>
          </div>
        </section>
      </div> : null}

      {observacionPracticaModalData ? <div className="modal-backdrop" role="presentation" onClick={() => setObservacionPracticaModalData(null)}>
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>Observación para: {observacionPracticaModalData.nombre}</h3>
          <textarea value={observacionPracticaText} onChange={event => {
            if (event.target.value.length <= 140) {
              setObservacionPracticaText(event.target.value);
            }
          }} rows={4} placeholder="Ingrese indicaciones adicionales para el estudio..." style={{ width: "100%", marginTop: "1rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "inherit" }} />
          <p className="hc-solicitudes-help" style={{ textAlign: "right", marginTop: "0.25rem" }}>
            {observacionPracticaText.length}/140 caracteres
          </p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setObservacionPracticaModalData(null)}>Cancelar</button>
            <button type="button" onClick={guardarObservacionPractica}>Guardar observación</button>
          </div>
        </section>
      </div> : null}

      {showLlamarMegafonoModal && pendingLlamadoTurno ? <div className="modal-backdrop" role="presentation" onClick={() => { setLlamarMegafonoModal(false); setError(null); }}>
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>¿Desea llamar al paciente por megafono?</h3>
          <p>Paciente seleccionado: <strong>{pendingLlamadoTurno.paciente}</strong></p>
          {error ? <p className="hc-error">{error}</p> : null}
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => { setLlamarMegafonoModal(false); setError(null); }}>Cancelar</button>
            <button type="button" onClick={() => void confirmarLlamadoMegafono()} disabled={working}>
              {working ? "Llamando..." : "Si, llamar"}
            </button>
          </div>
        </section>
      </div> : null}

      {showMedicamentoModal ? <div className="modal-backdrop" role="presentation">
        <section className="confirm-modal hc-medicamento-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <div className="modal-header">
            <h3>Buscar medicamento</h3>
            <button type="button" className="modal-close" onClick={() => setShowMedicamentoModal(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <input
              value={medicamentoSearchQuery}
              onChange={event => setMedicamentoSearchQuery(event.target.value)}
              placeholder="Buscar por nombre comercial, principio activo o laboratorio..."
              className="hc-solicitudes-search"
              autoFocus
            />
            {medicamentoLoading ? <p style={{ textAlign: "center", padding: "1rem" }}>Buscando...</p> : null}
            {medicamentoError ? <p className="hc-error">{medicamentoError}</p> : null}
            {!medicamentoLoading && medicamentoSearchQuery && medicamentoResultados.length === 0 ? <p className="hc-empty">No se encontraron medicamentos.</p> : null}
            {medicamentoResultados.length > 0 ? <>
              <p className="hc-solicitudes-help">{medicamentoTotalCount} resultado(s)</p>
              <table className="hc-medicamento-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Presentación</th>
                    <th>Laboratorio</th>
                    <th>Principio activo</th>
                    <th>Familia</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentoResultados.map(m => (
                    <tr key={m.id} className="hc-medicamento-row" onClick={() => {
                      seleccionarMedicamento(m);
                    }}>
                      <td>{m.producto}</td>
                      <td>{m.presentacion}</td>
                      <td>{m.laboratorio}</td>
                      <td>{m.principioActivo}</td>
                      <td>{m.familia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {medicamentoTotalCount > 20 ? <div className="confirm-actions" style={{ marginTop: "0.5rem" }}>
                <button type="button" className="btn-outline" disabled={medicamentoPagina <= 1} onClick={() => void ejecutarBusquedaMedicamento(medicamentoSearchQuery, medicamentoPagina - 1)}>Anterior</button>
                <span style={{ padding: "0 0.5rem" }}>Pág. {medicamentoPagina}</span>
                <button type="button" className="btn-outline" disabled={medicamentoResultados.length < 20} onClick={() => void ejecutarBusquedaMedicamento(medicamentoSearchQuery, medicamentoPagina + 1)}>Siguiente</button>
              </div> : null}
            </> : null}
          </div>
        </section>
      </div> : null}

      {showPrescripcionFormModal && medicamentoSeleccionado ? <div className="modal-backdrop" role="presentation" onClick={() => { if (!prescripcionGuardando) setShowPrescripcionFormModal(false); }}>
        <section className="confirm-modal hc-medicamento-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <div className="modal-header">
            <h3>Prescribir medicamento</h3>
            <button type="button" className="modal-close" onClick={() => { if (!prescripcionGuardando) setShowPrescripcionFormModal(false); }}>&times;</button>
          </div>
          <div className="modal-body">
            {prescripcionExitosa ? <>
              <p style={{ color: "#1b7e3a", fontWeight: 600, marginBottom: "1rem" }}>Prescripción guardada correctamente.</p>
              <div className="confirm-actions">
                <button type="button" onClick={() => setShowPrescripcionFormModal(false)}>Cerrar</button>
              </div>
            </> : <>
              <div style={{ marginBottom: "0.75rem", padding: "0.5rem", background: "#eef5fc", borderRadius: "6px" }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{medicamentoSeleccionado.producto}</p>
                <p style={{ fontSize: "0.85rem", color: "#3a5d80", margin: "0.15rem 0 0" }}>
                  {medicamentoSeleccionado.presentacion} — {medicamentoSeleccionado.laboratorio}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#7a92ab", margin: "0.15rem 0 0" }}>
                  {medicamentoSeleccionado.principioActivo} | {medicamentoSeleccionado.familia}
                </p>
              </div>

              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Dosis
                <input value={prescripcionDosis} onChange={e => setPrescripcionDosis(e.target.value)} placeholder="Ej: 1 comprimido" style={{ width: "100%", marginTop: "0.25rem" }} />
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Frecuencia
                <input value={prescripcionFrecuencia} onChange={e => setPrescripcionFrecuencia(e.target.value)} placeholder="Ej: cada 8 horas" style={{ width: "100%", marginTop: "0.25rem" }} />
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Duración (días)
                <input type="number" value={prescripcionDuracion} onChange={e => setPrescripcionDuracion(e.target.value)} placeholder="Ej: 7" min="1" style={{ width: "100%", marginTop: "0.25rem" }} />
              </label>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Indicación
                <textarea value={prescripcionIndicacion} onChange={e => setPrescripcionIndicacion(e.target.value)} placeholder="Ej: Tomar después de las comidas" rows={3} style={{ width: "100%", marginTop: "0.25rem", resize: "vertical" }} />
              </label>

              {prescripcionError ? <p className="hc-error">{prescripcionError}</p> : null}

              <div className="confirm-actions">
                <button type="button" className="btn-outline" onClick={() => setShowPrescripcionFormModal(false)} disabled={prescripcionGuardando}>Cancelar</button>
                <button type="button" onClick={() => void guardarPrescripcion()} disabled={prescripcionGuardando}>
                  {prescripcionGuardando ? "Guardando..." : "Guardar prescripción"}
                </button>
              </div>
            </>}
          </div>
        </section>
      </div> : null}

      {showPrescripcionModule ? <div className="modal-backdrop" role="presentation">
        <section className="confirm-modal hc-medicamento-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <div className="modal-header">
            <h3>Prescripciones — {selectedTurno?.paciente ?? ""}</h3>
            <button type="button" className="modal-close" onClick={() => setShowPrescripcionModule(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <button type="button" className="btn-primary" onClick={abrirBuscarMedicamento} style={{ marginBottom: "0.75rem" }}>
              + Nueva prescripción
            </button>

            {prescripcionModuleLoading ? <p style={{ textAlign: "center", padding: "1rem" }}>Cargando prescripciones...</p> : null}
            {prescripcionModuleError ? <p className="hc-error">{prescripcionModuleError}</p> : null}

            {!prescripcionModuleLoading && prescripcionModuleRecetas.length === 0 ? <p className="hc-empty">No hay prescripciones registradas.</p> : null}

            {prescripcionModuleRecetas.length > 0 ? <>
              <p className="hc-solicitudes-help">{prescripcionModuleRecetas.length} prescripción(es)</p>
              {prescripcionModuleRecetas.map(receta => (
                <div key={receta.recetaId} style={{
                  padding: "0.5rem 0.75rem", marginBottom: "0.5rem",
                  border: "1px solid #d6e4f3", borderRadius: "8px",
                  background: receta.estado === "ACTIVA" ? "#f4f8fd" : "#f5f5f5",
                  opacity: receta.estado === "ACTIVA" ? 1 : 0.6
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {new Date(receta.creadoEn).toLocaleDateString("es-AR")} — {receta.cantidadItems} ítem(s)
                      <span className={`hc-chip hc-chip-${receta.estado.toLowerCase()}`} style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>
                        {receta.estado}
                      </span>
                    </span>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      <button type="button" className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}
                        onClick={() => imprimirReceta(receta)} disabled={receta.estado !== "ACTIVA"}>🖨</button>
                      <button type="button" className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem", color: "#992d2d" }}
                        onClick={() => { if (confirm("¿Anular esta prescripción?")) void handleAnularReceta(receta.recetaId); }}
                        disabled={receta.estado !== "ACTIVA" || prescripcionModuleAnulando === receta.recetaId}>
                        {prescripcionModuleAnulando === receta.recetaId ? "..." : "✕"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </> : null}
          </div>
        </section>
      </div> : null}

      {showLugarAtencionModal ? <div className="modal-backdrop" role="presentation" onClick={() => setShowLugarAtencionModal(false)}>
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>Cambiar lugar de atención</h3>
          <p>El cambio de consultorio actualizará el estado para todos los llamados y atenciones futuras.</p>
          <label style={{ display: "block", marginTop: "1rem" }}>
            Nuevo consultorio:
            <select style={{ width: "100%", marginTop: "0.5rem" }} value={lugarAtencionPendienteId} onChange={event => {
              setLugarAtencionPendienteId(event.target.value);
              setLugarAtencionError(null);
            }}>
              {efectoresDisponibles.map(ef => <option key={ef.id} value={ef.id}>{ef.nombre}</option>)}
            </select>
          </label>
          {lugarAtencionError ? <p className="hc-error">{lugarAtencionError}</p> : null}
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setShowLugarAtencionModal(false)}>Cancelar</button>
            <button type="button" onClick={confirmarCambioLugarAtencion}>Confirmar cambio</button>
          </div>
        </section>
      </div> : null}

    </>
  );
}
