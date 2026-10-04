using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;
using VitalFlow.His.Api.Application.Turnos.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/recetas")]
[Authorize(Roles = "Medico,Auditor,Administrador,Administrativo,Cajero,Enrolamiento Persona")]
public sealed class RecetasController(
    IHistoriaClinicaService historiaClinicaService,
    IEmailService emailService,
    IConfiguration configuration,
    ILogger<RecetasController> logger
) : ControllerBase
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

    public sealed record EnviarRecetasEmailRequest(
        string PacienteId,
        string Email,
        IReadOnlyList<string> RecetaIds
    );

    [HttpPost("enviar-email")]
    public async Task<IActionResult> EnviarRecetasEmail([FromBody] EnviarRecetasEmailRequest request)
    {
        try
        {
            if (!Guid.TryParse(request.PacienteId, out var pacienteIdGuid) || pacienteIdGuid == Guid.Empty)
                return BadRequest(new { message = "pacienteId debe ser GUID valido." });

            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "email es obligatorio." });

            if (request.RecetaIds is null || request.RecetaIds.Count == 0)
                return BadRequest(new { message = "Debe especificar al menos una receta." });

            // Query patient name
            string? pacienteNombre = null;
            using (var conn = new NpgsqlConnection(configuration.GetConnectionString("VitalFlowHisDb")))
            {
                conn.Open();
                using var cmd = new NpgsqlCommand("select nombre || ' ' || apellido from sch_persona.persona where id = @id", conn);
                cmd.Parameters.AddWithValue("id", pacienteIdGuid);
                pacienteNombre = cmd.ExecuteScalar() as string;
            }

            if (string.IsNullOrWhiteSpace(pacienteNombre))
                pacienteNombre = "Paciente";

            // Build email HTML
            var itemsHtml = new System.Text.StringBuilder();
            foreach (var recetaIdStr in request.RecetaIds)
            {
                if (!Guid.TryParse(recetaIdStr, out var recetaIdGuid) || recetaIdGuid == Guid.Empty)
                    continue;

                RecetaDigitalDetalleResponse? detalle;
                try
                {
                    detalle = historiaClinicaService.ObtenerRecetaDigital(recetaIdGuid);
                }
                catch
                {
                    continue;
                }
                if (detalle is null) continue;

                itemsHtml.AppendLine($"""
                    <tr><td colspan="5" style="background:#f0f4f8;font-weight:bold;padding:0.5rem;text-align:center;">
                      Receta del {detalle.CreadoEn}</td></tr>
                    """);

                foreach (var item in detalle.Items)
                {
                    itemsHtml.AppendLine($"""
                        <tr>
                          <td style="padding:0.4rem;border:1px solid #ddd">{item.MedicamentoDisplay}</td>
                          <td style="padding:0.4rem;border:1px solid #ddd">{item.DosisTexto ?? "-"}</td>
                          <td style="padding:0.4rem;border:1px solid #ddd">{item.FrecuenciaTexto ?? "-"}</td>
                          <td style="padding:0.4rem;border:1px solid #ddd">{item.DuracionDias?.ToString() ?? "-"} días</td>
                          <td style="padding:0.4rem;border:1px solid #ddd">{item.Indicacion ?? "-"}</td>
                        </tr>
                        """);
                }
            }

            var body = $"""
                <html><body style="font-family:Arial,sans-serif;color:#333;">
                <h2>Recetas médicas — {pacienteNombre}</h2>
                <p>Se adjuntan las recetas prescriptas el día de la fecha.</p>
                <table style="width:100%;border-collapse:collapse;margin-top:1rem;">
                  <thead><tr style="background:#005c99;color:#fff;">
                    <th style="padding:0.5rem;border:1px solid #005c99">Medicamento</th>
                    <th style="padding:0.5rem;border:1px solid #005c99">Dosis</th>
                    <th style="padding:0.5rem;border:1px solid #005c99">Frecuencia</th>
                    <th style="padding:0.5rem;border:1px solid #005c99">Duración</th>
                    <th style="padding:0.5rem;border:1px solid #005c99">Indicación</th>
                  </tr></thead>
                  <tbody>{itemsHtml}</tbody>
                </table>
                <p style="margin-top:1.5rem;font-size:0.85rem;color:#666;">
                  Este es un mensaje automático generado por VitalFlow HIS. No responder.
                </p>
                </body></html>
                """;

            await emailService.SendEmailAsync(
                request.Email,
                $"Recetas médicas — {pacienteNombre}",
                body
            );

            logger.LogInformation("Recetas email sent to {Email} for paciente {PacienteId}", request.Email, request.PacienteId);

            return Ok(new { enviado = true, message = "Email enviado correctamente." });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar email de recetas a {Email}", request.Email);
            return StatusCode(500, new { message = $"Error al enviar el email: {ex.Message}" });
        }
    }
}