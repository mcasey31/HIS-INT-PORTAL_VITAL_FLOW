using System.Collections.Concurrent;
using System.Globalization;
using VitalFlow.His.Api.Domain.Agenda;
using VitalFlow.His.Api.Application.Personas.Repositories;
using VitalFlow.His.Api.Application.Turnos.Contracts;
using VitalFlow.His.Api.Application.Turnos.Repositories;
using VitalFlow.His.Api.Application.Admision.Repositories;

namespace VitalFlow.His.Api.Application.Turnos.Services;

public sealed class TurnosService(
    IPersonaRepository personaRepository,
    IAgendaRepository agendaRepository,
    ITurnosRepository turnosRepository,
    IAdmisionRepository admisionRepository,
    IEmailService emailService) : ITurnosService
{
    private const string EstadoAgendado = "AGENDADO";
    private const string EstadoConsumido = "CONSUMIDO";
    private const string EstadoAusente = "AUSENTE";
    private const string EstadoCanceladoAgenda = "CANCELADO_POR_AGENDA";
    private const string EstadoCanceladoBloqueo = "CANCELADO_POR_BLOQUEO";
    private const string EstadoCanceladoPaciente = "CANCELADO_POR_PACIENTE";

    private static readonly IReadOnlyList<TipoDocumentoTurnoResponse> TiposDocumento =
    [
        new("DNI", "DNI"),
        new("LC", "Libreta civica"),
        new("LE", "Libreta enrolamiento"),
        new("PAS", "Pasaporte")
    ];

    private static readonly ConcurrentDictionary<string, SlotContext> SlotContextById =
        new(StringComparer.OrdinalIgnoreCase);

    public IReadOnlyList<TipoDocumentoTurnoResponse> GetTiposDocumento() => TiposDocumento;

    public IReadOnlyList<PacienteIdentificadoTurnoResponse> IdentificarPacientePorDocumento(string tipoDocumento, string numeroDocumento)
    {
        var tipo = (tipoDocumento ?? string.Empty).Trim().ToUpperInvariant();
        var nro = numeroDocumento.Trim();
        if (string.IsNullOrWhiteSpace(tipo) || string.IsNullOrWhiteSpace(nro) || nro == "00000000")
        {
            return [];
        }

        var candidatos = personaRepository.BuscarPorTipoYNumeroDocumento(tipo, nro);
        if (candidatos.Count == 0)
        {
            return [];
        }

        if (candidatos.Count > 1)
        {
            return candidatos
                .Select(candidato => new PacienteIdentificadoTurnoResponse(
                    candidato.Id.ToString(),
                    candidato.ApellidosNombres,
                    candidato.TipoDocumento,
                    candidato.NumeroDocumento,
                    candidato.FechaNacimiento,
                    candidato.SexoBiologico,
                    candidato.Email,
                    candidato.Telefono,
                    false,
                    []
                ))
                .ToArray();
        }

        var persona = candidatos[0];
        var financiadores = turnosRepository.GetFinanciadoresVigentesPaciente(persona.Id);
        if (financiadores.Count == 0)
        {
            // HU 9741: alta automatica como paciente + cobertura por defecto Privado Particular.
            turnosRepository.EnsurePacienteConCoberturaPrivadaPorDefecto(persona.Id);
            financiadores = turnosRepository.GetFinanciadoresVigentesPaciente(persona.Id);
        }

        var financiadoresResponse = financiadores
            .Select(item => new FinanciadorPlanTurnoResponse(
                item.Id.ToString(),
                item.FinanciadorId.ToString(),
                item.PlanId.ToString(),
                item.Financiador,
                item.Plan,
                item.NumeroAfiliado,
                item.Vigente
            ))
            .ToArray();

        return
        [
            new PacienteIdentificadoTurnoResponse(
                persona.Id.ToString(),
                persona.ApellidosNombres,
                persona.TipoDocumento,
                persona.NumeroDocumento,
                persona.FechaNacimiento,
                persona.SexoBiologico,
                persona.Email,
                persona.Telefono,
                financiadoresResponse.Length > 0,
                financiadoresResponse
            )
        ];
    }

    public SelectoresDisponibilidadTurnoResponse GetSelectoresDisponibilidad()
    {
        var agendas = GetAgendasElegiblesConBloques();

        var centros = agendas
            .GroupBy(item => item.CentroId)
            .Select(group => new CentroTurnoResponse(group.Key.ToString(), group.First().CentroNombre))
            .OrderBy(item => item.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var servicios = agendas
            .GroupBy(item => item.ServicioId)
            .Select(group => new ServicioTurnoResponse(
                group.Key.ToString(),
                group.First().ServicioNombre,
                group.Select(item => item.CentroId.ToString()).Distinct(StringComparer.OrdinalIgnoreCase).ToArray()
            ))
            .OrderBy(item => item.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var practicasBuilder = new Dictionary<string, PracticaBuilder>(StringComparer.OrdinalIgnoreCase);
        foreach (var agenda in agendas)
        {
            var centroId = agenda.CentroId.ToString();
            var servicioId = agenda.ServicioId.ToString();
            var profesionalId = agenda.EfectorId.ToString();

            foreach (var bloque in agenda.Bloques.Where(EsBloqueElegible))
            {
                foreach (var practica in bloque.Practicas.Where(item => !string.IsNullOrWhiteSpace(item.Nombre)))
                {
                    var practicaNombre = practica.Nombre.Trim();
                    var practicaId = BuildPracticaId(servicioId, practicaNombre);

                    if (!practicasBuilder.TryGetValue(practicaId, out var builder))
                    {
                        builder = new PracticaBuilder(practicaId, practicaNombre, servicioId);
                        practicasBuilder[practicaId] = builder;
                    }

                    builder.CentroIds.Add(centroId);
                    builder.ProfesionalIds.Add(profesionalId);
                }
            }
        }

        var practicas = practicasBuilder.Values
            .Select(item => new PracticaTurnoResponse(
                item.Id,
                item.Nombre,
                item.ServicioId,
                item.CentroIds.OrderBy(id => id, StringComparer.OrdinalIgnoreCase).ToArray(),
                item.ProfesionalIds.OrderBy(id => id, StringComparer.OrdinalIgnoreCase).ToArray()
            ))
            .OrderBy(item => item.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var practicaIds = practicas.Select(item => item.Id).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var profesionalesBuilder = new Dictionary<string, ProfesionalBuilder>(StringComparer.OrdinalIgnoreCase);

        foreach (var agenda in agendas)
        {
            var profesionalId = agenda.EfectorId.ToString();
            if (!profesionalesBuilder.TryGetValue(profesionalId, out var builder))
            {
                builder = new ProfesionalBuilder(profesionalId, agenda.EfectorNombre);
                profesionalesBuilder[profesionalId] = builder;
            }

            builder.CentroIds.Add(agenda.CentroId.ToString());
            builder.ServicioIds.Add(agenda.ServicioId.ToString());

            foreach (var bloque in agenda.Bloques.Where(EsBloqueElegible))
            {
                foreach (var practica in bloque.Practicas.Where(item => !string.IsNullOrWhiteSpace(item.Nombre)))
                {
                    var practicaId = BuildPracticaId(agenda.ServicioId.ToString(), practica.Nombre.Trim());
                    if (practicaIds.Contains(practicaId))
                    {
                        builder.PracticaIds.Add(practicaId);
                    }
                }
            }
        }

        var profesionales = profesionalesBuilder.Values
            .Where(item => item.PracticaIds.Count > 0)
            .Select(item => new ProfesionalTurnoResponse(
                item.Id,
                item.Nombre,
                item.CentroIds.OrderBy(id => id, StringComparer.OrdinalIgnoreCase).ToArray(),
                item.ServicioIds.OrderBy(id => id, StringComparer.OrdinalIgnoreCase).ToArray(),
                item.PracticaIds.OrderBy(id => id, StringComparer.OrdinalIgnoreCase).ToArray()
            ))
            .OrderBy(item => item.Nombre, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return new SelectoresDisponibilidadTurnoResponse(centros, servicios, practicas, profesionales);
    }

    public IReadOnlyList<DisponibilidadSlotTurnoResponse> BuscarDisponibilidad(BuscarDisponibilidadTurnoRequest request)
    {
        if (request.CentroIds.Count == 0
            || string.IsNullOrWhiteSpace(request.ServicioId)
            || string.IsNullOrWhiteSpace(request.PracticaId))
        {
            return [];
        }

        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var centrosSolicitados = request.CentroIds.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var slots = new List<DisponibilidadSlotTurnoResponse>();
        var ocupadosPorFecha = new Dictionary<DateOnly, HashSet<string>>();

        HashSet<string> GetOcupados(DateOnly fecha)
        {
            if (ocupadosPorFecha.TryGetValue(fecha, out var ocupados))
            {
                return ocupados;
            }

            var rows = turnosRepository.GetTurnosAgendadosPorFecha(fecha);
            ocupados = rows
                .Select(row => BuildSlotOcupadoKey(
                    DateOnly.FromDateTime(row.FechaHora.UtcDateTime),
                    row.FechaHora.UtcDateTime.ToString("HH:mm", CultureInfo.InvariantCulture),
                    row.Centro,
                    row.Servicio,
                    row.Profesional))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            ocupadosPorFecha[fecha] = ocupados;
            return ocupados;
        }

        foreach (var agenda in GetAgendasElegiblesConBloques())
        {
            var centroId = agenda.CentroId.ToString();
            var servicioId = agenda.ServicioId.ToString();
            var profesionalId = agenda.EfectorId.ToString();

            if (!centrosSolicitados.Contains(centroId))
            {
                continue;
            }

            if (!string.Equals(servicioId, request.ServicioId, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }


            if (!string.IsNullOrWhiteSpace(request.ProfesionalId)
                && !string.Equals(profesionalId, request.ProfesionalId, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            foreach (var bloque in agenda.Bloques.Where(EsBloqueElegible))
            {
                var practicaMatch = bloque.Practicas
                    .FirstOrDefault(item =>
                        !string.IsNullOrWhiteSpace(item.Nombre)
                        && string.Equals(
                            BuildPracticaId(servicioId, item.Nombre.Trim()),
                            request.PracticaId,
                            StringComparison.OrdinalIgnoreCase));

                if (practicaMatch is null)
                {
                    continue;
                }

                var fechasSlot = ObtenerFechasDisponibles(bloque, agenda, hoy);
                if (fechasSlot.Count == 0)
                {
                    continue;
                }

                var horaInicio = bloque.HoraInicio;
                var horaFin = bloque.HoraFin;
                var intervalo = bloque.IntervaloMinutos > 0 ? bloque.IntervaloMinutos : Math.Max(bloque.DuracionTurnoMinutos, 1);
                if (intervalo <= 0)
                {
                    continue;
                }

                foreach (var fechaSlot in fechasSlot)
                {
                    for (var hora = horaInicio; hora < horaFin; hora = hora.AddMinutes(intervalo))
                    {
                        var horaSlot = hora.ToString("HH:mm", CultureInfo.InvariantCulture);
                        var slotId = $"slot:{agenda.Id:N}:{bloque.Id:N}:{fechaSlot:yyyyMMdd}:{hora:HHmm}";
                        SlotContextById[slotId] = new SlotContext(
                            slotId,
                            agenda.CentroNombre,
                            agenda.ServicioNombre,
                            practicaMatch.Nombre.Trim(),
                            agenda.EfectorNombre,
                            fechaSlot,
                            horaSlot,
                            horaInicio.ToString("HH:mm", CultureInfo.InvariantCulture),
                            horaFin.ToString("HH:mm", CultureInfo.InvariantCulture),
                            false,
                            BuildStKey(agenda.Id, bloque.Id, fechaSlot),
                            agenda.CentroId,
                            agenda.ServicioId,
                            agenda.EfectorId,
                            bloque.Id,
                            bloque.DuracionTurnoMinutos
                        );

                        var slotOcupado = GetOcupados(fechaSlot).Contains(BuildSlotOcupadoKey(
                            fechaSlot,
                            horaSlot,
                            agenda.CentroNombre,
                            agenda.ServicioNombre,
                            agenda.EfectorNombre));

                        slots.Add(new DisponibilidadSlotTurnoResponse(
                            slotId,
                            fechaSlot,
                            horaSlot,
                            "NORMAL",
                            horaInicio.ToString("HH:mm", CultureInfo.InvariantCulture),
                            horaFin.ToString("HH:mm", CultureInfo.InvariantCulture),
                            agenda.CentroNombre,
                            agenda.ServicioNombre,
                            practicaMatch.Nombre.Trim(),
                            agenda.EfectorNombre,
                            slotOcupado ? "ASIGNADO" : "DISPONIBLE",
                            null,
                            slotOcupado ? "Turno asignado" : null
                        ));
                    }

                    if (bloque.Sobreturnos <= 0)
                    {
                        continue;
                    }

                    var stKey = BuildStKey(agenda.Id, bloque.Id, fechaSlot);
                    var sobreTurnosDisponibles = turnosRepository.GetOrInitSobreturnosDisponibles(stKey, bloque.Sobreturnos);
                    var slotStId = $"slot-st:{agenda.Id:N}:{bloque.Id:N}:{fechaSlot:yyyyMMdd}";

                    SlotContextById[slotStId] = new SlotContext(
                        slotStId,
                        agenda.CentroNombre,
                        agenda.ServicioNombre,
                        practicaMatch.Nombre.Trim(),
                        agenda.EfectorNombre,
                        fechaSlot,
                        "--:--",
                        horaInicio.ToString("HH:mm", CultureInfo.InvariantCulture),
                        horaFin.ToString("HH:mm", CultureInfo.InvariantCulture),
                        true,
                        stKey,
                        agenda.CentroId,
                        agenda.ServicioId,
                        agenda.EfectorId,
                        bloque.Id,
                        bloque.DuracionTurnoMinutos
                    );

                    slots.Add(new DisponibilidadSlotTurnoResponse(
                        slotStId,
                        fechaSlot,
                        "--:--",
                        "ST",
                        horaInicio.ToString("HH:mm", CultureInfo.InvariantCulture),
                        horaFin.ToString("HH:mm", CultureInfo.InvariantCulture),
                        agenda.CentroNombre,
                        agenda.ServicioNombre,
                        practicaMatch.Nombre.Trim(),
                        agenda.EfectorNombre,
                        sobreTurnosDisponibles > 0 ? "DISPONIBLE" : "CON_CUPO",
                        sobreTurnosDisponibles,
                        sobreTurnosDisponibles > 0
                            ? "Slot ST disponible para asignacion de sobreturno"
                            : "Sin cupo de sobreturnos"
                    ));
                }
            }
        }

        return slots
            .OrderBy(item => item.Fecha)
            .ThenBy(item => item.Hora)
            .ThenBy(item => item.Centro, StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    public TurnosPacientePageResponse GetTurnosPaciente(string pacienteId, bool historial, int page, int pageSize)
    {
        var ahora = DateTimeOffset.UtcNow;
        var legacySeedPrefix = $"{pacienteId}-t-";

        var rows = turnosRepository.GetTurnosPorPaciente(pacienteId);
        if (rows.Count == 0)
        {
            return new TurnosPacientePageResponse([], 0, page, pageSize);
        }

        var turnos = rows
            .Where(r => !r.Id.StartsWith(legacySeedPrefix, StringComparison.OrdinalIgnoreCase))
            .Select(r => new TurnoPacienteResponse(
                r.Id, r.Profesional, r.Servicio, r.Centro, r.FechaHora, r.Estado, r.Motivo))
            .ToList();

        if (turnos.Count == 0)
        {
            return new TurnosPacientePageResponse([], 0, page, pageSize);
        }

        var filtered = historial
            ? turnos.Where(item => item.FechaHora < ahora || item.Estado == "ANULADO")
            : turnos.Where(item => item.FechaHora >= ahora && item.Estado != "ANULADO");

        var ordered = historial
            ? filtered.OrderByDescending(item => item.FechaHora)
            : filtered.OrderBy(item => item.FechaHora);

        var total = ordered.Count();
        var items = ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new TurnosPacientePageResponse(items, total, page, pageSize);
    }

    public FinanciadorPlanTurnoResponse GuardarFinanciadorPaciente(string pacienteId, GuardarPacienteFinanciadorTurnoRequest request)
    {
        if (!Guid.TryParse(pacienteId, out var pacienteGuid) || pacienteGuid == Guid.Empty)
        {
            throw new ArgumentException("pacienteId invalido.");
        }

        if (!Guid.TryParse(request.FinanciadorId, out var financiadorGuid) || financiadorGuid == Guid.Empty)
        {
            throw new ArgumentException("financiadorId invalido.");
        }

        if (!Guid.TryParse(request.PlanId, out var planGuid) || planGuid == Guid.Empty)
        {
            throw new ArgumentException("planId invalido.");
        }

        Guid? reemplazarId = null;
        if (!string.IsNullOrWhiteSpace(request.ReemplazarFinanciadorPlanId))
        {
            if (!Guid.TryParse(request.ReemplazarFinanciadorPlanId, out var parsedReplaceId) || parsedReplaceId == Guid.Empty)
            {
                throw new ArgumentException("reemplazarFinanciadorPlanId invalido.");
            }
            reemplazarId = parsedReplaceId;
        }

        var saved = turnosRepository.GuardarFinanciadorPaciente(
            pacienteGuid,
            financiadorGuid,
            planGuid,
            request.NumeroAfiliado,
            reemplazarId);

        return new FinanciadorPlanTurnoResponse(
            saved.Id.ToString(),
            saved.FinanciadorId.ToString(),
            saved.PlanId.ToString(),
            saved.Financiador,
            saved.Plan,
            saved.NumeroAfiliado,
            saved.Vigente);
    }

    public void FinalizarVigenciaFinanciadorPaciente(string pacienteId, string financiadorPlanPacienteId)
    {
        if (!Guid.TryParse(pacienteId, out var pacienteGuid) || pacienteGuid == Guid.Empty)
        {
            throw new ArgumentException("pacienteId invalido.");
        }

        if (!Guid.TryParse(financiadorPlanPacienteId, out var financiadorPlanGuid) || financiadorPlanGuid == Guid.Empty)
        {
            throw new ArgumentException("financiadorPlanPacienteId invalido.");
        }

        turnosRepository.FinalizarVigenciaFinanciadorPaciente(pacienteGuid, financiadorPlanGuid);
    }

    public async Task<AsignarTurnoResponse> AsignarTurno(AsignarTurnoRequest request)
    {
        var slotContext = SlotContextById.TryGetValue(request.SlotId, out var ctx) ? ctx : null;
        if (slotContext is null)
        {
            throw new ArgumentException("El slot indicado no es valido o expiro. Vuelva a consultar disponibilidad.");
        }
        var centro = ResolveCentroNombre(request.Centro, slotContext);
        var servicio = ResolveServicioNombre(request.Servicio, slotContext);
        var profesional = ResolveProfesionalNombre(request.Profesional, slotContext);
        var fechaHoraTurno = ResolveFechaHoraTurno(request.Fecha, request.Hora, slotContext);

        var fechaTurno = DateOnly.FromDateTime(fechaHoraTurno.DateTime);
        if (turnosRepository.ExisteTurnoActivoDuplicado(request.PacienteId, servicio, fechaTurno))
        {
            throw new InvalidOperationException("El paciente ya posee un turno activo en el mismo servicio y fecha.");
        }

        RegisterTurnoAgendado(request.PacienteId, request.SlotId, null, centro, servicio, profesional, fechaHoraTurno,
            slotContext.CentroId, slotContext.ServicioId, slotContext.EfectorId, slotContext.BloqueId, slotContext.DuracionTurnoMinutos);

        NotificacionTurnoEmailResponse? notificacion = null;
        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var fecha = request.Fecha ?? DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));
            var hora = string.IsNullOrWhiteSpace(request.Hora) ? "08:00" : request.Hora.Trim();
            var asunto = $"Turno asignado - {servicio} - {fecha:dd/MM/yyyy} {hora}";
            var cuerpo = $"<p>Se le ha asignado un turno en <strong>{centro}</strong>.</p>" +
                         $"<p>Servicio: {servicio}</p>" +
                         $"<p>Profesional: {profesional}</p>" +
                         $"<p>Fecha: {fecha:dd/MM/yyyy} a las {hora}</p>" +
                         $"<p>Por favor, presente este comprobante el d\u00eda del turno.</p>";

            await emailService.SendEmailAsync(request.Email.Trim(), asunto, cuerpo);

            notificacion = new NotificacionTurnoEmailResponse(
                request.Email.Trim(),
                asunto,
                "Se envio comprobante de turno al paciente.",
                centro
            );
        }

        return new AsignarTurnoResponse(
            true,
            $"turno-{request.SlotId}",
            null,
            "Se asigno un turno en la especialidad seleccionada.",
            notificacion
        );
    }

    public AsignarSobreturnoResponse AsignarSobreturno(AsignarSobreturnoRequest request)
    {
        if (!TimeOnly.TryParse(request.Hora, out var hora))
        {
            throw new ArgumentException("La hora enviada no es valida.");
        }

        var horaInicio = new TimeOnly(8, 0);
        var horaFin = new TimeOnly(12, 0);
        if (hora < horaInicio || hora > horaFin)
        {
            throw new ArgumentException("La hora no es valida dentro del rango horario.");
        }

        if (!SlotContextById.TryGetValue(request.SlotId, out var slotContext) || !slotContext.EsSobreturno)
        {
            throw new ArgumentException("El slot de sobreturno no es valido.");
        }

        var centro = slotContext.Centro;
        var fechaHoraTurno = ResolveFechaHoraTurno(request.Fecha, request.Hora, slotContext);
        var fechaTurno = DateOnly.FromDateTime(fechaHoraTurno.DateTime);

        if (turnosRepository.ExisteTurnoActivoDuplicado(request.PacienteId, slotContext.Servicio, fechaTurno))
        {
            throw new InvalidOperationException("El paciente ya posee un turno activo en el mismo servicio y fecha.");
        }

        var stKey = slotContext.StKey;
        var restantes = turnosRepository.DecrementarSobreturno(stKey);
        if (restantes < 0)
        {
            throw new InvalidOperationException("No hay cupo de sobreturno disponible.");
        }

        RegisterTurnoAgendado(request.PacienteId, request.SlotId, "Sobreturno asignado", centro, slotContext.Servicio, slotContext.Profesional, fechaHoraTurno,
            slotContext.CentroId, slotContext.ServicioId, slotContext.EfectorId, slotContext.BloqueId, slotContext.DuracionTurnoMinutos);

        return new AsignarSobreturnoResponse(
            true,
            $"sobreturno-{request.SlotId}",
            request.SlotId,
            "Se asigno un sobreturno correctamente."
        );
    }

    private void RegisterTurnoAgendado(
        string pacienteId,
        string slotId,
        string? motivo,
        string centro,
        string servicio,
        string profesional,
        DateTimeOffset fechaHoraTurno,
        Guid centroId = default,
        Guid servicioId = default,
        Guid efectorId = default,
        Guid bloqueId = default,
        int duracionTurnoMinutos = 30)
    {
        // turnos.id admite varchar(100); usar GUID compacto evita overflow con slotIds largos.
        var turnoId = Guid.NewGuid().ToString("N");
        var duracion = duracionTurnoMinutos > 0 ? duracionTurnoMinutos : 30;
        var cupoId = turnosRepository.TryReservarCupo(bloqueId, fechaHoraTurno, fechaHoraTurno.AddMinutes(duracion));
        if (cupoId is null)
        {
            throw new InvalidOperationException("El cupo seleccionado ya no se encuentra disponible. Por favor, vuelva a consultar disponibilidad.");
        }
        
        // Insertar en sch_turno.turno_paciente
        turnosRepository.InsertTurno(new TurnoPacienteRow(
            turnoId,
            pacienteId,
            profesional,
            servicio,
            centro,
            fechaHoraTurno,
            EstadoAgendado,
            motivo,
            centroId,
            servicioId,
            efectorId,
            cupoId!.Value));

        // También insertar en sch_admision.turno_admision para que la cancelación funcione
        admisionRepository.UpsertTurnoAdmision(new TurnoAdmisionRow(
            turnoId,
            pacienteId,
            null,  // PacienteNombre: se obtiene después en admision
            null,  // Documento: se obtiene después en admision
            null,  // Financiador: se obtiene después en admision
            "PROGRAMADO",  // Estado inicial
            EstadoAgendado,  // EstadoTurno
            motivo,
            null  // LlegadaEn: se establece cuando llega
        ));
    }

    private static DateTimeOffset ResolveFechaHoraTurno(DateOnly? fecha, string? hora, SlotContext? slotContext)
    {
        var fechaTurno = fecha ?? slotContext?.Fecha ?? DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var horaTexto = !string.IsNullOrWhiteSpace(hora) ? hora.Trim() : slotContext?.Hora ?? "08:00";

        if (!TimeOnly.TryParse(horaTexto, out var horaTurno))
        {
            horaTurno = new TimeOnly(8, 0);
        }

        var fechaHoraUtc = fechaTurno.ToDateTime(horaTurno, DateTimeKind.Utc);
        return new DateTimeOffset(fechaHoraUtc);
    }

    private static string BuildSlotOcupadoKey(DateOnly fecha, string hora, string centro, string servicio, string profesional)
    {
        return string.Join(
            "|",
            fecha.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            (hora ?? string.Empty).Trim(),
            NormalizeSlotText(centro),
            NormalizeSlotText(servicio),
            NormalizeSlotText(profesional));
    }

    private static string NormalizeSlotText(string value)
    {
        return (value ?? string.Empty).Trim().ToUpperInvariant();
    }

    private static string ResolveCentroNombre(string? centro, SlotContext? slotContext)
    {
        if (!string.IsNullOrWhiteSpace(centro))
        {
            return centro.Trim();
        }

        return slotContext?.Centro ?? "Centro a definir";
    }

    private static string ResolveServicioNombre(string? servicio, SlotContext? slotContext)
    {
        if (!string.IsNullOrWhiteSpace(servicio))
        {
            return servicio.Trim();
        }

        return slotContext?.Servicio ?? "Servicio a definir";
    }

    private static string ResolveProfesionalNombre(string? profesional, SlotContext? slotContext)
    {
        if (!string.IsNullOrWhiteSpace(profesional))
        {
            return profesional.Trim();
        }

        return slotContext?.Profesional ?? "Profesional a definir";
    }

    private static string BuildPracticaId(string servicioId, string practicaNombre)
    {
        var servicioIdNormalizado = servicioId.Trim().ToLowerInvariant();
        var normalized = new string(practicaNombre
            .Trim()
            .ToLowerInvariant()
            .Select(ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray())
            .Trim('-');

        var compact = string.Join('-', normalized
            .Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));

        return $"prac-{servicioIdNormalizado}-{compact}";
    }

    private IReadOnlyList<AgendaAggregate> GetAgendasElegiblesConBloques()
    {
        var result = new List<AgendaAggregate>();

        foreach (var resumen in agendaRepository.GetAll())
        {
            if (!resumen.VisibleContactCenter || !resumen.Activa)
            {
                continue;
            }

            var agenda = agendaRepository.GetById(resumen.Id);
            if (agenda is null || !agenda.Activa || !agenda.VisibleContactCenter)
            {
                continue;
            }

            if (!agenda.Bloques.Any(EsBloqueElegible))
            {
                continue;
            }

            result.Add(agenda);
        }

        return result;
    }

    private static bool EsBloqueElegible(BloqueProgramacion bloque)
    {
        return bloque.Activo
            && bloque.HoraInicio < bloque.HoraFin
            && bloque.IntervaloMinutos > 0
            && bloque.Practicas.Any(item => !string.IsNullOrWhiteSpace(item.Nombre));
    }

    private static IReadOnlyList<DateOnly> ObtenerFechasDisponibles(BloqueProgramacion bloque, AgendaAggregate agenda, DateOnly hoy)
    {
        var desde = MaxDate(hoy, MaxDate(agenda.FechaDesde, bloque.FechaDesde == default ? bloque.Fecha : bloque.FechaDesde));
        var hastaAgenda = agenda.FechaHasta ?? DateOnly.MaxValue;
        var hastaBloque = bloque.FechaHasta == default ? bloque.Fecha : bloque.FechaHasta;
        var hasta = MinDate(hastaAgenda, hastaBloque);

        if (hasta < desde)
        {
            return [];
        }

        var diasPermitidos = new HashSet<string>(
            bloque.Dias.Select(item => item.Trim().ToUpperInvariant()).Where(item => item.Length > 0),
            StringComparer.OrdinalIgnoreCase);

        var fechas = new List<DateOnly>();

        for (var fecha = desde; fecha <= hasta; fecha = fecha.AddDays(1))
        {
            if (diasPermitidos.Count == 0)
            {
                fechas.Add(fecha);
                continue;
            }

            if (diasPermitidos.Contains(CodigoDiaSemana(fecha.DayOfWeek)))
            {
                fechas.Add(fecha);
            }
        }

        return fechas;
    }

    private static DateOnly MaxDate(DateOnly a, DateOnly b) => a > b ? a : b;

    private static DateOnly MinDate(DateOnly a, DateOnly b) => a < b ? a : b;

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

    private static string BuildStKey(Guid agendaId, Guid bloqueId, DateOnly fecha) => $"{agendaId:N}:{bloqueId:N}:{fecha:yyyyMMdd}";

    private sealed record PracticaBuilder(string Id, string Nombre, string ServicioId)
    {
        public HashSet<string> CentroIds { get; } = new(StringComparer.OrdinalIgnoreCase);
        public HashSet<string> ProfesionalIds { get; } = new(StringComparer.OrdinalIgnoreCase);
    }

    private sealed record ProfesionalBuilder(string Id, string Nombre)
    {
        public HashSet<string> CentroIds { get; } = new(StringComparer.OrdinalIgnoreCase);
        public HashSet<string> ServicioIds { get; } = new(StringComparer.OrdinalIgnoreCase);
        public HashSet<string> PracticaIds { get; } = new(StringComparer.OrdinalIgnoreCase);
    }

    private sealed record SlotContext(
        string SlotId,
        string Centro,
        string Servicio,
        string Practica,
        string Profesional,
        DateOnly Fecha,
        string Hora,
        string RangoHoraInicio,
        string RangoHoraFin,
        bool EsSobreturno,
        string StKey,
        Guid CentroId = default,
        Guid ServicioId = default,
        Guid EfectorId = default,
        Guid BloqueId = default,
        int DuracionTurnoMinutos = 30);
}
