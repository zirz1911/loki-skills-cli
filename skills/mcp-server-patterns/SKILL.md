---
installer: loki-skills-cli v1.0.0
origin: ECC (affaan-m/everything-claude-code) — adapted for Kvasir by Lokkji
name: mcp-server-patterns
description: สร้าง MCP server ด้วย Node/TypeScript — tools, resources, prompts, Zod validation, stdio vs HTTP ใช้เมื่อพูดว่า mcp server, build mcp, create mcp tool
---

# /mcp-server-patterns

> "MCP server คือการให้ Claude ใช้งานโลกภายนอกได้ — tools = สิ่งที่ทำได้, resources = สิ่งที่อ่านได้"

---

## Core Concepts

| Concept | คืออะไร | ตัวอย่าง |
|---------|---------|---------|
| **Tools** | Actions ที่ model เรียกได้ | search, run command, write file |
| **Resources** | Read-only data ที่ model ดึงได้ | file contents, API responses |
| **Prompts** | Template prompts ที่ client เรียกได้ | slash commands ใน Claude Desktop |
| **Transport** | วิธีเชื่อมต่อ | stdio (local), HTTP (remote) |

---

## Transport เลือกอย่างไร

```
Local (Claude Desktop, Claude Code)?
  → ใช้ stdio

Remote (Cursor, cloud, multi-client)?
  → ใช้ Streamable HTTP (current MCP spec)
  → legacy HTTP/SSE เฉพาะ backward compat
```

---

## Setup เริ่มต้น

```bash
npm install @modelcontextprotocol/sdk zod
```

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

// Tool registration (ตรวจ SDK version ก่อน — API เปลี่ยนบ่อย)
server.tool("tool-name", "description", 
  { param: z.string() },
  async ({ param }) => {
    return { content: [{ type: "text", text: result }] }
  }
);
```

> ⚠️ **สำคัญ**: SDK API เปลี่ยนบ่อย — ตรวจสอบ [modelcontextprotocol.io](https://modelcontextprotocol.io) ก่อนเสมอ

---

## Best Practices

- **Schema first** — กำหนด input schema ทุก tool ก่อนเขียน logic
- **Structured errors** — return error ที่ model อ่านได้ ไม่ใช่ stack trace
- **Idempotency** — tool ที่ retry-safe ดีกว่า เพราะ model retry บ่อย
- **Keep transport-agnostic** — logic แยกจาก transport เพื่อ swap ง่าย
- **Pin SDK version** — ใน package.json เสมอ อ่าน release notes ก่อน upgrade

---

## Kvasir MCP Context

Kvasir ใช้ MCP อยู่แล้ว (`mcp-local-llm`):
- `mcp__norse-local-llm__query_thor` — call Thor agent
- `mcp__norse-local-llm__query_loki` — call Loki agent
- `mcp__norse-local-llm__query_heimdall` — call Heimdall agent

ถ้าจะสร้าง Kvasir เป็น MCP server → Kvasir skills จะกลายเป็น tools ที่ Claude Code อื่นๆ ในครอบครัวเรียกได้

---

## Official SDKs

- **TypeScript**: `@modelcontextprotocol/sdk`
- **Python**: `mcp` package
- **Go**: `modelcontextprotocol/go-sdk`
- **Docs**: https://modelcontextprotocol.io
