using VitalFlow.His.Api.Application.Fhir.Contracts;

namespace VitalFlow.His.Api.Application.Fhir.Services;

public interface IFhirService
{
    SearchSchedulesResult SearchSchedules(SearchSchedulesRequest request);
    FhirAppointmentCreateBody? ValidateAndParseAppointmentBody(
        FhirAppointmentCreateBody? body,
        out string? errorMessage,
        out int? errorStatusCode);
}
