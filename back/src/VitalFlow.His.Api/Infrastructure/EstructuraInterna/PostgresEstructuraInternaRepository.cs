using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Npgsql;
using NpgsqlTypes;
using VitalFlow.His.Api.Application.EstructuraInterna.Repositories;

namespace VitalFlow.His.Api.Infrastructure.EstructuraInterna;

public sealed class PostgresEstructuraInternaRepository(string connectionString) : IEstructuraInternaRepository
{
    public IReadOnlyList<IReadOnlyDictionary<string, string?>> GetRegistros(string nodoId)
    {
        return nodoId.ToLowerInvariant() switch
        {
            "centro" => GetCentros(),
            "servicio" => GetServicios(),
            "financiadores-planes" => GetFinanciadoresPlanes(),
            "practicas" => GetPracticas(),
            "dispositivos" => GetDispositivos(),
            "profesionales" => GetProfesionales(),
            "grupo-profesionales" => GetGruposProfesionales(),
            "usuarios-sistema" => GetUsuariosSistema(),
            "roles-seguridad" => GetRolesSeguridad(),
            _ => throw new ArgumentException("Nodo de estructura interna no soportado.")
        };
    }

    public IReadOnlyDictionary<string, string?> SaveRegistro(string nodoId, IReadOnlyDictionary<string, string?> campos)
    {
        return nodoId.ToLowerInvariant() switch
        {
            "centro" => SaveCentro(campos),
            "servicio" => SaveServicio(campos),
            "financiadores-planes" => SaveFinanciadorPlan(campos),
            "practicas" => SavePractica(campos),
            "dispositivos" => SaveDispositivo(campos),
            "profesionales" => SaveProfesional(campos),
            "grupo-profesionales" => SaveGrupoProfesional(campos),
            "usuarios-sistema" => throw new ArgumentException("Este nodo se guarda desde el flujo de seguridad."),
            "roles-seguridad" => SaveRolSeguridad(campos),
            _ => throw new ArgumentException("Nodo de estructura interna no soportado.")
        };
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetUsuariosSistema()
    {
        const string sql = """
            select u.id::text,
                   u.persona_id::text,
                   concat_ws(', ', p.apellido, p.nombre) as persona_nombre,
                   u.username,
                   coalesce(array_to_string(array_agg(distinct c.id::text) filter (where c.id is not null), ', '), '') as centro_id,
                   coalesce(array_to_string(array_agg(distinct c.nombre) filter (where c.nombre is not null), ', '), '') as centro_nombre,
                     coalesce(array_to_string(array_agg(distinct s.id::text) filter (where s.id is not null), ', '), '') as servicio_id,
                     coalesce(array_to_string(array_agg(distinct s.nombre) filter (where s.nombre is not null), ', '), '') as servicio_nombre,
                                     coalesce(array_to_string(array_agg(distinct ef.matricula_provincial) filter (where ef.matricula_provincial is not null), ', '), '') as matricula_provincial,
                                     coalesce(array_to_string(array_agg(distinct ef.matricula_nacional) filter (where ef.matricula_nacional is not null), ', '), '') as matricula_nacional,
                   coalesce(array_to_string(array_agg(distinct r.nombre order by r.nombre) filter (where r.nombre is not null), ', '), '') as rol_nombre,
                   case
                       when upper(u.estado) = 'INACTIVO' then 'INACTIVO'
                       else 'ACTIVO'
                   end as estado,
                   coalesce(to_char(u.ultimo_login, 'YYYY-MM-DD"T"HH24:MI:SSOF'), '') as ultimo_login
            from sch_seguridad.usuario_sistema u
            left join sch_persona.persona p on p.id = u.persona_id
            left join sch_seguridad.usuario_rol ur on ur.usuario_id = u.id
            left join sch_seguridad.rol r on r.id = ur.rol_id
            left join sch_agenda.centro c on c.id = ur.centro_id
                 left join sch_agenda.servicio s on s.id = ur.servicio_id
              left join sch_agenda.efector ef on ef.usuario_id = u.id or ef.id = u.id
                 group by u.id, u.persona_id, p.apellido, p.nombre, u.username, u.estado, u.ultimo_login
            order by u.username;
            """;

        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetRolesSeguridad()
    {
        const string sql = """
            select id::text,
                   nombre,
                   coalesce(descripcion, '') as descripcion,
                   es_predefinido::text
            from sch_seguridad.rol
            order by nombre;
            """;

        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetCentros()
    {
        const string sql = """
            select id::text,
                   nombre,
                   coalesce(direccion, '') as direccion,
                   coalesce(telefono, '') as telefono,
                   coalesce(mail, '') as mail,
                   activo::text
            from sch_agenda.centro
            order by nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetServicios()
    {
        const string sql = """
            select id::text, centro_id::text, nombre, activo::text
            from sch_agenda.servicio
            order by nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetFinanciadoresPlanes()
    {
        const string sql = """
            select p.id::text,
                   p.id::text as plan_id,
                   p.codigo as plan_codigo,
                   p.nombre as plan_nombre,
                   p.activo::text,
                   f.id::text as financiador_id,
                   f.codigo as financiador_codigo,
                   f.nombre as financiador_nombre
            from sch_persona.financiador_plan p
            join sch_persona.financiador f on f.id = p.financiador_id
            order by f.nombre, p.nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetPracticas()
    {
        const string sql = """
            select p.id::text,
                   s.centro_id::text as centro_id,
                   p.servicio_id::text,
                   p.nombre,
                   coalesce(p.duracion_minutos_sugerida::text, '') as duracion_minutos_sugerida,
                   coalesce(p.codigo_clinico, '') as codigo_clinico,
                   p.activa::text
            from sch_agenda.practica p
            join sch_agenda.servicio s on s.id = p.servicio_id
            order by p.nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetDispositivos()
    {
        const string sql = """
            select id::text,
                   centro_id::text,
                   servicio_id::text,
                   codigo,
                   nombre,
                   tipo,
                   activo::text
            from sch_agenda.dispositivo
            order by nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetProfesionales()
    {
        const string sql = """
            select id::text,
                   centro_id::text,
                   servicio_id::text,
                   nombre,
                   activo::text
            from sch_agenda.efector
            where upper(tipo_efector) = 'PROFESIONAL'
            order by nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> GetGruposProfesionales()
    {
        const string sql = """
            select g.id::text,
                   g.codigo as grupo_codigo,
                   g.nombre as grupo_nombre,
                   g.centro_id::text as grupo_centro_id,
                   g.servicio_id::text as grupo_servicio_id,
                   coalesce(g.descripcion, '') as grupo_descripcion,
                   g.activo::text as grupo_activo,
                   coalesce(count(m.id), 0)::text as miembros
            from sch_agenda.grupo_profesional g
            left join sch_agenda.grupo_profesional_miembro m on m.grupo_profesional_id = g.id and m.activo = true
            group by g.id, g.codigo, g.nombre, g.centro_id, g.servicio_id, g.descripcion, g.activo
            order by g.nombre;
            """;
        return Query(sql);
    }

    private IReadOnlyDictionary<string, string?> SaveCentro(IReadOnlyDictionary<string, string?> campos)
    {
        var id = TryParseGuid(campos, "id") ?? Guid.NewGuid();
        var nombre = GetRequired(campos, "nombre");
        var direccion = GetRequired(campos, "direccion");
        var telefono = GetRequired(campos, "telefono");
        var mail = GetRequired(campos, "mail");
        var activo = ParseBool(campos, "activo", true);

        const string sql = """
            insert into sch_agenda.centro (id, nombre, direccion, telefono, mail, activo, created_at, updated_at)
            values (@id, @nombre, @direccion, @telefono, @mail, @activo, now(), now())
            on conflict (id) do update
            set nombre = excluded.nombre,
                direccion = excluded.direccion,
                telefono = excluded.telefono,
                mail = excluded.mail,
                activo = excluded.activo,
                updated_at = now();
            """;

        Execute(sql, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("direccion", direccion);
            cmd.Parameters.AddWithValue("telefono", telefono);
            cmd.Parameters.AddWithValue("mail", mail);
            cmd.Parameters.AddWithValue("activo", activo);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = id.ToString(),
            ["nombre"] = nombre,
            ["direccion"] = direccion,
            ["telefono"] = telefono,
            ["mail"] = mail,
            ["activo"] = activo.ToString()
        };
    }

    private IReadOnlyDictionary<string, string?> SaveServicio(IReadOnlyDictionary<string, string?> campos)
    {
        var id = TryParseGuid(campos, "id") ?? Guid.NewGuid();
        var centroId = GetRequiredGuid(campos, "centro_id");
        var nombre = GetRequired(campos, "nombre");
        var activo = ParseBool(campos, "activo", true);

        EnsureServicioNombreNoDuplicado(centroId, id, nombre);

        const string sql = """
            insert into sch_agenda.servicio (id, centro_id, nombre, activo, created_at, updated_at)
            values (@id, @centro_id, @nombre, @activo, now(), now())
            on conflict (id) do update
            set centro_id = excluded.centro_id,
                nombre = excluded.nombre,
                activo = excluded.activo,
                updated_at = now();
            """;

        Execute(sql, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("centro_id", centroId);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("activo", activo);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = id.ToString(),
            ["centro_id"] = centroId.ToString(),
            ["nombre"] = nombre,
            ["activo"] = activo.ToString()
        };
    }

    private void EnsureServicioNombreNoDuplicado(Guid centroId, Guid currentId, string nombre)
    {
        var canonicalNuevo = NormalizeServicioNombre(nombre);
        if (string.IsNullOrWhiteSpace(canonicalNuevo))
        {
            throw new ArgumentException("El nombre del servicio no puede quedar vacio luego de normalizarlo.");
        }

        const string sql = """
            select id::text, nombre
            from sch_agenda.servicio
            where centro_id = @centro_id
              and id <> @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", centroId);
        cmd.Parameters.AddWithValue("id", currentId);

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            if (reader.IsDBNull(1))
            {
                continue;
            }

            var nombreExistente = reader.GetString(1);
            if (!string.Equals(NormalizeServicioNombre(nombreExistente), canonicalNuevo, StringComparison.Ordinal))
            {
                continue;
            }

            throw new InvalidOperationException($"Ya existe un servicio equivalente: '{nombreExistente}'. Evite duplicados por mayusculas, acentos, espacios o plural.");
        }
    }

    private static string NormalizeServicioNombre(string value)
    {
        var withoutDiacritics = RemoveDiacritics(value.Trim().ToLowerInvariant());
        var cleaned = Regex.Replace(withoutDiacritics, "[^a-z0-9\\s]", " ");
        cleaned = Regex.Replace(cleaned, "\\s+", " ").Trim();
        if (cleaned.Length == 0)
        {
            return string.Empty;
        }

        var tokens = cleaned
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(NormalizePluralToken);

        return string.Join(' ', tokens);
    }

    private static string NormalizePluralToken(string token)
    {
        if (token.Length > 4 && token.EndsWith("es", StringComparison.Ordinal))
        {
            return token[..^2];
        }

        if (token.Length > 3 && token.EndsWith("s", StringComparison.Ordinal))
        {
            return token[..^1];
        }

        return token;
    }

    private static string RemoveDiacritics(string value)
    {
        var normalized = value.Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);

        foreach (var ch in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(ch);
            }
        }

        return builder.ToString().Normalize(NormalizationForm.FormC);
    }

    private IReadOnlyDictionary<string, string?> SaveFinanciadorPlan(IReadOnlyDictionary<string, string?> campos)
    {
        var requestedFinanciadorId = TryParseGuid(campos, "financiador_id");
        var planId = TryParseGuid(campos, "plan_id") ?? Guid.NewGuid();

        var financiadorCodigoInput = GetOptional(campos, "financiador_codigo");
        var financiadorNombreInput = GetOptional(campos, "financiador_nombre");
        var planCodigo = GetRequired(campos, "plan_codigo");
        var planNombre = GetRequired(campos, "plan_nombre");
        var activo = ParseBool(campos, "activo", true);

        Guid financiadorId;
        string financiadorCodigo;
        string financiadorNombre;

        if (requestedFinanciadorId.HasValue)
        {
            var existingById = GetFinanciadorById(requestedFinanciadorId.Value)
                ?? throw new InvalidOperationException("El financiador seleccionado no existe.");

            financiadorId = existingById.Id;
            financiadorCodigo = string.IsNullOrWhiteSpace(financiadorCodigoInput) ? existingById.Codigo : financiadorCodigoInput!;
            financiadorNombre = string.IsNullOrWhiteSpace(financiadorNombreInput) ? existingById.Nombre : financiadorNombreInput!;
        }
        else
        {
            if (string.IsNullOrWhiteSpace(financiadorCodigoInput) || string.IsNullOrWhiteSpace(financiadorNombreInput))
            {
                throw new ArgumentException("Debe informar financiador_codigo y financiador_nombre.");
            }

            var existingByCodigoONombre = GetFinanciadorByCodigoOrNombre(financiadorCodigoInput, financiadorNombreInput);
            if (existingByCodigoONombre is not null)
            {
                financiadorId = existingByCodigoONombre.Id;
                financiadorCodigo = existingByCodigoONombre.Codigo;
                financiadorNombre = existingByCodigoONombre.Nombre;
            }
            else
            {
                financiadorId = Guid.NewGuid();
                financiadorCodigo = financiadorCodigoInput;
                financiadorNombre = financiadorNombreInput;
            }
        }

        if (string.IsNullOrWhiteSpace(planCodigo) || string.IsNullOrWhiteSpace(planNombre))
        {
            throw new ArgumentException("Debe informar codigo y nombre del plan.");
        }

        const string sqlFinanciador = """
            insert into sch_persona.financiador (id, codigo, nombre, activo, created_at, updated_at)
            values (@id, @codigo, @nombre, @activo, now(), now())
            on conflict (id) do update
            set codigo = excluded.codigo,
                nombre = excluded.nombre,
                activo = excluded.activo,
                updated_at = now();
            """;

        const string sqlPlan = """
            insert into sch_persona.financiador_plan (id, financiador_id, codigo, nombre, activo, created_at, updated_at)
            values (@id, @financiador_id, @codigo, @nombre, @activo, now(), now())
            on conflict (id) do update
            set financiador_id = excluded.financiador_id,
                codigo = excluded.codigo,
                nombre = excluded.nombre,
                activo = excluded.activo,
                updated_at = now();
            """;

        Execute(sqlFinanciador, cmd =>
        {
            cmd.Parameters.AddWithValue("id", financiadorId);
            cmd.Parameters.AddWithValue("codigo", financiadorCodigo);
            cmd.Parameters.AddWithValue("nombre", financiadorNombre);
            cmd.Parameters.AddWithValue("activo", activo);
        });

        Execute(sqlPlan, cmd =>
        {
            cmd.Parameters.AddWithValue("id", planId);
            cmd.Parameters.AddWithValue("financiador_id", financiadorId);
            cmd.Parameters.AddWithValue("codigo", planCodigo);
            cmd.Parameters.AddWithValue("nombre", planNombre);
            cmd.Parameters.AddWithValue("activo", activo);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = planId.ToString(),
            ["financiador_id"] = financiadorId.ToString(),
            ["financiador_codigo"] = financiadorCodigo,
            ["financiador_nombre"] = financiadorNombre,
            ["plan_id"] = planId.ToString(),
            ["plan_codigo"] = planCodigo,
            ["plan_nombre"] = planNombre,
            ["activo"] = activo.ToString()
        };
    }

    private FinanciadorData? GetFinanciadorById(Guid financiadorId)
    {
        const string sql = """
            select id, codigo, nombre
            from sch_persona.financiador
            where id = @id
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", financiadorId);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new FinanciadorData(reader.GetGuid(0), reader.GetString(1), reader.GetString(2));
    }

    private FinanciadorData? GetFinanciadorByCodigoOrNombre(string codigo, string nombre)
    {
        const string sql = """
            select id, codigo, nombre
            from sch_persona.financiador
            where upper(codigo) = upper(@codigo)
               or upper(nombre) = upper(@nombre)
            order by updated_at desc
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("codigo", codigo);
        cmd.Parameters.AddWithValue("nombre", nombre);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new FinanciadorData(reader.GetGuid(0), reader.GetString(1), reader.GetString(2));
    }

    private sealed record FinanciadorData(Guid Id, string Codigo, string Nombre);

    private IReadOnlyDictionary<string, string?> SavePractica(IReadOnlyDictionary<string, string?> campos)
    {
        var id = TryParseGuid(campos, "id") ?? Guid.NewGuid();
        var centroId = GetRequiredGuid(campos, "centro_id");
        var servicioId = GetRequiredGuid(campos, "servicio_id");
        var nombre = GetRequired(campos, "nombre");
        var duracion = ParseNullableInt(campos, "duracion_minutos_sugerida");
        var codigoClinico = GetOptional(campos, "codigo_clinico");
        var activa = ParseBool(campos, "activa", true);

        EnsureServicioPerteneceACentro(servicioId, centroId);

        const string sql = """
            insert into sch_agenda.practica (id, servicio_id, nombre, duracion_minutos_sugerida, codigo_clinico, activa, created_at, updated_at)
            values (@id, @servicio_id, @nombre, @duracion, @codigo_clinico, @activa, now(), now())
            on conflict (id) do update
            set servicio_id = excluded.servicio_id,
                nombre = excluded.nombre,
                duracion_minutos_sugerida = excluded.duracion_minutos_sugerida,
                codigo_clinico = excluded.codigo_clinico,
                activa = excluded.activa,
                updated_at = now();
            """;

        Execute(sql, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("servicio_id", servicioId);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("duracion", (object?)duracion ?? DBNull.Value);
            cmd.Parameters.AddWithValue("codigo_clinico", (object?)codigoClinico ?? DBNull.Value);
            cmd.Parameters.AddWithValue("activa", activa);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = id.ToString(),
            ["centro_id"] = centroId.ToString(),
            ["servicio_id"] = servicioId.ToString(),
            ["nombre"] = nombre,
            ["duracion_minutos_sugerida"] = duracion?.ToString(),
            ["codigo_clinico"] = codigoClinico,
            ["activa"] = activa.ToString()
        };
    }

    private void EnsureServicioPerteneceACentro(Guid servicioId, Guid centroId)
    {
        const string sql = """
            select 1
            from sch_agenda.servicio
            where id = @servicio_id
              and centro_id = @centro_id
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("servicio_id", servicioId);
        cmd.Parameters.AddWithValue("centro_id", centroId);

        if (cmd.ExecuteScalar() is null)
        {
            throw new InvalidOperationException("El servicio seleccionado no pertenece al centro indicado.");
        }
    }

    private IReadOnlyDictionary<string, string?> SaveDispositivo(IReadOnlyDictionary<string, string?> campos)
    {
        var id = TryParseGuid(campos, "id") ?? Guid.NewGuid();
        var centroId = GetRequiredGuid(campos, "centro_id");
        var servicioId = GetRequiredGuid(campos, "servicio_id");
        var codigo = GetRequired(campos, "codigo");
        var nombre = GetRequired(campos, "nombre");
        var tipo = GetRequired(campos, "tipo");
        var activo = ParseBool(campos, "activo", true);

        const string sql = """
            insert into sch_agenda.dispositivo (id, centro_id, servicio_id, codigo, nombre, tipo, activo, created_at, updated_at)
            values (@id, @centro_id, @servicio_id, @codigo, @nombre, @tipo, @activo, now(), now())
            on conflict (id) do update
            set centro_id = excluded.centro_id,
                servicio_id = excluded.servicio_id,
                codigo = excluded.codigo,
                nombre = excluded.nombre,
                tipo = excluded.tipo,
                activo = excluded.activo,
                updated_at = now();
            """;

        Execute(sql, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("centro_id", centroId);
            cmd.Parameters.AddWithValue("servicio_id", servicioId);
            cmd.Parameters.AddWithValue("codigo", codigo);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("tipo", tipo);
            cmd.Parameters.AddWithValue("activo", activo);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = id.ToString(),
            ["centro_id"] = centroId.ToString(),
            ["servicio_id"] = servicioId.ToString(),
            ["codigo"] = codigo,
            ["nombre"] = nombre,
            ["tipo"] = tipo,
            ["activo"] = activo.ToString()
        };
    }

    private IReadOnlyDictionary<string, string?> SaveProfesional(IReadOnlyDictionary<string, string?> campos)
    {
        var id = TryParseGuid(campos, "id") ?? Guid.NewGuid();
        var centroId = GetRequiredGuid(campos, "centro_id");
        var servicioId = GetRequiredGuid(campos, "servicio_id");
        var nombre = GetRequired(campos, "nombre");
        var activo = ParseBool(campos, "activo", true);

        const string sql = """
            insert into sch_agenda.efector (id, centro_id, servicio_id, tipo_efector, nombre, activo, created_at, updated_at)
            values (@id, @centro_id, @servicio_id, 'PROFESIONAL', @nombre, @activo, now(), now())
            on conflict (id) do update
            set centro_id = excluded.centro_id,
                servicio_id = excluded.servicio_id,
                tipo_efector = excluded.tipo_efector,
                nombre = excluded.nombre,
                activo = excluded.activo,
                updated_at = now();
            """;

        Execute(sql, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("centro_id", centroId);
            cmd.Parameters.AddWithValue("servicio_id", servicioId);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("activo", activo);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = id.ToString(),
            ["centro_id"] = centroId.ToString(),
            ["servicio_id"] = servicioId.ToString(),
            ["nombre"] = nombre,
            ["activo"] = activo.ToString()
        };
    }

    private IReadOnlyDictionary<string, string?> SaveGrupoProfesional(IReadOnlyDictionary<string, string?> campos)
    {
        var grupoId = TryParseGuid(campos, "grupo_id") ?? Guid.NewGuid();
        var codigo = GetRequired(campos, "grupo_codigo");
        var nombre = GetRequired(campos, "grupo_nombre");
        var centroId = GetRequiredGuid(campos, "grupo_centro_id");
        var servicioId = GetRequiredGuid(campos, "grupo_servicio_id");
        var descripcion = GetOptional(campos, "grupo_descripcion");
        var grupoActivo = ParseBool(campos, "grupo_activo", true);

        const string sqlGrupo = """
            insert into sch_agenda.grupo_profesional
                (id, centro_id, servicio_id, codigo, nombre, descripcion, activo, source_system, source_id, fhir_profile, created_by, updated_by, created_at, updated_at)
            values
                (@id, @centro_id, @servicio_id, @codigo, @nombre, @descripcion, @activo, 'vitalflow-his', @source_id, 'http://hl7.org/fhir/StructureDefinition/Group', 'system', 'system', now(), now())
            on conflict (id) do update
            set centro_id = excluded.centro_id,
                servicio_id = excluded.servicio_id,
                codigo = excluded.codigo,
                nombre = excluded.nombre,
                descripcion = excluded.descripcion,
                activo = excluded.activo,
                updated_at = now(),
                updated_by = 'system';
            """;

        Execute(sqlGrupo, cmd =>
        {
            cmd.Parameters.AddWithValue("id", grupoId);
            cmd.Parameters.AddWithValue("centro_id", centroId);
            cmd.Parameters.AddWithValue("servicio_id", servicioId);
            cmd.Parameters.AddWithValue("codigo", codigo);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("descripcion", (object?)descripcion ?? DBNull.Value);
            cmd.Parameters.AddWithValue("activo", grupoActivo);
            cmd.Parameters.AddWithValue("source_id", grupoId.ToString());
        });

        var miembroEfectorId = TryParseGuid(campos, "miembro_efector_id");
        if (miembroEfectorId.HasValue)
        {
            var miembroId = Guid.NewGuid();
            var miembroRol = GetOptional(campos, "miembro_rol");
            var miembroOrden = ParseNullableInt(campos, "miembro_orden");
            var miembroActivo = ParseBool(campos, "miembro_activo", true);

            const string sqlMiembro = """
                insert into sch_agenda.grupo_profesional_miembro
                    (id, grupo_profesional_id, efector_id, rol, orden, activo, source_system, source_id, fhir_profile, created_by, updated_by, created_at, updated_at)
                values
                    (@id, @grupo_profesional_id, @efector_id, @rol, @orden, @activo, 'vitalflow-his', @source_id, 'http://hl7.org/fhir/StructureDefinition/PractitionerRole', 'system', 'system', now(), now())
                on conflict (grupo_profesional_id, efector_id) do update
                set rol = excluded.rol,
                    orden = excluded.orden,
                    activo = excluded.activo,
                    updated_at = now(),
                    updated_by = 'system';
                """;

            Execute(sqlMiembro, cmd =>
            {
                cmd.Parameters.AddWithValue("id", miembroId);
                cmd.Parameters.AddWithValue("grupo_profesional_id", grupoId);
                cmd.Parameters.AddWithValue("efector_id", miembroEfectorId.Value);
                cmd.Parameters.AddWithValue("rol", (object?)miembroRol ?? DBNull.Value);
                cmd.Parameters.AddWithValue("orden", (object?)miembroOrden ?? DBNull.Value);
                cmd.Parameters.AddWithValue("activo", miembroActivo);
                cmd.Parameters.AddWithValue("source_id", miembroId.ToString());
            });
        }

        return new Dictionary<string, string?>
        {
            ["id"] = grupoId.ToString(),
            ["grupo_id"] = grupoId.ToString(),
            ["grupo_codigo"] = codigo,
            ["grupo_nombre"] = nombre,
            ["grupo_centro_id"] = centroId.ToString(),
            ["grupo_servicio_id"] = servicioId.ToString(),
            ["grupo_descripcion"] = descripcion,
            ["grupo_activo"] = grupoActivo.ToString(),
            ["miembro_efector_id"] = miembroEfectorId?.ToString()
        };
    }

    private IReadOnlyDictionary<string, string?> SaveRolSeguridad(IReadOnlyDictionary<string, string?> campos)
    {
        var id = TryParseGuid(campos, "id") ?? Guid.NewGuid();
        var nombre = GetRequired(campos, "nombre");
        var descripcion = GetOptional(campos, "descripcion");
        var esPredefinido = ParseBool(campos, "es_predefinido", false);

        const string sql = """
            insert into sch_seguridad.rol (id, nombre, descripcion, es_predefinido, created_at)
            values (@id, @nombre, @descripcion, @es_predefinido, now())
            on conflict (id) do update
            set nombre = excluded.nombre,
                descripcion = excluded.descripcion,
                es_predefinido = excluded.es_predefinido;
            """;

        Execute(sql, cmd =>
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("nombre", nombre);
            cmd.Parameters.AddWithValue("descripcion", (object?)descripcion ?? DBNull.Value);
            cmd.Parameters.AddWithValue("es_predefinido", esPredefinido);
        });

        return new Dictionary<string, string?>
        {
            ["id"] = id.ToString(),
            ["nombre"] = nombre,
            ["descripcion"] = descripcion,
            ["es_predefinido"] = esPredefinido.ToString()
        };
    }

    private IReadOnlyList<IReadOnlyDictionary<string, string?>> Query(string sql)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<IReadOnlyDictionary<string, string?>>();
        while (reader.Read())
        {
            var row = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
            for (var i = 0; i < reader.FieldCount; i += 1)
            {
                row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i)?.ToString();
            }

            if (!row.ContainsKey("id") && row.TryGetValue("plan_id", out var planId))
            {
                row["id"] = planId;
            }

            result.Add(row);
        }

        return result;
    }

    private void Execute(string sql, Action<NpgsqlCommand> configure)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        configure(cmd);
        cmd.ExecuteNonQuery();
    }

    private static string GetRequired(IReadOnlyDictionary<string, string?> campos, string key)
    {
        if (!campos.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException($"El campo '{key}' es obligatorio.");
        }

        return value.Trim();
    }

    private static string? GetOptional(IReadOnlyDictionary<string, string?> campos, string key)
    {
        return campos.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value)
            ? value.Trim()
            : null;
    }

    private static Guid GetRequiredGuid(IReadOnlyDictionary<string, string?> campos, string key)
    {
        if (!campos.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value) || !Guid.TryParse(value, out var parsed))
        {
            throw new ArgumentException($"El campo '{key}' debe ser UUID valido.");
        }

        return parsed;
    }

    private static Guid? TryParseGuid(IReadOnlyDictionary<string, string?> campos, string key)
    {
        if (!campos.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return Guid.TryParse(value, out var parsed) ? parsed : null;
    }

    private static bool ParseBool(IReadOnlyDictionary<string, string?> campos, string key, bool fallback)
    {
        if (!campos.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            return fallback;
        }

        return bool.TryParse(value, out var parsed) ? parsed : fallback;
    }

    private static int? ParseNullableInt(IReadOnlyDictionary<string, string?> campos, string key)
    {
        if (!campos.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return int.TryParse(value, out var parsed) ? parsed : null;
    }
}
