namespace VitalFlow.His.Api.Application.HistoriaClinica.Contracts;

public sealed record ProblemaCronicoResponse(
    string ProblemaCronicoId,
    string Descripcion,
    string FechaCreacion,
    int EvolucionesAsociadas
);

public sealed record EvolucionAmbulatoriaResponse(
    string EvolucionId,
    string FechaAtencion,
    string Especialidad,
    string Profesional,
    IReadOnlyList<string> ProblemasAsociados
);

public sealed record RegistrarRecetaDigitalItemRequest(
    string MedicamentoCodigo,
    string MedicamentoSistema,
    string MedicamentoDisplay,
    string? DosisTexto,
    string? FrecuenciaTexto,
    int? DuracionDias,
    string? Indicacion
);

public sealed record RegistrarRecetaDigitalRequest(
    string PacienteId,
    string? EncuentroId,
    string? TurnoId,
    string PrescriptorUsuarioId,
    string PrescriptorMatricula,
    string OrganizacionOid,
    string? RdiarProfile,
    string FhirBundleJson,
    IReadOnlyList<RegistrarRecetaDigitalItemRequest> Items
);

public sealed record RegistrarRecetaDigitalResponse(
    string RecetaId,
    string Estado,
    string CreadoEn,
    int CantidadItems
);

public sealed record RecetaDigitalItemResponse(
    string ItemId,
    string MedicamentoCodigo,
    string MedicamentoSistema,
    string MedicamentoDisplay,
    string? DosisTexto,
    string? FrecuenciaTexto,
    int? DuracionDias,
    string? Indicacion,
    string Estado
);

public sealed record RecetaDigitalEventoResponse(
    string EventoId,
    string TipoEvento,
    string PayloadJson,
    string CreadoEn
);

public sealed record RecetaDigitalResumenResponse(
    string RecetaId,
    string PacienteId,
    string Estado,
    string RdiarProfile,
    string CreadoEn,
    int CantidadItems
);

public sealed record RecetaDigitalDetalleResponse(
    string RecetaId,
    string PacienteId,
    string? EncuentroId,
    string? TurnoId,
    string PrescriptorUsuarioId,
    string PrescriptorMatricula,
    string OrganizacionOid,
    string Estado,
    string RdiarProfile,
    string FhirBundleJson,
    string? ExternalRecipeId,
    string? ExternalRepositoryUri,
    string? ValidacionOutcomeJson,
    string CreadoEn,
    string ActualizadoEn,
    IReadOnlyList<RecetaDigitalItemResponse> Items,
    IReadOnlyList<RecetaDigitalEventoResponse> Eventos
);

public sealed record SolicitudEstudioResponse(
    string Id,
    string PacienteId,
    string TurnoId,
    string PracticaNombre,
    string FechaSolicitada,
    string? Observacion
);

public sealed record SolicitudEstudioItem(
    string PracticaNombre,
    string FechaSolicitada,
    string? Observacion
);

public sealed record SincronizarSolicitudesEstudioRequest(
    IReadOnlyList<SolicitudEstudioItem> Solicitudes
);

public sealed record AnularRecetaDigitalRequest(
    string Motivo,
    string UsuarioId
);

public sealed record AnularRecetaDigitalResponse(
    string RecetaId,
    string Estado,
    string ActualizadoEn
);

public sealed record RecetaDigitalItemCreate(
    string MedicamentoCodigo,
    string MedicamentoSistema,
    string MedicamentoDisplay,
    string? DosisTexto,
    string? FrecuenciaTexto,
    int? DuracionDias,
    string? Indicacion,
    string Estado
);

public sealed record RecetaDigitalCreateCommand(
    Guid PacienteId,
    Guid? EncuentroId,
    Guid? TurnoId,
    Guid PrescriptorUsuarioId,
    string PrescriptorMatricula,
    string OrganizacionOid,
    string Estado,
    string RdiarProfile,
    string FhirBundleJson,
    IReadOnlyList<RecetaDigitalItemCreate> Items
);
