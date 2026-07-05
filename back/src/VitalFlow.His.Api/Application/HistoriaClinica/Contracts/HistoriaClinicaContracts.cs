namespace VitalFlow.His.Api.Application.HistoriaClinica.Contracts;

public sealed record ProblemaCronicoResponse(
    string ProblemaCronicoId,
    string Descripcion,
    string Categoria,
    string FechaInicio,
    int EvolucionesAsociadas
);

public sealed record AsignarProblemaRequest(
    string Descripcion,
    string Categoria,
    string? FechaInicio
);

public sealed record AsignarProblemaResponse(
    string ProblemaCronicoId
);

public sealed record EvolucionAmbulatoriaResponse(
    string EvolucionId,
    string FechaAtencion,
    string Especialidad,
    string Profesional,
    IReadOnlyList<string> ProblemasAsociados,
    string? Texto
);

public sealed record CrearEvolucionAmbulatoriaRequest(
    string TurnoId,
    string PacienteId,
    string Especialidad,
    string Profesional,
    string Texto,
    IReadOnlyList<string> ProblemasAsociados
);

public sealed record CrearEvolucionAmbulatoriaResponse(
    string EvolucionId
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
    int CantidadItems,
    string? MedicamentoDisplay
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

// ── Solicitud de Estudios ──────────────────────────────────────────────────

public sealed record SolicitudEstudioResponse(
    string Id,
    string TurnoId,
    string PacienteId,
    string FechaSolicitada,
    string Practica,
    string? Observacion,
    string Estado
);

public sealed record SolicitudEstudioItemRequest(
    string FechaSolicitada,
    string Practica,
    string? Observacion
);

public sealed record GuardarSolicitudesEstudiosRequest(
    string PacienteId,
    IReadOnlyList<SolicitudEstudioItemRequest> Items
);

public sealed record GuardarSolicitudesEstudiosResponse(
    int Cantidad
);
