import { useState } from "react";
import { buscarPersonaPorDocumento, buscarPersonaPorSetMinimo } from "../escritorioClinicoApi";
import type { PersonaCandidataBusqueda } from "../escritorioClinicoTypes";
import { DEFAULT_DOCUMENT_TYPE, VALOR_GUION } from "../escritorioClinicoTypes";
import { normalizeText } from "../escritorioClinicoTypes";
import type { TurnoAdmision } from "../../admision/admisionTypes";

export type BuscarPacienteActions = {
  abrirBuscarPaciente: () => void;
  handleBuscarPacientePorDocumento: () => Promise<void>;
  handleBuscarPacientePorSetMinimo: () => Promise<void>;
  handleSeleccionarPacienteFueraAgenda: (paciente: PersonaCandidataBusqueda) => void;
  handleVolverBuscarPaciente: () => void;
  cerrarBuscarPaciente: () => void;
};

export function useBuscarPaciente(agendaTurnos: TurnoAdmision[], onPacienteSeleccionadoEnAgenda: (turnoId: string) => void, onPacienteNoEnAgenda: (nombre: string) => void) {
  const [showBuscarPacienteModal, setShowBuscarPacienteModal] = useState(false);
  const [buscarPacienteTipoDoc, setBuscarPacienteTipoDoc] = useState("");
  const [buscarPacienteNumDoc, setBuscarPacienteNumDoc] = useState("");
  const [buscarPacienteCandidatos, setBuscarPacienteCandidatos] = useState<PersonaCandidataBusqueda[]>([]);
  const [buscarPacienteSeleccionado, setBuscarPacienteSeleccionado] = useState<PersonaCandidataBusqueda | null>(null);
  const [buscarPacienteError, setBuscarPacienteError] = useState<string | null>(null);
  const [buscarPacienteLoading, setBuscarPacienteLoading] = useState(false);
  const [showSetMinimoSearch, setShowSetMinimoSearch] = useState(false);
  const [buscarPacienteNombre, setBuscarPacienteNombre] = useState("");
  const [buscarPacienteApellido, setBuscarPacienteApellido] = useState("");
  const [buscarPacienteFechaNacimiento, setBuscarPacienteFechaNacimiento] = useState("");
  const [buscarPacienteSexoBiologico, setBuscarPacienteSexoBiologico] = useState("");
  const [buscarPacienteSetMinimoLoading, setBuscarPacienteSetMinimoLoading] = useState(false);

  function abrirBuscarPaciente() {
    setBuscarPacienteTipoDoc(DEFAULT_DOCUMENT_TYPE);
    setBuscarPacienteNumDoc("");
    setBuscarPacienteCandidatos([]);
    setBuscarPacienteSeleccionado(null);
    setBuscarPacienteError(null);
    setShowSetMinimoSearch(false);
    setBuscarPacienteNombre("");
    setBuscarPacienteApellido("");
    setBuscarPacienteFechaNacimiento("");
    setBuscarPacienteSexoBiologico("");
    setShowBuscarPacienteModal(true);
  }

  async function handleBuscarPacientePorDocumento() {
    if (!buscarPacienteTipoDoc.trim() || !buscarPacienteNumDoc.trim()) {
      setBuscarPacienteError("Debe ingresar tipo y numero de documento.");
      return;
    }
    setBuscarPacienteLoading(true);
    setBuscarPacienteError(null);
    setBuscarPacienteCandidatos([]);
    setShowSetMinimoSearch(false);
    try {
      const candidatos = await buscarPersonaPorDocumento(buscarPacienteTipoDoc.trim(), buscarPacienteNumDoc.trim());
      setBuscarPacienteCandidatos(candidatos);
      if (candidatos.length === 0) {
        setBuscarPacienteError("No se encontraron candidatos para el criterio ingresado. Verifique los datos ingresados o use la busqueda por set minimo.");
        setShowSetMinimoSearch(true);
      }
    } catch (err) {
      setBuscarPacienteError(err instanceof Error ? err.message : "Error al buscar paciente.");
    } finally {
      setBuscarPacienteLoading(false);
    }
  }

  async function handleBuscarPacientePorSetMinimo() {
    if (!buscarPacienteNombre.trim() || !buscarPacienteApellido.trim() || !buscarPacienteFechaNacimiento.trim() || !buscarPacienteSexoBiologico.trim()) {
      setBuscarPacienteError("Debe completar todos los campos de la busqueda por set minimo (nombre, apellido, fecha de nacimiento, sexo).");
      return;
    }
    setBuscarPacienteSetMinimoLoading(true);
    setBuscarPacienteError(null);
    setBuscarPacienteCandidatos([]);
    try {
      const candidatos = await buscarPersonaPorSetMinimo(
        buscarPacienteTipoDoc.trim(),
        buscarPacienteNumDoc.trim(),
        buscarPacienteNombre.trim(),
        buscarPacienteApellido.trim(),
        buscarPacienteFechaNacimiento.trim(),
        buscarPacienteSexoBiologico.trim()
      );
      setBuscarPacienteCandidatos(candidatos);
      if (candidatos.length === 0) {
        setBuscarPacienteError("No se encontraron candidatos con los datos ingresados. Verifique la informacion o contactese con responsable de empadronamiento.");
      }
    } catch (err) {
      setBuscarPacienteError(err instanceof Error ? err.message : "Error al buscar paciente por set minimo.");
    } finally {
      setBuscarPacienteSetMinimoLoading(false);
    }
  }

  function handleSeleccionarPacienteFueraAgenda(paciente: PersonaCandidataBusqueda) {
    setBuscarPacienteSeleccionado(paciente);
    const turnoEnAgenda = agendaTurnos.find(t =>
      t.documento.replace(/[^0-9A-Z]/gi, "").toUpperCase() === paciente.numeroDocumento.replace(/[^0-9A-Z]/gi, "").toUpperCase() &&
      normalizeText(t.paciente).includes(normalizeText(paciente.apellidosNombres).substring(0, 6))
    );
    if (turnoEnAgenda) {
      setShowBuscarPacienteModal(false);
      onPacienteSeleccionadoEnAgenda(turnoEnAgenda.id);
    } else {
      onPacienteNoEnAgenda(paciente.apellidosNombres);
    }
  }

  function handleVolverBuscarPaciente() {
    setBuscarPacienteSeleccionado(null);
    setBuscarPacienteCandidatos([]);
    setBuscarPacienteError(null);
    setShowSetMinimoSearch(false);
    setBuscarPacienteFechaNacimiento("");
    setBuscarPacienteSexoBiologico("");
  }

  function cerrarBuscarPaciente() {
    setShowBuscarPacienteModal(false);
    setBuscarPacienteSeleccionado(null);
    setBuscarPacienteCandidatos([]);
    setBuscarPacienteError(null);
    setShowSetMinimoSearch(false);
    setBuscarPacienteFechaNacimiento("");
    setBuscarPacienteSexoBiologico("");
  }

  return {
    showBuscarPacienteModal,
    setShowBuscarPacienteModal,
    buscarPacienteTipoDoc,
    setBuscarPacienteTipoDoc,
    buscarPacienteNumDoc,
    setBuscarPacienteNumDoc,
    buscarPacienteCandidatos,
    buscarPacienteSeleccionado,
    buscarPacienteError,
    buscarPacienteLoading,
    showSetMinimoSearch,
    buscarPacienteNombre,
    setBuscarPacienteNombre,
    buscarPacienteApellido,
    setBuscarPacienteApellido,
    buscarPacienteFechaNacimiento,
    setBuscarPacienteFechaNacimiento,
    buscarPacienteSexoBiologico,
    setBuscarPacienteSexoBiologico,
    buscarPacienteSetMinimoLoading,
    abrirBuscarPaciente,
    handleBuscarPacientePorDocumento,
    handleBuscarPacientePorSetMinimo,
    handleSeleccionarPacienteFueraAgenda,
    handleVolverBuscarPaciente,
    cerrarBuscarPaciente,
  };
}
