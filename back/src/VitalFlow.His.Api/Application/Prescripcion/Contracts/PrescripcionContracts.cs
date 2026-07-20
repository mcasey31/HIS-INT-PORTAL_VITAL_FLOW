namespace VitalFlow.His.Api.Application.Prescripcion.Contracts;

public sealed record CrearPrescripcionRequest(
    string PacienteId,
    string TurnoId,
    int MedicamentoId,
    string MedicamentoDisplay,
    string? DosisTexto,
    string? FrecuenciaTexto,
    int? DuracionDias,
    string? Indicacion,
    string? ViaAdministracion
);

public sealed record CrearPrescripcionResponse(
    string RecetaId,
    string Estado,
    string CreadoEn
);
