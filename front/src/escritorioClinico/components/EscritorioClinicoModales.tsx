import { useEscritorioClinicoController } from "../useEscritorioClinicoController";
type useEscritorioClinicoState = ReturnType<typeof useEscritorioClinicoController>;
import { sanitizeRichTextHtml, VALOR_GUION, ESTADO_ACTIVA } from "../escritorioClinicoTypes";
import { SeleccionarEmailModal } from "./SeleccionarEmailModal";

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
    showMedicamentoModal, setShowMedicamentoModal, medicamentoSearchQuery, setMedicamentoSearchQuery, medicamentoSearchTimer,
    medicamentoResultados, medicamentoLoading, medicamentoTotalCount, medicamentoPagina, medicamentoError,
    medicamentoSoloGenerico, setMedicamentoSoloGenerico,
    ejecutarBusquedaMedicamento, seleccionarMedicamento,
    showPrescripcionFormModal, setShowPrescripcionFormModal, medicamentoSeleccionado,
    prescripcionDosis, setPrescripcionDosis, prescripcionFrecuencia, setPrescripcionFrecuencia,
    prescripcionDuracion, setPrescripcionDuracion, prescripcionIndicacion, setPrescripcionIndicacion,
    prescripcionVia, setPrescripcionVia,
    prescripcionGuardando, prescripcionError, prescripcionExitosa, guardarPrescripcion,
    showPrescripcionModule, setShowPrescripcionModule,
    prescripcionModuleRecetas, prescripcionModuleLoading, prescripcionModuleError,
    prescripcionModuleAnulando, handleAnularReceta, imprimirReceta, abrirBuscarMedicamento,
    showEmailModal, setShowEmailModal, emailError, setEmailError, emailSuccess, setEmailSuccess, emailModalPacienteId, emailModalRecetaIds, handleEnviarEmail
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
              <div><dt>Llegada</dt><dd>{turnoVistaRapida.llegada ?? VALOR_GUION}</dd></div>
              <div><dt>Paciente</dt><dd>{turnoVistaRapida.paciente}</dd></div>
              <div><dt>Documento</dt><dd>{turnoVistaRapida.documento}</dd></div>
              <div><dt>Financiador</dt><dd>{turnoVistaRapida.financiador}</dd></div>
              <div><dt>Servicio</dt><dd>{turnoVistaRapida.servicio}</dd></div>
              <div><dt>Efector</dt><dd>{turnoVistaRapida.efector}</dd></div>
              <div><dt>Estado</dt><dd>{turnoVistaRapida.estado}</dd></div>
              <div><dt>Estado turno</dt><dd>{turnoVistaRapida.estadoTurno ?? VALOR_GUION}</dd></div>
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

      {showMedicamentoModal ? <div className="modal-backdrop" role="presentation" onClick={() => setShowMedicamentoModal(false)}>
        <section className="confirm-modal hc-medicamento-modal glass-panel" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <header className="hc-receta-header">
            <div>
              <h3>Buscar medicamento</h3>
              <p>
                Buscar fármaco en el nomenclador / vademécum
              </p>
            </div>
            <button type="button" className="modal-close" onClick={() => setShowMedicamentoModal(false)}>&times;</button>
          </header>
          <div className="hc-receta-content" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <form
              onSubmit={event => {
                event.preventDefault();
                if (medicamentoSearchTimer?.current) clearTimeout(medicamentoSearchTimer.current);
                void ejecutarBusquedaMedicamento(medicamentoSearchQuery, 1);
              }}
              style={{ display: "flex", gap: "0.5rem", width: "100%", marginBottom: "0.25rem" }}
            >
              <div className="hc-receta-search-wrapper" style={{ flex: 1 }}>
                <span className="hc-receta-search-icon" style={{ left: "0.75rem" }}>🔍</span>
                <input
                  value={medicamentoSearchQuery}
                  onChange={event => setMedicamentoSearchQuery(event.target.value)}
                  placeholder="Buscar por nombre comercial, principio activo o laboratorio..."
                  className="hc-receta-search-input"
                  style={{ width: "100%", paddingLeft: "2.3rem" }}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1.5rem", height: "42px", borderRadius: "8px" }}>
                Buscar
              </button>
            </form>

            <label className="hc-checkbox-label" style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.85rem", cursor: "pointer", color: "#555", fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={medicamentoSoloGenerico}
                onChange={event => setMedicamentoSoloGenerico(event.target.checked)}
              />
              Solo genéricos
            </label>

            {medicamentoLoading ? <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>Buscando...</p> : null}
            {medicamentoError ? <p className="hc-error">{medicamentoError}</p> : null}
            {!medicamentoLoading && medicamentoSearchQuery && medicamentoResultados.length === 0 ? <p className="hc-empty">No se encontraron medicamentos.</p> : null}
            
            {!medicamentoLoading && medicamentoResultados.length > 0 ? (
              <div className="hc-medicamentos-resultados-container" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                <p className="hc-solicitudes-help" style={{ marginBottom: "0.5rem", fontSize: "0.8rem", color: "#777", fontWeight: 600 }}>{medicamentoTotalCount} resultado(s)</p>
                <div className="hc-medicamentos-resultados-scroll" style={{ flex: 1, overflowY: "auto", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", background: "rgba(255, 255, 255, 0.7)" }}>
                  <table className="hc-medicamento-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(0, 99, 151, 0.08)" }}>
                        <th style={{ padding: "0.6rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: "#162839" }}>Producto</th>
                        <th style={{ padding: "0.6rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: "#162839" }}>Presentación</th>
                        <th style={{ padding: "0.6rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: "#162839" }}>Laboratorio</th>
                        <th style={{ padding: "0.6rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: "#162839" }}>Principio activo</th>
                        <th style={{ padding: "0.6rem", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: "#162839" }}>Familia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicamentoResultados.map(m => (
                        <tr key={m.id} className="hc-medicamento-row" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }} onClick={() => seleccionarMedicamento(m)}>
                          <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#333", fontWeight: 600 }}>{m.producto} {m.esGenerico ? <span className="hc-badge hc-badge-generico">Gen</span> : null}</td>
                          <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#555" }}>{m.presentacion}</td>
                          <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#555" }}>{m.laboratorio}</td>
                          <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#555" }}>{m.principioActivo}</td>
                          <td style={{ padding: "0.6rem", fontSize: "0.85rem", color: "#555" }}>{m.familia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {medicamentoTotalCount > 20 ? (
                  <div className="confirm-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button type="button" className="btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }} disabled={medicamentoPagina <= 1} onClick={() => void ejecutarBusquedaMedicamento(medicamentoSearchQuery, medicamentoPagina - 1)}>Anterior</button>
                    <span style={{ padding: "0 0.5rem", alignSelf: "center", fontSize: "0.85rem", color: "#666" }}>Pág. {medicamentoPagina}</span>
                    <button type="button" className="btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }} disabled={medicamentoResultados.length < 20} onClick={() => void ejecutarBusquedaMedicamento(medicamentoSearchQuery, medicamentoPagina + 1)}>Siguiente</button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <footer className="hc-receta-footer">
            <button type="button" className="btn-receta-cancelar btn-outline" onClick={() => setShowMedicamentoModal(false)}>
              Cerrar
            </button>
          </footer>
        </section>
      </div> : null}

      {showPrescripcionFormModal && medicamentoSeleccionado ? <div className="modal-backdrop" role="presentation" onClick={() => { if (!prescripcionGuardando) setShowPrescripcionFormModal(false); }}>
        <section className="confirm-modal hc-medicamento-modal glass-panel" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <header className="hc-receta-header">
            <div>
              <h3>Prescribir medicamento</h3>
              <p>
                Paciente: <strong>{selectedTurno?.paciente}</strong> | Documento: <strong>{selectedTurno?.documento}</strong>
              </p>
            </div>
            <button type="button" className="modal-close" onClick={() => { if (!prescripcionGuardando) setShowPrescripcionFormModal(false); }}>&times;</button>
          </header>
          <div className="hc-receta-content">
            {prescripcionExitosa ? <>
              <p style={{ color: "#1b7e3a", fontWeight: 600, marginBottom: "1rem", textAlign: "center" }}>Prescripción guardada correctamente.</p>
              <div className="confirm-actions" style={{ justifyContent: "center" }}>
                <button type="button" className="btn-primary" onClick={() => setShowPrescripcionFormModal(false)}>Cerrar</button>
              </div>
            </> : <>
              <div style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(223, 227, 231, 0.4)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.5)" }}>
                <p style={{ fontWeight: 700, margin: 0, color: "#162839", fontSize: "1rem" }}>{medicamentoSeleccionado.producto}</p>
                <p style={{ fontSize: "0.85rem", color: "#006397", margin: "0.25rem 0 0", fontWeight: 500 }}>
                  {medicamentoSeleccionado.presentacion} — {medicamentoSeleccionado.laboratorio}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#555", margin: "0.25rem 0 0" }}>
                  {medicamentoSeleccionado.principioActivo} | {medicamentoSeleccionado.familia}
                </p>
              </div>

              <div className="hc-receta-form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1rem" }}>
                <div className="hc-receta-form-field" style={{ gridColumn: "span 3" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>Dosis</label>
                  <input
                    type="text"
                    className="hc-receta-input"
                    value={prescripcionDosis}
                    onChange={e => setPrescripcionDosis(e.target.value)}
                    placeholder="Ej: 500 mg"
                    disabled={prescripcionGuardando}
                  />
                </div>

                <div className="hc-receta-form-field" style={{ gridColumn: "span 3" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>Frecuencia</label>
                  <input
                    type="text"
                    className="hc-receta-input"
                    value={prescripcionFrecuencia}
                    onChange={e => setPrescripcionFrecuencia(e.target.value)}
                    placeholder="Ej: Cada 8 horas"
                    disabled={prescripcionGuardando}
                  />
                </div>

                <div className="hc-receta-form-field" style={{ gridColumn: "span 3" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>Duración (días)</label>
                  <input
                    type="number"
                    className="hc-receta-input"
                    value={prescripcionDuracion}
                    onChange={e => setPrescripcionDuracion(e.target.value)}
                    placeholder="Ej: 7"
                    min="1"
                    disabled={prescripcionGuardando}
                  />
                </div>

                <div className="hc-receta-form-field" style={{ gridColumn: "span 3" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>Vía</label>
                  <select
                    className="hc-receta-select"
                    value={prescripcionVia}
                    onChange={e => setPrescripcionVia(e.target.value)}
                    disabled={prescripcionGuardando}
                  >
                    <option>Oral</option>
                    <option>Intravenosa</option>
                    <option>Intramuscular</option>
                    <option>Tópica</option>
                  </select>
                </div>

                <div className="hc-receta-form-field" style={{ gridColumn: "span 12" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>Indicaciones adicionales...</label>
                  <textarea
                    className="hc-receta-textarea"
                    value={prescripcionIndicacion}
                    onChange={e => setPrescripcionIndicacion(e.target.value)}
                    placeholder="Ej: Tomar después de las comidas"
                    rows={3}
                    disabled={prescripcionGuardando}
                  />
                </div>
              </div>

              {prescripcionError ? <p className="hc-error" style={{ marginTop: "0.5rem" }}>{prescripcionError}</p> : null}
            </>}
          </div>
          {!prescripcionExitosa ? (
            <footer className="hc-receta-footer">
              <button
                type="button"
                className="btn-receta-cancelar btn-outline"
                onClick={() => setShowPrescripcionFormModal(false)}
                disabled={prescripcionGuardando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-receta-guardar btn-primary"
                onClick={() => void guardarPrescripcion()}
                disabled={prescripcionGuardando}
              >
                {prescripcionGuardando ? "Guardando..." : "💾 Guardar receta"}
              </button>
            </footer>
          ) : null}
        </section>
      </div> : null}

      {showPrescripcionModule ? <div className="modal-backdrop" role="presentation" onClick={() => setShowPrescripcionModule(false)}>
        <section className="confirm-modal hc-medicamento-modal glass-panel" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <header className="hc-receta-header">
            <div>
              <h3>Prescripciones — {selectedTurno?.paciente ?? ""}</h3>
              <p>
                Listado histórico y vigencias para el paciente
              </p>
            </div>
            <button type="button" className="modal-close" onClick={() => setShowPrescripcionModule(false)}>&times;</button>
          </header>
          <div className="hc-receta-content" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button type="button" className="btn-primary" onClick={abrirBuscarMedicamento} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.35rem", borderRadius: "8px", height: "42px", padding: "0.5rem 1.5rem" }}>
              + Nueva prescripción
            </button>

            {prescripcionModuleLoading ? <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>Cargando prescripciones...</p> : null}
            {prescripcionModuleError ? <p className="hc-error">{prescripcionModuleError}</p> : null}

            {!prescripcionModuleLoading && prescripcionModuleRecetas.length === 0 ? <p className="hc-empty">No hay prescripciones registradas.</p> : null}

            {!prescripcionModuleLoading && prescripcionModuleRecetas.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p className="hc-solicitudes-help" style={{ fontSize: "0.8rem", color: "#777", fontWeight: 600 }}>{prescripcionModuleRecetas.length} prescripción(es)</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {prescripcionModuleRecetas.map(receta => (
                    <div key={receta.recetaId} className="hc-receta-item-card" style={{
                      background: receta.estado === ESTADO_ACTIVA ? "rgba(244, 248, 253, 0.75)" : "rgba(245, 245, 245, 0.6)",
                      borderLeft: receta.estado === ESTADO_ACTIVA ? "4px solid #006397" : "4px solid #777",
                      opacity: receta.estado === ESTADO_ACTIVA ? 1 : 0.7,
                      padding: "0.85rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.4)"
                    }}>
                      <div className="hc-receta-item-info" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <div className="hc-receta-item-icon" style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: receta.estado === ESTADO_ACTIVA ? "rgba(0, 99, 151, 0.1)" : "rgba(0,0,0,0.05)",
                          color: receta.estado === ESTADO_ACTIVA ? "#006397" : "#555",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          📋
                        </div>
                        <div className="hc-receta-item-text">
                          <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#162839", margin: 0 }}>
                            {new Date(receta.creadoEn).toLocaleDateString("es-AR")} — {receta.cantidadItems} ítem(s)
                          </h4>
                          <p style={{ margin: "0.15rem 0 0", fontSize: "0.8rem", color: "#666" }}>
                            Estado: <span className={`hc-chip hc-chip-${receta.estado.toLowerCase()}`} style={{ fontSize: "0.72rem", padding: "0.1rem 0.35rem" }}>{receta.estado}</span>
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.45rem" }}>
                        <button type="button" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", padding: 0 }}
                          title="Imprimir receta" onClick={() => imprimirReceta(receta)} disabled={receta.estado !== ESTADO_ACTIVA}>🖨</button>
                        <button type="button" className="btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", padding: 0, color: "#d32f2f" }}
                          title="Anular receta" onClick={() => { if (confirm("¿Anular esta prescripción?")) void handleAnularReceta(receta.recetaId); }}
                          disabled={receta.estado !== ESTADO_ACTIVA || prescripcionModuleAnulando === receta.recetaId}>
                          {prescripcionModuleAnulando === receta.recetaId ? "..." : "✕"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <footer className="hc-receta-footer">
            <button type="button" className="btn-receta-cancelar btn-outline" onClick={() => setShowPrescripcionModule(false)}>
              Cerrar
            </button>
          </footer>
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

      {emailError ? <div className="modal-backdrop" role="presentation" onClick={() => setEmailError(null)}>
        <section className="confirm-modal" onClick={e => e.stopPropagation()}>
          <h3>Error</h3>
          <p className="hc-error">{emailError}</p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setEmailError(null)}>Cerrar</button>
          </div>
        </section>
      </div> : null}

      {emailSuccess ? <div className="modal-backdrop" role="presentation" onClick={() => setEmailSuccess(null)}>
        <section className="confirm-modal" onClick={e => e.stopPropagation()}>
          <h3>Email enviado</h3>
          <p>{emailSuccess}</p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setEmailSuccess(null)}>Cerrar</button>
          </div>
        </section>
      </div> : null}

      {showEmailModal ? <SeleccionarEmailModal
        pacienteId={emailModalPacienteId}
        recetaIds={emailModalRecetaIds}
        onClose={() => setShowEmailModal(false)}
        onSuccess={msg => { setShowEmailModal(false); setEmailSuccess(msg); }}
        onError={msg => { setShowEmailModal(false); setEmailError(msg); }}
      /> : null}

    </>
  );
}
