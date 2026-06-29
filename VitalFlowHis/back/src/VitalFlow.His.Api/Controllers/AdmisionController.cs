using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Admision.Contracts;
using VitalFlow.His.Api.Application.Admision.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/admision")]
[Authorize(Roles = "Administrador,Administrativo,Cajero,Auditor,Medico")]
public sealed class AdmisionController(IAdmisionService admisionService) : ControllerBase
{
    [HttpGet("landing/selectores")]
    public ActionResult<SelectoresAdmisionResponse> GetSelectores()
    {
        return Ok(admisionService.GetSelectores(BuildScope()));
    }

    [HttpPost("landing/buscar")]
    public ActionResult<IReadOnlyList<TurnoAdmisionResponse>> BuscarTurnos([FromBody] BuscarTurnosAdmisionRequest request)
    {
        return Ok(admisionService.BuscarTurnos(request, BuildScope()));
    }

    private AdmisionScopeContext BuildScope()
    {
        var esAdministrador = User.IsInRole("Administrador");
        var esMedico = User.IsInRole("Medico");

        Guid? centroId = null;
        var centroClaim = User.FindFirst("centroId")?.Value;
        if (Guid.TryParse(centroClaim, out var centroParsed) && centroParsed != Guid.Empty)
        {
            centroId = centroParsed;
        }

        Guid? personaId = null;
        var personaClaim = User.FindFirst("personaId")?.Value;
        if (Guid.TryParse(personaClaim, out var personaParsed) && personaParsed != Guid.Empty)
        {
            personaId = personaParsed;
        }

        Guid? userId = null;
        var userClaim = User.FindFirst("userId")?.Value;
        if (Guid.TryParse(userClaim, out var userParsed) && userParsed != Guid.Empty)
        {
            userId = userParsed;
        }

        return new AdmisionScopeContext(esAdministrador, esMedico, centroId, personaId, userId);
    }

    [HttpPost("turnos/{turnoId}/arribo")]
    public ActionResult<ConfirmarArriboTurnoResponse> ConfirmarArribo(string turnoId, [FromBody] ConfirmarArriboTurnoRequest request)
    {
        try
        {
            return Ok(admisionService.ConfirmarArribo(turnoId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("turnos/{turnoId}/facturacion-evento")]
    public ActionResult<EventoFacturacionTurnoResponse> ObtenerEventoFacturacion(string turnoId)
    {
        try
        {
            return Ok(admisionService.ObtenerEventoFacturacion(turnoId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("turnos/{turnoId}/estado")]
    public ActionResult<ActualizarEstadoTurnoResponse> ActualizarEstado(
        string turnoId,
        [FromBody] ActualizarEstadoTurnoRequest request)
    {
        try
        {
            return Ok(admisionService.ActualizarEstadoTurno(turnoId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("turnos/{turnoId}/encuentro")]
    public ActionResult<EncuentroAdmisionResponse> ObtenerEncuentro(string turnoId)
    {
        try
        {
            return Ok(admisionService.ObtenerEncuentro(turnoId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("turnos/{turnoId}/encuentro/cerrar")]
    public ActionResult<CerrarEncuentroResponse> CerrarEncuentro(string turnoId, [FromBody] CerrarEncuentroRequest request)
    {
        try
        {
            return Ok(admisionService.CerrarEncuentro(turnoId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("encuentros/cerrar-vencidos")]
    public ActionResult<CerrarEncuentrosVencidosResponse> CerrarEncuentrosVencidos([FromQuery] int horasMaximas = 24)
    {
        try
        {
            return Ok(admisionService.CerrarEncuentrosVencidos(horasMaximas));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
