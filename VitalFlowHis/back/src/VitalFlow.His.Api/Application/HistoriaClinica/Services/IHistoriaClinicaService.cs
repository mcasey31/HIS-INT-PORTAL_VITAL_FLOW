using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;

namespace VitalFlow.His.Api.Application.HistoriaClinica.Services;

public interface IHistoriaClinicaService
{
    IReadOnlyList<ProblemaCronicoResponse> ObtenerProblemasCronicos(Guid pacienteId);
    IReadOnlyList<EvolucionAmbulatoriaResponse> ObtenerEvolucionesAmbulatorias(Guid pacienteId, int limit = 20);
    RegistrarRecetaDigitalResponse RegistrarRecetaDigital(RegistrarRecetaDigitalRequest request);
    RecetaDigitalDetalleResponse ObtenerRecetaDigital(Guid recetaId);
    IReadOnlyList<RecetaDigitalResumenResponse> ObtenerRecetasDigitalesPaciente(Guid pacienteId);
    AnularRecetaDigitalResponse AnularRecetaDigital(Guid recetaId, AnularRecetaDigitalRequest request);
    IReadOnlyList<SolicitudEstudioResponse> ObtenerSolicitudesEstudio(Guid pacienteId, string turnoId);
    void SincronizarSolicitudesEstudio(Guid pacienteId, string turnoId, SincronizarSolicitudesEstudioRequest request, Guid? createdBy);
}
