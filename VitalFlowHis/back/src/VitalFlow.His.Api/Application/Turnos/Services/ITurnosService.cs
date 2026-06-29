using VitalFlow.His.Api.Application.Turnos.Contracts;

namespace VitalFlow.His.Api.Application.Turnos.Services;

public interface ITurnosService
{
    IReadOnlyList<TipoDocumentoTurnoResponse> GetTiposDocumento();
    IReadOnlyList<FinanciadorCatalogoTurnoResponse> GetFinanciadoresCatalogo();
    IReadOnlyList<PacienteIdentificadoTurnoResponse> IdentificarPacientePorDocumento(string tipoDocumento, string numeroDocumento);
    SelectoresDisponibilidadTurnoResponse GetSelectoresDisponibilidad();
    IReadOnlyList<DisponibilidadSlotTurnoResponse> BuscarDisponibilidad(BuscarDisponibilidadTurnoRequest request);
    TurnosPacientePageResponse GetTurnosPaciente(string pacienteId, bool historial, int page, int pageSize);
    FinanciadorPlanTurnoResponse GuardarFinanciadorPaciente(string pacienteId, GuardarPacienteFinanciadorTurnoRequest request);
    void FinalizarVigenciaFinanciadorPaciente(string pacienteId, string financiadorPlanPacienteId);
    AsignarTurnoResponse AsignarTurno(AsignarTurnoRequest request);
    AsignarSobreturnoResponse AsignarSobreturno(AsignarSobreturnoRequest request);
}
