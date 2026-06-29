import sys, json
data = json.load(sys.stdin)
for item in data:
    turno = item['turno'][:20]
    paciente = item['paciente'][:30]
    estado = item['estado'][:15]
    llegada = item.get('llegada', '') or '-'
    print(f"{turno:20s} | {paciente:30s} | {llegada:20s} | {estado}")
