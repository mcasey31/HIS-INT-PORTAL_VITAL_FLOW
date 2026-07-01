# Estrategia De Aislamiento De Datos Multi-Cliente

## 1. Objetivo
Definir como aislar datos entre clientes en VitalFlow HIS con equilibrio entre seguridad, costo y complejidad operativa.

## 2. Opciones De Aislamiento
## Opcion A: Base compartida, schema compartido, `tenant_id` por tabla
Ventajas:
1. Menor costo inicial.
2. Operacion simple en infraestructura.

Riesgos:
1. Mayor riesgo de fuga por error de query.
2. Auditoria y cumplimiento mas exigentes.
3. Migraciones mas delicadas.

Uso recomendado:
- MVP temprano o clientes de baja criticidad regulatoria.

## Opcion B: Base compartida, schema por cliente
Ventajas:
1. Muy buen balance seguridad/costo.
2. Menor riesgo de mezcla de datos.
3. Facil de operar con un solo motor DB.

Riesgos:
1. Complejidad media en migraciones por schema.
2. Mayor gestion de objetos DB.

Uso recomendado:
- Etapa de crecimiento con varios clientes (recomendado para VitalFlow HIS en etapa actual).

## Opcion C: Base por cliente
Ventajas:
1. Aislamiento maximo.
2. Mejor postura para compliance estricto.
3. Restore y DR por cliente.

Riesgos:
1. Mayor costo y overhead operativo.
2. Provisioning y monitoreo mas complejos.

Uso recomendado:
- Clientes enterprise con exigencias regulatorias o contractuales altas.

## 3. Recomendacion Practica Por Fases
1. Fase actual: Opcion B (schema por cliente).
2. Fase enterprise: migrar clientes premium a Opcion C (base por cliente).

## 4. Matriz De Decision
1. Si cliente exige aislamiento contractual fuerte: Opcion C.
2. Si cliente necesita salida rapida con buen aislamiento: Opcion B.
3. Si entorno es interno/no productivo: Opcion A temporal.

## 5. Controles Tecnicos Minimos
1. Migraciones versionadas por tenant/schema.
2. Scripts de provisioning idempotentes.
3. Backup por cliente (logico o fisico segun modelo).
4. Restore validado por cliente.
5. Auditoria con `tenant_id` en logs de aplicacion.

## 6. Estrategia De Migracion Entre Modelos
Si se inicia en B y luego se pasa a C:
1. Congelar ventana de cambios del cliente.
2. Exportar schema del cliente.
3. Importar en nueva base dedicada.
4. Validar checksums de entidades criticas.
5. Cambiar routing de conexion por tenant.
6. Ejecutar smoke tests funcionales.

## 7. Riesgos Y Mitigaciones
1. Riesgo: query sin filtro tenant en modelo compartido.
- Mitigacion: repositorios con guardas obligatorias + tests automatizados.

2. Riesgo: deriva de schemas por cliente.
- Mitigacion: pipeline de migraciones centralizado y versionado.

3. Riesgo: restore parcial inconsistente.
- Mitigacion: runbook de restauracion por cliente y pruebas mensuales.

## 8. Definicion De Listo
La estrategia de aislamiento queda implementada cuando:
1. Todo cliente tiene frontera de datos verificable.
2. Existe restore probado por cliente.
3. El pipeline aplica migraciones sin drift.
4. No existen hallazgos de acceso cruzado en QA de seguridad.
