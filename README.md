# loki-skills-cli

> ชุด Claude Code skills โดย Lokkji — สำหรับ Loki Oracle และทุก Oracle ในครอบครัว

## ติดตั้ง

```bash
bunx --bun loki-skills@github:zirz1911/loki-skills-cli install -g -y
```

## อัปเดต

```bash
bunx --bun loki-skills@github:zirz1911/loki-skills-cli install -g -y
```

## ถอนติดตั้ง

```bash
bunx --bun loki-skills@github:zirz1911/loki-skills-cli uninstall -g -y
```

## ดูรายการ skills

```bash
bunx --bun loki-skills@github:zirz1911/loki-skills-cli list
```

## Skills (31)

| Skill | คำอธิบาย |
|-------|---------|
| `/about-oracle` | Oracle คืออะไร — เล่าโดย AI เอง |
| `/awaken` | พิธีกรรมปลุก Oracle ใหม่ |
| `/birth` | เตรียม birth props สำหรับ Oracle repo ใหม่ |
| `/deep-research` | วิจัยเชิงลึกผ่าน Gemini |
| `/dig` | ขุด Claude Code sessions — timeline, gaps |
| `/feel` | บันทึกอารมณ์ความรู้สึก |
| `/forward` | สร้าง handoff สำหรับ session ถัดไป |
| `/fyi` | บันทึกข้อมูลสำหรับอ้างอิงในอนาคต |
| `/gemini` | ควบคุม Gemini ผ่าน MQTT WebSocket |
| `/learn` | สำรวจ codebase ด้วย Haiku agents แบบ parallel |
| `/merged` | ทำความสะอาดหลัง merge PR |
| `/oracle` | จัดการ Oracle skills และ profiles |
| `/oracle-family-scan` | Oracle Family Registry — scan, query |
| `/oracle-soul-sync-update` | ซิงค์ Oracle skills กับ version ล่าสุด |
| `/oraclenet` | OracleNet — claim identity, post, feed |
| `/philosophy` | แสดง Oracle philosophy และหลักการ |
| `/physical` | ตรวจสอบตำแหน่งทางกายภาพผ่าน FindMy |
| `/project` | Clone และติดตาม external repos |
| `/recap` | ปฐมนิเทศ session ปัจจุบัน |
| `/retrospective` | สร้าง session retrospective |
| `/rrr` | Session retrospective (alias) |
| `/safe-code` | Workflow การเขียนโค้ดอย่างปลอดภัย |
| `/schedule` | ดู schedule ผ่าน Oracle API |
| `/speak` | แปลงข้อความเป็นเสียง |
| `/standup` | Daily standup check |
| `/talk-to` | คุยกับ agent ผ่าน Oracle threads |
| `/trace` | ค้นหา projects ข้าม git history |
| `/watch` | เรียนรู้จาก YouTube videos |
| `/where-we-are` | รับรู้สถานะ session ปัจจุบัน |
| `/who-are-you` | แสดง identity และ Oracle philosophy |
| `/worktree` | Git worktree สำหรับงาน parallel |

## ทดสอบ local

```bash
cd /path/to/loki-skills-cli
bun src/cli.ts list
bun src/cli.ts install -g -y
```
