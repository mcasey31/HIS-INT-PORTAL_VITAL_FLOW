-- Fix: Use correct turno IDs matching the slot format (adm:agendaId:bloqueId:YYYYMMDD:HHMM)
DO $$
DECLARE
  v_agenda_id text := 'e09e02b8fa814c21bcbe2e0d84a3f7b4';
  v_bloque_id text := 'a4dc7a981ce7414f8f7e21208a17ef4e';
  v_fecha_str text := '20260628';
  patient_ids text[][] := ARRAY[
    ARRAY['d68532d6-7c06-402f-afc9-24a98abf7128', 'Martinez, Juan Carlos', 'DNI 27888999'],
    ARRAY['f5fc334e-478f-4cd9-8e76-8a953610822f', 'Fernandez, Pedro Alejandro', 'DNI 33444555'],
    ARRAY['a0000000-0000-0000-0000-000000000001', 'Gomez, Carlos', 'DNI 30123456'],
    ARRAY['a0000000-0000-0000-0000-000000000002', 'Lopez, Maria', 'DNI 27111222'],
    ARRAY['a0000000-0000-0000-0000-000000000003', 'Martinez, Jose', 'DNI 33445566'],
    ARRAY['10000000-0000-0000-0000-000000000001', 'Perez, Juan', 'DNI 12345678'],
    ARRAY['a0000000-0000-0000-0000-000000000005', 'Fernandez, Luis', 'DNI 35777888'],
    ARRAY['a0000000-0000-0000-0000-000000000006', 'Garcia, Laura', 'DNI 31666555'],
    ARRAY['a0000000-0000-0000-0000-000000000009', 'Diaz, Pablo', 'DNI 39999111'],
    ARRAY['a0000000-0000-0000-0000-000000000008', 'Ramirez, Sofia', 'DNI 35222333'],
    ARRAY['a0000000-0000-0000-0000-000000000004', 'Rodriguez, Ana', 'DNI 28999000'],
    ARRAY['1d1f2c87-6835-405f-843c-69481baf6c85', 'Silva, Gustavo Adrian', 'DNI 35123456'],
    ARRAY['b1000000-0000-0000-0000-000000000001', 'Acosta, Martin', 'DNI 40123456'],
    ARRAY['b1000000-0000-0000-0000-000000000002', 'Benitez, Rita', 'DNI 40234567'],
    ARRAY['b1000000-0000-0000-0000-000000000004', 'Dominguez, Elena', 'DNI 40456789']
  ];
  idx int;
  v_pid text;
  v_nombre text;
  v_doc text;
  v_turno_id text;
  v_hour int;
  v_min text;
  v_timestamp_str text;
  v_fecha_hora timestamptz;
  v_cupo_id uuid;
BEGIN
  -- Delete old records
  DELETE FROM sch_admision.turno_admision WHERE turno_id LIKE 'TURNO-a4dc7a98-%';
  DELETE FROM sch_turno.turno_paciente WHERE id LIKE 'TURNO-a4dc7a98-%';

  FOR idx IN 1..array_length(patient_ids, 1) LOOP
    v_pid := patient_ids[idx][1];
    v_nombre := patient_ids[idx][2];
    v_doc := patient_ids[idx][3];
    v_hour := 8 + (idx-1) / 2;
    v_min := LPAD(((idx-1) % 2 * 30)::text, 2, '0');
    v_turno_id := 'adm:' || v_agenda_id || ':' || v_bloque_id || ':' || v_fecha_str || ':' || LPAD(v_hour::text, 2, '0') || v_min;
    v_timestamp_str := LPAD(v_hour::text, 2, '0') || ':' || v_min || ':00';
    v_fecha_hora := ('2026-06-28 ' || v_timestamp_str)::timestamptz;

    -- Get cupo ID for this slot
    SELECT c.id INTO v_cupo_id
    FROM sch_agenda.cupo c
    WHERE c.bloque_id = v_bloque_id::uuid
      AND c.hora_inicio = ('2026-06-28 ' || v_timestamp_str || '-03')::timestamptz
    ORDER BY c.hora_inicio
    LIMIT 1;

    IF v_cupo_id IS NULL THEN
      RAISE NOTICE 'No cupo found for %', v_timestamp_str;
      CONTINUE;
    END IF;

    -- Update cupo estado
    UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = v_cupo_id;

    -- Insert turno_paciente with the correct ID format
    INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado)
    VALUES (
      v_turno_id,
      v_pid,
      'Rodriguez, Maria Laura',
      'Clinica Medica',
      'Centro Ambulatorio Central',
      v_fecha_hora,
      'AGENDADO'
    );

    -- Insert turno_admision
    INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
    VALUES (
      v_turno_id,
      v_pid,
      v_nombre,
      v_doc,
      'OSDE',
      'PROGRAMADO'
    );
  END LOOP;
END $$;
