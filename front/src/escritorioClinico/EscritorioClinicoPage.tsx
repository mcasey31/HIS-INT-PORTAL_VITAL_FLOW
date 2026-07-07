import '../css/escritorio-clinico.css';
import { AsignarProblemaModal, BuscarPacienteModal, EscritorioClinicoHeader, EscritorioClinicoFiltros, EscritorioClinicoListado, EscritorioClinicoPanoramica } from "./components/EscritorioClinicoComponents";
import { EscritorioClinicoModales } from "./components/EscritorioClinicoModales";
import { useEscritorioClinicoController } from "./useEscritorioClinicoController";
import { useEffect } from "react";
import { useUnsavedChanges } from "../navigation/UnsavedChangesContext";
import { useNavigate } from "react-router-dom";
import type { EscritorioClinicoPageProps } from "./escritorioClinicoTypes";

export function EscritorioClinicoPage({ onCancelSeleccionServicio }: EscritorioClinicoPageProps) {
  const navigate = useNavigate();
  const state = useEscritorioClinicoController({
    onCancelSeleccionServicio: () => {
      if (onCancelSeleccionServicio) {
        onCancelSeleccionServicio();
        return;
      }
      navigate("/");
    }
  });
  const { markUnsavedChanges, clearUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    const hasDraftEvolucion = state.showAgregarEvolucionModal && (
      state.evolucionTextoDraft.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, "").trim().length > 0
      || state.evolucionProblemasTextoDraft.trim().length > 0
    );

    const hasDraftSolicitud = state.showSolicitarEstudiosModal && (
      state.searchQueryPracticasIzquierda.trim().length > 0
      || state.searchQueryPracticasDerecha.trim().length > 0
      || state.selectedPracticasIzquierda.length > 0
      || state.selectedPracticasDerecha.length > 0
      || state.totalEstudiosSolicitados > 0
    );

    const hasDraftObservacion = Boolean(state.observacionPracticaModalData)
      && state.observacionPracticaText.trim().length > 0;

    if (hasDraftEvolucion || hasDraftSolicitud || hasDraftObservacion) {
      markUnsavedChanges();
      return;
    }

    clearUnsavedChanges();
  }, [
    clearUnsavedChanges,
    markUnsavedChanges,
    state.observacionPracticaModalData,
    state.observacionPracticaText,
    state.evolucionProblemasTextoDraft,
    state.evolucionTextoDraft,
    state.searchQueryPracticasDerecha,
    state.searchQueryPracticasIzquierda,
    state.selectedPracticasDerecha,
    state.selectedPracticasIzquierda,
    state.showAgregarEvolucionModal,
    state.showSolicitarEstudiosModal,
    state.totalEstudiosSolicitados,
  ]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("vitalflow:hca-vista", {
      detail: {
        vista: state.selectedTurno ? "panoramica" : "agenda"
      }
    }));
  }, [state.selectedTurno]);
  
  return (
    <section className="hc-page" aria-label="Escritorio clinico">
      <EscritorioClinicoHeader state={state} />
      {!state.selectedTurno ? <EscritorioClinicoFiltros state={state} /> : null}
      
      {state.error ? <p className="hc-error">{state.error}</p> : null}
      {state.agendaMensaje ? <p className="hc-toast-success" role="status" aria-live="polite">{state.agendaMensaje}</p> : null}
      {state.solicitudToast ? <p className="hc-toast-success" role="status" aria-live="polite">{state.solicitudToast}</p> : null}

      <nav className="hc-breadcrumb" aria-label="Navegacion historia clinica">
        <span className="hc-breadcrumb-item">Historia Clinica</span>
        <span className="hc-breadcrumb-sep">&gt;&gt;</span>
        {!state.selectedTurno ? <span className="hc-breadcrumb-item">Agenda Asistencial</span> : state.origenPanoramica === "historia" ? <button type="button" className="hc-breadcrumb-step" onClick={() => state.setSelectedTurnoId(null)}>
            Agenda Asistencial
          </button> : <span className="hc-breadcrumb-item hc-breadcrumb-item-locked" title="Si ingreso por Megafono, debe salir desde el flujo de Salir.">
            Agenda Asistencial
          </span>}
        {state.selectedTurno ? <>
            <span className="hc-breadcrumb-sep">&gt;&gt;</span>
            <span className="hc-breadcrumb-item hc-breadcrumb-item-current">Panoramica</span>
          </> : null}
      </nav>

      <div className={`hc-layout ${state.selectedTurno ? "hc-layout-panoramica" : "hc-layout-listado"}`}>
        {state.selectedTurno ? <EscritorioClinicoPanoramica state={state} /> : <EscritorioClinicoListado state={state} />}
      </div>

      <EscritorioClinicoModales state={state} />
      <BuscarPacienteModal state={state} />
      <AsignarProblemaModal state={state} />
    </section>
  );
}
