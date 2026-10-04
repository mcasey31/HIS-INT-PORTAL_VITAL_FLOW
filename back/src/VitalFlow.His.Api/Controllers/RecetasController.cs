using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Services;
using VitalFlow.His.Api.Application.Turnos.Services;

namespace VitalFlow.His.Api.Controllers;

[ApiController]
[Route("api/v1/recetas")]
// Solo se exige autenticacion a nivel de controller; los roles se aplican por
// accion. En ASP.NET Core los [Authorize] de controller y accion se combinan
// con AND, asi que un controller con Roles no admitiria acciones mas
// restrictivas. Motivo: la app de recepcion necesita LEER recetas y ANULARLAS,
// pero crear una receta es un acto medico y queda restringido a Medico y
// Administrador (antes alcanzaba con Administrativo o Cajero).
[Authorize]
public sealed class RecetasController(
    IHistoriaClinicaService historiaClinicaService,
    IEmailService emailService,
    IConfiguration configuration,
    ILogger<RecetasController> logger
) : ControllerBase
{
    /// <summary>Roles autorizados a leer recetas y registrar su entrega.</summary>
    private const string RolesLectura =
        "Medico,Administrador,Administrativo,Cajero,Recepcion,Enrolamiento Persona,Auditor";

    /// <summary>Roles autorizados a emitir una receta. Acto medico.</summary>
    private const string RolesEmision = "Medico,Administrador";

    [HttpPost]
    [Authorize(Roles = RolesEmision)]
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
    [Authorize(Roles = RolesLectura)]
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

    /// <summary>
    /// Estados validos del circuito de entrega. La app los usa para pintar los
    /// botones de la pantalla de receta sin hardcodearlos.
    /// </summary>
    [HttpGet("estados")]
    [Authorize(Roles = RolesLectura)]
    public ActionResult<IReadOnlyList<string>> ObtenerEstados()
    {
        return Ok(HistoriaClinicaService.EstadosReceta);
    }

    /// <summary>
    /// Listado por paciente. Se mantiene la respuesta como array plano porque
    /// el front web (front/src/escritorioClinico/escritorioClinicoApi.ts) ya lo
    /// consume con esa forma. Para la app movil usar GET /api/v1/recetas/buscar,
    /// que devuelve objeto paginado y acepta filtros.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = RolesLectura)]
    public ActionResult<IReadOnlyList<RecetaDigitalResumenResponse>> ListarRecetasPaciente([FromQuery] string? pacienteId)
    {
        if (!Guid.TryParse(pacienteId, out var pacienteIdGuid) || pacienteIdGuid == Guid.Empty)
        {
            return BadRequest(new { message = "pacienteId es obligatorio y debe ser GUID valido." });
        }

        return Ok(historiaClinicaService.ObtenerRecetasDigitalesPaciente(pacienteIdGuid));
    }

    /// <summary>
    /// Listado paginado con filtros. Todos son opcionales y se combinan:
    /// pacienteId, turnoId, encuentroId, estado, incluirAnuladas, page, pageSize.
    /// Sin estado excluye las recetas anuladas.
    /// </summary>
    [HttpGet("buscar")]
    [Authorize(Roles = RolesLectura)]
    public ActionResult<RecetaDigitalPageResponse> BuscarRecetas(
        [FromQuery] string? pacienteId,
        [FromQuery] string? turnoId,
        [FromQuery] string? encuentroId,
        [FromQuery] string? estado,
        [FromQuery] bool incluirAnuladas = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (!string.IsNullOrWhiteSpace(pacienteId) && !Guid.TryParse(pacienteId, out _))
        {
            return BadRequest(new { message = "pacienteId debe ser GUID valido." });
        }

        if (!string.IsNullOrWhiteSpace(turnoId) && !Guid.TryParse(turnoId, out _))
        {
            return BadRequest(new { message = "turnoId debe ser GUID valido." });
        }

        if (!string.IsNullOrWhiteSpace(encuentroId) && !Guid.TryParse(encuentroId, out _))
        {
            return BadRequest(new { message = "encuentroId debe ser GUID valido." });
        }

        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new { message = "page y pageSize deben ser mayores a cero." });
        }

        var filtro = new RecetasDigitalesFiltro(
            PacienteId: string.IsNullOrWhiteSpace(pacienteId) ? null : Guid.Parse(pacienteId),
            TurnoId: string.IsNullOrWhiteSpace(turnoId) ? null : Guid.Parse(turnoId),
            EncuentroId: string.IsNullOrWhiteSpace(encuentroId) ? null : Guid.Parse(encuentroId),
            Estado: estado,
            IncluirAnuladas: incluirAnuladas,
            Page: page,
            PageSize: pageSize);

        try
        {
            return Ok(historiaClinicaService.ObtenerRecetasDigitales(filtro));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Transiciona el estado de una receta. Valida la maquina de estados:
    /// PUBLICADA_REPOSITORIO -&gt; PENDIENTE_DE_ENTREGA | IMPRESA | ANULADA,
    /// PENDIENTE_DE_ENTREGA -&gt; ENTREGADA | IMPRESA | ANULADA,
    /// IMPRESA -&gt; ENTREGADA | ANULADA.
    /// ENTREGADA y ANULADA son finales.
    /// </summary>
    [HttpPost("{recetaId:guid}/estado")]
    [Authorize(Roles = RolesLectura)]
    public ActionResult<ActualizarEstadoRecetaDigitalResponse> ActualizarEstado(
        Guid recetaId,
        [FromBody] ActualizarEstadoRecetaDigitalRequest request)
    {
        try
        {
            return Ok(historiaClinicaService.ActualizarEstadoRecetaDigital(recetaId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Conflicto de concurrencia: otra terminal movio la receta antes.
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("{recetaId:guid}/anular")]
    [Authorize(Roles = RolesLectura)]
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
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
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