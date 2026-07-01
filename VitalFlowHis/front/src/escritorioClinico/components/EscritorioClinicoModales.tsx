import { useState, useEffect, useRef } from "react";
import { useEscritorioClinico } from "../useEscritorioClinico";
type useEscritorioClinicoState = ReturnType<typeof useEscritorioClinico>;
import { sanitizeRichTextHtml } from "../EscritorioClinicoPage";
import { buscarVademecum, registrarRecetaDigital, type VademecumItem } from "../escritorioClinicoApi";

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
    showFechaPrimeraPracticaModal, setShowFechaPrimeraPracticaModal, fechaSolicitudNueva, setFechaSolicitudNueva,
    confirmarFechaPrimeraPractica,
    solicitudError,
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
    efectoresDisponibles, lugarAtencionError, setLugarAtencionError, confirmarCambioLugarAtencion,
    showPrescripcionModal, setShowPrescripcionModal, error,
    prescripcionItems, setPrescripcionItems, prescripcionDraft, setPrescripcionDraft,
    agregarItemPrescripcion, eliminarItemPrescripcion, cerrarPrescripcion,
    VIAS_ADMINISTRACION, estadoPacienteId, encuentroId, refreshPacienteData
  } = state;

  const [vademecumSearch, setVademecumSearch] = useState("");
  const [vademecumResults, setVademecumResults] = useState<VademecumItem[]>([]);
  const [vademecumLoading, setVademecumLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<VademecumItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [recetaError, setRecetaError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const searchTimerRef = useRef<any>(null);

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    const query = vademecumSearch.trim();
    if (query.length < 2) {
      setVademecumResults([]);
      return;
    }

    setVademecumLoading(true);
    setRecetaError(null);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const data = await buscarVademecum(query);
        setVademecumResults(data);
      } catch (err) {
        console.error("Error al buscar vademecum:", err);
        setRecetaError("Error al buscar medicamentos. Verifique la conexión con el servidor.");
      } finally {
        setVademecumLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [vademecumSearch]);

  useEffect(() => {
    if (!showPrescripcionModal) {
      setVademecumSearch("");
      setVademecumResults([]);
      setSelectedDrug(null);
      setRecetaError(null);
      setIsSaving(false);
      setShowSuccessToast(false);
    }
  }, [showPrescripcionModal]);

  useEffect(() => {
    if (vademecumSearch.trim().length < 2) {
      setRecetaError(null);
    }
  }, [vademecumSearch]);

  const handleGuardarReceta = async () => {
    if (prescripcionItems.length === 0) return;
    setIsSaving(true);
    setRecetaError(null);

    try {
      let userId = "00000000-0000-0000-0000-000000000000";
      const sessionRaw = sessionStorage.getItem("vitalflow.auth.session");
      if (sessionRaw) {
        try {
          const session = JSON.parse(sessionRaw);
          const token = session.accessToken;
          if (token) {
            const base64Url = token.split(".")[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const decoded = JSON.parse(atob(base64));
              if (decoded.userId) {
                userId = decoded.userId;
              }
            }
          }
        } catch (e) {
          console.error("Error decoding JWT:", e);
        }
      }

      let matricula = "MP99999";
      const match = selectedTurno?.efector?.match(/\((M[PN]\s*\d+[^)]*)\)/i);
      if (match && match[1]) {
        matricula = match[1].trim();
      } else {
        for (const ef of efectoresDisponibles || []) {
          const m = ef.nombre?.match(/\((M[PN]\s*\d+[^)]*)\)/i);
          if (m && m[1]) {
            matricula = m[1].trim();
            break;
          }
        }
      }

      const items = prescripcionItems.map(item => ({
        medicamentoCodigo: item.medicamentoCodigo || item.id,
        medicamentoSistema: item.medicamentoSistema || "http://troquel.ar",
        medicamentoDisplay: item.medicamentoDisplay || item.medicamento,
        dosisTexto: item.dosis || null,
        frecuenciaTexto: item.frecuencia || null,
        duracionDias: item.duracionDias || null,
        indicacion: item.indicacion || null
      }));

      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const turnoIdValido = selectedTurno?.id && guidRegex.test(selectedTurno.id) ? selectedTurno.id : null;
      const encuentroIdValido = encuentroId && guidRegex.test(encuentroId) ? encuentroId : null;
      await registrarRecetaDigital({
        pacienteId: estadoPacienteId || "",
        encuentroId: encuentroIdValido,
        turnoId: turnoIdValido,
        prescriptorUsuarioId: userId,
        prescriptorMatricula: matricula,
        organizacionOid: "2.16.840.1.113883.2.10.1.1",
        fhirBundleJson: JSON.stringify({
          resourceType: "Bundle",
          type: "document",
          entry: []
        }),
        items
      });

      setShowSuccessToast(true);
      await refreshPacienteData();
      setTimeout(() => {
        setShowSuccessToast(false);
        cerrarPrescripcion();
      }, 2000);
    } catch (err) {
      console.error("Error al registrar receta digital:", err);
      setRecetaError(err instanceof Error ? err.message : "Error al registrar receta digital en el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

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
          
          <div className="hc-solicitudes-body">
            <div className="hc-solicitudes-grid">
              <div className="hc-solicitudes-panel">
                <h4>Prácticas disponibles</h4>
                <input value={searchQueryPracticasIzquierda} onChange={event => setSearchQueryPracticasIzquierda(event.target.value)} placeholder="Buscar practica disponible..." className="hc-solicitudes-search" />
                <div className="hc-solicitudes-listbox">
                  {opcionesPracticasIzquierda.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasIzquierda.toLowerCase())).map(p => (
                    <label key={p.id} className="hc-checkbox-item">
                      <input type="checkbox" checked={selectedPracticasIzquierda.includes(p.id)} onChange={() => {
                        setSelectedPracticasIzquierda(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                      }} />
                      <span>{p.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="hc-solicitudes-controls">
                <button type="button" onClick={moverPracticasSeleccionadasADerecha} disabled={selectedPracticasIzquierda.length === 0} title="Mover a seleccionadas">→</button>
                <button type="button" onClick={moverPracticasSeleccionadasAIzquierda} disabled={selectedPracticasDerecha.length === 0} title="Quitar de seleccionadas">←</button>
              </div>
              
              <div className="hc-solicitudes-panel">
                <h4>Prácticas seleccionadas</h4>
                <input value={searchQueryPracticasDerecha} onChange={event => setSearchQueryPracticasDerecha(event.target.value)} placeholder="Buscar practica seleccionada..." className="hc-solicitudes-search" />
                <div className="hc-solicitudes-listbox">
                  {opcionesPracticasDerecha.filter(p => p.nombre.toLowerCase().includes(searchQueryPracticasDerecha.toLowerCase())).map(p => (
                    <label key={p.id} className="hc-checkbox-item">
                      <input type="checkbox" checked={selectedPracticasDerecha.includes(p.id)} onChange={() => {
                        setSelectedPracticasDerecha(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                      }} />
                      <span>{p.nombre}</span>
                    </label>
                  ))}
                </div>
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
          </div>

          {solicitudError ? <p className="hc-error">{solicitudError}</p> : null}

          <div className="confirm-actions">
            {opcionesPracticasDerecha.length > 0 && !isEstudioDesdeEvolucion ? <button type="button" className="btn-outline" onClick={() => void imprimirSolicitudesPracticas()}>Imprimir comprobante</button> : null}
            <button type="button" onClick={() => setShowSolicitarEstudiosModal(false)}>Guardar</button>
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

      {showPrescripcionModal && selectedTurno ? <div className="modal-backdrop" role="presentation" onClick={cerrarPrescripcion}>
        <section className="confirm-modal hc-prescripcion-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>Receta Digital</h3>

          <div className="hc-prescripcion-paciente">
            <p><strong>Paciente:</strong> {selectedTurno.paciente} | <strong>Documento:</strong> {selectedTurno.documento}</p>
          </div>

          <div className="hc-prescripcion-form">
            <h4>Agregar medicamento</h4>

            {!selectedDrug ? (
              <div className="hc-vademecum-search-container">
                <label>
                  Medicamento *
                  <div className="hc-vademecum-search-input-wrapper">
                    <svg className="hc-vademecum-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                      type="text"
                      value={vademecumSearch}
                      onChange={e => setVademecumSearch(e.target.value)}
                      placeholder="Buscar por fórmula, marca comercial o laboratorio..."
                    />
                    {vademecumLoading ? (
                      <span className="hc-vademecum-spinner">Cargando...</span>
                    ) : null}
                  </div>
                </label>

                {vademecumResults.length > 0 ? (
                  <div className="hc-vademecum-results-grid">
                    <div className="hc-vademecum-results-header">
                      <span className="hc-vcm-col-producto">Producto</span>
                      <span className="hc-vcm-col-principio">Principio Activo</span>
                      <span className="hc-vcm-col-troquel">Troquel</span>
                      <span className="hc-vcm-col-cobertura">Cobertura</span>
                    </div>
                    {vademecumResults.map(drug => (
                      <div
                        key={drug.id}
                        className="hc-vademecum-result-row"
                        onClick={() => {
                          setSelectedDrug(drug);
                          setPrescripcionDraft({
                            ...prescripcionDraft,
                            medicamento: drug.producto
                          });
                        }}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === "Enter") { setSelectedDrug(drug); setPrescripcionDraft({ ...prescripcionDraft, medicamento: drug.producto }); } }}
                      >
                        <span className="hc-vcm-col-producto hc-vcm-producto-nombre">{drug.producto}</span>
                        <span className="hc-vcm-col-principio">{drug.principioActivo}</span>
                        <span className="hc-vcm-col-troquel">{drug.troquel}</span>
                        <span className="hc-vcm-col-cobertura">{drug.cobertura ? <span className="hc-vademecum-badge-cobertura">{drug.cobertura}</span> : "—"}</span>
                      </div>
                    ))}
                  </div>
                ) : vademecumSearch.trim().length >= 2 && !vademecumLoading && !recetaError ? (
                  <div className="hc-vademecum-no-results">
                    No se encontraron medicamentos para "{vademecumSearch}"
                  </div>
                ) : null}

              </div>
            ) : (
              <div>
                <div className="hc-vademecum-selected-card">
                  <div className="hc-vademecum-selected-card-content">
                    <h5>Medicamento seleccionado</h5>
                    <p><strong>Fórmula:</strong> {selectedDrug.principioActivo}</p>
                    <p><strong>Producto:</strong> {selectedDrug.producto}</p>
                    <p><strong>Troquel:</strong> {selectedDrug.troquel} | {selectedDrug.cobertura ? <strong className="hc-vademecum-selected-cobertura">{selectedDrug.cobertura} Cobertura</strong> : <span>Sin Cobertura</span>}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-outline btn-change-drug"
                    onClick={() => {
                      setSelectedDrug(null);
                      setVademecumSearch("");
                      setPrescripcionDraft({
                        ...prescripcionDraft,
                        medicamento: ""
                      });
                    }}
                  >
                    Cambiar
                  </button>
                </div>

                <div className="hc-prescripcion-grid">
                  <label>
                    Dosis
                    <input type="text" value={prescripcionDraft.dosis} onChange={e => setPrescripcionDraft({ ...prescripcionDraft, dosis: e.target.value })} placeholder="Ej: 500 mg" />
                  </label>
                  <label>
                    Frecuencia
                    <input type="text" value={prescripcionDraft.frecuencia} onChange={e => setPrescripcionDraft({ ...prescripcionDraft, frecuencia: e.target.value })} placeholder="Ej: Cada 8 horas" />
                  </label>
                  <label>
                    Duración (días)
                    <input type="number" min={1} value={prescripcionDraft.duracionDias ?? ""} onChange={e => setPrescripcionDraft({ ...prescripcionDraft, duracionDias: e.target.value ? Number(e.target.value) : null })} placeholder="Ej: 7" />
                  </label>
                  <label>
                    Vía
                    <select value={prescripcionDraft.via} onChange={e => setPrescripcionDraft({ ...prescripcionDraft, via: e.target.value })}>
                      {VIAS_ADMINISTRACION.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </label>
                  <label className="hc-prescripcion-fullwidth">
                    Indicaciones
                    <textarea value={prescripcionDraft.indicacion} onChange={e => setPrescripcionDraft({ ...prescripcionDraft, indicacion: e.target.value })} rows={2} placeholder="Indicaciones adicionales..." />
                  </label>
                </div>

                <button
                  type="button"
                  className="btn-outline btn-agregar-receta"
                  style={{ marginTop: "1rem", width: "100%", textTransform: "uppercase" }}
                  onClick={() => {
                    const newItem = {
                      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                      ...prescripcionDraft,
                      medicamento: selectedDrug.producto,
                      medicamentoCodigo: selectedDrug.troquel,
                      medicamentoSistema: "http://troquel.ar",
                      medicamentoDisplay: selectedDrug.producto,
                      duracionDias: prescripcionDraft.duracionDias ?? null
                    };
                    setPrescripcionItems(prev => [...prev, newItem]);
                    setPrescripcionDraft({ medicamento: "", dosis: "", frecuencia: "", duracionDias: null, via: "Oral", indicacion: "" });
                    setSelectedDrug(null);
                    setVademecumSearch("");
                  }}
                >
                  Agregar a la receta
                </button>
              </div>
            )}
          </div>

          {prescripcionItems.length > 0 ? <div className="hc-prescripcion-items">
            <h4>Medicamentos prescriptos ({prescripcionItems.length})</h4>
            <ul>
              {prescripcionItems.map(item => (
                <li key={item.id}>
                  <div className="hc-prescripcion-item-header">
                    <strong>{item.medicamento}</strong>
                    <button type="button" className="hc-icon-button" style={{ color: "var(--color-danger)" }} onClick={() => eliminarItemPrescripcion(item.id)}>Quitar</button>
                  </div>
                  <div className="hc-prescripcion-item-detalle">
                    {item.dosis ? <span>Dosis: {item.dosis}</span> : null}
                    {item.frecuencia ? <span>Frec: {item.frecuencia}</span> : null}
                    {item.duracionDias ? <span>Duración: {item.duracionDias} días</span> : null}
                    <span>Vía: {item.via}</span>
                  </div>
                  {item.indicacion ? <p className="hc-prescripcion-item-indicacion">{item.indicacion}</p> : null}
                </li>
              ))}
            </ul>
          </div> : null}

          {showSuccessToast ? (
            <div className="hc-toast-success-prescripcion">
              ✓ ¡Receta digital guardada con éxito!
            </div>
          ) : null}

          {recetaError ? <p className="hc-error">{recetaError}</p> : null}

          <div className="confirm-actions">
            <button type="button" className="btn-outline" disabled={isSaving} onClick={cerrarPrescripcion}>Cancelar</button>
            <button type="button" disabled={prescripcionItems.length === 0 || isSaving} onClick={handleGuardarReceta}>
              {isSaving ? "Guardando..." : "Guardar receta"}
            </button>
          </div>
        </section>
      </div> : null}

      {/* Modal para seleccionar fecha de la primera práctica */}
      {showFechaPrimeraPracticaModal ? <div className="modal-backdrop" role="presentation" onClick={() => setShowFechaPrimeraPracticaModal(false)}>
        <section className="confirm-modal" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
          <h3>Seleccionar fecha de solicitud</h3>
          <p>Ingrese la fecha para la cual se solicitan las prácticas.</p>

          <label style={{ display: "block", marginTop: "1rem" }}>
            Fecha de solicitud
            <input type="date" value={fechaSolicitudNueva} min={new Date().toISOString().split("T")[0]} onChange={event => setFechaSolicitudNueva(event.target.value)} style={{ width: "100%", marginTop: "0.5rem" }} />
          </label>

          {solicitudError ? <p className="hc-error">{solicitudError}</p> : null}

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setShowFechaPrimeraPracticaModal(false)}>Cancelar</button>
            <button type="button" onClick={() => void confirmarFechaPrimeraPractica()}>Confirmar</button>
          </div>
        </section>
      </div> : null}

    </>
  );
}
