import { useAdmisionController } from "../useAdmisionController";
type useAdmisionState = ReturnType<typeof useAdmisionController>;
import { isPrivadoFinanciador } from "../admisionTypes";

export function AdmisionModales({ state }: { state: useAdmisionState }) {
  const {
    catalogoFinanciadores, modalProgramadoOpen, pasoModalProgramado, pacienteSeleccionado, edadPaciente, fechaNacimientoPaciente,
    setModalProgramadoOpen, setPasoModalProgramado, financiadorPlanId, setFinanciadorPlanId,
    financiadoresVigentes, financiadorSeleccionado, elegibilidadManual, setElegibilidadManual,
    elegibilidadCompleta, onConfirmarPacienteProgramado, arribandoId,
    turnoDiscrepancia, setTurnoDiscrepancia, onAceptarDiscrepanciaFinanciador,
    financiadorModalOpen, financiadorEditandoId, financiadorFormId, setFinanciadorFormId,
    planesDisponiblesForm, planFormId, setPlanFormId, numeroAfiliadoForm, setNumeroAfiliadoForm,
    financiadorModalError, onCerrarModalFinanciador, onGuardarFinanciador, onFinalizarVigencia, financiadoresPaciente,
    modalDemandaOpen, agendaDemandaId, setAgendaDemandaId, agendaDemandaSeleccionada,
    agendasDemandaFiltradas, onConfirmarDemandaEspontanea, setModalDemandaOpen,
    pasoModalDemanda, setPasoModalDemanda, servicioDemandaId, setServicioDemandaId,
    selectores, practicaDemandaId, setPracticaDemandaId, practicasDemandaDisponibles,
    turnosOfertaDemanda, turnoOfertaId, setTurnoOfertaId,
    modalPracticasOpen, practicasDisponiblesModal, practicasSeleccionadasModal,
    setPracticasSeleccionadasModal, onConfirmarAgregarPracticas, loadingPracticasModal,
    setModalPracticasOpen, practicaAEliminar, onConfirmarEliminarPractica, setPracticaAEliminar
    , admissionSuccessMessage, onCerrarAdmissionSuccess
  } = state;
  const isConfirmandoProgramado = arribandoId !== null;
  const modalDiscrepanciaOpen = turnoDiscrepancia !== null;
  const discrepanciaModalState = turnoDiscrepancia ? {
    financiadorTurno: turnoDiscrepancia.financiador,
    financiadorPaciente: financiadorSeleccionado ? `${financiadorSeleccionado.financiador} | ${financiadorSeleccionado.plan}` : "-"
  } : null;
  const financiadorEditando = financiadorEditandoId ? financiadoresPaciente.find(item => item.id === financiadorEditandoId) ?? null : null;
  const isConfirmandoDemanda = false;
  const puedeConfirmarDemanda = Boolean(agendaDemandaId && practicaDemandaId && (!agendaDemandaSeleccionada || agendaDemandaSeleccionada.tipoAgenda.toUpperCase().includes("ESPONT") || turnoOfertaId));
  const modalEliminarPracticaOpen = practicaAEliminar !== null;

  return (
    <>
      {admissionSuccessMessage ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Admisión confirmada">
          <div className="confirm-modal">
            <h3>Paciente Admitido OK</h3>
            <p>{admissionSuccessMessage}</p>
            <div className="confirm-actions">
              <button type="button" onClick={onCerrarAdmissionSuccess}>
                OK
              </button>
            </div>
          </div>
        </div> : null}

      {modalProgramadoOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Identificar como paciente">
        <div className="confirm-modal admision-programado-modal">
          <h3>Identificar como paciente</h3>

          {pasoModalProgramado === 1 ? <div className="admision-programado-step">
              <h4>Paso 1 - Validar persona</h4>
              <p><strong>Paciente:</strong> {pacienteSeleccionado?.apellidosNombres ?? "-"} ({edadPaciente} anos)</p>
              <p><strong>Documento:</strong> {pacienteSeleccionado?.tipoDocumento} {pacienteSeleccionado?.numeroDocumento}</p>
              <p><strong>Fecha nacimiento:</strong> {fechaNacimientoPaciente}</p>

              <div className="confirm-actions">
                <button type="button" className="btn-outline" onClick={() => setModalProgramadoOpen(false)}>
                  Cancelar
                </button>
                <button type="button" onClick={() => setPasoModalProgramado(2)}>
                  Continuar
                </button>
              </div>
            </div> : <div className="admision-programado-step">
              <h4>Paso 2 - Validar financiador</h4>
              <p>Seleccione financiador vigente y valide elegibilidad para confirmar la admision.</p>

              <label>
                Financiador vigente
                <select value={financiadorPlanId} onChange={event => setFinanciadorPlanId(event.target.value)}>
                  <option value="">Seleccione</option>
                  {financiadoresVigentes.map(fin => <option key={fin.id} value={fin.id}>
                      {fin.financiador} | {fin.plan} - {fin.numeroAfiliado || "No informado"}
                    </option>)}
                </select>
              </label>

              {financiadorSeleccionado && !isPrivadoFinanciador(financiadorSeleccionado) ? <label className="checkbox-row admision-elegibilidad-check">
                  <input type="checkbox" checked={elegibilidadManual[financiadorSeleccionado.id] === true} onChange={event => setElegibilidadManual(prev => ({
            ...prev,
            [financiadorSeleccionado.id]: event.target.checked
          }))} />
                  Elegibilidad OK
                </label> : null}

              {!elegibilidadCompleta ? <p className="admision-elegibilidad-warning">Debe completar elegibilidad para continuar.</p> : null}

              <div className="confirm-actions">
                <button type="button" className="btn-outline" onClick={() => setPasoModalProgramado(1)}>
                  Atras
                </button>
                <button type="button" onClick={() => void onConfirmarPacienteProgramado()} disabled={!elegibilidadCompleta || isConfirmandoProgramado}>
                  {isConfirmandoProgramado ? "Confirmando..." : "Confirmar admision"}
                </button>
              </div>
            </div>}
        </div>
      </div> : null}

      {modalDiscrepanciaOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Discrepancia de financiador detectada">
        <div className="confirm-modal">
          <h3>Discrepancia detectada</h3>
          <p>
            El turno fue programado con el financiador <strong>{discrepanciaModalState?.financiadorTurno}</strong>, pero el paciente ha sido identificado con el financiador vigente <strong>{discrepanciaModalState?.financiadorPaciente}</strong>.
          </p>
          <p style={{ marginTop: "1rem" }}>¿Desea aceptar la modificacion del financiador al admitir al paciente?</p>

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setTurnoDiscrepancia(null)}>
              Rechazar y corregir
            </button>
            <button type="button" onClick={() => void onAceptarDiscrepanciaFinanciador()}>
              Aceptar cambio
            </button>
          </div>
        </div>
      </div> : null}

      {financiadorModalOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={financiadorEditandoId ? "Editar financiador" : "Agregar nuevo financiador"}>
        <div className="confirm-modal admision-financiador-modal">
          <h3>{financiadorEditandoId ? "Editar financiador" : "Agregar financiador"}</h3>

          <label>
            Financiador
            <select value={financiadorFormId} onChange={event => setFinanciadorFormId(event.target.value)}>
              <option value="">Seleccione un financiador...</option>
              {catalogoFinanciadores.map(fin => <option key={fin.id} value={fin.id}>{fin.nombre}</option>)}
            </select>
          </label>

          <label>
            Plan
            <select value={planFormId} onChange={event => setPlanFormId(event.target.value)} disabled={!financiadorFormId}>
              <option value="">Seleccione un plan...</option>
              {planesDisponiblesForm.map(plan => <option key={plan.id} value={plan.id}>{plan.nombre}</option>)}
            </select>
          </label>

          <label>
            Numero de afiliado / Credencial
            <input type="text" value={numeroAfiliadoForm} onChange={event => setNumeroAfiliadoForm(event.target.value)} placeholder="Ej: 12345678901" />
          </label>

          {financiadorModalError ? <p className="admision-error">{financiadorModalError}</p> : null}

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={onCerrarModalFinanciador}>
              Cancelar
            </button>
            {financiadorEditando && <button type="button" className="btn-outline" onClick={() => onFinalizarVigencia(financiadorEditando)}>
                Finalizar vigencia
              </button>}
            <button type="button" onClick={onGuardarFinanciador}>
              Guardar financiador
            </button>
          </div>
        </div>
      </div> : null}

      {modalDemandaOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmar demanda espontanea">
        <div className="confirm-modal admision-demanda-modal">
          <h3>Demanda Espontanea</h3>
          <p>Se iniciara una admision espontanea para <strong>{pacienteSeleccionado?.apellidosNombres ?? "paciente"}</strong>.</p>

          {pasoModalDemanda === 1 ? <>
              <label>
                Servicio
                <select value={servicioDemandaId} onChange={event => setServicioDemandaId(event.target.value)}>
                  <option value="">Seleccione servicio...</option>
                  {selectores.servicios.map(servicio => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
                </select>
              </label>

              <label>
                Practica
                <select value={practicaDemandaId} onChange={event => setPracticaDemandaId(event.target.value)} disabled={!servicioDemandaId}>
                  <option value="">Seleccione practica...</option>
                  {practicasDemandaDisponibles.map(practica => <option key={practica.id} value={practica.id}>{practica.nombre}</option>)}
                </select>
              </label>

              <label>
                Agenda disponible
                <select value={agendaDemandaId} onChange={event => setAgendaDemandaId(event.target.value)} disabled={!servicioDemandaId}>
                  <option value="">Seleccione agenda...</option>
                  {agendasDemandaFiltradas.map(agenda => <option key={agenda.id} value={agenda.id}>{agenda.servicio} - {agenda.efector} ({agenda.tipoAgenda})</option>)}
                </select>
              </label>

              <div className="confirm-actions">
                <button type="button" className="btn-outline" onClick={() => setModalDemandaOpen(false)}>
                  Cancelar
                </button>
                <button type="button" onClick={() => setPasoModalDemanda(2)} disabled={!agendaDemandaId || !practicaDemandaId}>
                  Continuar
                </button>
              </div>
            </> : <>
              <p>Si la agenda es programada, seleccione turno oferta; para agenda espontanea puede continuar sin seleccionar.</p>
              <label>
                Turno oferta
                <select value={turnoOfertaId} onChange={event => setTurnoOfertaId(event.target.value)}>
                  <option value="">No seleccionar (agenda espontanea)</option>
                  {turnosOfertaDemanda.map(turno => <option key={turno.id} value={turno.id}>{turno.turno} - {turno.paciente}</option>)}
                </select>
              </label>

              <div className="confirm-actions">
                <button type="button" className="btn-outline" onClick={() => setPasoModalDemanda(1)}>
                  Atras
                </button>
                <button type="button" onClick={() => void onConfirmarDemandaEspontanea()} disabled={!puedeConfirmarDemanda || isConfirmandoDemanda}>
                  {isConfirmandoDemanda ? "Confirmando..." : "Admitir paciente"}
                </button>
              </div>
            </>}
        </div>
      </div> : null}

      {modalPracticasOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Agregar practicas al turno">
        <div className="confirm-modal admision-practicas-modal">
          <h3>Agregar practicas a turno</h3>
          <p>Seleccione una o mas practicas disponibles del bloque.</p>

          {practicasDisponiblesModal.length === 0 ? <p>No hay practicas adicionales disponibles.</p> : <div className="admision-candidatos-list">
              {practicasDisponiblesModal.map(practica => {
            const checked = practicasSeleccionadasModal.some(item => item === practica);
            return <label key={practica} className="checkbox-row">
                    <input type="checkbox" checked={checked} onChange={event => setPracticasSeleccionadasModal(prev => event.target.checked ? [...prev, practica] : prev.filter(item => item !== practica))} />
                    {practica}
                  </label>;
          })}
            </div>}

          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setModalPracticasOpen(false)}>
              Cancelar
            </button>
            <button type="button" onClick={() => void onConfirmarAgregarPracticas()} disabled={loadingPracticasModal || practicasSeleccionadasModal.length === 0}>
              {loadingPracticasModal ? "Guardando..." : "Agregar practicas"}
            </button>
          </div>
        </div>
      </div> : null}

      {modalEliminarPracticaOpen && practicaAEliminar ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Eliminar practica">
        <div className="confirm-modal">
          <h3>Eliminar practica</h3>
          <p>¿Esta seguro que desea quitar la practica <strong>{practicaAEliminar}</strong> del turno actual?</p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={() => setPracticaAEliminar(null)}>
              Cancelar
            </button>
            <button type="button" onClick={() => void onConfirmarEliminarPractica()}>
              Confirmar eliminacion
            </button>
          </div>
        </div>
      </div> : null}
    </>
  );
}
