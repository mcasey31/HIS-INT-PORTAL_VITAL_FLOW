using VitalFlow.His.Api.Application.Prescripcion.Contracts;
using VitalFlow.His.Api.Infrastructure.Prescripcion;

namespace VitalFlow.His.Api.Application.Prescripcion.Services;

public sealed class PrescripcionService(PostgresPrescripcionRepository repository) : IPrescripcionService
{
    public CrearPrescripcionResponse Crear(CrearPrescripcionRequest request, string usuarioId, string? username, string? matricula)
    {
        if (!Guid.TryParse(request.PacienteId, out var pacienteId) || pacienteId == Guid.Empty)
            throw new ArgumentException("pacienteId es obligatorio y debe ser GUID valido.");
        if (!Guid.TryParse(request.TurnoId, out var turnoId) || turnoId == Guid.Empty)
            throw new ArgumentException("turnoId es obligatorio y debe ser GUID valido.");
        if (request.MedicamentoId <= 0)
            throw new ArgumentException("medicamentoId es obligatorio.");
        if (string.IsNullOrWhiteSpace(request.MedicamentoDisplay))
            throw new ArgumentException("medicamentoDisplay es obligatorio.");

        return repository.Crear(request, usuarioId, matricula ?? "");
    }
}
