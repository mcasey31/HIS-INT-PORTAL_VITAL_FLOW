using VitalFlow.His.Api.Application.HistoriaClinica.Contracts;
using VitalFlow.His.Api.Application.HistoriaClinica.Repositories;

namespace VitalFlow.His.Api.Application.HistoriaClinica.Services;

public sealed class HistoriaClinicaService(IHistoriaClinicaRepository repository) : IHistoriaClinicaService
{
    private const string EstadoPublicadaRepositorio = "PUBLICADA_REPOSITORIO";
    private const string EstadoActivaItem = "ACTIVA";
    private const string EstadoAnulada = "ANULADA";
    private const string RdiarProfileDefault = "RDI_Ar_0_2_5";

    public IReadOnlyList<ProblemaCronicoResponse> ObtenerProblemasCronicos(Guid pacienteId)
    {
        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        return repository.GetProblemasCronicos(pacienteId);
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

    public IReadOnlyList<SolicitudEstudioResponse> ObtenerSolicitudesEstudio(Guid pacienteId, string? turnoId)
    {
        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        return repository.GetSolicitudesEstudio(pacienteId, turnoId).ToList();
    }

    public void SincronizarSolicitudesEstudio(Guid pacienteId, string turnoId, SincronizarSolicitudesEstudioRequest request, Guid? createdBy)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(turnoId))
        {
            throw new ArgumentException("turnoId es obligatorio.");
        }

        if (request.Solicitudes is null)
        {
            throw new ArgumentException("solicitudes es obligatorio.");
        }

        foreach (var item in request.Solicitudes)
        {
            if (string.IsNullOrWhiteSpace(item.PracticaNombre))
            {
                throw new ArgumentException("practicaNombre es obligatorio en cada solicitud.");
            }

            if (!DateOnly.TryParse(item.FechaSolicitada, out _))
            {
                throw new ArgumentException($"'{item.FechaSolicitada}' no es una fecha valida (yyyy-MM-dd).");
            }
        }

        repository.SincronizarSolicitudesEstudio(pacienteId, turnoId, request.Solicitudes, createdBy);
    }

    public CrearEvolucionAmbulatoriaResponse CrearEvolucionAmbulatoria(CrearEvolucionAmbulatoriaRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (!Guid.TryParse(request.PacienteId, out var pacienteId) || pacienteId == Guid.Empty)
        {
            throw new ArgumentException("pacienteId es obligatorio y debe ser GUID valido.");
        }

        if (string.IsNullOrWhiteSpace(request.Texto))
        {
            throw new ArgumentException("texto es obligatorio.");
        }

        if (request.Problemas is null || request.Problemas.Count == 0)
        {
            throw new ArgumentException("debe incluir al menos un problema asociado.");
        }

        if (string.IsNullOrWhiteSpace(request.Especialidad))
        {
            throw new ArgumentException("especialidad es obligatoria.");
        }

        if (string.IsNullOrWhiteSpace(request.Profesional))
        {
            throw new ArgumentException("profesional es obligatorio.");
        }

        return repository.CreateEvolucionAmbulatoria(pacienteId, request);
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

        if (!Guid.TryParse(request.UsuarioId, out var usuarioId) || usuarioId == Guid.Empty)
        {
            throw new ArgumentException("usuarioId es obligatorio y debe ser GUID valido.");
        }

        var result = repository.AnularRecetaDigital(recetaId, request.Motivo.Trim(), usuarioId);
        if (result is null)
        {
            throw new ArgumentException("No se encontro la receta solicitada.");
        }

        return result with { Estado = EstadoAnulada };
    }
}
