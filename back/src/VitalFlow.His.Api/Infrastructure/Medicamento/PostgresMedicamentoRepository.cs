using Npgsql;
using VitalFlow.His.Api.Application.Medicamento.Contracts;
using VitalFlow.His.Api.Application.Medicamento.Repositories;

namespace VitalFlow.His.Api.Infrastructure.Medicamento;

public sealed class PostgresMedicamentoRepository(string connectionString) : IMedicamentoRepository
{
    public IReadOnlyList<MedicamentoResponse> Buscar(BuscarMedicamentosRequest request, out int totalCount)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        var conditions = new List<string>();
        var parameters = new List<Npgsql.NpgsqlParameter>();

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            conditions.Add("(principio_activo ILIKE @q OR producto ILIKE @q OR laboratorio ILIKE @q)");
            parameters.Add(new NpgsqlParameter("q", $"%{request.Q.Trim()}%"));
        }
        if (!string.IsNullOrWhiteSpace(request.Generico))
        {
            conditions.Add("principio_activo ILIKE @generico");
            parameters.Add(new NpgsqlParameter("generico", $"%{request.Generico.Trim()}%"));
        }
        if (!string.IsNullOrWhiteSpace(request.Laboratorio))
        {
            conditions.Add("laboratorio ILIKE @laboratorio");
            parameters.Add(new NpgsqlParameter("laboratorio", $"%{request.Laboratorio.Trim()}%"));
        }
        if (request.SoloGenerico)
        {
            conditions.Add("producto ILIKE principio_activo || '%'");
        }

        var whereClause = conditions.Count > 0 ? "WHERE " + string.Join(" AND ", conditions) : "";
        var esGenericoExpr = "producto ILIKE principio_activo || '%'";
        var selectColumns = $"id, principio_activo, presentacion, producto, laboratorio, familia, forma, ({esGenericoExpr}) AS es_generico";

        var countSql = $"SELECT COUNT(*) FROM sch_agenda.medicamento {whereClause}";
        using var countCmd = new NpgsqlCommand(countSql, conn);
        countCmd.Parameters.AddRange(parameters.ToArray());
        totalCount = Convert.ToInt32(countCmd.ExecuteScalar());

        var offset = (request.Page - 1) * request.PageSize;
        var dataSql = $"""
            SELECT {selectColumns}
            FROM sch_agenda.medicamento
            {whereClause}
            ORDER BY principio_activo, producto
            LIMIT @limit OFFSET @offset
            """;

        using var dataCmd = new NpgsqlCommand(dataSql, conn);
        foreach (var p in parameters)
        {
            var val = p.Value ?? DBNull.Value;
            dataCmd.Parameters.AddWithValue(p.ParameterName, val);
        }
        dataCmd.Parameters.AddWithValue("limit", request.PageSize);
        dataCmd.Parameters.AddWithValue("offset", offset);

        var result = new List<MedicamentoResponse>();
        using var reader = dataCmd.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new MedicamentoResponse(
                reader.GetInt32(reader.GetOrdinal("id")),
                reader.GetString(reader.GetOrdinal("principio_activo")),
                reader.GetString(reader.GetOrdinal("presentacion")),
                reader.GetString(reader.GetOrdinal("producto")),
                reader.GetString(reader.GetOrdinal("laboratorio")),
                reader.GetString(reader.GetOrdinal("familia")),
                reader.GetString(reader.GetOrdinal("forma")),
                reader.GetBoolean(reader.GetOrdinal("es_generico"))
            ));
        }
        return result;
    }
}
