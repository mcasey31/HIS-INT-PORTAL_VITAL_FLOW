import { expect, Page, test } from "@playwright/test";

type MockTurno = {
  id: string;
  turno: string;
  llegada: string | null;
  paciente: string;
  documento: string;
  financiador: string;
  servicio: string;
  efector: string;
  estado: string;
};

type MockState = {
  turnos: MockTurno[];
  encuentroPorTurno: Record<string, { encuentroId: string; estado: string; pacienteId: string }>;
  evolucionesPorPaciente: Record<string, Array<{ evolucionId: string; fechaAtencion: string; especialidad: string; profesional: string; problemasAsociados: string[] }>>;
};

function createMockState(): MockState {
  const turnoId = "turno-e2e-1";
  const pacienteId = "paciente-e2e-1";

  return {
    turnos: [
      {
        id: turnoId,
        turno: "31/05/2026 10:30",
        llegada: "31/05/2026 10:15",
        paciente: "Roberto Jose Clipper",
        documento: "DNI 30111999",
        financiador: "OSDE 210",
        servicio: "Clinica medica",
        efector: "Dra. Casey",
        estado: "EN_SALA_DE_ESPERA"
      }
    ],
    encuentroPorTurno: {
      [turnoId]: {
        encuentroId: "enc-e2e-1",
        estado: "ABIERTO",
        pacienteId
      }
    },
    evolucionesPorPaciente: {
      [pacienteId]: []
    }
  };
}

async function fulfillJson(route: { fulfill: (payload: { status: number; contentType: string; body: string }) => Promise<void> }, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

async function mockEscritorioApi(page: Page, state: MockState): Promise<void> {
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const method = request.method().toUpperCase();
    const url = new URL(request.url());
    const { pathname } = url;

    if (method === "GET" && pathname === "/api/v1/admision/landing/selectores") {
      await fulfillJson(route, {
        servicios: [{ id: "srv-1", nombre: "Clinica medica" }],
        practicas: [{ id: "pr-1", nombre: "Consulta clinica", servicioId: "srv-1" }],
        tiposEfector: ["PROFESIONAL"],
        efectores: [{ id: "ef-1", nombre: "Dra. Casey", tipoEfector: "PROFESIONAL", servicioId: "srv-1" }],
        estados: ["EN_SALA_DE_ESPERA", "EN_ATENCION", "ATENDIDO", "NO_ATENDIDO", "EN_OBSERVACION"]
      });
      return;
    }

    if (method === "POST" && pathname === "/api/v1/admision/landing/buscar") {
      await fulfillJson(route, state.turnos);
      return;
    }

    const encuentroMatch = pathname.match(/^\/api\/v1\/admision\/turnos\/([^/]+)\/encuentro$/);
    if (method === "GET" && encuentroMatch) {
      const turnoId = decodeURIComponent(encuentroMatch[1]);
      const encuentro = state.encuentroPorTurno[turnoId];
      if (!encuentro) {
        await fulfillJson(route, { message: "Encuentro no encontrado" }, 404);
        return;
      }

      await fulfillJson(route, {
        encuentroId: encuentro.encuentroId,
        turnoId,
        pacienteId: encuentro.pacienteId,
        estado: encuentro.estado,
        creadoEn: "2026-05-31T10:15:00"
      });
      return;
    }

    const evolucionesMatch = pathname.match(/^\/api\/v1\/historia-clinica\/pacientes\/([^/]+)\/evoluciones-ambulatorias$/);
    if (method === "GET" && evolucionesMatch) {
      const pacienteId = decodeURIComponent(evolucionesMatch[1]);
      await fulfillJson(route, state.evolucionesPorPaciente[pacienteId] ?? []);
      return;
    }

    const estadoMatch = pathname.match(/^\/api\/v1\/admision\/turnos\/([^/]+)\/estado$/);
    if (method === "POST" && estadoMatch) {
      const turnoId = decodeURIComponent(estadoMatch[1]);
      const turno = state.turnos.find((item) => item.id === turnoId);
      if (!turno) {
        await fulfillJson(route, { message: "Turno no encontrado" }, 404);
        return;
      }

      const payload = request.postDataJSON() as { estado?: string; motivo?: string };
      turno.estado = payload.estado || turno.estado;

      await fulfillJson(route, {
        turnoId,
        estado: turno.estado,
        motivo: payload.motivo || null
      });
      return;
    }

    const cierreMatch = pathname.match(/^\/api\/v1\/admision\/turnos\/([^/]+)\/encuentro\/cerrar$/);
    if (method === "POST" && cierreMatch) {
      const turnoId = decodeURIComponent(cierreMatch[1]);
      const turno = state.turnos.find((item) => item.id === turnoId);
      const encuentro = state.encuentroPorTurno[turnoId];

      if (!turno || !encuentro) {
        await fulfillJson(route, { message: "No se encontro el encuentro para cerrar" }, 404);
        return;
      }

      const payload = request.postDataJSON() as { estadoPacienteFinal?: "ATENDIDO" | "NO_ATENDIDO"; motivo?: string };
      const estadoFinal = payload.estadoPacienteFinal || "ATENDIDO";

      turno.estado = estadoFinal;
      encuentro.estado = "CERRADO";

      await fulfillJson(route, {
        encuentroId: encuentro.encuentroId,
        turnoId,
        estadoEncuentro: "CERRADO",
        estadoPacienteFinal: estadoFinal,
        cerradoEn: "2026-05-31T11:05:00",
        motivo: payload.motivo || null
      });
      return;
    }

    await route.continue();
  });
}

test("HU 11775: no permite cerrar encuentro sin evolucion y permite cerrar luego de guardarla", async ({ page }) => {
  const state = createMockState();
  await mockEscritorioApi(page, state);

  await page.goto("/");

  // Paso 1: Entrar a cualquier módulo para que aparezca el module-switcher
  await page.locator(".home-access-link").first().click();

  // Paso 2: Navegar a Escritorio clinico vía module-switcher
  const switcherBtn = page.locator(".module-switcher button", { hasText: "Escritorio clinico" });
  await expect(switcherBtn).toBeVisible();
  await switcherBtn.click();

  // El módulo tiene 1 servicio → auto-selecciona, no aparece modal de servicio.
  // Esperar a que el listado cargue con el turno mockeado.
  await expect(page.getByText("Roberto Jose Clipper")).toBeVisible();

  // Paso 3: Abrir Historia Clínica del paciente
  // El panel hc-panoramica (siempre en el DOM) cubre el botón HC en viewport headless.
  // Usamos evaluate() para disparar el click nativo directamente sobre el elemento.
  const hcBtn = page.getByRole("button", { name: "Abrir historia clinica" });
  await expect(hcBtn).toBeVisible();
  await hcBtn.evaluate((el) => (el as HTMLButtonElement).click());

  // Paso 4: Esperar panorámica
  await expect(page.getByText(/Panoramica de Historia Clinica/i)).toBeVisible();

  // Paso 5: Llamar al paciente (lo mueve a EN_ATENCION)
  await page.getByRole("button", { name: "Llamar" }).click();
  await expect(page.getByText(/Estado:.*EN ATENCION/i)).toBeVisible();

  // Paso 6: Intentar Salir → "Cerrar encuentro" debe estar deshabilitado (sin evolución)
  await page.getByRole("button", { name: "Salir" }).click();
  const cerrarRadio = page.locator("label.hc-salida-option", { hasText: "Cerrar encuentro" }).locator("input[type='radio']");
  await expect(cerrarRadio).toBeDisabled();
  await expect(page.getByText(/Para cerrar encuentro o enviar a observaci/i)).toBeVisible();

  // Paso 7: Cerrar el modal
  await page.getByRole("button", { name: "Cancelar" }).click();

  // Paso 8: Agregar evolución
  await page.getByRole("button", { name: "Agregar evolucion" }).click();

  // Escribir en el editor contentEditable
  const editor = page.locator(".hc-evolucion-editor");
  await editor.click();
  await editor.pressSequentially("Paciente con buena evolucion clinica sin fiebre.");

  // Buscar y seleccionar etiqueta de problema (usa datos estáticos: "Hipertension arterial")
  await page.getByPlaceholder("Buscar problema (minimo 3 caracteres)").fill("hip");
  await expect(page.locator(".hc-tags-grid")).toBeVisible();
  await page.locator(".hc-tags-grid input[type='checkbox']").first().check();

  // Guardar evolución
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText(/Evolucion guardada correctamente/i)).toBeVisible();

  // Paso 9: Salir → ahora "Cerrar encuentro" debe estar habilitado
  await page.getByRole("button", { name: "Salir" }).click();
  await expect(cerrarRadio).toBeEnabled();

  // Paso 10: Seleccionar "Cerrar encuentro" y confirmar
  await cerrarRadio.check();
  await page.getByRole("button", { name: "Si, salir" }).click();

  // Verificar mensaje de éxito y que se cerró la vista de panorámica
  await expect(page.getByText(/Se cambió el estado del encuentro a Atendido/i)).toBeVisible();
  await expect(page.getByText(/Panoramica de Historia Clinica/i)).toHaveCount(0);
  expect(state.turnos[0].estado).toBe("ATENDIDO");
});
