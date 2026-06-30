using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/practicas")]
[Authorize(Roles = "Medico,Auditor,Administrador")]
public sealed class PracticasController(IConfiguration configuration) : ControllerBase
{
    [HttpGet("catalogo")]
    public ActionResult<IReadOnlyList<PracticaCatalogoItemResponse>> ObtenerCatalogo(
        [FromQuery] string? categoria,
        [FromQuery] string? search)
    {
        var connectionString = configuration.GetConnectionString("VitalFlowHisDb")
            ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        var sql = """
            select
                id,
                codigo,
                nombre,
                categoria,
                nombre_completo,
                bono_b,
                bono_c,
                activa
            from sch_hca.practica_catalogo
            where activa = true
            """;

        if (!string.IsNullOrWhiteSpace(categoria))
        {
            sql += " and categoria = @categoria";
        }

        if (!string.IsNullOrWhiteSpace(search) && search.Length >= 2)
        {
            sql += " and (unaccent(nombre_completo) ilike unaccent(@search) or unaccent(codigo) ilike unaccent(@search))";
        }

        sql += " order by categoria, codigo";

        using var cmd = new NpgsqlCommand(sql, conn);

        if (!string.IsNullOrWhiteSpace(categoria))
        {
            cmd.Parameters.AddWithValue("categoria", categoria);
        }

        if (!string.IsNullOrWhiteSpace(search) && search.Length >= 2)
        {
            cmd.Parameters.AddWithValue("search", $"%{search}%");
        }

        var result = new List<PracticaCatalogoItemResponse>();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new PracticaCatalogoItemResponse(
                reader.GetInt32(reader.GetOrdinal("id")),
                reader.GetString(reader.GetOrdinal("codigo")),
                reader.GetString(reader.GetOrdinal("nombre")),
                reader.IsDBNull(reader.GetOrdinal("categoria")) ? null : reader.GetString(reader.GetOrdinal("categoria")),
                reader.IsDBNull(reader.GetOrdinal("nombre_completo")) ? null : reader.GetString(reader.GetOrdinal("nombre_completo")),
                reader.GetDecimal(reader.GetOrdinal("bono_b")),
                reader.GetDecimal(reader.GetOrdinal("bono_c")),
                reader.GetBoolean(reader.GetOrdinal("activa"))
            ));
        }

        return Ok(result);
    }

    [HttpGet("catalogo/categorias")]
    public ActionResult<IReadOnlyList<string>> ObtenerCategorias()
    {
        var connectionString = configuration.GetConnectionString("VitalFlowHisDb")
            ?? throw new InvalidOperationException("ConnectionStrings:VitalFlowHisDb is required.");

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        const string sql = """
            select distinct categoria
            from sch_hca.practica_catalogo
            where activa = true and categoria is not null
            order by categoria
            """;

        using var cmd = new NpgsqlCommand(sql, conn);
        var result = new List<string>();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            result.Add(reader.GetString(0));
        }

        return Ok(result);
    }
}

public sealed record PracticaCatalogoItemResponse(
    int Id,
    string Codigo,
    string Nombre,
    string? Categoria,
    string? NombreCompleto,
    decimal BonoB,
    decimal BonoC,
    bool Activa
);
