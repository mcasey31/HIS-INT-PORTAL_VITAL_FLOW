# Arquitectura Multi-Cliente - Indice

## Objetivo
Documentar una estrategia implementable para operar VitalFlow HIS como plataforma multi-cliente (multi-tenant) sin duplicar codigo por institucion.

## Documentos
1. `01-arquitectura-multi-cliente.md`
- Arquitectura objetivo (front, back, datos, seguridad, observabilidad).
- Modelo de tenant y control de features por cliente.
- Flujo de request multi-tenant y lineamientos de implementacion.

2. `02-estrategia-aislamiento-datos.md`
- Opciones de aislamiento de datos.
- Recomendacion por etapa de madurez.
- Riesgos, mitigaciones y criterios de eleccion.

3. `03-onboarding-cliente-checklist.md`
- Checklist operativo para alta de cliente nuevo.
- Artefactos de configuracion por cliente.
- Flujo estandar de salida a QA y Produccion.

## Alcance
Este paquete cubre arquitectura y operacion. No reemplaza definiciones legales, contractuales ni regulatorias especificas por pais/provincia.
