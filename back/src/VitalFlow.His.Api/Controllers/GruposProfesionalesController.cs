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

    [HttpGet]
    public ActionResult<IReadOnlyList<GrupoProfesionalResponse>> GetGruposProfesionales([FromQuery] Guid? centroId, [FromQuery] Guid? servicioId)
    {
        return Ok(agendaService.GetGruposProfesionales(centroId, servicioId));
    }

    [HttpGet("{id:guid}")]
    public ActionResult<GrupoProfesionalResponse> GetGrupoProfesionalById(Guid id)
    {
        var grupo = agendaService.GetGrupoProfesionalById(id);
        return grupo is null ? NotFound() : Ok(grupo);
    }

    [HttpPut("{id:guid}")]
    public ActionResult<GrupoProfesionalResponse> UpdateGrupoProfesional(Guid id, [FromBody] CreateGrupoProfesionalRequest request)
    {
        try
        {
            var updated = agendaService.UpdateGrupoProfesional(id, request);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteGrupoProfesional(Guid id)
    {
        return agendaService.DeleteGrupoProfesional(id) ? NoContent() : NotFound();
    }
}
