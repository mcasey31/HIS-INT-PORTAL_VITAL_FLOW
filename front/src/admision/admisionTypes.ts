import type { AgendaSummary } from "../agenda/agendaTypes";

export type AdmisionPageProps = {};

export type SelectorAdmision = {
  id: string;
  nombre: string;
};

export type PracticaAdmision = {
  id: string;
  nombre: string;
  servicioId: string;
};

export type EfectorAdmision = {
  id: string;
  nombre: string;
  tipoEfector: string;
  servicioId: string;
};

export type SelectoresAdmision = {
  servicios: SelectorAdmision[];
  practicas: PracticaAdmision[];
  tiposEfector: string[];
  efectores: EfectorAdmision[];
  estados: string[];
};

export type BuscarTurnosAdmisionRequest = {
  servicioId?: string;
  practicaId?: string;
  tipoEfector?: string;
  efectorId?: string;
  fecha?: string;
  estado?: string;
};

export type TurnoAdmision = {
  id: string;
  turno: string;
  llegada: string | null;
  paciente: string;
  documento: string;
  financiador: string;
  servicio: string;
  efector: string;
  estado: string;
  estadoTurno?: string;
};

export type ConfirmarArriboTurnoResponse = {
  turnoId: string;
  estado: string;
  llegada: string;
  estadoTurno?: string;
  encuentroId?: string | null;
};

export type FinanciadorPlanAdmision = {
  id: string;
  financiador: string;
  plan: string;
  numeroAfiliado?: string;
  vigente: boolean;
  financiadorId: string | null;
  planId: string | null;
};

export type PacienteIdentificadoAdmision = {
  id: string;
  apellidosNombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexoBiologico: string;
  elegibilidadVerificada: boolean;
  financiadores: FinanciadorPlanAdmision[];
};

export type ConfirmarArriboTurnoRequest = {
  pacienteId: string;
  paciente: string;
  documento: string;
  financiador: string;
  documentacionValidada?: boolean;
  requierePago?: boolean;
  pagoRegistrado?: boolean;
  practicaCienPorcientoConvenida?: boolean;
};

export type ActualizarEstadoTurnoRequest = {
  estado: string;
  motivo?: string;
};

export type ActualizarEstadoTurnoResponse = {
  turnoId: string;
  estado: string;
  motivo?: string | null;
};

export type EncuentroAdmisionResponse = {
  encuentroId: string;
  turnoId: string;
  pacienteId: string;
  estado: string;
  creadoEn: string;
  cerradoEn?: string | null;
  motivoCierre?: string | null;
};

export type CerrarEncuentroRequest = {
  estadoPacienteFinal: "ATENDIDO" | "NO_ATENDIDO";
  motivo?: string;
};

export type CerrarEncuentroResponse = {
  encuentroId: string;
  turnoId: string;
  estadoEncuentro: string;
  estadoPacienteFinal: string;
  cerradoEn: string;
  motivo?: string | null;
};

export type FinanciadorCatalogoItem = {
  id: string;
  nombre: string;
  planes: Array<{
    id: string;
    nombre: string;
  }>;
};

export type FinanciadorPacienteAdmision = {
  id: string;
  financiadorId: string;
  planId: string;
  financiador: string;
  plan: string;
  numeroAfiliado: string;
  vigente: boolean;
};

export const CATALOGO_FINANCIADORES: FinanciadorCatalogoItem[] = [{
  id: "30000000-0000-0000-0000-000000000001",
  nombre: "OSDE",
  planes: [{
    id: "30000000-0000-0000-0000-000000000102",
    nombre: "210"
  }, {
    id: "30000000-0000-0000-0000-000000000101",
    nombre: "310"
  }, {
    id: "30000000-0000-0000-0000-000000000103",
    nombre: "410"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000002",
  nombre: "IOMA",
  planes: [{
    id: "30000000-0000-0000-0000-000000000202",
    nombre: "I700"
  }, {
    id: "30000000-0000-0000-0000-000000000201",
    nombre: "GOLD"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000004",
  nombre: "Swiss Medical",
  planes: [{
    id: "30000000-0000-0000-0000-000000000401",
    nombre: "SMG20"
  }, {
    id: "30000000-0000-0000-0000-000000000402",
    nombre: "SMG50"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000005",
  nombre: "PAMI",
  planes: [{
    id: "30000000-0000-0000-0000-000000000501",
    nombre: "General"
  }, {
    id: "30000000-0000-0000-0000-000000000502",
    nombre: "Plus"
  }]
}, {
  id: "30000000-0000-0000-0000-000000000003",
  nombre: "Privado/Particular",
  planes: [{
    id: "30000000-0000-0000-0000-000000000301",
    nombre: "Privado Particular"
  }]
}];

export const SELECTORES_EMPTY: SelectoresAdmision = {
  servicios: [],
  practicas: [],
  tiposEfector: [],
  efectores: [],
  estados: []
};

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isAgendaVigenteEnFecha(agenda: AgendaSummary, fechaIso: string): boolean {
  const desde = agenda.fechaDesde?.slice(0, 10);
  const hasta = agenda.fechaHasta?.slice(0, 10);
  if (!desde) {
    return false;
  }
  if (fechaIso < desde) {
    return false;
  }
  if (hasta && fechaIso > hasta) {
    return false;
  }
  return true;
}

export function parseNombreFinanciadorPlan(nombre: string): {
  financiador: string;
  plan: string;
} {
  const value = nombre.trim();
  if (!value) {
    return {
      financiador: "",
      plan: ""
    };
  }
  const separators = ["|", "-", "/"];
  for (const separator of separators) {
    const index = value.indexOf(separator);
    if (index > 0 && index < value.length - 1) {
      return {
        financiador: value.slice(0, index).trim(),
        plan: value.slice(index + 1).trim()
      };
    }
  }
  return {
    financiador: value,
    plan: "General"
  };
}

export function normalizarAfiliado(afiliado: string): string {
  return afiliado.replace(/[^0-9]/g, "").slice(0, 18);
}

export function isPrivadoFinanciador(financiador: FinanciadorPacienteAdmision): boolean {
  const full = `${financiador.financiador} ${financiador.plan}`.toUpperCase();
  return full.includes("PRIVADO") || full.includes("PARTICULAR");
}

export function mapFinanciadoresPaciente(financiadores: FinanciadorPlanAdmision[]): FinanciadorPacienteAdmision[] {
  return financiadores.map((item, index) => {
    const financiadorRaw = (item.financiador ?? "").trim();
    const planRaw = (item.plan ?? "").trim();
    const parsed = parseNombreFinanciadorPlan(`${financiadorRaw} | ${planRaw}`);
    const byId = item.financiadorId ? CATALOGO_FINANCIADORES.find(entry => entry.id === item.financiadorId) : null;
    const byName = CATALOGO_FINANCIADORES.find(entry => {
      if (!financiadorRaw) {
        return false;
      }
      return financiadorRaw.toUpperCase().includes(entry.nombre.toUpperCase());
    });
    const financiadorCatalogo = byId ?? byName ?? CATALOGO_FINANCIADORES[CATALOGO_FINANCIADORES.length - 1];
    const planCatalogo = item.planId
      ? financiadorCatalogo.planes.find(plan => plan.id === item.planId)
      : financiadorCatalogo.planes.find(plan => plan.nombre.toUpperCase() === planRaw.toUpperCase());
    return {
      id: item.id || `fin-adm-${index + 1}`,
      financiadorId: item.financiadorId ?? financiadorCatalogo.id,
      planId: item.planId ?? planCatalogo?.id ?? financiadorCatalogo.planes[0]?.id ?? "",
      financiador: financiadorRaw || parsed.financiador || financiadorCatalogo.nombre,
      plan: planRaw || parsed.plan || planCatalogo?.nombre || financiadorCatalogo.planes[0]?.nombre || "General",
      numeroAfiliado: normalizarAfiliado(item.numeroAfiliado ?? ""),
      vigente: item.vigente
    };
  });
}

export function estadoAdmisionLabel(estado: string): string {
  switch (estado) {
    case "PROGRAMADO":
      return "Programado";
    case "EN_SALA_DE_ESPERA":
      return "En sala de espera";
    case "EN_ATENCION":
      return "En consulta";
    case "ATENDIDO":
      return "Atendido";
    case "NO_ATENDIDO":
      return "No atendido";
    case "EN_OBSERVACION":
      return "En observacion";
    case "PENDIENTE_DE_PAGO":
      return "Pendiente de pago";
    default:
      return estado;
  }
}

export function normalizarDocumento(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function normalizarFinanciador(value: string): string {
  const compact = value.replace(/\s+/g, " ").trim().toUpperCase();
  return compact === "-" ? "" : compact;
}

export function normalizarNombre(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9\s,]/g, " ").replace(/\s+/g, " ").trim();
}

export function parseDocumentoTurno(value: string): {
  tipoDocumento: string;
  numeroDocumento: string;
} | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-") {
    return null;
  }
  const parts = trimmed.split(/\s+/g).filter(part => part.length > 0);
  if (parts.length < 2) {
    return null;
  }
  return {
    tipoDocumento: parts[0].toUpperCase(),
    numeroDocumento: parts.slice(1).join("")
  };
}
