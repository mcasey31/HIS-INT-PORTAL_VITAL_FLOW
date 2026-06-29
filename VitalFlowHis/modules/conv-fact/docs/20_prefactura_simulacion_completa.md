# Simulacion Completa de Circuito Prefactura

## Objetivo

Ejecutar en un solo endpoint:

1. Entrada de practica HIS
2. Modulacion contra prestacion ODI
3. Homologacion por reglas complejas
4. Activacion de vinculo convenio-plan
5. Activacion de valorizacion tarifaria
6. Re-evaluacion final de readiness

## Endpoint

- POST /api/v1/prefactura/simular-completar-readiness

## Datos requeridos

- id_prestacion_origen_odi
- sistema_origen
- codigo_origen
- tipo_homologacion
- clasificacion_valor (opcional)
- centro
- especialidad
- complejidad
- financiador
- plan
- edad_paciente
- ambito
- codigo_convenio
- codigo_plan
- codigo_tarifario
- descripcion_tarifario
- valor_tarifario
- moneda_tarifario

## Respuesta

- simulacion:
  - entrada_his
  - modulacion_odi
  - homologacion_resuelta
  - readiness_prefactura (estado previo)
- activacion:
  - vinculo_convenio_plan
  - tarifario
  - valuacion_prestacion
- readiness_final

## Caso ejemplo validado

- Practica HIS: 420101
- Financiador: SwissMedical
- Ambito: Guardia
- Regla aplicada: destino 420104 Consulta en Guardia Swiss
- Resultado final: listo_prefactura = true
