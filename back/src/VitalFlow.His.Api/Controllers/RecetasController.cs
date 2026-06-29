using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/recetas")]
[Authorize(Roles = "Medico,Auditor")]
public sealed class RecetasController(IHistoriaClinicaService historiaClinicaService) : ControllerBase
{
    [HttpPost]
    public ActionResult<RegistrarRecetaDigitalResponse> RegistrarReceta([FromBody] RegistrarRecetaDigitalRequest request)
    {
        try
        {
            return Ok(historiaClinicaService.RegistrarRecetaDigital(request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{recetaId:guid}")]
    public ActionResult<RecetaDigitalDetalleResponse> ObtenerReceta(Guid recetaId)
    {
        try
        {
            return Ok(historiaClinicaService.ObtenerRecetaDigital(recetaId));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public ActionResult<IReadOnlyList<RecetaDigitalResumenResponse>> ListarRecetasPaciente([FromQuery] string pacienteId)
    {
        if (!Guid.TryParse(pacienteId, out var pacienteIdGuid) || pacienteIdGuid == Guid.Empty)
        {
            return BadRequest(new { message = "pacienteId es obligatorio y debe ser GUID valido." });
        }

        return Ok(historiaClinicaService.ObtenerRecetasDigitalesPaciente(pacienteIdGuid));
    }

    [HttpPost("{recetaId:guid}/anular")]
    public ActionResult<AnularRecetaDigitalResponse> AnularReceta(Guid recetaId, [FromBody] AnularRecetaDigitalRequest request)
    {
        try
        {
            return Ok(historiaClinicaService.AnularRecetaDigital(recetaId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}