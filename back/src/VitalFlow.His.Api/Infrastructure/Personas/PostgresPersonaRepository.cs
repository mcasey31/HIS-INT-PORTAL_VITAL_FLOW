using Npgsql;
using VitalFlow.His.Api.Application.Personas.Contracts;
using VitalFlow.His.Api.Application.Personas.Domain;
using VitalFlow.His.Api.Application.Personas.Repositories;

namespace VitalFlow.His.Api.Infrastructure.Personas;

public sealed class PostgresPersonaRepository(string connectionString) : IPersonaRepository
{
    private const int MinimoPorcentajeCoincidencia = 40;

    public IReadOnlyList<TipoDocumentoResponse> GetTiposDocumento()
    {
        const string sql = """
            select codigo, nombre
            from sch_persona.tipo_documento
            where activo = true
            order by case when codigo = 'DNI' then 0 else 1 end, nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<TipoDocumentoResponse>();
        while (reader.Read())
        {
            result.Add(new TipoDocumentoResponse(
                reader.GetString(0),
                reader.GetString(1)
            ));
        }

        return result;
    }

    public IReadOnlyList<PersonaCandidataResponse> BuscarPorTipoYNumeroDocumento(string tipoDocumento, string numeroDocumento)
    {
        const string sql = """
            select id,
                   apellido,
                   nombre,
                   tipo_documento_codigo,
                   numero_documento,
                   fecha_nacimiento,
                   sexo_biologico,
                     estado,
                     email,
                     telefono
            from sch_persona.persona
            where estado in ('ACTIVO', 'ACTIVA')
              and tipo_documento_codigo = @tipo_documento
              and (
                   upper(numero_documento) = @numero_documento
                   or (
                       @tipo_documento = 'DNI'
                       and @input_tiene_prefijo_mf = false
                       and upper(numero_documento) ~ '^[MF]'
                       and regexp_replace(upper(numero_documento), '^[MF]', '') = @numero_normalizado_dni
                   )
              )
            order by apellido, nombre;
            """;

        var tipo = (tipoDocumento ?? string.Empty).Trim().ToUpperInvariant();
        var numero = (numeroDocumento ?? string.Empty).Trim().ToUpperInvariant();

        if (string.IsNullOrWhiteSpace(tipo) || string.IsNullOrWhiteSpace(numero))
        {
            return [];
        }

        var inputTienePrefijoMf = EmpiezaConMf(numero);
        var numeroNormalizadoDni = NormalizarNumeroDocumentoDni(numero);

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("tipo_documento", tipo);
        cmd.Parameters.AddWithValue("numero_documento", numero);
        cmd.Parameters.AddWithValue("input_tiene_prefijo_mf", inputTienePrefijoMf);
        cmd.Parameters.AddWithValue("numero_normalizado_dni", numeroNormalizadoDni);

        using var reader = cmd.ExecuteReader();

        var result = new List<PersonaCandidataResponse>();
        while (reader.Read())
        {
            var numeroPersona = reader.GetString(4).Trim().ToUpperInvariant();
            var exacta = numeroPersona == numero;

            result.Add(new PersonaCandidataResponse(
                reader.GetGuid(0),
                $"{reader.GetString(1)}, {reader.GetString(2)}",
                reader.GetString(3),
                reader.GetString(4),
                reader.GetFieldValue<DateOnly>(5),
                reader.GetString(6),
                reader.GetString(7),
                exacta ? 100 : 98,
                ReadNullableString(reader, 8),
                ReadNullableString(reader, 9)
            ));
        }

        return result
            .OrderByDescending(c => c.PorcentajeCoincidencia)
            .ThenBy(c => c.ApellidosNombres)
            .ToArray();
    }

    public IReadOnlyList<PersonaCandidataResponse> BuscarPorSetDatosMinimos(BuscarPersonaSetMinimoRequest request)
    {
        const string sql = """
            select id,
                   apellido,
                   nombre,
                   tipo_documento_codigo,
                   numero_documento,
                   fecha_nacimiento,
                   sexo_biologico,
                     estado,
                     email,
                     telefono
            from sch_persona.persona
            where estado in ('ACTIVO', 'ACTIVA')
            order by apellido, nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var candidatos = new List<PersonaCandidataResponse>();
        while (reader.Read())
        {
            var candidato = new PersonaCandidataResponse(
                reader.GetGuid(0),
                $"{reader.GetString(1)}, {reader.GetString(2)}",
                reader.GetString(3),
                reader.GetString(4),
                reader.GetFieldValue<DateOnly>(5),
                reader.GetString(6),
                reader.GetString(7),
                0,
                ReadNullableString(reader, 8),
                ReadNullableString(reader, 9)
            );

            var score = PersonaMatchingEngine.CalcularPorcentajeCoincidencia(request, candidato);
            if (score >= MinimoPorcentajeCoincidencia)
            {
                candidatos.Add(candidato with { PorcentajeCoincidencia = score });
            }
        }

        return candidatos
            .OrderByDescending(c => c.PorcentajeCoincidencia)
            .ThenBy(c => c.ApellidosNombres)
            .ToArray();
    }

    public PersonaCandidataResponse EmpadronarConSetDatosMinimos(BuscarPersonaSetMinimoRequest request)
    {
        const string sql = """
            insert into sch_persona.persona(
                id,
                apellido,
                nombre,
                tipo_documento_codigo,
                numero_documento,
                fecha_nacimiento,
                sexo_biologico,
                email,
                telefono,
                estado,
                created_at,
                updated_at
            )
            values (
                @id,
                @apellido,
                @nombre,
                @tipo_documento,
                @numero_documento,
                @fecha_nacimiento,
                @sexo_biologico,
                @email,
                @telefono,
                'ACTIVO',
                now(),
                now()
            );
            """;

        var data = NormalizarSetMinimoRequest(request);
        var id = Guid.NewGuid();

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using (var cmd = new NpgsqlCommand(sql, conn))
        {
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("apellido", data.Apellido);
            cmd.Parameters.AddWithValue("nombre", data.Nombre);
            cmd.Parameters.AddWithValue("tipo_documento", data.TipoDocumento);
            cmd.Parameters.AddWithValue("numero_documento", data.NumeroDocumento);
            cmd.Parameters.AddWithValue("fecha_nacimiento", data.FechaNacimiento);
            cmd.Parameters.AddWithValue("sexo_biologico", data.SexoBiologico);
            cmd.Parameters.AddWithValue("email", (object?)data.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("telefono", (object?)data.Telefono ?? DBNull.Value);
            cmd.ExecuteNonQuery();
        }

        return ObtenerPorId(conn, id) ?? throw new InvalidOperationException("No se pudo empadronar la persona.");
    }

    public PersonaCandidataResponse ActualizarSetDatosMinimos(Guid personaId, BuscarPersonaSetMinimoRequest request)
    {
        const string sql = """
            update sch_persona.persona
            set apellido = @apellido,
                nombre = @nombre,
                tipo_documento_codigo = @tipo_documento,
                numero_documento = @numero_documento,
                fecha_nacimiento = @fecha_nacimiento,
                sexo_biologico = @sexo_biologico,
                                email = @email,
                                telefono = @telefono,
                updated_at = now()
            where id = @id
              and estado in ('ACTIVO', 'ACTIVA');
            """;

        var data = NormalizarSetMinimoRequest(request);

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using (var cmd = new NpgsqlCommand(sql, conn))
        {
            cmd.Parameters.AddWithValue("id", personaId);
            cmd.Parameters.AddWithValue("apellido", data.Apellido);
            cmd.Parameters.AddWithValue("nombre", data.Nombre);
            cmd.Parameters.AddWithValue("tipo_documento", data.TipoDocumento);
            cmd.Parameters.AddWithValue("numero_documento", data.NumeroDocumento);
            cmd.Parameters.AddWithValue("fecha_nacimiento", data.FechaNacimiento);
            cmd.Parameters.AddWithValue("sexo_biologico", data.SexoBiologico);
            cmd.Parameters.AddWithValue("email", (object?)data.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("telefono", (object?)data.Telefono ?? DBNull.Value);

            var affected = cmd.ExecuteNonQuery();
            if (affected == 0)
            {
                throw new InvalidOperationException("No se encontro la persona activa para actualizar.");
            }
        }

        return ObtenerPorId(conn, personaId) ?? throw new InvalidOperationException("No se pudo recuperar la persona actualizada.");
    }

    private static PersonaCandidataResponse? ObtenerPorId(NpgsqlConnection conn, Guid id)
    {
        const string sql = """
            select id,
                   apellido,
                   nombre,
                   tipo_documento_codigo,
                   numero_documento,
                   fecha_nacimiento,
                   sexo_biologico,
                     estado,
                     email,
                     telefono
            from sch_persona.persona
            where id = @id;
            """;

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", id);
        using var reader = cmd.ExecuteReader();

        if (!reader.Read())
        {
            return null;
        }

        return new PersonaCandidataResponse(
            reader.GetGuid(0),
            $"{reader.GetString(1)}, {reader.GetString(2)}",
            reader.GetString(3),
            reader.GetString(4),
            reader.GetFieldValue<DateOnly>(5),
            reader.GetString(6),
            reader.GetString(7),
            100,
            ReadNullableString(reader, 8),
            ReadNullableString(reader, 9)
        );
    }

    private static BuscarPersonaSetMinimoRequest NormalizarSetMinimoRequest(BuscarPersonaSetMinimoRequest request)
    {
        return request with
        {
            TipoDocumento = PersonaMatchingEngine.NormalizarTexto(request.TipoDocumento),
            NumeroDocumento = PersonaMatchingEngine.NormalizarTexto(request.NumeroDocumento),
            Nombre = request.Nombre.Trim(),
            Apellido = request.Apellido.Trim(),
            SexoBiologico = PersonaMatchingEngine.NormalizarTexto(request.SexoBiologico)
        };
    }

    private static bool EmpiezaConMf(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var first = value.Trim().ToUpperInvariant()[0];
        return first == 'M' || first == 'F';
    }

    private static string NormalizarNumeroDocumentoDni(string value)
    {
        var raw = PersonaMatchingEngine.NormalizarTexto(value);
        if (raw.Length > 1 && EmpiezaConMf(raw))
        {
            return raw[1..];
        }

        return raw;
    }

    public DomicilioResponse? GetDomicilio(Guid personaId)
    {
        const string sql = """
            SELECT id, persona_id, localidad_id, pais, provincia, localidad,
                   calle, numero, barrio, codigo_postal, piso, departamento, comentario
            FROM sch_persona.domicilio
            WHERE persona_id = @personaId AND activo = true
            ORDER BY created_at DESC
            LIMIT 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("personaId", personaId);
        using var reader = cmd.ExecuteReader();

        if (!reader.Read()) return null;

        return new DomicilioResponse(
            reader.GetGuid(0),
            reader.GetGuid(1),
            reader.IsDBNull(2) ? null : reader.GetString(2),
            reader.GetString(3),
            reader.GetString(4),
            reader.GetString(5),
            reader.GetString(6),
            reader.GetString(7),
            reader.GetString(8),
            reader.GetString(9),
            reader.GetString(10),
            reader.GetString(11),
            reader.GetString(12)
        );
    }

    public DomicilioResponse UpsertDomicilio(Guid personaId, DomicilioRequest request)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        if (!string.IsNullOrWhiteSpace(request.LocalidadId))
        {
            const string checkSql = "SELECT 1 FROM sch_ubicacion.localidad WHERE id = @localidadId AND activo = true;";
            using var checkCmd = new NpgsqlCommand(checkSql, conn);
            checkCmd.Parameters.AddWithValue("localidadId", request.LocalidadId);
            if (checkCmd.ExecuteScalar() is null)
            {
                throw new ArgumentException($"La localidad con id '{request.LocalidadId}' no existe o no esta activa.");
            }
        }

        using var tx = conn.BeginTransaction();

        var existingId = GetActiveDomicilioId(conn, personaId);

        if (existingId is not null)
        {
            const string sql = """
                UPDATE sch_persona.domicilio
                SET localidad_id = @localidadId,
                    pais = @pais,
                    provincia = @provincia,
                    localidad = @localidad,
                    calle = @calle,
                    numero = @numero,
                    barrio = @barrio,
                    codigo_postal = @codigoPostal,
                    piso = @piso,
                    departamento = @departamento,
                    comentario = @comentario,
                    updated_at = now()
                WHERE id = @id;
                """;

            using var cmd = new NpgsqlCommand(sql, conn, tx);
            cmd.Parameters.AddWithValue("id", existingId.Value);
            AddDomicilioParameters(cmd, request);
            cmd.ExecuteNonQuery();
        }
        else
        {
            const string sql = """
                INSERT INTO sch_persona.domicilio (id, persona_id, localidad_id, pais, provincia, localidad,
                    calle, numero, barrio, codigo_postal, piso, departamento, comentario)
                VALUES (@id, @personaId, @localidadId, @pais, @provincia, @localidad,
                    @calle, @numero, @barrio, @codigoPostal, @piso, @departamento, @comentario);
                """;

            using var cmd = new NpgsqlCommand(sql, conn, tx);
            cmd.Parameters.AddWithValue("id", Guid.NewGuid());
            cmd.Parameters.AddWithValue("personaId", personaId);
            AddDomicilioParameters(cmd, request);
            cmd.ExecuteNonQuery();
        }

        tx.Commit();

        return GetDomicilio(personaId)!;
    }

    private static Guid? GetActiveDomicilioId(NpgsqlConnection conn, Guid personaId)
    {
        const string sql = "SELECT id FROM sch_persona.domicilio WHERE persona_id = @personaId AND activo = true LIMIT 1;";
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("personaId", personaId);
        var result = cmd.ExecuteScalar();
        return result is not null ? (Guid)result : null;
    }

    private static void AddDomicilioParameters(NpgsqlCommand cmd, DomicilioRequest request)
    {
        cmd.Parameters.AddWithValue("localidadId", (object?)request.LocalidadId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("pais", (object?)request.Pais ?? "");
        cmd.Parameters.AddWithValue("provincia", (object?)request.Provincia ?? "");
        cmd.Parameters.AddWithValue("localidad", (object?)request.Localidad ?? "");
        cmd.Parameters.AddWithValue("calle", (object?)request.Calle ?? "");
        cmd.Parameters.AddWithValue("numero", (object?)request.Numero ?? "");
        cmd.Parameters.AddWithValue("barrio", (object?)request.Barrio ?? "");
        cmd.Parameters.AddWithValue("codigoPostal", (object?)request.CodigoPostal ?? "");
        cmd.Parameters.AddWithValue("piso", (object?)request.Piso ?? "");
        cmd.Parameters.AddWithValue("departamento", (object?)request.Departamento ?? "");
        cmd.Parameters.AddWithValue("comentario", (object?)request.Comentario ?? "");
    }

    private static string? ReadNullableString(NpgsqlDataReader reader, int ordinal)
    {
        if (reader.IsDBNull(ordinal))
        {
            return null;
        }

        var value = reader.GetString(ordinal).Trim();
        return value.Length == 0 ? null : value;
    }

    public IReadOnlyList<PersonaContactoResponse> GetContactos(Guid personaId)
    {
        const string sql = """
            SELECT id, persona_id, nombre, apellido, tipo_documento, numero_documento,
                   fecha_nacimiento, sexo_biologico, telefono, email
            FROM sch_persona.persona_contacto
            WHERE persona_id = @personaId AND activo = true
            ORDER BY created_at;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("personaId", personaId);
        using var reader = cmd.ExecuteReader();

        var result = new List<PersonaContactoResponse>();
        while (reader.Read())
        {
            result.Add(new PersonaContactoResponse(
                reader.GetGuid(0),
                reader.GetGuid(1),
                reader.GetString(2),
                reader.GetString(3),
                reader.GetString(4),
                reader.GetString(5),
                reader.GetFieldValue<DateOnly>(6).ToString("yyyy-MM-dd"),
                reader.GetString(7),
                reader.GetString(8),
                reader.GetString(9)
            ));
        }

        return result;
    }

    public PersonaContactoResponse CreateContacto(Guid personaId, PersonaContactoRequest request)
    {
        const string sql = """
            INSERT INTO sch_persona.persona_contacto
                (id, persona_id, nombre, apellido, tipo_documento, numero_documento,
                 fecha_nacimiento, sexo_biologico, telefono, email)
            VALUES
                (@id, @personaId, @nombre, @apellido, @tipoDocumento, @numeroDocumento,
                 @fechaNacimiento, @sexoBiologico, @telefono, @email)
            RETURNING id, persona_id, nombre, apellido, tipo_documento, numero_documento,
                      fecha_nacimiento, sexo_biologico, telefono, email;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        var id = Guid.NewGuid();
        cmd.Parameters.AddWithValue("id", id);
        cmd.Parameters.AddWithValue("personaId", personaId);
        cmd.Parameters.AddWithValue("nombre", request.Nombre);
        cmd.Parameters.AddWithValue("apellido", request.Apellido);
        cmd.Parameters.AddWithValue("tipoDocumento", request.TipoDocumento);
        cmd.Parameters.AddWithValue("numeroDocumento", request.NumeroDocumento);
        cmd.Parameters.AddWithValue("fechaNacimiento", DateOnly.Parse(request.FechaNacimiento));
        cmd.Parameters.AddWithValue("sexoBiologico", request.SexoBiologico);
        cmd.Parameters.AddWithValue("telefono", (object?)request.Telefono ?? "");
        cmd.Parameters.AddWithValue("email", (object?)request.Email ?? "");

        using var reader = cmd.ExecuteReader();
        reader.Read();
        return new PersonaContactoResponse(
            reader.GetGuid(0),
            reader.GetGuid(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetString(4),
            reader.GetString(5),
            reader.GetFieldValue<DateOnly>(6).ToString("yyyy-MM-dd"),
            reader.GetString(7),
            reader.GetString(8),
            reader.GetString(9)
        );
    }

    public PersonaContactoResponse UpdateContacto(Guid contactoId, PersonaContactoRequest request)
    {
        const string sql = """
            UPDATE sch_persona.persona_contacto
            SET nombre = @nombre,
                apellido = @apellido,
                tipo_documento = @tipoDocumento,
                numero_documento = @numeroDocumento,
                fecha_nacimiento = @fechaNacimiento,
                sexo_biologico = @sexoBiologico,
                telefono = @telefono,
                email = @email,
                updated_at = now()
            WHERE id = @id AND activo = true
            RETURNING id, persona_id, nombre, apellido, tipo_documento, numero_documento,
                      fecha_nacimiento, sexo_biologico, telefono, email;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", contactoId);
        cmd.Parameters.AddWithValue("nombre", request.Nombre);
        cmd.Parameters.AddWithValue("apellido", request.Apellido);
        cmd.Parameters.AddWithValue("tipoDocumento", request.TipoDocumento);
        cmd.Parameters.AddWithValue("numeroDocumento", request.NumeroDocumento);
        cmd.Parameters.AddWithValue("fechaNacimiento", DateOnly.Parse(request.FechaNacimiento));
        cmd.Parameters.AddWithValue("sexoBiologico", request.SexoBiologico);
        cmd.Parameters.AddWithValue("telefono", (object?)request.Telefono ?? "");
        cmd.Parameters.AddWithValue("email", (object?)request.Email ?? "");

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
            throw new InvalidOperationException("No se encontro la persona de contacto.");

        return new PersonaContactoResponse(
            reader.GetGuid(0),
            reader.GetGuid(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetString(4),
            reader.GetString(5),
            reader.GetFieldValue<DateOnly>(6).ToString("yyyy-MM-dd"),
            reader.GetString(7),
            reader.GetString(8),
            reader.GetString(9)
        );
    }

    public void DeleteContactos(Guid personaId, IReadOnlyList<Guid> contactoIds)
    {
        const string sql = """
            UPDATE sch_persona.persona_contacto
            SET activo = false, updated_at = now()
            WHERE persona_id = @personaId AND id = ANY(@ids);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("personaId", personaId);
        cmd.Parameters.AddWithValue("ids", contactoIds.Select(id => id).ToArray());
        cmd.ExecuteNonQuery();
    }
}

