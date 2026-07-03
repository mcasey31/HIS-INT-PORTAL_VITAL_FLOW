using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Prescripcion.Contracts;
using VitalFlow.His.Api.Application.Prescripcion.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/prescripciones")]
[Authorize(Roles = "Medico,Auditor,Administrador")]
public sealed class PrescripcionController(
    IPrescripcionService prescripcionService,
    IHttpContextAccessor httpContextAccessor,
    ILogger<PrescripcionController> logger
) : ControllerBase
{
    [HttpPost]
    public ActionResult<CrearPrescripcionResponse> Crear([FromBody] CrearPrescripcionRequest request)
    {
        try
        {
            var usuarioId = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value
                ?? throw new UnauthorizedAccessException("Usuario no autenticado.");
            var username = httpContextAccessor.HttpContext?.User.Identity?.Name;
            var matricula = httpContextAccessor.HttpContext?.User.FindFirst("matricula")?.Value;

            var result = prescripcionService.Crear(request, usuarioId, username, matricula);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }

    }
}
