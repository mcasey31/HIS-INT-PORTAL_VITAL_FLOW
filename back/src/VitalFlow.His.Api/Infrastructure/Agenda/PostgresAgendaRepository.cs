using Npgsql;
using NpgsqlTypes;
using System.Text.Json;
using VitalFlow.His.Api.Domain.Agenda;

namespace VitalFlow.His.Api.Infrastructure.Agenda;

public sealed class PostgresAgendaRepository(string connectionString) : IAgendaRepository
{
    private sealed record StoredAppointmentPayload(
        string AppointmentId,
        string PatientId,
        string SlotId,
        string ScheduleId,
        string CentroId,
        string ServicioId,
        string EfectorId,
        string Start,
        string End,
        string Status,
        string? Reason,
        string? ExternalIdentifier
    );

    public AgendaSlotSearchResult SearchSlots(Guid scheduleId, string? status, DateTimeOffset? startFrom, DateTimeOffset? startTo, int count, int page)
    {
        var estados = MapToDbSlotStatuses(status);
        var offset = (Math.Max(page, 1) - 1) * Math.Max(count, 1);

        const string sqlCount = """
            select count(1)
            from sch_agenda.cupo c
            inner join sch_agenda.bloque_programacion b on b.id = c.bloque_id
            where b.agenda_id = @agenda_id
              and (@estado_count = 0 or c.estado = any(@estados))
              and (@start_from is null or c.hora_inicio >= @start_from)
              and (@start_to is null or c.hora_inicio < @start_to);
            """;

        const string sqlData = """
            select c.id,
                   b.agenda_id,
                   c.hora_inicio,
                   c.hora_fin,
                   c.estado,
                   c.capacidad,
                   c.overbooking_permitido,
                   b.lugar_atencion_id,
                   la.nombre,
                   a.nombre
            from sch_agenda.cupo c
            inner join sch_agenda.bloque_programacion b on b.id = c.bloque_id
            inner join sch_agenda.agenda a on a.id = b.agenda_id
            left join sch_agenda.lugar_atencion la on la.id = b.lugar_atencion_id
            where b.agenda_id = @agenda_id
              and (@estado_count = 0 or c.estado = any(@estados))
              and (@start_from is null or c.hora_inicio >= @start_from)
              and (@start_to is null or c.hora_inicio < @start_to)
            order by c.hora_inicio
            limit @limit offset @offset;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        var total = 0;
        using (var cmdCount = new NpgsqlCommand(sqlCount, conn))
        {
            cmdCount.Parameters.AddWithValue("agenda_id", scheduleId);
            cmdCount.Parameters.AddWithValue("estado_count", estados.Length);
            cmdCount.Parameters.AddWithValue("estados", estados);
            cmdCount.Parameters.Add(new NpgsqlParameter("start_from", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)startFrom ?? DBNull.Value
            });
            cmdCount.Parameters.Add(new NpgsqlParameter("start_to", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)startTo ?? DBNull.Value
            });
            total = Convert.ToInt32(cmdCount.ExecuteScalar());
        }

        var slots = new List<AgendaSlot>();
        using (var cmdData = new NpgsqlCommand(sqlData, conn))
        {
            cmdData.Parameters.AddWithValue("agenda_id", scheduleId);
            cmdData.Parameters.AddWithValue("estado_count", estados.Length);
            cmdData.Parameters.AddWithValue("estados", estados);
            cmdData.Parameters.Add(new NpgsqlParameter("start_from", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)startFrom ?? DBNull.Value
            });
            cmdData.Parameters.Add(new NpgsqlParameter("start_to", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)startTo ?? DBNull.Value
            });
            cmdData.Parameters.AddWithValue("limit", Math.Max(count, 1));
            cmdData.Parameters.AddWithValue("offset", Math.Max(offset, 0));

            using var reader = cmdData.ExecuteReader();
            while (reader.Read())
            {
                slots.Add(new AgendaSlot(
                    reader.GetGuid(0),
                    reader.GetGuid(1),
                    reader.GetFieldValue<DateTimeOffset>(2),
                    reader.GetFieldValue<DateTimeOffset>(3),
                    reader.GetString(4),
                    reader.IsDBNull(5) ? 1 : reader.GetInt32(5),
                    !reader.IsDBNull(6) && reader.GetBoolean(6),
                    reader.IsDBNull(7) ? null : reader.GetGuid(7),
                    reader.IsDBNull(8) ? null : reader.GetString(8),
                    reader.IsDBNull(9) ? null : reader.GetString(9)
                ));
            }
        }

        return new AgendaSlotSearchResult(total, slots);
    }

    public AgendaLocationSearchResult SearchLocations(string? name, bool? active, int count, int page)
    {
        var offset = (Math.Max(page, 1) - 1) * Math.Max(count, 1);

        const string sqlCount = """
            select count(1)
            from sch_agenda.lugar_atencion la
            where (@name is null or la.nombre ilike '%' || @name || '%')
              and (@active is null or la.activo = @active);
            """;

        const string sqlData = """
            select la.id,
                   la.nombre,
                   la.activo
            from sch_agenda.lugar_atencion la
            where (@name is null or la.nombre ilike '%' || @name || '%')
              and (@active is null or la.activo = @active)
            order by la.nombre
            limit @limit offset @offset;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        var total = 0;
        using (var cmdCount = new NpgsqlCommand(sqlCount, conn))
        {
            cmdCount.Parameters.Add(new NpgsqlParameter("name", NpgsqlDbType.Text)
            {
                Value = (object?)name?.Trim() ?? DBNull.Value
            });
            cmdCount.Parameters.Add(new NpgsqlParameter("active", NpgsqlDbType.Boolean)
            {
                Value = (object?)active ?? DBNull.Value
            });
            total = Convert.ToInt32(cmdCount.ExecuteScalar());
        }

        var locations = new List<AgendaLocation>();
        using (var cmdData = new NpgsqlCommand(sqlData, conn))
        {
            cmdData.Parameters.Add(new NpgsqlParameter("name", NpgsqlDbType.Text)
            {
                Value = (object?)name?.Trim() ?? DBNull.Value
            });
            cmdData.Parameters.Add(new NpgsqlParameter("active", NpgsqlDbType.Boolean)
            {
                Value = (object?)active ?? DBNull.Value
            });
            cmdData.Parameters.AddWithValue("limit", Math.Max(count, 1));
            cmdData.Parameters.AddWithValue("offset", Math.Max(offset, 0));

            using var reader = cmdData.ExecuteReader();
            while (reader.Read())
            {
                locations.Add(new AgendaLocation(
                    reader.GetGuid(0),
                    reader.GetString(1),
                    reader.GetBoolean(2)
                ));
            }
        }

        return new AgendaLocationSearchResult(total, locations);
    }

    public FhirAppointmentSearchResult SearchFhirAppointments(string? patientId, string? status, DateTimeOffset? dateFrom, DateTimeOffset? dateTo, int count, int page)
    {
        var offset = (Math.Max(page, 1) - 1) * Math.Max(count, 1);
        var dbStatuses = MapToDbAppointmentStatuses(status);

        const string sqlCount = """
            select count(1)
            from sch_turno.turno_paciente tp
            where (@patient_id is null or tp.paciente_id = @patient_id)
              and (@status_count = 0 or tp.estado = any(@statuses))
              and (@date_from is null or tp.fecha_hora >= @date_from)
              and (@date_to is null or tp.fecha_hora < @date_to);
            """;

        const string sqlData = """
            select tp.id,
                   tp.paciente_id,
                   tp.cupo_id,
                   b.agenda_id,
                   tp.centro_id,
                   tp.servicio_id,
                   tp.efector_id,
                   c.hora_inicio,
                   c.hora_fin,
                   tp.estado,
                   tp.motivo
            from sch_turno.turno_paciente tp
            inner join sch_agenda.cupo c on c.id = tp.cupo_id
            inner join sch_agenda.bloque_programacion b on b.id = c.bloque_id
            where (@patient_id is null or tp.paciente_id = @patient_id)
              and (@status_count = 0 or tp.estado = any(@statuses))
              and (@date_from is null or tp.fecha_hora >= @date_from)
              and (@date_to is null or tp.fecha_hora < @date_to)
            order by tp.fecha_hora desc
            limit @limit offset @offset;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        var total = 0;
        using (var cmdCount = new NpgsqlCommand(sqlCount, conn))
        {
            cmdCount.Parameters.Add(new NpgsqlParameter("patient_id", NpgsqlDbType.Text)
            {
                Value = (object?)patientId?.Trim() ?? DBNull.Value
            });
            cmdCount.Parameters.AddWithValue("status_count", dbStatuses.Length);
            cmdCount.Parameters.AddWithValue("statuses", dbStatuses);
            cmdCount.Parameters.Add(new NpgsqlParameter("date_from", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)dateFrom ?? DBNull.Value
            });
            cmdCount.Parameters.Add(new NpgsqlParameter("date_to", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)dateTo ?? DBNull.Value
            });
            total = Convert.ToInt32(cmdCount.ExecuteScalar());
        }

        var items = new List<FhirAppointmentRecord>();
        using (var cmdData = new NpgsqlCommand(sqlData, conn))
        {
            cmdData.Parameters.Add(new NpgsqlParameter("patient_id", NpgsqlDbType.Text)
            {
                Value = (object?)patientId?.Trim() ?? DBNull.Value
            });
            cmdData.Parameters.AddWithValue("status_count", dbStatuses.Length);
            cmdData.Parameters.AddWithValue("statuses", dbStatuses);
            cmdData.Parameters.Add(new NpgsqlParameter("date_from", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)dateFrom ?? DBNull.Value
            });
            cmdData.Parameters.Add(new NpgsqlParameter("date_to", NpgsqlDbType.TimestampTz)
            {
                Value = (object?)dateTo ?? DBNull.Value
            });
            cmdData.Parameters.AddWithValue("limit", Math.Max(count, 1));
            cmdData.Parameters.AddWithValue("offset", Math.Max(offset, 0));

            using var reader = cmdData.ExecuteReader();
            while (reader.Read())
            {
                items.Add(new FhirAppointmentRecord(
                    reader.GetString(0),
                    reader.GetString(1),
                    reader.GetGuid(2),
                    reader.GetGuid(3),
                    reader.GetGuid(4),
                    reader.GetGuid(5),
                    reader.GetGuid(6),
                    reader.GetFieldValue<DateTimeOffset>(7),
                    reader.GetFieldValue<DateTimeOffset>(8),
                    ToFhirAppointmentStatus(reader.IsDBNull(9) ? "PROGRAMADO" : reader.GetString(9)),
                    reader.IsDBNull(10) ? null : reader.GetString(10),
                    null
                ));
            }
        }

        return new FhirAppointmentSearchResult(total, items);
    }

    public FhirAppointmentCreateResult CreateFhirAppointment(FhirAppointmentCreateInput input)
    {
        const string sqlAdvisoryLock = "select pg_advisory_xact_lock(hashtext(@idempotency_key));";

        const string sqlReplay = """
            select response_body
            from sch_fhir.integration_audit
            where operation_name = 'FHIR_APPOINTMENT_CREATE'
              and idempotency_key = @idempotency_key
              and response_code in (200, 201)
            order by created_at desc
            limit 1;
            """;

        const string sqlSlot = """
            select c.id,
                   c.hora_inicio,
                   c.hora_fin,
                   c.estado,
                   a.id,
                   a.centro_id,
                   a.servicio_id,
                   a.efector_id,
                   coalesce(cen.nombre, ''),
                   coalesce(serv.nombre, ''),
                   coalesce(efe.nombre, '')
            from sch_agenda.cupo c
            inner join sch_agenda.bloque_programacion b on b.id = c.bloque_id
            inner join sch_agenda.agenda a on a.id = b.agenda_id
            inner join sch_agenda.centro cen on cen.id = a.centro_id
            inner join sch_agenda.servicio serv on serv.id = a.servicio_id
            inner join sch_agenda.efector efe on efe.id = a.efector_id
            where c.id = @slot_id
            for update;
            """;

        const string sqlReserveSlot = """
            update sch_agenda.cupo
            set estado = 'reservado',
                updated_at = now(),
                version = version + 1
            where id = @slot_id
              and estado = 'libre';
            """;

        const string sqlInsertTurno = """
            insert into sch_turno.turno_paciente
                (id, paciente_id, centro_id, servicio_id, efector_id, cupo_id, fecha_hora, estado, motivo, notas, updated_at)
            values
                (@id, @paciente_id, @centro_id, @servicio_id, @efector_id, @cupo_id, @fecha_hora, @estado, @motivo, @notas, now());
            """;

        const string sqlInsertAudit = """
            insert into sch_fhir.integration_audit
                (id, correlation_id, idempotency_key, operation_name, resource_type, resource_id,
                 request_method, request_path, request_body, response_code, response_body,
                 request_timestamp, response_timestamp, source_system, error_detail)
            values
                (@id, @correlation_id, @idempotency_key, 'FHIR_APPOINTMENT_CREATE', 'Appointment', @resource_id,
                 'POST', '/fhir/R4/Appointment', @request_body, @response_code, @response_body,
                 now(), now(), 'portal', @error_detail);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        using (var cmdLock = new NpgsqlCommand(sqlAdvisoryLock, conn, tx))
        {
            cmdLock.Parameters.AddWithValue("idempotency_key", input.IdempotencyKey);
            cmdLock.ExecuteNonQuery();
        }

        using (var cmdReplay = new NpgsqlCommand(sqlReplay, conn, tx))
        {
            cmdReplay.Parameters.AddWithValue("idempotency_key", input.IdempotencyKey);
            var replayBody = cmdReplay.ExecuteScalar() as string;
            if (!string.IsNullOrWhiteSpace(replayBody))
            {
                var replay = JsonSerializer.Deserialize<StoredAppointmentPayload>(replayBody);
                if (replay is not null
                    && Guid.TryParse(replay.SlotId, out var replaySlotId)
                    && Guid.TryParse(replay.ScheduleId, out var replayScheduleId)
                    && Guid.TryParse(replay.CentroId, out var replayCentroId)
                    && Guid.TryParse(replay.ServicioId, out var replayServicioId)
                    && Guid.TryParse(replay.EfectorId, out var replayEfectorId)
                    && DateTimeOffset.TryParse(replay.Start, out var replayStart)
                    && DateTimeOffset.TryParse(replay.End, out var replayEnd))
                {
                    tx.Commit();
                    return new FhirAppointmentCreateResult(
                        FhirAppointmentCreateStatus.IdempotentReplay,
                        new FhirAppointmentRecord(
                            replay.AppointmentId,
                            replay.PatientId,
                            replaySlotId,
                            replayScheduleId,
                            replayCentroId,
                            replayServicioId,
                            replayEfectorId,
                            replayStart,
                            replayEnd,
                            replay.Status,
                            replay.Reason,
                            replay.ExternalIdentifier
                        ),
                        null
                    );
                }
            }
        }

        Guid slotId;
        DateTimeOffset slotStart;
        DateTimeOffset slotEnd;
        string slotState;
        Guid scheduleId;
        Guid centroId;
        Guid servicioId;
        Guid efectorId;
        string centroNombre;
        string servicioNombre;
        string efectorNombre;

        using (var cmdSlot = new NpgsqlCommand(sqlSlot, conn, tx))
        {
            cmdSlot.Parameters.AddWithValue("slot_id", input.SlotId);
            using var reader = cmdSlot.ExecuteReader();
            if (!reader.Read())
            {
                reader.Close();
                tx.Rollback();
                return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.SlotNotFound, null, "Slot inexistente.");
            }

            slotId = reader.GetGuid(0);
            slotStart = reader.GetFieldValue<DateTimeOffset>(1);
            slotEnd = reader.GetFieldValue<DateTimeOffset>(2);
            slotState = reader.GetString(3);
            scheduleId = reader.GetGuid(4);
            centroId = reader.GetGuid(5);
            servicioId = reader.GetGuid(6);
            efectorId = reader.GetGuid(7);
            centroNombre = reader.GetString(8);
            servicioNombre = reader.GetString(9);
            efectorNombre = reader.GetString(10);
            reader.Close();
        }

        if (!slotState.Equals("libre", StringComparison.OrdinalIgnoreCase))
        {
            tx.Rollback();
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.SlotUnavailable, null, "El slot ya no esta libre.");
        }

        if (input.RequestedStart.HasValue && input.RequestedStart.Value != slotStart)
        {
            tx.Rollback();
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.ValidationError, null, "El inicio informado no coincide con el slot.");
        }

        if (input.RequestedEnd.HasValue && input.RequestedEnd.Value != slotEnd)
        {
            tx.Rollback();
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.ValidationError, null, "El fin informado no coincide con el slot.");
        }

        using (var cmdReserve = new NpgsqlCommand(sqlReserveSlot, conn, tx))
        {
            cmdReserve.Parameters.AddWithValue("slot_id", slotId);
            var affected = cmdReserve.ExecuteNonQuery();
            if (affected == 0)
            {
                tx.Rollback();
                return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.SlotUnavailable, null, "No se pudo reservar el slot.");
            }
        }

        var appointmentId = Guid.NewGuid().ToString("N");
        using (var cmdTurno = new NpgsqlCommand(sqlInsertTurno, conn, tx))
        {
            cmdTurno.Parameters.AddWithValue("id", appointmentId);
            cmdTurno.Parameters.AddWithValue("paciente_id", input.PatientId);
            cmdTurno.Parameters.AddWithValue("centro_id", centroId);
            cmdTurno.Parameters.AddWithValue("servicio_id", servicioId);
            cmdTurno.Parameters.AddWithValue("efector_id", efectorId);
            cmdTurno.Parameters.AddWithValue("cupo_id", slotId);
            cmdTurno.Parameters.AddWithValue("fecha_hora", slotStart);
            cmdTurno.Parameters.AddWithValue("estado", "PROGRAMADO");
            cmdTurno.Parameters.AddWithValue("motivo", (object?)input.Reason ?? DBNull.Value);
            cmdTurno.Parameters.AddWithValue("notas", DBNull.Value);
            cmdTurno.ExecuteNonQuery();
        }

        var appointment = new FhirAppointmentRecord(
            appointmentId,
            input.PatientId,
            slotId,
            scheduleId,
            centroId,
            servicioId,
            efectorId,
            slotStart,
            slotEnd,
            "booked",
            input.Reason,
            input.ExternalIdentifier
        );

        var responsePayload = JsonSerializer.Serialize(new StoredAppointmentPayload(
            appointment.AppointmentId,
            appointment.PatientId,
            appointment.SlotId.ToString(),
            appointment.ScheduleId.ToString(),
            appointment.CentroId.ToString(),
            appointment.ServicioId.ToString(),
            appointment.EfectorId.ToString(),
            appointment.Start.ToString("O"),
            appointment.End.ToString("O"),
            appointment.Status,
            appointment.Reason,
            appointment.ExternalIdentifier
        ));

        var requestPayload = JsonSerializer.Serialize(new
        {
            input.PatientId,
            SlotId = input.SlotId,
            Start = input.RequestedStart?.ToString("O"),
            End = input.RequestedEnd?.ToString("O"),
            input.Reason,
            input.ExternalIdentifier
        });

        using (var cmdAudit = new NpgsqlCommand(sqlInsertAudit, conn, tx))
        {
            cmdAudit.Parameters.AddWithValue("id", Guid.NewGuid());
            cmdAudit.Parameters.AddWithValue("correlation_id", input.CorrelationId);
            cmdAudit.Parameters.AddWithValue("idempotency_key", input.IdempotencyKey);
            cmdAudit.Parameters.AddWithValue("resource_id", appointmentId);
            cmdAudit.Parameters.AddWithValue("request_body", requestPayload);
            cmdAudit.Parameters.AddWithValue("response_code", 201);
            cmdAudit.Parameters.AddWithValue("response_body", responsePayload);
            cmdAudit.Parameters.AddWithValue("error_detail", DBNull.Value);
            cmdAudit.ExecuteNonQuery();
        }

        tx.Commit();
        return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.Created, appointment, null);
    }

    public FhirAppointmentRecord? GetFhirAppointmentById(string appointmentId)
    {
        const string sql = """
            select tp.id,
                   tp.paciente_id,
                   tp.cupo_id,
                   b.agenda_id,
                   tp.centro_id,
                   tp.servicio_id,
                   tp.efector_id,
                   c.hora_inicio,
                   c.hora_fin,
                   tp.estado,
                   tp.motivo
            from sch_turno.turno_paciente tp
            inner join sch_agenda.cupo c on c.id = tp.cupo_id
            inner join sch_agenda.bloque_programacion b on b.id = c.bloque_id
            where tp.id = @id
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", appointmentId.Trim());

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        var statusRaw = reader.IsDBNull(9) ? "PROGRAMADO" : reader.GetString(9);
        var status = statusRaw.Equals("PROGRAMADO", StringComparison.OrdinalIgnoreCase) ? "booked" : "cancelled";

        return new FhirAppointmentRecord(
            reader.GetString(0),
            reader.GetString(1),
            reader.GetGuid(2),
            reader.GetGuid(3),
            reader.GetGuid(4),
            reader.GetGuid(5),
            reader.GetGuid(6),
            reader.GetFieldValue<DateTimeOffset>(7),
            reader.GetFieldValue<DateTimeOffset>(8),
            status,
            reader.IsDBNull(10) ? null : reader.GetString(10),
            null
        );
    }

    private static string[] MapToDbSlotStatuses(string? fhirStatus)
    {
        if (string.IsNullOrWhiteSpace(fhirStatus))
        {
            return ["libre"];
        }

        return fhirStatus.Trim().ToLowerInvariant() switch
        {
            "free" => ["libre"],
            "busy" => ["reservado", "ocupado"],
            "busy-unavailable" => ["bloqueado"],
            _ => []
        };
    }

    private static string[] MapToDbAppointmentStatuses(string? fhirStatus)
    {
        if (string.IsNullOrWhiteSpace(fhirStatus))
        {
            return [];
        }

        return fhirStatus.Trim().ToLowerInvariant() switch
        {
            "booked" => ["PROGRAMADO"],
            "cancelled" => ["CANCELADO"],
            "fulfilled" => ["CUMPLIDO"],
            _ => []
        };
    }

    private static string ToFhirAppointmentStatus(string dbStatus)
    {
        return dbStatus.Trim().ToUpperInvariant() switch
        {
            "PROGRAMADO" => "booked",
            "CANCELADO" => "cancelled",
            "CUMPLIDO" => "fulfilled",
            _ => "booked"
        };
    }

    public IReadOnlyList<AgendaAggregate> GetAll()
    {
        const string sql = """
             select a.id, a.codigo, a.nombre,
                 a.centro_id, coalesce(c.nombre, ''),
                 a.servicio_id, coalesce(s.nombre, ''),
                 a.tipo_efector,
                 a.efector_id, coalesce(e.nombre, ''),
                 a.tipo_agenda,
                 a.visible_contact_center,
                 a.estado, a.fecha_desde, a.fecha_hasta, a.observacion,
                   coalesce(b.cnt, 0) as bloques,
                   coalesce(bl.cnt, 0) as bloqueos
            from sch_agenda.agenda a
             left join sch_agenda.centro c on c.id = a.centro_id
             left join sch_agenda.servicio s on s.id = a.servicio_id
             left join sch_agenda.efector e on e.id = a.efector_id
            left join (
                select agenda_id, count(*) as cnt
                from sch_agenda.bloque_programacion
                group by agenda_id
            ) b on b.agenda_id = a.id
            left join (
                select agenda_id, count(*) as cnt
                from sch_agenda.bloqueo_agenda
                group by agenda_id
            ) bl on bl.agenda_id = a.id
            order by a.codigo;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<AgendaAggregate>();
        while (reader.Read())
        {
            result.Add(new AgendaAggregate
            {
                Id = reader.GetGuid(0),
                Codigo = reader.GetString(1),
                Nombre = reader.GetString(2),
                CentroId = reader.GetGuid(3),
                CentroNombre = reader.GetString(4),
                ServicioId = reader.GetGuid(5),
                ServicioNombre = reader.GetString(6),
                TipoEfector = reader.GetString(7),
                EfectorId = reader.GetGuid(8),
                EfectorNombre = reader.GetString(9),
                TipoAgenda = reader.GetString(10),
                VisibleContactCenter = reader.GetBoolean(11),
                Activa = IsAgendaActiva(reader.GetString(12)),
                FechaDesde = reader.GetFieldValue<DateOnly>(13),
                FechaHasta = reader.IsDBNull(14) ? null : reader.GetFieldValue<DateOnly>(14),
                Observacion = reader.IsDBNull(15) ? null : reader.GetString(15)
            });

            var agenda = result[^1];
            var bloques = reader.GetInt32(16);
            var bloqueos = reader.GetInt32(17);
            for (var i = 0; i < bloques; i++)
            {
                agenda.Bloques.Add(new BloqueProgramacion { Id = Guid.Empty, IntervaloMinutos = 0 });
            }

            for (var i = 0; i < bloqueos; i++)
            {
                agenda.Bloqueos.Add(new BloqueoAgenda { Id = Guid.Empty, Tipo = "busy-unavailable" });
            }
        }

        return result;
    }

    public IReadOnlyList<PracticaData> GetPracticas(string? query)
    {
        var sql = """
            select id, nombre, duracion_minutos_sugerida, codigo_clinico
            from sch_agenda.practica
            where activa = true
            """;

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim();
            sql += """
                 and (strpos(upper(nombre), upper(@q)) > 0 or strpos(upper(codigo_clinico), upper(@q)) > 0)
                """;
            sql += " order by nombre limit 50;";
        }
        else
        {
            sql += " order by nombre;";
        }

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        if (!string.IsNullOrWhiteSpace(query))
        {
            cmd.Parameters.AddWithValue("q", query.Trim());
        }

        using var reader = cmd.ExecuteReader();
        var result = new List<PracticaData>();
        while (reader.Read())
        {
            result.Add(new PracticaData(
                reader.GetGuid(0),
                reader.GetString(1),
                reader.IsDBNull(2) ? null : reader.GetInt32(2),
                reader.IsDBNull(3) ? null : reader.GetString(3)));
        }

        return result;
    }

    public IReadOnlyList<LugarAtencionAgenda> GetLugaresAtencion(string? query)
    {
        var sql = """
            select id, nombre
            from sch_agenda.lugar_atencion
            where activo = true
            """;

        if (!string.IsNullOrWhiteSpace(query))
        {
            sql += " and upper(nombre) like '%' || upper(@query) || '%'";
        }

        sql += " order by nombre;";

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        if (!string.IsNullOrWhiteSpace(query))
        {
            cmd.Parameters.Add("query", NpgsqlDbType.Text).Value = query.Trim();
        }

        using var reader = cmd.ExecuteReader();
        var result = new List<LugarAtencionAgenda>();
        while (reader.Read())
        {
            result.Add(new LugarAtencionAgenda(reader.GetGuid(0), reader.GetString(1)));
        }

        return result;
    }

    public bool ExistsGrupoProfesionalByCodigo(string codigo, Guid? excludingGrupoId)
    {
        var sql = excludingGrupoId.HasValue
            ? """
                select count(1)
                from sch_agenda.grupo_profesional
                where upper(codigo) = upper(@codigo)
                  and id <> @excluding_id;
                """
            : """
                select count(1)
                from sch_agenda.grupo_profesional
                where upper(codigo) = upper(@codigo);
                """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("codigo", codigo);
        if (excludingGrupoId.HasValue)
        {
            cmd.Parameters.AddWithValue("excluding_id", excludingGrupoId.Value);
        }

        var count = Convert.ToInt32(cmd.ExecuteScalar());
        return count > 0;
    }

    public bool ExistsGrupoProfesionalByNombre(Guid centroId, Guid servicioId, string nombre, Guid? excludingGrupoId)
    {
        var sql = excludingGrupoId.HasValue
            ? """
                select count(1)
                from sch_agenda.grupo_profesional
                where centro_id = @centro_id
                  and servicio_id = @servicio_id
                  and upper(nombre) = upper(@nombre)
                  and id <> @excluding_id;
                """
            : """
                select count(1)
                from sch_agenda.grupo_profesional
                where centro_id = @centro_id
                  and servicio_id = @servicio_id
                  and upper(nombre) = upper(@nombre);
                """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", centroId);
        cmd.Parameters.AddWithValue("servicio_id", servicioId);
        cmd.Parameters.AddWithValue("nombre", nombre);
        if (excludingGrupoId.HasValue)
        {
            cmd.Parameters.AddWithValue("excluding_id", excludingGrupoId.Value);
        }

        var count = Convert.ToInt32(cmd.ExecuteScalar());
        return count > 0;
    }

    public GrupoProfesionalAggregate AddGrupoProfesional(GrupoProfesionalAggregate grupo)
    {
        const string sqlGrupo = """
            insert into sch_agenda.grupo_profesional
                (id, centro_id, servicio_id, codigo, nombre, descripcion, activo,
                 source_system, source_id, fhir_profile, created_by, updated_by)
            values
                (@id, @centro_id, @servicio_id, @codigo, @nombre, @descripcion, @activo,
                 @source_system, @source_id, @fhir_profile, @created_by, @updated_by);
            """;

        const string sqlMiembro = """
            insert into sch_agenda.grupo_profesional_miembro
                (id, grupo_profesional_id, efector_id, rol, orden, activo,
                 source_system, source_id, fhir_profile, created_by, updated_by)
            values
                (@id, @grupo_profesional_id, @efector_id, @rol, @orden, @activo,
                 @source_system, @source_id, @fhir_profile, @created_by, @updated_by);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        using (var cmdGrupo = new NpgsqlCommand(sqlGrupo, conn, tx))
        {
            cmdGrupo.Parameters.AddWithValue("id", grupo.Id);
            cmdGrupo.Parameters.AddWithValue("centro_id", grupo.CentroId);
            cmdGrupo.Parameters.AddWithValue("servicio_id", grupo.ServicioId);
            cmdGrupo.Parameters.AddWithValue("codigo", grupo.Codigo);
            cmdGrupo.Parameters.AddWithValue("nombre", grupo.Nombre);
            cmdGrupo.Parameters.AddWithValue("descripcion", (object?)grupo.Descripcion ?? DBNull.Value);
            cmdGrupo.Parameters.AddWithValue("activo", grupo.Activo);
            cmdGrupo.Parameters.AddWithValue("source_system", "vitalflow-his");
            cmdGrupo.Parameters.AddWithValue("source_id", grupo.Id.ToString());
            cmdGrupo.Parameters.AddWithValue("fhir_profile", "http://hl7.org/fhir/StructureDefinition/Group");
            cmdGrupo.Parameters.AddWithValue("created_by", "system");
            cmdGrupo.Parameters.AddWithValue("updated_by", "system");
            cmdGrupo.ExecuteNonQuery();
        }

        foreach (var miembro in grupo.Miembros)
        {
            using var cmdMiembro = new NpgsqlCommand(sqlMiembro, conn, tx);
            cmdMiembro.Parameters.AddWithValue("id", miembro.Id);
            cmdMiembro.Parameters.AddWithValue("grupo_profesional_id", grupo.Id);
            cmdMiembro.Parameters.AddWithValue("efector_id", miembro.EfectorId);
            cmdMiembro.Parameters.AddWithValue("rol", (object?)miembro.Rol ?? DBNull.Value);
            cmdMiembro.Parameters.AddWithValue("orden", (object?)miembro.Orden ?? DBNull.Value);
            cmdMiembro.Parameters.AddWithValue("activo", miembro.Activo);
            cmdMiembro.Parameters.AddWithValue("source_system", "vitalflow-his");
            cmdMiembro.Parameters.AddWithValue("source_id", miembro.Id.ToString());
            cmdMiembro.Parameters.AddWithValue("fhir_profile", "http://hl7.org/fhir/StructureDefinition/PractitionerRole");
            cmdMiembro.Parameters.AddWithValue("created_by", "system");
            cmdMiembro.Parameters.AddWithValue("updated_by", "system");
            cmdMiembro.ExecuteNonQuery();
        }

        tx.Commit();
        return grupo;
    }

    public AgendaAggregate? GetById(Guid agendaId)
    {
        const string sqlAgenda = """
            select a.id, a.codigo, a.nombre,
                   a.centro_id, coalesce(c.nombre, ''),
                   a.servicio_id, coalesce(s.nombre, ''),
                   a.tipo_efector,
                   a.efector_id, coalesce(e.nombre, ''),
                   a.tipo_agenda,
                   a.visible_contact_center,
                   a.estado, a.fecha_desde, a.fecha_hasta, a.observacion
            from sch_agenda.agenda
            a
            left join sch_agenda.centro c on c.id = a.centro_id
            left join sch_agenda.servicio s on s.id = a.servicio_id
            left join sch_agenda.efector e on e.id = a.efector_id
            where a.id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        AgendaAggregate? agenda = null;
        using (var cmd = new NpgsqlCommand(sqlAgenda, conn))
        {
            cmd.Parameters.AddWithValue("id", agendaId);
            using var reader = cmd.ExecuteReader();
            if (!reader.Read())
            {
                return null;
            }

            agenda = new AgendaAggregate
            {
                Id = reader.GetGuid(0),
                Codigo = reader.GetString(1),
                Nombre = reader.GetString(2),
                CentroId = reader.GetGuid(3),
                CentroNombre = reader.GetString(4),
                ServicioId = reader.GetGuid(5),
                ServicioNombre = reader.GetString(6),
                TipoEfector = reader.GetString(7),
                EfectorId = reader.GetGuid(8),
                EfectorNombre = reader.GetString(9),
                TipoAgenda = reader.GetString(10),
                VisibleContactCenter = reader.GetBoolean(11),
                Activa = IsAgendaActiva(reader.GetString(12)),
                FechaDesde = reader.GetFieldValue<DateOnly>(13),
                FechaHasta = reader.IsDBNull(14) ? null : reader.GetFieldValue<DateOnly>(14),
                Observacion = reader.IsDBNull(15) ? null : reader.GetString(15)
            };
        }

         const string sqlBloques = """
             select b.id, b.nombre, b.tipo_bloque, b.fecha_desde, b.fecha_hasta, b.atiende_feriados, b.dias_semana,
                 b.fecha, b.hora_inicio, b.hora_fin, b.duracion_turno_minutos, b.intervalo_minutos,
                 b.lugar_atencion_id, coalesce(l.nombre, ''), b.frecuencia, b.orden_mensual_semanas, b.sobreturnos, b.practicas_json, b.estado
             from sch_agenda.bloque_programacion b
             left join sch_agenda.lugar_atencion l on l.id = b.lugar_atencion_id
             where b.agenda_id = @agendaId;
             """;

        using (var cmdBloques = new NpgsqlCommand(sqlBloques, conn))
        {
            cmdBloques.Parameters.AddWithValue("agendaId", agendaId);
            using var reader = cmdBloques.ExecuteReader();
            while (reader.Read())
            {
                agenda.Bloques.Add(new BloqueProgramacion
                {
                    Id = reader.GetGuid(0),
                    Nombre = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                    TipoBloque = reader.IsDBNull(2) ? "FIJA" : reader.GetString(2),
                    FechaDesde = reader.IsDBNull(3) ? reader.GetFieldValue<DateOnly>(7) : reader.GetFieldValue<DateOnly>(3),
                    FechaHasta = reader.IsDBNull(4) ? reader.GetFieldValue<DateOnly>(7) : reader.GetFieldValue<DateOnly>(4),
                    AtiendeFeriados = !reader.IsDBNull(5) && reader.GetBoolean(5),
                    Fecha = reader.GetFieldValue<DateOnly>(7),
                    HoraInicio = reader.GetFieldValue<TimeOnly>(8),
                    HoraFin = reader.GetFieldValue<TimeOnly>(9),
                    DuracionTurnoMinutos = reader.IsDBNull(10) ? reader.GetInt32(11) : reader.GetInt32(10),
                    IntervaloMinutos = reader.GetInt32(11),
                    LugarAtencionId = reader.IsDBNull(12) ? Guid.Empty : reader.GetGuid(12),
                    LugarAtencionNombre = reader.IsDBNull(13) ? string.Empty : reader.GetString(13),
                    Frecuencia = reader.IsDBNull(14) ? "SEMANAL" : reader.GetString(14),
                    Sobreturnos = reader.IsDBNull(16) ? 0 : reader.GetInt32(16),
                    Activo = reader.IsDBNull(18) || IsBloqueActivo(reader.GetString(18))
                });
                if (!reader.IsDBNull(6))
                {
                    var dias = reader.GetString(6).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                    agenda.Bloques[^1].Dias.AddRange(dias);
                }

                if (!reader.IsDBNull(15))
                {
                    try
                    {
                        var semanas = JsonSerializer.Deserialize<List<int>>(reader.GetString(15));
                        if (semanas is not null)
                        {
                            agenda.Bloques[^1].OrdenMensualSemanas.AddRange(semanas);
                        }
                    }
                    catch
                    {
                        // no-op: keep compatibility with legacy values
                    }
                }

                if (!reader.IsDBNull(17))
                {
                    try
                    {
                        var practicas = JsonSerializer.Deserialize<List<BloquePractica>>(reader.GetString(17));
                        if (practicas is not null)
                        {
                            agenda.Bloques[^1].Practicas.AddRange(practicas.Where(p => !string.IsNullOrWhiteSpace(p.Nombre)));
                        }
                    }
                    catch
                    {
                        // no-op: keep compatibility with legacy values
                    }
                }
            }
        }

        const string sqlBloqueos = """
            select id, inicio, fin, tipo
            from sch_agenda.bloqueo_agenda
            where agenda_id = @agendaId;
            """;

        using (var cmdBloqueos = new NpgsqlCommand(sqlBloqueos, conn))
        {
            cmdBloqueos.Parameters.AddWithValue("agendaId", agendaId);
            using var reader = cmdBloqueos.ExecuteReader();
            while (reader.Read())
            {
                agenda.Bloqueos.Add(new BloqueoAgenda
                {
                    Id = reader.GetGuid(0),
                    Inicio = reader.GetFieldValue<DateTimeOffset>(1),
                    Fin = reader.GetFieldValue<DateTimeOffset>(2),
                    Tipo = reader.GetString(3)
                });
            }
        }

        return agenda;
    }

    public bool ExistsByCodigo(string codigo, Guid? excludingAgendaId)
    {
                var sql = excludingAgendaId.HasValue
                        ? """
                                select count(1)
                                from sch_agenda.agenda
                                where upper(codigo) = upper(@codigo)
                                    and id <> @excluding_id;
                                """
                        : """
                                select count(1)
                                from sch_agenda.agenda
                                where upper(codigo) = upper(@codigo);
                                """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("codigo", codigo);
        if (excludingAgendaId.HasValue)
        {
            cmd.Parameters.AddWithValue("excluding_id", excludingAgendaId.Value);
        }

        var count = Convert.ToInt32(cmd.ExecuteScalar());
        return count > 0;
    }

    public bool ExistsByNombre(string nombre, Guid? excludingAgendaId)
    {
                var sql = excludingAgendaId.HasValue
                        ? """
                                select count(1)
                                from sch_agenda.agenda
                                where upper(nombre) = upper(@nombre)
                                    and id <> @excluding_id;
                                """
                        : """
                                select count(1)
                                from sch_agenda.agenda
                                where upper(nombre) = upper(@nombre);
                                """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("nombre", nombre);
        if (excludingAgendaId.HasValue)
        {
            cmd.Parameters.AddWithValue("excluding_id", excludingAgendaId.Value);
        }

        var count = Convert.ToInt32(cmd.ExecuteScalar());
        return count > 0;
    }

    public IReadOnlyList<CentroAgenda> GetCentros()
    {
        const string sql = """
            select id, nombre
            from sch_agenda.centro
            order by nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<CentroAgenda>();
        while (reader.Read())
        {
            result.Add(new CentroAgenda(reader.GetGuid(0), reader.GetString(1)));
        }

        return result;
    }

    public IReadOnlyList<ServicioAgenda> GetServiciosByCentro(Guid centroId)
    {
        const string sql = """
            select id, centro_id, nombre
            from sch_agenda.servicio
            where centro_id = @centro_id
            order by nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", centroId);
        using var reader = cmd.ExecuteReader();

        var result = new List<ServicioAgenda>();
        while (reader.Read())
        {
            result.Add(new ServicioAgenda(reader.GetGuid(0), reader.GetGuid(1), reader.GetString(2)));
        }

        return result;
    }

    public IReadOnlyList<EfectorAgenda> GetEfectores(Guid centroId, Guid servicioId, string tipoEfector, string? query)
    {
                var sql = """
                        select id, centro_id, servicio_id, tipo_efector, nombre
                        from sch_agenda.efector
                        where centro_id = @centro_id
                            and servicio_id = @servicio_id
                            and upper(tipo_efector) = upper(@tipo_efector)
                        """;

                if (!string.IsNullOrWhiteSpace(query))
                {
                        sql += " and upper(nombre) like '%' || upper(@query) || '%'";
                }

                sql += " order by nombre;";

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", centroId);
        cmd.Parameters.AddWithValue("servicio_id", servicioId);
        cmd.Parameters.AddWithValue("tipo_efector", tipoEfector);
        if (!string.IsNullOrWhiteSpace(query))
        {
            cmd.Parameters.Add("query", NpgsqlDbType.Text).Value = query.Trim();
        }
        using var reader = cmd.ExecuteReader();

        var result = new List<EfectorAgenda>();
        while (reader.Read())
        {
            result.Add(new EfectorAgenda(
                reader.GetGuid(0),
                reader.GetGuid(1),
                reader.GetGuid(2),
                reader.GetString(3),
                reader.GetString(4)));
        }

        return result;
    }

    public IReadOnlyList<Guid> GetEfectorIdsByUsuario(Guid userId)
    {
        const string sql = """
            select id
            from sch_agenda.efector
            where usuario_id = @usuario_id
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("usuario_id", userId);
        using var reader = cmd.ExecuteReader();

        var result = new List<Guid>();
        while (reader.Read())
        {
            result.Add(reader.GetGuid(0));
        }

        return result;
    }

    public AgendaAggregate AddAgenda(AgendaAggregate agenda)
    {
        const string sql = """
            insert into sch_agenda.agenda
                (id, codigo, nombre, centro_id, servicio_id, tipo_efector, efector_id, tipo_agenda, visible_contact_center,
                 estado, fecha_desde, fecha_hasta, observacion, source_system, source_id, fhir_profile, created_by, updated_by)
            values
                (@id, @codigo, @nombre, @centro_id, @servicio_id, @tipo_efector, @efector_id, @tipo_agenda, @visible_contact_center,
                 @estado, @fecha_desde, @fecha_hasta, @observacion, @source_system, @source_id, @fhir_profile, @created_by, @updated_by);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", agenda.Id);
        cmd.Parameters.AddWithValue("codigo", agenda.Codigo);
        cmd.Parameters.AddWithValue("nombre", agenda.Nombre);
        cmd.Parameters.AddWithValue("centro_id", agenda.CentroId);
        cmd.Parameters.AddWithValue("servicio_id", agenda.ServicioId);
        cmd.Parameters.AddWithValue("tipo_efector", agenda.TipoEfector);
        cmd.Parameters.AddWithValue("efector_id", agenda.EfectorId);
        cmd.Parameters.AddWithValue("tipo_agenda", agenda.TipoAgenda);
        cmd.Parameters.AddWithValue("visible_contact_center", agenda.VisibleContactCenter);
        cmd.Parameters.AddWithValue("estado", agenda.Activa ? "VIGENTE" : "INACTIVA");
        cmd.Parameters.AddWithValue("fecha_desde", agenda.FechaDesde);
        cmd.Parameters.AddWithValue("fecha_hasta", (object?)agenda.FechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("observacion", (object?)agenda.Observacion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("source_system", "vitalflow-his");
        cmd.Parameters.AddWithValue("source_id", agenda.Id.ToString());
        cmd.Parameters.AddWithValue("fhir_profile", "http://hl7.org/fhir/StructureDefinition/Schedule");
        cmd.Parameters.AddWithValue("created_by", "system");
        cmd.Parameters.AddWithValue("updated_by", "system");

        cmd.ExecuteNonQuery();
        return agenda;
    }

    public bool UpdateAgenda(AgendaAggregate agenda)
    {
        const string sql = """
            update sch_agenda.agenda
            set codigo = @codigo,
                nombre = @nombre,
                centro_id = @centro_id,
                servicio_id = @servicio_id,
                tipo_efector = @tipo_efector,
                efector_id = @efector_id,
                tipo_agenda = @tipo_agenda,
                visible_contact_center = @visible_contact_center,
                estado = @estado,
                fecha_desde = @fecha_desde,
                fecha_hasta = @fecha_hasta,
                observacion = @observacion,
                updated_by = @updated_by,
                updated_at = now()
            where id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", agenda.Id);
        cmd.Parameters.AddWithValue("codigo", agenda.Codigo);
        cmd.Parameters.AddWithValue("nombre", agenda.Nombre);
        cmd.Parameters.AddWithValue("centro_id", agenda.CentroId);
        cmd.Parameters.AddWithValue("servicio_id", agenda.ServicioId);
        cmd.Parameters.AddWithValue("tipo_efector", agenda.TipoEfector);
        cmd.Parameters.AddWithValue("efector_id", agenda.EfectorId);
        cmd.Parameters.AddWithValue("tipo_agenda", agenda.TipoAgenda);
        cmd.Parameters.AddWithValue("visible_contact_center", agenda.VisibleContactCenter);
        cmd.Parameters.AddWithValue("estado", agenda.Activa ? "VIGENTE" : "INACTIVA");
        cmd.Parameters.AddWithValue("fecha_desde", agenda.FechaDesde);
        cmd.Parameters.AddWithValue("fecha_hasta", (object?)agenda.FechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("observacion", (object?)agenda.Observacion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("updated_by", "system");

        return cmd.ExecuteNonQuery() == 1;
    }

    public bool AddBloque(Guid agendaId, BloqueProgramacion bloque)
    {
        const string sql = """
            insert into sch_agenda.bloque_programacion
                (id, agenda_id, nombre, tipo_bloque, fecha_desde, fecha_hasta, atiende_feriados, dias_semana,
                  fecha, hora_inicio, hora_fin, duracion_turno_minutos, intervalo_minutos, practicas_json,
                 lugar_atencion_id, frecuencia, orden_mensual_semanas, sobreturnos,
                 estado, source_system, source_id, fhir_profile, created_by, updated_by)
            values
                (@id, @agenda_id, @nombre, @tipo_bloque, @fecha_desde, @fecha_hasta, @atiende_feriados, @dias_semana,
                  @fecha, @hora_inicio, @hora_fin, @duracion_turno_minutos, @intervalo_minutos, @practicas_json,
                 @lugar_atencion_id, @frecuencia, @orden_mensual_semanas, @sobreturnos,
                 @estado, @source_system, @source_id, @fhir_profile, @created_by, @updated_by);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", bloque.Id);
        cmd.Parameters.AddWithValue("agenda_id", agendaId);
        cmd.Parameters.AddWithValue("nombre", bloque.Nombre);
        cmd.Parameters.AddWithValue("tipo_bloque", bloque.TipoBloque);
        cmd.Parameters.AddWithValue("fecha_desde", bloque.FechaDesde);
        cmd.Parameters.AddWithValue("fecha_hasta", bloque.FechaHasta);
        cmd.Parameters.AddWithValue("atiende_feriados", bloque.AtiendeFeriados);
        cmd.Parameters.AddWithValue("dias_semana", string.Join(',', bloque.Dias));
        cmd.Parameters.AddWithValue("fecha", bloque.Fecha);
        cmd.Parameters.AddWithValue("hora_inicio", bloque.HoraInicio);
        cmd.Parameters.AddWithValue("hora_fin", bloque.HoraFin);
        cmd.Parameters.AddWithValue("duracion_turno_minutos", bloque.DuracionTurnoMinutos);
        cmd.Parameters.AddWithValue("intervalo_minutos", bloque.IntervaloMinutos);
        cmd.Parameters.AddWithValue("practicas_json", JsonSerializer.Serialize(bloque.Practicas));
        cmd.Parameters.AddWithValue("lugar_atencion_id", bloque.LugarAtencionId);
        cmd.Parameters.AddWithValue("frecuencia", bloque.Frecuencia);
        cmd.Parameters.AddWithValue("orden_mensual_semanas", JsonSerializer.Serialize(bloque.OrdenMensualSemanas));
        cmd.Parameters.AddWithValue("sobreturnos", bloque.Sobreturnos);
        cmd.Parameters.AddWithValue("estado", bloque.Activo ? "VIGENTE" : "INACTIVO");
        cmd.Parameters.AddWithValue("source_system", "vitalflow-his");
        cmd.Parameters.AddWithValue("source_id", bloque.Id.ToString());
        cmd.Parameters.AddWithValue("fhir_profile", "http://hl7.org/fhir/StructureDefinition/Slot");
        cmd.Parameters.AddWithValue("created_by", "system");
        cmd.Parameters.AddWithValue("updated_by", "system");

        try
        {
            return cmd.ExecuteNonQuery() == 1;
        }
        catch (PostgresException ex) when (ex.SqlState == "23503")
        {
            return false;
        }
    }

    public bool UpdateBloque(Guid agendaId, BloqueProgramacion bloque)
    {
        const string sql = """
            update sch_agenda.bloque_programacion
            set fecha = @fecha,
                hora_inicio = @hora_inicio,
                hora_fin = @hora_fin,
                intervalo_minutos = @intervalo_minutos,
                updated_by = @updated_by,
                updated_at = now()
            where id = @id
              and agenda_id = @agenda_id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", bloque.Id);
        cmd.Parameters.AddWithValue("agenda_id", agendaId);
        cmd.Parameters.AddWithValue("fecha", bloque.Fecha);
        cmd.Parameters.AddWithValue("hora_inicio", bloque.HoraInicio);
        cmd.Parameters.AddWithValue("hora_fin", bloque.HoraFin);
        cmd.Parameters.AddWithValue("intervalo_minutos", bloque.IntervaloMinutos);
        cmd.Parameters.AddWithValue("updated_by", "system");

        return cmd.ExecuteNonQuery() == 1;
    }

    public bool UpdateBloquePracticas(Guid agendaId, Guid bloqueId, IReadOnlyList<BloquePractica> practicas)
    {
        const string sql = """
            update sch_agenda.bloque_programacion
            set practicas_json = @practicas_json,
                updated_by = @updated_by,
                updated_at = now()
            where id = @bloque_id
              and agenda_id = @agenda_id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("bloque_id", bloqueId);
        cmd.Parameters.AddWithValue("agenda_id", agendaId);
        cmd.Parameters.AddWithValue("practicas_json", JsonSerializer.Serialize(practicas));
        cmd.Parameters.AddWithValue("updated_by", "system");

        return cmd.ExecuteNonQuery() == 1;
    }

    public bool AddBloqueo(Guid agendaId, BloqueoAgenda bloqueo)
    {
        const string sql = """
            insert into sch_agenda.bloqueo_agenda
                (id, agenda_id, inicio, fin, motivo_codigo, tipo, source_system, source_id, fhir_profile, created_by, updated_by)
            values
                (@id, @agenda_id, @inicio, @fin, @motivo_codigo, @tipo, @source_system, @source_id, @fhir_profile, @created_by, @updated_by);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", bloqueo.Id);
        cmd.Parameters.AddWithValue("agenda_id", agendaId);
        cmd.Parameters.AddWithValue("inicio", bloqueo.Inicio);
        cmd.Parameters.AddWithValue("fin", bloqueo.Fin);
        cmd.Parameters.AddWithValue("motivo_codigo", (object)"SYSTEM");
        cmd.Parameters.AddWithValue("tipo", bloqueo.Tipo);
        cmd.Parameters.AddWithValue("source_system", "vitalflow-his");
        cmd.Parameters.AddWithValue("source_id", bloqueo.Id.ToString());
        cmd.Parameters.AddWithValue("fhir_profile", "http://hl7.org/fhir/StructureDefinition/Slot");
        cmd.Parameters.AddWithValue("created_by", "system");
        cmd.Parameters.AddWithValue("updated_by", "system");

        try
        {
            return cmd.ExecuteNonQuery() == 1;
        }
        catch (PostgresException ex) when (ex.SqlState == "23503")
        {
            return false;
        }
    }

    private static bool IsAgendaActiva(string estado)
    {
        return string.Equals(estado, "VIGENTE", StringComparison.OrdinalIgnoreCase)
            || string.Equals(estado, "ACTIVA", StringComparison.OrdinalIgnoreCase)
            || string.Equals(estado, "ACTIVO", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsBloqueActivo(string estado)
    {
        return string.Equals(estado, "VIGENTE", StringComparison.OrdinalIgnoreCase)
            || string.Equals(estado, "ACTIVO", StringComparison.OrdinalIgnoreCase)
            || string.Equals(estado, "ACTIVA", StringComparison.OrdinalIgnoreCase);
    }
}

