import json, sys

d = json.load(sys.stdin)
print(f"Servicios: {len(d['servicios'])}")
print(f"Practicas: {len(d['practicas'])}")
print(f"Efectores: {len(d['efectores'])}")
print("First 5 practicas:")
for p in d['practicas'][:5]:
    print(f"  {p['id']}: {p['nombre']}")
