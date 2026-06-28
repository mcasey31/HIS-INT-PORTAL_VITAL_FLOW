using VitalFlow.His.Api.Application.Prescripcion.Contracts;

namespace VitalFlow.His.Api.Application.Prescripcion.Services;

public interface IPrescripcionService
{
    CrearPrescripcionResponse Crear(CrearPrescripcionRequest request, string usuarioId, string? username);
}
