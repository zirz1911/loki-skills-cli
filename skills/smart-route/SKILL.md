---
installer: loki-skills-cli v1.0.0
origin: Loki-Kvasir — token cost optimization through intelligent agent routing
name: smart-route
description: วิเคราะห์ task และ route ไปหา cheapest capable agent อัตโนมัติ ใช้เมื่อพูดว่า route, smart route, save tokens
---

# /smart-route — Smart Agent Router

Analyze the current task and route to the cheapest capable agent.

## Routing Decision Tree

```
Task arrives
    ↓
explain / research / summarize / draft / translate
    → Gemini (FREE): tmux send-keys -t loki-kvasir:6 "[task]" C-m
    ↓
code generation (simple) / write function / boilerplate
    → Thor local: mcp__norse-local-llm__query_thor
    ↓
file search / find pattern / grep codebase
    → Loki local: mcp__norse-local-llm__query_loki
    ↓
deep research / architecture understanding / how does X work
    → Heimdall local: mcp__norse-local-llm__query_heimdall
    ↓
complex code / design patterns / strategic refactor
    → Tyr 32b local (via Openclaw): mcp__norse-local-llm__query_thor with complexity flag
    ↓
production-critical / must be correct / security-sensitive
    → Claude paid — inform user of cost before proceeding
    ↓
multi-step / needs file edit+read+bash together
    → Handle directly as Loki/Odin (Claude)
```

## Agent Reference

| Agent | Tool/Command | Cost |
|-------|-------------|------|
| Gemini | `tmux send-keys -t loki-kvasir:6 "..." C-m` | FREE |
| Thor local | `mcp__norse-local-llm__query_thor` | FREE |
| Loki local | `mcp__norse-local-llm__query_loki` | FREE |
| Heimdall local | `mcp__norse-local-llm__query_heimdall` | FREE |
| Claude (Haiku) | Task tool, model=haiku | ~$0.001 |
| Claude (Sonnet) | Current session | ~$0.01 |
| Claude (Opus) | Task tool, model=opus | ~$0.05 |

## Fallback Chain

If free agent fails or gives wrong answer:
```
Gemini fails → Thor local → Heimdall local → Claude Haiku → Claude Sonnet
```

## Mode: Manual Call

When user calls `/smart-route [task]`:
1. Analyze the task type
2. Show which agent will handle it and why
3. Route to that agent
4. Report result back

## Mode: Auto (via UserPromptSubmit hook)

Routing hint injected into every message automatically.
No need to call manually — just works in background.

ARGUMENTS: $ARGUMENTS
