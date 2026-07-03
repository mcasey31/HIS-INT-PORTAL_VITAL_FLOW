do $$
declare
    missing text[] := array[]::text[];
begin
    -- Critical tables required by HIS modules.
    if to_regclass('sch_persona.persona') is null then
        missing := array_append(missing, 'Missing table sch_persona.persona');
    end if;

    if to_regclass('sch_seguridad.usuario_sistema') is null then
        missing := array_append(missing, 'Missing table sch_seguridad.usuario_sistema');
    end if;

    if to_regclass('sch_agenda.agenda') is null then
        missing := array_append(missing, 'Missing table sch_agenda.agenda');
    end if;

    if to_regclass('sch_agenda.servicio') is null then
        missing := array_append(missing, 'Missing table sch_agenda.servicio');
    end if;

    if to_regclass('sch_agenda.efector') is null then
        missing := array_append(missing, 'Missing table sch_agenda.efector');
    end if;

    if to_regclass('sch_turno.turno_paciente') is null then
        missing := array_append(missing, 'Missing table sch_turno.turno_paciente');
    end if;

    if to_regclass('sch_admision.turno_admision') is null then
        missing := array_append(missing, 'Missing table sch_admision.turno_admision');
    end if;

    if to_regclass('sch_admision.encuentro') is null then
        missing := array_append(missing, 'Missing table sch_admision.encuentro');
    end if;

    if to_regclass('sch_administracion.t_paciente_financiador_plan') is null then
        missing := array_append(missing, 'Missing table sch_administracion.t_paciente_financiador_plan');
    end if;

    if to_regclass('sch_ubicacion.provincia') is null then
        missing := array_append(missing, 'Missing table sch_ubicacion.provincia');
    end if;

    if to_regclass('sch_ubicacion.localidad') is null then
        missing := array_append(missing, 'Missing table sch_ubicacion.localidad');
    end if;

    -- Critical columns for patient identity.
    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_persona'
          and table_name = 'persona'
          and column_name = 'numero_documento'
    ) then
        missing := array_append(missing, 'Missing column sch_persona.persona.numero_documento');
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_persona'
          and table_name = 'persona'
          and column_name = 'apellido'
    ) then
        missing := array_append(missing, 'Missing column sch_persona.persona.apellido');
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_persona'
          and table_name = 'persona'
          and column_name = 'nombre'
    ) then
        missing := array_append(missing, 'Missing column sch_persona.persona.nombre');
    end if;

    -- Critical columns for scheduling/admission. Accept either legacy text or normalized FK where needed.
    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_turno'
          and table_name = 'turno_paciente'
          and column_name = 'fecha_hora'
    ) then
        missing := array_append(missing, 'Missing column sch_turno.turno_paciente.fecha_hora');
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_turno'
          and table_name = 'turno_paciente'
          and column_name = 'estado'
    ) then
        missing := array_append(missing, 'Missing column sch_turno.turno_paciente.estado');
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_turno'
          and table_name = 'turno_paciente'
          and column_name in ('servicio', 'servicio_id')
    ) then
        missing := array_append(missing, 'Missing either sch_turno.turno_paciente.servicio or servicio_id');
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_turno'
          and table_name = 'turno_paciente'
          and column_name in ('profesional', 'efector_id')
    ) then
        missing := array_append(missing, 'Missing either sch_turno.turno_paciente.profesional or efector_id');
    end if;

    if array_length(missing, 1) is not null then
        raise exception using message = 'Schema contract failed: ' || array_to_string(missing, '; ');
    end if;
end $$;
