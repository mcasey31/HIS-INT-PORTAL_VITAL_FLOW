using VitalFlow.His.Api.Domain.Agenda;

namespace VitalFlow.His.Api.Infrastructure.Agenda;

public sealed class InMemoryAgendaRepository : IAgendaRepository
{
    private readonly Dictionary<Guid, AgendaAggregate> _store = new();
    private readonly Dictionary<Guid, GrupoProfesionalAggregate> _gruposStore = new();
    private readonly List<CentroAgenda> _centros = [];
    private readonly List<ServicioAgenda> _servicios = [];
    private readonly List<EfectorAgenda> _efectores = [];
    private readonly List<LugarAtencionAgenda> _lugares = [];
    private readonly List<AgendaSlot> _slots = [];
    private readonly Dictionary<string, FhirAppointmentRecord> _appointmentsByIdempotency = new(StringComparer.OrdinalIgnoreCase);
    private readonly Dictionary<string, FhirAppointmentRecord> _appointmentsById = new(StringComparer.OrdinalIgnoreCase);

    public InMemoryAgendaRepository()
    {
        var centroId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var servicioId = Guid.Parse("00000000-0000-0000-0000-000000000101");
        var efectorId = Guid.Parse("00000000-0000-0000-0000-000000000201");
        var lugarId = Guid.Parse("00000000-0000-0000-0000-000000000301");

        _centros.Add(new CentroAgenda(centroId, "Centro Ambulatorio Central"));
        _servicios.Add(new ServicioAgenda(servicioId, centroId, "Clinica Medica"));
        _efectores.Add(new EfectorAgenda(efectorId, centroId, servicioId, "PROFESIONAL", "Diaz, Ana - MP123"));
        _lugares.Add(new LugarAtencionAgenda(lugarId, "Consultorio 3"));

        var seedId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        _store[seedId] = new AgendaAggregate
        {
            Id = seedId,
            Codigo = "AG-BASE",
            Nombre = "Agenda Base Ambulatoria",
            CentroId = centroId,
            CentroNombre = "Centro Ambulatorio Central",
            ServicioId = servicioId,
            ServicioNombre = "Clinica Medica",
            TipoEfector = "PROFESIONAL",
            EfectorId = efectorId,
            EfectorNombre = "Diaz, Ana - MP123",
            TipoAgenda = "PROGRAMADA",
            VisibleContactCenter = true,
            Activa = true,
            FechaDesde = DateOnly.FromDateTime(DateTime.UtcNow.Date)
        };

        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        _slots.Add(new AgendaSlot(
            Guid.Parse("22222222-2222-2222-2222-222222222221"),
            seedId,
            new DateTimeOffset(today.ToDateTime(new TimeOnly(8, 0), DateTimeKind.Unspecified), TimeSpan.FromHours(-3)),
            new DateTimeOffset(today.ToDateTime(new TimeOnly(8, 30), DateTimeKind.Unspecified), TimeSpan.FromHours(-3)),
            "libre",
            1,
            false,
            lugarId,
            "Consultorio 3",
            "Agenda Base Ambulatoria"
        ));
    }

    public IReadOnlyList<AgendaAggregate> GetAll() => _store.Values.ToList();

    public AgendaAggregate? GetById(Guid agendaId)
    {
        _store.TryGetValue(agendaId, out var agenda);
        return agenda;
    }

    public bool ExistsByCodigo(string codigo, Guid? excludingAgendaId)
    {
        return _store.Values.Any(a =>
            string.Equals(a.Codigo, codigo, StringComparison.OrdinalIgnoreCase)
            && (!excludingAgendaId.HasValue || a.Id != excludingAgendaId.Value));
    }

    public bool ExistsByNombre(string nombre, Guid? excludingAgendaId)
    {
        return _store.Values.Any(a =>
            string.Equals(a.Nombre, nombre, StringComparison.OrdinalIgnoreCase)
            && (!excludingAgendaId.HasValue || a.Id != excludingAgendaId.Value));
    }

    public IReadOnlyList<CentroAgenda> GetCentros() => _centros;

    public IReadOnlyList<ServicioAgenda> GetServiciosByCentro(Guid centroId)
    {
        return _servicios.Where(s => s.CentroId == centroId).ToList();
    }

    public IReadOnlyList<EfectorAgenda> GetEfectores(Guid centroId, Guid servicioId, string tipoEfector, string? query)
    {
        var effectors = _efectores.Where(e =>
            e.CentroId == centroId
            && e.ServicioId == servicioId
            && string.Equals(e.TipoEfector, tipoEfector, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim();
            effectors = effectors.Where(e => e.Nombre.Contains(q, StringComparison.OrdinalIgnoreCase));
        }

        return effectors.ToList();
    }

    public IReadOnlyList<Guid> GetEfectorIdsByUsuario(Guid userId)
    {
        return [];
    }

    public AgendaSlotSearchResult SearchSlots(Guid scheduleId, string? status, DateTimeOffset? startFrom, DateTimeOffset? startTo, int count, int page)
    {
        var query = _slots.Where(s => s.ScheduleId == scheduleId);

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = status.Trim().ToLowerInvariant() switch
            {
                "free" => query.Where(s => s.Estado.Equals("libre", StringComparison.OrdinalIgnoreCase)),
                "busy" => query.Where(s => s.Estado.Equals("reservado", StringComparison.OrdinalIgnoreCase) || s.Estado.Equals("ocupado", StringComparison.OrdinalIgnoreCase)),
                "busy-unavailable" => query.Where(s => s.Estado.Equals("bloqueado", StringComparison.OrdinalIgnoreCase)),
                _ => query
            };
        }

        if (startFrom.HasValue)
        {
            query = query.Where(s => s.Start >= startFrom.Value);
        }

        if (startTo.HasValue)
        {
            query = query.Where(s => s.Start < startTo.Value);
        }

        var filtered = query.OrderBy(s => s.Start).ToList();
        var total = filtered.Count;
        var offset = (Math.Max(page, 1) - 1) * Math.Max(count, 1);
        var paged = filtered.Skip(offset).Take(Math.Max(count, 1)).ToList();
        return new AgendaSlotSearchResult(total, paged);
    }

    public AgendaLocationSearchResult SearchLocations(string? name, bool? active, int count, int page)
    {
        var query = _lugares.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var filter = name.Trim();
            query = query.Where(l => l.Nombre.Contains(filter, StringComparison.OrdinalIgnoreCase));
        }

        if (active.HasValue)
        {
            // In-memory seed has all locations active.
            query = active.Value ? query : Enumerable.Empty<LugarAtencionAgenda>();
        }

        var mapped = query
            .Select(l => new AgendaLocation(l.Id, l.Nombre, true))
            .OrderBy(l => l.Nombre)
            .ToList();

        var total = mapped.Count;
        var offset = (Math.Max(page, 1) - 1) * Math.Max(count, 1);
        var paged = mapped.Skip(offset).Take(Math.Max(count, 1)).ToList();
        return new AgendaLocationSearchResult(total, paged);
    }

    public FhirAppointmentSearchResult SearchFhirAppointments(string? patientId, string? status, DateTimeOffset? dateFrom, DateTimeOffset? dateTo, int count, int page)
    {
        var query = _appointmentsById.Values.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(patientId))
        {
            var patientFilter = patientId.Trim();
            query = query.Where(a => string.Equals(a.PatientId, patientFilter, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var statusFilter = status.Trim();
            query = query.Where(a => string.Equals(a.Status, statusFilter, StringComparison.OrdinalIgnoreCase));
        }

        if (dateFrom.HasValue)
        {
            query = query.Where(a => a.Start >= dateFrom.Value);
        }

        if (dateTo.HasValue)
        {
            query = query.Where(a => a.Start < dateTo.Value);
        }

        var items = query.OrderByDescending(a => a.Start).ToList();
        var total = items.Count;
        var offset = (Math.Max(page, 1) - 1) * Math.Max(count, 1);
        var paged = items.Skip(offset).Take(Math.Max(count, 1)).ToList();
        return new FhirAppointmentSearchResult(total, paged);
    }

    public FhirAppointmentCreateResult CreateFhirAppointment(FhirAppointmentCreateInput input)
    {
        if (_appointmentsByIdempotency.TryGetValue(input.IdempotencyKey, out var existing))
        {
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.IdempotentReplay, existing, null);
        }

        var slot = _slots.FirstOrDefault(s => s.Id == input.SlotId);
        if (slot is null)
        {
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.SlotNotFound, null, "Slot no existe.");
        }

        if (!slot.Estado.Equals("libre", StringComparison.OrdinalIgnoreCase))
        {
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.SlotUnavailable, null, "Slot no disponible.");
        }

        var agenda = _store.Values.FirstOrDefault(a => a.Id == slot.ScheduleId);
        if (agenda is null)
        {
            return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.ValidationError, null, "No se encontro agenda para el slot.");
        }

        var appointment = new FhirAppointmentRecord(
            Guid.NewGuid().ToString("N"),
            input.PatientId,
            slot.Id,
            slot.ScheduleId,
            agenda.CentroId,
            agenda.ServicioId,
            agenda.EfectorId,
            slot.Start,
            slot.End,
            "booked",
            input.Reason,
            input.ExternalIdentifier
        );

        var index = _slots.FindIndex(s => s.Id == slot.Id);
        _slots[index] = slot with { Estado = "reservado" };
        _appointmentsByIdempotency[input.IdempotencyKey] = appointment;
        _appointmentsById[appointment.AppointmentId] = appointment;

        return new FhirAppointmentCreateResult(FhirAppointmentCreateStatus.Created, appointment, null);
    }

    public FhirAppointmentRecord? GetFhirAppointmentById(string appointmentId)
    {
        if (string.IsNullOrWhiteSpace(appointmentId))
        {
            return null;
        }

        _appointmentsById.TryGetValue(appointmentId.Trim(), out var appointment);
        return appointment;
    }

    public IReadOnlyList<PracticaData> GetPracticas(string? query)
    {
        var all = new List<PracticaData>
        {
            new(Guid.NewGuid(), "Consulta general", 15, null),
            new(Guid.NewGuid(), "Control clinico", 20, null),
        };

        if (string.IsNullOrWhiteSpace(query))
            return all;

        var q = query.Trim();
        return all.Where(p => p.Nombre.Contains(q, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    public IReadOnlyList<LugarAtencionAgenda> GetLugaresAtencion(string? query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return _lugares;
        }

        var q = query.Trim();
        return _lugares.Where(l => l.Nombre.Contains(q, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    public bool ExistsGrupoProfesionalByCodigo(string codigo, Guid? excludingGrupoId)
    {
        return _gruposStore.Values.Any(g =>
            string.Equals(g.Codigo, codigo, StringComparison.OrdinalIgnoreCase)
            && (!excludingGrupoId.HasValue || g.Id != excludingGrupoId.Value));
    }

    public bool ExistsGrupoProfesionalByNombre(Guid centroId, Guid servicioId, string nombre, Guid? excludingGrupoId)
    {
        return _gruposStore.Values.Any(g =>
            g.CentroId == centroId
            && g.ServicioId == servicioId
            && string.Equals(g.Nombre, nombre, StringComparison.OrdinalIgnoreCase)
            && (!excludingGrupoId.HasValue || g.Id != excludingGrupoId.Value));
    }

    public GrupoProfesionalAggregate AddGrupoProfesional(GrupoProfesionalAggregate grupo)
    {
        _gruposStore[grupo.Id] = grupo;
        return grupo;
    }

    public AgendaAggregate AddAgenda(AgendaAggregate agenda)
    {
        _store[agenda.Id] = agenda;
        return agenda;
    }

    public bool UpdateAgenda(AgendaAggregate agenda)
    {
        if (!_store.ContainsKey(agenda.Id))
        {
            return false;
        }

        _store[agenda.Id] = agenda;
        return true;
    }

    public bool AddBloque(Guid agendaId, BloqueProgramacion bloque)
    {
        if (!_store.TryGetValue(agendaId, out var agenda))
        {
            return false;
        }

        agenda.Bloques.Add(bloque);
        return true;
    }

    public bool UpdateBloque(Guid agendaId, BloqueProgramacion bloque)
    {
        if (!_store.TryGetValue(agendaId, out var agenda))
        {
            return false;
        }

        var current = agenda.Bloques.FirstOrDefault(b => b.Id == bloque.Id);
        if (current is null)
        {
            return false;
        }

        current.Fecha = bloque.Fecha;
        current.HoraInicio = bloque.HoraInicio;
        current.HoraFin = bloque.HoraFin;
        current.IntervaloMinutos = bloque.IntervaloMinutos;
        return true;
    }

    public bool UpdateBloquePracticas(Guid agendaId, Guid bloqueId, IReadOnlyList<BloquePractica> practicas)
    {
        if (!_store.TryGetValue(agendaId, out var agenda))
        {
            return false;
        }

        var current = agenda.Bloques.FirstOrDefault(b => b.Id == bloqueId);
        if (current is null)
        {
            return false;
        }

        current.Practicas.Clear();
        current.Practicas.AddRange(practicas);
        return true;
    }

    public bool AddBloqueo(Guid agendaId, BloqueoAgenda bloqueo)
    {
        if (!_store.TryGetValue(agendaId, out var agenda))
        {
            return false;
        }

        agenda.Bloqueos.Add(bloqueo);
        return true;
    }
}

