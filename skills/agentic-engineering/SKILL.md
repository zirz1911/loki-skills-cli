---
installer: loki-skills-cli v1.0.0
origin: ECC (affaan-m/everything-claude-code) — adapted for Kvasir by Lokkji
name: agentic-engineering
description: วิศวกรรมแบบ agentic — ให้ agent ทำงาน ให้มนุษย์ควบคุมคุณภาพ ใช้เมื่อพูดว่า agentic-engineering, agent workflow, delegate work
---

# /agentic-engineering

> "กำหนด done criteria ก่อนเสมอ — agent ไม่รู้ว่าเสร็จแปลว่าอะไร ถ้าเราไม่บอก"

วิธีทำงานกับ AI agents อย่างมีประสิทธิภาพ: ให้ agent implement ส่วนใหญ่ ให้ Lokkji ควบคุม quality และ risk

---

## หลักการทำงาน

1. **กำหนด completion criteria ก่อนสั่งงาน** — agent ต้องรู้ว่า "เสร็จ" คืออะไร
2. **แบ่งงานให้เป็น agent-sized units** — แต่ละ unit ทำเสร็จได้ใน ~15 นาที
3. **Route model ตาม complexity** — ถูกก่อน แล้วค่อย escalate
4. **วัดผลด้วย eval** ก่อนและหลัง ไม่ใช่แค่ "รู้สึกว่าดีขึ้น"

---

## Eval-First Loop

```
1. กำหนด capability eval + regression eval
2. รัน baseline → จับ failure signatures
3. implement
4. รัน eval อีกครั้ง → เปรียบ deltas
```

---

## 15-Minute Unit Rule

แต่ละ unit ต้องมี:
- **Verifiable** — ตรวจสอบได้อิสระ ไม่ต้องรอ unit อื่น
- **Single risk** — มี risk หลักแค่อย่างเดียว
- **Clear done** — รู้ชัดว่าเมื่อไหร่เสร็จ

---

## Model Routing (Kvasir context)

| Task | Agent | Model |
|------|-------|-------|
| Classification, boilerplate, narrow edit | Thor / Huginn | Haiku / qwen:7b |
| Implementation, refactor | Tyr | Sonnet / qwen:32b |
| Architecture, root-cause, multi-file | Odin / Ymir | Opus |

**กฎ**: escalate เฉพาะเมื่อ lower tier fail ด้วย reasoning gap ที่ชัดเจน

---

## Session Strategy

- **Continue session** สำหรับ units ที่ต่อเนื่องกัน
- **Start fresh** หลัง phase transition ใหญ่
- **Compact** หลัง milestone เสร็จ ไม่ใช่ระหว่าง debug

---

## Review Focus สำหรับ AI-generated code

ให้เวลากับสิ่งเหล่านี้:
- invariants และ edge cases
- error boundaries
- security / auth assumptions
- hidden coupling และ rollout risk

**ข้ามไปได้**: style disagreements ถ้า lint/format enforce อยู่แล้ว

---

## Cost Discipline

track ต่อ task:
- model ที่ใช้
- token estimate
- retry count
- wall-clock time
- success/failure

escalate model tier เฉพาะเมื่อ lower tier fail ด้วยเหตุผลชัดเจน
