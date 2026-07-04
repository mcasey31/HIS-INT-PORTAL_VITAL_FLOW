using Npgsql;
using VitalFlow.His.Api.Application.Turnos.Repositories;

namespace VitalFlow.His.Api.Infrastructure.Turnos;

public sealed class PostgresTurnosRepository(string connectionString) : ITurnosRepository
{
    // ── paciente_financiador_plan ───────────────────────────────────────────

    public IReadOnlyList<CentroServicioActivoRow> GetCentrosConServiciosActivos()
    {
        const string sql = """
            select c.id,
                   c.nombre,
                   s.id,
                   s.nombre
            from sch_agenda.centro c
            inner join sch_agenda.servicio s on s.centro_id = c.id
            where c.activo = true
              and s.activo = true
            order by c.nombre, s.nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<CentroServicioActivoRow>();
        while (reader.Read())
        {
            result.Add(new CentroServicioActivoRow(
                reader.GetGuid(0),
                reader.GetString(1),
                reader.GetGuid(2),
                reader.GetString(3)
            ));
        }

        return result;
    }

    public IReadOnlyList<FinanciadorPlanCatalogoRow> GetFinanciadoresCatalogo()
    {
        const string sql = """
            select f.id,
                   coalesce(f.codigo, '') as financiador_codigo,
                   f.nombre as financiador_nombre,
                   fp.id,
                   coalesce(fp.codigo, '') as plan_codigo,
                   fp.nombre as plan_nombre
            from sch_persona.financiador_plan fp
            inner join sch_persona.financiador f on f.id = fp.financiador_id
            where f.activo = true
              and fp.activo = true
            order by f.nombre, fp.nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<FinanciadorPlanCatalogoRow>();
        while (reader.Read())
        {
            result.Add(new FinanciadorPlanCatalogoRow(
                reader.GetGuid(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetGuid(3),
                reader.GetString(4),
                reader.GetString(5)
            ));
        }

        return result;
    }

    public IReadOnlyList<PacienteFinanciadorPlanRow> GetFinanciadoresVigentesPaciente(Guid pacienteId)
    {
        const string sql = """
            select pf.id,
                   pf.paciente_id,
                   pf.financiador_id,
                   pf.plan_financiador_id,
                   f.nombre as financiador,
                   fp.nombre as plan,
                   pf.numero_afiliado,
                   pf.vigente
            from sch_administracion.t_paciente_financiador_plan pf
            inner join sch_persona.financiador f on f.id = pf.financiador_id
            inner join sch_persona.financiador_plan fp on fp.id = pf.plan_financiador_id
            where pf.paciente_id = @pacienteId
              and pf.vigente = true
              and (pf.fecha_hasta is null or pf.fecha_hasta >= current_date)
              and f.activo = true
              and fp.activo = true
            order by coalesce(pf.updated_at, pf.created_at) desc;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("pacienteId", pacienteId);
        using var reader = cmd.ExecuteReader();

        var result = new List<PacienteFinanciadorPlanRow>();
        while (reader.Read())
        {
            result.Add(new PacienteFinanciadorPlanRow(
                reader.GetGuid(0),
                reader.GetGuid(1),
                reader.GetGuid(2),
                reader.GetGuid(3),
                reader.GetString(4),
                reader.GetString(5),
                reader.IsDBNull(6) ? null : reader.GetString(6),
                reader.GetBoolean(7)
            ));
        }

        return result;
    }

    public void EnsurePacienteConCoberturaPrivadaPorDefecto(Guid pacienteId)
    {
        const string sqlExisteVigente = """
            select exists(
                select 1
                from sch_administracion.t_paciente_financiador_plan pf
                where pf.paciente_id = @pacienteId
                  and pf.vigente = true
                  and (pf.fecha_hasta is null or pf.fecha_hasta >= current_date)
            );
            """;

        const string sqlGetPrivadoPlan = """
            select f.id, fp.id
            from sch_persona.financiador f
            inner join sch_persona.financiador_plan fp on fp.financiador_id = f.id
            where upper(f.codigo) = 'PRIVADO_PARTICULAR'
              and upper(fp.codigo) = 'PRIVADO_PARTICULAR'
              and f.activo = true
              and fp.activo = true
            limit 1;
            """;

        const string sqlInsert = """
            insert into sch_administracion.t_paciente_financiador_plan (
                id,
                paciente_id,
                financiador_id,
                plan_financiador_id,
                numero_afiliado,
                fecha_desde,
                fecha_hasta,
                vigente,
                created_at,
                updated_at
            )
            values (
                @id,
                @pacienteId,
                @financiadorId,
                @planId,
                @numeroAfiliado,
                current_date,
                null,
                true,
                now(),
                now()
            );
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using (var cmdExiste = new NpgsqlCommand(sqlExisteVigente, conn))
        {
            cmdExiste.Parameters.AddWithValue("pacienteId", pacienteId);
            var existeVigente = (bool)cmdExiste.ExecuteScalar()!;
            if (existeVigente)
            {
                return;
            }
        }

        Guid financiadorId;
        Guid planId;
        using (var cmdPrivado = new NpgsqlCommand(sqlGetPrivadoPlan, conn))
        using (var reader = cmdPrivado.ExecuteReader())
        {
            if (!reader.Read())
            {
                throw new InvalidOperationException("No existe catalogo Privado Particular para alta automatica de paciente.");
            }

            financiadorId = reader.GetGuid(0);
            planId = reader.GetGuid(1);
        }

        using var cmdInsert = new NpgsqlCommand(sqlInsert, conn);
        cmdInsert.Parameters.AddWithValue("id", Guid.NewGuid());
        cmdInsert.Parameters.AddWithValue("pacienteId", pacienteId);
        cmdInsert.Parameters.AddWithValue("financiadorId", financiadorId);
        cmdInsert.Parameters.AddWithValue("planId", planId);
        cmdInsert.Parameters.AddWithValue("numeroAfiliado", "PARTICULAR");
        cmdInsert.ExecuteNonQuery();
    }

    public PacienteFinanciadorPlanRow GuardarFinanciadorPaciente(Guid pacienteId, Guid financiadorId, Guid planId, string? numeroAfiliado, Guid? reemplazarFinanciadorPlanId)
    {
                const string sqlGetFinanciadorCodigoByPacientePlan = """
                        select f.codigo
                        from sch_administracion.t_paciente_financiador_plan pf
                        inner join sch_persona.financiador f on f.id = pf.financiador_id
                        where pf.paciente_id = @pacienteId
                            and pf.id = @financiadorPlanPacienteId
                            and pf.vigente = true
                        limit 1;
                        """;

        const string sqlValidarPlan = """
            select exists(
                select 1
                from sch_persona.financiador_plan fp
                inner join sch_persona.financiador f on f.id = fp.financiador_id
                where fp.id = @planId
                  and fp.financiador_id = @financiadorId
                  and fp.activo = true
                  and f.activo = true
            );
            """;

        const string sqlFinalizar = """
            update sch_administracion.t_paciente_financiador_plan
            set vigente = false,
                fecha_hasta = current_date,
                updated_at = now()
            where paciente_id = @pacienteId
              and id = @reemplazarId
              and vigente = true;
            """;

        const string sqlInsert = """
            insert into sch_administracion.t_paciente_financiador_plan (
                id,
                paciente_id,
                financiador_id,
                plan_financiador_id,
                numero_afiliado,
                fecha_desde,
                fecha_hasta,
                vigente,
                created_at,
                updated_at
            )
            values (
                @id,
                @pacienteId,
                @financiadorId,
                @planId,
                @numeroAfiliado,
                current_date,
                null,
                true,
                now(),
                now()
            );
            """;

        const string sqlGet = """
            select pf.id,
                   pf.paciente_id,
                   pf.financiador_id,
                   pf.plan_financiador_id,
                   f.nombre as financiador,
                   fp.nombre as plan,
                   pf.numero_afiliado,
                   pf.vigente
            from sch_administracion.t_paciente_financiador_plan pf
            inner join sch_persona.financiador f on f.id = pf.financiador_id
            inner join sch_persona.financiador_plan fp on fp.id = pf.plan_financiador_id
            where pf.id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        using (var cmdValidar = new NpgsqlCommand(sqlValidarPlan, conn, tx))
        {
            cmdValidar.Parameters.AddWithValue("financiadorId", financiadorId);
            cmdValidar.Parameters.AddWithValue("planId", planId);
            var planValido = (bool)cmdValidar.ExecuteScalar()!;
            if (!planValido)
            {
                throw new InvalidOperationException("El plan no corresponde al financiador indicado o no esta activo.");
            }
        }

        if (reemplazarFinanciadorPlanId.HasValue)
        {
            using (var cmdGetFinanciadorCodigo = new NpgsqlCommand(sqlGetFinanciadorCodigoByPacientePlan, conn, tx))
            {
                cmdGetFinanciadorCodigo.Parameters.AddWithValue("pacienteId", pacienteId);
                cmdGetFinanciadorCodigo.Parameters.AddWithValue("financiadorPlanPacienteId", reemplazarFinanciadorPlanId.Value);
                var financiadorCodigoObj = cmdGetFinanciadorCodigo.ExecuteScalar();
                var financiadorCodigo = financiadorCodigoObj as string;
                if (string.Equals(financiadorCodigo, "PRIVADO_PARTICULAR", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException("El plan Privado Particular no puede perder vigencia.");
                }
            }

            using var cmdFinalizar = new NpgsqlCommand(sqlFinalizar, conn, tx);
            cmdFinalizar.Parameters.AddWithValue("pacienteId", pacienteId);
            cmdFinalizar.Parameters.AddWithValue("reemplazarId", reemplazarFinanciadorPlanId.Value);
            cmdFinalizar.ExecuteNonQuery();
        }

        var id = Guid.NewGuid();
        using (var cmdInsert = new NpgsqlCommand(sqlInsert, conn, tx))
        {
            cmdInsert.Parameters.AddWithValue("id", id);
            cmdInsert.Parameters.AddWithValue("pacienteId", pacienteId);
            cmdInsert.Parameters.AddWithValue("financiadorId", financiadorId);
            cmdInsert.Parameters.AddWithValue("planId", planId);
            cmdInsert.Parameters.AddWithValue("numeroAfiliado", (object?)numeroAfiliado?.Trim().ToUpperInvariant() ?? DBNull.Value);
            cmdInsert.ExecuteNonQuery();
        }

        PacienteFinanciadorPlanRow saved;
        using (var cmdGet = new NpgsqlCommand(sqlGet, conn, tx))
        {
            cmdGet.Parameters.AddWithValue("id", id);
            using var reader = cmdGet.ExecuteReader();
            if (!reader.Read())
            {
                throw new InvalidOperationException("No se pudo recuperar la cobertura guardada.");
            }

            saved = new PacienteFinanciadorPlanRow(
                reader.GetGuid(0),
                reader.GetGuid(1),
                reader.GetGuid(2),
                reader.GetGuid(3),
                reader.GetString(4),
                reader.GetString(5),
                reader.IsDBNull(6) ? null : reader.GetString(6),
                reader.GetBoolean(7)
            );
        }

        tx.Commit();
        return saved;
    }

    public void FinalizarVigenciaFinanciadorPaciente(Guid pacienteId, Guid financiadorPlanPacienteId)
    {
                const string sqlGetFinanciadorCodigoByPacientePlan = """
                        select f.codigo
                        from sch_administracion.t_paciente_financiador_plan pf
                        inner join sch_persona.financiador f on f.id = pf.financiador_id
                        where pf.paciente_id = @pacienteId
                            and pf.id = @id
                            and pf.vigente = true
                        limit 1;
                        """;

        const string sql = """
            update sch_administracion.t_paciente_financiador_plan
            set vigente = false,
                fecha_hasta = current_date,
                updated_at = now()
            where paciente_id = @pacienteId
              and id = @id
              and vigente = true;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using (var cmdGetFinanciadorCodigo = new NpgsqlCommand(sqlGetFinanciadorCodigoByPacientePlan, conn))
        {
            cmdGetFinanciadorCodigo.Parameters.AddWithValue("pacienteId", pacienteId);
            cmdGetFinanciadorCodigo.Parameters.AddWithValue("id", financiadorPlanPacienteId);
            var financiadorCodigoObj = cmdGetFinanciadorCodigo.ExecuteScalar();
            var financiadorCodigo = financiadorCodigoObj as string;
            if (string.Equals(financiadorCodigo, "PRIVADO_PARTICULAR", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("El plan Privado Particular no puede perder vigencia.");
            }
        }

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("pacienteId", pacienteId);
        cmd.Parameters.AddWithValue("id", financiadorPlanPacienteId);
        cmd.ExecuteNonQuery();
    }

    // ── turno_paciente ──────────────────────────────────────────────────────

    public IReadOnlyList<TurnoPacienteRow> GetTurnosPorPaciente(string pacienteId)
    {
        const string sql = """
            select tp.id,
                   tp.paciente_id,
                   coalesce(e.nombre, '') as profesional,
                   coalesce(s.nombre, '') as servicio,
                   coalesce(c.nombre, '') as centro,
                   tp.fecha_hora,
                   tp.estado,
                   tp.motivo,
                   tp.centro_id,
                   tp.servicio_id,
                   tp.efector_id,
                   tp.cupo_id
            from sch_turno.turno_paciente tp
            left join sch_agenda.efector e on e.id = tp.efector_id
            left join sch_agenda.servicio s on s.id = tp.servicio_id
            left join sch_agenda.centro c on c.id = tp.centro_id
            where tp.paciente_id = @pacienteId
            order by tp.fecha_hora
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("pacienteId", pacienteId);
        using var reader = cmd.ExecuteReader();

        var result = new List<TurnoPacienteRow>();
        while (reader.Read())
        {
            result.Add(ReadTurno(reader));
        }

        return result;
    }

    public IReadOnlyList<TurnoPacienteRow> GetTurnosAgendadosPorFecha(DateOnly fecha)
    {
        const string sql = """
            select tp.id,
                   tp.paciente_id,
                   coalesce(e.nombre, '') as profesional,
                   coalesce(s.nombre, '') as servicio,
                   coalesce(c.nombre, '') as centro,
                   tp.fecha_hora,
                   tp.estado,
                   tp.motivo,
                   tp.centro_id,
                   tp.servicio_id,
                   tp.efector_id,
                   tp.cupo_id
            from sch_turno.turno_paciente tp
            left join sch_agenda.efector e on e.id = tp.efector_id
            left join sch_agenda.servicio s on s.id = tp.servicio_id
            left join sch_agenda.centro c on c.id = tp.centro_id
            where upper(tp.estado) in ('AGENDADO', 'PROGRAMADO')
                and (tp.fecha_hora at time zone 'UTC')::date = @fecha
            order by tp.fecha_hora
            """;

        const string sqlLegacy = """
            select tp.id,
                   tp.paciente_id,
                   coalesce(tp.profesional, '') as profesional,
                   coalesce(tp.servicio, '') as servicio,
                   coalesce(tp.centro, '') as centro,
                   tp.fecha_hora,
                   tp.estado,
                   tp.motivo,
                   null::uuid as centro_id,
                   null::uuid as servicio_id,
                   null::uuid as efector_id,
                   null::uuid as cupo_id
            from sch_turno.turno_paciente tp
            where upper(tp.estado) in ('AGENDADO', 'PROGRAMADO')
                and (tp.fecha_hora at time zone 'UTC')::date = @fecha
            order by tp.fecha_hora
            """;

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("fecha", fecha);
            using var reader = cmd.ExecuteReader();

            var result = new List<TurnoPacienteRow>();
            while (reader.Read())
            {
                result.Add(ReadTurno(reader));
            }

            return result;
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UndefinedColumn)
        {
            // Compatibilidad con esquemas legacy que aun no tienen FK normalizadas.
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            using var cmd = new NpgsqlCommand(sqlLegacy, conn);
            cmd.Parameters.AddWithValue("fecha", fecha);
            using var reader = cmd.ExecuteReader();

            var result = new List<TurnoPacienteRow>();
            while (reader.Read())
            {
                result.Add(ReadTurno(reader));
            }

            return result;
        }
    }

    public void InsertTurnos(IEnumerable<TurnoPacienteRow> turnos)
    {
        const string sql = """
            insert into sch_turno.turno_paciente
                (id, paciente_id, centro_id, servicio_id, efector_id, cupo_id, fecha_hora, estado, motivo, updated_at)
            values
                (@id, @pacienteId, @centroId, @servicioId, @efectorId, @cupoId, @fechaHora, @estado, @motivo, now())
            on conflict (id) do nothing
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        foreach (var t in turnos)
        {
            using var cmd = new NpgsqlCommand(sql, conn);
            BindTurno(cmd, t);
            cmd.ExecuteNonQuery();
        }
    }

    public void InsertTurno(TurnoPacienteRow turno)
    {
        const string sql = """
            insert into sch_turno.turno_paciente
                (id, paciente_id, centro_id, servicio_id, efector_id, cupo_id, fecha_hora, estado, motivo, updated_at)
            values
                (@id, @pacienteId, @centroId, @servicioId, @efectorId, @cupoId, @fechaHora, @estado, @motivo, now())
            on conflict (id) do nothing
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        BindTurno(cmd, turno);
        cmd.ExecuteNonQuery();
    }

    public int UpdateEstadoTurno(string turnoId, string estado, string? motivo)
    {
        const string sql = """
            update sch_turno.turno_paciente
            set estado = @estado,
                motivo = @motivo,
                updated_at = now()
            where id = @turnoId
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turnoId", turnoId);
        cmd.Parameters.AddWithValue("estado", estado);
        cmd.Parameters.AddWithValue("motivo", (object?)motivo ?? DBNull.Value);
        return cmd.ExecuteNonQuery();
    }

    public Guid UpsertCupoAndGetId(Guid bloqueId, DateTimeOffset horaInicio, DateTimeOffset horaFin)
    {
        const string sql = """
            insert into sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido, updated_at)
            values (@bloqueId, @horaInicio, @horaFin, 'libre', 1, false, now())
            on conflict (bloque_id, hora_inicio)
            do update set hora_fin = excluded.hora_fin, updated_at = now()
            returning id
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("bloqueId", bloqueId);
        cmd.Parameters.AddWithValue("horaInicio", horaInicio);
        cmd.Parameters.AddWithValue("horaFin", horaFin);
        return (Guid)cmd.ExecuteScalar()!;
    }

    // ── sobreturno_disponibilidad ────────────────────────────────────────────

    public int GetOrInitSobreturnosDisponibles(string stKey, int capacidadInicial)
    {
        const string sql = """
            insert into sch_turno.sobreturno_disponibilidad (st_key, disponibles, updated_at)
            values (@stKey, @capacidad, now())
            on conflict (st_key) do nothing;

            select disponibles from sch_turno.sobreturno_disponibilidad where st_key = @stKey
            """;

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("stKey", stKey);
            cmd.Parameters.AddWithValue("capacidad", capacidadInicial);
            return (int)cmd.ExecuteScalar()!;
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UndefinedTable)
        {
            // Defensive fallback for environments where migration 013 is missing.
            return Math.Max(capacidadInicial, 0);
        }
    }

    public int DecrementarSobreturno(string stKey)
    {
        const string sql = """
            update sch_turno.sobreturno_disponibilidad
            set disponibles = greatest(disponibles - 1, 0),
                updated_at  = now()
            where st_key = @stKey
            returning disponibles
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("stKey", stKey);
        var result = cmd.ExecuteScalar();
        return result is int i ? i : 0;
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private static TurnoPacienteRow ReadTurno(NpgsqlDataReader r) => new(
        Id:          r.GetString(0),
        PacienteId:  r.GetString(1),
        Profesional: r.GetString(2),
        Servicio:    r.GetString(3),
        Centro:      r.GetString(4),
        FechaHora:   r.GetFieldValue<DateTimeOffset>(5),
        Estado:      r.GetString(6),
        Motivo:      r.IsDBNull(7) ? null : r.GetString(7),
        CentroId:    r.IsDBNull(8) ? Guid.Empty : r.GetGuid(8),
        ServicioId:  r.IsDBNull(9) ? Guid.Empty : r.GetGuid(9),
        EfectorId:   r.IsDBNull(10) ? Guid.Empty : r.GetGuid(10),
        CupoId:      r.IsDBNull(11) ? Guid.Empty : r.GetGuid(11)
    );

    private static void BindTurno(NpgsqlCommand cmd, TurnoPacienteRow t)
    {
        if (t.CentroId == Guid.Empty || t.ServicioId == Guid.Empty || t.EfectorId == Guid.Empty || t.CupoId == Guid.Empty)
        {
            throw new InvalidOperationException("TurnoPacienteRow requiere centroId, servicioId, efectorId y cupoId para persistir en esquema normalizado.");
        }

        cmd.Parameters.AddWithValue("id", t.Id);
        cmd.Parameters.AddWithValue("pacienteId", t.PacienteId);
        cmd.Parameters.AddWithValue("centroId", t.CentroId);
        cmd.Parameters.AddWithValue("servicioId", t.ServicioId);
        cmd.Parameters.AddWithValue("efectorId", t.EfectorId);
        cmd.Parameters.AddWithValue("cupoId", t.CupoId);
        cmd.Parameters.AddWithValue("fechaHora", t.FechaHora);
        cmd.Parameters.AddWithValue("estado", t.Estado);
        cmd.Parameters.AddWithValue("motivo", (object?)t.Motivo ?? DBNull.Value);
    }
}
