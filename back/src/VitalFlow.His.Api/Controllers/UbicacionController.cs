using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Ubicacion.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/ubicacion")]
[Authorize]
public sealed class UbicacionController(IUbicacionService ubicacionService) : ControllerBase
{
    [HttpGet("provincias")]
    public ActionResult<object> GetProvincias()
    {
        var items = ubicacionService.GetProvincias();
        return Ok(new { items });
    }

    [HttpGet("localidades")]
    public ActionResult<object> GetLocalidades([FromQuery] string? provinciaId)
    {
        var items = ubicacionService.GetLocalidades(provinciaId);
        return Ok(new { items });
    }
}
