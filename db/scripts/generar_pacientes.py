import json

# Remaining cupos (09:00 to 11:30)
cupos = [
    ("4ce706cc-086b-43fa-a77e-a9dc02dfb1e8", "09:00"),
    ("242ce598-ad7f-4af1-93eb-a2f8a44f804e", "09:30"),
    ("af5cebae-1046-4017-82a8-a0ed320feef6", "10:00"),
    ("7143caf5-53ec-42ce-9489-071926505a24", "10:30"),
    ("986b2afa-9d18-4e1b-8544-aa3337a59c18", "11:00"),
    ("20d93df8-3c0e-43fe-8724-cb2a96fd0e68", "11:30"),
]

# Available personas (not already used in test turns)
personas = [
    ("a0000000-0000-0000-0000-000000000001", "Gomez", "Carlos", "30123456", "1985-03-15"),
    ("a0000000-0000-0000-0000-000000000002", "Lopez", "Maria", "27111222", "1990-07-22"),
    ("a0000000-0000-0000-0000-000000000003", "Martinez", "Jose", "33445566", "1978-11-08"),
    ("10000000-0000-0000-0000-000000000001", "Perez", "Juan", "12345678", "1991-02-20"),
    ("a0000000-0000-0000-0000-000000000005", "Fernandez", "Luis", "35777888", "1982-09-30"),
    ("a0000000-0000-0000-0000-000000000006", "Garcia", "Laura", "31666555", "1993-12-05"),
]

bloque_prefix = "a4dc7a98"
agenda_id = "e09e02b8-fa81-4c21-bcbe-2e0d84a3f7b4"
centro_id = "00000000-0000-0000-0000-000000000001"
servicio_id = "00000000-0000-0000-0000-000000000101"
efector_id = "641f9e94-f14a-4d92-83b2-0b19f6cfc5be"
profesional = "Rodriguez, Maria Laura"
servicio = "Clinica Medica"
centro = "Centro Ambulatorio Central"
fecha = "2026-06-28"

lines = []
for i, ((cupo_id, hora), (pid, apellido, nombre, doc, fdn)) in enumerate(zip(cupos, personas)):
    seq = 3 + i
    turno_id = f"TURNO-{bloque_prefix}-{seq:03d}"
    paciente_nombre = f"{apellido}, {nombre}"
    fecha_hora = f"{fecha} {hora}:00-03"
    
    # Mark cupo as ocupado
    lines.append(f"UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = '{cupo_id}';")
    
    # Insert turno_paciente
    lines.append(f"""INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('{turno_id}', '{pid}', '{profesional}', '{servicio}', '{centro}', '{fecha_hora}', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;""")
    
    # Insert turno_admision
    lines.append(f"""INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('{turno_id}', '{pid}', '{paciente_nombre}', 'DNI {doc}', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;""")

sql = "\n".join(lines)

with open(r'D:\xampp\htdocs\his\VitalFlowHis\db\scripts\add_patients.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print(f"Generated {len(lines)} SQL statements for {len(cupos)} patients")
print(sql[:500])
