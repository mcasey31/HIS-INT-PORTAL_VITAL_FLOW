using System.Globalization;
using VitalFlow.His.Api.Application.Admision.Contracts;
using VitalFlow.His.Api.Application.Admision.Repositories;
using VitalFlow.His.Api.Application.Turnos.Repositories;
using VitalFlow.His.Api.Domain.Agenda;

namespace VitalFlow.His.Api.Application.Admision.Services;

public sealed class AdmisionService(
    IAgendaRepository agendaRepository,
    IAdmisionRepository admisionRepository,
    ITurnosRepository turnosRepository) : IAdmisionService
{
    private static readonly TimeZoneInfo BusinessTimeZone = ResolveBusinessTimeZone();
    private const string EstadoProgramado = "PROGRAMADO";
    private const string EstadoEnSalaEspera = "EN_SALA_DE_ESPERA";
    private const string EstadoEnAtencion = "EN_ATENCION";
    private const string EstadoAtendido = "ATENDIDO";
    private const string EstadoAusente = "AUSENTE";
    private const string EstadoNoAdmitido = "NO_ADMITIDO";
    private const string EstadoNoAtendido = "NO_ATENDIDO";
    private const string EstadoEnObservacion = "EN_OBSERVACION";
    private const string EstadoPendientePago = "PENDIENTE_DE_PAGO";
    private const string EstadoTurnoProgramado = "PROGRAMADO";
    private const string EstadoTurnoConsumido = "CONSUMIDO";
    private const string EstadoTurnoAgendado = "AGENDADO";
    private const string EstadoTurnoAnulado = "ANULADO";
    private const string MotivoAutocierreVencido = "AUTOCIERRE_24H";

    private static readonly string[] EstadosAdmision =
    [
        EstadoProgramado,
        EstadoEnSalaEspera,
        EstadoEnAtencion,
        EstadoAtendido,
        EstadoAusente,
        EstadoNoAdmitido,
        EstadoNoAtendido,
        EstadoEnObservacion,
        EstadoPendientePago
    ];

    private static readonly HashSet<string> EstadosFinales =
    [
        EstadoAtendido,
        EstadoAusente,
        EstadoNoAdmitido,
        EstadoNoAtendido
    ];

    private static readonly Dictionary<string, HashSet<string>> TransicionesPermitidas =
        new(StringComparer.OrdinalIgnoreCase)
        {
            [EstadoProgramado] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                EstadoEnSalaEspera,
                EstadoAusente,
                EstadoNoAdmitido,
                EstadoPendientePago
            },
            [EstadoPendientePago] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                EstadoEnSalaEspera,
                EstadoNoAdmitido
            },
            [EstadoEnSalaEspera] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                EstadoEnAtencion,
                EstadoAtendido,
                EstadoNoAtendido,
                EstadoPendientePago
            },
            [EstadoEnAtencion] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                EstadoAtendido,
                EstadoEnObservacion,
                EstadoNoAtendido
            },
            [EstadoEnObservacion] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                EstadoEnAtencion,
                EstadoAtendido,
                EstadoNoAtendido
            }
        };

    public SelectoresAdmisionResponse GetSelectores(AdmisionScopeContext scope)
    {
        var fechaReferencia = DateOnly.FromDateTime(GetBusinessNow().DateTime);
        var agendas = GetAgendasElegiblesConBloques(scope, fechaReferencia);

        var servicios = agendas
            .GroupBy(a => a.ServicioId)
            .Select(g => new SelectorAdmisionResponse(g.Key.ToString(), g.First().ServicioNombre))
            .OrderBy(x => x.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var practicas = agendas
            .SelectMany(agenda => agenda.Bloques
                .Where(b => b.Activo)
                .SelectMany(b => b.Practicas)
                .Where(p => !string.IsNullOrWhiteSpace(p.Nombre))
                .Select(p => new PracticaAdmisionResponse(
                    BuildPracticaId(agenda.ServicioId, p.Nombre.Trim()),
                    p.Nombre.Trim(),
                    agenda.ServicioId.ToString())))
            .GroupBy(item => item.Id)
            .Select(group => group.First())
            .OrderBy(item => item.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var tiposEfector = agendas
            .Select(a => (a.TipoEfector ?? string.Empty).Trim().ToUpperInvariant())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(t => t, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var efectores = agendas
            .Select(a => new EfectorAdmisionResponse(
                a.EfectorId.ToString(),
                a.EfectorNombre,
                a.TipoEfector,
                a.ServicioId.ToString()))
            .GroupBy(item => item.Id)
            .Select(group => group.First())
            .OrderBy(item => item.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var estados = EstadosAdmision;

        return new SelectoresAdmisionResponse(servicios, practicas, tiposEfector, efectores, estados);
    }

    public IReadOnlyList<TurnoAdmisionResponse> BuscarTurnos(BuscarTurnosAdmisionRequest request, AdmisionScopeContext scope)
    {
        var fecha = request.Fecha ?? DateOnly.FromDateTime(GetBusinessNow().DateTime);
        var now = DateTimeOffset.UtcNow;
        var turnosProgramados = admisionRepository.GetTurnosProgramadosPacientePorFecha(fecha);
        var turnosProgramadosPorTurnoAdmisionId = turnosProgramados
            .Select(item => new
            {
                Row = item,
                TurnoAdmisionId = TryBuildTurnoAdmisionIdFromProgramadoId(item.TurnoProgramadoId)
            })
            .Where(item => !string.IsNullOrWhiteSpace(item.TurnoAdmisionId))
            .GroupBy(item => item.TurnoAdmisionId!, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.Select(item => item.Row).OrderBy(item => item.FechaHora).ToList(),
                StringComparer.OrdinalIgnoreCase);
        var turnosProgramadosPorClave = turnosProgramados
            .GroupBy(item => BuildTurnoProgramadoKey(item.FechaHora, item.Servicio, item.Profesional), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.OrderBy(item => item.FechaHora).ToList(),
                StringComparer.OrdinalIgnoreCase);
        var turnosProgramadosPorFechaServicio = turnosProgramados
            .GroupBy(item => BuildTurnoProgramadoKeySinProfesional(item.FechaHora, item.Servicio), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.OrderBy(item => item.FechaHora).ToList(),
                StringComparer.OrdinalIgnoreCase);
        var turnosProgramadosUsados = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        var slots = new List<(DateTimeOffset Sort, string TurnoId, string TurnoLabel, string ServicioNombre, string ProfesionalNombre, string ConsultorioNombre)>();

        foreach (var agenda in GetAgendasElegiblesConBloques(scope, fecha))
        {
            if (!string.IsNullOrWhiteSpace(request.ServicioId)
                && !string.Equals(agenda.ServicioId.ToString(), request.ServicioId, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            if (!string.IsNullOrWhiteSpace(request.TipoEfector)
                && !string.Equals(agenda.TipoEfector, request.TipoEfector, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            if (!string.IsNullOrWhiteSpace(request.EfectorId)
                && !string.Equals(agenda.EfectorId.ToString(), request.EfectorId, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            foreach (var bloque in agenda.Bloques.Where(b => EsBloqueAplicableEnFecha(b, agenda, fecha)))
            {
                if (!string.IsNullOrWhiteSpace(request.PracticaId))
                {
                    var tienePractica = bloque.Practicas.Any(p =>
                        !string.IsNullOrWhiteSpace(p.Nombre)
                        && string.Equals(
                            BuildPracticaId(agenda.ServicioId, p.Nombre.Trim()),
                            request.PracticaId,
                            StringComparison.OrdinalIgnoreCase));

                    if (!tienePractica)
                    {
                        continue;
                    }
                }

                var intervalo = bloque.IntervaloMinutos > 0 ? bloque.IntervaloMinutos : Math.Max(bloque.DuracionTurnoMinutos, 1);
                if (intervalo <= 0)
                {
                    continue;
                }

                for (var hora = bloque.HoraInicio; hora < bloque.HoraFin; hora = hora.AddMinutes(intervalo))
                {
                    var turnoId = BuildTurnoId(agenda.Id, bloque.Id, fecha, hora);
                    var turnoDate = new DateTimeOffset(fecha.Year, fecha.Month, fecha.Day, hora.Hour, hora.Minute, 0, TimeSpan.Zero);
                    slots.Add((
                        turnoDate,
                        turnoId,
                        $"{fecha:dd/MM/yyyy} {hora:HH:mm}",
                        agenda.ServicioNombre,
                        agenda.EfectorNombre,
                        string.IsNullOrWhiteSpace(bloque.LugarAtencionNombre) ? "-" : bloque.LugarAtencionNombre.Trim()));
                }
            }
        }

        var turnoIds = slots.Select(s => s.TurnoId).Distinct().ToList();
        var turnoProgramadoAdmisionIds = turnosProgramados
            .Select(item => TryBuildTurnoAdmisionIdFromProgramadoId(item.TurnoProgramadoId))
            .Where(item => !string.IsNullOrWhiteSpace(item))
            .Select(item => item!)
            .Distinct(StringComparer.OrdinalIgnoreCase);
        var admisionRows = admisionRepository.GetTurnosAdmisionByIds(turnoIds
            .Concat(turnoProgramadoAdmisionIds)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList());

        var items = new List<(DateTimeOffset Sort, TurnoAdmisionResponse Row)>();

        foreach (var (sort, turnoId, turnoLabel, servicioNombre, profesionalNombre, consultorioNombre) in slots)
        {
            // Intentar enriquecer con datos de turno asignado (opcional)
            turnosProgramadosPorTurnoAdmisionId.TryGetValue(turnoId, out var candidatosPorTurnoId);
            var turnoProgramado = candidatosPorTurnoId?
                .FirstOrDefault(item => !turnosProgramadosUsados.Contains(item.TurnoProgramadoId));

            if (turnoProgramado is null)
            {
                var programadoKey = BuildTurnoProgramadoKey(sort, servicioNombre, profesionalNombre);
                turnosProgramadosPorClave.TryGetValue(programadoKey, out var candidatosPorClave);
                turnoProgramado = candidatosPorClave?
                    .FirstOrDefault(item => !turnosProgramadosUsados.Contains(item.TurnoProgramadoId));
            }

            if (turnoProgramado is null)
            {
                var programadoKeySinProfesional = BuildTurnoProgramadoKeySinProfesional(sort, servicioNombre);
                turnosProgramadosPorFechaServicio.TryGetValue(programadoKeySinProfesional, out var candidatosPorServicio);
                turnoProgramado = candidatosPorServicio?
                    .FirstOrDefault(item => !turnosProgramadosUsados.Contains(item.TurnoProgramadoId));
            }

            if (turnoProgramado is not null)
            {
                turnosProgramadosUsados.Add(turnoProgramado.TurnoProgramadoId);
            }

            var turnoProgramadoAdmisionId = turnoProgramado is null
                ? null
                : TryBuildTurnoAdmisionIdFromProgramadoId(turnoProgramado.TurnoProgramadoId);

            admisionRows.TryGetValue(turnoId, out var row);
            if (row is null && !string.IsNullOrWhiteSpace(turnoProgramadoAdmisionId))
            {
                admisionRows.TryGetValue(turnoProgramadoAdmisionId, out row);
            }

            var estado = row?.Estado ?? EstadoProgramado;
            var estadoTurno = row?.EstadoTurno ?? EstadoTurnoProgramado;
            var llegada = row?.LlegadaEn;
            var turnoIdRespuesta = row?.TurnoId ?? turnoProgramadoAdmisionId ?? turnoId;

            if (!string.IsNullOrWhiteSpace(request.Estado)
                && !string.Equals(request.Estado, estado, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            items.Add((
                Sort: sort,
                Row: new TurnoAdmisionResponse(
                    turnoIdRespuesta,
                    turnoLabel,
                    llegada?.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
                    row?.PacienteNombre ?? turnoProgramado?.PacienteNombre ?? "Por identificar",
                    row?.Documento ?? turnoProgramado?.Documento ?? "-",
                    row?.Financiador ?? turnoProgramado?.Financiador ?? "-",
                    servicioNombre,
                    consultorioNombre,
                    estado,
                    estadoTurno)));
        }

        var permitirFallbackProgramados = string.IsNullOrWhiteSpace(request.ServicioId)
            && string.IsNullOrWhiteSpace(request.PracticaId)
            && string.IsNullOrWhiteSpace(request.TipoEfector)
            && string.IsNullOrWhiteSpace(request.EfectorId);

        if (permitirFallbackProgramados)
        {
            foreach (var turnoProgramado in turnosProgramados)
            {
                if (turnosProgramadosUsados.Contains(turnoProgramado.TurnoProgramadoId))
                {
                    continue;
                }

                var turnoIdFallback = TryBuildTurnoAdmisionIdFromProgramadoId(turnoProgramado.TurnoProgramadoId)
                    ?? $"adm:tp:{turnoProgramado.TurnoProgramadoId}";

                admisionRows.TryGetValue(turnoIdFallback, out var row);
                var estado = row?.Estado ?? EstadoProgramado;
                var estadoTurno = row?.EstadoTurno ?? EstadoTurnoProgramado;
                var llegada = row?.LlegadaEn;

                if (!string.IsNullOrWhiteSpace(request.Estado)
                    && !string.Equals(request.Estado, estado, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                turnosProgramadosUsados.Add(turnoProgramado.TurnoProgramadoId);

                items.Add((
                    Sort: turnoProgramado.FechaHora,
                    Row: new TurnoAdmisionResponse(
                        turnoIdFallback,
                        FormatTurnoProgramadoLabel(turnoProgramado.FechaHora),
                        llegada?.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
                        row?.PacienteNombre ?? turnoProgramado.PacienteNombre ?? "Por identificar",
                        row?.Documento ?? turnoProgramado.Documento ?? "-",
                        row?.Financiador ?? turnoProgramado.Financiador ?? "-",
                        turnoProgramado.Servicio,
                        turnoProgramado.Profesional,
                        estado,
                        estadoTurno)));
            }
        }

        return items
            .OrderBy(item => Math.Abs((item.Sort - now).TotalMinutes))
            .ThenBy(item => item.Sort)
            .Select(item => item.Row)
            .ToArray();
    }

    private static string BuildTurnoProgramadoKey(DateTimeOffset fechaHora, string servicio, string profesional)
    {
        return string.Join(
            "|",
            fechaHora.UtcDateTime.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
            NormalizeTurnoProgramadoText(servicio),
            NormalizeTurnoProgramadoText(profesional));
    }

    private static string FormatTurnoProgramadoLabel(DateTimeOffset fechaHora)
    {
        var utc = fechaHora.UtcDateTime;
        return $"{utc:dd/MM/yyyy HH:mm}";
    }

    private static string BuildTurnoProgramadoKeySinProfesional(DateTimeOffset fechaHora, string servicio)
    {
        return string.Join(
            "|",
            fechaHora.UtcDateTime.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
            NormalizeTurnoProgramadoText(servicio));
    }

    private static string? TryBuildTurnoAdmisionIdFromProgramadoId(string? turnoProgramadoId)
    {
        if (string.IsNullOrWhiteSpace(turnoProgramadoId))
        {
            return null;
        }

        var marker = "slot:";
        var markerIndex = turnoProgramadoId.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (markerIndex < 0)
        {
            return null;
        }

        var slotPayload = turnoProgramadoId[(markerIndex + marker.Length)..];
        var parts = slotPayload.Split(':', StringSplitOptions.TrimEntries);
        if (parts.Length < 4)
        {
            return null;
        }

        var agendaId = parts[0];
        var bloqueId = parts[1];
        var fecha = parts[2];
        var horaSegment = parts[3];
        var hora = horaSegment.Split('-', 2, StringSplitOptions.TrimEntries)[0];

        if (agendaId.Length == 0 || bloqueId.Length == 0 || fecha.Length == 0 || hora.Length == 0)
        {
            return null;
        }

        return $"adm:{agendaId}:{bloqueId}:{fecha}:{hora}";
    }

    private static string NormalizeTurnoProgramadoText(string value)
    {
        return (value ?? string.Empty).Trim().ToUpperInvariant();
    }

    private static TimeZoneInfo ResolveBusinessTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("America/Argentina/Buenos_Aires");
        }
        catch (TimeZoneNotFoundException)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                return TimeZoneInfo.Local;
            }
        }
    }

    private static DateTimeOffset GetBusinessNow()
    {
        return TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, BusinessTimeZone);
    }

    public ConfirmarArriboTurnoResponse ConfirmarArribo(string turnoId, ConfirmarArriboTurnoRequest request)
    {
        if (string.IsNullOrWhiteSpace(turnoId))
        {
            throw new ArgumentException("turnoId es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(request.PacienteId)
            || string.IsNullOrWhiteSpace(request.Paciente)
            || string.IsNullOrWhiteSpace(request.Documento))
        {
            throw new ArgumentException("pacienteId, paciente y documento son obligatorios.");
        }

        var documentacionValidada = request.DocumentacionValidada ?? true;
        if (!documentacionValidada)
        {
            throw new ArgumentException("La documentacion requerida no fue validada. No se puede completar la admision.");
        }

        var pacienteId = request.PacienteId.Trim();
        var financiador = string.IsNullOrWhiteSpace(request.Financiador) ? "-" : request.Financiador.Trim();

        var requierePago = request.RequierePago ?? false;
        var pagoRegistrado = request.PagoRegistrado ?? true;
        if (requierePago && !pagoRegistrado)
        {
            admisionRepository.UpsertTurnoAdmision(new TurnoAdmisionRow(
                turnoId, pacienteId, request.Paciente.Trim(), request.Documento.Trim(), financiador,
                EstadoPendientePago, EstadoTurnoProgramado, "PAGO_PENDIENTE", null));

            var ahora = DateTimeOffset.UtcNow;
            return new ConfirmarArriboTurnoResponse(
                turnoId, EstadoPendientePago,
                ahora.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
                EstadoTurnoProgramado, null, null, null);
        }

        var practicaCienConvenida = request.PracticaCienPorcientoConvenida ?? true;
        var estadoTurnoFinal = practicaCienConvenida ? EstadoTurnoConsumido : EstadoTurnoProgramado;

        admisionRepository.UpsertTurnoAdmision(new TurnoAdmisionRow(
            turnoId, pacienteId, request.Paciente.Trim(), request.Documento.Trim(), financiador,
            EstadoEnSalaEspera, estadoTurnoFinal, null, DateTimeOffset.UtcNow));

        string? encuentroId = null;
        if (practicaCienConvenida)
        {
            encuentroId = admisionRepository.CrearEncuentroSiNoExiste(turnoId, pacienteId);
        }

        var rowActual = admisionRepository.GetTurnoAdmision(turnoId);
        var llegadaFinal = rowActual?.LlegadaEn ?? DateTimeOffset.UtcNow;

        // ── Evento outbox CONV-FACT (solo si el módulo está activo; zero-impact si no) ──
        TryPublicarEventoFacturacion(
            turnoId, encuentroId, pacienteId,
            request.Paciente.Trim(), request.Documento.Trim(), financiador,
            request.FinanciadorId, request.PlanId,
            request.ServicioNombre, request.CentroId,
            llegadaFinal,
            request.PracticaOrigenNombre, request.PracticaOrigenCodigo,
            request.ProfesionalId, request.ProfesionalNombre,
            request.TipoOrigen ?? "TURNO");

        var eventoFacturacion = admisionRepository.GetEventoFacturacionByTurnoId(turnoId);

        return new ConfirmarArriboTurnoResponse(
            turnoId, EstadoEnSalaEspera,
            llegadaFinal.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
            estadoTurnoFinal,
            encuentroId,
            eventoFacturacion?.Estado,
            eventoFacturacion?.ErrorDetalle);
    }

    public EventoFacturacionTurnoResponse ObtenerEventoFacturacion(string turnoId)
    {
        if (string.IsNullOrWhiteSpace(turnoId))
        {
            throw new ArgumentException("turnoId es obligatorio.");
        }

        var row = admisionRepository.GetEventoFacturacionByTurnoId(turnoId)
            ?? new EventoFacturacionEstadoRow(turnoId, "NO_GENERADO", null, DateTimeOffset.UtcNow, null);

        return new EventoFacturacionTurnoResponse(
            row.TurnoId,
            row.Estado,
            row.ErrorDetalle,
            row.CreatedAt.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
            row.ProcessedAt?.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture));
    }

    private void TryPublicarEventoFacturacion(
        string turnoId,
        string? encuentroId,
        string pacienteId,
        string pacienteNombre,
        string documento,
        string financiador,
        string? financiadorIdRaw,
        string? planIdRaw,
        string? servicioNombre,
        string? centroIdRaw,
        DateTimeOffset llegadaEn,
        string? practicaOrigenNombre = null,
        string? practicaOrigenCodigo = null,
        string? profesionalIdRaw = null,
        string? profesionalNombre = null,
        string tipoOrigen = "TURNO")
    {
        if (!admisionRepository.IsModuloHisActivo("CONV_FACT"))
        {
            return;
        }

        Guid.TryParse(pacienteId, out var pacienteGuid);
        if (pacienteGuid == Guid.Empty)
        {
            throw new ArgumentException("No se puede publicar a facturacion: pacienteId invalido.");
        }

        Guid? encuentroGuid = Guid.TryParse(encuentroId, out var eg) ? eg : null;
        Guid? centroId = Guid.TryParse(centroIdRaw, out var cid) ? cid : null;
        Guid? profesionalId = Guid.TryParse(profesionalIdRaw, out var pfid) ? pfid : null;

        var cobertura = ResolveCoberturaContrato(pacienteGuid, financiadorIdRaw, planIdRaw);

        var homologacion = admisionRepository.ResolveHomologacionPractica(
            practicaOrigenCodigo ?? string.Empty,
            cobertura.FinanciadorId,
            cobertura.PlanId);
        var homologacionEncontrada = homologacion is not null;

        var payload = System.Text.Json.JsonSerializer.Serialize(new
        {
            evento = "ADMISION_EN_SALA_ESPERA",
            event_type = "ADMISION_EN_SALA_ESPERA",
            tipo_origen = tipoOrigen,
            turno_id = turnoId,
            encuentro_id = encuentroId,
            paciente_id = pacienteId,
            paciente_nombre = pacienteNombre,
            documento,
            financiador,
            financiador_id = cobertura.FinanciadorId.ToString(),
            plan_id = cobertura.PlanId.ToString(),
            servicio_nombre = servicioNombre,
            centro_id = centroIdRaw,
            llegada_en = llegadaEn.ToString("O", CultureInfo.InvariantCulture),
            practica_origen_nombre = practicaOrigenNombre,
            practica_origen_codigo = practicaOrigenCodigo,
            homologacion_encontrada = homologacionEncontrada,
            catalogo_destino_codigo = homologacion?.CatalogoCodigo,
            practica_destino_codigo = homologacion?.PrestacionCodigo,
            practica_destino_nombre = homologacion?.PrestacionNombre,
            profesional_id = profesionalIdRaw,
            profesional_nombre = profesionalNombre,
            origen = "HIS"
        });

        admisionRepository.InsertEventoFacturacionOutbox(new EventoFacturacionOutboxRow(
            Id: Guid.NewGuid(),
            TurnoId: turnoId,
            EncuentroId: encuentroGuid,
            PacienteId: pacienteGuid,
            PacienteNombre: pacienteNombre,
            Documento: documento,
            Financiador: financiador == "-" ? null : financiador,
            FinanciadorId: cobertura.FinanciadorId,
            PlanId: cobertura.PlanId,
            ServicioNombre: servicioNombre,
            CentroId: centroId,
            LlegadaEn: llegadaEn,
            Payload: payload,
            PracticaOrigenNombre: practicaOrigenNombre,
            PracticaOrigenCodigo: practicaOrigenCodigo,
            HomologacionEncontrada: homologacionEncontrada,
            CatalogoDestinoCodigo: homologacion?.CatalogoCodigo,
            PrestacionDestinoCodigo: homologacion?.PrestacionCodigo,
            PrestacionDestinoNombre: homologacion?.PrestacionNombre,
            ProfesionalId: profesionalId,
            ProfesionalNombre: profesionalNombre,
            TipoOrigen: tipoOrigen,
            EventType: "ADMISION_EN_SALA_ESPERA"));
    }

    private CoberturaPacienteRow ResolveCoberturaContrato(Guid pacienteId, string? financiadorIdRaw, string? planIdRaw)
    {
        var hasFinanciador = Guid.TryParse(financiadorIdRaw, out var financiadorId) && financiadorId != Guid.Empty;
        var hasPlan = Guid.TryParse(planIdRaw, out var planId) && planId != Guid.Empty;

        if (hasFinanciador && hasPlan)
        {
            return new CoberturaPacienteRow(financiadorId, planId, null, null);
        }

        if (hasFinanciador ^ hasPlan)
        {
            throw new ArgumentException("Cobertura incompleta para facturacion: se requieren financiadorId y planId juntos.");
        }

        var cobertura = admisionRepository.GetCoberturaVigentePaciente(pacienteId);
        if (cobertura is null)
        {
            throw new ArgumentException("No se pudo resolver cobertura vigente del paciente para facturacion (financiadorId/planId). ");
        }

        return cobertura;
    }

    public ActualizarEstadoTurnoResponse ActualizarEstadoTurno(string turnoId, ActualizarEstadoTurnoRequest request)
    {
        if (string.IsNullOrWhiteSpace(turnoId))
        {
            throw new ArgumentException("turnoId es obligatorio.");
        }

        var nuevoEstado = (request.Estado ?? string.Empty).Trim().ToUpperInvariant();
        if (string.IsNullOrWhiteSpace(nuevoEstado))
        {
            throw new ArgumentException("estado es obligatorio.");
        }

        if (!EstadosAdmision.Contains(nuevoEstado, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException($"El estado `{request.Estado}` no es valido.");
        }

        var rowActual = admisionRepository.GetTurnoAdmision(turnoId);
        var estadoActual = rowActual?.Estado ?? EstadoProgramado;

        if (!EsTransicionValida(estadoActual, nuevoEstado))
        {
            throw new ArgumentException($"No se permite cambiar de `{estadoActual}` a `{nuevoEstado}`.");
        }

        if (string.Equals(nuevoEstado, EstadoEnAtencion, StringComparison.OrdinalIgnoreCase))
        {
            var turnosEnAtencion = admisionRepository.GetTurnosEnEstado(EstadoEnAtencion, turnoId);
            if (turnosEnAtencion.Count > 0)
            {
                throw new ArgumentException($"Ya existe un paciente en atencion (turno {turnosEnAtencion[0]}).");
            }
        }

        var motivo = string.IsNullOrWhiteSpace(request.Motivo) ? null : request.Motivo.Trim();
        var llegadaFinal = rowActual?.LlegadaEn;
        if (string.Equals(nuevoEstado, EstadoEnSalaEspera, StringComparison.OrdinalIgnoreCase) && llegadaFinal is null)
        {
            llegadaFinal = DateTimeOffset.UtcNow;
        }

        admisionRepository.UpsertTurnoAdmision(new TurnoAdmisionRow(
            turnoId, rowActual?.PacienteId, rowActual?.PacienteNombre, rowActual?.Documento, rowActual?.Financiador,
            nuevoEstado, rowActual?.EstadoTurno ?? EstadoTurnoProgramado, motivo, llegadaFinal));

        // Sincroniza el estado de historia de turnos para evitar consultas adicionales
        // y garantizar consistencia entre admision y turnos del paciente.
        var estadoTurno = MapEstadoAdmisionATurno(nuevoEstado);
        var updatedRows = turnosRepository.UpdateEstadoTurno(
            turnoId,
            estadoTurno,
            motivo);

        Console.WriteLine($"[AdmisionService] Sync turno_paciente turnoId={turnoId}, estadoTurno={estadoTurno}, filas={updatedRows}");

        if (updatedRows == 0)
        {
            Console.WriteLine($"[AdmisionService] No se actualizo sch_turno.turno_paciente para turnoId={turnoId} (estado={estadoTurno}).");
        }

        if (string.Equals(nuevoEstado, EstadoAtendido, StringComparison.OrdinalIgnoreCase)
            || string.Equals(nuevoEstado, EstadoNoAtendido, StringComparison.OrdinalIgnoreCase))
        {
            admisionRepository.CerrarEncuentro(turnoId, motivo ?? nuevoEstado);
        }

        return new ActualizarEstadoTurnoResponse(turnoId, nuevoEstado, motivo);
    }

    private static string MapEstadoAdmisionATurno(string estadoAdmision)
    {
        if (string.Equals(estadoAdmision, EstadoAtendido, StringComparison.OrdinalIgnoreCase))
        {
            return EstadoTurnoConsumido;
        }

        if (string.Equals(estadoAdmision, EstadoNoAdmitido, StringComparison.OrdinalIgnoreCase)
            || string.Equals(estadoAdmision, EstadoNoAtendido, StringComparison.OrdinalIgnoreCase))
        {
            return EstadoTurnoAnulado;
        }

        if (string.Equals(estadoAdmision, EstadoAusente, StringComparison.OrdinalIgnoreCase))
        {
            return EstadoAusente;
        }

        return EstadoTurnoAgendado;
    }

    public EncuentroAdmisionResponse ObtenerEncuentro(string turnoId)
    {
        if (string.IsNullOrWhiteSpace(turnoId))
        {
            throw new ArgumentException("turnoId es obligatorio.");
        }

        var encuentro = admisionRepository.GetEncuentroPorTurno(turnoId)
            ?? throw new ArgumentException("No existe encuentro para el turno indicado.");

        return EncuentroRowToResponse(encuentro);
    }

    public CerrarEncuentroResponse CerrarEncuentro(string turnoId, CerrarEncuentroRequest request)
    {
        if (string.IsNullOrWhiteSpace(turnoId))
        {
            throw new ArgumentException("turnoId es obligatorio.");
        }

        if (admisionRepository.GetEncuentroPorTurno(turnoId) is null)
        {
            throw new ArgumentException("No existe encuentro para el turno indicado.");
        }

        var estadoPacienteFinal = (request.EstadoPacienteFinal ?? string.Empty).Trim().ToUpperInvariant();
        if (!string.Equals(estadoPacienteFinal, EstadoAtendido, StringComparison.OrdinalIgnoreCase)
            && !string.Equals(estadoPacienteFinal, EstadoNoAtendido, StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("El estadoPacienteFinal debe ser ATENDIDO o NO_ATENDIDO.");
        }

        var motivo = string.IsNullOrWhiteSpace(request.Motivo) ? null : request.Motivo.Trim();
        var cierre = admisionRepository.CerrarEncuentro(turnoId, motivo ?? estadoPacienteFinal)
            ?? throw new ArgumentException("El encuentro ya se encuentra cerrado.");

        var rowActual = admisionRepository.GetTurnoAdmision(turnoId);
        admisionRepository.UpsertTurnoAdmision(new TurnoAdmisionRow(
            turnoId, rowActual?.PacienteId, rowActual?.PacienteNombre, rowActual?.Documento, rowActual?.Financiador,
            estadoPacienteFinal, rowActual?.EstadoTurno ?? EstadoTurnoConsumido, motivo, rowActual?.LlegadaEn));

        return new CerrarEncuentroResponse(
            cierre.EncuentroId, turnoId, cierre.Estado, estadoPacienteFinal,
            cierre.CerradoEn!.Value.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
            cierre.MotivoCierre);
    }

    public CerrarEncuentrosVencidosResponse CerrarEncuentrosVencidos(int horasMaximas = 24)
    {
        if (horasMaximas <= 0)
        {
            throw new ArgumentException("horasMaximas debe ser mayor a cero.");
        }

        var limite = DateTimeOffset.UtcNow.AddHours(-horasMaximas);
        var pendientes = admisionRepository.GetEncuentrosAbiertosAntesDe(limite);
        var cerrados = 0;

        foreach (var (turnoId, _) in pendientes)
        {
            var cierre = admisionRepository.CerrarEncuentro(turnoId, MotivoAutocierreVencido);
            if (cierre is null)
            {
                continue;
            }

            var rowActual = admisionRepository.GetTurnoAdmision(turnoId);
            admisionRepository.UpsertTurnoAdmision(new TurnoAdmisionRow(
                turnoId, rowActual?.PacienteId, rowActual?.PacienteNombre, rowActual?.Documento, rowActual?.Financiador,
                EstadoNoAtendido, rowActual?.EstadoTurno ?? EstadoTurnoProgramado, MotivoAutocierreVencido, rowActual?.LlegadaEn));

            cerrados += 1;
        }

        return new CerrarEncuentrosVencidosResponse(cerrados, horasMaximas);
    }

    private static EncuentroAdmisionResponse EncuentroRowToResponse(EncuentroRow e) => new(
        e.EncuentroId, e.TurnoId, e.PacienteId, e.Estado,
        e.CreadoEn.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
        e.CerradoEn?.ToLocalTime().ToString("dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture),
        e.MotivoCierre);

    private static bool EsTransicionValida(string estadoActual, string nuevoEstado)
    {
        if (string.Equals(estadoActual, nuevoEstado, StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (EstadosFinales.Contains(estadoActual))
        {
            return false;
        }

        if (!TransicionesPermitidas.TryGetValue(estadoActual, out var destinos))
        {
            return false;
        }

        return destinos.Contains(nuevoEstado);
    }

    private IReadOnlyList<AgendaAggregate> GetAgendasElegiblesConBloques(AdmisionScopeContext scope, DateOnly? fecha = null)
    {
        var agendas = agendaRepository.GetAll()
            .Select(summary => agendaRepository.GetById(summary.Id) ?? summary)
            .Where(agenda => agenda.Activa && agenda.VisibleContactCenter)
            .Where(agenda => agenda.Bloques.Any(b => b.Activo))
            .ToArray();

        if (scope.CentroId.HasValue)
        {
            agendas = agendas
                .Where(agenda => agenda.CentroId == scope.CentroId.Value)
                .ToArray();
        }

        if (scope.EsMedico)
        {
            var efectorIds = scope.UserId.HasValue
                ? agendaRepository.GetEfectorIdsByUsuario(scope.UserId.Value)
                : [];

            if (efectorIds.Count > 0)
            {
                var efectorSet = efectorIds.ToHashSet();
                agendas = agendas
                    .Where(agenda => efectorSet.Contains(agenda.EfectorId))
                    .ToArray();
            }
            else if (scope.PersonaId.HasValue)
            {
                agendas = agendas
                    .Where(agenda => agenda.EfectorId == scope.PersonaId.Value)
                    .ToArray();
            }
            else
            {
                return [];
            }
        }

        if (fecha.HasValue)
        {
            agendas = agendas
                .Where(agenda => agenda.Bloques.Any(b => EsBloqueAplicableEnFecha(b, agenda, fecha.Value)))
                .ToArray();
        }

        return agendas;
    }

    private static bool EsBloqueAplicableEnFecha(BloqueProgramacion bloque, AgendaAggregate agenda, DateOnly fecha)
    {
        if (!bloque.Activo)
        {
            return false;
        }

        if (fecha < bloque.FechaDesde || fecha > bloque.FechaHasta)
        {
            return false;
        }

        if (fecha < agenda.FechaDesde)
        {
            return false;
        }

        if (agenda.FechaHasta.HasValue && fecha > agenda.FechaHasta.Value)
        {
            return false;
        }

        var dias = bloque.Dias.Count > 0
            ? bloque.Dias.Select(d => d.Trim().ToUpperInvariant()).ToHashSet(StringComparer.OrdinalIgnoreCase)
            : new HashSet<string>(StringComparer.OrdinalIgnoreCase) { CodigoDiaSemana(fecha.DayOfWeek) };

        if (dias.Count == 0)
        {
            return true;
        }

        return dias.Contains(CodigoDiaSemana(fecha.DayOfWeek));
    }

    private static string BuildPracticaId(Guid servicioId, string practicaNombre)
    {
        return $"{servicioId:N}:{practicaNombre.Trim().ToUpperInvariant()}";
    }

    private static string BuildTurnoId(Guid agendaId, Guid bloqueId, DateOnly fecha, TimeOnly hora)
    {
        return $"adm:{agendaId:N}:{bloqueId:N}:{fecha:yyyyMMdd}:{hora:HHmm}";
    }

    private static string CodigoDiaSemana(DayOfWeek dayOfWeek)
    {
        return dayOfWeek switch
        {
            DayOfWeek.Monday => "L",
            DayOfWeek.Tuesday => "M",
            DayOfWeek.Wednesday => "X",
            DayOfWeek.Thursday => "J",
            DayOfWeek.Friday => "V",
            DayOfWeek.Saturday => "S",
            DayOfWeek.Sunday => "D",
            _ => string.Empty
        };
    }
}
