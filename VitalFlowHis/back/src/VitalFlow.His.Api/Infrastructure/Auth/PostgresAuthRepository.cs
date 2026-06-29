using Npgsql;
using VitalFlow.His.Api.Application.Auth.Repositories;

namespace VitalFlow.His.Api.Infrastructure.Auth;

public sealed class PostgresAuthRepository(string connectionString) : IAuthRepository
{
    public IReadOnlyList<AuthCentroRow> GetActiveCentros()
    {
        const string sql = """
            select c.id, c.nombre
            from sch_agenda.centro c
            where c.activo = true
            order by c.nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        using var reader = cmd.ExecuteReader();

        var result = new List<AuthCentroRow>();
        while (reader.Read())
        {
            result.Add(new AuthCentroRow(reader.GetGuid(0), reader.GetString(1)));
        }

        return result;
    }

    public AuthUserRow? GetUserByUsername(string username)
    {
        const string sql = """
            select u.id,
                   u.persona_id,
                   u.username,
                   u.password_hash,
                   u.estado,
                 coalesce(array_agg(r.nombre) filter (where r.nombre is not null), '{}') as roles,
                   case
                       when bool_or(lower(r.nombre) = 'administrador') then 'global'
                       when count(distinct ur.centro_id) > 1 then 'global'
                       else coalesce(min(ur.centro_id::text), 'global')
                   end as centro_id
            from sch_seguridad.usuario_sistema u
            left join sch_seguridad.usuario_rol ur on ur.usuario_id = u.id
            left join sch_seguridad.rol r on r.id = ur.rol_id
            where lower(u.username) = lower(@username)
            group by u.id, u.username, u.password_hash, u.estado;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("username", username.Trim());

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        var roles = reader.GetFieldValue<string[]>(5);

        return new AuthUserRow(
            reader.GetGuid(0),
            reader.IsDBNull(1) ? null : reader.GetGuid(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetString(4),
            roles,
            reader.IsDBNull(6) ? null : reader.GetString(6));
    }

    public AuthUserRow? GetUserById(Guid userId)
    {
        const string sql = """
            select u.id,
                   u.persona_id,
                   u.username,
                   u.password_hash,
                   u.estado,
                 coalesce(array_agg(r.nombre) filter (where r.nombre is not null), '{}') as roles,
                   case
                       when bool_or(lower(r.nombre) = 'administrador') then 'global'
                       when count(distinct ur.centro_id) > 1 then 'global'
                       else coalesce(min(ur.centro_id::text), 'global')
                   end as centro_id
            from sch_seguridad.usuario_sistema u
            left join sch_seguridad.usuario_rol ur on ur.usuario_id = u.id
            left join sch_seguridad.rol r on r.id = ur.rol_id
            where u.id = @user_id
            group by u.id, u.username, u.password_hash, u.estado;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("user_id", userId);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        var roles = reader.GetFieldValue<string[]>(5);

        return new AuthUserRow(
            reader.GetGuid(0),
                        reader.IsDBNull(1) ? null : reader.GetGuid(1),
                        reader.GetString(2),
                        reader.GetString(3),
                        reader.GetString(4),
            roles,
                        reader.IsDBNull(6) ? null : reader.GetString(6));
        }

        public bool UserHasCentro(Guid userId, Guid centroId)
        {
                const string sql = """
                        select 1
                        from sch_seguridad.usuario_rol ur
                        where ur.usuario_id = @user_id
                            and ur.centro_id = @centro_id
                        limit 1;
                        """;

                using var conn = new NpgsqlConnection(connectionString);
                conn.Open();

                using var cmd = new NpgsqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("user_id", userId);
                cmd.Parameters.AddWithValue("centro_id", centroId);

                return cmd.ExecuteScalar() is not null;
    }

    public AuthRefreshTokenRow? GetActiveRefreshToken(string tokenHash)
    {
        const string sql = """
            select id,
                   usuario_id,
                   token_hash,
                   expires_at,
                   revoked_at
            from sch_seguridad.refresh_token
            where token_hash = @token_hash
              and revoked_at is null
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("token_hash", tokenHash);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read())
        {
            return null;
        }

        return new AuthRefreshTokenRow(
            reader.GetGuid(0),
            reader.GetGuid(1),
            reader.GetString(2),
            reader.GetFieldValue<DateTimeOffset>(3),
            reader.IsDBNull(4) ? null : reader.GetFieldValue<DateTimeOffset>(4));
    }

    public void InsertRefreshToken(CreateRefreshTokenRow row)
    {
        const string sql = """
            insert into sch_seguridad.refresh_token(
                id,
                usuario_id,
                token_hash,
                expires_at,
                revoked_at,
                replaced_by_token_hash,
                created_ip,
                user_agent,
                created_at
            )
            values (
                @id,
                @usuario_id,
                @token_hash,
                @expires_at,
                null,
                null,
                @created_ip,
                @user_agent,
                now()
            );
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", row.Id);
        cmd.Parameters.AddWithValue("usuario_id", row.UsuarioId);
        cmd.Parameters.AddWithValue("token_hash", row.TokenHash);
        cmd.Parameters.AddWithValue("expires_at", row.ExpiresAt);
        cmd.Parameters.AddWithValue("created_ip", (object?)row.CreatedIp ?? DBNull.Value);
        cmd.Parameters.AddWithValue("user_agent", (object?)row.UserAgent ?? DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void RevokeRefreshToken(Guid tokenId, DateTimeOffset revokedAt, string? replacedByTokenHash)
    {
        const string sql = """
            update sch_seguridad.refresh_token
            set revoked_at = @revoked_at,
                replaced_by_token_hash = @replaced_by_token_hash
            where id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", tokenId);
        cmd.Parameters.AddWithValue("revoked_at", revokedAt);
        cmd.Parameters.AddWithValue("replaced_by_token_hash", (object?)replacedByTokenHash ?? DBNull.Value);
        cmd.ExecuteNonQuery();
    }

    public void UpdateUltimoLogin(Guid userId, DateTimeOffset loginAt)
    {
        const string sql = """
            update sch_seguridad.usuario_sistema
            set ultimo_login = @login_at,
                updated_at = now()
            where id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", userId);
        cmd.Parameters.AddWithValue("login_at", loginAt);
        cmd.ExecuteNonQuery();
    }

    public void UpdatePassword(Guid userId, string passwordHash, string estado)
    {
        const string sql = """
            update sch_seguridad.usuario_sistema
            set password_hash = @password_hash,
                estado = @estado,
                updated_at = now()
            where id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", userId);
        cmd.Parameters.AddWithValue("password_hash", passwordHash);
        cmd.Parameters.AddWithValue("estado", estado);
        cmd.ExecuteNonQuery();
    }

    public void UpdateEstado(Guid userId, string estado)
    {
        const string sql = """
            update sch_seguridad.usuario_sistema
            set estado = @estado,
                updated_at = now()
            where id = @id;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", userId);
        cmd.Parameters.AddWithValue("estado", estado);
        cmd.ExecuteNonQuery();
    }

    public bool PersonaExists(Guid personaId)
    {
        const string sql = """
            select 1
            from sch_persona.persona
            where id = @persona_id
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("persona_id", personaId);
        return cmd.ExecuteScalar() is not null;
    }

    public bool CentroExists(Guid centroId)
    {
        const string sql = """
            select 1
            from sch_agenda.centro
            where id = @centro_id
              and activo = true
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", centroId);
        return cmd.ExecuteScalar() is not null;
    }

    public bool ServicioExists(Guid centroId, Guid servicioId)
    {
        const string sql = """
            select 1
            from sch_agenda.servicio
            where id = @servicio_id
              and centro_id = @centro_id
                            and activo = true
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("centro_id", centroId);
        cmd.Parameters.AddWithValue("servicio_id", servicioId);
        return cmd.ExecuteScalar() is not null;
    }

    public string? GetPersonaNombreCompleto(Guid personaId)
    {
        const string sql = """
            select trim(concat_ws(' ', apellido, nombre))
            from sch_persona.persona
            where id = @persona_id
            limit 1;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("persona_id", personaId);
        var value = cmd.ExecuteScalar();
        return value is null or DBNull ? null : value.ToString();
    }

    public bool RolesExist(IReadOnlyList<string> roleNames)
    {
        if (roleNames.Count == 0)
        {
            return false;
        }

        const string sql = """
            select count(*)
            from sch_seguridad.rol
            where lower(nombre) = any(@role_names);
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        var normalizedRoleNames = roleNames
            .Select(role => role.Trim().ToLowerInvariant())
            .Distinct(StringComparer.Ordinal)
            .ToArray();

        cmd.Parameters.AddWithValue("role_names", normalizedRoleNames);
        var count = (long)(cmd.ExecuteScalar() ?? 0L);
        return count == normalizedRoleNames.Length;
    }

    public Guid CreateSystemUser(Guid personaId, string username, string passwordHash, string estado, Guid centroId, Guid servicioId, string? matriculaProvincial, string? matriculaNacional, bool allCentros, IReadOnlyList<string> roleNames)
    {
        const string sqlRoleIds = """
            select id, nombre
            from sch_seguridad.rol
            where lower(nombre) = any(@role_names);
            """;

        const string sqlInsertUser = """
            insert into sch_seguridad.usuario_sistema (
                id,
                persona_id,
                username,
                password_hash,
                estado,
                ultimo_login,
                created_at,
                updated_at
            )
            values (
                @id,
                @persona_id,
                @username,
                @password_hash,
                @estado,
                null,
                now(),
                now()
            );
            """;

        const string sqlInsertUserRole = """
            insert into sch_seguridad.usuario_rol (usuario_id, rol_id, centro_id, servicio_id, created_at)
            values (@usuario_id, @rol_id, @centro_id, @servicio_id, now())
            on conflict (usuario_id, rol_id, centro_id) do update
            set servicio_id = excluded.servicio_id;
            """;

        const string sqlAllCentros = """
            select id
            from sch_agenda.centro
            where activo = true
            order by nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var tx = conn.BeginTransaction();
        try
        {
            var normalizedRoleNames = roleNames
                .Where(role => !string.IsNullOrWhiteSpace(role))
                .Select(role => role.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();

            var roleIds = new List<Guid>();
            var roleNamesById = new Dictionary<Guid, string>();
            var centrosAsignacion = new List<Guid>();
            var nombrePersona = GetPersonaNombreCompleto(personaId);
            var requiereEfector = normalizedRoleNames.Any(role => string.Equals(role, "Medico", StringComparison.OrdinalIgnoreCase));

            using (var cmdRole = new NpgsqlCommand(sqlRoleIds, conn, tx))
            {
                var roleNamesLower = normalizedRoleNames.Select(role => role.ToLowerInvariant()).ToArray();
                cmdRole.Parameters.AddWithValue("role_names", roleNamesLower);

                using var roleReader = cmdRole.ExecuteReader();
                while (roleReader.Read())
                {
                    var roleId = roleReader.GetGuid(0);
                    roleIds.Add(roleId);
                    roleNamesById[roleId] = roleReader.GetString(1);
                }

                if (roleIds.Count != normalizedRoleNames.Length)
                {
                    throw new InvalidOperationException("Uno o mas roles indicados no existen.");
                }
            }

            var userId = Guid.NewGuid();

            if (allCentros)
            {
                using var cmdCentros = new NpgsqlCommand(sqlAllCentros, conn, tx);
                using var centrosReader = cmdCentros.ExecuteReader();
                while (centrosReader.Read())
                {
                    centrosAsignacion.Add(centrosReader.GetGuid(0));
                }

                if (centrosAsignacion.Count == 0)
                {
                    throw new InvalidOperationException("No hay centros activos para asignar el alcance del rol.");
                }
            }
            else
            {
                centrosAsignacion.Add(centroId);
            }

            if (requiereEfector)
            {
                if (servicioId == Guid.Empty)
                {
                    throw new InvalidOperationException("El rol Medico requiere un servicio.");
                }

                if (string.IsNullOrWhiteSpace(nombrePersona))
                {
                    throw new InvalidOperationException("No se pudo determinar el nombre de la persona para crear el efector.");
                }
            }

            using (var cmdUser = new NpgsqlCommand(sqlInsertUser, conn, tx))
            {
                cmdUser.Parameters.AddWithValue("id", userId);
                cmdUser.Parameters.AddWithValue("persona_id", personaId);
                cmdUser.Parameters.AddWithValue("username", username);
                cmdUser.Parameters.AddWithValue("password_hash", passwordHash);
                cmdUser.Parameters.AddWithValue("estado", estado);
                cmdUser.ExecuteNonQuery();
            }

            foreach (var roleId in roleIds)
            {
                foreach (var centroAsignadoId in centrosAsignacion)
                {
                    var requiereServicioEnRol = requiereEfector
                        && roleNamesById.TryGetValue(roleId, out var roleName)
                        && string.Equals(roleName, "Medico", StringComparison.OrdinalIgnoreCase);
                    var servicioParam = requiereServicioEnRol ? (object)servicioId : DBNull.Value;

                    using var cmdUserRole = new NpgsqlCommand(sqlInsertUserRole, conn, tx);
                    cmdUserRole.Parameters.AddWithValue("usuario_id", userId);
                    cmdUserRole.Parameters.AddWithValue("rol_id", roleId);
                    cmdUserRole.Parameters.AddWithValue("centro_id", centroAsignadoId);
                    cmdUserRole.Parameters.AddWithValue("servicio_id", servicioParam);
                    cmdUserRole.ExecuteNonQuery();
                }
            }

            if (requiereEfector)
            {
                var nombreEfector = BuildEfectorNombre(nombrePersona!, matriculaProvincial, matriculaNacional);
                UpsertEfectorByUsuario(conn, tx, userId, centroId, servicioId, nombreEfector, matriculaProvincial, matriculaNacional, true);
            }

            tx.Commit();
            return userId;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public void UpdateSystemUser(Guid userId, string username, string estado, Guid centroId, Guid servicioId, string? matriculaProvincial, string? matriculaNacional, bool allCentros, IReadOnlyList<string> roleNames)
    {
        const string sqlRoleIds = """
            select id, nombre
            from sch_seguridad.rol
            where lower(nombre) = any(@role_names);
            """;

        const string sqlUpdateUser = """
            update sch_seguridad.usuario_sistema
            set username = @username,
                estado = @estado,
                updated_at = now()
            where id = @id;
            """;

        const string sqlDeleteUserRoles = """
            delete from sch_seguridad.usuario_rol
            where usuario_id = @usuario_id;
            """;

        const string sqlInsertUserRole = """
            insert into sch_seguridad.usuario_rol (usuario_id, rol_id, centro_id, servicio_id, created_at)
            values (@usuario_id, @rol_id, @centro_id, @servicio_id, now())
            on conflict (usuario_id, rol_id, centro_id) do update
            set servicio_id = excluded.servicio_id;
            """;

        const string sqlDisableEfector = """
            update sch_agenda.efector
            set activo = false,
                updated_at = now()
            where usuario_id = @user_id
               or id = @user_id;
            """;

        const string sqlPersonaNombreByUserId = """
            select trim(concat_ws(' ', p.apellido, p.nombre))
            from sch_seguridad.usuario_sistema u
            left join sch_persona.persona p on p.id = u.persona_id
            where u.id = @user_id
            limit 1;
            """;

        const string sqlAllCentros = """
            select id
            from sch_agenda.centro
            where activo = true
            order by nombre;
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var tx = conn.BeginTransaction();
        try
        {
            var normalizedRoleNames = roleNames
                .Where(role => !string.IsNullOrWhiteSpace(role))
                .Select(role => role.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();

            var roleIds = new List<Guid>();
            var roleNamesById = new Dictionary<Guid, string>();
            var centrosAsignacion = new List<Guid>();
            var requiereEfector = normalizedRoleNames.Any(role => string.Equals(role, "Medico", StringComparison.OrdinalIgnoreCase));

            using (var cmdRole = new NpgsqlCommand(sqlRoleIds, conn, tx))
            {
                var roleNamesLower = normalizedRoleNames.Select(role => role.ToLowerInvariant()).ToArray();
                cmdRole.Parameters.AddWithValue("role_names", roleNamesLower);

                using var roleReader = cmdRole.ExecuteReader();
                while (roleReader.Read())
                {
                    var roleId = roleReader.GetGuid(0);
                    roleIds.Add(roleId);
                    roleNamesById[roleId] = roleReader.GetString(1);
                }

                if (roleIds.Count != normalizedRoleNames.Length)
                {
                    throw new InvalidOperationException("Uno o mas roles indicados no existen.");
                }
            }

            if (allCentros)
            {
                using var cmdCentros = new NpgsqlCommand(sqlAllCentros, conn, tx);
                using var centrosReader = cmdCentros.ExecuteReader();
                while (centrosReader.Read())
                {
                    centrosAsignacion.Add(centrosReader.GetGuid(0));
                }

                if (centrosAsignacion.Count == 0)
                {
                    throw new InvalidOperationException("No hay centros activos para asignar el alcance del rol.");
                }
            }
            else
            {
                centrosAsignacion.Add(centroId);
            }

            using (var cmdUser = new NpgsqlCommand(sqlUpdateUser, conn, tx))
            {
                cmdUser.Parameters.AddWithValue("id", userId);
                cmdUser.Parameters.AddWithValue("username", username);
                cmdUser.Parameters.AddWithValue("estado", estado);
                cmdUser.ExecuteNonQuery();
            }

            using (var cmdDeleteRoles = new NpgsqlCommand(sqlDeleteUserRoles, conn, tx))
            {
                cmdDeleteRoles.Parameters.AddWithValue("usuario_id", userId);
                cmdDeleteRoles.ExecuteNonQuery();
            }

            foreach (var roleId in roleIds)
            {
                foreach (var centroAsignadoId in centrosAsignacion)
                {
                    var requiereServicioEnRol = requiereEfector
                        && roleNamesById.TryGetValue(roleId, out var roleName)
                        && string.Equals(roleName, "Medico", StringComparison.OrdinalIgnoreCase);
                    var servicioParam = requiereServicioEnRol ? (object)servicioId : DBNull.Value;

                    using var cmdUserRole = new NpgsqlCommand(sqlInsertUserRole, conn, tx);
                    cmdUserRole.Parameters.AddWithValue("usuario_id", userId);
                    cmdUserRole.Parameters.AddWithValue("rol_id", roleId);
                    cmdUserRole.Parameters.AddWithValue("centro_id", centroAsignadoId);
                    cmdUserRole.Parameters.AddWithValue("servicio_id", servicioParam);
                    cmdUserRole.ExecuteNonQuery();
                }
            }

            if (requiereEfector)
            {
                string? nombrePersona;
                using (var cmdNombre = new NpgsqlCommand(sqlPersonaNombreByUserId, conn, tx))
                {
                    cmdNombre.Parameters.AddWithValue("user_id", userId);
                    var value = cmdNombre.ExecuteScalar();
                    nombrePersona = value is null or DBNull ? null : value.ToString();
                }

                if (string.IsNullOrWhiteSpace(nombrePersona))
                {
                    throw new InvalidOperationException("No se pudo determinar el nombre de la persona para sincronizar el efector medico.");
                }

                var nombreEfector = BuildEfectorNombre(nombrePersona, matriculaProvincial, matriculaNacional);
                UpsertEfectorByUsuario(
                    conn,
                    tx,
                    userId,
                    centroId,
                    servicioId,
                    nombreEfector,
                    matriculaProvincial,
                    matriculaNacional,
                    string.Equals(estado, "ACTIVO", StringComparison.OrdinalIgnoreCase));
            }
            else
            {
                using var cmdDisableEfector = new NpgsqlCommand(sqlDisableEfector, conn, tx);
                cmdDisableEfector.Parameters.AddWithValue("user_id", userId);
                cmdDisableEfector.ExecuteNonQuery();
            }

            tx.Commit();
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    private static string BuildEfectorNombre(string nombrePersona, string? matriculaProvincial, string? matriculaNacional)
    {
        var partes = new List<string>();
        if (!string.IsNullOrWhiteSpace(matriculaProvincial))
        {
            partes.Add(matriculaProvincial.Trim().ToUpperInvariant());
        }

        if (!string.IsNullOrWhiteSpace(matriculaNacional))
        {
            partes.Add(matriculaNacional.Trim().ToUpperInvariant());
        }

        if (partes.Count == 0)
        {
            return nombrePersona;
        }

        return $"{nombrePersona} - {string.Join(" / ", partes)}";
    }

    private static void UpsertEfectorByUsuario(
        NpgsqlConnection conn,
        NpgsqlTransaction tx,
        Guid userId,
        Guid centroId,
        Guid servicioId,
        string nombre,
        string? matriculaProvincial,
        string? matriculaNacional,
        bool activo)
    {
        const string sqlUpdateByUsuario = """
            update sch_agenda.efector
            set centro_id = @centro_id,
                servicio_id = @servicio_id,
                tipo_efector = 'PROFESIONAL',
                nombre = @nombre,
                matricula_provincial = @matricula_provincial,
                matricula_nacional = @matricula_nacional,
                activo = @activo,
                updated_at = now()
            where usuario_id = @usuario_id;
            """;

        const string sqlUpdateLegacyById = """
            update sch_agenda.efector
            set usuario_id = @usuario_id,
                centro_id = @centro_id,
                servicio_id = @servicio_id,
                tipo_efector = 'PROFESIONAL',
                nombre = @nombre,
                matricula_provincial = @matricula_provincial,
                matricula_nacional = @matricula_nacional,
                activo = @activo,
                updated_at = now()
            where id = @id;
            """;

        const string sqlInsert = """
            insert into sch_agenda.efector (
                id,
                usuario_id,
                centro_id,
                servicio_id,
                tipo_efector,
                nombre,
                matricula_provincial,
                matricula_nacional,
                activo,
                created_at,
                updated_at
            )
            values (
                @id,
                @usuario_id,
                @centro_id,
                @servicio_id,
                'PROFESIONAL',
                @nombre,
                @matricula_provincial,
                @matricula_nacional,
                @activo,
                now(),
                now()
            );
            """;

        using var cmdUpdateByUsuario = new NpgsqlCommand(sqlUpdateByUsuario, conn, tx);
        cmdUpdateByUsuario.Parameters.AddWithValue("usuario_id", userId);
        cmdUpdateByUsuario.Parameters.AddWithValue("centro_id", centroId);
        cmdUpdateByUsuario.Parameters.AddWithValue("servicio_id", servicioId);
        cmdUpdateByUsuario.Parameters.AddWithValue("nombre", nombre);
        cmdUpdateByUsuario.Parameters.AddWithValue("matricula_provincial", (object?)matriculaProvincial ?? DBNull.Value);
        cmdUpdateByUsuario.Parameters.AddWithValue("matricula_nacional", (object?)matriculaNacional ?? DBNull.Value);
        cmdUpdateByUsuario.Parameters.AddWithValue("activo", activo);

        var updatedByUsuario = cmdUpdateByUsuario.ExecuteNonQuery();
        if (updatedByUsuario > 0)
        {
            return;
        }

        using var cmdUpdateLegacyById = new NpgsqlCommand(sqlUpdateLegacyById, conn, tx);
        cmdUpdateLegacyById.Parameters.AddWithValue("id", userId);
        cmdUpdateLegacyById.Parameters.AddWithValue("usuario_id", userId);
        cmdUpdateLegacyById.Parameters.AddWithValue("centro_id", centroId);
        cmdUpdateLegacyById.Parameters.AddWithValue("servicio_id", servicioId);
        cmdUpdateLegacyById.Parameters.AddWithValue("nombre", nombre);
        cmdUpdateLegacyById.Parameters.AddWithValue("matricula_provincial", (object?)matriculaProvincial ?? DBNull.Value);
        cmdUpdateLegacyById.Parameters.AddWithValue("matricula_nacional", (object?)matriculaNacional ?? DBNull.Value);
        cmdUpdateLegacyById.Parameters.AddWithValue("activo", activo);

        var updatedByLegacyId = cmdUpdateLegacyById.ExecuteNonQuery();
        if (updatedByLegacyId > 0)
        {
            return;
        }

        using var cmdInsert = new NpgsqlCommand(sqlInsert, conn, tx);
        cmdInsert.Parameters.AddWithValue("id", userId);
        cmdInsert.Parameters.AddWithValue("usuario_id", userId);
        cmdInsert.Parameters.AddWithValue("centro_id", centroId);
        cmdInsert.Parameters.AddWithValue("servicio_id", servicioId);
        cmdInsert.Parameters.AddWithValue("nombre", nombre);
        cmdInsert.Parameters.AddWithValue("matricula_provincial", (object?)matriculaProvincial ?? DBNull.Value);
        cmdInsert.Parameters.AddWithValue("matricula_nacional", (object?)matriculaNacional ?? DBNull.Value);
        cmdInsert.Parameters.AddWithValue("activo", activo);
        cmdInsert.ExecuteNonQuery();
    }

    public void InsertSesionLog(CreateSesionLogRow row)
    {
        const string sql = """
            insert into sch_seguridad.sesion_log(
                id,
                usuario_id,
                accion,
                ip,
                user_agent,
                resultado,
                created_at
            )
            values (
                @id,
                @usuario_id,
                @accion,
                @ip,
                @user_agent,
                @resultado,
                now()
            );
            """;

        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", row.Id);
        cmd.Parameters.AddWithValue("usuario_id", (object?)row.UsuarioId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("accion", row.Accion);
        cmd.Parameters.AddWithValue("ip", (object?)row.Ip ?? DBNull.Value);
        cmd.Parameters.AddWithValue("user_agent", (object?)row.UserAgent ?? DBNull.Value);
        cmd.Parameters.AddWithValue("resultado", row.Resultado);
        cmd.ExecuteNonQuery();
    }
}
