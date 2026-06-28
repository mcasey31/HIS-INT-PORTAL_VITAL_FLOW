using System.Text.Json;
using Npgsql;
using VitalFlow.His.Api.Application.Prescripcion.Contracts;

namespace VitalFlow.His.Api.Infrastructure.Prescripcion;

public sealed class PostgresPrescripcionRepository(string connectionString)
{
    public CrearPrescripcionResponse Crear(CrearPrescripcionRequest request, string usuarioId)
    {
        var recetaId = Guid.NewGuid();
        var itemId = Guid.NewGuid();

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();
        using var tx = conn.BeginTransaction();

        var sqlReceta = """
            insert into sch_hca.receta_digital
                (id, paciente_id, encuentro_id, turno_id, prescriptor_usuario_id,
                 prescriptor_matricula, organizacion_oid, estado, rdiar_profile,
                 fhir_bundle_json, external_recipe_id, external_repository_uri,
                 validacion_outcome_json, activo, created_at, updated_at)
            values
                (@id, @paciente_id, null, @turno_id, @prescriptor_usuario_id,
                 '', '', 'ACTIVA', '',
                 '{}'::jsonb, null, null,
                 null, true, now(), now());
            """;

        using (var cmd = new NpgsqlCommand(sqlReceta, conn, tx))
        {
            cmd.Parameters.AddWithValue("id", recetaId);
            cmd.Parameters.AddWithValue("paciente_id", Guid.Parse(request.PacienteId));
            cmd.Parameters.AddWithValue("turno_id", Guid.Parse(request.TurnoId));
            cmd.Parameters.AddWithValue("prescriptor_usuario_id", Guid.Parse(usuarioId));
            cmd.ExecuteNonQuery();
        }

        var sqlItem = """
            insert into sch_hca.receta_digital_item
                (id, receta_id, medicamento_codigo, medicamento_sistema, medicamento_display,
                 dosis_texto, frecuencia_texto, duracion_dias, indicacion, estado,
                 activo, created_at, updated_at)
            values
                (@id, @receta_id, @medicamento_codigo, @medicamento_sistema, @medicamento_display,
                 @dosis_texto, @frecuencia_texto, @duracion_dias, @indicacion, 'ACTIVA',
                 true, now(), now());
            """;

        using (var cmd = new NpgsqlCommand(sqlItem, conn, tx))
        {
            cmd.Parameters.AddWithValue("id", itemId);
            cmd.Parameters.AddWithValue("receta_id", recetaId);
            cmd.Parameters.AddWithValue("medicamento_codigo", request.MedicamentoId.ToString());
            cmd.Parameters.AddWithValue("medicamento_sistema", "urn:oid:1.3.6.1.4.1.19149.1");
            cmd.Parameters.AddWithValue("medicamento_display", request.MedicamentoDisplay);
            cmd.Parameters.AddWithValue("dosis_texto", (object?)request.DosisTexto ?? DBNull.Value);
            cmd.Parameters.AddWithValue("frecuencia_texto", (object?)request.FrecuenciaTexto ?? DBNull.Value);
            cmd.Parameters.AddWithValue("duracion_dias", (object?)request.DuracionDias ?? DBNull.Value);
            cmd.Parameters.AddWithValue("indicacion", (object?)request.Indicacion ?? DBNull.Value);
            cmd.ExecuteNonQuery();
        }

        var payload = JsonSerializer.Serialize(new { estado = "ACTIVA", origin = "ODI_PROPIO" });
        var sqlEvento = """
            insert into sch_hca.receta_digital_evento
                (id, receta_id, tipo_evento, payload_json, activo, created_at, updated_at)
            values
                (@id, @receta_id, @tipo_evento, @payload_json::jsonb, true, now(), now());
            """;

        using (var cmd = new NpgsqlCommand(sqlEvento, conn, tx))
        {
            cmd.Parameters.AddWithValue("id", Guid.NewGuid());
            cmd.Parameters.AddWithValue("receta_id", recetaId);
            cmd.Parameters.AddWithValue("tipo_evento", "CREACION");
            cmd.Parameters.AddWithValue("payload_json", payload);
            cmd.ExecuteNonQuery();
        }

        tx.Commit();

        return new CrearPrescripcionResponse(
            recetaId.ToString(),
            "ACTIVA",
            DateTime.UtcNow.ToString("o")
        );
    }
}
