using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api;
using VitalFlow.His.Api.Application.EstructuraInterna.Contracts;
using VitalFlow.His.Api.Application.EstructuraInterna.Services;
using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/estructura-interna")]
public sealed class EstructuraInternaController(
    IEstructuraInternaService estructuraInternaService,
    IPersonaService personaService) : ControllerBase
{
    [HttpGet("tipos-documento")]
    [Authorize(Roles = Roles.AllRoles)]
    public ActionResult<IReadOnlyList<TipoDocumentoResponse>> GetTiposDocumento()
    {
        return Ok(personaService.GetTiposDocumento());
    }

    [HttpGet("personas/busqueda")]
    [Authorize(Roles = Roles.AllRoles)]
    public ActionResult<IReadOnlyList<PersonaCandidataResponse>> BuscarPersonaPorDocumento(
        [FromQuery] string tipoDocumento,
        [FromQuery] string numeroDocumento)
    {
        if (string.IsNullOrWhiteSpace(tipoDocumento) || string.IsNullOrWhiteSpace(numeroDocumento))
        {
            return BadRequest(new { message = "tipoDocumento y numeroDocumento son obligatorios." });
        }

        return Ok(personaService.BuscarPorTipoYNumeroDocumento(tipoDocumento, numeroDocumento));
    }

    [HttpGet("nodos")]
    [Authorize(Roles = Roles.SecurityAccess)]
    public ActionResult<IReadOnlyList<NodoEstructuraInternaResponse>> GetNodos()
    {
        return Ok(estructuraInternaService.GetNodos());
    }

    [HttpGet("{nodoId}/registros")]
    [Authorize(Roles = Roles.SecurityAccess)]
    public ActionResult<IReadOnlyList<RegistroNodoResponse>> GetRegistros(string nodoId)
    {
        try
        {
            return Ok(estructuraInternaService.GetRegistros(nodoId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{nodoId}/registros")]
    [Authorize(Roles = Roles.SecurityAccess)]
    public ActionResult<RegistroNodoResponse> SaveRegistro(string nodoId, [FromBody] SaveRegistroNodoRequest request)
    {
        try
        {
            return Ok(estructuraInternaService.SaveRegistro(nodoId, request));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
