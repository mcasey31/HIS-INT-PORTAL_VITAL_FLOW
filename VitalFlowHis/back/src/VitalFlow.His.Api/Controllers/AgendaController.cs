using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api.Application.Agenda.Contracts;
using VitalFlow.His.Api.Application.Agenda.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/agendas")]
[Authorize(Roles = "Administrador,Administrativo,Cajero,Auditor")]
public sealed class AgendaController(IAgendaService agendaService) : ControllerBase
{
    [HttpGet("selectores/centros")]
    public ActionResult<IReadOnlyList<SelectorOptionResponse>> GetCentros()
    {
        return Ok(agendaService.GetCentros());
    }

    [HttpGet("selectores/servicios")]
    public ActionResult<IReadOnlyList<SelectorOptionResponse>> GetServicios([FromQuery] Guid centroId)
    {
        if (centroId == Guid.Empty)
        {
            return BadRequest(new { message = "centroId es obligatorio." });
        }

        return Ok(agendaService.GetServicios(centroId));
    }

    [HttpGet("selectores/efectores")]
    public ActionResult<IReadOnlyList<EfectorOptionResponse>> GetEfectores(
        [FromQuery] Guid centroId,
        [FromQuery] Guid servicioId,
        [FromQuery] string tipoEfector,
        [FromQuery] string? query)
    {
        if (centroId == Guid.Empty || servicioId == Guid.Empty || string.IsNullOrWhiteSpace(tipoEfector))
        {
            return BadRequest(new { message = "centroId, servicioId y tipoEfector son obligatorios." });
        }

        try
        {
            return Ok(agendaService.GetEfectores(centroId, servicioId, tipoEfector, query));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("selectores/lugares-atencion")]
    public ActionResult<IReadOnlyList<SelectorOptionResponse>> GetLugaresAtencion([FromQuery] string? query)
    {
        return Ok(agendaService.GetLugaresAtencion(query));
    }

    [HttpGet("selectores/dias-semana")]
    public ActionResult<IReadOnlyList<DiaSemanaOptionResponse>> GetDiasSemana()
    {
        return Ok(agendaService.GetDiasSemana());
    }

    [HttpGet("selectores/practicas")]
    public ActionResult<IReadOnlyList<PracticaOptionResponse>> GetPracticas([FromQuery] string? query)
    {
        return Ok(agendaService.GetPracticas(query));
    }

    [HttpGet("selectores/frecuencias-bloque")]
    public ActionResult<IReadOnlyList<string>> GetFrecuenciasBloque()
    {
        return Ok(agendaService.GetFrecuenciasBloque());
    }

    [HttpGet("selectores/tipos-efector")]
    public ActionResult<IReadOnlyList<string>> GetTiposEfector()
    {
        return Ok(agendaService.GetTiposEfector());
    }

    [HttpGet("selectores/tipos-agenda")]
    public ActionResult<IReadOnlyList<string>> GetTiposAgenda()
    {
        return Ok(agendaService.GetTiposAgenda());
    }

    [HttpGet]
    public ActionResult<IReadOnlyList<AgendaSummaryResponse>> GetAgendas([FromQuery] string? query, [FromQuery] bool? activa)
    {
        return Ok(agendaService.GetAgendas(query, activa));
    }

    [HttpGet("{agendaId:guid}")]
    public ActionResult<AgendaDetailResponse> GetAgendaById(Guid agendaId)
    {
        var agenda = agendaService.GetAgendaById(agendaId);
        return agenda is null ? NotFound() : Ok(agenda);
    }

    [HttpPost]
    public ActionResult<AgendaSummaryResponse> CreateAgenda([FromBody] CreateAgendaRequest request)
    {
        try
        {
            var created = agendaService.CreateAgenda(request);
            return CreatedAtAction(nameof(GetAgendas), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{agendaId:guid}")]
    public ActionResult<AgendaSummaryResponse> UpdateAgenda(Guid agendaId, [FromBody] UpdateAgendaRequest request)
    {
        try
        {
            var updated = agendaService.UpdateAgenda(agendaId, request);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{agendaId:guid}/copy")]
    public ActionResult<AgendaSummaryResponse> CopyAgenda(Guid agendaId, [FromBody] CopyAgendaRequest request)
    {
        try
        {
            var copied = agendaService.CopyAgenda(agendaId, request);
            return copied is null ? NotFound() : Ok(copied);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{agendaId:guid}/estado")]
    public ActionResult<AgendaSummaryResponse> SetEstado(Guid agendaId, [FromBody] SetAgendaStateRequest request)
    {
        var updated = agendaService.SetEstado(agendaId, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpPost("{agendaId:guid}/bloques")]
    public IActionResult AddBloque(Guid agendaId, [FromBody] CreateBloqueRequest request)
    {
        try
        {
            return agendaService.AddBloque(agendaId, request) ? Accepted() : NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{agendaId:guid}/bloques/{bloqueId:guid}")]
    public IActionResult UpdateBloque(Guid agendaId, Guid bloqueId, [FromBody] UpdateBloqueRequest request)
    {
        try
        {
            return agendaService.UpdateBloque(agendaId, bloqueId, request) ? Ok() : NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{agendaId:guid}/bloques/{bloqueId:guid}/practicas")]
    public IActionResult RemovePracticaBloque(Guid agendaId, Guid bloqueId, [FromQuery] string nombre)
    {
        try
        {
            return agendaService.RemovePracticaBloque(agendaId, bloqueId, nombre) ? Ok() : NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{agendaId:guid}/bloques/{bloqueId:guid}/turnos-a-cancelar")]
    public ActionResult<IReadOnlyList<TurnoACancelarResponse>> GetTurnosACancelar(Guid agendaId, Guid bloqueId)
    {
        var turnos = agendaService.GetTurnosACancelarPorEdicionBloque(agendaId, bloqueId);
        return turnos is null ? NotFound() : Ok(turnos);
    }

    [HttpPost("{agendaId:guid}/bloqueos")]
    public IActionResult AddBloqueo(Guid agendaId, [FromBody] CreateBloqueoRequest request)
    {
        try
        {
            return agendaService.AddBloqueo(agendaId, request) ? Accepted() : NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{agendaId:guid}/cupos/recalcular")]
    public ActionResult<DisponibilidadResponse> RecalcularCupos(Guid agendaId)
    {
        var disponibilidad = agendaService.RecalcularCupos(agendaId);
        return disponibilidad is null ? NotFound() : Ok(disponibilidad);
    }

    [HttpGet("{agendaId:guid}/disponibilidad")]
    public ActionResult<DisponibilidadResponse> GetDisponibilidad(Guid agendaId)
    {
        var disponibilidad = agendaService.GetDisponibilidad(agendaId);
        return disponibilidad is null ? NotFound() : Ok(disponibilidad);
    }
}
