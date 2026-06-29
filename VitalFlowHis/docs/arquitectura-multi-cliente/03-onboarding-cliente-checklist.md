# Onboarding De Cliente Nuevo - Checklist Operativo

## 1. Objetivo
Estandarizar el alta de un nuevo cliente en VitalFlow HIS con pasos repetibles, auditables y en menos de 1 dia operativo.

## 2. Entradas Requeridas
1. Nombre comercial del cliente.
2. Codigo unico de tenant (`tenant_code`).
3. Dominio/subdominio del cliente.
4. Modulos contratados.
5. Reglas operativas especiales.
6. Integraciones externas requeridas.
7. Contactos tecnicos y funcionales.

## 3. Provisioning Tecnico
1. Crear registro de tenant en configuracion maestra.
2. Crear espacio de datos (schema o base dedicada).
3. Ejecutar migraciones iniciales.
4. Aplicar seed de catalogos base.
5. Configurar feature flags por tenant.
6. Configurar branding.
7. Configurar usuarios iniciales y roles.

## 4. Seguridad
1. Generar secretos por cliente.
2. Cargar secretos en gestor seguro.
3. Configurar politicas de acceso y rotacion.
4. Verificar JWT con `tenant_id` correcto.

## 5. Integraciones
1. Configurar endpoints externos.
2. Cargar credenciales por tenant.
3. Validar conectividad y timeouts.
4. Ejecutar prueba de contrato por integracion.

## 6. Validacion Funcional Minima
1. Login y autorizacion por tenant.
2. Alta y busqueda de persona.
3. Agenda, disponibilidad y turno.
4. Admision y apertura de episodio.
5. Trazabilidad de auditoria.

## 7. Criterios De Go-Live
1. Smoke test funcional aprobado.
2. Monitoreo y alertas activos.
3. Backups programados.
4. Runbook de soporte compartido.
5. Aprobacion funcional del cliente.

## 8. Checklist De Operacion Continua
1. SLA y ventana de mantenimiento definidos.
2. Canal de incidentes activo.
3. Indicadores por tenant en dashboard.
4. Politica de versionado y comunicacion de cambios.

## 9. Artefactos Entregables
1. Ficha tecnica del tenant.
2. Configuracion versionada del cliente.
3. Evidencia de pruebas de onboarding.
4. Acta de salida a produccion.
