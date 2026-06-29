using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/historia-clinica")]
[Authorize(Roles = "Medico,Auditor")]
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
}
