namespace VitalFlow.His.Api.Domain.Agenda;

public sealed record TurnoByBloqueRow(
    string TurnoId,
    string PacienteNombre,
    DateTimeOffset FechaHora,
    string Estado
);

public sealed record AgendaBloqueDisponibilidadRow(
    Guid AgendaId,
    Guid CentroId,
    string CentroNombre,
    Guid ServicioId,
    string ServicioNombre,
    Guid EfectorId,
    string EfectorNombre,
    DateOnly AgendaFechaDesde,
    DateOnly? AgendaFechaHasta,
    Guid BloqueId,
    TimeOnly HoraInicio,
    TimeOnly HoraFin,
    int IntervaloMinutos,
    int DuracionTurnoMinutos,
    string PracticasJson,
    DateOnly BloqueFechaDesde,
    DateOnly BloqueFechaHasta,
    bool AtiendeFeriados,
    int Sobreturnos,
    string[] Dias
);

public interface IAgendaRepository
{
    IReadOnlyList<AgendaAggregate> GetAll();
    AgendaAggregate? GetById(Guid agendaId);
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
    AgendaAggregate AddAgenda(AgendaAggregate agenda);
    bool UpdateAgenda(AgendaAggregate agenda);
    bool AddBloque(Guid agendaId, BloqueProgramacion bloque);
    bool UpdateBloque(Guid agendaId, BloqueProgramacion bloque);
    bool UpdateBloquePracticas(Guid agendaId, Guid bloqueId, IReadOnlyList<BloquePractica> practicas);
    bool AddBloqueo(Guid agendaId, BloqueoAgenda bloqueo);
    IReadOnlyList<PracticaData> GetPracticas(string? query);
    void RegenerateCupos(Guid agendaId);
    IReadOnlyList<TurnoByBloqueRow> GetTurnosByBloque(Guid bloqueId);
    IReadOnlyList<(Guid Id, Guid CentroId, string Nombre)> GetAllServicios();
    IReadOnlyList<(Guid Id, Guid ServicioId, string Nombre)> GetAllPracticasActivas();
    IReadOnlyList<(Guid Id, Guid CentroId, Guid ServicioId, string Nombre)> GetAllEfectoresActivos();
    IReadOnlyList<AgendaBloqueDisponibilidadRow> GetAgendasConBloquesParaDisponibilidad(
        Guid[] centroIds, Guid servicioId, string practicaNombreNormalized, Guid? profesionalId);
}
