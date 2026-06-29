using VitalFlow.His.Api.Application.Agenda.Contracts;

namespace VitalFlow.His.Api.Application.Agenda.Services;

public interface IAgendaService
{
    IReadOnlyList<SelectorOptionResponse> GetCentros();
    IReadOnlyList<SelectorOptionResponse> GetServicios(Guid centroId);
    IReadOnlyList<EfectorOptionResponse> GetEfectores(Guid centroId, Guid servicioId, string tipoEfector, string? query);
    IReadOnlyList<SelectorOptionResponse> GetLugaresAtencion(string? query);
    IReadOnlyList<DiaSemanaOptionResponse> GetDiasSemana();
    IReadOnlyList<PracticaOptionResponse> GetPracticas(string? query);
    IReadOnlyList<string> GetFrecuenciasBloque();
    IReadOnlyList<string> GetTiposEfector();
    IReadOnlyList<string> GetTiposAgenda();
    GrupoProfesionalResponse CreateGrupoProfesional(CreateGrupoProfesionalRequest request);
    IReadOnlyList<AgendaSummaryResponse> GetAgendas(string? query, bool? activa);
    AgendaDetailResponse? GetAgendaById(Guid agendaId);
    AgendaSummaryResponse CreateAgenda(CreateAgendaRequest request);
    AgendaSummaryResponse? UpdateAgenda(Guid agendaId, UpdateAgendaRequest request);
    AgendaSummaryResponse? CopyAgenda(Guid agendaId, CopyAgendaRequest request);
    AgendaSummaryResponse? SetEstado(Guid agendaId, SetAgendaStateRequest request);
    bool AddBloque(Guid agendaId, CreateBloqueRequest request);
    bool UpdateBloque(Guid agendaId, Guid bloqueId, UpdateBloqueRequest request);
    bool RemovePracticaBloque(Guid agendaId, Guid bloqueId, string nombrePractica);
    IReadOnlyList<TurnoACancelarResponse>? GetTurnosACancelarPorEdicionBloque(Guid agendaId, Guid bloqueId);
    bool AddBloqueo(Guid agendaId, CreateBloqueoRequest request);
    FhirSlotSearchResultResponse SearchFhirSlots(Guid scheduleId, string? status, DateTimeOffset? startFrom, DateTimeOffset? startTo, int count, int page);
    FhirLocationSearchResultResponse SearchFhirLocations(string? name, bool? active, int count, int page);
    FhirAppointmentSearchResultResponse SearchFhirAppointments(string? patientId, string? status, DateTimeOffset? dateFrom, DateTimeOffset? dateTo, int count, int page);
    FhirAppointmentCreateResultResponse CreateFhirAppointment(FhirAppointmentCreateRequest request);
    FhirAppointmentResponse? GetFhirAppointmentById(string appointmentId);
    DisponibilidadResponse? RecalcularCupos(Guid agendaId);
    DisponibilidadResponse? GetDisponibilidad(Guid agendaId);
}
