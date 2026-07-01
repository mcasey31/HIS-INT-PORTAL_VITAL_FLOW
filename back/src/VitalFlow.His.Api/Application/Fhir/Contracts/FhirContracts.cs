using System.Text.Json.Serialization;

namespace VitalFlow.His.Api.Application.Fhir.Contracts;

public sealed record SearchSchedulesRequest(
    string? Actor,
    string? ServiceType,
    string? Location,
    bool? Active,
    int Count,
    int Page,
    IReadOnlyList<string> DateFilters
);

public sealed record FhirScheduleEntry(
    Guid Id,
    string Codigo,
    bool Activa,
    string Servicio,
    Guid EfectorId,
    string Efector,
    Guid CentroId,
    string Centro,
    string? TipoAgenda,
    bool VisibleContactCenter,
    DateOnly FechaDesde,
    DateOnly? FechaHasta,
    string Nombre
);

public sealed record SearchSchedulesResult(
    IReadOnlyList<FhirScheduleEntry> Entries,
    int Total
);

public sealed record FhirAppointmentCreateBody(
    [property: JsonPropertyName("resourceType")] string? ResourceType,
    [property: JsonPropertyName("identifier")] IReadOnlyList<FhirIdentifier>? Identifier,
    [property: JsonPropertyName("slot")] IReadOnlyList<FhirReference>? Slot,
    [property: JsonPropertyName("participant")] IReadOnlyList<FhirParticipant>? Participant,
    [property: JsonPropertyName("start")] DateTimeOffset? Start,
    [property: JsonPropertyName("end")] DateTimeOffset? End,
    [property: JsonPropertyName("reasonCode")] IReadOnlyList<FhirCodeableConcept>? ReasonCode
);

public sealed record FhirIdentifier(
    [property: JsonPropertyName("system")] string? System,
    [property: JsonPropertyName("value")] string? Value
);

public sealed record FhirReference(
    [property: JsonPropertyName("reference")] string? Reference,
    [property: JsonPropertyName("display")] string? Display
)
{
    [JsonIgnore]
    public string? ReferenceType
    {
        get
        {
            if (string.IsNullOrWhiteSpace(Reference))
                return null;
            var parts = Reference.Split('/', 2, StringSplitOptions.RemoveEmptyEntries);
            return parts.Length == 2 ? parts[0] : null;
        }
    }
}

public sealed record FhirParticipant(
    [property: JsonPropertyName("actor")] FhirReference? Actor,
    [property: JsonPropertyName("status")] string? Status
);

public sealed record FhirCodeableConcept(
    [property: JsonPropertyName("text")] string? Text
);
