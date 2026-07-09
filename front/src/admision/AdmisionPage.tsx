import '../css/admision.css';
import { AdmisionIdentificacionPaciente, AdmisionCabeceraPaciente, AdmisionFiltros, AdmisionAccionesTurno, AdmisionListado } from "./components/AdmisionComponents";
import { AdmisionModales } from "./components/AdmisionModales";
import { usePageShell } from "../navigation/PageShellContext";
import { useAdmisionController } from "./useAdmisionController";

export function AdmisionPage() {
  usePageShell({
    title: "Admision",
    breadcrumbItems: [{ label: "Admision", path: "/admision" }, { label: "Landing" }],
  });

  const state = useAdmisionController();

  return (
    <section className="admision-page" aria-label="Modulo de Admision">
      <header className="admision-header">
        <h2>Admision</h2>
        <p>Landing operativa inicial para admision programada con filtros y accion de arribo.</p>
      </header>

      {!state.pacienteSeleccionado ?
        <AdmisionIdentificacionPaciente state={state} />
      :
        <AdmisionCabeceraPaciente state={state} />
      }

      <AdmisionFiltros state={state} />
      <AdmisionAccionesTurno state={state} />

      {state.error ? <p className="admision-error">{state.error}</p> : null}
      {state.info ? <p className="admision-info">{state.info}</p> : null}

      <AdmisionListado state={state} />
      <AdmisionModales state={state} />
    </section>
  );
}
