using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Agenda.Contracts;
using VitalFlow.His.Api.Application.Agenda.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/grupos-profesionales")]
[Authorize(Roles = "Administrador,Administrativo,Cajero,Auditor")]
public sealed class GruposProfesionalesController(IAgendaService agendaService) : ControllerBase
{
    [HttpPost]
    public ActionResult<GrupoProfesionalResponse> CreateGrupoProfesional([FromBody] CreateGrupoProfesionalRequest request)
    {
        try
        {
            var created = agendaService.CreateGrupoProfesional(request);
            return CreatedAtAction(nameof(CreateGrupoProfesional), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
