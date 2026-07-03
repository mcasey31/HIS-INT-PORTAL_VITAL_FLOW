# Integracion Receta Digital con RDIar

Fuente de referencia: https://hl7.org.ar/rdiar/site/index.html

## Alcance

Este proyecto implementa boton de acceso desde Panoramica (HU 22907) y prepara contexto de lanzamiento alineado a RDIar (FHIR R4, guia Argentina).

Este documento define tambien el plan backend para persistir recetas y dejar la integracion lista para interoperabilidad productiva.

## Actores RDIar y mapeo local

- Prescriptor: ODI (modulo Escritorio Clinico)
- Repositorio: sistema de Receta Digital externo
- Autorizador: financiador/cobertura (pendiente backend)
- Farmacia: fuera del alcance actual
- Bus RNSD: pendiente integracion backend

## Flujo implementado en front

1. Medico selecciona paciente en Panoramica.
2. Boton Receta Digital habilitado solo con paciente identificado.
3. Se abre sistema satelite con parametros:
   - `standard=RDIar`
   - `profile=RDI_Ar_0_2_5` (configurable)
   - `launch=<base64url json>` con contexto de paciente y atencion.

## Variables de entorno

- `VITE_RECETARIO_URL`: URL base del sistema recetario.
- `VITE_RECETARIO_PROFILE`: perfil/implementacion RDIar a informar en lanzamiento.

## Especificacion backend (pendiente implementacion)

### Objetivo

Persistir y auditar recetas desde ODI, generar payload interoperable RDIar y exponer consulta de recetas por paciente/encuentro.

### Arquitectura propuesta

1. Front envia contexto de prescripcion a backend ODI.
2. Backend valida datos minimos clinicos y de identidad.
3. Backend construye recursos FHIR R4 segun perfiles RDIar.
4. Backend persiste version canonica local de receta.
5. Backend publica en Repositorio/Bus RNSD (cuando aplique).
6. Backend registra respuesta externa y estado de sincronizacion.

### Contratos API sugeridos

Base path sugerido: `/api/v1/recetas`

- `POST /api/v1/recetas/draft`
  - Crea borrador local para una atencion.
- `POST /api/v1/recetas`
  - Registra receta definitiva y dispara integracion externa.
- `GET /api/v1/recetas/{recetaId}`
  - Devuelve detalle de receta y estado interoperabilidad.
- `GET /api/v1/recetas?pacienteId={id}`
  - Lista recetas de un paciente.
- `POST /api/v1/recetas/{recetaId}/anular`
  - Marca anulacion y emite evento/operacion correspondiente.

### Modelo de datos local sugerido

Schema sugerido: `sch_hca`

Tabla `receta_digital`
- `id` uuid pk
- `paciente_id` uuid not null
- `encuentro_id` uuid null
- `turno_id` uuid null
- `prescriptor_usuario_id` uuid not null
- `prescriptor_matricula` varchar(64) not null
- `organizacion_oid` varchar(128) not null
- `estado` varchar(40) not null
- `rdiar_profile` varchar(40) not null
- `fhir_bundle_json` jsonb not null
- `external_recipe_id` varchar(128) null
- `external_repository_uri` varchar(300) null
- `validacion_outcome_json` jsonb null
- `creado_en` timestamptz not null default now()
- `actualizado_en` timestamptz not null default now()

Tabla `receta_digital_item`
- `id` uuid pk
- `receta_id` uuid fk -> receta_digital(id)
- `medicamento_codigo` varchar(64) not null
- `medicamento_sistema` varchar(200) not null
- `medicamento_display` varchar(300) not null
- `dosis_texto` varchar(200) null
- `frecuencia_texto` varchar(200) null
- `duracion_dias` int null
- `indicacion` varchar(500) null
- `estado` varchar(40) not null

Tabla `receta_digital_evento`
- `id` uuid pk
- `receta_id` uuid fk -> receta_digital(id)
- `tipo_evento` varchar(40) not null
- `payload_json` jsonb null
- `creado_en` timestamptz not null default now()

Indices minimos
- `ix_receta_digital_paciente` (`paciente_id`, `creado_en` desc)
- `ix_receta_digital_estado` (`estado`)
- `ix_receta_digital_external` (`external_recipe_id`)

### Estados sugeridos de receta

- `BORRADOR`
- `VALIDADA_LOCAL`
- `PUBLICADA_REPOSITORIO`
- `RECHAZADA_VALIDACION`
- `ERROR_INTEGRACION`
- `ANULADA`

### Mapeo FHIR/RDIar minimo

Recursos a construir (bundle de receta):
- `Patient` (Datos de Paciente)
- `Practitioner` (Datos del Prescriptor)
- `Organization` (prestador)
- `MedicationRequest` (Datos de la Prescripcion)
- `Composition` o perfil de Registro de Receta segun guia vigente

Campos ODI a mapear inicialmente
- Paciente: nombre + documento (y luego pacienteId MPI)
- Prescriptor: usuario logueado + matricula
- Contexto: encuentro/turno/servicio/efector
- Items: medicamento, posologia, duracion, observaciones

### Seguridad

La guia remite a mecanismos de seguridad de RNSD/FHIR Core AR.

Para implementacion productiva:
- OAuth2 client credentials o flujo definido por RNSD
- JWT firmado para llamadas salientes
- Secrets en backend (no en frontend)
- Auditoria de acceso y trazabilidad por receta

### Estrategia de implementacion incremental

Fase 1
- Persistencia local completa (sin publicar externamente)
- Endpoints CRUD basicos
- Auditoria de eventos

Fase 2
- Adaptador de integracion RDIar (validacion + publicacion)
- Almacenamiento de `OperationOutcome` y ids externos

Fase 3
- Reintentos automaticos ante error transitorio
- Consulta federada por identificador de receta

Fase 4
- Dispensa y ciclo de vida completo interoperable

### Criterios de aceptacion backend sugeridos

- Se guarda receta local con items y trazabilidad.
- Se puede consultar receta por paciente y por id.
- Se conserva payload FHIR enviado/recibido.
- Se registran errores de integracion sin perder receta local.
- La anulacion deja evidencia auditable de motivo y usuario.

## Pendientes para conformidad completa RDIar

- Backend bridge para no exponer datos clinicos en query string.
- Autenticacion/autorizacion segun RNSD/FHIR Core AR (OAuth/JWT segun entorno objetivo).
- Construccion y envio de recursos FHIR conformantes:
  - Datos de Paciente
  - Datos del Prescriptor
  - Datos de la Prescripcion (MedicationRequest)
  - Registro de Receta
- Operaciones de validacion y registro en repositorio segun casos de uso RDIar.
- Pruebas de interoperabilidad usando coleccion Postman de la guia.

## Nota tecnica

La guia publicada en HL7 AR (v0.2.5) indica que RDIar define estructura, perfiles y casos de uso. Para cumplimiento productivo se recomienda mover el lanzamiento a un endpoint backend firmado y registrar auditoria de prescripcion.