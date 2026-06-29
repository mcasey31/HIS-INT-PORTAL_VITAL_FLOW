# Setting de Convenios para valorizacion en Prefactura

## Objetivo

Definir un unico criterio operativo para resolver convenio, catalogo, regla y tarifario al momento de prefacturar.

Conclusion funcional validada:
- Maestros base en Estructura Interna.
- Setting efectivo en Convenios.
- Prefactura valoriza usando el setting de Convenios y reglas de precedencia.

## Alcance funcional

### Estructura Interna (maestros)

- Catalogos base de prestaciones.
- Tarifarios base por catalogo.
- Valores por prestacion y ambito dentro de cada tarifario.
- Modulos y composicion de modulos (prestacion disparadora e incluidas).

### Convenios (setting efectivo)

El setting efectivo por vigencia debe resolver estas dimensiones:
- Centro (prestador)
- Catalogo
- Financiador
- Plan
- Regla de facturacion
- Tarifario

## Mapeo con UAT (tablas reales)

### Relaciones contractuales

- sch_convenios.t_convenios
- sch_convenios.t_convenios_prestadores (convenio <-> centro)
- sch_convenios.t_convenios_planes (convenio <-> plan)
- sch_convenios.t_catalogos_convenios (convenio <-> catalogo)
- sch_convenios.t_tarifarios_convenios_planes (convenio_plan <-> tarifario)

Notas:
- Financiador se deriva de sch_convenios.t_planes.id_financiador.
- Tarifario nace en sch_convenios.t_tarifarios (id_catalogo + vigencia).

### Valorizacion de prestaciones

- sch_convenios.t_tarifarios_prestaciones_catalogos (precio por prestacion, ambito, tipo de calculo, vigencia)
- sch_convenios.t_tarifarios_componentes (detalle por componente)

### Modulos y reglas

- sch_convenios.t_prestaciones_catalogos (es_modulo, id_modulo)
- sch_convenios.t_modulos_prestaciones (inclusiones de modulo)
- sch_convenios.t_reglas_moduladas
- sch_convenios.t_reglas_moduladas_detalles
- sch_convenios.t_modulos_reglas
- sch_convenios.t_normas_convenios_planes

### Proceso en facturador

Procedimientos observados en UAT para prefactura:
- sp_prfr_actualizar_tarifario
- sp_prfr_actualizar_autorizacion
- sp_prfr_inicializar_modulos
- sp_prfr_iniciar_modulacion
- sp_prfr_procesar_modulos
- sp_prfr_valorizar_prestaciones
- sp_prfr_valorizar_incluidas_modulo
- sp_prfr_valorizar_medicamentos
- sp_prfr_valorizar_descartables

Funcion de consulta de valor:
- sch_facturador.fn_valor_tarifario(in_id_lote, in_id_prestacion_episodio)

## Proceso objetivo end-to-end

1. Ingreso episodio
- Llega episodio con centro, financiador, plan, ambito, fecha/hora, prestaciones y datos clinicos.

2. Resolucion de setting de convenio
- Encontrar convenio vigente por centro + plan.
- Validar relacion vigente con catalogo.
- Resolver tarifario vigente para ese convenio_plan.
- Resolver regla de facturacion vigente para ese convenio_plan.

3. Homologacion y convenimiento
- Determinar prestacion de catalogo aplicable.
- Verificar inclusion/exclusion por convenio_plan.

4. Aplicacion de reglas de precedencia
- Regla 1: si requiere autorizacion manual, usar valor manual.
- Regla 2: si dispara modulo, prestaciones incluidas de modulo valorizan a 0.
- Regla 3: si no aplica lo anterior, valorizar por tarifario (prestacion + ambito + vigencia).
- Regla 4: si no hay precio vigente, marcar error funcional para auditoria.

5. Generacion de prefactura
- Persistir valor neto, trazabilidad de origen de valor y estado de proceso.

## Precedencia de valorizacion (obligatoria)

Orden estricto de resolucion:
1) Autorizacion manual
2) Modulo / modulacion
3) Tarifario
4) Error por falta de precio

## Reglas de calidad de datos obligatorias

- No permitir solapamiento de vigencias para la misma clave de negocio.
- Clave sugerida para precio de prestacion:
  (id_tarifario, id_prestacion_catalogo, id_ambito, id_tipo_calculo, fecha_vigencia_inicio)
- Validar unicidad logica en importaciones para evitar duplicados funcionales.
- Registrar siempre motivo de valorizacion (manual, modulo, tarifario).

## Diseño tecnico recomendado para el proyecto local

Para simplificar resolucion y evitar joins ambiguos en runtime, crear una vista o tabla de setting efectivo:

Nombre sugerido:
- sch_convenios.v_setting_convenio_efectivo

Columnas minimas:
- id_setting
- id_prestador
- id_financiador
- id_plan
- id_catalogo
- id_convenio
- id_convenio_plan
- id_tarifario
- id_regla_facturacion
- fecha_vigencia_inicio
- fecha_vigencia_fin
- prioridad

Uso:
- Prefactura consulta una sola fuente para resolver setting.
- Luego aplica precedencia de valorizacion.

## Casos borde que deben cubrirse

- Convenio vigente sin tarifario vigente.
- Tarifario vigente sin precio para ambito del episodio.
- Multiples configuraciones vigentes para la misma combinacion centro + plan + fecha.
- Prestacion marcada como incluida en modulo y con precio tarifario cargado.
- Prestacion con autorizacion manual y precio tarifario simultaneo.
- Cambio de vigencia en mitad del periodo de prefactura.

## Checklist de implementacion

1. Definir contrato de setting efectivo en backend.
2. Exponer endpoint de simulacion de valorizacion por episodio.
3. Guardar trazabilidad de fuente de precio por prestacion.
4. Agregar validaciones de solapamiento de vigencias en ABM de convenios/tarifarios.
5. Agregar pruebas de regresion para autorizacion, modulo y tarifario.
