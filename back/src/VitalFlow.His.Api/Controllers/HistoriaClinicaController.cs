using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/historia-clinica")]
[Authorize(Roles = Roles.ClinicalAccess)]
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

    [HttpPost("evoluciones")]
    [Authorize(Roles = Roles.Medico + "," + Roles.Administrador)]
    public ActionResult<CrearEvolucionAmbulatoriaResponse> CrearEvolucion([FromBody] CrearEvolucionAmbulatoriaRequest request)
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

    [HttpPost("pacientes/{pacienteId:guid}/problemas")]
    [Authorize(Roles = Roles.Medico + "," + Roles.Administrador)]
    public ActionResult<AsignarProblemaResponse> AsignarProblema(Guid pacienteId, [FromBody] AsignarProblemaRequest request)
    {
        try
        {
            return Ok(historiaClinicaService.AsignarProblema(pacienteId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("turnos/{turnoId}/solicitudes-estudios")]
    public ActionResult<IReadOnlyList<SolicitudEstudioResponse>> ObtenerSolicitudesEstudios(string turnoId)
    {
        try
        {
            return Ok(historiaClinicaService.ObtenerSolicitudesEstudios(turnoId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("turnos/{turnoId}/solicitudes-estudios")]
    [Authorize(Roles = Roles.Medico + "," + Roles.Administrador)]
    public ActionResult<GuardarSolicitudesEstudiosResponse> GuardarSolicitudesEstudios(
        string turnoId, [FromBody] GuardarSolicitudesEstudiosRequest request)
    {
        try
        {
            return Ok(historiaClinicaService.GuardarSolicitudesEstudios(turnoId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
