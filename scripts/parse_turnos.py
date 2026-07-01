import sys, json
d = json.load(sys.stdin)
if isinstance(d, dict) and 'value' in d:
    d = d['value']
print(f'Total: {len(d)}')
for t in d:
    turno = t.get('turno', '-')
    paciente = t.get('paciente', '-')
    estado = t.get('estado', '-')
    print(f'{turno:>20s} | {paciente:30s} | {estado}')
