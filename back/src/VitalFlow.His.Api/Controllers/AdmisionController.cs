using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Admision.Contracts;
using VitalFlow.His.Api.Application.Admision.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/admision")]
// Recepcion es el rol del mostrador: consulta el tablero del dia, hace el
// check-in, llama al paciente y cierra el encuentro.
[Authorize(Roles = "Administrador,Administrativo,Cajero,Auditor,Medico,Recepcion")]
public sealed class AdmisionController(IAdmisionService admisionService) : ControllerBase
{
    /// Tablero del dia. Mismos filtros que /landing/selectores mas los estados
    /// validos, para que la app habilite solo los botones que correspondan al
    /// estado actual sin duplicar la maquina de estados en el cliente.
    [HttpGet("landing/selectores")]
    public ActionResult<SelectoresAdmisionResponse> GetSelectores()
    {
        return Ok(admisionService.GetSelectores());
    }

    /// <summary>
    /// Tablero del dia. Se mantiene la respuesta como array plano porque el
    /// front web (front/src/admision/admisionApi.ts) ya lo consume con esa
    /// forma. Para la app movil usar POST /api/v1/admision/landing/tablero, que
    /// devuelve objeto paginado.
    /// </summary>
    [HttpPost("landing/buscar")]
    public ActionResult<IReadOnlyList<TurnoAdmisionResponse>> BuscarTurnos([FromBody] BuscarTurnosAdmisionRequest request)
    {
        return Ok(admisionService.BuscarTurnos(request));
    }

    /// <summary>
    /// Tablero paginado de la sala de espera. Mismos filtros que
    /// /landing/buscar mas page y pageSize.
    /// </summary>
    [HttpPost("landing/tablero")]
    public ActionResult<AdmisionTableroResponse> Tablero([FromBody] BuscarTurnosAdmisionRequest request, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { message = "page y pageSize deben ser mayores a cero." });
        }

        if (pageSize > 200)
        {
            return BadRequest(new { message = "pageSize no puede ser mayor a 200." });
        }

        return Ok(admisionService.BuscarTurnosPaginados(request, page, pageSize));
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
