import json

with open(r'D:\xampp\htdocs\his\VitalFlowHis\db\scripts\practicas_block_fixed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

json_str = json.dumps(data, ensure_ascii=False)
json_escaped = json_str.replace("'", "''")

sql = f"""UPDATE sch_agenda.bloque_programacion
SET practicas_json = '{json_escaped}'
WHERE agenda_id = 'e09e02b8-fa81-4c21-bcbe-2e0d84a3f7b4';
"""

with open(r'D:\xampp\htdocs\his\VitalFlowHis\db\scripts\update_practicas_block3.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print(f"SQL generated: {len(sql)} chars")
print(f"JSON length: {len(json_str)}")
# Check for any problematic characters
import re
problematic = re.findall(r'[^\x20-\x7e]', json_str)
print(f"Non-ASCII chars: {len(problematic)}")
