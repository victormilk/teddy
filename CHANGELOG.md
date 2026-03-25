# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- Convention: Update this file during /teddy:unify for each plan completed.
     Use categories: Added, Changed, Deprecated, Removed, Fixed, Security.
     Keep [Unreleased] section at top for in-progress work. -->

## [Unreleased]

## [0.7.0] - 2026-03-25

### Added

- CHANGELOG.md with complete version history
- Explore skill redesign: loads `.teddy/` state files for context-aware analysis
- Explore skill: past-exploration awareness via prior-exploration field in EXPLORATION.md template
- Explore skill: parallel subagent execution for codebase analysis
- Install listing now includes all 14 commands (was missing 3)
- Parity test ensuring install.js listing matches src/commands/

### Changed

- Explore skill: clearer discuss-and-refine round mechanics
- Markdown polish across all commands and framework files (formatting, typos, consistency)

### Fixed

- Install listing missing `amend-plan`, `rollback`, and `flows` commands
- Code block language tags added to explore.md for proper syntax highlighting

## [0.6.0] - 2026-03-25

### Added

- `/teddy:flows` command for skill dependency management with auto-discovery
- `skill-flows.md` framework document for skill flow integration
- Auto-discovery: scans `~/.claude/commands/` and reads skill metadata
- Semantic matching of skills against project stack and current phase
- Confirmation flow with confidence levels for skill suggestions
- Skill detection during PLAN, verification during APPLY, audit during UNIFY

## [0.5.0] - 2026-03-25

### Added

- `/teddy:amend-plan` command for modifying active plans mid-execution
- `/teddy:rollback` command for reverting UNIFY merges using safety tags

### Changed

- Upgraded vitest to 4.x

## [0.4.0] - 2026-03-25

### Added

- Published to npm as `teddy-framework`

## [0.3.0] - 2026-03-24

### Added

- `/teddy:plan` command for creating executable plans with teammate assignments
- `/teddy:apply` command for distributing and executing plans via Agent Teams
- `/teddy:unify` command for reconciling teammate results and merging
- `/teddy:status` command for viewing team progress and project health
- `/teddy:resume` command for resuming work across sessions
- `/teddy:debug` command for structured debugging workflow
- `/teddy:review` command for code review
- `/teddy:cleanup` command for cleaning orphaned teams, tasks, and worktrees
- Skill metadata (description frontmatter) for all command files
- `.teddy/` project state documents (PROJECT.md, ROADMAP.md, STATE.md)
- Session resilience with STATE.md validation and pre-flight checks

### Changed

- Command syntax changed from slash to colon separator (`/teddy:command`)

### Fixed

- Installer hardening: input validation, @references verification, security warnings

## [0.2.0] - 2026-03-24

### Added

- `/teddy:map-codebase` command for structured codebase analysis
- 7 codebase analysis templates (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS)
- 4 parallel Explore agents for codebase mapping

## [0.1.0] - 2026-03-24

### Added

- Initial release of Teddy framework
- Skill architecture with markdown-based command definitions
- `npx teddy-framework` installer with global/local mode
- `/teddy:init` command for project initialization
- `/teddy:explore` command for idea exploration before planning
- Core framework files: teammate-orchestration, loop-phases, plan-format, quality-principles
- Document templates: PROJECT.md, ROADMAP.md, STATE.md, PLAN.md, SUMMARY.md, EXPLORATION.md
- README with install instructions, commands, and project overview
