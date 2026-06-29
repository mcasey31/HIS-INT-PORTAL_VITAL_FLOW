import { useEscritorioClinico } from "../useEscritorioClinico";
type useEscritorioClinicoState = ReturnType<typeof useEscritorioClinico>;
import { sanitizeRichTextHtml } from "../EscritorioClinicoPage";

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
    showSolicitarEstudiosModal, setShowSolicitarEstudiosModal, isEstudioDesdeEvolucion,
    opcionesPracticasIzquierda, opcionesPracticasDerecha, searchQueryPracticasIzquierda, setSearchQueryPracticasIzquierda,
    searchQueryPracticasDerecha, setSearchQueryPracticasDerecha, selectedPracticasIzquierda,
    setSelectedPracticasIzquierda, selectedPracticasDerecha, setSelectedPracticasDerecha,
    moverPracticasSeleccionadasADerecha, moverPracticasSeleccionadasAIzquierda, abrirObservacionPractica,
    eliminarObservacionPractica, solicitudesScopeActual, solicitudesPorScope, imprimirSolicitudesPracticas,
    observacionPracticaModalData, setObservacionPracticaModalData, observacionPracticaText, setObservacionPracticaText,
    guardarObservacionPractica,
    showLlamarMegafonoModal, setLlamarMegafonoModal, confirmarLlamadoMegafono, pendingLlamadoTurno,
    showVistaRapidaModal, setVistaRapidaModal, turnoVistaRapida,
    showServicioModal, servicioPendienteId, setServicioPendienteId, serviciosDisponibles,
    serviceSelectionError, setServiceSelectionError, confirmarServicioIngreso, cancelarServicioIngreso,
    showLugarAtencionModal, setShowLugarAtencionModal, lugarAtencionPendienteId, setLugarAtencionPendienteId,
    efectoresDisponibles, lugarAtencionError, setLugarAtencionError, confirmarCambioLugarAtencion
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
          <h3>Datos del paciente</h3>

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

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setVistaRapidaModal(false)}>Cerrar</button>
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
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>¿Qué acción deseas realizar con el paciente {selectedTurno.paciente}?</h3>

          <div className="hc-salida-options">
            <label className={`hc-salida-option ${accionSalidaEncuentro === "CERRAR_ENCUENTRO" ? "is-active" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "CERRAR_ENCUENTRO"} onChange={() => setAccionSalidaEncuentro("CERRAR_ENCUENTRO")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION || !cumpleRegistroMinimoSalidaEncuentro} />
              Cerrar encuentro
            </label>

            <label className={`hc-salida-option ${accionSalidaEncuentro === "ENVIAR_OBSERVACION" ? "is-active" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "ENVIAR_OBSERVACION"} onChange={() => setAccionSalidaEncuentro("ENVIAR_OBSERVACION")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION || !cumpleRegistroMinimoSalidaEncuentro} />
              Enviar a observación
            </label>

            <label className={`hc-salida-option ${accionSalidaEncuentro === "ENVIAR_LISTA_ESPERA" ? "is-active" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "ENVIAR_LISTA_ESPERA"} onChange={() => setAccionSalidaEncuentro("ENVIAR_LISTA_ESPERA")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION} />
              Enviar a lista de espera
            </label>

            <label className={`hc-salida-option ${accionSalidaEncuentro === "NO_ATENDIDO" ? "is-active" : ""}`}>
              <input type="radio" name="accionSalidaEncuentro" checked={accionSalidaEncuentro === "NO_ATENDIDO"} onChange={() => setAccionSalidaEncuentro("NO_ATENDIDO")} disabled={selectedTurno.estado !== ESTADO_EN_ATENCION && selectedTurno.estado !== ESTADO_EN_SALA_ESPERA} />
              No atendido
            </label>
          </div>

          {salidaEncuentroError ? <p className="hc-error">{salidaEncuentroError}</p> : null}

          <div className="confirm-actions">
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
          
          <div className="hc-solicitudes-grid">
            <div className="hc-solicitudes-panel">
              <h4>Prácticas disponibles</h4>
              <input value={searchQueryPracticasIzquierda} onChange={event => setSearchQueryPracticasIzquierda(event.target.value)} placeholder="Buscar practica disponible..." className="hc-solicitudes-search" />
              <select multiple className="hc-solicitudes-listbox" value={selectedPracticasIzquierda} onChange={event => {
                const values = Array.from(event.target.selectedOptions).map(opt => opt.value);
                setSelectedPracticasIzquierda(values);
              }}>
                {opcionesPracticasIzquierda.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasIzquierda.toLowerCase())).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            
            <div className="hc-solicitudes-controls">
              <button type="button" onClick={moverPracticasSeleccionadasADerecha} disabled={selectedPracticasIzquierda.length === 0} title="Mover a seleccionadas">→</button>
              <button type="button" onClick={moverPracticasSeleccionadasAIzquierda} disabled={selectedPracticasDerecha.length === 0} title="Quitar de seleccionadas">←</button>
            </div>
            
            <div className="hc-solicitudes-panel">
              <h4>Prácticas seleccionadas</h4>
              <input value={searchQueryPracticasDerecha} onChange={event => setSearchQueryPracticasDerecha(event.target.value)} placeholder="Buscar practica seleccionada..." className="hc-solicitudes-search" />
              <select multiple className="hc-solicitudes-listbox" value={selectedPracticasDerecha} onChange={event => {
                const values = Array.from(event.target.selectedOptions).map(opt => opt.value);
                setSelectedPracticasDerecha(values);
              }}>
                {opcionesPracticasDerecha.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasDerecha.toLowerCase())).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>
          
          {opcionesPracticasDerecha.length > 0 ? <div className="hc-solicitudes-observaciones">
            <h4>Observaciones por práctica</h4>
            <p className="hc-solicitudes-help">Seleccione "Observación" para añadir detalles técnicos para el especialista que realizará el estudio.</p>
            <ul className="hc-evoluciones-list">
              {opcionesPracticasDerecha.map(practica => {
                const obs = (solicitudesPorScope[solicitudesScopeActual] ?? {})[practica.id] ?? "";
                return <li key={practica.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{practica.nombre}</span>
                    <button type="button" className="btn-outline" onClick={() => abrirObservacionPractica(practica.id)}>
                      {obs ? "Editar observación" : "Añadir observación"}
                    </button>
                  </div>
                  {obs ? <p style={{ marginTop: "0.5rem", fontStyle: "italic", fontSize: "0.85rem" }}>Obs: {obs}</p> : null}
                  {obs ? <button type="button" className="hc-icon-button" style={{ color: "var(--color-danger)", marginTop: "0.25rem" }} onClick={() => eliminarObservacionPractica(practica.id)}>Quitar obs.</button> : null}
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
          <textarea value={observacionPracticaText} onChange={event => setObservacionPracticaText(event.target.value)} rows={4} placeholder="Ingrese indicaciones adicionales para el estudio..." style={{ width: "100%", marginTop: "1rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "inherit" }} />
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setObservacionPracticaModalData(null)}>Cancelar</button>
            <button type="button" onClick={guardarObservacionPractica}>Guardar observación</button>
          </div>
        </section>
      </div> : null}

      {showLlamarMegafonoModal && pendingLlamadoTurno ? <div className="modal-backdrop" role="presentation" onClick={() => setLlamarMegafonoModal(false)}>
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>¿Desea llamar al paciente por megafono?</h3>
          <p>Paciente seleccionado: <strong>{pendingLlamadoTurno.paciente}</strong></p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setLlamarMegafonoModal(false)}>Cancelar</button>
            <button type="button" onClick={() => void confirmarLlamadoMegafono()} disabled={working}>
              {working ? "Llamando..." : "Si, llamar"}
            </button>
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
