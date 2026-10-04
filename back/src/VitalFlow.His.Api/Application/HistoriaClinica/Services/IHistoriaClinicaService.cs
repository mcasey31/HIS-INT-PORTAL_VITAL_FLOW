using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;

namespace VitalFlow.His.Api.Application.HistoriaClinica.Services;

public interface IHistoriaClinicaService
{
    IReadOnlyList<ProblemaCronicoResponse> ObtenerProblemasCronicos(Guid pacienteId);
    IReadOnlyList<EvolucionAmbulatoriaResponse> ObtenerEvolucionesAmbulatorias(Guid pacienteId, int limit = 20);
    CrearEvolucionAmbulatoriaResponse CrearEvolucionAmbulatoria(CrearEvolucionAmbulatoriaRequest request);
    AsignarProblemaResponse AsignarProblema(Guid pacienteId, AsignarProblemaRequest request);
    RegistrarRecetaDigitalResponse RegistrarRecetaDigital(RegistrarRecetaDigitalRequest request);
    RecetaDigitalDetalleResponse ObtenerRecetaDigital(Guid recetaId);
    IReadOnlyList<RecetaDigitalResumenResponse> ObtenerRecetasDigitalesPaciente(Guid pacienteId);
    AnularRecetaDigitalResponse AnularRecetaDigital(Guid recetaId, AnularRecetaDigitalRequest request);
    IReadOnlyList<SolicitudEstudioResponse> ObtenerSolicitudesEstudios(string turnoId);
    GuardarSolicitudesEstudiosResponse GuardarSolicitudesEstudios(string turnoId, GuardarSolicitudesEstudiosRequest request);
}
