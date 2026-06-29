# Product Brief Integral - EPICA ABMs

## Contexto
La epica ABMs centraliza la administracion de catalogos maestros y estructura interna del HIS.

- Epic nombre: ABMs
- Estado: Draft

## Objetivo de negocio
Disponer de un punto unico para configurar la estructura operativa (arbol de datos) que impacta en agenda, turnos y reglas de cobertura.

## Alcance inicial
- Acceso directo nuevo: Estructura Interna.
- Arbol de configuracion:
  - Centro
  - Servicio
  - Financiadores/Planes
  - Practicas
  - Personal
    - Dispositivos
    - Profesionales
    - Grupo de Profesionales
- Relacion principal DER: Centro -> Servicio -> Practica.

## Dependencias
- DER evolutivo: docs/der-modelo-datos-referencia-evolutivo.md
- DER FHIR/relacional: docs/der-fhir-relacional-overview-v2.md
- Migraciones relevantes: db/migrations/003_feature_7014_agenda_campos_y_asociaciones.sql y db/migrations/006_feature_11199_grupo_profesionales.sql

## Entregable funcional
Nuevo modulo de UI para configurar campos por nodo del arbol y dejar trazabilidad de tablas/campos objetivo por entidad.
