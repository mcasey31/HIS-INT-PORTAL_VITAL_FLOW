using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Repositories;

namespace VitalFlow.His.Api.Application.HistoriaClinica.Services;

public sealed class HistoriaClinicaService(
    IHistoriaClinicaRepository repository,
    IHttpContextAccessor httpContextAccessor) : IHistoriaClinicaService
{
    private const string EstadoPublicadaRepositorio = "PUBLICADA_REPOSITORIO";
    private const string EstadoPendienteEntrega = "PENDIENTE_DE_ENTREGA";
    private const string EstadoImpresa = "IMPRESA";
    private const string EstadoEntregada = "ENTREGADA";
    private const string EstadoActivaItem = "ACTIVA";
    private const string EstadoAnulada = "ANULADA";
    private const string RdiarProfileDefault = "RDI_Ar_0_2_5";

    /// <summary>
    /// Estados validos de sch_hca.receta_digital.estado. Deben coincidir con el
    /// constraint receta_digital_estado_chk de la migracion 044.
    /// </summary>
    public static readonly IReadOnlyList<string> EstadosReceta =
    [
        EstadoPublicadaRepositorio,
        EstadoPendienteEntrega,
        EstadoImpresa,
        EstadoEntregada,
        EstadoAnulada
    ];

    /// <summary>
    /// Transiciones permitidas del circuito de entrega de recetas:
    ///
    ///   PUBLICADA_REPOSITORIO -&gt; PENDIENTE_DE_ENTREGA | IMPRESA | ANULADA
    ///   PENDIENTE_DE_ENTREGA  -&gt; ENTREGADA | IMPRESA | ANULADA
    ///   IMPRESA               -&gt; ENTREGADA | ANULADA
    ///   ENTREGADA             -&gt; (estado final)
    ///   ANULADA               -&gt; (estado final)
    /// </summary>
    private static readonly Dictionary<string, HashSet<string>> TransicionesReceta =
        new(StringComparer.OrdinalIgnoreCase)
        {
            [EstadoPublicadaRepositorio] = new(StringComparer.OrdinalIgnoreCase)
            {
                EstadoPendienteEntrega,
                EstadoImpresa,
                EstadoAnulada
            },
            [EstadoPendienteEntrega] = new(StringComparer.OrdinalIgnoreCase)
            {
                EstadoEntregada,
                EstadoImpresa,
                EstadoAnulada
            },
            [EstadoImpresa] = new(StringComparer.OrdinalIgnoreCase)
            {
                EstadoEntregada,
                EstadoAnulada
            }
            // ENTREGADA y ANULADA son finales: no tienen transiciones de salida.
        };

    /// <summary>
    /// Usuario autenticado segun el claim userId del JWT. Tomarlo del token y
    /// no del body evita que un cliente se atribuya la accion de otro, y evita
    /// que el endpoint falle cuando el cliente no manda el campo.
    /// </summary>
    private Guid UsuarioActual()
    {
        var claim = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value;
        if (!Guid.TryParse(claim, out var usuarioId) || usuarioId == Guid.Empty)
        {
            throw new ArgumentException(
                "No se pudo determinar el usuario autenticado (claim userId ausente).");
        }

        return usuarioId;
    }

    public IReadOnlyList<ProblemaCronicoResponse> ObtenerProblemasCronicos(Guid pacienteId)
    {
        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        return repository.GetProblemasCronicos(pacienteId);
    }

    public AsignarProblemaResponse AsignarProblema(Guid pacienteId, AsignarProblemaRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.Descripcion))
        {
            throw new ArgumentException("La descripcion del problema es obligatoria.");
        }

        if (string.IsNullOrWhiteSpace(request.Categoria))
        {
            throw new ArgumentException("La categoria del problema es obligatoria.");
        }

        var validCategories = new[] { "Activo", "Antecedente familiar", "Cronico", "Procedimiento", "Resuelto" };
        if (!validCategories.Contains(request.Categoria, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Categoria invalida. Valores permitidos: " + string.Join(", ", validCategories));
        }

        return repository.CreateProblemaCronico(pacienteId, request);
    }

    public IReadOnlyList<EvolucionAmbulatoriaResponse> ObtenerEvolucionesAmbulatorias(Guid pacienteId, int limit = 20)
    {
        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        if (limit <= 0)
        {
            throw new ArgumentException("limit debe ser mayor a 0.");
        }

        if (limit > 50)
        {
            throw new ArgumentException("limit no puede ser mayor a 50.");
        }

        return repository.GetEvolucionesAmbulatorias(pacienteId, limit);
    }

    public CrearEvolucionAmbulatoriaResponse CrearEvolucionAmbulatoria(CrearEvolucionAmbulatoriaRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (string.IsNullOrWhiteSpace(request.TurnoId) || !Guid.TryParse(request.TurnoId, out _))
        {
            throw new ArgumentException("turnoId es obligatorio y debe ser GUID valido.");
        }

        if (string.IsNullOrWhiteSpace(request.PacienteId) || !Guid.TryParse(request.PacienteId, out _))
        {
            throw new ArgumentException("pacienteId es obligatorio y debe ser GUID valido.");
        }

        if (string.IsNullOrWhiteSpace(request.Texto))
        {
            throw new ArgumentException("texto es obligatorio.");
        }

        if (request.ProblemasAsociados is null || request.ProblemasAsociados.Count == 0)
        {
            throw new ArgumentException("Debe incluir al menos un problema asociado.");
        }

        if (string.IsNullOrWhiteSpace(request.Especialidad))
        {
            throw new ArgumentException("especialidad es obligatoria.");
        }

        if (string.IsNullOrWhiteSpace(request.Profesional))
        {
            throw new ArgumentException("profesional es obligatorio.");
        }

        return repository.CreateEvolucionAmbulatoria(request);
    }

    public RegistrarRecetaDigitalResponse RegistrarRecetaDigital(RegistrarRecetaDigitalRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (!Guid.TryParse(request.PacienteId, out var pacienteId) || pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio y debe ser GUID valido.");
        }

        if (!Guid.TryParse(request.PrescriptorUsuarioId, out var prescriptorUsuarioId) || prescriptorUsuarioId == Guid.Empty)
        {
            throw new ArgumentException("prescriptorUsuarioId es obligatorio y debe ser GUID valido.");
        }

        Guid? encuentroId = null;
        if (!string.IsNullOrWhiteSpace(request.EncuentroId))
        {
            if (!Guid.TryParse(request.EncuentroId, out var parsedEncuentro) || parsedEncuentro == Guid.Empty)
            {
                throw new ArgumentException("encuentroId debe ser GUID valido.");
            }

            encuentroId = parsedEncuentro;
        }

        Guid? turnoId = null;
        if (!string.IsNullOrWhiteSpace(request.TurnoId))
        {
            if (!Guid.TryParse(request.TurnoId, out var parsedTurno) || parsedTurno == Guid.Empty)
            {
                throw new ArgumentException("turnoId debe ser GUID valido.");
            }

            turnoId = parsedTurno;
        }

        if (string.IsNullOrWhiteSpace(request.PrescriptorMatricula))
        {
            throw new ArgumentException("prescriptorMatricula es obligatoria.");
        }

        if (string.IsNullOrWhiteSpace(request.OrganizacionOid))
        {
            throw new ArgumentException("organizacionOid es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.FhirBundleJson))
        {
            throw new ArgumentException("fhirBundleJson es obligatorio.");
        }

        if (request.Items is null || request.Items.Count == 0)
        {
            throw new ArgumentException("La receta debe incluir al menos un item.");
        }

        var items = new List<RecetaDigitalItemCreate>();
        foreach (var item in request.Items)
        {
            if (string.IsNullOrWhiteSpace(item.MedicamentoCodigo)
                || string.IsNullOrWhiteSpace(item.MedicamentoSistema)
                || string.IsNullOrWhiteSpace(item.MedicamentoDisplay))
            {
                throw new ArgumentException("Cada item debe incluir medicamentoCodigo, medicamentoSistema y medicamentoDisplay.");
            }

            if (item.DuracionDias.HasValue && item.DuracionDias.Value <= 0)
            {
                throw new ArgumentException("duracionDias debe ser mayor a 0 cuando se informa.");
            }

            items.Add(new RecetaDigitalItemCreate(
                MedicamentoCodigo: item.MedicamentoCodigo.Trim(),
                MedicamentoSistema: item.MedicamentoSistema.Trim(),
                MedicamentoDisplay: item.MedicamentoDisplay.Trim(),
                DosisTexto: string.IsNullOrWhiteSpace(item.DosisTexto) ? null : item.DosisTexto.Trim(),
                FrecuenciaTexto: string.IsNullOrWhiteSpace(item.FrecuenciaTexto) ? null : item.FrecuenciaTexto.Trim(),
                DuracionDias: item.DuracionDias,
                Indicacion: string.IsNullOrWhiteSpace(item.Indicacion) ? null : item.Indicacion.Trim(),
                ViaAdministracion: string.IsNullOrWhiteSpace(item.ViaAdministracion) ? null : item.ViaAdministracion.Trim(),
                Estado: EstadoActivaItem));
        }

        var profile = string.IsNullOrWhiteSpace(request.RdiarProfile)
            ? RdiarProfileDefault
            : request.RdiarProfile.Trim();

        var command = new RecetaDigitalCreateCommand(
            PacienteId: pacienteId,
            EncuentroId: encuentroId,
            TurnoId: turnoId,
            PrescriptorUsuarioId: prescriptorUsuarioId,
            PrescriptorMatricula: request.PrescriptorMatricula.Trim(),
            OrganizacionOid: request.OrganizacionOid.Trim(),
            Estado: EstadoPublicadaRepositorio,
            RdiarProfile: profile,
            FhirBundleJson: request.FhirBundleJson.Trim(),
            Items: items);

        return repository.CreateRecetaDigital(command);
    }

    public RecetaDigitalDetalleResponse ObtenerRecetaDigital(Guid recetaId)
    {
        if (recetaId == Guid.Empty)
        {
            throw new ArgumentException("recetaId es obligatorio.");
        }

        var receta = repository.GetRecetaDigitalById(recetaId);
        if (receta is null)
        {
            throw new ArgumentException("No se encontro la receta solicitada.");
        }

        return receta;
    }

    public IReadOnlyList<RecetaDigitalResumenResponse> ObtenerRecetasDigitalesPaciente(Guid pacienteId)
    {
        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        return repository.GetRecetasDigitalesByPaciente(pacienteId);
    }

    public RecetaDigitalPageResponse ObtenerRecetasDigitales(RecetasDigitalesFiltro filtro)
    {
        ArgumentNullException.ThrowIfNull(filtro);

        if (!string.IsNullOrWhiteSpace(filtro.Estado)
            && !EstadosReceta.Contains(filtro.Estado.Trim(), StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                $"estado invalido. Valores permitidos: {string.Join(", ", EstadosReceta)}.");
        }

        var page = filtro.Page <= 0 ? 1 : filtro.Page;
        var pageSize = filtro.PageSize <= 0 ? 20 : filtro.PageSize;

        // Mismo tope que el listado de turnos del paciente, para que la app
        // mobile no pida paginas gigantes.
        if (pageSize > 100)
        {
            throw new ArgumentException("pageSize no puede ser mayor a 100.");
        }

        return repository.GetRecetasDigitales(filtro with { Page = page, PageSize = pageSize });
    }

    public ActualizarEstadoRecetaDigitalResponse ActualizarEstadoRecetaDigital(
        Guid recetaId,
        ActualizarEstadoRecetaDigitalRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (recetaId == Guid.Empty)
        {
            throw new ArgumentException("recetaId es obligatorio.");
        }

        var estadoNuevo = request.Estado?.Trim();
        if (string.IsNullOrWhiteSpace(estadoNuevo))
        {
            throw new ArgumentException("estado es obligatorio.");
        }

        if (!EstadosReceta.Contains(estadoNuevo, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                $"estado invalido. Valores permitidos: {string.Join(", ", EstadosReceta)}.");
        }

        var usuarioId = UsuarioActual();

        var actual = repository.GetRecetaDigitalById(recetaId);
        if (actual is null)
        {
            throw new ArgumentException("No se encontro la receta solicitada.");
        }

        var estadoActual = actual.Estado;
        if (string.Equals(estadoActual, estadoNuevo, StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException($"La receta ya se encuentra en estado {estadoNuevo}.");
        }

        if (!TransicionesReceta.TryGetValue(estadoActual, out var permitidas))
        {
            throw new ArgumentException(
                $"El estado {estadoActual} es final y no admite transiciones.");
        }

        if (!permitidas.Contains(estadoNuevo))
        {
            throw new ArgumentException(
                $"Transicion no permitida de {estadoActual} a {estadoNuevo}. " +
                $"Permitido: {string.Join(", ", permitidas.OrderBy(x => x))}.");
        }

        var resultado = repository.ActualizarEstadoRecetaDigital(
            recetaId,
            estadoNuevo.ToUpperInvariant(),
            estadoActual,
            usuarioId,
            request.Motivo?.Trim());

        if (resultado is null)
        {
            // El update exigia que el estado siguiera siendo el leido: si no
            // matcheo, otra terminal movio la receta en paralelo.
            throw new InvalidOperationException(
                "La receta fue modificada por otro usuario mientras se realizaba el cambio. Recargue e intente nuevamente.");
        }

        return resultado;
    }

    public AnularRecetaDigitalResponse AnularRecetaDigital(Guid recetaId, AnularRecetaDigitalRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (recetaId == Guid.Empty)
        {
            throw new ArgumentException("recetaId es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.Motivo))
        {
            throw new ArgumentException("motivo es obligatorio.");
        }

        // No se valida request.UsuarioId: el usuario se resuelve desde el claim
        // userId del JWT, asi que un cliente puede omitir el campo.
        // Anular es un caso particular de cambio de estado. Se rutea por la
        // maquina de estados para que /anular y /estado apliquen exactamente las
        // mismas reglas y los dos caminos dejen auditoria en receta_digital_evento.
        var actualizado = ActualizarEstadoRecetaDigital(
            recetaId,
            new ActualizarEstadoRecetaDigitalRequest(EstadoAnulada, request.Motivo));

        return new AnularRecetaDigitalResponse(
            RecetaId: actualizado.RecetaId,
            Estado: actualizado.Estado,
            ActualizadoEn: actualizado.ActualizadoEn);
    }

    public IReadOnlyList<SolicitudEstudioResponse> ObtenerSolicitudesEstudios(string turnoId)
    {
        if (string.IsNullOrWhiteSpace(turnoId))
            throw new ArgumentException("turnoId es obligatorio.");
        return repository.GetSolicitudesEstudios(turnoId);
    }

    public GuardarSolicitudesEstudiosResponse GuardarSolicitudesEstudios(string turnoId, GuardarSolicitudesEstudiosRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        if (string.IsNullOrWhiteSpace(turnoId))
            throw new ArgumentException("turnoId es obligatorio.");
        if (string.IsNullOrWhiteSpace(request.PacienteId))
            throw new ArgumentException("pacienteId es obligatorio.");
        if (request.Items is null)
            throw new ArgumentException("items es obligatorio.");
        return repository.SaveSolicitudesEstudios(turnoId, request.PacienteId, request.Items);
    }
}
