import type { FinanciadorPlanAdmision } from "./admisionApi";

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
