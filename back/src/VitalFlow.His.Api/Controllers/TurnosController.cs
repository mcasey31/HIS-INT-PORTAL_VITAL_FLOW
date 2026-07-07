using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VitalFlow.His.Api;
using VitalFlow.His.Api.Application.Turnos.Contracts;
using VitalFlow.His.Api.Application.Turnos.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/turnos")]
[Authorize(Roles = Roles.FhirAccess)]
public sealed class TurnosController(ITurnosService turnosService) : ControllerBase
{
    [HttpGet("identificacion/tipos-documento")]
    public ActionResult<IReadOnlyList<TipoDocumentoTurnoResponse>> GetTiposDocumento()
    {
        return Ok(turnosService.GetTiposDocumento());
    }

    [HttpGet("identificacion/paciente")]
    public ActionResult<IReadOnlyList<PacienteIdentificadoTurnoResponse>> IdentificarPaciente(
        [FromQuery] string tipoDocumento,
        [FromQuery] string numeroDocumento)
    {
        if (string.IsNullOrWhiteSpace(tipoDocumento) || string.IsNullOrWhiteSpace(numeroDocumento))
        {
            return BadRequest(new { message = "tipoDocumento y numeroDocumento son obligatorios." });
        }

        return Ok(turnosService.IdentificarPacientePorDocumento(tipoDocumento, numeroDocumento));
    }

    [HttpGet("disponibilidad/selectores")]
    public ActionResult<SelectoresDisponibilidadTurnoResponse> GetSelectoresDisponibilidad()
    {
        return Ok(turnosService.GetSelectoresDisponibilidad());
    }

    [HttpPost("disponibilidad/buscar")]
    public ActionResult<IReadOnlyList<DisponibilidadSlotTurnoResponse>> BuscarDisponibilidad([FromBody] BuscarDisponibilidadTurnoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PacienteId)
            || string.IsNullOrWhiteSpace(request.FinanciadorPlanId)
            || request.CentroIds.Count == 0
            || string.IsNullOrWhiteSpace(request.ServicioId)
            || string.IsNullOrWhiteSpace(request.PracticaId))
        {
            return BadRequest(new { message = "pacienteId, financiadorPlanId, centroIds, servicioId y practicaId son obligatorios." });
        }

        return Ok(turnosService.BuscarDisponibilidad(request));
    }

    [HttpGet("pacientes/{pacienteId}/turnos")]
    public ActionResult<TurnosPacientePageResponse> GetTurnosPaciente(
        string pacienteId,
        [FromQuery] bool historial = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(pacienteId))
        {
            return BadRequest(new { message = "pacienteId es obligatorio." });
        }

        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { message = "page y pageSize deben ser mayores a cero." });
        }

        if (pageSize > 50)
        {
            return BadRequest(new { message = "pageSize no puede ser mayor a 50." });
        }

        return Ok(turnosService.GetTurnosPaciente(pacienteId, historial, page, pageSize));
    }

    [HttpPost("pacientes/{pacienteId}/financiadores")]
    public ActionResult<FinanciadorPlanTurnoResponse> GuardarFinanciadorPaciente(
        string pacienteId,
        [FromBody] GuardarPacienteFinanciadorTurnoRequest request)
    {
        if (string.IsNullOrWhiteSpace(pacienteId)
            || string.IsNullOrWhiteSpace(request.FinanciadorId)
            || string.IsNullOrWhiteSpace(request.PlanId))
        {
            return BadRequest(new { message = "pacienteId, financiadorId y planId son obligatorios." });
        }

        try
        {
            return Ok(turnosService.GuardarFinanciadorPaciente(pacienteId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("pacientes/{pacienteId}/financiadores/{financiadorPlanPacienteId}/finalizar-vigencia")]
    public ActionResult FinalizarVigenciaFinanciadorPaciente(string pacienteId, string financiadorPlanPacienteId)
    {
        if (string.IsNullOrWhiteSpace(pacienteId) || string.IsNullOrWhiteSpace(financiadorPlanPacienteId))
        {
            return BadRequest(new { message = "pacienteId y financiadorPlanPacienteId son obligatorios." });
        }

        try
        {
            turnosService.FinalizarVigenciaFinanciadorPaciente(pacienteId, financiadorPlanPacienteId);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("asignacion")]
    public async Task<ActionResult<AsignarTurnoResponse>> AsignarTurno([FromBody] AsignarTurnoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PacienteId)
            || string.IsNullOrWhiteSpace(request.SlotId)
            || string.IsNullOrWhiteSpace(request.FinanciadorPlanId))
        {
            return BadRequest(new { message = "pacienteId, slotId y financiadorPlanId son obligatorios." });
        }

        try
        {
            return Ok(await turnosService.AsignarTurno(request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("sobreturnos/asignacion")]
    public ActionResult<AsignarSobreturnoResponse> AsignarSobreturno([FromBody] AsignarSobreturnoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PacienteId)
            || string.IsNullOrWhiteSpace(request.SlotId)
            || string.IsNullOrWhiteSpace(request.FinanciadorPlanId)
            || string.IsNullOrWhiteSpace(request.Hora))
        {
            return BadRequest(new { message = "pacienteId, slotId, financiadorPlanId y hora son obligatorios." });
        }

        try
        {
            return Ok(turnosService.AsignarSobreturno(request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
