import { useEffect, useRef, useState } from "react";
import { anularRecetaDigital, buscarMedicamentos, crearPrescripcion, listarRecetasPaciente, obtenerFinanciadorActivo, obtenerRecetaDigital } from "../escritorioClinicoApi";
import type { MedicamentoResponse, RecetaDigitalDetalleResponse, RecetaDigitalResumenResponse } from "../escritorioClinicoTypes";
import { ESTADO_ACTIVA, VALOR_GUION } from "../escritorioClinicoTypes";
import type { TurnoAdmision } from "../../admision/admisionTypes";

export function usePrescripcion(
  selectedTurno: TurnoAdmision | null,
  profesionalActual: string,
  encuentroPacienteId: string | null,
  setEncuentroPacienteId: (id: string | null) => void,
  prescripcionModuleRecetas: RecetaDigitalResumenResponse[],
  setPrescripcionModuleRecetas: (v: RecetaDigitalResumenResponse[]) => void,
  recetasDetalle: Record<string, RecetaDigitalDetalleResponse>,
  setRecetasDetalle: (v: Record<string, RecetaDigitalDetalleResponse>) => void,
  buscarPersonaPorDocumento: (tipoDoc: string, numDoc: string) => Promise<{ id: string }[]>,
  DEFAULT_DOCUMENT_TYPE: string,
  setError: (msg: string | null) => void,
) {
  const [showPrescripcionModule, setShowPrescripcionModule] = useState(false);
  const [prescripcionModuleLoading, setPrescripcionModuleLoading] = useState(false);
  const [prescripcionModuleError, setPrescripcionModuleError] = useState<string | null>(null);
  const [prescripcionModuleAnulando, setPrescripcionModuleAnulando] = useState<string | null>(null);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [medicamentoSearchQuery, setMedicamentoSearchQuery] = useState("");
  const [medicamentoSoloGenerico, setMedicamentoSoloGenerico] = useState(false);
  const [medicamentoResultados, setMedicamentoResultados] = useState<MedicamentoResponse[]>([]);
  const [medicamentoLoading, setMedicamentoLoading] = useState(false);
  const [medicamentoTotalCount, setMedicamentoTotalCount] = useState(0);
  const [medicamentoPagina, setMedicamentoPagina] = useState(1);
  const [medicamentoError, setMedicamentoError] = useState<string | null>(null);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<MedicamentoResponse | null>(null);
  const [showPrescripcionFormModal, setShowPrescripcionFormModal] = useState(false);
  const [prescripcionDosis, setPrescripcionDosis] = useState("");
  const [prescripcionFrecuencia, setPrescripcionFrecuencia] = useState("");
  const [prescripcionDuracion, setPrescripcionDuracion] = useState("");
  const [prescripcionIndicacion, setPrescripcionIndicacion] = useState("");
  const [prescripcionVia, setPrescripcionVia] = useState("Oral");
  const [prescripcionGuardando, setPrescripcionGuardando] = useState(false);
  const [prescripcionFormError, setPrescripcionFormError] = useState<string | null>(null);
  const [prescripcionExitosa, setPrescripcionExitosa] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailModalPacienteId, setEmailModalPacienteId] = useState("");
  const [emailModalRecetaIds, setEmailModalRecetaIds] = useState<string[]>([]);
  const medicamentoSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (medicamentoSearchTimer.current) clearTimeout(medicamentoSearchTimer.current);
    if (!showMedicamentoModal || !medicamentoSearchQuery.trim()) {
      setMedicamentoResultados([]);
      setMedicamentoTotalCount(0);
      return;
    }
    medicamentoSearchTimer.current = setTimeout(() => {
      setMedicamentoPagina(1);
      void ejecutarBusquedaMedicamento(medicamentoSearchQuery, 1);
    }, 400);
    return () => { if (medicamentoSearchTimer.current) clearTimeout(medicamentoSearchTimer.current); };
  }, [medicamentoSearchQuery, showMedicamentoModal, medicamentoSoloGenerico]);

  async function ejecutarBusquedaMedicamento(query: string, page = 1) {
    if (!query.trim()) {
      setMedicamentoResultados([]);
      setMedicamentoTotalCount(0);
      return;
    }
    setMedicamentoLoading(true);
    setMedicamentoError(null);
    try {
      const result = await buscarMedicamentos(query.trim(), undefined, undefined, medicamentoSoloGenerico, page, 20);
      setMedicamentoResultados(result.items);
      setMedicamentoTotalCount(result.totalCount);
      setMedicamentoPagina(page);
    } catch {
      setMedicamentoError("Error al buscar medicamentos.");
      setMedicamentoResultados([]);
    } finally {
      setMedicamentoLoading(false);
    }
  }

  async function resolvePacienteId(): Promise<string | null> {
    if (!selectedTurno) return null;
    let pid = encuentroPacienteId ?? selectedTurno.pacienteId ?? null;
    if (!pid && selectedTurno.documento && selectedTurno.documento !== VALOR_GUION) {
      try {
        const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) pid = candidatos[0].id;
      } catch {}
    }
    return pid;
  }

  function abrirRecetaDigital() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente."); return; }
    setError(null);
    setShowPrescripcionModule(true);
    setPrescripcionModuleError(null);
    setPrescripcionModuleRecetas([]);
    setPrescripcionModuleLoading(true);
    void cargarRecetasPaciente();
  }

  function abrirBuscarMedicamento() {
    if (!selectedTurno) { setError("Debe seleccionar un paciente."); return; }
    setError(null);
    setMedicamentoSearchQuery("");
    setMedicamentoResultados([]);
    setMedicamentoTotalCount(0);
    setMedicamentoPagina(1);
    setMedicamentoError(null);
    setMedicamentoSeleccionado(null);
    setShowPrescripcionModule(false);
    setShowMedicamentoModal(true);
  }

  function seleccionarMedicamento(medicamento: MedicamentoResponse) {
    setMedicamentoSeleccionado(medicamento);
    setShowMedicamentoModal(false);
    setPrescripcionDosis("");
    setPrescripcionFrecuencia("");
    setPrescripcionDuracion("");
    setPrescripcionIndicacion("");
    setPrescripcionVia("Oral");
    setPrescripcionFormError(null);
    setPrescripcionExitosa(false);
    setShowPrescripcionFormModal(true);
  }

  async function guardarPrescripcion() {
    if (!selectedTurno || !medicamentoSeleccionado) return;
    setPrescripcionGuardando(true);
    setPrescripcionFormError(null);
    try {
      const pid = await resolvePacienteId();
      if (!pid) { setPrescripcionFormError("No se pudo identificar el paciente."); setPrescripcionGuardando(false); return; }
      if (!encuentroPacienteId) setEncuentroPacienteId(pid);

      const fullIndicacion = prescripcionVia
        ? `${prescripcionVia}. ${prescripcionIndicacion || ""}`.trim()
        : prescripcionIndicacion;

      await crearPrescripcion({
        pacienteId: pid,
        turnoId: selectedTurno.id,
        medicamentoId: medicamentoSeleccionado.id,
        medicamentoDisplay: `${medicamentoSeleccionado.producto} ${medicamentoSeleccionado.presentacion} — ${medicamentoSeleccionado.principioActivo} — ${medicamentoSeleccionado.laboratorio}`,
        dosisTexto: prescripcionDosis || undefined,
        frecuenciaTexto: prescripcionFrecuencia || undefined,
        duracionDias: prescripcionDuracion ? parseInt(prescripcionDuracion, 10) : undefined,
        indicacion: fullIndicacion || undefined,
      });
      setShowPrescripcionFormModal(false);
      setShowPrescripcionModule(true);
      setPrescripcionModuleLoading(true);
      void cargarRecetasPaciente(pid);
    } catch (err) {
      setPrescripcionFormError(err instanceof Error ? err.message : "Error al guardar la prescripcion.");
    } finally {
      setPrescripcionGuardando(false);
    }
  }

  async function cargarRecetasPaciente(pidOverride?: string) {
    if (!selectedTurno) return;
    let pid = pidOverride ?? await resolvePacienteId();
    if (!pid) { setPrescripcionModuleLoading(false); return; }
    try {
      const recetas = await listarRecetasPaciente(pid);
      setPrescripcionModuleRecetas(recetas);
      const activas = recetas.filter(r => r.estado === ESTADO_ACTIVA);
      if (activas.length > 0) {
        const detalles: Record<string, RecetaDigitalDetalleResponse> = {};
        const results = await Promise.allSettled(activas.map(r => obtenerRecetaDigital(r.recetaId)));
        for (const result of results) {
          if (result.status === "fulfilled") {
            detalles[result.value.recetaId] = result.value;
          }
        }
        if (Object.keys(detalles).length > 0) setRecetasDetalle(detalles);
      }
    } catch {
      setPrescripcionModuleError("Error al cargar prescripciones.");
    } finally {
      setPrescripcionModuleLoading(false);
    }
  }

  async function handleAnularReceta(recetaId: string) {
    setPrescripcionModuleAnulando(recetaId);
    try {
      await anularRecetaDigital(recetaId, "Anulado por medico");
      void cargarRecetasPaciente();
    } catch {
      setPrescripcionModuleError("Error al anular la prescripcion.");
    } finally {
      setPrescripcionModuleAnulando(null);
    }
  }

  function imprimirReceta(receta: RecetaDigitalResumenResponse) {
    Promise.all([
      obtenerRecetaDigital(receta.recetaId),
      (async () => {
        const pid = await resolvePacienteId();
        if (!pid) return null;
        return obtenerFinanciadorActivo(pid).catch(() => null);
      })()
    ]).then(([detalle, financiador]) => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      const items = detalle.items.map(item => `
        <tr>
          <td class="med-item">${item.medicamentoDisplay}</td>
          <td>${item.dosisTexto ?? VALOR_GUION}</td>
          <td>${item.frecuenciaTexto ?? VALOR_GUION}</td>
          <td>${item.duracionDias ? item.duracionDias + " días" : VALOR_GUION}</td>
          <td>${item.indicacion ?? VALOR_GUION}</td>
        </tr>
      `).join("\n");
      const matriculaTexto = detalle.prescriptorMatricula ? `MP ${detalle.prescriptorMatricula}` : "";
      const financiadorTexto = financiador?.financiadorNombre ? `${financiador.financiadorNombre}${financiador.numeroAfiliado ? " - N° " + financiador.numeroAfiliado : ""}` : (selectedTurno?.financiador ?? "—");
      printWindow.document.write(`
        <html><head><meta charset="utf-8">
        <title>Prescripción Médica</title>
        <style>
          @page { margin: 2cm; }
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #222; line-height: 1.5; }
          h1 { font-size: 16pt; text-align: center; color: #1a3c5e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.2cm; border-bottom: 3px double #1a3c5e; padding-bottom: 0.4cm; }
          .info-grid { display: flex; flex-wrap: wrap; gap: 0.4rem 2.5rem; margin-bottom: 0.8cm; padding: 0.5cm 0.4cm; border: 1px solid #ccc; border-radius: 4px; background: #fafbfc; }
          .info-grid p { margin: 0.15rem 0; font-size: 10.5pt; }
          .info-grid strong { color: #1a3c5e; }
          table { width: 100%; border-collapse: collapse; margin-top: 0.4cm; }
          th { background: #e8edf3; padding: 0.4rem 0.5rem; border-bottom: 2px solid #8a9eb0; text-align: left; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.04em; color: #2b4b6e; }
          td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #d5dee8; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          .med-item { font-weight: 600; font-size: 11pt; color: #111; }
          .firma { margin-top: 2.5cm; text-align: center; }
          .firma hr { width: 45%; margin: 0 auto 0.3cm; border: none; border-top: 1px solid #555; }
          .firma p { margin: 0.15rem 0; color: #333; }
          .firma .medico-nombre { font-weight: 700; font-size: 12pt; }
          .firma .medico-matricula { font-size: 10pt; color: #555; }
        </style>
        </head><body>
        <h1>Receta Médica</h1>
        <div class="info-grid">
          <p><strong>Médico:</strong> ${profesionalActual} ${matriculaTexto}</p>
          <p><strong>Paciente:</strong> ${selectedTurno?.paciente ?? "—"}</p>
          <p><strong>Documento:</strong> ${selectedTurno?.documento ?? "—"}</p>
          <p><strong>Obra Social:</strong> ${financiadorTexto}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-AR")}</p>
        </div>
        <table><thead><tr>
          <th style="width:35%">Medicamento</th><th style="width:15%">Dosis</th><th style="width:18%">Frecuencia</th><th style="width:12%">Duración</th><th style="width:20%">Indicación</th>
        </tr></thead><tbody>${items}</tbody></table>
        <div class="firma">
          <hr>
          <p class="medico-nombre">${profesionalActual}</p>
          <p class="medico-matricula">${matriculaTexto || "Firma y sello del médico"}</p>
        </div>
        </body></html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }).catch(() => setPrescripcionModuleError("Error al obtener detalle de la prescripcion."));
  }

  async function handleEnviarEmail() {
    if (!selectedTurno) return;
    setEmailError(null);
    setEmailSuccess(null);

    const pid = await resolvePacienteId();
    if (!pid) { setEmailError("No se pudo identificar el paciente."); return; }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const recetasHoy = prescripcionModuleRecetas.filter(r => r.creadoEn.slice(0, 10) === todayStr);
    if (recetasHoy.length === 0) { setEmailError("No hay recetas prescriptas hoy para enviar."); return; }

    setEmailModalPacienteId(pid);
    setEmailModalRecetaIds(recetasHoy.map(r => r.recetaId));
    setShowEmailModal(true);
  }

  return {
    showPrescripcionModule, setShowPrescripcionModule,
    prescripcionModuleRecetas, recetasDetalle,
    prescripcionModuleLoading, prescripcionModuleError, prescripcionModuleAnulando,
    showMedicamentoModal, setShowMedicamentoModal,
    medicamentoSearchQuery, setMedicamentoSearchQuery, medicamentoSearchTimer,
    medicamentoResultados, medicamentoLoading, medicamentoTotalCount,
    medicamentoPagina, setMedicamentoPagina, medicamentoError,
    medicamentoSoloGenerico, setMedicamentoSoloGenerico,
    ejecutarBusquedaMedicamento, medicamentoSeleccionado, setMedicamentoSeleccionado,
    seleccionarMedicamento, showPrescripcionFormModal, setShowPrescripcionFormModal,
    prescripcionDosis, setPrescripcionDosis, prescripcionFrecuencia, setPrescripcionFrecuencia,
    prescripcionDuracion, setPrescripcionDuracion, prescripcionIndicacion, setPrescripcionIndicacion,
    prescripcionVia, setPrescripcionVia,
    prescripcionGuardando, prescripcionFormError, prescripcionExitosa, guardarPrescripcion,
    abrirRecetaDigital, abrirBuscarMedicamento,
    cargarRecetasPaciente, handleAnularReceta, imprimirReceta,
    showEmailModal, setShowEmailModal, emailError, setEmailError, emailSuccess, setEmailSuccess,
    emailModalPacienteId, emailModalRecetaIds, handleEnviarEmail,
  };
}
