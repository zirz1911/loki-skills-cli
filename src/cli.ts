#!/usr/bin/env bun

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, rmSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const VERSION = '1.2.0'
const PACKAGE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const SKILLS_SRC = join(PACKAGE_DIR, 'skills')

// ── Parse args ──────────────────────────────────────────────
const args = process.argv.slice(2)
const command = args[0] ?? 'help'
const isGlobal  = args.includes('-g') || args.includes('--global')
const isYes     = args.includes('-y') || args.includes('--yes')
const isGemini  = args.includes('--gemini')

// --path <dir> override
const pathIdx = args.findIndex(a => a === '--path')
const customPath = pathIdx !== -1 ? args[pathIdx + 1] : null

// ── Target directories ───────────────────────────────────────
const CLAUDE_TARGET = isGlobal
  ? join(process.env.HOME!, '.claude', 'skills')
  : join(process.cwd(), '.claude', 'skills')

const GEMINI_DEFAULT = join(process.env.HOME!, 'Loki-Gemini', '.gemini', 'commands')
const GEMINI_TARGET  = customPath ?? GEMINI_DEFAULT

const targetDir = isGemini ? GEMINI_TARGET : CLAUDE_TARGET

// ── Helpers ──────────────────────────────────────────────────
function getSkillNames(): string[] {
  return readdirSync(SKILLS_SRC).filter(name =>
    statSync(join(SKILLS_SRC, name)).isDirectory()
  )
}

function readSkillDesc(skillName: string): string {
  const mdPath = join(SKILLS_SRC, skillName, 'SKILL.md')
  if (!existsSync(mdPath)) return ''
  const match = readFileSync(mdPath, 'utf-8').match(/^description:\s*(.+)$/m)
  return match ? match[1] : ''
}

function updateInstaller(skillPath: string) {
  const mdPath = join(skillPath, 'SKILL.md')
  if (!existsSync(mdPath)) return
  let content = readFileSync(mdPath, 'utf-8')
  content = content.replace(/^installer:.*$/m, `installer: loki-skills-cli v${VERSION}`)
  writeFileSync(mdPath, content)
}

function writeVersionFile(skills: string[], target: string) {
  const agent = isGemini ? 'Gemini CLI' : 'Claude Code'
  const updateCmd = isGemini
    ? `bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install --gemini -y`
    : `bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install -g -y`

  const content = `# Kvasir Skills

Installed by: **kvasir-skills (loki-skills-cli v${VERSION})**
Installed at: ${new Date().toISOString()}
Agent: ${agent}
Skills: ${skills.length}

## Update Skills

\`\`\`bash
${updateCmd}
\`\`\`

## Installed Skills

${skills.map(s => `- ${s}`).join('\n')}
`
  writeFileSync(join(target, 'VERSION.md'), content)
}

function generateGeminiToml(skillName: string): string {
  const skillPath = join(SKILLS_SRC, skillName)
  const desc = readSkillDesc(skillName)
  return `description = "v${VERSION} | ${desc}"
prompt = """
You are running the /${skillName} skill.

Read the skill file at ${skillPath}/SKILL.md and follow ALL instructions in it.

Arguments: {{args}}

---
loki-skills-cli v${VERSION}
"""
`
}

function confirm(msg: string): boolean {
  if (isYes) return true
  process.stdout.write(`${msg} [y/N] `)
  const buf = Buffer.alloc(3)
  const n = require('fs').readSync(0, buf, 0, 3, null)
  return buf.slice(0, n).toString().trim().toLowerCase() === 'y'
}

// ── Commands ──────────────────────────────────────────────────
function cmdInstall() {
  const skills = getSkillNames()
  const agent = isGemini ? 'Gemini CLI' : 'Claude Code'

  console.log(`\n🎭 loki-skills-cli v${VERSION}`)
  console.log(`🎯 Target: ${agent}`)
  console.log(`📦 ${skills.length} skills → ${targetDir}\n`)

  if (!confirm(`ติดตั้ง ${skills.length} skills?`)) {
    console.log('ยกเลิก')
    process.exit(0)
  }

  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true })

  for (const name of skills) {
    if (isGemini) {
      // Generate .toml command file
      const toml = generateGeminiToml(name)
      writeFileSync(join(targetDir, `${name}.toml`), toml)
    } else {
      // Copy full skill directory
      const src  = join(SKILLS_SRC, name)
      const dest = join(targetDir, name)
      cpSync(src, dest, { recursive: true })
      updateInstaller(dest)
    }
    process.stdout.write(`  ✅ ${name}\n`)
  }

  writeVersionFile(skills, targetDir)

  console.log(`\n✨ ติดตั้งเสร็จ: ${skills.length} skills → ${targetDir}`)
  if (isGemini) {
    console.log('🔄 Restart Gemini CLI เพื่อโหลด commands ใหม่\n')
  } else {
    console.log('🔄 Restart Claude Code เพื่อโหลด skills ใหม่\n')
  }
}

function cmdUninstall() {
  const skills = getSkillNames()
  console.log(`\n🎭 loki-skills-cli v${VERSION}`)
  console.log(`🗑️  จะลบ ${skills.length} items ออกจาก ${targetDir}\n`)

  if (!confirm('ยืนยันการถอนติดตั้ง?')) {
    console.log('ยกเลิก')
    process.exit(0)
  }

  let removed = 0
  for (const name of skills) {
    if (isGemini) {
      const tomlFile = join(targetDir, `${name}.toml`)
      if (existsSync(tomlFile)) {
        rmSync(tomlFile)
        process.stdout.write(`  🗑️  ${name}.toml\n`)
        removed++
      }
    } else {
      const dest = join(targetDir, name)
      if (existsSync(dest)) {
        rmSync(dest, { recursive: true })
        process.stdout.write(`  🗑️  ${name}\n`)
        removed++
      }
    }
  }

  const versionFile = join(targetDir, 'VERSION.md')
  if (existsSync(versionFile)) rmSync(versionFile)

  console.log(`\nถอนติดตั้งเสร็จ: ${removed} items\n`)
}

function cmdList() {
  const skills = getSkillNames()
  console.log(`\n🎭 loki-skills-cli v${VERSION} — ${skills.length} skills\n`)
  for (const name of skills) {
    const desc = readSkillDesc(name)
    console.log(`  📜 /${name}`)
    if (desc) console.log(`     ${desc}`)
  }
  console.log()
}

function cmdHelp() {
  console.log(`
🎭 kvasir-skills (loki-skills-cli v${VERSION})
ชุด Kvasir skills โดย Lokkji

Usage:
  kvasir-skills install [-g] [-y]              ติดตั้งสำหรับ Claude Code
  kvasir-skills install --gemini [-y]          ติดตั้งสำหรับ Gemini CLI
  kvasir-skills install --gemini --path <dir>  ระบุ path เอง
  kvasir-skills uninstall [-g] [-y]            ถอนติดตั้ง Claude Code
  kvasir-skills uninstall --gemini [-y]        ถอนติดตั้ง Gemini CLI
  kvasir-skills list                           แสดงรายการ skills ทั้งหมด
  kvasir-skills version                        แสดง version

Flags:
  -g, --global       ติดตั้งใน ~/.claude/skills/ (Claude Code global)
  --gemini           ติดตั้งเป็น .toml commands สำหรับ Gemini CLI
  --path <dir>       กำหนด target directory เอง (override default)
  -y, --yes          ข้ามการยืนยัน

Default paths:
  Claude Code (global): ~/.claude/skills/
  Gemini CLI:           ~/Loki-Gemini/.gemini/commands/

ติดตั้ง Claude Code:
  bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install -g -y

ติดตั้ง Gemini CLI:
  bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install --gemini -y

ติดตั้ง Gemini CLI ใน path อื่น:
  bunx --bun kvasir-skills@github:zirz1911/loki-skills-cli install --gemini --path ~/MyProject/.gemini/commands -y
`)
}

// ── Router ────────────────────────────────────────────────────
switch (command) {
  case 'install':   cmdInstall();   break
  case 'uninstall': cmdUninstall(); break
  case 'list':      cmdList();      break
  case 'version':
    console.log(`loki-skills-cli v${VERSION}`)
    break
  default:
    cmdHelp()
}
