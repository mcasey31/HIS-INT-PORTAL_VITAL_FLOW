using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;

namespace VitalFlow.His.Api.Application.HistoriaClinica.Repositories;

public interface IHistoriaClinicaRepository
{
    IReadOnlyList<ProblemaCronicoResponse> GetProblemasCronicos(Guid pacienteId);
    AsignarProblemaResponse CreateProblemaCronico(Guid pacienteId, AsignarProblemaRequest request);
    IReadOnlyList<EvolucionAmbulatoriaResponse> GetEvolucionesAmbulatorias(Guid pacienteId, int limit);
    CrearEvolucionAmbulatoriaResponse CreateEvolucionAmbulatoria(CrearEvolucionAmbulatoriaRequest request);
    EvolucionAmbulatoriaResponse? GetEvolucionAmbulatoriaByTurnoId(Guid turnoId);
    RegistrarRecetaDigitalResponse CreateRecetaDigital(RecetaDigitalCreateCommand command);
    RecetaDigitalDetalleResponse? GetRecetaDigitalById(Guid recetaId);
    IReadOnlyList<RecetaDigitalResumenResponse> GetRecetasDigitalesByPaciente(Guid pacienteId);
    AnularRecetaDigitalResponse? AnularRecetaDigital(Guid recetaId, string motivo, Guid usuarioId);
    IReadOnlyList<SolicitudEstudioResponse> GetSolicitudesEstudios(string turnoId);
    GuardarSolicitudesEstudiosResponse SaveSolicitudesEstudios(string turnoId, string pacienteId, IReadOnlyList<SolicitudEstudioItemRequest> items);
}
