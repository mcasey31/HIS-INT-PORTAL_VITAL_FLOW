import { FormEvent } from "react";
import '../css/personas.css';
import { useUnsavedChanges } from "../navigation/UnsavedChangesContext";
import { usePersonasController } from "./usePersonasController";
import type { ContactoTipo, ContactoUso } from "./personasTypes";

type PersonasPageProps = {};

export function PersonasPage({}: PersonasPageProps) {
  const { markUnsavedChanges, clearUnsavedChanges } = useUnsavedChanges();
  const {
    tiposDocumento,
    tipoDocumento,
    setTipoDocumento,
    numeroDocumento,
    setNumeroDocumento,
    candidatos,
    consultado,
    loading,
    error,
    mostrarSetMinimo,
    setMostrarSetMinimo,
    nombre,
    setNombre,
    otroNombre,
    setOtroNombre,
    apellido,
    setApellido,
    otroApellido,
    setOtroApellido,
    nombreSocial,
    setNombreSocial,
    fechaNacimiento,
    setFechaNacimiento,
    sexoBiologico,
    setSexoBiologico,
    generoAutopercibido,
    setGeneroAutopercibido,
    presentaDocumentacion,
    setPresentaDocumentacion,
    cargaPorEscaneoDni,
    setSetMinimoSnapshot,
    rebusquedaModalOpen,
    setRebusquedaModalOpen,
    rebusquedaCandidatos,
    sinResultadosModalOpen,
    setSinResultadosModalOpen,
    modoEdicionEmpadronamiento,
    personaCreadaModalOpen,
    personaCreadaMensaje,
    contactos,
    advertenciaContactoModalOpen,
    setAdvertenciaContactoModalOpen,
    direccionPais,
    setDireccionPais,
    direccionProvincia,
    setDireccionProvincia,
    direccionCalle,
    setDireccionCalle,
    direccionNumero,
    setDireccionNumero,
    direccionLocalidad,
    setDireccionLocalidad,
    direccionBarrio,
    setDireccionBarrio,
    direccionCodigoPostal,
    setDireccionCodigoPostal,
    direccionPiso,
    setDireccionPiso,
    direccionDepartamento,
    setDireccionDepartamento,
    direccionComentario,
    setDireccionComentario,
    personaContactos,
    empadronarContactoModalOpen,
    contactoNombre,
    setContactoNombre,
    contactoApellido,
    setContactoApellido,
    contactoTipoDocumento,
    setContactoTipoDocumento,
    contactoNumeroDocumento,
    setContactoNumeroDocumento,
    contactoFechaNacimiento,
    setContactoFechaNacimiento,
    contactoSexoBiologico,
    setContactoSexoBiologico,
    contactoDatosContacto,
    contactoScanRawData,
    setContactoScanRawData,
    contactoScanMessage,
    personaContactosSeleccionados,
    eliminarPersonaContactoModalOpen,
    selectedCandidatoId,
    setSelectedCandidatoId,
    info,
    setInfo,
    scanModalOpen,
    scanRawData,
    setScanRawData,
    scanState,
    setScanState,
    scanMessage,
    setScanMessage,
    numeroInputRef,
    direccionPaises,
    direccionProvincias,
    direccionLocalidadesFiltradas,
    mensajeSinResultados,
    puedeConsultarSetMinimo,
    setMinimoCompleto,
    datosContactoCompleto,
    direccionCompleta,
    personaContactoCompleta,
    porcentajeCargaEmpadronamiento,
    maxPorcentajeCoincidencia,
    puedeConsultar,
    habilitarEmpadronar,
    selectedCandidato,
    bloqueaDatosAmpliados,
    bloqueaSetMinimo,
    parseApellidosNombres,
    estadoEmpadronamiento,
    maybeRunRebusquedaCandidatos,
    onConsultar,
    onLimpiar,
    onSeleccionarCandidato,
    onIniciarEdicionSeleccionado,
    onCancelarEdicionEmpadronamiento,
    onGuardarEdicionSetMinimo,
    onEmpadronar,
    ejecutarEmpadronamiento,
    onAgregarContacto,
    onEliminarContacto,
    onActualizarContacto,
    normalizarValorContacto,
    onAbrirEmpadronarContacto,
    onCerrarEmpadronarContacto,
    onAgregarDatoContactoPersona,
    onEliminarDatoContactoPersona,
    onActualizarDatoContactoPersona,
    onEscanearDniPersonaContacto,
    puedeGuardarPersonaContacto,
    onGuardarPersonaContacto,
    onTogglePersonaContactoSeleccion,
    onAbrirEliminarPersonaContacto,
    onCerrarEliminarPersonaContacto,
    onConfirmarEliminarPersonaContacto,
    textoConfirmacionEliminarPersonaContacto,
    onAbrirEscaneoDni,
    onCerrarEscaneoDni,
    onEjecutarEscaneoDni,
    onCerrarPersonaCreadaModal
  } = usePersonasController();

  const handlePotentialEdit = (event: FormEvent<HTMLElement>) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement
      || target instanceof HTMLSelectElement
      || target instanceof HTMLTextAreaElement
    ) {
      markUnsavedChanges();
    }
  };

  const handleLimpiar = () => {
    onLimpiar();
    clearUnsavedChanges();
  };

  const handleGuardarEdicion = async () => {
    const wasSaved = await onGuardarEdicionSetMinimo();
    if (wasSaved) {
      clearUnsavedChanges();
    }
  };

  const handleEmpadronar = async () => {
    const wasSaved = await onEmpadronar();
    if (wasSaved) {
      clearUnsavedChanges();
    }
  };

  const puedeEmpadronarPorCoincidencia = candidatos.length === 0 || maxPorcentajeCoincidencia < 95;
  const mostrarGuiaEmpadronamiento = mostrarSetMinimo;
  const showEmpadronamientoWorkspace = mostrarSetMinimo || Boolean(selectedCandidato);
  const showResultados = consultado || candidatos.length > 0;
  const requisitosEmpadronamiento = [
    { label: "Set de datos minimos completo", ok: setMinimoCompleto },
    { label: "Datos de contacto completos (telefono + correo)", ok: datosContactoCompleto },
    { label: "Coincidencia menor a 95% o sin candidatos", ok: puedeEmpadronarPorCoincidencia },
  ];


  return (
    <section className="personas-page" onChangeCapture={handlePotentialEdit}>
      <h2>Identificacion de personas</h2>

      {showEmpadronamientoWorkspace ? (
        <section className="carga-avance-card" aria-label="Porcentaje de carga de datos">
          <div className="carga-avance-head">
            <h3>Empadronar persona: porcentaje de carga</h3>
            <strong>{porcentajeCargaEmpadronamiento}%</strong>
          </div>
          <div className="carga-avance-bar" aria-hidden="true">
            <div className="carga-avance-fill" style={{ width: `${porcentajeCargaEmpadronamiento}%` }} />
          </div>
          <div className="carga-avance-grid">
            <span className={setMinimoCompleto ? "done" : "pending"}>Set de datos minimos (50%)</span>
            <span className={datosContactoCompleto ? "done" : "pending"}>Datos de contacto (30%)</span>
            <span className={direccionCompleta ? "done" : "pending"}>Direccion (10%)</span>
            <span className={personaContactoCompleta ? "done" : "pending"}>Persona de contacto (10%)</span>
          </div>
          <div className="estado-chip-row">
            <span className="estado-chip">Estado empadronamiento: {estadoEmpadronamiento}</span>
          </div>
        </section>
      ) : null}

      <form onSubmit={onConsultar} className="personas-search-shell">
        <div className="personas-search-head">
          <h3>Buscar personas</h3>
          <button type="button" className="btn-outline" onClick={onAbrirEscaneoDni}>
            Escanear DNI
          </button>
        </div>

        <div className="personas-search-grid">
          <label>
            Tipo de documento*
            <select value={tipoDocumento} onChange={(event) => setTipoDocumento(event.target.value)}>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.codigo} value={tipo.codigo}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="personas-doc-number-field">
            N de Documento*
            <input
              ref={numeroInputRef}
              value={numeroDocumento}
              onChange={(event) => setNumeroDocumento(event.target.value.toUpperCase())}
              placeholder="Escribir n"
            />
          </label>

          <div className="personas-search-actions">
            <button type="submit" className="personas-action-btn personas-action-btn--consultar" disabled={!puedeConsultar || loading}>
              {loading ? "Consultando..." : "Consultar"}
            </button>

            {mostrarSetMinimo ? (
              <button
                type="button"
                className="btn-link-action personas-action-btn personas-action-btn--back"
                onClick={() => setMostrarSetMinimo(false)}
              >
                Volver a busqueda por documento
              </button>
            ) : (
              <button
                type="button"
                className="btn-link-action personas-action-btn personas-action-btn--enrol"
                onClick={() => setMostrarSetMinimo(true)}
              >
                Iniciar enrolamiento directo
              </button>
            )}

            <button type="button" className="btn-link-action personas-action-btn personas-action-btn--clear" onClick={handleLimpiar}>
              Limpiar consulta
            </button>
          </div>
        </div>

        <p className="personas-required-note">(*) Datos obligatorios</p>

        {!mostrarSetMinimo ? (
          <p className="personas-flow-hint">
            Si no encuentra una persona por DNI, presione <strong>Iniciar enrolamiento directo</strong> para completar el set minimo y empadronar.
          </p>
        ) : (
          <p className="personas-flow-hint personas-flow-hint--active">
            Modo enrolamiento directo activo. Complete set minimo y datos de contacto para habilitar el empadronamiento.
          </p>
        )}

        {mostrarSetMinimo ? (
          <section className="set-minimo-box" aria-label="Campos set de datos minimos">
            <h3>Set de datos minimos</h3>
            <fieldset className="form-lock-frame" disabled={bloqueaSetMinimo}>
            <div className="set-minimo-grid">
              <label>
                Apellido
                <div className="field-edit-wrap">
                  <input
                  value={apellido}
                  onChange={(event) => setApellido(event.target.value)}
                  onBlur={() => void maybeRunRebusquedaCandidatos()}
                  placeholder="Apellido"
                />
                </div>
              </label>
              <label>
                Nombre
                <div className="field-edit-wrap">
                  <input
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    onBlur={() => void maybeRunRebusquedaCandidatos()}
                    placeholder="Nombre"
                  />
                </div>
              </label>
              <label>
                Otro nombre
                <input value={otroNombre} onChange={(event) => setOtroNombre(event.target.value)} placeholder="Otro nombre" />
              </label>
              <label>
                Otro apellido
                <input value={otroApellido} onChange={(event) => setOtroApellido(event.target.value)} placeholder="Otro apellido" />
              </label>
              <label>
                Nombre social
                <input value={nombreSocial} onChange={(event) => setNombreSocial(event.target.value)} placeholder="Nombre social" />
              </label>
              <label>
                Fecha de nacimiento
                <div className="field-edit-wrap">
                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(event) => setFechaNacimiento(event.target.value)}
                    onBlur={() => void maybeRunRebusquedaCandidatos()}
                  />
                </div>
              </label>
              <label>
                Sexo biologico
                <div className="field-edit-wrap">
                  <select
                    value={sexoBiologico}
                    onChange={(event) => setSexoBiologico(event.target.value)}
                    onBlur={() => void maybeRunRebusquedaCandidatos()}
                  >
                    <option value="">Seleccione</option>
                    <option value="M">Masculino (M)</option>
                    <option value="F">Femenino (F)</option>
                    <option value="X">X</option>
                  </select>
                </div>
              </label>
              <label>
                Genero autopercibido
                <select value={generoAutopercibido} onChange={(event) => setGeneroAutopercibido(event.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="MASCULINO">Hombre o masculino</option>
                  <option value="FEMENINO">Mujer o femenino</option>
                  <option value="NO_BINARIO">No binario</option>
                  <option value="NO_RESPONDE">Prefiere no responder</option>
                </select>
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={presentaDocumentacion}
                  disabled={cargaPorEscaneoDni}
                  onChange={(event) => setPresentaDocumentacion(event.target.checked)}
                />
                Presenta documentacion
              </label>
            </div>
            </fieldset>
          </section>
        ) : null}
      </form>

      {error ? <p className="personas-feedback personas-feedback--error">{error}</p> : null}
      {info ? <p className="personas-feedback personas-feedback--info">{info}</p> : null}
      {mensajeSinResultados ? <p className="personas-feedback personas-feedback--warn">{mensajeSinResultados}</p> : null}
      {mostrarGuiaEmpadronamiento ? (
        <section className="personas-empadronar-guide" aria-label="Guia de empadronamiento">
          <h3>Como empadronar</h3>
          <ol>
            <li>Consultar por documento o set minimo.</li>
            <li>Completar set minimo y datos de contacto.</li>
            <li>Si no hay coincidencia alta, empadronar persona.</li>
          </ol>
          <ul className="personas-checklist">
            {requisitosEmpadronamiento.map((item) => (
              <li key={item.label} className={item.ok ? "ok" : "pending"}>
                {item.ok ? "OK" : "Pendiente"} - {item.label}
              </li>
            ))}
          </ul>
          {!habilitarEmpadronar && consultado && !puedeEmpadronarPorCoincidencia ? (
            <p className="personas-guide-note">
              Existe un candidato con coincidencia alta ({">="} 95%). Seleccione el candidato para continuar con edicion en lugar de empadronar uno nuevo.
            </p>
          ) : null}
        </section>
      ) : null}

      {selectedCandidato ? (
        <section className="persona-seleccionada" aria-label="Persona seleccionada">
          <h3>Persona seleccionada</h3>
          <p>{selectedCandidato.apellidosNombres}</p>
          {modoEdicionEmpadronamiento ? <p className="edit-mode-chip">Pantalla: Editar empadronamiento de persona</p> : null}
          <div className="personas-actions">
            <button type="button" onClick={onIniciarEdicionSeleccionado} disabled={loading}>
              ✏ Editar empadronamiento
            </button>
            <button
              type="button"
              onClick={() => void handleGuardarEdicion()}
              disabled={loading || !mostrarSetMinimo || !puedeConsultarSetMinimo || !modoEdicionEmpadronamiento}
            >
              Guardar edicion
            </button>
            <button type="button" className="btn-outline" onClick={onCancelarEdicionEmpadronamiento} disabled={!modoEdicionEmpadronamiento}>
              Cancelar edicion
            </button>
          </div>
        </section>
      ) : null}

      {showEmpadronamientoWorkspace ? (
      <section className="empadronamiento-grid" aria-label="Secciones empadronamiento">
        <fieldset className="form-lock-frame" disabled={bloqueaDatosAmpliados}>
        <article className="empadronamiento-section">
          <h3>Datos de contacto</h3>
          <div className="contacto-rows">
            {contactos.map((contacto, index) => {
              const placeholder =
                contacto.tipo === "TELEFONO"
                  ? "Telefono"
                  : contacto.tipo === "CORREO_ELECTRONICO"
                    ? "Correo electronico"
                    : "Dato de contacto";
              const isLastRow = index === contactos.length - 1;

              return (
                <div key={contacto.id} className="contacto-row">
                  <label>
                    Tipo
                    <select
                      value={contacto.tipo}
                      onChange={(event) => onActualizarContacto(contacto.id, { tipo: event.target.value as ContactoTipo })}
                    >
                      <option value="">Seleccione</option>
                      <option value="TELEFONO">Telefono</option>
                      <option value="CORREO_ELECTRONICO">Correo electronico</option>
                    </select>
                  </label>
                  <label>
                    {contacto.tipo === "CORREO_ELECTRONICO" ? "Correo electronico" : "Telefono"}
                    <input
                      value={contacto.valor}
                      onChange={(event) =>
                        onActualizarContacto(contacto.id, {
                          valor: normalizarValorContacto(contacto.tipo, event.target.value)
                        })
                      }
                      placeholder={placeholder}
                    />
                  </label>
                  <label>
                    Uso
                    <select
                      value={contacto.uso}
                      onChange={(event) => onActualizarContacto(contacto.id, { uso: event.target.value as ContactoUso })}
                    >
                      <option value="">Seleccione</option>
                      <option value="PERSONAL">Personal</option>
                      <option value="LABORAL">Laboral</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </label>
                  <div className="contacto-action-col">
                    <button
                      type="button"
                      className="contacto-icon-btn contacto-delete-btn"
                      onClick={() => onEliminarContacto(contacto.id)}
                      aria-label="Eliminar contacto"
                    >
                      x
                    </button>
                    {isLastRow ? (
                      <button
                        type="button"
                        className="contacto-icon-btn contacto-add-btn"
                        onClick={onAgregarContacto}
                        aria-label="Agregar contacto"
                      >
                        +
                      </button>
                    ) : (
                      <span className="contacto-icon-slot" aria-hidden="true" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="empadronamiento-section">
          <h3>Direccion</h3>
          <div className="direccion-grid">
            <label>
              Pais *
              <select value={direccionPais} onChange={(event) => setDireccionPais(event.target.value)}>
                {direccionPaises.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Provincia *
              <input
                list="direccion-provincias"
                value={direccionProvincia}
                onChange={(event) => setDireccionProvincia(event.target.value)}
                placeholder="Seleccione provincia"
              />
              <datalist id="direccion-provincias">
                {direccionProvincias.map((provincia) => (
                  <option key={provincia.nombre} value={provincia.nombre} />
                ))}
              </datalist>
            </label>
            <label>
              Localidad (Partido) *
              <input
                list="direccion-localidades"
                value={direccionLocalidad}
                onChange={(event) => setDireccionLocalidad(event.target.value)}
                placeholder="Seleccione localidad"
              />
              <datalist id="direccion-localidades">
                {direccionLocalidadesFiltradas.map((localidad) => (
                  <option key={localidad} value={localidad} />
                ))}
              </datalist>
            </label>
            <label>
              Barrio
              <input
                value={direccionBarrio}
                onChange={(event) => setDireccionBarrio(event.target.value)}
                placeholder="Barrio"
              />
            </label>
            <label>
              Calle *
              <input
                value={direccionCalle}
                onChange={(event) => setDireccionCalle(event.target.value)}
                placeholder="Calle"
              />
            </label>
            <label>
              Numero *
              <input
                value={direccionNumero}
                onChange={(event) => setDireccionNumero(event.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Numero"
              />
            </label>
            <label>
              Codigo postal
              <input
                value={direccionCodigoPostal}
                onChange={(event) => setDireccionCodigoPostal(event.target.value.toUpperCase())}
                placeholder="Codigo postal"
              />
            </label>
            <label>
              Piso
              <input
                value={direccionPiso}
                onChange={(event) => setDireccionPiso(event.target.value)}
                placeholder="Piso"
              />
            </label>
            <label>
              Departamento
              <input
                value={direccionDepartamento}
                onChange={(event) => setDireccionDepartamento(event.target.value)}
                placeholder="Departamento"
              />
            </label>
            <label className="direccion-comentario-row">
              Comentario (max 140)
              <textarea
                value={direccionComentario}
                onChange={(event) => setDireccionComentario(event.target.value.slice(0, 140))}
                maxLength={140}
                rows={2}
                placeholder="Comentario"
              />
              <span className="direccion-counter">{direccionComentario.length}/140</span>
            </label>
          </div>
        </article>

        <article className="empadronamiento-section">
          <h3>Persona de contacto</h3>
          <div className="persona-contacto-head-actions">
            <button type="button" className="btn-outline" onClick={onAbrirEmpadronarContacto}>
              + Agregar persona de contacto
            </button>
            <button
              type="button"
              className="btn-outline persona-contacto-remove-btn"
              onClick={onAbrirEliminarPersonaContacto}
              disabled={personaContactosSeleccionados.length === 0}
            >
              Eliminar
            </button>
          </div>

          {personaContactos.length === 0 ? (
            <p className="persona-contacto-empty">Sin personas de contacto agregadas.</p>
          ) : (
            <div className="personas-grid-wrap persona-contacto-grid-wrap">
              <table className="personas-grid persona-contacto-grid">
                <thead>
                  <tr>
                    <th>Seleccion</th>
                    <th>Tipo y nro documento</th>
                    <th>Apellido(s), nombre(s)</th>
                    <th>Sexo (edad)</th>
                    <th>Telefonos</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {personaContactos.map((contacto) => (
                    <tr key={contacto.id} className={personaContactosSeleccionados.includes(contacto.id) ? "is-selected" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={personaContactosSeleccionados.includes(contacto.id)}
                          onChange={() => onTogglePersonaContactoSeleccion(contacto.id)}
                          aria-label={`Seleccionar ${contacto.apellidosNombres}`}
                        />
                      </td>
                      <td>{contacto.tipoDocumento} {contacto.numeroDocumento}</td>
                      <td>{contacto.apellidosNombres}</td>
                      <td>{contacto.sexoEdad}</td>
                      <td>
                        {contacto.telefonos.length === 0 ? (
                          <span>-</span>
                        ) : (
                          <div className="persona-contacto-phones">
                            {contacto.telefonos.map((telefono, idx) => (
                              <span key={`${contacto.id}-tel-${idx}`}>{telefono}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>{contacto.email || "-"}</td>
                      <td>{contacto.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
        </fieldset>
      </section>
      ) : null}

      {showEmpadronamientoWorkspace ? (
        <div className="personas-empadronar-wrap personas-empadronar-wrap--footer">
          <button type="button" className="empadronar-btn" onClick={() => void handleEmpadronar()} disabled={!habilitarEmpadronar || loading}>
            + Empadronar persona
          </button>
        </div>
      ) : null}

      <section>
        <h3>Consulta personas</h3>
        {showResultados ? (
          candidatos.length === 0 ? (
            <p>Sin candidatos.</p>
          ) : (
          <div className="personas-grid-wrap">
            <table className="personas-grid">
              <thead>
                <tr>
                  <th>Seleccion</th>
                  <th>Apellidos, nombres</th>
                  <th>Tipo</th>
                  <th>Numero</th>
                  <th>Fecha nacimiento</th>
                  <th>Sexo</th>
                  <th>Estado</th>
                  <th>% coincidencia</th>
                </tr>
              </thead>
              <tbody>
                {candidatos.map((candidato) => (
                  <tr key={candidato.id} className={selectedCandidatoId === candidato.id ? "is-selected" : ""}>
                    <td>
                      <button type="button" className="row-select-btn" onClick={() => onSeleccionarCandidato(candidato)}>
                        {selectedCandidatoId === candidato.id ? "Seleccionado" : "Seleccionar"}
                      </button>
                    </td>
                    <td>{candidato.apellidosNombres}</td>
                    <td>{candidato.tipoDocumento}</td>
                    <td>{candidato.numeroDocumento}</td>
                    <td>{candidato.fechaNacimiento}</td>
                    <td>{candidato.sexoBiologico}</td>
                    <td>{candidato.estado}</td>
                    <td>{candidato.porcentajeCoincidencia}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        ) : (
          <div className="personas-empty-state">
            <p>Consulta personas</p>
          </div>
        )}
      </section>

      {scanModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Escanear DNI">
          <div className="scan-dni-modal">
            <h3>Escanear DNI</h3>
            <p className="scan-dni-help">Ingrese el codigo QR del DNI y presione Escanear.</p>

            <label className="scan-raw-label">
              Codigo QR
              <textarea
                value={scanRawData}
                onChange={(event) => setScanRawData(event.target.value)}
                placeholder="Pegue JSON o cadena QR con separador @"
                rows={4}
              />
            </label>

            {scanMessage ? <p className={scanState === "error" ? "scan-error" : "scan-success"}>{scanMessage}</p> : null}

            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={onCerrarEscaneoDni}>
                Cerrar
              </button>
              <button type="button" className="btn-outline" onClick={() => { setScanRawData(""); setScanState("idle"); setScanMessage(null); }}>
                Reintentar
              </button>
              <button type="button" onClick={() => void onEjecutarEscaneoDni()} disabled={scanState === "success"}>
                Escanear
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {rebusquedaModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Candidatos coincidentes</h3>
            <p>Se encontraron candidatos luego de la edicion del set de datos minimos.</p>
            <ul className="rebusqueda-candidatos-list">
              {rebusquedaCandidatos.map((cand) => (
                <li key={cand.id}>
                  <span>{cand.apellidosNombres} ({cand.porcentajeCoincidencia}%)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidatoId(cand.id);
                      const parsed = parseApellidosNombres(cand.apellidosNombres);
                      setTipoDocumento(cand.tipoDocumento);
                      setNumeroDocumento(cand.numeroDocumento);
                      setNombre(parsed.nombre);
                      setApellido(parsed.apellido);
                      setFechaNacimiento(cand.fechaNacimiento);
                      setSexoBiologico(cand.sexoBiologico);
                      setSetMinimoSnapshot({
                        tipoDocumento: cand.tipoDocumento,
                        numeroDocumento: cand.numeroDocumento.trim().toUpperCase(),
                        nombre: parsed.nombre.trim().toUpperCase(),
                        apellido: parsed.apellido.trim().toUpperCase(),
                        fechaNacimiento: cand.fechaNacimiento,
                        sexoBiologico: cand.sexoBiologico.trim().toUpperCase()
                      });
                      setRebusquedaModalOpen(false);
                      setInfo(`Candidato seleccionado tras nueva busqueda: ${cand.apellidosNombres}`);
                    }}
                  >
                    Seleccionar
                  </button>
                </li>
              ))}
            </ul>
            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={() => setRebusquedaModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      ) : null}

      {sinResultadosModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Sin candidatos</h3>
            <p>No se encontraron candidatos con los nuevos datos de busqueda.</p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setSinResultadosModalOpen(false)}>Aceptar</button>
            </div>
          </div>
        </div>
      ) : null}

      {empadronarContactoModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Empadronar persona de contacto">
          <div className="scan-dni-modal persona-contacto-modal">
            <h3>Empadronar persona de contacto</h3>
            <p>Complete set minimo y datos de contacto para agregar la persona como contacto.</p>

            <div className="set-minimo-grid persona-contacto-set-grid">
              <label>
                Nombre *
                <input value={contactoNombre} onChange={(event) => setContactoNombre(event.target.value)} placeholder="Nombre" />
              </label>
              <label>
                Apellido *
                <input value={contactoApellido} onChange={(event) => setContactoApellido(event.target.value)} placeholder="Apellido" />
              </label>
              <label>
                Tipo de documento *
                <select value={contactoTipoDocumento} onChange={(event) => setContactoTipoDocumento(event.target.value)}>
                  {tiposDocumento.map((tipo) => (
                    <option key={`contacto-${tipo.codigo}`} value={tipo.codigo}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Numero de documento *
                <input
                  value={contactoNumeroDocumento}
                  onChange={(event) => setContactoNumeroDocumento(event.target.value.toUpperCase())}
                  placeholder="Numero"
                />
              </label>
              <label>
                Fecha de nacimiento *
                <input type="date" value={contactoFechaNacimiento} onChange={(event) => setContactoFechaNacimiento(event.target.value)} />
              </label>
              <label>
                Sexo biologico *
                <select value={contactoSexoBiologico} onChange={(event) => setContactoSexoBiologico(event.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </label>
            </div>

            <label className="scan-raw-label persona-contacto-scan-row">
              Escanear DNI
              <textarea
                value={contactoScanRawData}
                onChange={(event) => setContactoScanRawData(event.target.value)}
                placeholder="Pegue JSON o cadena QR con separador @"
                rows={3}
              />
            </label>
            {contactoScanMessage ? <p className="scan-success">{contactoScanMessage}</p> : null}
            <div className="confirm-actions persona-contacto-scan-actions">
              <button type="button" className="btn-outline" onClick={onEscanearDniPersonaContacto}>
                Escanear DNI
              </button>
            </div>

            <h4 className="persona-contacto-subtitle">Datos de contacto</h4>
            <div className="contacto-rows">
              {contactoDatosContacto.map((item, index) => {
                const isLastRow = index === contactoDatosContacto.length - 1;
                return (
                  <div key={item.id} className="contacto-row">
                    <label>
                      Tipo
                      <select
                        value={item.tipo}
                        onChange={(event) => onActualizarDatoContactoPersona(item.id, { tipo: event.target.value as ContactoTipo })}
                      >
                        <option value="">Seleccione</option>
                        <option value="TELEFONO">Telefono</option>
                        <option value="CORREO_ELECTRONICO">Correo electronico</option>
                      </select>
                    </label>
                    <label>
                      Valor
                      <input
                        value={item.valor}
                        onChange={(event) =>
                          onActualizarDatoContactoPersona(item.id, {
                            valor: normalizarValorContacto(item.tipo, event.target.value)
                          })
                        }
                        placeholder="Valor"
                      />
                    </label>
                    <label>
                      Uso
                      <select value={item.uso} onChange={(event) => onActualizarDatoContactoPersona(item.id, { uso: event.target.value as ContactoUso })}>
                        <option value="">Seleccione</option>
                        <option value="PERSONAL">Personal</option>
                        <option value="LABORAL">Laboral</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </label>
                    <div className="contacto-action-col">
                      <button
                        type="button"
                        className="contacto-icon-btn contacto-delete-btn"
                        onClick={() => onEliminarDatoContactoPersona(item.id)}
                        aria-label="Eliminar dato de contacto"
                      >
                        x
                      </button>
                      {isLastRow ? (
                        <button
                          type="button"
                          className="contacto-icon-btn contacto-add-btn"
                          onClick={onAgregarDatoContactoPersona}
                          aria-label="Agregar dato de contacto"
                        >
                          +
                        </button>
                      ) : (
                        <span className="contacto-icon-slot" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={onCerrarEmpadronarContacto}>
                Cancelar
              </button>
              <button type="button" onClick={onGuardarPersonaContacto} disabled={!puedeGuardarPersonaContacto}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {eliminarPersonaContactoModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Eliminar persona de contacto">
          <div className="confirm-modal">
            <h3>Eliminar persona de contacto</h3>
            <p>{textoConfirmacionEliminarPersonaContacto}</p>
            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={onCerrarEliminarPersonaContacto}>
                Cancelar
              </button>
              <button type="button" className="persona-contacto-remove-btn" onClick={onConfirmarEliminarPersonaContacto}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {advertenciaContactoModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Advertencia de datos de contacto</h3>
            <p>Por favor considere agregar un correo electronico o numero de telefono.</p>
            <p>No es obligatorio, pero seria muy util. Este dato sera auditado.</p>
            <div className="confirm-actions">
              <button type="button" className="btn-outline" onClick={() => setAdvertenciaContactoModalOpen(false)}>
                Volver
              </button>
              <button type="button" onClick={() => void ejecutarEmpadronamiento()}>
                Continuar igual
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {personaCreadaModalOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Persona creada con exito">
          <div className="confirm-modal">
            <h3>Persona creada con exito</h3>
            <p>{personaCreadaMensaje}</p>
            <div className="confirm-actions">
              <button type="button" onClick={onCerrarPersonaCreadaModal}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

