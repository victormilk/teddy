---
description: "Initialize Teddy structure in a new project with .teddy/ directory and project files"
---

<purpose>
Initialize Teddy structure in a new project. Creates .teddy/ directory with PROJECT.md, ROADMAP.md, STATE.md, and phases/ directory. Gathers project context conversationally before routing to planning.
</purpose>

<user-story>
As a developer, I want to initialize a structured project workspace with Teddy, so that I can start planning and delegating work to agent teammates immediately.
</user-story>

<when-to-use>
- Starting Teddy in a project that doesn't have .teddy/ directory
- User explicitly requests project initialization
- Beginning a new project from scratch
- Entry point routes here via /teddy:init
</when-to-use>

<context>
@context/session.md
</context>

<references>
@frameworks/quality-principles.md (for project sizing philosophy)
@templates/PROJECT.md (for project file structure)
@templates/STATE.md (for state file structure)
@templates/ROADMAP.md (for roadmap structure)
</references>

<steps>

<step name="check_existing" priority="first">
1. Check if .teddy/ directory exists:
   ```bash
   ls .teddy/ 2>/dev/null
   ```
2. If exists:
   - "Teddy already initialized in this project."
   - Route to `/teddy:resume`
   - Exit this workflow
3. If not exists: proceed with initialization
</step>

<step name="create_structure">
Create directories:
```bash
mkdir -p .teddy/phases .teddy/debug
```

Display:
```
Teddy structure created.

Before planning, I need to understand what you're building.
```
</step>

<step name="gather_core_value">
**Ask ONE question at a time. Wait for response before next question.**

**Question 1: Core Value**
```
What's the core value this project delivers?

(Example: "Users can track expenses and see spending patterns")
```

Wait for user response. Store as `core_value`.
</step>

<step name="gather_description">
**Question 2: What are you building?**
```
What are you building? (1-2 sentences)

(Example: "A CLI tool for managing Docker containers")
```

Wait for user response. Store as `description`.
</step>

<step name="gather_project_name">
**Question 3: Project name**

Infer from:
1. Directory name
2. package.json name field
3. Ask if unclear

If obvious, confirm:
```
Project name: [inferred-name]

Is this correct? (yes/different name)
```

Store as `project_name`.
</step>

<step name="create_project_files">
Create all project files using templates:

1. `.teddy/PROJECT.md` — populated from gathered information using @templates/PROJECT.md
2. `.teddy/ROADMAP.md` — skeleton for planning using @templates/ROADMAP.md
3. `.teddy/STATE.md` — initialized state using @templates/STATE.md

Populate with gathered `project_name`, `core_value`, `description`.

Set initial state:
- Milestone: v0.1 Initial Release
- Phase: Not yet defined
- Loop Position: all pending
- Session Continuity: Next action = /teddy:plan
</step>

<step name="confirm_and_route">
Display confirmation with ONE next action:

```
════════════════════════════════════════
TEDDY INITIALIZED
════════════════════════════════════════

Project: [project_name]
Core value: [core_value]

Created:
  .teddy/PROJECT.md    ✓
  .teddy/ROADMAP.md    ✓
  .teddy/STATE.md      ✓
  .teddy/phases/       ✓

────────────────────────────────────────
▶ NEXT: /teddy:plan
  Define your phases and create your first plan.
────────────────────────────────────────

Type "yes" to proceed, or ask questions first.
```

Do NOT suggest multiple next steps. ONE action only.
</step>

</steps>

<output>
- `.teddy/` directory structure
- `.teddy/PROJECT.md` (populated from conversation)
- `.teddy/ROADMAP.md` (skeleton for planning)
- `.teddy/STATE.md` (initialized state)
- `.teddy/phases/` (empty directory)
- Clear routing to `/teddy:plan`
</output>

<acceptance-criteria>
- [ ] .teddy/ directory created with phases/ subdirectory
- [ ] PROJECT.md populated with project name, description, core value
- [ ] ROADMAP.md created with skeleton structure
- [ ] STATE.md created with initial loop position (all pending)
- [ ] User informed of next action: /teddy:plan
- [ ] No existing .teddy/ was overwritten without user consent
</acceptance-criteria>
