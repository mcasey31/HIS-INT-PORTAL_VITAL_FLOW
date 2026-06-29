using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/personas")]
[Authorize(Roles = "Administrador,Enrolamiento Persona")]
public sealed class PersonasController(IPersonaService personaService) : ControllerBase
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

    [HttpGet("busqueda-por-nombre")]
    public IActionResult BuscarPorApellidoNombre([FromQuery] string apellido, [FromQuery] string nombre)
    {
        if (string.IsNullOrWhiteSpace(apellido) || string.IsNullOrWhiteSpace(nombre))
        {
            return BadRequest(new { message = "apellido y nombre son obligatorios." });
        }

        var candidatos = personaService.BuscarPorApellidoNombre(apellido, nombre);
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
        if (
            string.IsNullOrWhiteSpace(tipoDocumento) ||
            string.IsNullOrWhiteSpace(numeroDocumento) ||
            string.IsNullOrWhiteSpace(nombre) ||
            string.IsNullOrWhiteSpace(apellido) ||
            string.IsNullOrWhiteSpace(fechaNacimiento) ||
            string.IsNullOrWhiteSpace(sexoBiologico))
        {
            return BadRequest(new { message = "Todos los campos del set de datos minimos son obligatorios." });
        }

        var parseResult = ParseSetMinimoRequest(
            tipoDocumento,
            numeroDocumento,
            nombre,
            apellido,
            fechaNacimiento,
            sexoBiologico,
            null,
            null
        );

        if (parseResult.Error is not null)
        {
            return BadRequest(new { message = parseResult.Error });
        }

        var request = parseResult.Request!;

        var candidatos = personaService.BuscarPorSetDatosMinimos(request);
        return Ok(candidatos);
    }

    [HttpPost("empadronar-set-minimo")]
    [Authorize(Roles = "Administrador,Enrolamiento Persona")]
    public IActionResult EmpadronarConSetMinimo([FromBody] BuscarPersonaSetMinimoBody body)
    {
        var parseResult = ParseSetMinimoRequest(
            body.TipoDocumento,
            body.NumeroDocumento,
            body.Nombre,
            body.Apellido,
            body.FechaNacimiento,
            body.SexoBiologico,
            body.Email,
            body.Telefono
        );

        if (parseResult.Error is not null)
        {
            return BadRequest(new { message = parseResult.Error });
        }

        try
        {
            var creada = personaService.EmpadronarConSetDatosMinimos(parseResult.Request!);
            return Ok(creada);
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
        var parseResult = ParseSetMinimoRequest(
            body.TipoDocumento,
            body.NumeroDocumento,
            body.Nombre,
            body.Apellido,
            body.FechaNacimiento,
            body.SexoBiologico,
            body.Email,
            body.Telefono
        );

        if (parseResult.Error is not null)
        {
            return BadRequest(new { message = parseResult.Error });
        }

        try
        {
            var actualizada = personaService.ActualizarSetDatosMinimos(personaId, parseResult.Request!);
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

    private static (BuscarPersonaSetMinimoRequest? Request, string? Error) ParseSetMinimoRequest(
        string tipoDocumento,
        string numeroDocumento,
        string nombre,
        string apellido,
        string fechaNacimiento,
        string sexoBiologico,
        string? email,
        string? telefono)
    {
        if (
            string.IsNullOrWhiteSpace(tipoDocumento) ||
            string.IsNullOrWhiteSpace(numeroDocumento) ||
            string.IsNullOrWhiteSpace(nombre) ||
            string.IsNullOrWhiteSpace(apellido) ||
            string.IsNullOrWhiteSpace(fechaNacimiento) ||
            string.IsNullOrWhiteSpace(sexoBiologico))
        {
            return (null, "Todos los campos del set de datos minimos son obligatorios.");
        }

        if (!DateOnly.TryParse(fechaNacimiento, out var fechaNacimientoValue))
        {
            return (null, "fechaNacimiento tiene formato invalido.");
        }

        if (fechaNacimientoValue > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return (null, "fechaNacimiento no puede ser posterior a la fecha actual.");
        }

        return (
            new BuscarPersonaSetMinimoRequest(
                tipoDocumento,
                numeroDocumento,
                nombre,
                apellido,
                fechaNacimientoValue,
                sexoBiologico,
                string.IsNullOrWhiteSpace(email) ? null : email.Trim(),
                string.IsNullOrWhiteSpace(telefono) ? null : telefono.Trim()
            ),
            null
        );
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
