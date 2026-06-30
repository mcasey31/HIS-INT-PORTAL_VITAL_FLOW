using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;

namespace VitalFlow.His.Api.Application.HistoriaClinica.Repositories;

public interface IHistoriaClinicaRepository
{
    IReadOnlyList<ProblemaCronicoResponse> GetProblemasCronicos(Guid pacienteId);
    IReadOnlyList<EvolucionAmbulatoriaResponse> GetEvolucionesAmbulatorias(Guid pacienteId, int limit);
    RegistrarRecetaDigitalResponse CreateRecetaDigital(RecetaDigitalCreateCommand command);
    RecetaDigitalDetalleResponse? GetRecetaDigitalById(Guid recetaId);
    IReadOnlyList<RecetaDigitalResumenResponse> GetRecetasDigitalesByPaciente(Guid pacienteId);
    AnularRecetaDigitalResponse? AnularRecetaDigital(Guid recetaId, string motivo, Guid usuarioId);
    IReadOnlyList<SolicitudEstudioResponse> GetSolicitudesEstudio(Guid pacienteId, string turnoId);
    void SincronizarSolicitudesEstudio(Guid pacienteId, string turnoId, IReadOnlyList<SolicitudEstudioItem> solicitudes, Guid? createdBy);
}
