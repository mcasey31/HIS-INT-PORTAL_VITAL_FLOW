import xlrd, json, os

src = r'D:\xampp\htdocs\his\practicas.xls'
out_migration = r'D:\xampp\htdocs\his\VitalFlowHis\db\migrations\029_feature_nomenclador_practica.sql'
out_practicas_json = r'D:\xampp\htdocs\his\VitalFlowHis\db\scripts\practicas_block.json'

wb = xlrd.open_workbook(src)
ws = wb.sheet_by_index(0)

# Build inserts in batches of 500
all_rows = []
practicas_json_arr = []
for i in range(7, ws.nrows):
    codigo = str(ws.cell_value(i, 1)).strip()
    desc = str(ws.cell_value(i, 2)).strip()
    modulo = str(ws.cell_value(i, 0)).strip() if ws.cell_value(i, 0) else ''
    if not codigo or not desc:
        continue
    desc_escaped = desc.replace("'", "''")
    all_rows.append(f"('{codigo}', '{desc_escaped}', '{modulo}')")
    practicas_json_arr.append(json.dumps({"Nombre": desc, "DuracionMinutos": None}, ensure_ascii=False))

# Write migration
with open(out_migration, 'w', encoding='utf-8') as f:
    f.write('-- 029_feature_nomenclador_practica.sql\n')
    f.write('-- Carga el nomenclador de prácticas desde archivo oficial (practicas.xls)\n\n')
    f.write('create table if not exists sch_hca.nomenclador_practica (\n')
    f.write('    codigo varchar(20) primary key,\n')
    f.write('    descripcion varchar(300) not null,\n')
    f.write('    modulo varchar(10),\n')
    f.write('    activo boolean not null default true,\n')
    f.write('    created_at timestamptz not null default now()\n')
    f.write(');\n\n')

    # Insert in batches of 500
    batch_size = 500
    for batch_start in range(0, len(all_rows), batch_size):
        batch = all_rows[batch_start:batch_start + batch_size]
        f.write('insert into sch_hca.nomenclador_practica (codigo, descripcion, modulo) values\n')
        f.write(',\n'.join(batch))
        f.write(';\n\n')
    
    f.write(f'-- Total: {len(all_rows)} practices loaded\n')

# Write first 1000 practices for block JSON
with open(out_practicas_json, 'w', encoding='utf-8') as f:
    json.dump(practicas_json_arr[:300], f, ensure_ascii=False, indent=2)

print(f'Migration written: {out_migration} ({len(all_rows)} practices)')
print(f'Block JSON written: {out_practicas_json} ({min(300, len(practicas_json_arr))} practices for block)')
