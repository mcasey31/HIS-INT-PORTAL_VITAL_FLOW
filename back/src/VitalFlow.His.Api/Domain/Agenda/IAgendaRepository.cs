namespace VitalFlow.His.Api.Domain.Agenda;

public interface IAgendaRepository
{
    IReadOnlyList<AgendaAggregate> GetAll();
    AgendaAggregate? GetById(Guid agendaId);
    IReadOnlyList<AgendaAggregate> GetByIds(IReadOnlyList<Guid> ids);
    bool ExistsByCodigo(string codigo, Guid? excludingAgendaId);
    bool ExistsByNombre(string nombre, Guid? excludingAgendaId);
    IReadOnlyList<CentroAgenda> GetCentros();
    IReadOnlyList<ServicioAgenda> GetServiciosByCentro(Guid centroId);
    IReadOnlyList<EfectorAgenda> GetEfectores(Guid centroId, Guid servicioId, string tipoEfector, string? query);
    IReadOnlyList<Guid> GetEfectorIdsByUsuario(Guid userId);
    AgendaSlotSearchResult SearchSlots(Guid scheduleId, string? status, DateTimeOffset? startFrom, DateTimeOffset? startTo, int count, int page);
    AgendaLocationSearchResult SearchLocations(string? name, bool? active, int count, int page);
    FhirAppointmentSearchResult SearchFhirAppointments(string? patientId, string? status, DateTimeOffset? dateFrom, DateTimeOffset? dateTo, int count, int page);
    FhirAppointmentCreateResult CreateFhirAppointment(FhirAppointmentCreateInput input);
    FhirAppointmentRecord? GetFhirAppointmentById(string appointmentId);
    IReadOnlyList<LugarAtencionAgenda> GetLugaresAtencion(string? query);
    bool ExistsGrupoProfesionalByCodigo(string codigo, Guid? excludingGrupoId);
    bool ExistsGrupoProfesionalByNombre(Guid centroId, Guid servicioId, string nombre, Guid? excludingGrupoId);
    GrupoProfesionalAggregate AddGrupoProfesional(GrupoProfesionalAggregate grupo);
    IReadOnlyList<GrupoProfesionalAggregate> GetGruposProfesionales(Guid? centroId, Guid? servicioId);
    GrupoProfesionalAggregate? GetGrupoProfesionalById(Guid id);
    bool UpdateGrupoProfesional(GrupoProfesionalAggregate grupo);
    bool DeleteGrupoProfesional(Guid id);
    AgendaAggregate AddAgenda(AgendaAggregate agenda);
    bool UpdateAgenda(AgendaAggregate agenda);
    bool AddBloque(Guid agendaId, BloqueProgramacion bloque);
    bool UpdateBloque(Guid agendaId, BloqueProgramacion bloque);
    bool UpdateBloquePracticas(Guid agendaId, Guid bloqueId, IReadOnlyList<BloquePractica> practicas);
    bool AddBloqueo(Guid agendaId, BloqueoAgenda bloqueo);
}
