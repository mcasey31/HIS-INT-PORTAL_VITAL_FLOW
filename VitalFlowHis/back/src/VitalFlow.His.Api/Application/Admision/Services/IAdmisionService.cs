using VitalFlow.His.Api.Application.Admision.Contracts;

namespace VitalFlow.His.Api.Application.Admision.Services;

public interface IAdmisionService
{
    SelectoresAdmisionResponse GetSelectores(AdmisionScopeContext scope);
    IReadOnlyList<TurnoAdmisionResponse> BuscarTurnos(BuscarTurnosAdmisionRequest request, AdmisionScopeContext scope);
    ConfirmarArriboTurnoResponse ConfirmarArribo(string turnoId, ConfirmarArriboTurnoRequest request);
    EventoFacturacionTurnoResponse ObtenerEventoFacturacion(string turnoId);
    ActualizarEstadoTurnoResponse ActualizarEstadoTurno(string turnoId, ActualizarEstadoTurnoRequest request);
    EncuentroAdmisionResponse ObtenerEncuentro(string turnoId);
    CerrarEncuentroResponse CerrarEncuentro(string turnoId, CerrarEncuentroRequest request);
    CerrarEncuentrosVencidosResponse CerrarEncuentrosVencidos(int horasMaximas = 24);
}
