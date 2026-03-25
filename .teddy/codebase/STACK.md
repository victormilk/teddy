# Technology Stack

**Analysis Date:** 2026-03-24

## Languages

**Primary:**
- JavaScript (Node.js) — Installation script (`bin/install.js`)
- Markdown — All command definitions, frameworks, templates, checklists (98% of codebase)

**Secondary:**
- YAML — Frontmatter in markdown files for metadata
- XML-style tags — Structured sections within markdown (`<purpose>`, `<steps>`, `<task>`)

## Runtime

**Environment:**
- Node.js >= 16.7.0 (specified in `package.json` engines field)
- Runs within Claude Code context (not standalone)

**Package Manager:**
- npm (implied from package.json structure)
- No lockfile present (zero external dependencies)

## Frameworks

**Core:**
- None — Pure Node.js CLI with zero external framework dependencies
- Uses only built-in modules: `fs`, `path`, `os`, `readline`

**Testing:**
- None configured

**Build/Dev:**
- No build tooling, transpilation, or bundling required

## Key Dependencies

**Critical: NONE**

Teddy has zero external npm dependencies. The entire framework operates with:
- Node.js built-in `fs` — File system operations
- Node.js built-in `path` — Path utilities
- Node.js built-in `os` — OS utilities (home directory)
- Node.js built-in `readline` — CLI interactive prompts

**Claude Code Tools (runtime dependencies):**
- `Agent` — Spawn subagents and Agent Teams
- `TeamCreate` / `TeamDelete` — Team lifecycle management
- `TaskCreate` / `TaskUpdate` / `TaskList` — Shared task list coordination
- `SendMessage` — Inter-teammate communication

## Configuration

**Environment:**
- `CLAUDE_CONFIG_DIR` (optional) — Custom Claude config directory location
- Default paths: `~/.claude/` (global) or `./.claude/` (local)
- No `.env` files — no secrets to manage

**Build:**
- `package.json` — Project metadata, version (0.3.0), bin entry point
- `.gitignore` — Excludes `node_modules/` and installed command copies

## Platform Requirements

**Development:**
- Any OS (Linux, macOS, Windows)
- Node.js 16.7.0+
- Git (for version control)

**Installation:**
- `npx teddy-framework` to install globally or locally
- Target: Claude Code IDE (`~/.claude/` or `./.claude/`)

**Production:**
- Distributed via npm registry
- GitHub: `https://github.com/victormilk/teddy.git`

---

*Stack analysis: 2026-03-24*
*Update after major dependency changes*
