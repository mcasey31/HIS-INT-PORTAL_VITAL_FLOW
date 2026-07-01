using System.Globalization;
using VitalFlow.His.Api.Application.Agenda.Services;
using VitalFlow.His.Api.Application.Fhir.Contracts;

namespace VitalFlow.His.Api.Application.Fhir.Services;

public sealed class FhirService(IAgendaService agendaService) : IFhirService
{
    public SearchSchedulesResult SearchSchedules(SearchSchedulesRequest request)
    {
        var schedules = agendaService.GetAgendas(null, request.Active).AsEnumerable();

        if (TryParseReferenceId(request.Actor, out var actorId))
            schedules = schedules.Where(s => s.EfectorId == actorId);

        if (TryParseReferenceId(request.Location, out var locationId))
            schedules = schedules.Where(s => s.CentroId == locationId);

        if (!string.IsNullOrWhiteSpace(request.ServiceType))
        {
            var serviceTypeFilter = request.ServiceType.Trim();
            if (Guid.TryParse(ExtractReferenceValue(serviceTypeFilter), out var serviceTypeId))
                schedules = schedules.Where(s => s.ServicioId == serviceTypeId);
            else
                schedules = schedules.Where(s =>
                    s.Servicio.Contains(serviceTypeFilter, StringComparison.OrdinalIgnoreCase));
        }

        if (request.DateFilters.Count > 0)
            schedules = schedules.Where(s => MatchesDateFilters(s.FechaDesde, s.FechaHasta, request.DateFilters));

        var filtered = schedules.ToList();
        var total = filtered.Count;
        var offset = (request.Page - 1) * request.Count;
        var paged = filtered.Skip(offset).Take(request.Count).ToList();

        var entries = paged.Select(s => new FhirScheduleEntry(
            s.Id, s.Codigo, s.Activa, s.Servicio, s.EfectorId, s.Efector,
            s.CentroId, s.Centro, s.TipoAgenda, s.VisibleContactCenter,
            s.FechaDesde, s.FechaHasta, s.Nombre
        )).ToList();

        return new SearchSchedulesResult(entries, total);
    }

    public FhirAppointmentCreateBody? ValidateAndParseAppointmentBody(
        FhirAppointmentCreateBody? body,
        out string? errorMessage,
        out int? errorStatusCode)
    {
        errorMessage = null;
        errorStatusCode = null;

        if (body is null)
        {
            errorMessage = "Body FHIR Appointment es obligatorio.";
            errorStatusCode = 422;
            return null;
        }

        if (!string.Equals(body.ResourceType, "Appointment", StringComparison.OrdinalIgnoreCase))
        {
            errorMessage = "resourceType debe ser Appointment.";
            errorStatusCode = 422;
            return null;
        }

        var slotReference = body.Slot?.FirstOrDefault()?.Reference;
        if (!TryParseReferenceId(slotReference, out _))
        {
            errorMessage = "slot[0].reference debe ser Slot/{id} o GUID.";
            errorStatusCode = 422;
            return null;
        }

        var patientReference = body.Participant?
            .FirstOrDefault(p => string.Equals(p.Actor?.ReferenceType, "Patient", StringComparison.OrdinalIgnoreCase))?
            .Actor?.Reference;

        var patientId = ExtractReferenceValue(patientReference ?? string.Empty);
        if (string.IsNullOrWhiteSpace(patientId))
        {
            errorMessage = "participant.actor.reference de Patient es obligatorio.";
            errorStatusCode = 422;
            return null;
        }

        return body;
    }

    public static bool TryParseReferenceId(string? reference, out Guid id)
    {
        id = Guid.Empty;
        if (string.IsNullOrWhiteSpace(reference))
            return false;
        return Guid.TryParse(ExtractReferenceValue(reference), out id);
    }

    public static string ExtractReferenceValue(string value)
    {
        var trimmed = value.Trim();
        var slashIndex = trimmed.LastIndexOf('/');
        return slashIndex >= 0 ? trimmed[(slashIndex + 1)..] : trimmed;
    }

    private static bool MatchesDateFilters(DateOnly start, DateOnly? end, IReadOnlyList<string> filters)
    {
        var scheduleStart = start;
        var scheduleEnd = end ?? start;

        foreach (var raw in filters)
        {
            if (!TryParseDateFilter(raw, out var op, out var date))
                continue;

            var passes = op switch
            {
                "ge" => scheduleEnd >= date,
                "gt" => scheduleEnd > date,
                "le" => scheduleStart <= date,
                "lt" => scheduleStart < date,
                "eq" => scheduleStart <= date && scheduleEnd >= date,
                _ => scheduleStart <= date && scheduleEnd >= date
            };

            if (!passes) return false;
        }

        return true;
    }

    private static bool TryParseDateFilter(string? raw, out string op, out DateOnly date)
    {
        op = "eq";
        date = default;
        if (string.IsNullOrWhiteSpace(raw))
            return false;

        var trimmed = raw.Trim();
        if (trimmed.Length >= 2)
        {
            var candidateOp = trimmed[..2].ToLowerInvariant();
            if (candidateOp is "ge" or "gt" or "le" or "lt" or "eq")
            {
                op = candidateOp;
                trimmed = trimmed[2..];
            }
        }

        return DateOnly.TryParseExact(trimmed, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date);
    }
}
