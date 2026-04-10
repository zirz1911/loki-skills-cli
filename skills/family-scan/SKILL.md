---
installer: loki-skills-cli v1.0.0
origin: Loki-Kvasir
name: family-scan
description: สแกน Kvasir family จาก zirz1911/Loki-Kvasir issues — ชื่อ Kvasir, เจ้าของ, วันเกิด ใช้เมื่อพูดว่า family scan, family-scan, kvasir list, ดู kvasir
---

# /family-scan — Kvasir Family Registry

สแกน Kvasir ทั้งหมดจาก GitHub Issues ของ `zirz1911/Loki-Kvasir`

## Usage

```
/family-scan              # แสดง Kvasir ทั้งหมด
/family-scan --recent     # 5 ล่าสุด
/family-scan "Saga"       # ค้นหาตามชื่อ
```

---

## Step 1: Fetch Issues

```bash
gh issue list \
  --repo zirz1911/Loki-Kvasir \
  --state all \
  --limit 100 \
  --json number,title,createdAt,author,body
```

---

## Step 2: Filter Kvasir Issues

กรองเฉพาะ issue ที่ title มีคำว่า `Kvasir` และ `Awaken` (pattern: `🌟 ... Kvasir Awaken`):

```python
import json, sys, re

data = json.load(sys.stdin)
kvasirs = [i for i in data if re.search(r'^\W*\w[\w\s]+Kvasir\s+Awaken', i['title'], re.I)]
```

---

## Step 3: Parse Fields

จากแต่ละ issue ดึง:

| Field | Source | ตัวอย่าง |
|-------|--------|---------|
| **Kvasir Name** | title — ก่อน "Kvasir" | `Saga`, `Edda`, `Loki` |
| **Focus/Theme** | title — หลัง `—` | `เทพีผู้หยั่งรู้` |
| **Owner (display)** | `author.name` | `Todoroki Shoto` |
| **Owner (github)** | `author.login` | `zirz1911` |
| **Born** | `createdAt` (date only) | `2026-04-10` |
| **Issue #** | `number` | `#3` |

**Title parsing logic:**
```
"🌟 Saga Kvasir Awakens — เทพีผู้หยั่งรู้แห่งประวัติศาสตร์"
     ^^^^                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     name = "Saga"          focus = "เทพีผู้หยั่งรู้แห่งประวัติศาสตร์"
```

---

## Step 4: Display

แสดงผลในรูปแบบ markdown table:

```markdown
## Kvasir Family — zirz1911/Loki-Kvasir
**Total**: N Kvasirs

| # | Kvasir | เจ้าของ | วันเกิด |
|---|--------|--------|--------|
| #3 | **Saga** — เทพีผู้หยั่งรู้แห่งประวัติศาสตร์ | Todoroki Shoto (@zirz1911) | 2026-04-10 |
| #2 | **Edda** — Norse Scribe of Code & Networks | Todoroki Shoto (@zirz1911) | 2026-04-10 |
```

---

## Full Command (One-liner)

```bash
gh issue list \
  --repo zirz1911/Loki-Kvasir \
  --state all \
  --limit 100 \
  --json number,title,createdAt,author,body | python3 -c "
import json, sys, re

data = json.load(sys.stdin)
kvasirs = [i for i in data if re.search(r'^\W*\w[\w\s]+Kvasir\s+Awaken', i['title'], re.I)]

# Sort by born date from body (fallback to createdAt)
def get_born(k):
    m = re.search(r'\*\*Date\*\*:\s*(\d{4}-\d{2}-\d{2})', k.get('body', ''))
    return m.group(1) if m else k['createdAt'][:10]

kvasirs.sort(key=get_born)

print(f'## Kvasir Family — zirz1911/Loki-Kvasir')
print(f'**Total**: {len(kvasirs)} Kvasirs\n')
print('| # | Kvasir | เจ้าของ | วันเกิด |')
print('|---|--------|--------|--------|')

for k in reversed(kvasirs):
    title = k['title']
    m = re.search(r'[🌟\s]*(\w[\w\s]*?)\s+Kvasir\s+Awaken', title, re.I)
    name = m.group(1).strip() if m else '?'
    focus = title.split('—', 1)[1].strip() if '—' in title else ''
    author = k['author']
    owner_display = author.get('name', author.get('login', '?'))
    owner_login = author.get('login', '?')
    born = get_born(k)
    num = k['number']
    print(f'| #{num} | **{name}** — {focus} | {owner_display} (@{owner_login}) | {born} |')
"
```

---

## Mode: --recent

แสดงเฉพาะ 5 ล่าสุด — ใช้ command เดิม แล้ว limit output:

```bash
# เพิ่ม | head -8 ท้ายสุด (header 3 บรรทัด + 5 rows)
```

---

## Mode: Search "Name"

ถ้า ARGUMENTS มีข้อความ — filter เพิ่มเติม:

```python
query = ARGUMENTS.strip().lower()
kvasirs = [k for k in kvasirs if query in k['title'].lower()]
```

---

## Execute

รัน command ใน Step "Full Command" ผ่าน Bash tool แล้วแสดงผลโดยตรง

ARGUMENTS: $ARGUMENTS
