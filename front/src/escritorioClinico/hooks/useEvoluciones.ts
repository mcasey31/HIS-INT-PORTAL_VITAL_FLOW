import { useEffect, useMemo, useRef, useState } from "react";
import type { TurnoAdmision } from "../../admision/admisionTypes";
import { crearEvolucionAmbulatoria, obtenerEvolucionesAmbulatoriasPaciente, obtenerProblemasCronicosPaciente } from "../escritorioClinicoApi";
import type { AsignarProblemaRequest, EvolucionAmbulatoriaResponse, EvolucionCreadaLocal, SolicitudesEstudiosPorFecha, ObservacionesPorPracticaFecha, RegistroPanoramica } from "../escritorioClinicoTypes";
import { DEFAULT_DOCUMENT_TYPE, VALOR_GUION, buildEvolucionScopeKey, buildListadoEvoluciones, buildPanoramica, extractPlainTextFromHtml, hasValidEvolucionContent, normalizeEvolucionScopeToken, normalizeProfesionalLabel, parseStoredEvolucionesLocales, sanitizeRichTextHtml, EVOLUCIONES_LOCALES_STORAGE_KEY, CONSULTA_MEDICA } from "../escritorioClinicoTypes";
import { asignarProblemaPaciente, buscarPersonaPorDocumento } from "../escritorioClinicoApi";

export function useEvoluciones(
  selectedTurno: TurnoAdmision | null,
  profesionalActual: string,
  encuentroPacienteId: string | null,
  setEncuentroPacienteId: (id: string | null) => void,
  evolucionesAmbulatorias: EvolucionAmbulatoriaResponse[],
  setEvolucionesAmbulatorias: (v: EvolucionAmbulatoriaResponse[]) => void,
  problemasCronicos: RegistroPanoramica[],
  setProblemasCronicos: (v: RegistroPanoramica[]) => void,
  solicitudesEstudiosPorTurno: Record<string, SolicitudesEstudiosPorFecha>,
  setSolicitudesEstudiosPorTurno: (updater: (prev: Record<string, SolicitudesEstudiosPorFecha>) => Record<string, SolicitudesEstudiosPorFecha>) => void,
  observacionesPorTurno: Record<string, ObservacionesPorPracticaFecha>,
  setObservacionesPorTurno: (updater: (prev: Record<string, ObservacionesPorPracticaFecha>) => Record<string, ObservacionesPorPracticaFecha>) => void,
  setIsWorking: (v: boolean) => void,
  mostrarToastSolicitud: (msg: string) => void,
) {
  const [showEvolucionesListado, setShowEvolucionesListado] = useState(false);
  const [showAgregarEvolucionModal, setShowAgregarEvolucionModal] = useState(false);
  const [showSalidaEncuentroModal, setShowSalidaEncuentroModal] = useState(false);
  const [accionSalidaEncuentro, setAccionSalidaEncuentro] = useState<string>("");
  const [evolucionesFiltroProfesional, setEvolucionesFiltroProfesional] = useState("");
  const [evolucionesFiltroServicio, setEvolucionesFiltroServicio] = useState("");
  const [evolucionTextoDraft, setEvolucionTextoDraft] = useState("");
  const [evolucionProblemasTextoDraft, setEvolucionProblemasTextoDraft] = useState("");
  const [evolucionFormError, setEvolucionFormError] = useState<string | null>(null);
  const [evolucionesLocalesPorTurno, setEvolucionesLocalesPorTurno] = useState<Record<string, EvolucionCreadaLocal[]>>(() => {
    if (typeof window === "undefined") return {};
    return parseStoredEvolucionesLocales(window.localStorage.getItem(EVOLUCIONES_LOCALES_STORAGE_KEY));
  });
  const evolucionEditorRef = useRef<HTMLDivElement | null>(null);

  const evolucionScopeKeys = useMemo(() => {
    if (!selectedTurno) return [] as string[];
    return Array.from(new Set([buildEvolucionScopeKey(selectedTurno), selectedTurno.id]));
  }, [selectedTurno]);

  const evolucionesLocalesPaciente = useMemo(() => {
    if (!selectedTurno || evolucionScopeKeys.length === 0) return [] as EvolucionCreadaLocal[];
    const scopeKey = buildEvolucionScopeKey(selectedTurno);
    const scopeKeyNormalized = normalizeEvolucionScopeToken(scopeKey);
    const turnoIdNormalized = normalizeEvolucionScopeToken(selectedTurno.id);
    const legacyDocumentoRaw = (selectedTurno.documento ?? "").trim().toUpperCase();
    const seen = new Set<string>();
    const merged: EvolucionCreadaLocal[] = [];
    for (const [storedKey, storedItems] of Object.entries(evolucionesLocalesPorTurno)) {
      const storedKeyNormalized = normalizeEvolucionScopeToken(storedKey);
      const perteneceAlPaciente = storedKey === scopeKey || storedKey === selectedTurno.id ||
        storedKey === legacyDocumentoRaw || storedKeyNormalized === scopeKeyNormalized ||
        storedKeyNormalized === turnoIdNormalized;
      if (!perteneceAlPaciente) continue;
      for (const item of storedItems) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [selectedTurno, evolucionScopeKeys, evolucionesLocalesPorTurno]);

  const evolucionesAmbulatoriasConLocales = useMemo(() => {
    if (!selectedTurno) return evolucionesAmbulatorias;
    const localesAmbulatorias: EvolucionAmbulatoriaResponse[] = evolucionesLocalesPaciente.map(item => ({
      evolucionId: item.id,
      fechaAtencion: item.fechaAtencion,
      especialidad: item.especialidad,
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual),
      problemasAsociados: item.problemasAsociados
    }));
    const backendNormalizadas = evolucionesAmbulatorias.map(item => ({
      ...item,
      profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
    }));
    return [...localesAmbulatorias, ...backendNormalizadas].sort((a, b) => {
      const da = Date.parse(a.fechaAtencion);
      const db = Date.parse(b.fechaAtencion);
      if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
      return b.fechaAtencion.localeCompare(a.fechaAtencion);
    });
  }, [selectedTurno, evolucionesAmbulatorias, evolucionesLocalesPaciente, profesionalActual]);

  const panoramica = useMemo(() => buildPanoramica(selectedTurno, evolucionesAmbulatoriasConLocales, problemasCronicos), [selectedTurno, evolucionesAmbulatoriasConLocales, problemasCronicos]);

  const evolucionesCombinadas = useMemo(() => {
    if (!selectedTurno) {
      return buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
        ...item, profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
      }));
    }
    const base = buildListadoEvoluciones(evolucionesAmbulatorias).map(item => ({
      ...item, profesional: normalizeProfesionalLabel(item.profesional, profesionalActual)
    }));
    const locales = evolucionesLocalesPaciente.map(item => {
      const formatted = item.fechaAtencion.includes("T") ? new Date(item.fechaAtencion).toLocaleDateString("es-AR") : item.fechaAtencion.split(" ")[0] ?? item.fechaAtencion;
      return {
        id: item.id,
        fechaHora: item.fechaAtencion,
        fechaAtencion: formatted,
        especialidad: item.especialidad,
        profesional: normalizeProfesionalLabel(item.profesional, profesionalActual),
        practica: CONSULTA_MEDICA,
        problemasAsociados: item.problemasAsociados,
        texto: item.texto
      };
    });
    return [...locales, ...base];
  }, [selectedTurno, evolucionesAmbulatorias, evolucionesLocalesPaciente, profesionalActual]);

  const listadoEvoluciones = useMemo(() => evolucionesCombinadas, [evolucionesCombinadas]);
  const profesionalesEvoluciones = useMemo(() => Array.from(new Set(listadoEvoluciones.map(item => item.profesional))).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })), [listadoEvoluciones]);
  const serviciosEvoluciones = useMemo(() => Array.from(new Set(listadoEvoluciones.map(item => item.especialidad))).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })), [listadoEvoluciones]);

  const listadoEvolucionesFiltradas = useMemo(() => {
    return listadoEvoluciones
      .filter(item => !evolucionesFiltroProfesional || item.profesional === evolucionesFiltroProfesional)
      .filter(item => !evolucionesFiltroServicio || item.especialidad === evolucionesFiltroServicio)
      .sort((a, b) => {
        const da = Date.parse(a.fechaHora);
        const db = Date.parse(b.fechaHora);
        if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
        return b.fechaHora.localeCompare(a.fechaHora);
      });
  }, [listadoEvoluciones, evolucionesFiltroProfesional, evolucionesFiltroServicio]);

  const evolucionProblemasTextoNormalizado = useMemo(() => extractPlainTextFromHtml(evolucionProblemasTextoDraft), [evolucionProblemasTextoDraft]);
  const evolucionProblemasEtiquetas = useMemo(() => {
    const raw = evolucionProblemasTextoNormalizado;
    if (!raw) return [];
    const items = raw.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);
    if (items.length === 0 && raw.trim()) return [raw.trim()];
    return Array.from(new Set(items));
  }, [evolucionProblemasTextoNormalizado]);

  const canGuardarEvolucion = useMemo(() => hasValidEvolucionContent(evolucionTextoDraft) && evolucionProblemasEtiquetas.length > 0, [evolucionTextoDraft, evolucionProblemasEtiquetas]);
  const canAplicarFormatoEvolucion = useMemo(() => evolucionTextoDraft.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, "").trim().length > 0, [evolucionTextoDraft]);

  const cumpleRegistroMinimoSalidaEncuentro = useMemo(() => {
    if (hasValidEvolucionContent(evolucionTextoDraft) && evolucionProblemasEtiquetas.length > 0) return true;
    if (selectedTurno) {
      const localesTurno = evolucionesLocalesPaciente;
      if (localesTurno.some(item => hasValidEvolucionContent(item.texto) && item.problemasAsociados.length > 0)) return true;
    }
    return evolucionesAmbulatorias.some(item => item.problemasAsociados.length > 0);
  }, [evolucionTextoDraft, evolucionProblemasEtiquetas, selectedTurno, evolucionesLocalesPaciente, evolucionesAmbulatorias]);

  const canSolicitarEstudiosDesdeEvolucion = useMemo(() => extractPlainTextFromHtml(evolucionTextoDraft).length > 0 && evolucionProblemasEtiquetas.length > 0, [evolucionTextoDraft, evolucionProblemasEtiquetas]);

  useEffect(() => {
    setEvolucionesLocalesPorTurno(prev => {
      let changed = false;
      const next: Record<string, EvolucionCreadaLocal[]> = {};
      for (const [key, items] of Object.entries(prev)) {
        next[key] = items.map(item => {
          const profesionalNormalizado = normalizeProfesionalLabel(item.profesional, profesionalActual);
          if (profesionalNormalizado === item.profesional) return item;
          changed = true;
          return { ...item, profesional: profesionalNormalizado };
        });
      }
      return changed ? next : prev;
    });
  }, [profesionalActual]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(EVOLUCIONES_LOCALES_STORAGE_KEY, JSON.stringify(evolucionesLocalesPorTurno));
  }, [evolucionesLocalesPorTurno]);

  function abrirEvoluciones() {
    if (!selectedTurno) return;
    setShowEvolucionesListado(true);
  }

  function abrirAgregarEvolucion() {
    if (!selectedTurno) return;
    setEvolucionTextoDraft("");
    setEvolucionProblemasTextoDraft("");
    setEvolucionFormError(null);
    const draftScope = `draft-evol-${selectedTurno.id}`;
    setSolicitudesEstudiosPorTurno(prev => {
      if (Object.prototype.hasOwnProperty.call(prev, draftScope)) {
        const next = { ...prev }; delete next[draftScope]; return next;
      }
      return prev;
    });
    setObservacionesPorTurno(prev => {
      if (Object.prototype.hasOwnProperty.call(prev, draftScope)) {
        const next = { ...prev }; delete next[draftScope]; return next;
      }
      return prev;
    });
    setShowAgregarEvolucionModal(true);
  }

  function aplicarFormatoEvolucion(comando: "bold" | "italic" | "underline" | "strikeThrough" | "insertUnorderedList" | "indent") {
    if (!canAplicarFormatoEvolucion || !evolucionEditorRef.current) return;
    evolucionEditorRef.current.focus();
    document.execCommand(comando, false);
    setEvolucionTextoDraft(sanitizeRichTextHtml(evolucionEditorRef.current.innerHTML));
  }

  function guardarEvolucionNueva() {
    if (!selectedTurno) return;
    if (!hasValidEvolucionContent(evolucionTextoDraft)) {
      setEvolucionFormError("La evolucion requiere al menos 4 caracteres alfanumericos no repetidos.");
      return;
    }
    if (evolucionProblemasEtiquetas.length === 0) {
      setEvolucionFormError("Debe registrar al menos un problema en texto libre.");
      return;
    }
    const draftScopeId = `draft-evol-${selectedTurno.id}`;
    const draftSolicitudes = solicitudesEstudiosPorTurno[draftScopeId] ?? {};
    const draftObservaciones = observacionesPorTurno[draftScopeId] ?? {};
    if (Object.keys(draftSolicitudes).length > 0) {
      setSolicitudesEstudiosPorTurno(prev => {
        const target = prev[selectedTurno.id] ?? {};
        const merged: SolicitudesEstudiosPorFecha = { ...target };
        for (const [fecha, practicas] of Object.entries(draftSolicitudes)) {
          merged[fecha] = Array.from(new Set([...(merged[fecha] ?? []), ...practicas]));
        }
        const next = { ...prev, [selectedTurno.id]: merged };
        delete next[draftScopeId];
        return next;
      });
      setObservacionesPorTurno(prev => {
        const target = prev[selectedTurno.id] ?? {};
        const merged: ObservacionesPorPracticaFecha = { ...target };
        for (const [fecha, observacionesFecha] of Object.entries(draftObservaciones)) {
          merged[fecha] = { ...(merged[fecha] ?? {}), ...observacionesFecha };
        }
        const next = { ...prev, [selectedTurno.id]: merged };
        delete next[draftScopeId];
        return next;
      });
    }
    const nueva: EvolucionCreadaLocal = {
      id: `local-evol-${Date.now()}`,
      fechaAtencion: new Date().toISOString(),
      especialidad: selectedTurno.servicio,
      profesional: profesionalActual,
      problemasAsociados: [...evolucionProblemasEtiquetas],
      texto: sanitizeRichTextHtml(evolucionTextoDraft).trim()
    };
    const scopeKey = buildEvolucionScopeKey(selectedTurno);
    const documentoRaw = (selectedTurno.documento ?? "").trim().toUpperCase();
    const aliasKeys = Array.from(new Set([scopeKey, selectedTurno.id, documentoRaw])).filter(key => key && key !== VALOR_GUION);
    setEvolucionesLocalesPorTurno(prev => {
      const next = { ...prev };
      for (const key of aliasKeys) {
        next[key] = [nueva, ...(next[key] ?? [])];
      }
      return next;
    });
    setShowAgregarEvolucionModal(false);
    setEvolucionTextoDraft("");
    setEvolucionProblemasTextoDraft("");
    setEvolucionFormError(null);

    if (encuentroPacienteId) {
      crearEvolucionAmbulatoria({
        turnoId: selectedTurno.id,
        pacienteId: encuentroPacienteId,
        especialidad: selectedTurno.servicio,
        profesional: profesionalActual,
        texto: sanitizeRichTextHtml(evolucionTextoDraft).trim(),
        problemasAsociados: [...evolucionProblemasEtiquetas]
      }).catch(() => {});
    }

    mostrarToastSolicitud("Evolucion guardada correctamente.");
  }

  async function handleAsignarProblema(
    problemaNuevaDescripcion: string,
    problemaNuevaCategoria: string,
    problemaNuevaFechaInicio: string,
    setProblemaFormError: (msg: string | null) => void,
  ) {
    if (!problemaNuevaDescripcion.trim()) { setProblemaFormError("La descripcion del problema es obligatoria."); return; }
    if (!selectedTurno) { setProblemaFormError("No hay paciente seleccionado."); return; }
    setIsWorking(true);
    try {
      let pacienteId = encuentroPacienteId;
      if (!pacienteId && selectedTurno.documento && selectedTurno.documento !== VALOR_GUION) {
        const candidatos = await buscarPersonaPorDocumento(DEFAULT_DOCUMENT_TYPE, selectedTurno.documento.replace(/[^0-9]/g, ""));
        if (candidatos.length > 0) {
          pacienteId = candidatos[0].id;
        }
      }
      if (!pacienteId) { setProblemaFormError("No se pudo identificar el paciente. Verifique que tenga documento registrado."); setIsWorking(false); return; }
      const request: AsignarProblemaRequest = {
        descripcion: problemaNuevaDescripcion.trim(),
        categoria: problemaNuevaCategoria,
        fechaInicio: problemaNuevaFechaInicio ? problemaNuevaFechaInicio.split("-").reverse().join("/") : undefined
      };
      await asignarProblemaPaciente(pacienteId, request);
      const problemas = await obtenerProblemasCronicosPaciente(pacienteId);
      setProblemasCronicos(problemas.map(p => ({
        id: p.problemaCronicoId,
        fechaHora: p.fechaInicio,
        titulo: p.descripcion,
        detalle: `${p.categoria} | ${p.fechaInicio}`,
        evolucionesAsociadas: p.evolucionesAsociadas
      })));
      if (!encuentroPacienteId) setEncuentroPacienteId(pacienteId);
      mostrarToastSolicitud("Problema asignado correctamente.");
      setProblemaFormError(null);
    } catch (err) {
      setProblemaFormError(err instanceof Error ? err.message : "No se pudo asignar el problema.");
    } finally { setIsWorking(false); }
  }

  function limpiarDatosEvolucion() {
    setShowEvolucionesListado(false);
    setShowAgregarEvolucionModal(false);
  }

  return {
    showEvolucionesListado, setShowEvolucionesListado,
    showAgregarEvolucionModal, setShowAgregarEvolucionModal,
    showSalidaEncuentroModal, setShowSalidaEncuentroModal,
    accionSalidaEncuentro, setAccionSalidaEncuentro,
    evolucionesFiltroProfesional, setEvolucionesFiltroProfesional,
    evolucionesFiltroServicio, setEvolucionesFiltroServicio,
    evolucionTextoDraft, setEvolucionTextoDraft,
    evolucionProblemasTextoDraft, setEvolucionProblemasTextoDraft,
    evolucionFormError, setEvolucionFormError,
    evolucionesLocalesPorTurno, setEvolucionesLocalesPorTurno,
    evolucionEditorRef, evolucionScopeKeys,
    evolucionesLocalesPaciente, evolucionesAmbulatoriasConLocales,
    panoramica, evolucionesCombinadas, listadoEvoluciones,
    profesionalesEvoluciones, serviciosEvoluciones, listadoEvolucionesFiltradas,
    evolucionProblemasTextoNormalizado, evolucionProblemasEtiquetas,
    canGuardarEvolucion, canAplicarFormatoEvolucion,
    cumpleRegistroMinimoSalidaEncuentro, canSolicitarEstudiosDesdeEvolucion,
    abrirEvoluciones, abrirAgregarEvolucion,
    aplicarFormatoEvolucion, guardarEvolucionNueva,
    handleAsignarProblema, limpiarDatosEvolucion,
  };
}
