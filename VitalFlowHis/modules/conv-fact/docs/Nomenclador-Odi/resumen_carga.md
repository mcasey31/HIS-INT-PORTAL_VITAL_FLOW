# Resumen de carga - Nomenclador ODI

## Archivo origen

- `PRESTACIONES Nomenclador de Referencia ODI con procedimientos 20251229.xlsx`
- Hoja procesada: `IS`

## Mapeo usado

- Columna B: homologacion HIS / codigo de origen
- Columna C: descripcion de la practica origen HIS
- Columna D: codigo ODI de la prestacion
- Columna E: descripcion ODI
- Columna F: tipo de prestacion ODI
- Columna G: capitulo ODI

## Resultado de la carga

- Prestaciones ODI unicas creadas/actualizadas: 6625
- Homologaciones HIS cargadas: 7097
- Descripciones truncadas a 160 caracteres: 99
- Catalogo ODI destino: `ODI` (id 11)

## Observaciones

- Las prestaciones ODI se cargaron en `sch_convenios.t_prestaciones_catalogos`.
- Las homologaciones HIS se cargaron en `sch_convenios.t_homologaciones_prestaciones`.
- El codigo ODI se toma desde la columna D, tal como se pidio.
- El volumen total del libro original fue de 7098 filas de datos en la hoja `IS`.
