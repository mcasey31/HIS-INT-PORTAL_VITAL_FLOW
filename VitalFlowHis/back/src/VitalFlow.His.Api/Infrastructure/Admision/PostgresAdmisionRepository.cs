using Npgsql;
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
                   coalesce(s.nombre, '') as servicio,
                   coalesce(e.nombre, '') as profesional,
                   tp.fecha_hora
            from sch_turno.turno_paciente tp
            left join sch_agenda.servicio s
                on s.id = tp.servicio_id
            left join sch_agenda.efector e
                on e.id = tp.efector_id
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
                        where upper(tp.estado) in ('AGENDADO', 'PROGRAMADO')
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

    public CoberturaPacienteRow? GetCoberturaVigentePaciente(Guid pacienteId)
    {
        const string sql = """
            select pf.financiador_id,
                   pf.plan_financiador_id,
                   f.nombre as financiador_nombre,
                   fp.nombre as plan_nombre
            from sch_administracion.t_paciente_financiador_plan pf
            left join sch_persona.financiador f
                on f.id = pf.financiador_id
            left join sch_persona.financiador_plan fp
                on fp.id = pf.plan_financiador_id
            where pf.paciente_id = @paciente_id
              and pf.vigente = true
              and (pf.fecha_hasta is null or pf.fecha_hasta >= current_date)
            order by coalesce(pf.updated_at, pf.created_at) desc
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("paciente_id", pacienteId);
        using var reader = cmd.ExecuteReader();

        if (!reader.Read())
        {
            return null;
        }

        return new CoberturaPacienteRow(
            FinanciadorId: reader.GetGuid(0),
            PlanId: reader.GetGuid(1),
            FinanciadorNombre: reader.IsDBNull(2) ? null : reader.GetString(2),
            PlanNombre: reader.IsDBNull(3) ? null : reader.GetString(3));
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

    // ── Módulos HIS / outbox facturación ────────────────────────────────────

    public bool IsModuloHisActivo(string codigo)
    {
        const string sql = """
            select activo from sch_admision.modulos_his where codigo = @codigo limit 1;
            """;
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("codigo", codigo);
        var result = cmd.ExecuteScalar();
        return result is true || result?.ToString()?.Equals("true", StringComparison.OrdinalIgnoreCase) == true;
    }

    public void InsertEventoFacturacionOutbox(EventoFacturacionOutboxRow row)
    {
        const string sql = """
            insert into sch_admision.eventos_facturacion_outbox
                (id, turno_id, encuentro_id, paciente_id, paciente_nombre, documento,
                 financiador, financiador_id, plan_id, servicio_nombre, centro_id,
                 llegada_en, payload, estado,
                 practica_origen_nombre, practica_origen_codigo,
                 homologacion_encontrada, catalogo_destino_codigo, practica_destino_codigo, practica_destino_nombre,
                 profesional_id, profesional_nombre, tipo_origen, event_type)
            values
                (@id, @turno_id, @encuentro_id, @paciente_id, @paciente_nombre, @documento,
                 @financiador, @financiador_id, @plan_id, @servicio_nombre, @centro_id,
                 @llegada_en, @payload::jsonb, 'PENDIENTE',
                 @practica_origen_nombre, @practica_origen_codigo,
                 @homologacion_encontrada, @catalogo_destino_codigo, @practica_destino_codigo, @practica_destino_nombre,
                 @profesional_id, @profesional_nombre, @tipo_origen, @event_type)
            on conflict (turno_id) where estado = 'PENDIENTE' do nothing;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id",                     row.Id);
        cmd.Parameters.AddWithValue("turno_id",               row.TurnoId);
        cmd.Parameters.AddWithValue("encuentro_id",           (object?)row.EncuentroId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("paciente_id",            row.PacienteId);
        cmd.Parameters.AddWithValue("paciente_nombre",        row.PacienteNombre);
        cmd.Parameters.AddWithValue("documento",              row.Documento);
        cmd.Parameters.AddWithValue("financiador",            (object?)row.Financiador ?? DBNull.Value);
        cmd.Parameters.AddWithValue("financiador_id",         (object?)row.FinanciadorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("plan_id",                (object?)row.PlanId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("servicio_nombre",        (object?)row.ServicioNombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("centro_id",              (object?)row.CentroId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("llegada_en",             row.LlegadaEn);
        cmd.Parameters.AddWithValue("payload",                row.Payload);
        cmd.Parameters.AddWithValue("practica_origen_nombre", (object?)row.PracticaOrigenNombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("practica_origen_codigo", (object?)row.PracticaOrigenCodigo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("homologacion_encontrada", row.HomologacionEncontrada);
        cmd.Parameters.AddWithValue("catalogo_destino_codigo", (object?)row.CatalogoDestinoCodigo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("practica_destino_codigo", (object?)row.PrestacionDestinoCodigo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("practica_destino_nombre", (object?)row.PrestacionDestinoNombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("profesional_id",         (object?)row.ProfesionalId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("profesional_nombre",     (object?)row.ProfesionalNombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("tipo_origen",            row.TipoOrigen);
        cmd.Parameters.AddWithValue("event_type",             row.EventType);
        cmd.ExecuteNonQuery();
    }

    public HomologacionPracticaFacturacionRow? ResolveHomologacionPractica(string practicaOrigenCodigo, Guid? financiadorId, Guid? planId)
    {
        if (string.IsNullOrWhiteSpace(practicaOrigenCodigo))
        {
            return null;
        }

        const string sql = """
            select h.catalogo_codigo,
                   h.prestacion_destino_codigo,
                   h.prestacion_destino_nombre
            from sch_admision.homologacion_practica_catalogo_facturacion h
            where h.activo = true
              and upper(h.practica_origen_codigo) = upper(@practica_origen_codigo)
              and (h.financiador_id is null or h.financiador_id = @financiador_id)
              and (h.plan_id is null or h.plan_id = @plan_id)
            order by
              case when h.plan_id is not null then 2 else 0 end +
              case when h.financiador_id is not null then 1 else 0 end desc,
              h.prioridad asc,
              h.updated_at desc
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("practica_origen_codigo", practicaOrigenCodigo.Trim());
        cmd.Parameters.AddWithValue("financiador_id", (object?)financiadorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("plan_id", (object?)planId ?? DBNull.Value);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new HomologacionPracticaFacturacionRow(
            CatalogoCodigo: reader.GetString(0),
            PrestacionCodigo: reader.GetString(1),
            PrestacionNombre: reader.IsDBNull(2) ? null : reader.GetString(2));
    }

    public EventoFacturacionEstadoRow? GetEventoFacturacionByTurnoId(string turnoId)
    {
        const string sql = """
            select turno_id,
                   estado,
                   error_detalle,
                   created_at,
                   processed_at
            from sch_admision.eventos_facturacion_outbox
            where turno_id = @turno_id
            order by created_at desc
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turno_id", turnoId);
        using var reader = cmd.ExecuteReader();

        if (!reader.Read())
        {
            return null;
        }

        return new EventoFacturacionEstadoRow(
            reader.GetString(0),
            reader.GetString(1),
            reader.IsDBNull(2) ? null : reader.GetString(2),
            reader.GetFieldValue<DateTimeOffset>(3),
            reader.IsDBNull(4) ? null : reader.GetFieldValue<DateTimeOffset>(4));
    }
}
