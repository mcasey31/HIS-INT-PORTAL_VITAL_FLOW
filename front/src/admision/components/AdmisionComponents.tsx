import { useEffect, useRef, useState } from "react";
import { useAdmisionController } from "../useAdmisionController";
type useAdmisionState = ReturnType<typeof useAdmisionController>;
import { isPrivadoFinanciador, estadoAdmisionLabel } from "../admisionTypes";
import type { TurnoAdmision } from "../admisionTypes";
import { buscarPersonaPorDocumento } from "../../escritorioClinico/escritorioClinicoApi";
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
    setTurnoSeleccionadoId, fechaEsHoy, onLlamarPaciente, llamandoId
  } = state;

  const [recetaModalOpen, setRecetaModalOpen] = useState(false);
  const [recetaModalPaciente, setRecetaModalPaciente] = useState("");
  const [recetaModalDocumento, setRecetaModalDocumento] = useState("");
  const [recetaModalList, setRecetaModalList] = useState<RecetaDigitalResumenResponse[]>([]);
  const [recetaModalDetalles, setRecetaModalDetalles] = useState<Record<string, RecetaDigitalDetalleResponse>>({});
  const [recetaModalLoading, setRecetaModalLoading] = useState(false);
  const [recetaModalError, setRecetaModalError] = useState<string | null>(null);

  const [recetasStatus, setRecetasStatus] = useState<Record<string, boolean>>({});
  const recetasStatusRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    const pendings = turnosVisibles
      .filter(item => (item.pacienteId || (item.documento && item.documento !== "-")) && recetasStatusRef.current[item.id] === undefined)
      .slice(0, 30);
    if (pendings.length === 0) return;
    void (async () => {
      const statusMap = { ...recetasStatusRef.current };
      for (const item of pendings) {
        if (!active) return;
        try {
          let pid = item.pacienteId;
          if (!pid) {
            const numDoc = item.documento.replace(/[^0-9]/g, "");
            if (!numDoc) continue;
            const candidatos = await buscarPersonaPorDocumento("DNI", numDoc);
            if (candidatos.length === 0) { statusMap[item.id] = false; continue; }
            pid = candidatos[0].id;
          }
          const recetas = await listarRecetasPaciente(pid);
          if (!active) return;
          statusMap[item.id] = recetas.some(r => r.estado === "ACTIVA");
        } catch {
          statusMap[item.id] = false;
        }
      }
      if (!active) return;
      recetasStatusRef.current = statusMap;
      setRecetasStatus({ ...statusMap });
    })();
    return () => { active = false; };
  }, [turnosVisibles]);

  async function handleVerRecetas(item: TurnoAdmision) {
    setRecetaModalOpen(true);
    setRecetaModalPaciente(item.paciente);
    setRecetaModalDocumento(item.documento);
    setRecetaModalList([]);
    setRecetaModalDetalles({});
    setRecetaModalError(null);
    setRecetaModalLoading(true);
    try {
      let pid = item.pacienteId;
      if (!pid) {
        const numDoc = item.documento.replace(/[^0-9]/g, "");
        if (!numDoc) { setRecetaModalError("Paciente sin documento."); setRecetaModalLoading(false); return; }
        const candidatos = await buscarPersonaPorDocumento("DNI", numDoc);
        if (candidatos.length === 0) { setRecetaModalError("No se encontró el paciente."); setRecetaModalLoading(false); return; }
        pid = candidatos[0].id;
      }
      const recetas = await listarRecetasPaciente(pid);
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
      setRecetasStatus(prev => ({ ...prev, [item.id]: activas.length > 0 }));
      recetasStatusRef.current[item.id] = activas.length > 0;
    } catch {
      setRecetaModalList([]);
      setRecetaModalError("Error al cargar recetas.");
    } finally {
      setRecetaModalLoading(false);
    }
  }

  async function imprimirRecetaAdmision(receta: RecetaDigitalResumenResponse) {
    function extractDoctorNameFromFhir(fhirBundleJson?: string): string | null {
      if (!fhirBundleJson) return null;
      try {
        const bundle = typeof fhirBundleJson === "string" ? JSON.parse(fhirBundleJson) : fhirBundleJson;
        if (bundle && bundle.entry && Array.isArray(bundle.entry)) {
          const practitionerEntry = bundle.entry.find(
            (e: any) => e.resource && e.resource.resourceType === "Practitioner"
          );
          if (practitionerEntry && practitionerEntry.resource) {
            const p = practitionerEntry.resource;
            if (p.name && Array.isArray(p.name) && p.name.length > 0) {
              const nameObj = p.name[0];
              const given = Array.isArray(nameObj.given) ? nameObj.given.join(" ") : (nameObj.given || "");
              const family = nameObj.family || "";
              const text = nameObj.text || `${given} ${family}`.trim();
              if (text) return text;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing FHIR bundle", e);
      }
      return null;
    }

    try {
      const detalle = await obtenerRecetaDigital(receta.recetaId);
      var pid = detalle.pacienteId;
      const financiador = await obtenerFinanciadorActivo(pid).catch(() => null);
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const items = detalle.items.map(item => {
        const display = item.medicamentoDisplay || "";
        let brand = display;
        let generic = "";
        const match = display.match(/\(([^)]+)\)/);
        if (match) {
          generic = match[1];
          brand = display.replace(/\s*\([^)]+\)/, "").trim();
        }
        return `
          <tr>
            <td>
              <div class="med-item">${brand}</div>
              ${generic ? `<div class="med-sub">${generic}</div>` : ""}
            </td>
            <td>${item.dosisTexto ?? "-"}</td>
            <td>${item.frecuenciaTexto ?? "-"}</td>
            <td>${item.duracionDias ? item.duracionDias + " días" : "-"}</td>
            <td>${item.indicacion ?? "-"}</td>
          </tr>
        `;
      }).join("\n");

      const matriculaTexto = detalle.prescriptorMatricula ? `MP ${detalle.prescriptorMatricula}` : "";
      const medicoLabel = detalle.prescriptorMatricula ? `Médico matrícula ${detalle.prescriptorMatricula}` : "Médico";
      const doctorNombre = extractDoctorNameFromFhir(detalle.fhirBundleJson) || medicoLabel;
      const pacienteNombre = recetaModalPaciente || "—";
      const pacienteDocumento = recetaModalDocumento || "—";
      const fechaEmision = new Date(detalle.creadoEn).toLocaleDateString("es-AR");
      const planTexto = financiador?.planNombre ? ` (Plan: ${financiador.planNombre})` : "";
      const afiliadoTexto = financiador?.numeroAfiliado ? ` - N° ${financiador.numeroAfiliado}` : "";
      const financiadorTexto = financiador?.financiadorNombre 
        ? `${financiador.financiadorNombre}${planTexto}${afiliadoTexto}` 
        : "—";

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Receta Digital - VitalFlow</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 1.5cm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 10pt;
              color: #1e293b;
              line-height: 1.5;
              margin: 0;
              padding: 0;
              background-color: #fff;
            }
            .receta-wrapper {
              max-width: 800px;
              margin: 0 auto;
              padding: 0.5cm;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5cm;
            }
            .logo-container {
              display: flex;
              align-items: center;
            }
            .logo-title {
              font-size: 20pt;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.02em;
              line-height: 1;
              display: block;
            }
            .logo-subtitle {
              font-size: 8pt;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              display: block;
              margin-top: 4px;
            }
            .header-contact {
              text-align: right;
              font-size: 8.5pt;
              color: #475569;
              line-height: 1.4;
            }
            .header-contact p {
              margin: 0;
            }
            .header-separator {
              height: 3px;
              background: linear-gradient(90deg, #0284c7 0%, #0d9488 100%);
              margin: 0.6cm 0;
              border-radius: 2px;
            }
            .patient-card {
              border: 1px solid #e2e8f0;
              border-left: 4px solid #0284c7;
              border-radius: 8px;
              padding: 0.4cm 0.5cm;
              background-color: #f8fafc;
              margin-bottom: 0.8cm;
            }
            .patient-card-header {
              font-size: 8.5pt;
              font-weight: 700;
              color: #0369a1;
              letter-spacing: 0.08em;
              margin-bottom: 0.25cm;
            }
            .patient-grid {
              display: flex;
              justify-content: space-between;
            }
            .grid-col {
              width: 48%;
            }
            .grid-col p {
              margin: 0.15cm 0;
              font-size: 9.5pt;
              color: #334155;
            }
            .grid-col strong {
              color: #1e293b;
              font-weight: 600;
            }
            .prescripcion-header {
              font-size: 12pt;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 0.3cm;
              letter-spacing: -0.01em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 0.2cm;
              margin-bottom: 0.8cm;
            }
            th {
              background-color: #f0f9ff;
              padding: 10px 14px;
              border-bottom: 2px solid #bae6fd;
              text-align: left;
              font-size: 9pt;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #0369a1;
              font-weight: 700;
            }
            td {
              padding: 14px;
              border-bottom: 1px solid #f1f5f9;
              vertical-align: top;
              font-size: 9.5pt;
              color: #334155;
              line-height: 1.5;
            }
            tr:last-child td {
              border-bottom: none;
            }
            .med-item {
              font-weight: 700;
              font-size: 10.5pt;
              color: #0f172a;
            }
            .med-sub {
              font-size: 8.5pt;
              color: #64748b;
              margin-top: 2px;
              font-weight: 400;
            }
            .header-icon {
              width: 14px;
              height: 14px;
              display: inline-block;
              vertical-align: text-bottom;
              margin-right: 6px;
              color: #0284c7;
            }
            .footer-validation-stamp {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 1.5cm;
              padding-top: 0.6cm;
              border-top: 1px dashed #cbd5e1;
            }
            .validation-box {
              display: flex;
              align-items: center;
              width: 60%;
            }
            .qr-code {
              width: 95px;
              height: 95px;
              border: 1px solid #e2e8f0;
              padding: 4px;
              border-radius: 4px;
              margin-right: 16px;
              background: #fff;
            }
            .validation-text {
              font-size: 8pt;
              color: #64748b;
              line-height: 1.4;
            }
            .validation-text p {
              margin: 2px 0;
            }
            .val-title {
              font-weight: 700;
              color: #0f172a;
              font-size: 8.5pt;
            }
            .val-normativa {
              font-style: italic;
              margin-top: 4px !important;
            }
            .stamp-box {
              text-align: center;
              width: 35%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .signature-line {
              width: 180px;
              border-top: 1px solid #475569;
              margin-bottom: 8px;
            }
            .doc-name {
              font-weight: 700;
              font-size: 10.5pt;
              color: #0f172a;
              margin: 0;
            }
            .doc-lic {
              font-size: 8.5pt;
              color: #475569;
              margin: 2px 0 0 0;
            }
            .legal-note {
              text-align: center;
              font-size: 7.5pt;
              color: #94a3b8;
              margin-top: 1cm;
              border-top: 1px solid #f1f5f9;
              padding-top: 0.3cm;
            }
            @media print {
              body {
                background-color: #fff;
              }
              .receta-wrapper {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receta-wrapper">
            <div class="header">
              <div class="logo-container">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#0284c7"/>
                  <path d="M12 6v8M8 10h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <div>
                  <span class="logo-title">VitalFlow</span>
                  <span class="logo-subtitle">Centro Médico</span>
                </div>
              </div>
              <div class="header-contact">
                <p>Av. Corrientes 1234, CABA</p>
                <p>Tel: 0810-555-FLOW (3569)</p>
                <p>contacto@vitalflow.com | www.vitalflow.com</p>
              </div>
            </div>
            
            <div class="header-separator"></div>
            
            <div class="patient-card">
              <div class="patient-card-header">DATOS DEL PACIENTE</div>
              <div class="patient-grid">
                <div class="grid-col">
                  <p><strong>Paciente:</strong> ${pacienteNombre}</p>
                  <p><strong>Documento:</strong> ${pacienteDocumento}</p>
                </div>
                <div class="grid-col">
                  <p><strong>Cobertura:</strong> ${financiadorTexto}</p>
                  <p><strong>Fecha de Emisión:</strong> ${fechaEmision}</p>
                </div>
              </div>
            </div>
            
            <div class="prescripcion-header">PRESCRIPCIÓN MÉDICA</div>
            <table>
              <thead>
                <tr>
                  <th style="width:38%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>Medicamento
                  </th>
                  <th style="width:14%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>Dosis
                  </th>
                  <th style="width:16%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Frecuencia
                  </th>
                  <th style="width:12%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>Duración
                  </th>
                  <th style="width:20%">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>Indicación
                  </th>
                </tr>
              </thead>
              <tbody>
                ${items}
              </tbody>
            </table>
            
            <div class="footer-validation-stamp">
              <div class="validation-box">
                <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=95&data=${encodeURIComponent('https://his.vitalflow.com/receta/' + detalle.recetaId)}" alt="QR" />
                <div class="validation-text">
                  <p class="val-title">Receta Digital Certificada</p>
                  <p>Escanear para comprobar la autenticidad del documento en la base de datos de VitalFlow.</p>
                  <p class="val-normativa">Documento digital válido según normativas vigentes.</p>
                </div>
              </div>
              
              <div class="stamp-box">
                <div class="signature-line"></div>
                <p class="doc-name">${doctorNombre}</p>
                <p class="doc-lic">${matriculaTexto}</p>
              </div>
            </div>
            
            <div class="legal-note">
              Esta receta es válida por 30 días a partir de su fecha de emisión.
            </div>
          </div>
        </body>
        </html>
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
                <th>[Llamar]</th>
              </tr>
            </thead>
            <tbody>
              {turnosVisibles.map(item => {
                const hasRecetas = recetasStatus[item.id];
                const iconColor = hasRecetas === true ? "#4caf50" : "#b0bec5";
                return <tr key={item.id} className={`${turnoSeleccionadoId === item.id ? "is-selected" : ""} ${estadoRowClass(item.estado)}`.trim()}>
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
                    <button type="button" className="btn-icon-receta" onClick={() => void handleVerRecetas(item)} disabled={!item.documento || item.documento === "-"} title={hasRecetas ? "Tiene recetas activas" : "Sin recetas activas"} style={{ color: iconColor }}>
                      💊
                    </button>
                  </td>
                  <td>
                    <button type="button"
                      className="btn-llamar"
                      onClick={() => void onLlamarPaciente(item.id)}
                      disabled={llamandoId === item.id || item.estado !== "EN_SALA_DE_ESPERA"}
                      title="Llamar paciente a consulta"
                    >
                      {llamandoId === item.id ? "..." : "📣"}
                    </button>
                  </td>
                </tr>;
              })}
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
            {recetaModalLoading ? <p>Cargando recetas...</p> : recetaModalError ? <p style={{ color: "#c62828" }}>{recetaModalError}</p> : recetaModalList.length === 0 ? <p>Sin recetas para este paciente.</p> : <>
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
