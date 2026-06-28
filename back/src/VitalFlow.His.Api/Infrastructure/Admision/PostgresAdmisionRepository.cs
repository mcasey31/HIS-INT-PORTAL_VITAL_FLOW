using Npgsql;
using NpgsqlTypes;
using VitalFlow.His.Api.Application.Admision.Repositories;

namespace VitalFlow.His.Api.Infrastructure.Admision;

public sealed class PostgresAdmisionRepository(string connectionString) : IAdmisionRepository
{
    // ── turno_admision ──────────────────────────────────────────────────────

    public TurnoAdmisionRow? GetTurnoAdmision(string turnoId)
    {
        const string sql = """
            select turno_id, paciente_id, paciente_nombre, documento, financiador,
                   estado, estado_turno, motivo, llegada_en
            from sch_admision.turno_admision
            where turno_id = @turnoId
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turnoId", turnoId);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadTurno(reader) : null;
    }

    public IReadOnlyDictionary<string, TurnoAdmisionRow> GetTurnosAdmisionByIds(IReadOnlyList<string> turnoIds)
    {
        if (turnoIds.Count == 0)
        {
            return new Dictionary<string, TurnoAdmisionRow>();
        }

        const string sql = """
            select turno_id, paciente_id, paciente_nombre, documento, financiador,
                   estado, estado_turno, motivo, llegada_en
            from sch_admision.turno_admision
            where turno_id = any(@ids)
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("ids", turnoIds.ToArray());
        using var reader = cmd.ExecuteReader();

        var result = new Dictionary<string, TurnoAdmisionRow>(StringComparer.OrdinalIgnoreCase);
        while (reader.Read())
        {
            var row = ReadTurno(reader);
            result[row.TurnoId] = row;
        }

        return result;
    }

    public void UpsertTurnoAdmision(TurnoAdmisionRow row)
    {
        const string sql = """
            insert into sch_admision.turno_admision
                (turno_id, paciente_id, paciente_nombre, documento, financiador,
                 estado, estado_turno, motivo, llegada_en, updated_at)
            values
                (@turnoId, @pacienteId, @pacienteNombre, @documento, @financiador,
                 @estado, @estadoTurno, @motivo, @llegadaEn, now())
            on conflict (turno_id) do update set
                paciente_id     = coalesce(excluded.paciente_id,     sch_admision.turno_admision.paciente_id),
                paciente_nombre = coalesce(excluded.paciente_nombre, sch_admision.turno_admision.paciente_nombre),
                documento       = coalesce(excluded.documento,       sch_admision.turno_admision.documento),
                financiador     = coalesce(excluded.financiador,     sch_admision.turno_admision.financiador),
                estado          = excluded.estado,
                estado_turno    = excluded.estado_turno,
                motivo          = excluded.motivo,
                llegada_en      = coalesce(sch_admision.turno_admision.llegada_en, excluded.llegada_en),
                updated_at      = now()
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turnoId", row.TurnoId);
        cmd.Parameters.AddWithValue("pacienteId", (object?)row.PacienteId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("pacienteNombre", (object?)row.PacienteNombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("documento", (object?)row.Documento ?? DBNull.Value);
        cmd.Parameters.AddWithValue("financiador", (object?)row.Financiador ?? DBNull.Value);
        cmd.Parameters.AddWithValue("estado", row.Estado);
        cmd.Parameters.AddWithValue("estadoTurno", row.EstadoTurno);
        cmd.Parameters.AddWithValue("motivo", (object?)row.Motivo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("llegadaEn", (object?)row.LlegadaEn ?? DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public IReadOnlyList<string> GetTurnosEnEstado(string estado, string? excludeTurnoId = null)
    {
        const string sql = """
            select turno_id from sch_admision.turno_admision
            where estado = @estado
              and (@excludeId is null or turno_id <> @excludeId)
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("estado", estado);
        cmd.Parameters.AddWithValue("excludeId", (object?)excludeTurnoId ?? DBNull.Value);
        using var reader = cmd.ExecuteReader();

        var result = new List<string>();
        while (reader.Read())
        {
            result.Add(reader.GetString(0));
        }

        return result;
    }

    public IReadOnlyList<TurnoProgramadoPacienteRow> GetTurnosProgramadosPacientePorFecha(DateOnly fecha)
    {
        const string sql = """
            select tp.id,
                   tp.paciente_id,
                   coalesce(nullif(trim(per.apellido || ', ' || per.nombre), ''), tp.paciente_id) as paciente_nombre,
                   coalesce(per.tipo_documento_codigo || ' ' || per.numero_documento, '-') as documento,
                   coalesce(f.nombre || ' | ' || fp.nombre, '-') as financiador,
                   tp.servicio,
                   tp.profesional,
                   tp.fecha_hora
            from sch_turno.turno_paciente tp
            left join sch_persona.persona per
                on per.id::text = tp.paciente_id
            left join lateral (
                select pf.financiador_id, pf.plan_financiador_id
                from sch_administracion.t_paciente_financiador_plan pf
                where pf.paciente_id::text = tp.paciente_id
                  and pf.vigente = true
                  and (pf.fecha_hasta is null or pf.fecha_hasta >= current_date)
                order by coalesce(pf.updated_at, pf.created_at) desc
                limit 1
            ) cov on true
            left join sch_persona.financiador f
                on f.id = cov.financiador_id
            left join sch_persona.financiador_plan fp
                on fp.id = cov.plan_financiador_id
            where upper(tp.estado) = 'AGENDADO'
              and (tp.fecha_hora at time zone 'UTC')::date = @fecha
            order by tp.fecha_hora;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("fecha", fecha);
        using var reader = cmd.ExecuteReader();

        var result = new List<TurnoProgramadoPacienteRow>();
        while (reader.Read())
        {
            result.Add(new TurnoProgramadoPacienteRow(
                reader.GetString(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetString(3),
                reader.GetString(4),
                reader.GetString(5),
                reader.GetString(6),
                reader.GetFieldValue<DateTimeOffset>(7)
            ));
        }

        return result;
    }

    // ── encuentro ───────────────────────────────────────────────────────────

    public EncuentroRow? GetEncuentroPorTurno(string turnoId)
    {
        const string sql = """
            select encuentro_id, turno_id, paciente_id, estado, creado_en, cerrado_en, motivo_cierre
            from sch_admision.encuentro
            where turno_id = @turnoId
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turnoId", turnoId);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadEncuentro(reader) : null;
    }

    public string CrearEncuentroSiNoExiste(string turnoId, string pacienteId)
    {
        var encuentroId = $"enc:{turnoId}";

        const string insertSql = """
            insert into sch_admision.encuentro
                (encuentro_id, turno_id, paciente_id, estado, creado_en, updated_at)
            values
                (@encuentroId, @turnoId, @pacienteId, 'ABIERTO', now(), now())
            on conflict (turno_id) do nothing
            """;

        const string selectSql = """
            select encuentro_id from sch_admision.encuentro where turno_id = @turnoId
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var insertCmd = new NpgsqlCommand(insertSql, conn);
        insertCmd.Parameters.AddWithValue("encuentroId", encuentroId);
        insertCmd.Parameters.AddWithValue("turnoId", turnoId);
        insertCmd.Parameters.AddWithValue("pacienteId", pacienteId);
        insertCmd.ExecuteNonQuery();

        using var selectCmd = new NpgsqlCommand(selectSql, conn);
        selectCmd.Parameters.AddWithValue("turnoId", turnoId);
        return (string)selectCmd.ExecuteScalar()!;
    }

    public EncuentroRow? CerrarEncuentro(string turnoId, string motivoCierre)
    {
        const string sql = """
            update sch_admision.encuentro
            set estado        = 'CERRADO',
                cerrado_en    = now(),
                motivo_cierre = @motivo,
                updated_at    = now()
            where turno_id = @turnoId
              and estado    = 'ABIERTO'
            returning encuentro_id, turno_id, paciente_id, estado, creado_en, cerrado_en, motivo_cierre
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turnoId", turnoId);
        cmd.Parameters.AddWithValue("motivo", (object?)motivoCierre ?? DBNull.Value);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? ReadEncuentro(reader) : null;
    }

    public IReadOnlyList<(string TurnoId, string EncuentroId)> GetEncuentrosAbiertosAntesDe(DateTimeOffset limite)
    {
        const string sql = """
            select turno_id, encuentro_id
            from sch_admision.encuentro
            where estado = 'ABIERTO' and creado_en < @limite
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("limite", limite);
        using var reader = cmd.ExecuteReader();

        var result = new List<(string, string)>();
        while (reader.Read())
        {
            result.Add((reader.GetString(0), reader.GetString(1)));
        }

        return result;
    }

    // ── clearing ───────────────────────────────────────────────────────────

    public IReadOnlyList<string> GetTurnosEnEstados(IReadOnlyList<string> estados)
    {
        const string sql = """
            select turno_id from sch_admision.turno_admision
            where estado = any(@estados)
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("estados", estados.ToArray());
        using var reader = cmd.ExecuteReader();

        var result = new List<string>();
        while (reader.Read())
        {
            result.Add(reader.GetString(0));
        }

        return result;
    }

    public Guid CreateClearingLog(string? centroId, string modo, int progAusente, int salaNoAtend, int obsAtend, int pagoNoAdm, int total)
    {
        var id = Guid.NewGuid();

        const string sql = """
            insert into sch_admision.clearing_log
                (id, ejecutado_en, centro_id, modo,
                 programados_a_ausente, sala_espera_a_no_atendido,
                 observacion_a_atendido, pendiente_pago_a_no_admitido,
                 total_procesados, created_at)
            values
                (@id, now(), @centro_id, @modo,
                 @progAusente, @salaNoAtend,
                 @obsAtend, @pagoNoAdm,
                 @total, now())
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", id);
        cmd.Parameters.AddWithValue("centro_id", (object?)centroId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("modo", modo);
        cmd.Parameters.AddWithValue("progAusente", progAusente);
        cmd.Parameters.AddWithValue("salaNoAtend", salaNoAtend);
        cmd.Parameters.AddWithValue("obsAtend", obsAtend);
        cmd.Parameters.AddWithValue("pagoNoAdm", pagoNoAdm);
        cmd.Parameters.AddWithValue("total", total);
        cmd.ExecuteNonQuery();

        return id;
    }

    public void CreateClearingDetalle(Guid clearingId, string turnoId, string estadoAnterior, string estadoNuevo)
    {
        const string sql = """
            insert into sch_admision.clearing_detalle
                (id, clearing_id, turno_id, estado_anterior, estado_nuevo, created_at)
            values
                (@id, @clearing_id, @turno_id, @estado_anterior, @estado_nuevo, now())
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", Guid.NewGuid());
        cmd.Parameters.AddWithValue("clearing_id", NpgsqlTypes.NpgsqlDbType.Uuid, clearingId);
        cmd.Parameters.AddWithValue("turno_id", turnoId);
        cmd.Parameters.AddWithValue("estado_anterior", estadoAnterior);
        cmd.Parameters.AddWithValue("estado_nuevo", estadoNuevo);
        cmd.ExecuteNonQuery();
    }

    public DateTimeOffset? GetUltimoClearingEjecutado()
    {
        const string sql = """
            select ejecutado_en from sch_admision.clearing_log
            order by ejecutado_en desc
            limit 1
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? reader.GetFieldValue<DateTimeOffset>(0) : null;
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private static TurnoAdmisionRow ReadTurno(NpgsqlDataReader r) => new(
        TurnoId:        r.GetString(0),
        PacienteId:     r.IsDBNull(1) ? null : r.GetString(1),
        PacienteNombre: r.IsDBNull(2) ? null : r.GetString(2),
        Documento:      r.IsDBNull(3) ? null : r.GetString(3),
        Financiador:    r.IsDBNull(4) ? null : r.GetString(4),
        Estado:         r.GetString(5),
        EstadoTurno:    r.GetString(6),
        Motivo:         r.IsDBNull(7) ? null : r.GetString(7),
        LlegadaEn:      r.IsDBNull(8) ? null : r.GetFieldValue<DateTimeOffset>(8)
    );

    private static EncuentroRow ReadEncuentro(NpgsqlDataReader r) => new(
        EncuentroId:  r.GetString(0),
        TurnoId:      r.GetString(1),
        PacienteId:   r.GetString(2),
        Estado:       r.GetString(3),
        CreadoEn:     r.GetFieldValue<DateTimeOffset>(4),
        CerradoEn:    r.IsDBNull(5) ? null : r.GetFieldValue<DateTimeOffset>(5),
        MotivoCierre: r.IsDBNull(6) ? null : r.GetString(6)
    );
}
