using Npgsql;
using NpgsqlTypes;
using VitalFlow.His.Api.Application.Turnera.Contracts;

namespace VitalFlow.His.Api.Application.Turnera.Services;

public sealed class TurneraService(string connectionString) : ITurneraService
{
    public DisplayTurneraResponse GetDisplay(string? centroId, string? efectorId)
    {
        const string sql = """
            select ta.turno_id,
                   coalesce(ta.paciente_nombre, '—'),
                   coalesce(ta.documento, '—'),
                   ta.llegada_en::text,
                   ta.estado
            from sch_admision.turno_admision ta
            left join sch_turno.turno_paciente tp on tp.id::text = ta.turno_id
            where ta.estado in ('EN_SALA_DE_ESPERA', 'EN_ATENCION')
              and (@centro_id is null or tp.centro_id = @centro_id::uuid)
              and (@efector_id is null or tp.efector_id = @efector_id::uuid)
            order by
                case ta.estado
                    when 'EN_SALA_DE_ESPERA' then 0
                    when 'EN_ATENCION' then 1
                    else 2
                end,
                ta.llegada_en nulls last,
                ta.turno_id
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", NpgsqlDbType.Uuid, (object?)ParseGuid(centroId) ?? DBNull.Value);
        cmd.Parameters.AddWithValue("efector_id", NpgsqlDbType.Uuid, (object?)ParseGuid(efectorId) ?? DBNull.Value);

        var salaEspera = new List<DisplayTurnoResponse>();
        var enAtencion = new List<DisplayTurnoResponse>();

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var item = new DisplayTurnoResponse(
                reader.GetString(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.IsDBNull(3) ? null : reader.GetString(3),
                reader.GetString(4),
                "",
                ""
            );

            if (item.Estado == "EN_SALA_DE_ESPERA")
                salaEspera.Add(item);
            else if (item.Estado == "EN_ATENCION")
                enAtencion.Add(item);
        }

        var ultimoLlamado = enAtencion.Count > 0
            ? enAtencion[^1]
            : (salaEspera.Count > 0 ? salaEspera[0] : null);

        return new DisplayTurneraResponse(salaEspera, enAtencion, ultimoLlamado);
    }

    public UltimoLlamadoTurneraResponse GetUltimoLlamado(string? centroId, string? efectorId)
    {
        const string sql = """
            select ta.paciente_nombre, ta.documento, ta.estado
            from sch_admision.turno_admision ta
            left join sch_turno.turno_paciente tp on tp.id::text = ta.turno_id
            where ta.estado = 'EN_ATENCION'
              and (@centro_id is null or tp.centro_id = @centro_id::uuid)
              and (@efector_id is null or tp.efector_id = @efector_id::uuid)
            order by ta.llegada_en desc
            limit 1
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", NpgsqlDbType.Uuid, (object?)ParseGuid(centroId) ?? DBNull.Value);
        cmd.Parameters.AddWithValue("efector_id", NpgsqlDbType.Uuid, (object?)ParseGuid(efectorId) ?? DBNull.Value);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
            return new UltimoLlamadoTurneraResponse(null, null, null);

        return new UltimoLlamadoTurneraResponse(
            reader.IsDBNull(0) ? null : reader.GetString(0),
            reader.IsDBNull(1) ? null : reader.GetString(1),
            reader.GetString(2)
        );
    }

    public LlamarPacienteTurneraResponse LlamarPaciente(string turnoId)
    {
        const string sql = """
            update sch_admision.turno_admision
            set estado = 'EN_ATENCION',
                motivo = 'LLAMADO_TURNERA',
                updated_at = now()
            where turno_id = @turno_id
              and estado in ('EN_SALA_DE_ESPERA', 'PROGRAMADO', 'EN_OBSERVACION')
            returning paciente_nombre, estado
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("turno_id", turnoId);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
            return new LlamarPacienteTurneraResponse(false, "", "");

        return new LlamarPacienteTurneraResponse(
            true,
            reader.IsDBNull(0) ? "" : reader.GetString(0),
            reader.GetString(1)
        );
    }

    public KioscoArriboResponse KioscoArribo(KioscoArriboRequest request)
    {
        const string findSql = """
            select tp.id::text,
                   coalesce(nullif(trim(per.apellido || ', ' || per.nombre), ''), tp.paciente_id) as paciente_nombre
            from sch_turno.turno_paciente tp
            left join sch_persona.persona per on per.id::text = tp.paciente_id
            where upper(tp.estado) = 'AGENDADO'
              and per.numero_documento = @documento
              and (tp.fecha_hora at time zone 'UTC')::date = current_date
              and tp.centro_id = @centro_id::uuid
            order by tp.fecha_hora
            limit 1
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var findCmd = new NpgsqlCommand(findSql, conn);
        findCmd.Parameters.AddWithValue("documento", request.Documento);
        findCmd.Parameters.AddWithValue("centro_id", NpgsqlDbType.Uuid, ParseGuid(request.CentroId) ?? (object)DBNull.Value);

        using var reader = findCmd.ExecuteReader();
        if (!reader.Read())
            return new KioscoArriboResponse(false, "No se encontro un turno programado para hoy con ese documento.", null, null);

        var turnoId = reader.GetString(0);
        var pacienteNombre = reader.GetString(1);
        reader.Close();

        const string upsertSql = """
            insert into sch_admision.turno_admision
                (turno_id, paciente_id, paciente_nombre, documento,
                 financiador, estado, estado_turno, llegada_en, updated_at)
            select
                @turno_id, tp.paciente_id,
                coalesce(nullif(trim(per.apellido || ', ' || per.nombre), ''), tp.paciente_id),
                coalesce(per.tipo_documento_codigo || ' ' || per.numero_documento, '-'),
                coalesce(f.nombre || ' | ' || fp.nombre, '-'),
                'EN_SALA_DE_ESPERA', 'CONSUMIDO', now(), now()
            from sch_turno.turno_paciente tp
            left join sch_persona.persona per on per.id::text = tp.paciente_id
            left join lateral (
                select pf.financiador_id, pf.plan_financiador_id
                from sch_administracion.t_paciente_financiador_plan pf
                where pf.paciente_id::text = tp.paciente_id
                  and pf.vigente = true
                  and (pf.fecha_hasta is null or pf.fecha_hasta >= current_date)
                order by coalesce(pf.updated_at, pf.created_at) desc
                limit 1
            ) cov on true
            left join sch_persona.financiador f on f.id = cov.financiador_id
            left join sch_persona.financiador_plan fp on fp.id = cov.plan_financiador_id
            where tp.id::text = @turno_id
            on conflict (turno_id) do update set
                estado = 'EN_SALA_DE_ESPERA',
                llegada_en = coalesce(sch_admision.turno_admision.llegada_en, now()),
                updated_at = now()
            returning paciente_nombre
            """;

        using var upsertCmd = new NpgsqlCommand(upsertSql, conn);
        upsertCmd.Parameters.AddWithValue("turno_id", turnoId);

        var result = upsertCmd.ExecuteScalar();
        var nombreFinal = result as string ?? pacienteNombre;

        return new KioscoArriboResponse(true, "Arribo registrado correctamente.", nombreFinal, turnoId);
    }

    private static Guid? ParseGuid(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return Guid.TryParse(value, out var guid) ? guid : null;
    }
}
