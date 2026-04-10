---
installer: loki-skills-cli v1.0.0
origin: ECC (affaan-m/everything-claude-code) — adapted for Kvasir by Lokkji
name: continuous-agent-loop
description: patterns สำหรับ autonomous agent loops พร้อม quality gates, evals และ recovery ใช้เมื่อพูดว่า agent loop, continuous agent, autonomous loop
---

# /continuous-agent-loop

> "Loop ที่ดีต้องรู้จักหยุดตัวเอง — ไม่ใช่วิ่งไปเรื่อยๆ จนเสียเงินโดยไม่มีผล"

---

## เลือก Loop Pattern

```
เริ่ม
  |
  +-- ต้องการ CI/PR control เข้มงวด? → continuous-pr
  |
  +-- ต้องการ RFC decomposition?     → rfc-dag
  |
  +-- ต้องการ parallel exploration?  → infinite
  |
  +-- default                        → sequential
```

---

## Production Stack ที่แนะนำ

1. **RFC decomposition** — แตกงานใหญ่ก่อน
2. **Quality gates** — `/quality-gate` ก่อน merge
3. **Eval loop** — วัดผลทุก iteration
4. **Session persistence** — เก็บ state ข้าม session

---

## Failure Modes ที่ต้องระวัง

| Symptom | สาเหตุ | วิธีแก้ |
|---------|--------|---------|
| Loop วนไม่มีความคืบหน้า | ไม่มี measurable progress metric | กำหนด done criteria ชัดๆ |
| Retry ซ้ำสาเหตุเดิม | ไม่ได้แก้ root cause | freeze → audit → reduce scope |
| Merge queue ค้าง | PR ไม่ผ่าน quality gate | รัน harness-audit ก่อน |
| Cost drift สูงผิดปกติ | Unbounded escalation | กำหนด cost ceiling ต่อ session |

---

## Recovery Protocol

เมื่อ loop ติด:
```
1. freeze loop — หยุดก่อน
2. รัน /harness-audit หรือ git log ดูสิ่งที่เกิดขึ้น
3. reduce scope → เลือก failing unit ที่เล็กที่สุด
4. replay ด้วย explicit acceptance criteria
```

---

## Kvasir Agent Mapping

| Loop Type | Kvasir Agents | ใช้เมื่อ |
|-----------|--------------|---------|
| sequential | Thor → Tyr | งานตรงไปตรงมา ทำทีละขั้น |
| parallel exploration | Thor + Huginn (parallel) | research หลายทางพร้อมกัน |
| continuous-pr | Tyr + Odin | feature ใหญ่ที่ต้องการ PR review |
| rfc-dag | Odin orchestrates all | งาน complex ที่ต้องวางแผนก่อน |
