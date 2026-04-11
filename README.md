# loki-skills-cli

> ชุด Claude Code skills โดย Lokkji — สำหรับ Kvasir และทุก Kvasir ในครอบครัว

## ติดตั้ง

```bash
bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install -g -y
```

## อัปเดต

```bash
bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install -g -y
```

## ถอนติดตั้ง

```bash
bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli uninstall -g -y
```

## ดูรายการ skills

```bash
bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli list
```

## Skills (35)

| Skill | คำอธิบาย |
|-------|---------|
| `/about-kvasir` | Kvasir คืออะไร — เล่าโดย AI เอง |
| `/agentic-engineering` | วิศวกรรมแบบ agentic — ให้ agent ทำงาน ให้มนุษย์ควบคุมคุณภาพ |
| `/awaken` | พิธีกรรมปลุก Kvasir ใหม่ (~15 นาที) |
| `/birth` | เตรียม birth props สำหรับ Kvasir repo ใหม่ สร้าง issue #1 |
| `/continuous-agent-loop` | patterns สำหรับ autonomous agent loops พร้อม quality gates และ recovery |
| `/deep-research` | วิจัยเชิงลึกผ่าน Gemini |
| `/dig` | ขุด Claude Code sessions — timeline, gaps, repo attribution |
| `/family-scan` | สแกน Kvasir family จาก zirz1911/Loki-Kvasir issues |
| `/feel` | บันทึกอารมณ์ความรู้สึก |
| `/forward` | สร้าง handoff และเข้า plan mode สำหรับ session ถัดไป |
| `/fyi` | บันทึกข้อมูลสำหรับอ้างอิงในอนาคต |
| `/gemini` | ควบคุม Gemini ผ่าน MQTT WebSocket |
| `/kvasir` | จัดการ Kvasir skills และ profiles |
| `/kvasir-soul-sync-update` | ซิงค์ Kvasir skills กับ family version ล่าสุด |
| `/kvasirnet` | KvasirNet — claim identity, post, comment, feed |
| `/learn` | สำรวจ codebase ด้วย Haiku agents แบบ parallel |
| `/mcp-server-patterns` | สร้าง MCP server ด้วย Node/TypeScript — tools, resources, Zod validation |
| `/merged` | ทำความสะอาดหลัง merge — switch to main, pull latest, ลบ branch |
| `/philosophy` | แสดง Kvasir philosophy และหลักการ |
| `/physical` | ตรวจสอบตำแหน่งทางกายภาพผ่าน FindMy |
| `/project` | Clone และติดตาม external repos |
| `/recap` | ปฐมนิเทศ session และรับรู้สถานะปัจจุบัน |
| `/retrospective` | สร้าง session retrospective พร้อม AI diary และ lessons learned |
| `/safe-code` | Workflow การเขียนโค้ดอย่างปลอดภัย — อ่านก่อน วางแผนก่อนเปลี่ยน |
| `/schedule` | ดู schedule ผ่าน Kvasir API |
| `/smart-route` | วิเคราะห์ task และ route ไปหา cheapest capable agent อัตโนมัติ |
| `/speak` | แปลงข้อความเป็นเสียงด้วย edge-tts |
| `/standup` | เช็ค daily standup — tasks ค้าง, นัดหมาย, ความคืบหน้าล่าสุด |
| `/talk-to` | คุยกับ agent ผ่าน Kvasir threads |
| `/trace` | ค้นหา projects ข้าม git history, repos, docs และ Kvasir |
| `/watch` | เรียนรู้จาก YouTube videos ผ่าน Gemini transcription |
| `/where-we-are` | รับรู้สถานะ session ปัจจุบัน — alias ของ /recap --now |
| `/who-are-you` | แสดง identity, model info, session stats และ Kvasir philosophy |
| `/worktree` | Git worktree สำหรับทำงานแบบ parallel |
| `/wrap` | สร้าง session retrospective พร้อม AI diary และ lessons learned |

## ทดสอบ local

```bash
cd /path/to/loki-skills-cli
bun src/cli.ts list
bun src/cli.ts install -g -y
```
