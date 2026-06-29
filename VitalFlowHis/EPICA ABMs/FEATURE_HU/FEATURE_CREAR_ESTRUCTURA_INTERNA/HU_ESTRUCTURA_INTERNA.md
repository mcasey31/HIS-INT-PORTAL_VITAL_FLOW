# HU - Estructura Interna

## Trazabilidad
- Epic: EPICA ABMs
- Feature: FEATURE_CREAR_ESTRUCTURA_INTERNA
- Tipo: Product Backlog Item
- Estado: Draft

## User Story
Como administrador funcional
quiero un acceso directo Estructura Interna
para administrar en un arbol los catalogos estructurales y de personal del HIS.

## Descripcion funcional
El modulo Estructura Interna debe exponer un menu de arbol con estos nodos:
- Centro
- Servicio
- Financiadores/Planes
- Practicas
- Personal
  - Dispositivos
  - Profesionales
  - Grupo de Profesionales

La vista debe reflejar la dependencia principal del DER:
Centro -> Servicio -> Practica.

## Tablas y referencias DER
- Centro: sch_agenda.centro
- Servicio: sch_agenda.servicio (FK centro_id)
- Profesionales: sch_agenda.efector (tipo_efector = PROFESIONAL)
- Grupo de Profesionales: sch_agenda.grupo_profesional y sch_agenda.grupo_profesional_miembro
- Practicas: estado actual en practicas_json de sch_agenda.bloque_programacion, con objetivo de normalizacion
- Financiadores/Planes: tabla objetivo para catalogo operativo de cobertura
- Dispositivos: tabla objetivo para recursos tecnicos por centro/servicio

## Criterios de aceptacion
- Existe acceso directo Estructura Interna desde Home.
- El menu de arbol permite navegar por cada nodo y subnodo.
- Cada nodo expone campos de configuracion requeridos (actuales/objetivo) con nombre y tipo.
- Se visualiza explicitamente la regla Centro -> Servicio -> Practica.
- En Personal se puede abrir Dispositivos, Profesionales y Grupo de Profesionales.
