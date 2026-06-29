using VitalFlow.His.Api.Application.Agenda.Contracts;
using VitalFlow.His.Api.Domain.Agenda;
using VitalFlow.His.Api.Application.Turnos.Repositories;
using System.Globalization;
using System.Text.RegularExpressions;

namespace VitalFlow.His.Api.Application.Agenda.Services;

public sealed class AgendaService(IAgendaRepository repository, ITurnosRepository turnosRepository) : IAgendaService
{
    private static readonly string[] TiposEfector = ["PROFESIONAL", "GRUPO_PROFESIONALES", "DISPOSITIVO"];
    private static readonly string[] TiposAgenda = ["PROGRAMADA", "DEMANDA_ESPONTANEA"];
    private static readonly string[] FrecuenciasBloque = ["SEMANAL", "QUINCENAL", "ORDEN_MENSUAL"];
    private static readonly string[] DiasSemana = ["L", "M", "X", "J", "V", "S", "D"];
    private static readonly TimeZoneInfo BusinessTimeZone = ResolveBusinessTimeZone();
    private static readonly PracticaOptionResponse[] PracticasCatalogo =
    [
        new("Consulta general", 15),
        new("Control clinico", 20),
        new("Electrocardiograma", 25),
        new("Espirometria", 30),
        new("Curaciones", null)
    ];

    public IReadOnlyList<SelectorOptionResponse> GetCentros()
    {
        return repository.GetCentros().Select(c => new SelectorOptionResponse(c.Id, c.Nombre)).ToList();
    }

    public IReadOnlyList<SelectorOptionResponse> GetServicios(Guid centroId)
    {
        return repository.GetServiciosByCentro(centroId).Select(s => new SelectorOptionResponse(s.Id, s.Nombre)).ToList();
    }

    public IReadOnlyList<EfectorOptionResponse> GetEfectores(Guid centroId, Guid servicioId, string tipoEfector, string? query)
    {
        if (!TiposEfector.Contains(tipoEfector, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("TipoEfector invalido.");
        }

        return repository
            .GetEfectores(centroId, servicioId, tipoEfector.Trim(), query)
            .GroupBy(e => BuildEfectorDedupeKey(e.Nombre), StringComparer.OrdinalIgnoreCase)
            .Select(group => group
                .OrderByDescending(IsEfectorMasCompleto)
                .ThenByDescending(e => e.Nombre.Length)
                .ThenBy(e => e.Id)
                .First())
            .Select(e => new EfectorOptionResponse(e.Id, e.Nombre, e.TipoEfector))
            .ToList();
    }

    private static bool IsEfectorMasCompleto(EfectorAgenda efector)
    {
        return Regex.IsMatch(efector.Nombre, @"\b(?:MP|MN)[0-9A-Z]+\b", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
    }

    private static string BuildEfectorDedupeKey(string nombre)
    {
        var normalizado = Regex.Replace(
            nombre,
            @"\s*-\s*(?:MP|MN)[0-9A-Z]+(?:\s*/\s*(?:MP|MN)[0-9A-Z]+)*",
            string.Empty,
            RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

        normalizado = Regex.Replace(normalizado, @"[^\p{L}\p{Nd}]+", " ", RegexOptions.CultureInvariant);
        normalizado = Regex.Replace(normalizado, @"\s+", " ", RegexOptions.CultureInvariant);

        return normalizado.Trim().ToUpperInvariant();
    }

    public IReadOnlyList<SelectorOptionResponse> GetLugaresAtencion(string? query)
    {
        return repository.GetLugaresAtencion(query).Select(l => new SelectorOptionResponse(l.Id, l.Nombre)).ToList();
    }

    public IReadOnlyList<DiaSemanaOptionResponse> GetDiasSemana()
    {
        return DiasSemana.Select(d => new DiaSemanaOptionResponse(d, d)).ToList();
    }

    public IReadOnlyList<PracticaOptionResponse> GetPracticas(string? query)
    {
        var practicas = PracticasCatalogo.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim();
            practicas = practicas.Where(p => p.Nombre.Contains(q, StringComparison.OrdinalIgnoreCase));
        }

        return practicas.ToList();
    }

    public IReadOnlyList<string> GetFrecuenciasBloque() => FrecuenciasBloque;

    public IReadOnlyList<string> GetTiposEfector() => TiposEfector;

    public IReadOnlyList<string> GetTiposAgenda() => TiposAgenda;

    public GrupoProfesionalResponse CreateGrupoProfesional(CreateGrupoProfesionalRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Codigo) || string.IsNullOrWhiteSpace(request.Nombre))
        {
            throw new ArgumentException("Codigo y nombre de grupo son obligatorios.");
        }

        if (request.CentroId == Guid.Empty || request.ServicioId == Guid.Empty)
        {
            throw new ArgumentException("Centro y servicio son obligatorios para el grupo.");
        }

        if (request.Miembros is null || request.Miembros.Count == 0)
        {
            throw new ArgumentException("Debe seleccionar al menos un profesional para el grupo.");
        }

        var codigo = request.Codigo.Trim();
        var nombre = request.Nombre.Trim();
        if (codigo.Length > 40 || nombre.Length > 140)
        {
            throw new ArgumentException("Codigo o nombre de grupo excede longitud permitida.");
        }

        if (!string.IsNullOrWhiteSpace(request.Descripcion) && request.Descripcion.Trim().Length > 300)
        {
            throw new ArgumentException("Descripcion de grupo excede longitud permitida.");
        }

        if (repository.ExistsGrupoProfesionalByCodigo(codigo, null))
        {
            throw new ArgumentException("Ya existe un grupo de profesionales con el mismo codigo.");
        }

        if (repository.ExistsGrupoProfesionalByNombre(request.CentroId, request.ServicioId, nombre, null))
        {
            throw new ArgumentException("Ya existe un grupo de profesionales con el mismo nombre para el centro/servicio.");
        }

        var centro = repository.GetCentros().FirstOrDefault(c => c.Id == request.CentroId)
            ?? throw new ArgumentException("Centro invalido.");

        var servicio = repository.GetServiciosByCentro(request.CentroId).FirstOrDefault(s => s.Id == request.ServicioId)
            ?? throw new ArgumentException("Servicio invalido para el centro seleccionado.");

        var profesionalesDisponibles = repository.GetEfectores(request.CentroId, request.ServicioId, "PROFESIONAL", null);
        var profesionalesById = profesionalesDisponibles.ToDictionary(e => e.Id, e => e, EqualityComparer<Guid>.Default);

        var idsMiembros = request.Miembros.Select(m => m.EfectorId).ToList();
        if (idsMiembros.Any(id => id == Guid.Empty))
        {
            throw new ArgumentException("Profesional invalido en miembros del grupo.");
        }

        if (idsMiembros.Distinct().Count() != idsMiembros.Count)
        {
            throw new ArgumentException("No se permiten profesionales repetidos dentro del grupo.");
        }

        foreach (var efectorId in idsMiembros)
        {
            if (!profesionalesById.ContainsKey(efectorId))
            {
                throw new ArgumentException("Todos los miembros del grupo deben ser profesionales del centro/servicio seleccionado.");
            }
        }

        var grupo = new GrupoProfesionalAggregate
        {
            Id = Guid.NewGuid(),
            CentroId = request.CentroId,
            CentroNombre = centro.Nombre,
            ServicioId = request.ServicioId,
            ServicioNombre = servicio.Nombre,
            Codigo = codigo,
            Nombre = nombre,
            Descripcion = request.Descripcion?.Trim(),
            Activo = true
        };

        foreach (var miembro in request.Miembros)
        {
            var efector = profesionalesById[miembro.EfectorId];
            grupo.Miembros.Add(new GrupoProfesionalMiembro
            {
                Id = Guid.NewGuid(),
                EfectorId = miembro.EfectorId,
                EfectorNombre = efector.Nombre,
                Rol = string.IsNullOrWhiteSpace(miembro.Rol) ? null : miembro.Rol.Trim(),
                Orden = miembro.Orden,
                Activo = true
            });
        }

        repository.AddGrupoProfesional(grupo);

        return MapGrupo(grupo);
    }

    public IReadOnlyList<GrupoProfesionalResponse> GetGruposProfesionales(Guid? centroId, Guid? servicioId)
    {
        return repository.GetGruposProfesionales(centroId, servicioId)
            .Select(MapGrupo)
            .ToList();
    }

    public GrupoProfesionalResponse? GetGrupoProfesionalById(Guid id)
    {
        var grupo = repository.GetGrupoProfesionalById(id);
        return grupo is null ? null : MapGrupo(grupo);
    }

    public GrupoProfesionalResponse? UpdateGrupoProfesional(Guid id, CreateGrupoProfesionalRequest request)
    {
        var existing = repository.GetGrupoProfesionalById(id);
        if (existing is null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(request.Codigo) || string.IsNullOrWhiteSpace(request.Nombre))
        {
            throw new ArgumentException("Codigo y nombre de grupo son obligatorios.");
        }

        var codigo = request.Codigo.Trim();
        var nombre = request.Nombre.Trim();
        if (codigo.Length > 40 || nombre.Length > 140)
        {
            throw new ArgumentException("Codigo o nombre de grupo excede longitud permitida.");
        }

        if (repository.ExistsGrupoProfesionalByCodigo(codigo, id))
        {
            throw new ArgumentException("Ya existe un grupo de profesionales con el mismo codigo.");
        }

        if (repository.ExistsGrupoProfesionalByNombre(request.CentroId, request.ServicioId, nombre, id))
        {
            throw new ArgumentException("Ya existe un grupo de profesionales con el mismo nombre para el centro/servicio.");
        }

        var centro = repository.GetCentros().FirstOrDefault(c => c.Id == request.CentroId)
            ?? throw new ArgumentException("Centro invalido.");

        var servicio = repository.GetServiciosByCentro(request.CentroId).FirstOrDefault(s => s.Id == request.ServicioId)
            ?? throw new ArgumentException("Servicio invalido para el centro seleccionado.");

        var profesionalesDisponibles = repository.GetEfectores(request.CentroId, request.ServicioId, "PROFESIONAL", null);
        var profesionalesById = profesionalesDisponibles.ToDictionary(e => e.Id, e => e, EqualityComparer<Guid>.Default);

        var idsMiembros = request.Miembros?.Select(m => m.EfectorId).ToList() ?? [];
        if (idsMiembros.Count == 0)
        {
            throw new ArgumentException("Debe seleccionar al menos un profesional para el grupo.");
        }

        if (idsMiembros.Any(id => id == Guid.Empty))
        {
            throw new ArgumentException("Profesional invalido en miembros del grupo.");
        }

        if (idsMiembros.Distinct().Count() != idsMiembros.Count)
        {
            throw new ArgumentException("No se permiten profesionales repetidos dentro del grupo.");
        }

        foreach (var efectorId in idsMiembros)
        {
            if (!profesionalesById.ContainsKey(efectorId))
            {
                throw new ArgumentException("Todos los miembros del grupo deben ser profesionales del centro/servicio seleccionado.");
            }
        }

        existing.Codigo = codigo;
        existing.Nombre = nombre;
        existing.CentroId = request.CentroId;
        existing.CentroNombre = centro.Nombre;
        existing.ServicioId = request.ServicioId;
        existing.ServicioNombre = servicio.Nombre;
        existing.Descripcion = request.Descripcion?.Trim();
        existing.Miembros.Clear();

        foreach (var miembro in request.Miembros!)
        {
            var efector = profesionalesById[miembro.EfectorId];
            existing.Miembros.Add(new GrupoProfesionalMiembro
            {
                Id = Guid.NewGuid(),
                EfectorId = miembro.EfectorId,
                EfectorNombre = efector.Nombre,
                Rol = string.IsNullOrWhiteSpace(miembro.Rol) ? null : miembro.Rol.Trim(),
                Orden = miembro.Orden,
                Activo = true
            });
        }

        return repository.UpdateGrupoProfesional(existing) ? MapGrupo(existing) : null;
    }

    public bool DeleteGrupoProfesional(Guid id)
    {
        return repository.DeleteGrupoProfesional(id);
    }

    private static GrupoProfesionalResponse MapGrupo(GrupoProfesionalAggregate grupo)
    {
        return new GrupoProfesionalResponse(
            grupo.Id,
            grupo.Codigo,
            grupo.Nombre,
            grupo.CentroId,
            grupo.CentroNombre,
            grupo.ServicioId,
            grupo.ServicioNombre,
            grupo.Descripcion,
            grupo.Activo,
            grupo.Miembros
                .Select(m => new GrupoProfesionalMiembroResponse(
                    m.Id,
                    m.EfectorId,
                    m.EfectorNombre,
                    m.Rol,
                    m.Orden,
                    m.Activo))
                .ToList()
        );
    }

    public IReadOnlyList<AgendaSummaryResponse> GetAgendas(string? query, bool? activa)
    {
        var agendas = repository.GetAll().AsEnumerable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim();
            agendas = agendas.Where(a =>
                a.Codigo.Contains(q, StringComparison.OrdinalIgnoreCase)
                || a.Nombre.Contains(q, StringComparison.OrdinalIgnoreCase));
        }

        if (activa.HasValue)
        {
            agendas = agendas.Where(a => a.Activa == activa.Value);
        }

        return agendas.Select(MapSummary).ToList();
    }

    public AgendaDetailResponse? GetAgendaById(Guid agendaId)
    {
        var agenda = repository.GetById(agendaId);
        if (agenda is null)
        {
            return null;
        }

        return new AgendaDetailResponse(
            agenda.Id,
            agenda.Codigo,
            agenda.Nombre,
            agenda.CentroId,
            agenda.CentroNombre,
            agenda.ServicioId,
            agenda.ServicioNombre,
            agenda.TipoEfector,
            agenda.EfectorId,
            agenda.EfectorNombre,
            agenda.TipoAgenda,
            agenda.VisibleContactCenter,
            agenda.Activa,
            agenda.FechaDesde,
            agenda.FechaHasta,
            agenda.Observacion,
            agenda.Bloques.Select(b => new BloqueResponse(
                b.Id,
                b.Nombre,
                b.TipoBloque,
                b.FechaDesde,
                b.FechaHasta,
                b.AtiendeFeriados,
                b.Dias,
                b.Fecha,
                b.HoraInicio,
                b.HoraFin,
                b.DuracionTurnoMinutos,
                b.IntervaloMinutos,
                b.LugarAtencionId,
                b.LugarAtencionNombre,
                b.Frecuencia,
                b.OrdenMensualSemanas,
                b.Practicas.Select(p => new BloquePracticaResponse(p.Nombre, p.DuracionMinutos)).ToList(),
                b.Sobreturnos,
                b.Activo)).ToList(),
            agenda.Bloqueos.Select(b => new BloqueoResponse(b.Id, b.Inicio, b.Fin, b.Tipo)).ToList()
        );
    }

    public AgendaSummaryResponse CreateAgenda(CreateAgendaRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nombre))
        {
            throw new ArgumentException("Nombre es obligatorio.");
        }

        if (request.CentroId == Guid.Empty || request.ServicioId == Guid.Empty || request.EfectorId == Guid.Empty)
        {
            throw new ArgumentException("Centro, servicio y efector son obligatorios.");
        }

        if (string.IsNullOrWhiteSpace(request.TipoEfector) || !TiposEfector.Contains(request.TipoEfector.Trim(), StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("TipoEfector invalido.");
        }

        if (string.IsNullOrWhiteSpace(request.TipoAgenda) || !TiposAgenda.Contains(request.TipoAgenda.Trim(), StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("TipoAgenda invalido.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        if (request.FechaDesde < today)
        {
            throw new ArgumentException("FechaDesde no puede ser menor al dia de hoy.");
        }

        if (request.FechaHasta.HasValue && request.FechaHasta.Value < request.FechaDesde)
        {
            throw new ArgumentException("FechaHasta no puede ser menor que FechaDesde.");
        }

        var codigo = GenerateAgendaCodigo();

        if (repository.ExistsByNombre(request.Nombre.Trim(), null))
        {
            throw new ArgumentException("Ya existe una agenda con el mismo nombre.");
        }

        var centro = repository.GetCentros().FirstOrDefault(c => c.Id == request.CentroId)
            ?? throw new ArgumentException("Centro invalido.");

        var servicio = repository.GetServiciosByCentro(request.CentroId).FirstOrDefault(s => s.Id == request.ServicioId)
            ?? throw new ArgumentException("Servicio invalido para el centro seleccionado.");

        var efector = repository.GetEfectores(request.CentroId, request.ServicioId, request.TipoEfector.Trim(), null)
            .FirstOrDefault(e => e.Id == request.EfectorId)
            ?? throw new ArgumentException("Efector invalido para el centro/servicio/tipo efector seleccionado.");

        var agenda = new AgendaAggregate
        {
            Id = Guid.NewGuid(),
            Codigo = codigo,
            Nombre = request.Nombre.Trim(),
            CentroId = request.CentroId,
            CentroNombre = centro.Nombre,
            ServicioId = request.ServicioId,
            ServicioNombre = servicio.Nombre,
            TipoEfector = request.TipoEfector.Trim().ToUpperInvariant(),
            EfectorId = request.EfectorId,
            EfectorNombre = efector.Nombre,
            TipoAgenda = request.TipoAgenda.Trim().ToUpperInvariant(),
            VisibleContactCenter = request.VisibleContactCenter,
            Activa = false,
            FechaDesde = request.FechaDesde,
            FechaHasta = request.FechaHasta,
            Observacion = request.Observacion?.Trim()
        };

        repository.AddAgenda(agenda);
        return MapSummary(agenda);
    }

    private string GenerateAgendaCodigo()
    {
        var seed = DateTime.UtcNow;
        var prefix = $"AGD-{seed:yyyyMMdd}";

        for (var seq = 1; seq <= 9999; seq++)
        {
            var candidate = $"{prefix}-{seq:0000}";
            if (!repository.ExistsByCodigo(candidate, null))
            {
                return candidate;
            }
        }

        throw new InvalidOperationException("No se pudo generar un codigo interno unico para la agenda.");
    }

    public AgendaSummaryResponse? UpdateAgenda(Guid agendaId, UpdateAgendaRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Codigo) || string.IsNullOrWhiteSpace(request.Nombre))
        {
            throw new ArgumentException("Codigo y nombre son obligatorios.");
        }

        if (request.CentroId == Guid.Empty || request.ServicioId == Guid.Empty || request.EfectorId == Guid.Empty)
        {
            throw new ArgumentException("Centro, servicio y efector son obligatorios.");
        }

        if (string.IsNullOrWhiteSpace(request.TipoEfector) || !TiposEfector.Contains(request.TipoEfector.Trim(), StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("TipoEfector invalido.");
        }

        if (string.IsNullOrWhiteSpace(request.TipoAgenda) || !TiposAgenda.Contains(request.TipoAgenda.Trim(), StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("TipoAgenda invalido.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        if (request.FechaDesde < today)
        {
            throw new ArgumentException("FechaDesde no puede ser menor al dia de hoy.");
        }

        if (request.FechaHasta.HasValue && request.FechaHasta.Value < request.FechaDesde)
        {
            throw new ArgumentException("FechaHasta no puede ser menor que FechaDesde.");
        }

        var agenda = repository.GetById(agendaId);
        if (agenda is null)
        {
            return null;
        }

        var codigo = request.Codigo.Trim();
        if (repository.ExistsByCodigo(codigo, agendaId))
        {
            throw new ArgumentException("Ya existe una agenda con el mismo codigo.");
        }

        if (repository.ExistsByNombre(request.Nombre.Trim(), agendaId))
        {
            throw new ArgumentException("Ya existe una agenda con el mismo nombre.");
        }

        var centro = repository.GetCentros().FirstOrDefault(c => c.Id == request.CentroId)
            ?? throw new ArgumentException("Centro invalido.");

        var servicio = repository.GetServiciosByCentro(request.CentroId).FirstOrDefault(s => s.Id == request.ServicioId)
            ?? throw new ArgumentException("Servicio invalido para el centro seleccionado.");

        var efector = repository.GetEfectores(request.CentroId, request.ServicioId, request.TipoEfector.Trim(), null)
            .FirstOrDefault(e => e.Id == request.EfectorId)
            ?? throw new ArgumentException("Efector invalido para el centro/servicio/tipo efector seleccionado.");

        agenda.Codigo = codigo;
        agenda.Nombre = request.Nombre.Trim();
        agenda.CentroId = request.CentroId;
        agenda.CentroNombre = centro.Nombre;
        agenda.ServicioId = request.ServicioId;
        agenda.ServicioNombre = servicio.Nombre;
        agenda.TipoEfector = request.TipoEfector.Trim().ToUpperInvariant();
        agenda.EfectorId = request.EfectorId;
        agenda.EfectorNombre = efector.Nombre;
        agenda.TipoAgenda = request.TipoAgenda.Trim().ToUpperInvariant();
        agenda.VisibleContactCenter = request.VisibleContactCenter;
        agenda.FechaDesde = request.FechaDesde;
        agenda.FechaHasta = request.FechaHasta;
        agenda.Observacion = request.Observacion?.Trim();

        return repository.UpdateAgenda(agenda) ? MapSummary(agenda) : null;
    }

    public AgendaSummaryResponse? CopyAgenda(Guid agendaId, CopyAgendaRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Codigo) || string.IsNullOrWhiteSpace(request.Nombre))
        {
            throw new ArgumentException("Codigo y nombre son obligatorios.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        if (request.FechaDesde < today)
        {
            throw new ArgumentException("FechaDesde no puede ser menor al dia de hoy.");
        }

        if (request.FechaHasta.HasValue && request.FechaHasta.Value < request.FechaDesde)
        {
            throw new ArgumentException("FechaHasta no puede ser menor que FechaDesde.");
        }

        var source = repository.GetById(agendaId);
        if (source is null)
        {
            return null;
        }

        var codigo = request.Codigo.Trim();
        if (repository.ExistsByCodigo(codigo, null))
        {
            throw new ArgumentException("Ya existe una agenda con el mismo codigo.");
        }

        var clone = new AgendaAggregate
        {
            Id = Guid.NewGuid(),
            Codigo = codigo,
            Nombre = request.Nombre.Trim(),
            CentroId = source.CentroId,
            CentroNombre = source.CentroNombre,
            ServicioId = source.ServicioId,
            ServicioNombre = source.ServicioNombre,
            TipoEfector = source.TipoEfector,
            EfectorId = source.EfectorId,
            EfectorNombre = source.EfectorNombre,
            TipoAgenda = source.TipoAgenda,
            VisibleContactCenter = source.VisibleContactCenter,
            Activa = source.Activa,
            FechaDesde = request.FechaDesde,
            FechaHasta = request.FechaHasta,
            Observacion = source.Observacion
        };

        repository.AddAgenda(clone);
        return MapSummary(clone);
    }

    public AgendaSummaryResponse? SetEstado(Guid agendaId, SetAgendaStateRequest request)
    {
        var agenda = repository.GetById(agendaId);
        if (agenda is null)
        {
            return null;
        }

        agenda.Activa = request.Activa;
        return repository.UpdateAgenda(agenda) ? MapSummary(agenda) : null;
    }

    public bool AddBloque(Guid agendaId, CreateBloqueRequest request)
    {
        var agenda = repository.GetById(agendaId);
        if (agenda is null)
        {
            return false;
        }

        var esAgendaProgramada = string.Equals(agenda.TipoAgenda, "PROGRAMADA", StringComparison.OrdinalIgnoreCase);
        var esAgendaDemanda = string.Equals(agenda.TipoAgenda, "DEMANDA_ESPONTANEA", StringComparison.OrdinalIgnoreCase);
        if (!esAgendaProgramada && !esAgendaDemanda)
        {
            throw new ArgumentException("Tipo de agenda no soportado para alta de bloques.");
        }

        var tipoBloque = string.IsNullOrWhiteSpace(request.TipoBloque)
            ? string.Empty
            : request.TipoBloque.Trim().ToUpperInvariant();

        if (esAgendaProgramada &&
            !string.Equals(tipoBloque, "FIJA", StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(tipoBloque, "VARIABLE", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Para agenda programada debe usar tipo de bloque FIJA o VARIABLE.");
        }

        if (esAgendaDemanda && !string.Equals(tipoBloque, "DEMANDA_ESPONTANEA", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Para agenda de demanda espontanea debe usar tipo de bloque DEMANDA_ESPONTANEA.");
        }

        ValidarBloqueObligatorio(request, tipoBloque);

        if (request.FechaDesde == default || request.FechaHasta == default)
        {
            throw new ArgumentException("FechaDesde y FechaHasta son obligatorias.");
        }

        if (request.FechaDesde > request.FechaHasta)
        {
            throw new ArgumentException("FechaHasta no puede ser menor que FechaDesde.");
        }

        if (string.Equals(tipoBloque, "VARIABLE", StringComparison.OrdinalIgnoreCase) && request.FechaDesde != request.FechaHasta)
        {
            throw new ArgumentException("Para bloque variable las fechas desde y hasta deben ser iguales (unica fecha).");
        }

        if (request.FechaDesde < agenda.FechaDesde)
        {
            throw new ArgumentException("La fecha desde y hasta del bloque deben estar dentro de la vigencia de la agenda.");
        }

        if (agenda.FechaHasta.HasValue && request.FechaHasta > agenda.FechaHasta.Value)
        {
            throw new ArgumentException("La fecha desde y hasta del bloque deben estar dentro de la vigencia de la agenda.");
        }

        var horaInicio = ParseHora(request.HoraInicio, "HoraInicio");
        var horaFin = ParseHora(request.HoraFin, "HoraFin");

        if (horaFin <= horaInicio)
        {
            throw new ArgumentException("HoraFin debe ser mayor que HoraInicio.");
        }

        var esVariable = string.Equals(tipoBloque, "VARIABLE", StringComparison.OrdinalIgnoreCase);

        if (!esVariable && (request.Dias is null || request.Dias.Count == 0 || request.Dias.Any(d => !DiasSemana.Contains(d, StringComparer.OrdinalIgnoreCase))))
        {
            throw new ArgumentException("Debe seleccionar al menos un dia valido.");
        }

        var diasNormalizados = esVariable
            ? [CodigoDiaSemana(request.FechaDesde.DayOfWeek)]
            : request.Dias
                .Select(d => d.Trim().ToUpperInvariant())
                .Where(d => !string.IsNullOrWhiteSpace(d))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

        var now = GetBusinessNow();
        var hoy = DateOnly.FromDateTime(now.DateTime);
        var horaActual = TimeOnly.FromDateTime(now.DateTime);
        var codigoHoy = CodigoDiaSemana(hoy.DayOfWeek);
        var hoyIncluidoEnBloque = request.FechaDesde <= hoy
            && request.FechaHasta >= hoy
            && diasNormalizados.Contains(codigoHoy, StringComparer.OrdinalIgnoreCase);

        if (hoyIncluidoEnBloque && horaInicio <= horaActual)
        {
            throw new ArgumentException("Para fecha de hoy, la HoraInicio debe ser futura respecto a la hora actual del sistema.");
        }

        var duracionTurno = request.DuracionTurnoMinutos;
        if (esAgendaDemanda && duracionTurno <= 0)
        {
            duracionTurno = 20;
        }

        if (esAgendaProgramada && string.Equals(tipoBloque, "VARIABLE", StringComparison.OrdinalIgnoreCase))
        {
            duracionTurno = 5;
        }

        var practicasNormalizadas = new List<BloquePractica>();
        if (request.Practicas is not null)
        {
            foreach (var practica in request.Practicas)
            {
                if (string.IsNullOrWhiteSpace(practica.Nombre))
                {
                    continue;
                }

                var nombrePractica = practica.Nombre.Trim();
                if (nombrePractica.Length > 70)
                {
                    throw new ArgumentException("Nombre de practica invalido (maximo 70 caracteres).");
                }

                practicasNormalizadas.Add(new BloquePractica
                {
                    Nombre = nombrePractica,
                    DuracionMinutos = practica.DuracionMinutos.GetValueOrDefault() > 0 ? practica.DuracionMinutos!.Value : 15
                });
            }
        }

        if (esAgendaProgramada && practicasNormalizadas.Count == 0)
        {
            throw new ArgumentException("No debe permitir guardar la configuracion si no cuenta con al menos una practica asociada.");
        }

        if (esAgendaDemanda && practicasNormalizadas.Count == 0)
        {
            throw new ArgumentException("Debe seleccionar al menos una practica medica para demanda espontanea.");
        }

        if (duracionTurno <= 0)
        {
            throw new ArgumentException("Duracion del turno debe ser mayor a cero.");
        }

        var rangoMinutos = (horaFin - horaInicio).TotalMinutes;
        if (rangoMinutos < duracionTurno)
        {
            throw new ArgumentException("El rango horario debe ser mayor o igual a la duracion del turno.");
        }

        var frecuencia = string.IsNullOrWhiteSpace(request.Frecuencia) ? "SEMANAL" : request.Frecuencia.Trim().ToUpperInvariant();
        if (!FrecuenciasBloque.Contains(frecuencia, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Frecuencia invalida.");
        }

        var ordenMensual = request.OrdenMensualSemanas?.Distinct().ToList() ?? [];
        if (string.Equals(frecuencia, "ORDEN_MENSUAL", StringComparison.OrdinalIgnoreCase))
        {
            if (ordenMensual.Count is 0 or > 2 || ordenMensual.Any(s => s < 1 || s > 4))
            {
                throw new ArgumentException("Orden mensual debe incluir entre 1 y 2 valores entre 1 y 4.");
            }
        }
        else
        {
            ordenMensual.Clear();
        }

        if (request.LugarAtencionId == Guid.Empty)
        {
            throw new ArgumentException("Lugar de atencion es obligatorio.");
        }

        var lugar = repository.GetLugaresAtencion(null).FirstOrDefault(l => l.Id == request.LugarAtencionId)
            ?? throw new ArgumentException("Lugar de atencion invalido.");

        if (request.Sobreturnos < 0)
        {
            throw new ArgumentException("Numero de sobreturnos no puede ser negativo.");
        }

        var intervalo = duracionTurno;
        if (intervalo <= 0)
        {
            throw new ArgumentException("IntervaloMinutos debe ser mayor a cero.");
        }

        if (esAgendaProgramada && ExisteSolapamientoBloqueActivo(
                agenda,
                request.FechaDesde,
                request.FechaHasta,
            diasNormalizados,
                horaInicio,
                horaFin,
                excludeBloqueId: null))
        {
            throw new ArgumentException("Ya existe un bloque activo para el efector en el mismo centro, dia y horario.");
        }

        if (ExisteSolapamientoLugarActivo(
            agenda,
            request.LugarAtencionId,
            request.FechaDesde,
            request.FechaHasta,
            diasNormalizados,
            horaInicio,
            horaFin,
            excludeBloqueId: null))
        {
            throw new ArgumentException("El lugar de atencion se encuentra ocupado por otro profesional para ese rango.");
        }

        var bloque = new BloqueProgramacion
        {
            Id = Guid.NewGuid(),
            Nombre = request.Nombre.Trim(),
            TipoBloque = esAgendaDemanda ? "DEMANDA_ESPONTANEA" : tipoBloque,
            FechaDesde = request.FechaDesde,
            FechaHasta = request.FechaHasta,
            AtiendeFeriados = request.AtiendeFeriados,
            Fecha = request.FechaDesde,
            HoraInicio = horaInicio,
            HoraFin = horaFin,
            DuracionTurnoMinutos = duracionTurno,
            IntervaloMinutos = intervalo,
            LugarAtencionId = request.LugarAtencionId,
            LugarAtencionNombre = lugar.Nombre,
            Frecuencia = frecuencia,
            Sobreturnos = request.Sobreturnos,
            Activo = true
        };

        foreach (var dia in diasNormalizados)
        {
            bloque.Dias.Add(dia);
        }

        foreach (var semana in ordenMensual)
        {
            bloque.OrdenMensualSemanas.Add(semana);
        }

        foreach (var practica in practicasNormalizadas)
        {
            bloque.Practicas.Add(practica);
        }

        var creado = repository.AddBloque(agendaId, bloque);
        if (creado)
        {
            RecalcularCupos(agendaId);
        }

        return creado;
    }

    private static void ValidarBloqueObligatorio(CreateBloqueRequest request, string tipoBloque)
    {
        var esVariable = string.Equals(tipoBloque, "VARIABLE", StringComparison.OrdinalIgnoreCase);

        if (string.IsNullOrWhiteSpace(request.Nombre)
            || string.IsNullOrWhiteSpace(request.TipoBloque)
            || request.FechaDesde == default
            || request.FechaHasta == default
            || string.IsNullOrWhiteSpace(request.HoraInicio)
            || string.IsNullOrWhiteSpace(request.HoraFin)
            || (!esVariable && (request.Dias is null || request.Dias.Count == 0))
            || request.LugarAtencionId == Guid.Empty
            || (!esVariable && string.IsNullOrWhiteSpace(request.Frecuencia)))
        {
            throw new ArgumentException("Todos los campos obligatorios del bloque deben completarse.");
        }

        if (request.Nombre.Trim().Length > 70)
        {
            throw new ArgumentException("Nombre de bloque obligatorio y maximo 70 caracteres.");
        }
    }

    public bool UpdateBloque(Guid agendaId, Guid bloqueId, UpdateBloqueRequest request)
    {
        var horaInicio = ParseHora(request.HoraInicio, "HoraInicio");
        var horaFin = ParseHora(request.HoraFin, "HoraFin");

        if (request.IntervaloMinutos <= 0)
        {
            throw new ArgumentException("IntervaloMinutos debe ser mayor a cero.");
        }

        if (horaFin <= horaInicio)
        {
            throw new ArgumentException("HoraFin debe ser mayor que HoraInicio.");
        }

        var now = GetBusinessNow();
        var hoy = DateOnly.FromDateTime(now.DateTime);
        var horaActual = TimeOnly.FromDateTime(now.DateTime);
        if (request.Fecha == hoy && horaInicio <= horaActual)
        {
            throw new ArgumentException("Para fecha de hoy, la HoraInicio debe ser futura respecto a la hora actual del sistema.");
        }

        var agenda = repository.GetById(agendaId);
        if (agenda is null || !agenda.Bloques.Any(b => b.Id == bloqueId))
        {
            return false;
        }

        if (ExisteSolapamientoBloqueActivo(
                agenda,
                request.Fecha,
                request.Fecha,
                [CodigoDiaSemana(request.Fecha.DayOfWeek)],
                horaInicio,
                horaFin,
                excludeBloqueId: bloqueId))
        {
            throw new ArgumentException("Ya existe un bloque activo para el efector en el mismo centro, dia y horario.");
        }

        var bloque = new BloqueProgramacion
        {
            Id = bloqueId,
            Fecha = request.Fecha,
            HoraInicio = horaInicio,
            HoraFin = horaFin,
            IntervaloMinutos = request.IntervaloMinutos
        };

        var actualizado = repository.UpdateBloque(agendaId, bloque);
        if (actualizado)
        {
            RecalcularCupos(agendaId);
        }

        return actualizado;
    }

    public bool RemovePracticaBloque(Guid agendaId, Guid bloqueId, string nombrePractica)
    {
        if (string.IsNullOrWhiteSpace(nombrePractica))
        {
            throw new ArgumentException("Nombre de practica es obligatorio.");
        }

        var agenda = repository.GetById(agendaId);
        if (agenda is null)
        {
            return false;
        }

        var bloque = agenda.Bloques.FirstOrDefault(b => b.Id == bloqueId);
        if (bloque is null)
        {
            return false;
        }

        var nombreNormalizado = nombrePractica.Trim();
        var indiceAEliminar = bloque.Practicas.FindIndex(p =>
            string.Equals(p.Nombre, nombreNormalizado, StringComparison.OrdinalIgnoreCase));

        if (indiceAEliminar < 0)
        {
            throw new ArgumentException("La practica indicada no existe en el bloque seleccionado.");
        }

        var practicasFiltradas = bloque.Practicas.ToList();
        practicasFiltradas.RemoveAt(indiceAEliminar);

        if (practicasFiltradas.Count == 0)
        {
            throw new ArgumentException("El bloque debe conservar al menos una practica asociada.");
        }

        var actualizado = repository.UpdateBloquePracticas(agendaId, bloqueId, practicasFiltradas);
        if (actualizado)
        {
            RecalcularCupos(agendaId);
        }

        return actualizado;
    }

    public IReadOnlyList<TurnoACancelarResponse>? GetTurnosACancelarPorEdicionBloque(Guid agendaId, Guid bloqueId)
    {
        var agenda = repository.GetById(agendaId);
        if (agenda is null || !agenda.Bloques.Any(b => b.Id == bloqueId))
        {
            return null;
        }

        var turnos = turnosRepository.GetTurnosByBloqueId(bloqueId);
        return turnos.Select(t => new TurnoACancelarResponse(t.TurnoId, t.PacienteNombre, t.FechaHora, t.Estado)).ToList();
    }

    public bool AddBloqueo(Guid agendaId, CreateBloqueoRequest request)
    {
        if (request.Fin <= request.Inicio)
        {
            throw new ArgumentException("Fin debe ser mayor que Inicio.");
        }

        var bloqueo = new BloqueoAgenda
        {
            Id = Guid.NewGuid(),
            Inicio = request.Inicio,
            Fin = request.Fin,
            Tipo = string.IsNullOrWhiteSpace(request.Tipo) ? "busy-unavailable" : request.Tipo.Trim()
        };

        return repository.AddBloqueo(agendaId, bloqueo);
    }

    public FhirSlotSearchResultResponse SearchFhirSlots(Guid scheduleId, string? status, DateTimeOffset? startFrom, DateTimeOffset? startTo, int count, int page)
    {
        var result = repository.SearchSlots(scheduleId, status, startFrom, startTo, count, page);
        return new FhirSlotSearchResultResponse(
            result.Total,
            result.Slots.Select(s => new FhirSlotResponse(
                s.Id,
                s.ScheduleId,
                s.Start,
                s.End,
                ToFhirSlotStatus(s.Estado),
                s.Capacidad,
                s.OverbookingPermitido,
                s.LugarAtencionId,
                s.LugarAtencionNombre,
                s.ScheduleNombre
            )).ToList()
        );
    }

    public FhirLocationSearchResultResponse SearchFhirLocations(string? name, bool? active, int count, int page)
    {
        var result = repository.SearchLocations(name, active, count, page);
        return new FhirLocationSearchResultResponse(
            result.Total,
            result.Locations.Select(l => new FhirLocationResponse(
                l.Id,
                l.Nombre,
                l.Activo
            )).ToList()
        );
    }

    public FhirAppointmentSearchResultResponse SearchFhirAppointments(string? patientId, string? status, DateTimeOffset? dateFrom, DateTimeOffset? dateTo, int count, int page)
    {
        var result = repository.SearchFhirAppointments(patientId, status, dateFrom, dateTo, count, page);
        return new FhirAppointmentSearchResultResponse(
            result.Total,
            result.Appointments.Select(a => new FhirAppointmentResponse(
                a.AppointmentId,
                a.PatientId,
                a.SlotId,
                a.ScheduleId,
                a.CentroId,
                a.ServicioId,
                a.EfectorId,
                a.Start,
                a.End,
                a.Status,
                a.Reason,
                a.ExternalIdentifier
            )).ToList()
        );
    }

    public FhirAppointmentCreateResultResponse CreateFhirAppointment(FhirAppointmentCreateRequest request)
    {
        var input = new FhirAppointmentCreateInput(
            request.PatientId,
            request.SlotId,
            request.Start,
            request.End,
            request.Reason,
            request.ExternalIdentifier,
            request.IdempotencyKey,
            request.CorrelationId
        );

        var result = repository.CreateFhirAppointment(input);
        return new FhirAppointmentCreateResultResponse(
            ToAppointmentOutcome(result.Status),
            result.Appointment is null
                ? null
                : new FhirAppointmentResponse(
                    result.Appointment.AppointmentId,
                    result.Appointment.PatientId,
                    result.Appointment.SlotId,
                    result.Appointment.ScheduleId,
                    result.Appointment.CentroId,
                    result.Appointment.ServicioId,
                    result.Appointment.EfectorId,
                    result.Appointment.Start,
                    result.Appointment.End,
                    result.Appointment.Status,
                    result.Appointment.Reason,
                    result.Appointment.ExternalIdentifier
                ),
            result.Diagnostics
        );
    }

    public FhirAppointmentResponse? GetFhirAppointmentById(string appointmentId)
    {
        if (string.IsNullOrWhiteSpace(appointmentId))
        {
            return null;
        }

        var appointment = repository.GetFhirAppointmentById(appointmentId.Trim());
        if (appointment is null)
        {
            return null;
        }

        return new FhirAppointmentResponse(
            appointment.AppointmentId,
            appointment.PatientId,
            appointment.SlotId,
            appointment.ScheduleId,
            appointment.CentroId,
            appointment.ServicioId,
            appointment.EfectorId,
            appointment.Start,
            appointment.End,
            appointment.Status,
            appointment.Reason,
            appointment.ExternalIdentifier
        );
    }

    public DisponibilidadResponse? RecalcularCupos(Guid agendaId)
    {
        return GetDisponibilidad(agendaId);
    }

    public DisponibilidadResponse? GetDisponibilidad(Guid agendaId)
    {
        var agenda = repository.GetById(agendaId);
        if (agenda is null)
        {
            return null;
        }

        var total = agenda.Bloques.Sum(b =>
        {
            var mins = b.HoraFin.ToTimeSpan().TotalMinutes - b.HoraInicio.ToTimeSpan().TotalMinutes;
            if (mins <= 0 || b.IntervaloMinutos <= 0)
            {
                return 0;
            }

            var cuposBase = (int)Math.Floor(mins / b.IntervaloMinutos);
            var cuposSobreturno = Math.Max(b.Sobreturnos, 0);
            var capacidadDiaria = cuposBase + cuposSobreturno;

            if (string.Equals(b.TipoBloque, "VARIABLE", StringComparison.OrdinalIgnoreCase))
            {
                return capacidadDiaria;
            }

            var dias = ObtenerDiasBloque(b);
            var diasPorSemana = dias.Count;
            if (diasPorSemana == 0)
            {
                return capacidadDiaria;
            }

            var factorFrecuencia = b.Frecuencia?.Trim().ToUpperInvariant() switch
            {
                "QUINCENAL" => 0.5,
                "ORDEN_MENSUAL" when b.OrdenMensualSemanas.Count > 0 => b.OrdenMensualSemanas.Count / 4.0,
                _ => 1.0
            };

            return (int)Math.Ceiling(capacidadDiaria * diasPorSemana * factorFrecuencia);
        });

        var now = DateTimeOffset.UtcNow;
        var bloqueosActivos = agenda.Bloqueos.Count(b => b.Inicio <= now && b.Fin >= now);
        var disponibles = Math.Max(total - bloqueosActivos, 0);

        return new DisponibilidadResponse(agenda.Id, total, disponibles, bloqueosActivos);
    }

    private static AgendaSummaryResponse MapSummary(AgendaAggregate agenda)
    {
        return new AgendaSummaryResponse(
            agenda.Id,
            agenda.Codigo,
            agenda.Nombre,
            agenda.CentroId,
            agenda.CentroNombre,
            agenda.ServicioId,
            agenda.ServicioNombre,
            agenda.TipoEfector,
            agenda.EfectorId,
            agenda.EfectorNombre,
            agenda.TipoAgenda,
            agenda.VisibleContactCenter,
            agenda.Activa,
            agenda.FechaDesde,
            agenda.FechaHasta,
            agenda.Observacion,
            agenda.Bloques.Count,
            agenda.Bloqueos.Count
        );
    }

    private bool ExisteSolapamientoBloqueActivo(
        AgendaAggregate agendaActual,
        DateOnly fechaDesde,
        DateOnly fechaHasta,
        IReadOnlyList<string> dias,
        TimeOnly horaInicio,
        TimeOnly horaFin,
        Guid? excludeBloqueId)
    {
        var diasNormalizados = dias
            .Select(d => d.Trim().ToUpperInvariant())
            .Where(d => !string.IsNullOrWhiteSpace(d))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var idsMismoEfector = repository.GetAll()
            .Where(a => a.Activa && a.CentroId == agendaActual.CentroId && a.EfectorId == agendaActual.EfectorId)
            .Select(a => a.Id)
            .ToList();

        var agendasActivasMismoEfector = idsMismoEfector.Count > 0
            ? repository.GetByIds(idsMismoEfector)
            : [];

        foreach (var agenda in agendasActivasMismoEfector)
        {
            foreach (var bloque in agenda.Bloques)
            {
                if (!bloque.Activo)
                {
                    continue;
                }

                if (excludeBloqueId.HasValue && agenda.Id == agendaActual.Id && bloque.Id == excludeBloqueId.Value)
                {
                    continue;
                }

                var bloqueFechaDesde = bloque.FechaDesde == default ? bloque.Fecha : bloque.FechaDesde;
                var bloqueFechaHasta = bloque.FechaHasta == default ? bloque.Fecha : bloque.FechaHasta;

                if (!RangosFechaSeSolapan(fechaDesde, fechaHasta, bloqueFechaDesde, bloqueFechaHasta))
                {
                    continue;
                }

                var diasBloque = ObtenerDiasBloque(bloque);
                if (diasNormalizados.Count > 0 && !diasNormalizados.Overlaps(diasBloque))
                {
                    continue;
                }

                if (RangosHoraSeSolapan(horaInicio, horaFin, bloque.HoraInicio, bloque.HoraFin))
                {
                    return true;
                }
            }
        }

        return false;
    }

    private bool ExisteSolapamientoLugarActivo(
        AgendaAggregate agendaActual,
        Guid lugarAtencionId,
        DateOnly fechaDesde,
        DateOnly fechaHasta,
        IReadOnlyList<string> dias,
        TimeOnly horaInicio,
        TimeOnly horaFin,
        Guid? excludeBloqueId)
    {
        var diasNormalizados = dias
            .Select(d => d.Trim().ToUpperInvariant())
            .Where(d => !string.IsNullOrWhiteSpace(d))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var idsMismoCentro = repository.GetAll()
            .Where(a => a.Activa && a.CentroId == agendaActual.CentroId && a.EfectorId != agendaActual.EfectorId)
            .Select(a => a.Id)
            .ToList();

        var agendasActivasMismoCentro = idsMismoCentro.Count > 0
            ? repository.GetByIds(idsMismoCentro)
            : [];

        foreach (var agenda in agendasActivasMismoCentro)
        {
            foreach (var bloque in agenda.Bloques)
            {
                if (!bloque.Activo)
                {
                    continue;
                }

                if (excludeBloqueId.HasValue && agenda.Id == agendaActual.Id && bloque.Id == excludeBloqueId.Value)
                {
                    continue;
                }

                if (bloque.LugarAtencionId != lugarAtencionId)
                {
                    continue;
                }

                var bloqueFechaDesde = bloque.FechaDesde == default ? bloque.Fecha : bloque.FechaDesde;
                var bloqueFechaHasta = bloque.FechaHasta == default ? bloque.Fecha : bloque.FechaHasta;

                if (!RangosFechaSeSolapan(fechaDesde, fechaHasta, bloqueFechaDesde, bloqueFechaHasta))
                {
                    continue;
                }

                var diasBloque = ObtenerDiasBloque(bloque);
                if (diasNormalizados.Count > 0 && !diasNormalizados.Overlaps(diasBloque))
                {
                    continue;
                }

                if (RangosHoraSeSolapan(horaInicio, horaFin, bloque.HoraInicio, bloque.HoraFin))
                {
                    return true;
                }
            }
        }

        return false;
    }

    private static bool RangosFechaSeSolapan(DateOnly aDesde, DateOnly aHasta, DateOnly bDesde, DateOnly bHasta)
    {
        return aDesde <= bHasta && bDesde <= aHasta;
    }

    private static bool RangosHoraSeSolapan(TimeOnly aInicio, TimeOnly aFin, TimeOnly bInicio, TimeOnly bFin)
    {
        return aInicio < bFin && bInicio < aFin;
    }

    private static HashSet<string> ObtenerDiasBloque(BloqueProgramacion bloque)
    {
        if (bloque.Dias.Count > 0)
        {
            return bloque.Dias
                .Select(d => d.Trim().ToUpperInvariant())
                .Where(d => !string.IsNullOrWhiteSpace(d))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        return [CodigoDiaSemana(bloque.Fecha.DayOfWeek)];
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
            _ => ""
        };
    }

    private static TimeOnly ParseHora(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"{fieldName} es obligatorio.");
        }

        var normalized = value.Trim();
        var formats = new[] { "HH:mm", "HH:mm:ss" };
        if (TimeOnly.TryParseExact(normalized, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var hora))
        {
            return hora;
        }

        if (TimeOnly.TryParse(normalized, CultureInfo.InvariantCulture, DateTimeStyles.None, out hora))
        {
            return hora;
        }

        throw new ArgumentException($"{fieldName} invalida.");
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

    private static string ToFhirSlotStatus(string estado)
    {
        return estado.Trim().ToLowerInvariant() switch
        {
            "libre" => "free",
            "reservado" => "busy",
            "ocupado" => "busy",
            "bloqueado" => "busy-unavailable",
            _ => "busy-unavailable"
        };
    }

    private static string ToAppointmentOutcome(FhirAppointmentCreateStatus status)
    {
        return status switch
        {
            FhirAppointmentCreateStatus.Created => "created",
            FhirAppointmentCreateStatus.IdempotentReplay => "idempotent-replay",
            FhirAppointmentCreateStatus.SlotNotFound => "slot-not-found",
            FhirAppointmentCreateStatus.SlotUnavailable => "slot-unavailable",
            _ => "validation-error"
        };
    }
}
