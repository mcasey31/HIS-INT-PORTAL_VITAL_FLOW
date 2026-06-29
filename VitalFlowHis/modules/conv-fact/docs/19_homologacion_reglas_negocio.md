# Homologacion por Reglas de Negocio (Circuito HIS -> ODI)

## Circuito validado

1. Ingresa practica medica desde HIS (ej: 420101 Consulta Medica).
2. ODI recibe la practica y la asocia a prestacion ODI de catalogo (modulacion).
3. Se evalua si la prestacion ODI es modulo SI/NO.
4. En prefacturacion (proceso SP iniciar proceso factura), se resuelve homologacion al catalogo del financiador.
5. La homologacion puede ser:
   - directa
   - por clasificacion

## Reglas de negocio configurables

Las reglas de homologacion permiten definir criterio por:

- Centro
- Especialidad
- Complejidad
- Financiador
- Plan
- Edad Paciente (rango desde/hasta)
- Ambito
- Tipo de homologacion (directa/clasificacion)
- Valor de clasificacion (opcional)
- Prioridad de regla

## Modelo de regla

Cada regla define:

- Prestacion origen ODI
- Catalogo destino del financiador
- Prestacion destino del financiador
- Condiciones de contexto (campos anteriores)
- Prioridad

## Resolucion

El resolvedor busca reglas activas por:

- practica origen HIS (sistema_origen + codigo_origen)
- prestacion origen ODI (ya modulada)
- condiciones de contexto

Desempate:

1. mayor prioridad
2. mayor especificidad (cantidad de condiciones no nulas)
3. menor id

## Ejemplo de negocio

Caso SwissMedical:

- Practica HIS: 420101
- Ambito: Guardia
- Financiador: SwissMedical

Regla:

- Origen ODI: 420101
- Destino catalogo Swiss: 420104 Consulta en Guardia
- Ambito = Guardia
- Financiador = SwissMedical

Resultado:

- El motor devuelve la prestacion destino 420104 para prefacturar correctamente.
