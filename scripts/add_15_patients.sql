DO $$
DECLARE
  cupo_rec RECORD;
  patient_ids uuid[] := ARRAY[
    'd68532d6-7c06-402f-afc9-24a98abf7128',
    'f5fc334e-478f-4cd9-8e76-8a953610822f',
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000004',
    '1d1f2c87-6835-405f-843c-69481baf6c85',
    'b1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000004'
  ];
  idx int;
  pid uuid;
  p_rec RECORD;
  v_turno_id text;
  cupo_arr uuid[];
  slot_hour int;
  slot_min int;
BEGIN
  DELETE FROM sch_admision.turno_admision WHERE turno_id LIKE 'TURNO-a4dc7a98-%';
  DELETE FROM sch_turno.turno_paciente WHERE id LIKE 'TURNO-a4dc7a98-%';

  SELECT ARRAY_AGG(c.id ORDER BY c.hora_inicio) INTO cupo_arr
  FROM sch_agenda.cupo c
  WHERE c.bloque_id = 'a4dc7a98-1ce7-414f-8f7e-21208a17ef4e';

  FOR idx IN 1..array_length(cupo_arr, 1) LOOP
    pid := patient_ids[idx];
    v_turno_id := 'TURNO-a4dc7a98-' || LPAD(idx::text, 3, '0');

    SELECT apellido, nombre, numero_documento INTO p_rec
    FROM sch_persona.persona WHERE id = pid;

    UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = cupo_arr[idx];

    slot_hour := 8 + (idx-1) / 2;
    slot_min := (idx-1) % 2 * 30;

    INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado)
    VALUES (
      v_turno_id,
      pid,
      'Rodriguez, Maria Laura',
      'Clinica Medica',
      'Centro Ambulatorio Central',
      ('2026-06-28 ' || LPAD(slot_hour::text, 2, '0') || ':' || LPAD(slot_min::text, 2, '0') || ':00-03')::timestamptz,
      'AGENDADO'
    );

    INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
    VALUES (
      v_turno_id,
      pid,
      p_rec.apellido || ', ' || p_rec.nombre,
      'DNI ' || p_rec.numero_documento,
      'OSDE',
      'PROGRAMADO'
    );
  END LOOP;
END $$;
