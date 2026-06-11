import { test, expect } from '@playwright/test';

test.describe('Ciclo Completo E2E: Agenda -> Turnos -> Admision -> Escritorio Clinico', () => {
  
  test('Flujo principal de paciente programado', async ({ page }) => {
    // 1. Inicio de Sesión
    await page.goto('/');
    
    // Asumimos que la pagina inicial redirige al login si no hay sesion
    await expect(page.getByRole('heading', { name: 'Iniciar sesion' })).toBeVisible({ timeout: 10000 });
    
    // IMPORTANTE: Reemplazar con credenciales de prueba validas en tu entorno
    await page.getByLabel('Usuario').fill('admin');
    await page.getByLabel('Contrasena').fill('admin123');
    await page.getByRole('button', { name: 'INGRESAR' }).click();

    // Verificamos que entramos a la Home (Accesos directos)
    await expect(page.getByRole('heading', { name: 'Accesos directos' })).toBeVisible();

    // 2. Agenda (Opcional visualizacion)
    // El flujo E2E inicia validando que exista agenda. Asumimos navegacion.
    await page.getByRole('button', { name: 'Agenda', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Agregar agenda' })).toBeVisible();
    // (Aca se podrian configurar dias y horarios si el test fuera de creacion de agenda)

    // 3. Turnos (HU 9743 + HU 9908)
    await page.goto('/turnos');
    await expect(page.getByRole('heading', { name: /Asignar turno/i })).toBeVisible();
    
    // Identificar Paciente
    await page.getByLabel('Numero de documento').fill('12345678'); // MOCK DOC
    await page.getByRole('button', { name: 'Buscar paciente' }).click();
    // Seleccionar candidato
    await page.getByRole('button', { name: /12345678/i }).first().click();

    // Seleccionar Financiador
    await page.getByLabel('Financiador y plan vigente').selectOption({ index: 1 });
    
    // Buscar Disponibilidad (Paso 2)
    // Seleccionamos primer centro, servicio y practica (asumiendo mocks)
    await page.locator('.turnos-checkbox-row input').first().check();
    await page.getByLabel('Servicio *').selectOption({ index: 1 });
    await page.getByLabel('Practica *').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Buscar disponibilidad' }).click();

    // Seleccionar Slot y Confirmar Turno
    await page.locator('.turnos-slot-btn').first().click();
    await page.getByRole('button', { name: 'CONFIRMAR ASIGNACION' }).click();
    
    // Verificamos modal de exito o mensaje
    await expect(page.getByText('Turno asignado exitosamente')).toBeVisible();

    // 4. Admisión (HU 12305)
    await page.goto('/admision');
    await expect(page.getByRole('heading', { name: 'Admision' })).toBeVisible();
    
    // Identificar el mismo paciente
    await page.getByLabel('Numero de documento').fill('12345678');
    await page.getByRole('button', { name: 'Buscar paciente' }).click();
    await page.getByRole('button', { name: /12345678/i }).first().click();

    // Validar Elegibilidad y Admitir
    const elegibilidadCheck = page.getByLabel(/Elegibilidad OK/i);
    if (await elegibilidadCheck.isVisible()) {
      await elegibilidadCheck.check();
    }
    
    await page.getByRole('button', { name: '+ ADMITIR PACIENTE' }).click();
    // Modal de confirmacion
    await page.getByRole('button', { name: 'Continuar' }).click(); // Paso 1
    
    const elegibilidadModalCheck = page.getByLabel(/Elegibilidad OK/i);
    if (await elegibilidadModalCheck.isVisible()) {
      await elegibilidadModalCheck.check();
    }
    await page.getByRole('button', { name: 'Confirmar admision' }).click(); // Paso 2
    await expect(page.getByText('Admision confirmada')).toBeVisible();

    // 5. Escritorio Clínico (HU 15122)
    await page.goto('/escritorio-clinico');
    await expect(page.getByRole('heading', { name: 'Escritorio clinico' })).toBeVisible();
    
    // Verificar que el paciente aparece en el listado
    await page.getByRole('button', { name: 'Actualizar listado' }).click();
    
    // Llamar paciente (Megáfono)
    const btnLlamar = page.getByRole('button', { name: 'Megafono' }).first();
    await expect(btnLlamar).toBeVisible();
    await btnLlamar.click();

    // Abrir Historia Clínica
    const btnHC = page.getByRole('button', { name: 'Abrir historia clinica' }).first();
    await btnHC.click();
    
    // Verificamos Panorámica
    await expect(page.getByRole('heading', { name: 'Panoramica de Historia Clinica' })).toBeVisible();
    
    // Agregamos una evolución
    await page.getByRole('button', { name: 'Agregar evolucion' }).click();
    await expect(page.getByRole('heading', { name: 'Agregar Evolucion Clinica' })).toBeVisible();
    
    await page.getByLabel('Motivo de consulta').fill('Control post E2E testing.');
    await page.getByRole('button', { name: 'Guardar y firmar' }).click();
    
    // Validar que se cerró el modal
    await expect(page.getByRole('heading', { name: 'Agregar Evolucion Clinica' })).toBeHidden();

    // Salir del encuentro
    await page.getByRole('button', { name: 'Salir' }).click();
    await page.getByLabel('Accion requerida').selectOption({ label: 'Finalizar atencion' });
    await page.getByRole('button', { name: 'Confirmar salida' }).click();
  });
});
