import { useEffect, useMemo, useRef, useState } from "react";
import { getPracticas } from "../../agenda/agendaApi";
import type { PracticaOption } from "../../agenda/agendaTypes";
import { guardarSolicitudesEstudiosTurno, obtenerSolicitudesEstudiosTurno } from "../escritorioClinicoApi";
import type { SolicitudesEstudiosPorFecha, ObservacionesPorPracticaFecha } from "../escritorioClinicoTypes";
import { formatAgendaDate, todayIsoDate, escapeHtml } from "../escritorioClinicoTypes";
import type { TurnoAdmision } from "../../admision/admisionTypes";

export function useSolicitudEstudios(
  selectedTurno: TurnoAdmision | null,
  turnos: TurnoAdmision[],
  puedeSolicitarEstudios: boolean,
  profesionalActual: string,
  lugarAtencionNombre: string,
  servicioActualNombre: string,
  errorSetter: (msg: string | null) => void,
) {
  const [showSolicitudEstudiosModal, setShowSolicitudEstudiosModal] = useState(false);
  const [showFechaPrimeraPracticaModal, setShowFechaPrimeraPracticaModal] = useState(false);
  const [showObservacionModal, setShowObservacionModal] = useState(false);
  const [fechaSolicitudNueva, setFechaSolicitudNueva] = useState(todayIsoDate());
  const [fechaSolicitudActiva, setFechaSolicitudActiva] = useState("");
  const [busquedaPracticas, setBusquedaPracticas] = useState("");
  const [busquedaPracticasDerecha, setBusquedaPracticasDerecha] = useState("");
  const [practicasSeleccionadasIzquierda, setPracticasSeleccionadasIzquierda] = useState<string[]>([]);
  const [practicasSeleccionadasDerecha, setPracticasSeleccionadasDerecha] = useState<string[]>([]);
  const [practicaObservacionActiva, setPracticaObservacionActiva] = useState<string | null>(null);
  const [observacionDraft, setObservacionDraft] = useState("");
  const [observacionesPorTurno, setObservacionesPorTurno] = useState<Record<string, ObservacionesPorPracticaFecha>>({});
  const [solicitudScopeTurnoId, setSolicitudScopeTurnoId] = useState<string | null>(null);
  const [solicitudOrigen, setSolicitudOrigen] = useState<"general" | "evolucion">("general");
  const [canalEnvioSolicitudes, setCanalEnvioSolicitudes] = useState<"impresion" | "correo">("impresion");
  const [solicitudToast, setSolicitudToast] = useState<string | null>(null);
  const [solicitudError, setSolicitudError] = useState<string | null>(null);
  const [solicitudesEstudiosPorTurno, setSolicitudesEstudiosPorTurno] = useState<Record<string, SolicitudesEstudiosPorFecha>>({});
  const [practicasResultados, setPracticasResultados] = useState<PracticaOption[]>([]);
  const practicasSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draftSolicitudScopeId = selectedTurno ? `draft-evol-${selectedTurno.id}` : "";
  const solicitudScopeId = solicitudScopeTurnoId ?? selectedTurno?.id ?? null;

  const solicitudesTurnoSeleccionado = useMemo(() => solicitudScopeId ? solicitudesEstudiosPorTurno[solicitudScopeId] ?? {} : {}, [solicitudScopeId, solicitudesEstudiosPorTurno]);
  const fechasSolicitudesOrdenadas = useMemo(() => Object.keys(solicitudesTurnoSeleccionado).sort((a, b) => a.localeCompare(b)), [solicitudesTurnoSeleccionado]);
  const practicasFechaActiva = useMemo(() => fechaSolicitudActiva ? solicitudesTurnoSeleccionado[fechaSolicitudActiva] ?? [] : [], [solicitudesTurnoSeleccionado, fechaSolicitudActiva]);
  const observacionesFechaActiva = useMemo(() => {
    if (!solicitudScopeId || !fechaSolicitudActiva) return {};
    return observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva] ?? {};
  }, [solicitudScopeId, fechaSolicitudActiva, observacionesPorTurno]);

  const practicasFiltradasIzquierda = useMemo(() => {
    return practicasResultados
      .filter((p: PracticaOption) => !practicasFechaActiva.includes(p.nombre));
  }, [practicasResultados, practicasFechaActiva]);

  const totalEstudiosSolicitados = useMemo(() => Object.values(solicitudesTurnoSeleccionado).reduce((acc, list) => acc + list.length, 0), [solicitudesTurnoSeleccionado]);
  const totalEstudiosSolicitadosTurno = useMemo(() =>
    selectedTurno ? Object.values(solicitudesEstudiosPorTurno[selectedTurno.id] ?? {}).reduce((acc, list) => acc + list.length, 0) : 0,
  [selectedTurno, solicitudesEstudiosPorTurno]);
  const totalEstudiosSolicitadosDraftEvolucion = useMemo(() =>
    draftSolicitudScopeId ? Object.values(solicitudesEstudiosPorTurno[draftSolicitudScopeId] ?? {}).reduce((acc, list) => acc + list.length, 0) : 0,
  [draftSolicitudScopeId, solicitudesEstudiosPorTurno]);

  useEffect(() => {
    const q = busquedaPracticas.trim();
    if (practicasSearchTimer.current) clearTimeout(practicasSearchTimer.current);
    if (q.length < 2) { setPracticasResultados([]); return; }
    practicasSearchTimer.current = setTimeout(async () => {
      try {
        const results = await getPracticas(q);
        setPracticasResultados(results);
      } catch { setPracticasResultados([]); }
    }, 250);
    return () => { if (practicasSearchTimer.current) clearTimeout(practicasSearchTimer.current); };
  }, [busquedaPracticas]);

  useEffect(() => {
    if (!solicitudToast) return;
    const timer = window.setTimeout(() => setSolicitudToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [solicitudToast]);

  function limpiarSolicitudesScope(scopeId: string) {
    setSolicitudesEstudiosPorTurno(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, scopeId)) return prev;
      const next = { ...prev }; delete next[scopeId]; return next;
    });
    setObservacionesPorTurno(prev => {
      if (!Object.prototype.hasOwnProperty.call(prev, scopeId)) return prev;
      const next = { ...prev }; delete next[scopeId]; return next;
    });
  }

  function abrirSolicitudEstudiosConScope(scopeId: string, origen: "general" | "evolucion") {
    const existentes = solicitudesEstudiosPorTurno[scopeId] ?? {};
    const fechas = Object.keys(existentes).sort((a, b) => a.localeCompare(b));
    setSolicitudScopeTurnoId(scopeId);
    setSolicitudOrigen(origen);
    setFechaSolicitudNueva(todayIsoDate());
    setFechaSolicitudActiva(fechas[0] ?? "");
    setBusquedaPracticas("");
    setPracticasSeleccionadasIzquierda([]);
    setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null);
    setCanalEnvioSolicitudes("impresion");
    setShowSolicitudEstudiosModal(true);
  }

  function abrirSolicitudEstudios() {
    if (!selectedTurno) { errorSetter("Debe seleccionar un paciente para solicitar estudios."); return; }
    if (!puedeSolicitarEstudios) { errorSetter("Solicitar estudios esta deshabilitado en modo visualizacion HC."); return; }
    abrirSolicitudEstudiosConScope(selectedTurno.id, "general");
  }

  function mostrarToastSolicitud(message: string) { setSolicitudToast(message); }

  function imprimirSolicitudesPracticas() {
    if (!selectedTurno) { setSolicitudError("Debe seleccionar un paciente para imprimir las solicitudes."); return; }
    if (!solicitudScopeId) return;
    if (totalEstudiosSolicitados === 0) { setSolicitudError("No hay practicas cargadas para imprimir."); return; }

    const popup = window.open("", "_blank", "width=980,height=760");
    if (!popup) { setSolicitudError("No se pudo abrir la ventana de impresion. Verifica bloqueador de ventanas."); return; }

    const now = new Date();
    const fechaEmision = now.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const horaEmision = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const numeroComprobante = `SOL-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${selectedTurno.id.slice(0, 6).toUpperCase()}`;

    const practicasHtml = fechasSolicitudesOrdenadas.map(fecha => {
      const practicas = solicitudesTurnoSeleccionado[fecha] ?? [];
      if (practicas.length === 0) return "";
      const fechaStr = formatAgendaDate(fecha);
      const rows = practicas.map((practica, idx) => {
        const observacion = observacionesPorTurno[solicitudScopeId]?.[fecha]?.[practica]?.trim();
        const bgColor = idx % 2 === 0 ? "#f8fbff" : "#ffffff";
        const obsHtml = observacion ? `<tr style="background:${bgColor}"><td colspan="3" style="padding:6px 12px;border-bottom:1px solid #e2ebf5;font-size:12px;color:#3a5d80;font-style:italic">Observacion: ${escapeHtml(observacion)}</td></tr>` : "";
        return `<tr style="background:${bgColor}">
          <td style="padding:8px 12px;border-bottom:1px solid #e2ebf5;font-size:13px;color:#1d3f63;width:40px;text-align:center">${idx + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2ebf5;font-size:13px;color:#1d3f63;font-weight:600">${escapeHtml(practica)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2ebf5;font-size:13px;color:#294b72;text-align:center">Pendiente</td>
        </tr>${obsHtml}`;
      }).join("");
      return `<div class="fecha-group"><p class="fecha-label">Fecha de solicitud: <strong>${escapeHtml(fechaStr)}</strong></p><table class="practicas-table"><thead><tr><th style="width:40px">#</th><th>Practica</th><th style="width:100px">Estado</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }).join("");

    const totalPracticas = fechasSolicitudesOrdenadas.reduce((acc, fecha) => acc + (solicitudesTurnoSeleccionado[fecha]?.length ?? 0), 0);

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Solicitud de Prácticas - ${escapeHtml(selectedTurno.paciente)}</title>
  <style>
    @page { margin: 18mm 15mm 20mm 15mm; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #1b2d3f; line-height: 1.45; background: #fff; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 3px solid #0f6cab; margin-bottom: 18px; }
    .header-left { flex: 1; }
    .header-right { text-align: right; font-size: 12px; color: #5a7492; }
    .system-name { font-size: 20px; font-weight: 800; color: #0f6cab; letter-spacing: 0.02em; }
    .system-subtitle { font-size: 11px; color: #5a7492; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
    .doc-title { font-size: 17px; font-weight: 700; color: #1f3f63; margin-top: 10px; padding: 6px 12px; background: #f0f6ff; border-left: 4px solid #0f6cab; border-radius: 0 6px 6px 0; }

    .comprobante-meta { display: flex; justify-content: space-between; margin-bottom: 16px; padding: 10px 14px; background: #f8fbff; border: 1px solid #d6e4f3; border-radius: 8px; font-size: 12px; color: #3a5d80; }
    .comprobante-meta strong { color: #1d4a7a; }

    .paciente-card { border: 1px solid #d6e4f3; border-radius: 10px; padding: 14px; margin-bottom: 18px; background: linear-gradient(135deg, #fafcff 0%, #f5f9fd 100%); }
    .paciente-card h3 { font-size: 14px; color: #244972; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2ebf5; }
    .paciente-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
    .paciente-field { font-size: 12.5px; }
    .paciente-field .label { color: #5a7492; text-transform: uppercase; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; }
    .paciente-field .value { color: #1d3f63; font-weight: 600; margin-top: 1px; }

    .profesional-card { border: 1px solid #d6e4f3; border-radius: 10px; padding: 14px; margin-bottom: 18px; background: #f8fbff; }
    .profesional-card h3 { font-size: 14px; color: #244972; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #e2ebf5; }
    .profesional-card p { font-size: 12.5px; color: #1d3f63; }

    .fecha-group { margin-bottom: 16px; }
    .fecha-label { font-size: 12px; color: #3a5d80; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em; }
    .fecha-label strong { color: #1d4a7a; }

    .practicas-table { width: 100%; border-collapse: collapse; border: 1px solid #d6e4f3; border-radius: 8px; overflow: hidden; margin-bottom: 4px; }
    .practicas-table thead th { background: #0f6cab; color: #fff; font-size: 11.5px; font-weight: 700; padding: 8px 12px; text-align: left; text-transform: uppercase; letter-spacing: 0.04em; }
    .practicas-table tbody td { border-bottom: 1px solid #e2ebf5; }
    .practicas-table tbody tr:last-child td { border-bottom: none; }

    .firmas { margin-top: 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .firma-box { text-align: center; }
    .firma-line { border-top: 1px solid #8b99a8; margin-top: 50px; padding-top: 8px; }
    .firma-label { font-size: 11px; color: #5a7492; }
    .firma-name { font-size: 12px; font-weight: 700; color: #1d3f63; }

    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #d6e4f3; display: flex; justify-content: space-between; font-size: 10px; color: #8b99a8; }

    @media print {
      body { background: #fff; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;padding:8px;background:#f0f6ff;border-bottom:1px solid #d6e4f3;font-size:12px;color:#3a5d80">
    Use Ctrl+P o el botón de impresión del navegador para imprimir este comprobante
  </div>

  <div class="header">
    <div class="header-left">
      <div class="system-name">VitalFlow HIS</div>
      <div class="system-subtitle">Sistema de Historia Clinica Electronica</div>
    </div>
    <div class="header-right">
      <div style="font-weight:700;color:#1d4a7a">Fecha de emision</div>
      <div>${fechaEmision} ${horaEmision} hs</div>
    </div>
  </div>

  <div class="doc-title">Solicitud de Praticas Medicas</div>

  <div class="comprobante-meta">
    <span><strong>Comprobante:</strong> ${escapeHtml(numeroComprobante)}</span>
    <span><strong>Total de praticas:</strong> ${totalPracticas}</span>
  </div>

  <div class="paciente-card">
    <h3>Datos del Paciente</h3>
    <div class="paciente-grid">
      <div class="paciente-field"><div class="label">Paciente</div><div class="value">${escapeHtml(selectedTurno.paciente)}</div></div>
      <div class="paciente-field"><div class="label">Documento</div><div class="value">${escapeHtml(selectedTurno.documento)}</div></div>
      <div class="paciente-field"><div class="label">Servicio</div><div class="value">${escapeHtml(selectedTurno.servicio)}</div></div>
      <div class="paciente-field"><div class="label">Lugar de atencion</div><div class="value">${escapeHtml(selectedTurno.efector)}</div></div>
      <div class="paciente-field"><div class="label">Financiador</div><div class="value">${escapeHtml(selectedTurno.financiador)}</div></div>
      <div class="paciente-field"><div class="label">Turno</div><div class="value">${escapeHtml(selectedTurno.turno)}</div></div>
    </div>
  </div>

  <div class="profesional-card">
    <h3>Profesional solicitante</h3>
    <p>${escapeHtml(profesionalActual)}</p>
    <p style="font-size:11px;color:#5a7492;margin-top:2px">${escapeHtml(lugarAtencionNombre)} - ${escapeHtml(servicioActualNombre)}</p>
  </div>

  ${practicasHtml}

  <div class="firmas">
    <div class="firma-box">
      <div class="firma-line">
        <div class="firma-label">Firma del profesional</div>
        <div class="firma-name">${escapeHtml(profesionalActual)}</div>
      </div>
    </div>
    <div class="firma-box">
      <div class="firma-line">
        <div class="firma-label">Aclaracion / Sello del consultorio</div>
        <div class="firma-name">${escapeHtml(lugarAtencionNombre)}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>VitalFlow HIS - Comprobante de solicitud de praticas</span>
    <span>Generado automaticamente el ${fechaEmision} a las ${horaEmision} hs</span>
  </div>
</body>
</html>`;

    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();
    setTimeout(() => { try { popup.print(); } catch { } }, 300);
    mostrarToastSolicitud("Comprobante enviado a impresion.");
    setSolicitudError(null);
  }

  function agregarFechaSolicitud() {
    if (!solicitudScopeId) return;
    const hoy = todayIsoDate();
    if (fechaSolicitudNueva < hoy) { setSolicitudError("No puede agregar fechas anteriores a la actual."); return; }
    const existentes = solicitudesEstudiosPorTurno[solicitudScopeId] ?? {};
    if (Object.prototype.hasOwnProperty.call(existentes, fechaSolicitudNueva)) { setSolicitudError("No pueden repetirse las fechas."); return; }
    setSolicitudesEstudiosPorTurno(prev => ({ ...prev, [solicitudScopeId]: { ...(prev[solicitudScopeId] ?? {}), [fechaSolicitudNueva]: [] } }));
    setFechaSolicitudActiva(fechaSolicitudNueva);
    setPracticasSeleccionadasIzquierda([]);
    setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null);
  }

  function moverPracticasSeleccionadasADerecha() {
    if (!solicitudScopeId || practicasSeleccionadasIzquierda.length === 0) return;
    const fecha = fechaSolicitudActiva || todayIsoDate();
    if (!fechaSolicitudActiva) setFechaSolicitudActiva(fecha);
    const existentes = solicitudesTurnoSeleccionado[fecha] ?? [];
    const nuevas = practicasSeleccionadasIzquierda.filter(item => !existentes.includes(item));
    if (nuevas.length === 0) { setSolicitudError("La practica no puede repetirse dentro de la misma fecha."); return; }
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fecha]: [...(turnoMap[fecha] ?? []), ...nuevas] } };
    });
    setPracticasSeleccionadasIzquierda([]);
    setSolicitudError(null);
  }

  function moverPracticasSeleccionadasAIzquierda() {
    if (!solicitudScopeId || !fechaSolicitudActiva || practicasSeleccionadasDerecha.length === 0) return;
    setSolicitudesEstudiosPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fechaSolicitudActiva]: (turnoMap[fechaSolicitudActiva] ?? []).filter(item => !practicasSeleccionadasDerecha.includes(item)) } };
    });
    setObservacionesPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const fechaMap = turnoMap[fechaSolicitudActiva] ?? {};
      const nextFechaMap: Record<string, string> = {};
      for (const [practica, observacion] of Object.entries(fechaMap)) {
        if (!practicasSeleccionadasDerecha.includes(practica)) nextFechaMap[practica] = observacion;
      }
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fechaSolicitudActiva]: nextFechaMap } };
    });
    setPracticasSeleccionadasDerecha([]);
    setSolicitudError(null);
  }

  function abrirObservacionPractica(practica: string) {
    if (!solicitudScopeId || !fechaSolicitudActiva) return;
    const existente = observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva]?.[practica] ?? "";
    setPracticaObservacionActiva(practica);
    setObservacionDraft(existente);
    setShowObservacionModal(true);
    setSolicitudError(null);
  }

  function guardarObservacionPractica() {
    if (!solicitudScopeId || !fechaSolicitudActiva || !practicaObservacionActiva) return;
    const texto = observacionDraft.trim();
    if (!texto) return;
    const observacionPrevia = observacionesPorTurno[solicitudScopeId]?.[fechaSolicitudActiva]?.[practicaObservacionActiva];
    setObservacionesPorTurno(prev => ({
      ...prev, [solicitudScopeId]: {
        ...(prev[solicitudScopeId] ?? {}),
        [fechaSolicitudActiva]: { ...(prev[solicitudScopeId]?.[fechaSolicitudActiva] ?? {}), [practicaObservacionActiva]: texto }
      }
    }));
    setShowObservacionModal(false);
    setPracticaObservacionActiva(null);
    setObservacionDraft("");
    mostrarToastSolicitud(observacionPrevia ? "Observacion editada correctamente." : "Observacion agregada correctamente.");
  }

  function eliminarObservacionPractica(practica: string) {
    if (!solicitudScopeId || !fechaSolicitudActiva) return;
    setObservacionesPorTurno(prev => {
      const turnoMap = prev[solicitudScopeId] ?? {};
      const fechaMap = turnoMap[fechaSolicitudActiva] ?? {};
      if (!Object.prototype.hasOwnProperty.call(fechaMap, practica)) return prev;
      const nextFechaMap = { ...fechaMap }; delete nextFechaMap[practica];
      return { ...prev, [solicitudScopeId]: { ...turnoMap, [fechaSolicitudActiva]: nextFechaMap } };
    });
    mostrarToastSolicitud("Observacion eliminada correctamente.");
  }

  function confirmarFechaPrimeraPractica() {
    if (!solicitudScopeId) return;
    const hoy = todayIsoDate();
    if (fechaSolicitudNueva < hoy) { setSolicitudError("No puede agregar fechas anteriores a la actual."); return; }
    const existentes = solicitudesEstudiosPorTurno[solicitudScopeId] ?? {};
    if (Object.prototype.hasOwnProperty.call(existentes, fechaSolicitudNueva)) { setSolicitudError("No pueden repetirse las fechas."); return; }
    setSolicitudesEstudiosPorTurno(prev => ({ ...prev, [solicitudScopeId]: { ...(prev[solicitudScopeId] ?? {}), [fechaSolicitudNueva]: [...practicasSeleccionadasIzquierda] } }));
    setFechaSolicitudActiva(fechaSolicitudNueva);
    setPracticasSeleccionadasIzquierda([]);
    setShowFechaPrimeraPracticaModal(false);
    setSolicitudError(null);
  }

  async function loadSolicitudesEstudios(scopeId: string) {
    try {
      const records = await obtenerSolicitudesEstudiosTurno(scopeId);
      if (records.length === 0) return;
      const solicitudes: SolicitudesEstudiosPorFecha = {};
      const observaciones: ObservacionesPorPracticaFecha = {};
      for (const r of records) {
        if (!solicitudes[r.fechaSolicitada]) solicitudes[r.fechaSolicitada] = [];
        if (!solicitudes[r.fechaSolicitada].includes(r.practica)) solicitudes[r.fechaSolicitada].push(r.practica);
        if (r.observacion) {
          if (!observaciones[r.fechaSolicitada]) observaciones[r.fechaSolicitada] = {};
          observaciones[r.fechaSolicitada][r.practica] = r.observacion;
        }
      }
      setSolicitudesEstudiosPorTurno(prev => ({ ...prev, [scopeId]: solicitudes }));
      setObservacionesPorTurno(prev => ({ ...prev, [scopeId]: observaciones }));
    } catch { }
  }

  async function saveSolicitudesEstudios(scopeId: string) {
    if (scopeId.startsWith("draft-evol-")) return;
    const turno = turnos.find(t => t.id === scopeId);
    if (!turno) return;
    const solicitudes = solicitudesEstudiosPorTurno[scopeId] ?? {};
    if (Object.keys(solicitudes).length === 0) return;
    const observaciones = observacionesPorTurno[scopeId] ?? {};
    const items: { fechaSolicitada: string; practica: string; observacion?: string }[] = [];
    for (const [fecha, practicas] of Object.entries(solicitudes)) {
      for (const practica of practicas) {
        items.push({ fechaSolicitada: fecha, practica, observacion: observaciones[fecha]?.[practica] });
      }
    }
    try {
      await guardarSolicitudesEstudiosTurno(scopeId, { pacienteId: turno.pacienteId ?? turno.paciente, items });
    } catch {
      mostrarToastSolicitud("Error al guardar los estudios. Intente de nuevo.");
    }
  }

  const prevShowSolicitudRef = useRef(false);
  useEffect(() => {
    if (prevShowSolicitudRef.current && !showSolicitudEstudiosModal) {
      const scopeId = solicitudScopeTurnoId ?? selectedTurno?.id ?? "";
      if (scopeId) void saveSolicitudesEstudios(scopeId);
    }
    prevShowSolicitudRef.current = showSolicitudEstudiosModal;
  }, [showSolicitudEstudiosModal, selectedTurno?.id]);

  return {
    showSolicitudEstudiosModal, setShowSolicitudEstudiosModal,
    showFechaPrimeraPracticaModal, setShowFechaPrimeraPracticaModal,
    showObservacionModal, setShowObservacionModal,
    fechaSolicitudNueva, setFechaSolicitudNueva,
    fechaSolicitudActiva, setFechaSolicitudActiva,
    busquedaPracticas, setBusquedaPracticas,
    busquedaPracticasDerecha, setBusquedaPracticasDerecha,
    practicasSeleccionadasIzquierda, setPracticasSeleccionadasIzquierda,
    practicasSeleccionadasDerecha, setPracticasSeleccionadasDerecha,
    practicaObservacionActiva, setPracticaObservacionActiva,
    observacionDraft, setObservacionDraft,
    observacionesPorTurno, setObservacionesPorTurno,
    solicitudScopeTurnoId, setSolicitudScopeTurnoId,
    solicitudOrigen, setSolicitudOrigen,
    canalEnvioSolicitudes, setCanalEnvioSolicitudes,
    solicitudToast, setSolicitudToast,
    solicitudError, setSolicitudError,
    solicitudesEstudiosPorTurno, setSolicitudesEstudiosPorTurno,
    practicasResultados, setPracticasResultados,
    draftSolicitudScopeId, solicitudScopeId,
    solicitudesTurnoSeleccionado, fechasSolicitudesOrdenadas,
    practicasFechaActiva, observacionesFechaActiva,
    practicasFiltradasIzquierda, totalEstudiosSolicitados,
    totalEstudiosSolicitadosTurno, totalEstudiosSolicitadosDraftEvolucion,
    limpiarSolicitudesScope, abrirSolicitudEstudiosConScope,
    abrirSolicitudEstudios, mostrarToastSolicitud,
    imprimirSolicitudesPracticas, agregarFechaSolicitud,
    moverPracticasSeleccionadasADerecha, moverPracticasSeleccionadasAIzquierda,
    abrirObservacionPractica, guardarObservacionPractica, eliminarObservacionPractica,
    confirmarFechaPrimeraPractica, loadSolicitudesEstudios, saveSolicitudesEstudios,
    prevShowSolicitudRef,
  };
}
