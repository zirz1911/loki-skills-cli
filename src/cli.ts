#!/usr/bin/env bun

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, rmSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const VERSION = '1.0.0'
const PACKAGE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const SKILLS_SRC = join(PACKAGE_DIR, 'skills')
const GLOBAL_TARGET = join(process.env.HOME!, '.claude', 'skills')

// ── Parse args ──────────────────────────────────────────────
const args = process.argv.slice(2)
const command = args[0] ?? 'help'
const isGlobal = args.includes('-g') || args.includes('--global')
const isYes    = args.includes('-y') || args.includes('--yes')

const targetDir = isGlobal ? GLOBAL_TARGET : join(process.cwd(), '.claude', 'skills')

// ── Helpers ──────────────────────────────────────────────────
function getSkillNames(): string[] {
  return readdirSync(SKILLS_SRC).filter(name => {
    return statSync(join(SKILLS_SRC, name)).isDirectory()
  })
}

function updateInstaller(skillPath: string) {
  const mdPath = join(skillPath, 'SKILL.md')
  if (!existsSync(mdPath)) return
  let content = readFileSync(mdPath, 'utf-8')
  content = content.replace(
    /^installer:.*$/m,
    `installer: loki-skills-cli v${VERSION}`
  )
  writeFileSync(mdPath, content)
}

function writeVersionFile(skills: string[]) {
  const content = `# Loki Skills

Installed by: **loki-skills-cli v${VERSION}**
Installed at: ${new Date().toISOString()}
Agent: Claude Code
Skills: ${skills.length}

## Update Skills

\`\`\`bash
bunx --bun loki-skills@github:zirz1911/loki-skills-cli install -g -y
\`\`\`

## Installed Skills

${skills.map(s => `- ${s}`).join('\n')}
`
  writeFileSync(join(targetDir, 'VERSION.md'), content)
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
  console.log(`\n🎭 loki-skills-cli v${VERSION}`)
  console.log(`📦 ${skills.length} skills พร้อม install → ${targetDir}\n`)

  if (!confirm(`ติดตั้ง ${skills.length} skills?`)) {
    console.log('ยกเลิก')
    process.exit(0)
  }

  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true })

  let installed = 0
  let skipped = 0

  for (const name of skills) {
    const src = join(SKILLS_SRC, name)
    const dest = join(targetDir, name)

    cpSync(src, dest, { recursive: true })
    updateInstaller(dest)
    installed++
    process.stdout.write(`  ✅ ${name}\n`)
  }

  writeVersionFile(skills)

  console.log(`\n✨ ติดตั้งเสร็จ: ${installed} skills → ${targetDir}`)
  console.log('🔄 Restart Claude Code เพื่อโหลด skills ใหม่\n')
}

function cmdUninstall() {
  const skills = getSkillNames()
  console.log(`\n🎭 loki-skills-cli v${VERSION}`)
  console.log(`🗑️  จะลบ ${skills.length} skills ออกจาก ${targetDir}\n`)

  if (!confirm('ยืนยันการถอนติดตั้ง?')) {
    console.log('ยกเลิก')
    process.exit(0)
  }

  let removed = 0
  for (const name of skills) {
    const dest = join(targetDir, name)
    if (existsSync(dest)) {
      rmSync(dest, { recursive: true })
      process.stdout.write(`  🗑️  ${name}\n`)
      removed++
    }
  }

  const versionFile = join(targetDir, 'VERSION.md')
  if (existsSync(versionFile)) rmSync(versionFile)

  console.log(`\nถอนติดตั้งเสร็จ: ${removed} skills\n`)
}

function cmdList() {
  const skills = getSkillNames()
  console.log(`\n🎭 loki-skills-cli v${VERSION} — ${skills.length} skills\n`)
  for (const name of skills) {
    const mdPath = join(SKILLS_SRC, name, 'SKILL.md')
    let desc = ''
    if (existsSync(mdPath)) {
      const match = readFileSync(mdPath, 'utf-8').match(/^description:\s*(.+)$/m)
      if (match) desc = match[1]
    }
    console.log(`  📜 /${name}`)
    if (desc) console.log(`     ${desc}`)
  }
  console.log()
}

function cmdHelp() {
  console.log(`
🎭 loki-skills-cli v${VERSION}
ชุด Claude Code skills โดย Lokkji

Usage:
  loki-skills install [-g] [-y]    ติดตั้ง skills ทั้งหมด
  loki-skills uninstall [-g] [-y]  ถอนติดตั้ง skills ทั้งหมด
  loki-skills list                 แสดงรายการ skills ทั้งหมด
  loki-skills version              แสดง version

Flags:
  -g, --global   ติดตั้งใน ~/.claude/skills/ (global)
  -y, --yes      ข้ามการยืนยัน

ติดตั้งครั้งแรก:
  bunx --bun loki-skills@github:zirz1911/loki-skills-cli install -g -y
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
