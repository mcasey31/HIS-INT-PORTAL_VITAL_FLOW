using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/historia-clinica")]
[Authorize(Roles = "Medico,Auditor,Administrador")]
public sealed class HistoriaClinicaController(IHistoriaClinicaService historiaClinicaService) : ControllerBase
{
    [HttpGet("pacientes/{pacienteId:guid}/problemas-cronicos")]
    public ActionResult<IReadOnlyList<ProblemaCronicoResponse>> ObtenerProblemasCronicos(Guid pacienteId)
    {
        try
        {
            return Ok(historiaClinicaService.ObtenerProblemasCronicos(pacienteId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("pacientes/{pacienteId:guid}/evoluciones-ambulatorias")]
    public ActionResult<IReadOnlyList<EvolucionAmbulatoriaResponse>> ObtenerEvolucionesAmbulatorias(
        Guid pacienteId,
        [FromQuery] int limit = 20)
    {
        try
        {
            return Ok(historiaClinicaService.ObtenerEvolucionesAmbulatorias(pacienteId, limit));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("pacientes/evoluciones-ambulatorias")]
    public ActionResult<CrearEvolucionAmbulatoriaResponse> CrearEvolucionAmbulatoria(
        [FromBody] CrearEvolucionAmbulatoriaRequest request)
    {
        try
        {
            return Ok(historiaClinicaService.CrearEvolucionAmbulatoria(request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("pacientes/{pacienteId:guid}/solicitudes-estudio")]
    public ActionResult<IReadOnlyList<SolicitudEstudioResponse>> ObtenerSolicitudesEstudio(
        Guid pacienteId,
        [FromQuery] string? turnoId)
    {
        try
        {
            return Ok(historiaClinicaService.ObtenerSolicitudesEstudio(pacienteId, turnoId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("pacientes/{pacienteId:guid}/solicitudes-estudio/sync")]
    public ActionResult SincronizarSolicitudesEstudio(
        Guid pacienteId,
        [FromQuery] string turnoId,
        [FromBody] SincronizarSolicitudesEstudioRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Guid? createdBy = userIdClaim is not null && Guid.TryParse(userIdClaim, out var uid) ? uid : null;
            historiaClinicaService.SincronizarSolicitudesEstudio(pacienteId, turnoId, request, createdBy);
            return Ok(new { message = "Solicitudes sincronizadas correctamente." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
