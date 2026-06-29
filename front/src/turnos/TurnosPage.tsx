import { FormEvent } from "react";
import '../css/turnos.css';
import { useNavigate } from "react-router-dom";
import { useUnsavedChanges } from "../navigation/UnsavedChangesContext";
import { useTurnosController } from "./useTurnosController";
import { TurnosIdentificacion, TurnosProximosPaciente, TurnosBusqueda, TurnosResultados, TurnosModales } from "./components/TurnosComponents";

export function TurnosPage() {
  const navigate = useNavigate();
  const state = useTurnosController();
  const { markUnsavedChanges, clearUnsavedChanges } = useUnsavedChanges();

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

  const wrappedState = {
    ...state,
    onCancelarAsignacion: () => {
      state.onCancelarAsignacion();
      clearUnsavedChanges();
    },
    onCerrarModalSobreturno: () => {
      state.onCerrarModalSobreturno();
      clearUnsavedChanges();
    },
    onCerrarModalFinanciador: () => {
      state.onCerrarModalFinanciador();
      clearUnsavedChanges();
    },
    onConfirmarSobreturno: async () => {
      const wasSaved = await state.onConfirmarSobreturno();
      if (wasSaved) {
        clearUnsavedChanges();
      }
      return wasSaved;
    },
    onConfirmarAsignacion: async () => {
      const wasSaved = await state.onConfirmarAsignacion();
      if (wasSaved) {
        clearUnsavedChanges();
      }
      return wasSaved;
    },
    onGuardarFinanciador: async () => {
      await state.onGuardarFinanciador();
      clearUnsavedChanges();
    },
  };

  return (
    <section className="turnos-page" aria-label="Asignar turno" onChangeCapture={handlePotentialEdit}>
      <TurnosIdentificacion state={wrappedState} navigate={navigate} />
      <TurnosProximosPaciente state={wrappedState} />
      <TurnosBusqueda state={wrappedState} />
      <TurnosResultados state={wrappedState} />
      <TurnosModales state={wrappedState} />
      
    </section>
  );
}
