using Npgsql;
using System.Text.Json;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Repositories;

namespace VitalFlow.His.Api.Infrastructure.HistoriaClinica;

public sealed class PostgresHistoriaClinicaRepository(string connectionString) : IHistoriaClinicaRepository
{
    private const string EstadoAnulada = "ANULADA";

    public IReadOnlyList<ProblemaCronicoResponse> GetProblemasCronicos(Guid pacienteId)
    {
        const string sql = """
            select
                p.id,
                p.descripcion,
                p.fecha_creacion,
                coalesce(count(e.id), 0) as evoluciones_asociadas
            from sch_hca.problema_cronico p
            left join sch_hca.problema_cronico_evolucion e
                on e.problema_cronico_id = p.id
               and e.activo = true
            where p.paciente_id = @paciente_id
              and p.activo = true
            group by p.id, p.descripcion, p.fecha_creacion
            order by p.fecha_creacion desc;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("paciente_id", pacienteId);

        var result = new List<ProblemaCronicoResponse>();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var fechaCreacion = reader.GetDateTime(reader.GetOrdinal("fecha_creacion"));
            result.Add(new ProblemaCronicoResponse(
                ProblemaCronicoId: reader.GetGuid(reader.GetOrdinal("id")).ToString(),
                Descripcion: reader.GetString(reader.GetOrdinal("descripcion")),
                FechaCreacion: fechaCreacion.ToString("dd/MM/yyyy"),
                EvolucionesAsociadas: reader.GetInt32(reader.GetOrdinal("evoluciones_asociadas"))));
        }

        return result;
    }

    public IReadOnlyList<EvolucionAmbulatoriaResponse> GetEvolucionesAmbulatorias(Guid pacienteId, int limit)
    {
        const string sql = """
            select
                e.id,
                e.fecha_atencion,
                e.especialidad,
                e.profesional,
                e.problemas_asociados_json::text as problemas_asociados_json
            from sch_hca.evolucion_ambulatoria e
            where e.paciente_id = @paciente_id
              and e.activo = true
            order by e.fecha_atencion desc
            limit @limit;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("paciente_id", pacienteId);
        cmd.Parameters.AddWithValue("limit", limit);

        var result = new List<EvolucionAmbulatoriaResponse>();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            var problemasJson = reader.GetString(reader.GetOrdinal("problemas_asociados_json"));
            var problemas = JsonSerializer.Deserialize<List<string>>(problemasJson) ?? [];
            var fechaAtencion = reader.GetDateTime(reader.GetOrdinal("fecha_atencion"));

            result.Add(new EvolucionAmbulatoriaResponse(
                EvolucionId: reader.GetGuid(reader.GetOrdinal("id")).ToString(),
                FechaAtencion: fechaAtencion.ToString("O"),
                Especialidad: reader.GetString(reader.GetOrdinal("especialidad")),
                Profesional: reader.GetString(reader.GetOrdinal("profesional")),
                ProblemasAsociados: problemas));
        }

        return result;
    }

    public RegistrarRecetaDigitalResponse CreateRecetaDigital(RecetaDigitalCreateCommand command)
    {
        const string sqlReceta = """
            insert into sch_hca.receta_digital
                (id, paciente_id, encuentro_id, turno_id, prescriptor_usuario_id,
                 prescriptor_matricula, organizacion_oid, estado, rdiar_profile,
                 fhir_bundle_json, external_recipe_id, external_repository_uri,
                 validacion_outcome_json, activo, created_at, updated_at)
            values
                (@id, @paciente_id, @encuentro_id, @turno_id, @prescriptor_usuario_id,
                 @prescriptor_matricula, @organizacion_oid, @estado, @rdiar_profile,
                 @fhir_bundle_json::jsonb, null, null,
                 null, true, now(), now());
            """;

        const string sqlItem = """
            insert into sch_hca.receta_digital_item
                (id, receta_id, medicamento_codigo, medicamento_sistema, medicamento_display,
                 dosis_texto, frecuencia_texto, duracion_dias, indicacion, estado,
                 activo, created_at, updated_at)
            values
                (@id, @receta_id, @medicamento_codigo, @medicamento_sistema, @medicamento_display,
                 @dosis_texto, @frecuencia_texto, @duracion_dias, @indicacion, @estado,
                 true, now(), now());
            """;

        const string sqlEvento = """
            insert into sch_hca.receta_digital_evento
                (id, receta_id, tipo_evento, payload_json, activo, created_at, updated_at)
            values
                (@id, @receta_id, @tipo_evento, @payload_json::jsonb, true, now(), now());
            """;

        var recetaId = Guid.NewGuid();

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        using (var cmdReceta = new NpgsqlCommand(sqlReceta, conn, tx))
        {
            cmdReceta.Parameters.AddWithValue("id", recetaId);
            cmdReceta.Parameters.AddWithValue("paciente_id", command.PacienteId);
            cmdReceta.Parameters.AddWithValue("encuentro_id", (object?)command.EncuentroId ?? DBNull.Value);
            cmdReceta.Parameters.AddWithValue("turno_id", (object?)command.TurnoId ?? DBNull.Value);
            cmdReceta.Parameters.AddWithValue("prescriptor_usuario_id", command.PrescriptorUsuarioId);
            cmdReceta.Parameters.AddWithValue("prescriptor_matricula", command.PrescriptorMatricula);
            cmdReceta.Parameters.AddWithValue("organizacion_oid", command.OrganizacionOid);
            cmdReceta.Parameters.AddWithValue("estado", command.Estado);
            cmdReceta.Parameters.AddWithValue("rdiar_profile", command.RdiarProfile);
            cmdReceta.Parameters.AddWithValue("fhir_bundle_json", command.FhirBundleJson);
            cmdReceta.ExecuteNonQuery();
        }

        foreach (var item in command.Items)
        {
            using var cmdItem = new NpgsqlCommand(sqlItem, conn, tx);
            cmdItem.Parameters.AddWithValue("id", Guid.NewGuid());
            cmdItem.Parameters.AddWithValue("receta_id", recetaId);
            cmdItem.Parameters.AddWithValue("medicamento_codigo", item.MedicamentoCodigo);
            cmdItem.Parameters.AddWithValue("medicamento_sistema", item.MedicamentoSistema);
            cmdItem.Parameters.AddWithValue("medicamento_display", item.MedicamentoDisplay);
            cmdItem.Parameters.AddWithValue("dosis_texto", (object?)item.DosisTexto ?? DBNull.Value);
            cmdItem.Parameters.AddWithValue("frecuencia_texto", (object?)item.FrecuenciaTexto ?? DBNull.Value);
            cmdItem.Parameters.AddWithValue("duracion_dias", (object?)item.DuracionDias ?? DBNull.Value);
            cmdItem.Parameters.AddWithValue("indicacion", (object?)item.Indicacion ?? DBNull.Value);
            cmdItem.Parameters.AddWithValue("estado", item.Estado);
            cmdItem.ExecuteNonQuery();
        }

        var payload = JsonSerializer.Serialize(new
        {
            estado = command.Estado,
            rdiarProfile = command.RdiarProfile,
            cantidadItems = command.Items.Count,
            origin = "ODI"
        });

        using (var cmdEvento = new NpgsqlCommand(sqlEvento, conn, tx))
        {
            cmdEvento.Parameters.AddWithValue("id", Guid.NewGuid());
            cmdEvento.Parameters.AddWithValue("receta_id", recetaId);
            cmdEvento.Parameters.AddWithValue("tipo_evento", "RECETA_CREADA");
            cmdEvento.Parameters.AddWithValue("payload_json", payload);
            cmdEvento.ExecuteNonQuery();
        }

        tx.Commit();

        return new RegistrarRecetaDigitalResponse(
            RecetaId: recetaId.ToString(),
            Estado: command.Estado,
            CreadoEn: DateTimeOffset.UtcNow.ToString("O"),
            CantidadItems: command.Items.Count);
    }

    public RecetaDigitalDetalleResponse? GetRecetaDigitalById(Guid recetaId)
    {
        const string sqlReceta = """
            select
                id,
                paciente_id,
                encuentro_id,
                turno_id,
                prescriptor_usuario_id,
                prescriptor_matricula,
                organizacion_oid,
                estado,
                rdiar_profile,
                fhir_bundle_json::text as fhir_bundle_json,
                external_recipe_id,
                external_repository_uri,
                validacion_outcome_json::text as validacion_outcome_json,
                created_at,
                updated_at
            from sch_hca.receta_digital
            where id = @receta_id
              and activo = true;
            """;

        const string sqlItems = """
            select
                id,
                medicamento_codigo,
                medicamento_sistema,
                medicamento_display,
                dosis_texto,
                frecuencia_texto,
                duracion_dias,
                indicacion,
                estado
            from sch_hca.receta_digital_item
            where receta_id = @receta_id
              and activo = true
            order by created_at asc;
            """;

        const string sqlEventos = """
            select
                id,
                tipo_evento,
                payload_json::text as payload_json,
                created_at
            from sch_hca.receta_digital_evento
            where receta_id = @receta_id
              and activo = true
            order by created_at desc;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmdReceta = new NpgsqlCommand(sqlReceta, conn);
        cmdReceta.Parameters.AddWithValue("receta_id", recetaId);

        using var recetaReader = cmdReceta.ExecuteReader();
        if (!recetaReader.Read())
        {
            return null;
        }

        var model = new
        {
            RecetaId = recetaReader.GetGuid(recetaReader.GetOrdinal("id")).ToString(),
            PacienteId = recetaReader.GetGuid(recetaReader.GetOrdinal("paciente_id")).ToString(),
            EncuentroId = recetaReader.IsDBNull(recetaReader.GetOrdinal("encuentro_id"))
                ? null
                : recetaReader.GetGuid(recetaReader.GetOrdinal("encuentro_id")).ToString(),
            TurnoId = recetaReader.IsDBNull(recetaReader.GetOrdinal("turno_id"))
                ? null
                : recetaReader.GetGuid(recetaReader.GetOrdinal("turno_id")).ToString(),
            PrescriptorUsuarioId = recetaReader.GetGuid(recetaReader.GetOrdinal("prescriptor_usuario_id")).ToString(),
            PrescriptorMatricula = recetaReader.GetString(recetaReader.GetOrdinal("prescriptor_matricula")),
            OrganizacionOid = recetaReader.GetString(recetaReader.GetOrdinal("organizacion_oid")),
            Estado = recetaReader.GetString(recetaReader.GetOrdinal("estado")),
            RdiarProfile = recetaReader.GetString(recetaReader.GetOrdinal("rdiar_profile")),
            FhirBundleJson = recetaReader.GetString(recetaReader.GetOrdinal("fhir_bundle_json")),
            ExternalRecipeId = recetaReader.IsDBNull(recetaReader.GetOrdinal("external_recipe_id"))
                ? null
                : recetaReader.GetString(recetaReader.GetOrdinal("external_recipe_id")),
            ExternalRepositoryUri = recetaReader.IsDBNull(recetaReader.GetOrdinal("external_repository_uri"))
                ? null
                : recetaReader.GetString(recetaReader.GetOrdinal("external_repository_uri")),
            ValidacionOutcomeJson = recetaReader.IsDBNull(recetaReader.GetOrdinal("validacion_outcome_json"))
                ? null
                : recetaReader.GetString(recetaReader.GetOrdinal("validacion_outcome_json")),
            CreadoEn = recetaReader.GetDateTime(recetaReader.GetOrdinal("created_at")).ToString("O"),
            ActualizadoEn = recetaReader.GetDateTime(recetaReader.GetOrdinal("updated_at")).ToString("O")
        };

        recetaReader.Close();

        var items = new List<RecetaDigitalItemResponse>();
        using (var cmdItems = new NpgsqlCommand(sqlItems, conn))
        {
            cmdItems.Parameters.AddWithValue("receta_id", recetaId);
            using var itemReader = cmdItems.ExecuteReader();
            while (itemReader.Read())
            {
                items.Add(new RecetaDigitalItemResponse(
                    ItemId: itemReader.GetGuid(itemReader.GetOrdinal("id")).ToString(),
                    MedicamentoCodigo: itemReader.GetString(itemReader.GetOrdinal("medicamento_codigo")),
                    MedicamentoSistema: itemReader.GetString(itemReader.GetOrdinal("medicamento_sistema")),
                    MedicamentoDisplay: itemReader.GetString(itemReader.GetOrdinal("medicamento_display")),
                    DosisTexto: itemReader.IsDBNull(itemReader.GetOrdinal("dosis_texto"))
                        ? null
                        : itemReader.GetString(itemReader.GetOrdinal("dosis_texto")),
                    FrecuenciaTexto: itemReader.IsDBNull(itemReader.GetOrdinal("frecuencia_texto"))
                        ? null
                        : itemReader.GetString(itemReader.GetOrdinal("frecuencia_texto")),
                    DuracionDias: itemReader.IsDBNull(itemReader.GetOrdinal("duracion_dias"))
                        ? null
                        : itemReader.GetInt32(itemReader.GetOrdinal("duracion_dias")),
                    Indicacion: itemReader.IsDBNull(itemReader.GetOrdinal("indicacion"))
                        ? null
                        : itemReader.GetString(itemReader.GetOrdinal("indicacion")),
                    Estado: itemReader.GetString(itemReader.GetOrdinal("estado"))));
            }
        }

        var eventos = new List<RecetaDigitalEventoResponse>();
        using (var cmdEventos = new NpgsqlCommand(sqlEventos, conn))
        {
            cmdEventos.Parameters.AddWithValue("receta_id", recetaId);
            using var eventoReader = cmdEventos.ExecuteReader();
            while (eventoReader.Read())
            {
                eventos.Add(new RecetaDigitalEventoResponse(
                    EventoId: eventoReader.GetGuid(eventoReader.GetOrdinal("id")).ToString(),
                    TipoEvento: eventoReader.GetString(eventoReader.GetOrdinal("tipo_evento")),
                    PayloadJson: eventoReader.IsDBNull(eventoReader.GetOrdinal("payload_json"))
                        ? "{}"
                        : eventoReader.GetString(eventoReader.GetOrdinal("payload_json")),
                    CreadoEn: eventoReader.GetDateTime(eventoReader.GetOrdinal("created_at")).ToString("O")));
            }
        }

        return new RecetaDigitalDetalleResponse(
            RecetaId: model.RecetaId,
            PacienteId: model.PacienteId,
            EncuentroId: model.EncuentroId,
            TurnoId: model.TurnoId,
            PrescriptorUsuarioId: model.PrescriptorUsuarioId,
            PrescriptorMatricula: model.PrescriptorMatricula,
            OrganizacionOid: model.OrganizacionOid,
            Estado: model.Estado,
            RdiarProfile: model.RdiarProfile,
            FhirBundleJson: model.FhirBundleJson,
            ExternalRecipeId: model.ExternalRecipeId,
            ExternalRepositoryUri: model.ExternalRepositoryUri,
            ValidacionOutcomeJson: model.ValidacionOutcomeJson,
            CreadoEn: model.CreadoEn,
            ActualizadoEn: model.ActualizadoEn,
            Items: items,
            Eventos: eventos);
    }

    public IReadOnlyList<RecetaDigitalResumenResponse> GetRecetasDigitalesByPaciente(Guid pacienteId)
    {
        const string sql = """
            select
                r.id,
                r.paciente_id,
                r.estado,
                r.rdiar_profile,
                r.created_at,
                coalesce(count(i.id), 0) as cantidad_items
            from sch_hca.receta_digital r
            left join sch_hca.receta_digital_item i
                on i.receta_id = r.id
               and i.activo = true
            where r.paciente_id = @paciente_id
              and r.activo = true
            group by r.id, r.paciente_id, r.estado, r.rdiar_profile, r.created_at
            order by r.created_at desc;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("paciente_id", pacienteId);

        var result = new List<RecetaDigitalResumenResponse>();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new RecetaDigitalResumenResponse(
                RecetaId: reader.GetGuid(reader.GetOrdinal("id")).ToString(),
                PacienteId: reader.GetGuid(reader.GetOrdinal("paciente_id")).ToString(),
                Estado: reader.GetString(reader.GetOrdinal("estado")),
                RdiarProfile: reader.GetString(reader.GetOrdinal("rdiar_profile")),
                CreadoEn: reader.GetDateTime(reader.GetOrdinal("created_at")).ToString("O"),
                CantidadItems: reader.GetInt32(reader.GetOrdinal("cantidad_items"))));
        }

        return result;
    }

    public AnularRecetaDigitalResponse? AnularRecetaDigital(Guid recetaId, string motivo, Guid usuarioId)
    {
        const string sqlExists = """
            select 1
            from sch_hca.receta_digital
            where id = @receta_id
              and activo = true;
            """;

        const string sqlUpdate = """
            update sch_hca.receta_digital
            set estado = @estado,
                updated_at = now()
            where id = @receta_id
              and activo = true;
            """;

        const string sqlEvento = """
            insert into sch_hca.receta_digital_evento
                (id, receta_id, tipo_evento, payload_json, activo, created_at, updated_at)
            values
                (@id, @receta_id, @tipo_evento, @payload_json::jsonb, true, now(), now());
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using (var cmdExists = new NpgsqlCommand(sqlExists, conn))
        {
            cmdExists.Parameters.AddWithValue("receta_id", recetaId);
            if (cmdExists.ExecuteScalar() is null)
            {
                return null;
            }
        }

        using var tx = conn.BeginTransaction();

        using (var cmdUpdate = new NpgsqlCommand(sqlUpdate, conn, tx))
        {
            cmdUpdate.Parameters.AddWithValue("receta_id", recetaId);
            cmdUpdate.Parameters.AddWithValue("estado", EstadoAnulada);
            cmdUpdate.ExecuteNonQuery();
        }

        var payload = JsonSerializer.Serialize(new
        {
            motivo,
            usuarioId,
            estado = EstadoAnulada
        });

        using (var cmdEvento = new NpgsqlCommand(sqlEvento, conn, tx))
        {
            cmdEvento.Parameters.AddWithValue("id", Guid.NewGuid());
            cmdEvento.Parameters.AddWithValue("receta_id", recetaId);
            cmdEvento.Parameters.AddWithValue("tipo_evento", "RECETA_ANULADA");
            cmdEvento.Parameters.AddWithValue("payload_json", payload);
            cmdEvento.ExecuteNonQuery();
        }

        tx.Commit();

        return new AnularRecetaDigitalResponse(
            RecetaId: recetaId.ToString(),
            Estado: EstadoAnulada,
            ActualizadoEn: DateTimeOffset.UtcNow.ToString("O"));
    }
}
