using VitalFlow.His.Api.Application.Auth.Contracts;
using VitalFlow.His.Api.Application.Auth.Services;
using VitalFlow.His.Api.Application.EstructuraInterna.Contracts;
using VitalFlow.His.Api.Application.EstructuraInterna.Repositories;

namespace VitalFlow.His.Api.Application.EstructuraInterna.Services;

public sealed class EstructuraInternaService(
    IEstructuraInternaRepository repository,
    IAuthService authService) : IEstructuraInternaService
{
    private static readonly IReadOnlyList<NodoEstructuraInternaResponse> Nodos =
    [
        new(
            "centro",
            "Centro",
            "sch_agenda.centro",
            "Nodo raiz de la estructura asistencial.",
            [
                new("id", "uuid", false, null),
                new("nombre", "varchar(140)", true, null),
                new("direccion", "varchar(240)", true, null),
                new("telefono", "varchar(80)", true, null),
                new("mail", "varchar(140)", true, null),
                new("activo", "boolean", false, null)
            ]
        ),
        new(
            "servicio",
            "Servicio",
            "sch_agenda.servicio",
            "Cada servicio depende de un centro.",
            [
                new("id", "uuid", false, null),
                new("centro_id", "uuid", true, "sch_agenda.centro.id"),
                new("nombre", "varchar(140)", true, null),
                new("activo", "boolean", false, null)
            ]
        ),
        new(
            "financiadores-planes",
            "Financiadores/Planes",
            "sch_persona.financiador + sch_persona.financiador_plan",
            "Catalogo de financiadores y planes para cobertura.",
            [
                new("financiador_id", "uuid", false, null),
                new("financiador_codigo", "varchar(40)", true, null),
                new("financiador_nombre", "varchar(140)", true, null),
                new("plan_id", "uuid", false, null),
                new("plan_codigo", "varchar(40)", true, null),
                new("plan_nombre", "varchar(140)", true, null),
                new("activo", "boolean", false, null)
            ]
        ),
        new(
            "practicas",
            "Practicas",
            "sch_agenda.practica",
            "Relacion Centro -> Servicio -> Practica.",
            [
                new("id", "uuid", false, null),
                new("centro_id", "uuid", true, "sch_agenda.centro.id"),
                new("servicio_id", "uuid", true, "sch_agenda.servicio.id"),
                new("nombre", "varchar(160)", true, null),
                new("duracion_minutos_sugerida", "int", false, null),
                new("codigo_clinico", "varchar(40)", false, null),
                new("activa", "boolean", false, null)
            ]
        ),
        new(
            "dispositivos",
            "Dispositivos",
            "sch_agenda.dispositivo",
            "Recursos tecnicos por centro y servicio.",
            [
                new("id", "uuid", false, null),
                new("centro_id", "uuid", true, "sch_agenda.centro.id"),
                new("servicio_id", "uuid", true, "sch_agenda.servicio.id"),
                new("codigo", "varchar(40)", true, null),
                new("nombre", "varchar(140)", true, null),
                new("tipo", "varchar(40)", true, null),
                new("activo", "boolean", false, null)
            ]
        ),
        new(
            "profesionales",
            "Profesionales",
            "sch_agenda.efector (tipo_efector=PROFESIONAL)",
            "ABM de profesionales por centro y servicio.",
            [
                new("id", "uuid", false, null),
                new("centro_id", "uuid", true, "sch_agenda.centro.id"),
                new("servicio_id", "uuid", true, "sch_agenda.servicio.id"),
                new("nombre", "varchar(180)", true, null),
                new("activo", "boolean", false, null)
            ]
        ),
        new(
            "grupo-profesionales",
            "Grupo de Profesionales",
            "sch_agenda.grupo_profesional + sch_agenda.grupo_profesional_miembro",
            "ABM de grupo y miembros segun HU 11199.",
            [
                new("grupo_id", "uuid", false, null),
                new("grupo_codigo", "varchar(40)", true, null),
                new("grupo_nombre", "varchar(140)", true, null),
                new("grupo_centro_id", "uuid", true, "sch_agenda.centro.id"),
                new("grupo_servicio_id", "uuid", true, "sch_agenda.servicio.id"),
                new("grupo_descripcion", "varchar(300)", false, null),
                new("grupo_activo", "boolean", false, null),
                new("miembro_efector_id", "uuid", false, "sch_agenda.efector.id"),
                new("miembro_rol", "varchar(40)", false, null),
                new("miembro_orden", "int", false, null),
                new("miembro_activo", "boolean", false, null)
            ]
        ),
        new(
            "usuarios-sistema",
            "Usuarios del Sistema",
            "sch_seguridad.usuario_sistema + sch_seguridad.usuario_rol",
            "Alta de usuario desde persona existente, con rol, contrasena temporal y servicio para medicos.",
            [
                new("persona_id", "uuid", true, "sch_persona.persona.id"),
                new("username", "varchar(120)", true, null),
                new("temporary_password", "varchar", true, null),
                new("centro_id", "uuid", true, "sch_agenda.centro.id"),
                new("servicio_id", "uuid", false, "sch_agenda.servicio.id"),
                new("matricula_provincial", "varchar(64)", false, null),
                new("matricula_nacional", "varchar(64)", false, null),
                new("rol_nombre", "varchar(80)", true, "sch_seguridad.rol.nombre"),
                new("estado", "varchar(40)", false, null),
                new("ultimo_login", "timestamptz", false, null)
            ]
        ),
        new(
            "roles-seguridad",
            "Roles de Seguridad",
            "sch_seguridad.rol",
            "Definicion de roles de seguridad para autorizacion en modulos y features.",
            [
                new("id", "uuid", false, null),
                new("nombre", "varchar(80)", true, null),
                new("descripcion", "varchar(300)", false, null),
                new("es_predefinido", "boolean", false, null)
            ]
        )
    ];

    public IReadOnlyList<NodoEstructuraInternaResponse> GetNodos() => Nodos;

    public IReadOnlyList<RegistroNodoResponse> GetRegistros(string nodoId)
    {
        ValidateNodo(nodoId);
        var items = repository.GetRegistros(nodoId);
        return items
            .Select(item => new RegistroNodoResponse(nodoId, item["id"] ?? string.Empty, item))
            .ToArray();
    }

    public RegistroNodoResponse SaveRegistro(string nodoId, SaveRegistroNodoRequest request)
    {
        ValidateNodo(nodoId);

        if (request.Campos.Count == 0)
        {
            throw new ArgumentException("Debe enviar al menos un campo para guardar.");
        }

        if (string.Equals(nodoId, "usuarios-sistema", StringComparison.OrdinalIgnoreCase))
        {
            var userIdRaw = request.Campos.TryGetValue("id", out var userRaw)
                ? (userRaw ?? string.Empty).Trim()
                : string.Empty;
            var personaIdRaw = GetRequiredField(request.Campos, "persona_id");
            var username = GetRequiredField(request.Campos, "username");
            var centroIdRaw = GetRequiredField(request.Campos, "centro_id");
            var rolNombre = GetRequiredField(request.Campos, "rol_nombre");
            var servicioIdRaw = request.Campos.TryGetValue("servicio_id", out var servicioRaw)
                ? (servicioRaw ?? string.Empty).Trim()
                : string.Empty;
            var matriculaProvincial = request.Campos.TryGetValue("matricula_provincial", out var mpRaw)
                ? (mpRaw ?? string.Empty).Trim()
                : string.Empty;
            var matriculaNacional = request.Campos.TryGetValue("matricula_nacional", out var mnRaw)
                ? (mnRaw ?? string.Empty).Trim()
                : string.Empty;
            var estadoInput = request.Campos.TryGetValue("estado", out var estadoRaw)
                ? (estadoRaw ?? string.Empty).Trim().ToUpperInvariant()
                : "ACTIVO";

            if (!Guid.TryParse(personaIdRaw, out var personaId) || personaId == Guid.Empty)
            {
                throw new ArgumentException("persona_id debe ser UUID valido.");
            }

            var allCentros = string.Equals(centroIdRaw, "TODOS", StringComparison.OrdinalIgnoreCase);
            var centroId = Guid.Empty;
            if (!allCentros && (!Guid.TryParse(centroIdRaw, out centroId) || centroId == Guid.Empty))
            {
                throw new ArgumentException("centro_id debe ser UUID valido o 'TODOS'.");
            }

            var esMedico = string.Equals(rolNombre, "Medico", StringComparison.OrdinalIgnoreCase);
            var servicioId = Guid.Empty;
            if (esMedico)
            {
                if (allCentros)
                {
                    throw new ArgumentException("Para rol Medico debe seleccionar un centro especifico.");
                }

                if (!Guid.TryParse(servicioIdRaw, out servicioId) || servicioId == Guid.Empty)
                {
                    throw new ArgumentException("Para rol Medico debe seleccionar un servicio valido.");
                }
            }
            else if (!string.IsNullOrWhiteSpace(servicioIdRaw))
            {
                throw new ArgumentException("Solo el rol Medico puede asociarse a un servicio.");
            }

            if (estadoInput is not ("ACTIVO" or "INACTIVO"))
            {
                throw new ArgumentException("estado debe ser ACTIVO o INACTIVO.");
            }

            var roles = new[] { rolNombre };

            if (roles.Length == 0)
            {
                throw new ArgumentException("rol_nombre es obligatorio.");
            }

            if (Guid.TryParse(userIdRaw, out var userId) && userId != Guid.Empty)
            {
                var updated = authService.UpdateSystemUser(
                    new UpdateSystemUserRequest(userId, personaId, username, centroId, servicioId, matriculaProvincial, matriculaNacional, roles, estadoInput),
                    null,
                    null);

                var camposActualizados = new Dictionary<string, string?>
                {
                    ["id"] = updated.UserId.ToString(),
                    ["persona_id"] = updated.PersonaId.ToString(),
                    ["username"] = updated.Username,
                    ["centro_id"] = updated.CentroId == Guid.Empty ? "TODOS" : updated.CentroId.ToString(),
                    ["servicio_id"] = updated.ServicioId == Guid.Empty ? null : updated.ServicioId.ToString(),
                    ["matricula_provincial"] = updated.MatriculaProvincial,
                    ["matricula_nacional"] = updated.MatriculaNacional,
                    ["rol_nombre"] = string.Join(", ", updated.Roles),
                    ["estado"] = updated.Estado,
                    ["temporary_password"] = null
                };

                return new RegistroNodoResponse(nodoId, updated.UserId.ToString(), camposActualizados);
            }

            var temporaryPassword = GetRequiredField(request.Campos, "temporary_password");

            var created = authService.CreateSystemUser(
                new CreateSystemUserRequest(personaId, username, temporaryPassword, centroId, servicioId, matriculaProvincial, matriculaNacional, roles),
                null,
                null);

            if (estadoInput == "INACTIVO")
            {
                authService.SetSystemUserEstado(created.UserId, "INACTIVO", null, null);
            }

            var campos = new Dictionary<string, string?>
            {
                ["id"] = created.UserId.ToString(),
                ["persona_id"] = created.PersonaId.ToString(),
                ["username"] = created.Username,
                ["centro_id"] = created.CentroId == Guid.Empty ? "TODOS" : created.CentroId.ToString(),
                ["servicio_id"] = created.ServicioId == Guid.Empty ? null : created.ServicioId.ToString(),
                ["matricula_provincial"] = created.MatriculaProvincial,
                ["matricula_nacional"] = created.MatriculaNacional,
                ["rol_nombre"] = string.Join(", ", created.Roles),
                ["estado"] = estadoInput,
                ["temporary_password"] = null
            };

            return new RegistroNodoResponse(nodoId, created.UserId.ToString(), campos);
        }

        var saved = repository.SaveRegistro(nodoId, request.Campos);
        return new RegistroNodoResponse(nodoId, saved["id"] ?? string.Empty, saved);
    }

    private static string GetRequiredField(IReadOnlyDictionary<string, string?> campos, string key)
    {
        if (!campos.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"El campo '{key}' es obligatorio.");
        }

        return value.Trim();
    }

    private static void ValidateNodo(string nodoId)
    {
        if (!Nodos.Any(item => string.Equals(item.Id, nodoId, StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException("Nodo de estructura interna no soportado.");
        }
    }
}
