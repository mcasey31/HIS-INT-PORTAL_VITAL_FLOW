using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api;
using VitalFlow.His.Api.Application.Admision.Contracts;
using VitalFlow.His.Api.Application.Admision.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/admision")]
[Authorize(Roles = Roles.FullAccess)]
public sealed class AdmisionController(IAdmisionService admisionService) : ControllerBase
{
    [HttpGet("landing/selectores")]
    public ActionResult<SelectoresAdmisionResponse> GetSelectores()
    {
        return Ok(admisionService.GetSelectores());
    }

    [HttpPost("landing/buscar")]
    public ActionResult<IReadOnlyList<TurnoAdmisionResponse>> BuscarTurnos([FromBody] BuscarTurnosAdmisionRequest request)
    {
        return Ok(admisionService.BuscarTurnos(request));
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

    [HttpPost("limpiar-eventos-huerfanos")]
    public ActionResult<LimpiarEventosHuerfanosResponse> LimpiarEventosHuerfanos([FromBody] LimpiarEventosHuerfanosRequest? request)
    {
        try
        {
            return Ok(admisionService.LimpiarEventosHuerfanos(request));
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
