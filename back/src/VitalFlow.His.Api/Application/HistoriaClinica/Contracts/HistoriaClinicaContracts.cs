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
    string? Indicacion,
    string? ViaAdministracion
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
    string? ViaAdministracion,
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

public sealed record AnularRecetaDigitalRequest(
    string Motivo,
    // Obsoleto: el usuario que anula se toma del claim userId del JWT. Se
    // mantiene en el contrato para no romper clientes que ya lo envian, pero
    // si viene null el endpoint funciona igual.
    string? UsuarioId = null
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
    string? ViaAdministracion,
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

// ── Receta digital: estados de entrega y consulta paginada ─────────────────
//
// La app movil de recepcion necesita distinguir si la receta ya se entrego al
// paciente, se imprimir o sigue pendiente. Los estados y sus transiciones
// viven en HistoriaClinicaService y estan restringidos en la base por el
// constraint receta_digital_estado_chk (migracion 044).
//
//   PUBLICADA_REPOSITORIO -> PENDIENTE_DE_ENTREGA | IMPRESA | ANULADA
//   PENDIENTE_DE_ENTREGA  -> ENTREGADA | IMPRESA | ANULADA
//   IMPRESA               -> ENTREGADA | ANULADA
//   ENTREGADA             -> (final)
//   ANULADA               -> (final)

public sealed record ActualizarEstadoRecetaDigitalRequest(
    string Estado,
    string? Motivo
);

public sealed record ActualizarEstadoRecetaDigitalResponse(
    string RecetaId,
    string EstadoAnterior,
    string Estado,
    string ActualizadoEn
);

/// <summary>
/// Listado paginado de recetas. Todos los filtros son opcionales y se combinan.
/// Por defecto excluye ANULADA salvo que se pida IncluirAnuladas.
/// </summary>
public sealed record RecetasDigitalesFiltro(
    Guid? PacienteId,
    Guid? TurnoId,
    Guid? EncuentroId,
    string? Estado,
    bool IncluirAnuladas = false,
    int Page = 1,
    int PageSize = 20
);

public sealed record RecetaDigitalPageResponse(
    IReadOnlyList<RecetaDigitalResumenResponse> Items,
    int Total,
    int Page,
    int PageSize
);
