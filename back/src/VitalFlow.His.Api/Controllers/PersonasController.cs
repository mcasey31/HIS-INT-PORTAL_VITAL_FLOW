using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/personas")]
[Authorize(Roles = "Administrador,Enrolamiento Persona,Medico")]
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
