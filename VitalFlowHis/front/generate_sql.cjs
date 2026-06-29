const crypto = require('crypto');
const password = '123';
const iterations = 100000;
const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const passwordHash = `pbkdf2-sha256$${iterations}$${salt.toString('base64')}$${hash.toString('base64')}`;

const userId = crypto.randomUUID();
const roleId = '50000000-0000-0000-0000-000000000001';

const sql = `
INSERT INTO sch_seguridad.usuario_sistema (id, username, password_hash, estado, created_at, updated_at) 
VALUES ('${userId}', 'mcasey', '${passwordHash}', 'Activo', NOW(), NOW());

INSERT INTO sch_seguridad.usuario_rol (usuario_id, rol_id)
VALUES ('${userId}', '${roleId}');
`;

require('fs').writeFileSync('c:\\Users\\marti\\OneDrive\\Desktop Laptop Samsung\\VITALFLOW HIS\\VitalFlow His\\front\\insert_user.sql', sql, 'utf8');
console.log('SQL generated to insert_user.sql');
