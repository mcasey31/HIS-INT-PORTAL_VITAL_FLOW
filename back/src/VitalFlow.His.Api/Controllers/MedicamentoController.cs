using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Medicamento.Contracts;
using VitalFlow.His.Api.Application.Medicamento.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/medicamentos")]
[Authorize(Roles = "Medico,Auditor")]
public sealed class MedicamentoController(IMedicamentoService medicamentoService) : ControllerBase
{
    [HttpGet("buscar")]
    public ActionResult<object> Buscar(
        [FromQuery] string? q,
        [FromQuery] string? generico,
        [FromQuery] string? laboratorio,
        [FromQuery] int pagina = 1,
        [FromQuery] int paginaSize = 20)
    {
        var request = new BuscarMedicamentosRequest(q, generico, laboratorio, pagina, paginaSize);
        var (items, totalCount) = medicamentoService.Buscar(request);
        return Ok(new { items, totalCount, pagina, paginaSize });
    }
}
