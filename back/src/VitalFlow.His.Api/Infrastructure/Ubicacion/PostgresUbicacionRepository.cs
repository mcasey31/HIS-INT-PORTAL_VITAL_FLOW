using Npgsql;
using VitalFlow.His.Api.Application.Ubicacion.Contracts;
using VitalFlow.His.Api.Application.Ubicacion.Repositories;

namespace VitalFlow.His.Api.Infrastructure.Ubicacion;

public sealed class PostgresUbicacionRepository(string connectionString) : IUbicacionRepository
{
    public IReadOnlyList<ProvinciaResponse> GetProvincias()
    {
        const string sql = """
            SELECT id, nombre
            FROM sch_ubicacion.provincia
            WHERE activo = true
            ORDER BY nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<ProvinciaResponse>();
        while (reader.Read())
        {
            result.Add(new ProvinciaResponse(
                reader.GetString(0),
                reader.GetString(1)
            ));
        }

        return result;
    }

    public IReadOnlyList<LocalidadResponse> GetLocalidades(string? provinciaId)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        if (!string.IsNullOrWhiteSpace(provinciaId))
        {
            const string sql = """
                SELECT id, provincia_id, nombre
                FROM sch_ubicacion.localidad
                WHERE activo = true AND provincia_id = @provinciaId
                ORDER BY nombre;
                """;

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("provinciaId", provinciaId);
            using var reader = cmd.ExecuteReader();

            var result = new List<LocalidadResponse>();
            while (reader.Read())
            {
                result.Add(new LocalidadResponse(
                    reader.GetString(0),
                    reader.GetString(1),
                    reader.GetString(2)
                ));
            }

            return result;
        }
        else
        {
            const string sql = """
                SELECT id, provincia_id, nombre
                FROM sch_ubicacion.localidad
                WHERE activo = true
                ORDER BY provincia_id, nombre;
                """;

            using var cmd = new NpgsqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            var result = new List<LocalidadResponse>();
            while (reader.Read())
            {
                result.Add(new LocalidadResponse(
                    reader.GetString(0),
                    reader.GetString(1),
                    reader.GetString(2)
                ));
            }

            return result;
        }
    }
}
