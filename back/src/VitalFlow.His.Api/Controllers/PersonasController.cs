using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/personas")]
[Authorize(Roles = "Administrador,Enrolamiento Persona,Medico,Auditor,Administrativo,Cajero")]
public sealed class PersonasController(
    IPersonaService personaService,
    IConfiguration configuration
) : ControllerBase
{
    [HttpGet("tipos-documento")]
    public IActionResult GetTiposDocumento()
    {
        return Ok(personaService.GetTiposDocumento());
    }

    [HttpGet("busqueda")]
    public IActionResult BuscarPorTipoYNumeroDocumento([FromQuery] string tipoDocumento, [FromQuery] string numeroDocumento)
    {
        if (string.IsNullOrWhiteSpace(tipoDocumento) || string.IsNullOrWhiteSpace(numeroDocumento))
        {
            return BadRequest(new { message = "tipoDocumento y numeroDocumento son obligatorios." });
        }

        var candidatos = personaService.BuscarPorTipoYNumeroDocumento(tipoDocumento, numeroDocumento);
        return Ok(candidatos);
    }

    [HttpGet("busqueda-set-minimo")]
    public IActionResult BuscarPorSetMinimo(
        [FromQuery] string tipoDocumento,
        [FromQuery] string numeroDocumento,
        [FromQuery] string nombre,
        [FromQuery] string apellido,
        [FromQuery] string fechaNacimiento,
        [FromQuery] string sexoBiologico)
    {
        try
        {
            var request = personaService.ParseAndValidateSetMinimoRequest(
                tipoDocumento, numeroDocumento, nombre, apellido,
                fechaNacimiento, sexoBiologico, null, null);
            var candidatos = personaService.BuscarPorSetDatosMinimos(request);
            return Ok(candidatos);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("empadronar-set-minimo")]
[Authorize(Roles = "Administrador,Enrolamiento Persona,Medico")]
    public IActionResult EmpadronarConSetMinimo([FromBody] BuscarPersonaSetMinimoBody body)
    {
        try
        {
            var request = personaService.ParseAndValidateSetMinimoRequest(
                body.TipoDocumento, body.NumeroDocumento, body.Nombre, body.Apellido,
                body.FechaNacimiento, body.SexoBiologico, body.Email, body.Telefono);
            var creada = personaService.EmpadronarConSetDatosMinimos(request);
            return Ok(creada);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            return BadRequest(new { message = "Ya existe una persona con ese tipo y numero de documento." });
        }
    }

    [HttpPut("{personaId:guid}/set-minimo")]
    public IActionResult ActualizarSetMinimo(Guid personaId, [FromBody] BuscarPersonaSetMinimoBody body)
    {
        try
        {
            var request = personaService.ParseAndValidateSetMinimoRequest(
                body.TipoDocumento, body.NumeroDocumento, body.Nombre, body.Apellido,
                body.FechaNacimiento, body.SexoBiologico, body.Email, body.Telefono);
            var actualizada = personaService.ActualizarSetDatosMinimos(personaId, request);
            return Ok(actualizada);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            return BadRequest(new { message = "Ya existe una persona con ese tipo y numero de documento." });
        }
    }

    [HttpGet("{personaId:guid}/financiador-activo")]
    public IActionResult GetFinanciadorActivo(Guid personaId)
    {
        const string sql = """
            select
                f.nombre as financiador_nombre,
                fp.numero_afiliado,
                pf.nombre as plan_nombre
            from sch_administracion.t_paciente_financiador_plan fp
            join sch_persona.financiador f on f.id = fp.financiador_id
            left join sch_persona.financiador_plan pf on pf.id = fp.plan_financiador_id
            where fp.paciente_id = @persona_id
              and fp.vigente = true
              and (fp.fecha_hasta is null or fp.fecha_hasta >= current_date)
            order by fp.created_at desc
            limit 1;
            """;

        using var conn = new NpgsqlConnection(configuration.GetConnectionString("VitalFlowHisDb"));
        conn.Open();
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("persona_id", personaId);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return Ok(new { financiadorNombre = "", numeroAfiliado = "", planNombre = "" });
        }

        return Ok(new
        {
            financiadorNombre = reader.GetString(0),
            numeroAfiliado = reader.IsDBNull(1) ? "" : reader.GetString(1),
            planNombre = reader.IsDBNull(2) ? "" : reader.GetString(2)
        });
    }

    [HttpGet("{personaId:guid}/domicilio")]
    public IActionResult GetDomicilio(Guid personaId)
    {
        var domicilio = personaService.GetDomicilio(personaId);
        if (domicilio is null)
        {
            return Ok(new DomicilioResponse(
                Guid.Empty, personaId, null, "", "", "", "", "", "", "", "", "", ""
            ));
        }
        return Ok(domicilio);
    }

    [HttpPut("{personaId:guid}/domicilio")]
    public IActionResult UpsertDomicilio(Guid personaId, [FromBody] DomicilioRequest request)
    {
        try
        {
            var result = personaService.UpsertDomicilio(personaId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{personaId:guid}/contactos")]
    public IActionResult GetContactos(Guid personaId)
    {
        return Ok(personaService.GetContactos(personaId));
    }

    [HttpGet("{personaId:guid}/correos")]
    public IActionResult GetCorreos(Guid personaId)
    {
        const string sql = """
            select email from sch_persona.persona where id = @personaId
            """;

        using var conn = new NpgsqlConnection(configuration.GetConnectionString("VitalFlowHisDb"));
        conn.Open();

        var correos = new List<string>();

        using (var cmd = new NpgsqlCommand(sql, conn))
        {
            cmd.Parameters.AddWithValue("personaId", personaId);
            using var reader = cmd.ExecuteReader();
            if (reader.Read() && !reader.IsDBNull(0))
            {
                var email = reader.GetString(0);
                if (!string.IsNullOrWhiteSpace(email))
                    correos.Add(email.Trim());
            }
        }

        return Ok(new
        {
            principal = correos.Count > 0 ? correos[0] : "",
            correos
        });
    }

    [HttpPost("{personaId:guid}/contactos")]
    public IActionResult CreateContacto(Guid personaId, [FromBody] PersonaContactoRequest request)
    {
        try
        {
            var result = personaService.CreateContacto(personaId, request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{personaId:guid}/contactos/{contactoId:guid}")]
    public IActionResult UpdateContacto(Guid personaId, Guid contactoId, [FromBody] PersonaContactoRequest request)
    {
        try
        {
            var result = personaService.UpdateContacto(personaId, contactoId, request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{personaId:guid}/contactos")]
    public IActionResult DeleteContactos(Guid personaId, [FromQuery] string ids)
    {
        if (string.IsNullOrWhiteSpace(ids))
            return BadRequest(new { message = "Debe especificar al menos un ID de contacto en el query string 'ids' separados por coma." });
        var guids = ids.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                       .Select(s => Guid.Parse(s.Trim())).ToList();
        if (guids.Count == 0)
            return BadRequest(new { message = "Ningun ID valido proporcionado." });
        personaService.DeleteContactos(personaId, guids);
        return Ok(new { deleted = guids.Count });
    }

    public sealed record BuscarPersonaSetMinimoBody(
        string TipoDocumento,
        string NumeroDocumento,
        string Nombre,
        string Apellido,
        string FechaNacimiento,
        string SexoBiologico,
        string? Email,
        string? Telefono
    );
}
