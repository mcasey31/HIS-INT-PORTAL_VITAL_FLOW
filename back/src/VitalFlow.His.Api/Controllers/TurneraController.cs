using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api;
using VitalFlow.His.Api.Application.Turnera.Contracts;
using VitalFlow.His.Api.Application.Turnera.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/turnera")]
public sealed class TurneraController(ITurneraService turneraService) : ControllerBase
{
    [HttpGet("display")]
    [AllowAnonymous]
    public ActionResult<DisplayTurneraResponse> GetDisplay(
        [FromQuery] string? centroId,
        [FromQuery] string? efectorId)
    {
        return Ok(turneraService.GetDisplay(centroId, efectorId));
    }

    [HttpGet("ultimo-llamado")]
    [AllowAnonymous]
    public ActionResult<UltimoLlamadoTurneraResponse> GetUltimoLlamado(
        [FromQuery] string? centroId,
        [FromQuery] string? efectorId)
    {
        return Ok(turneraService.GetUltimoLlamado(centroId, efectorId));
    }

    [HttpPost("llamar")]
    [Authorize(Roles = Roles.FullAccess)]
    public ActionResult<LlamarPacienteTurneraResponse> LlamarPaciente([FromBody] LlamarPacienteTurneraRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TurnoId))
            return BadRequest(new { message = "turnoId es obligatorio." });

        var result = turneraService.LlamarPaciente(request.TurnoId);
        if (!result.Ok)
            return BadRequest(new { message = "El turno no esta en un estado que permita llamarlo." });

        return Ok(result);
    }

    [HttpPost("kiosco/arribo")]
    [AllowAnonymous]
    public ActionResult<KioscoArriboResponse> KioscoArribo([FromBody] KioscoArriboRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Documento))
            return BadRequest(new { message = "documento es obligatorio." });

        if (string.IsNullOrWhiteSpace(request.CentroId))
            return BadRequest(new { message = "centroId es obligatorio." });

        var result = turneraService.KioscoArribo(request);
        if (!result.Ok)
            return BadRequest(new { message = result.Mensaje });

        return Ok(result);
    }
}
