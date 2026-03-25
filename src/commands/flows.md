---
description: "Manage skill dependencies with auto-discovery, matching, and confirmation flow"
---

<purpose>
Manage project skill dependencies. Auto-discovers available skills by scanning ~/.claude/commands/ and reading their frontmatter (description, when-to-use). Matches skills to project context (PROJECT.md, ROADMAP.md, plan tasks) with confidence levels. Presents suggestions for user confirmation before saving to .teddy/FLOWS.md.
</purpose>

<user-story>
As a developer, I want Teddy to proactively suggest which of my custom skills are relevant to my current project and phase, so I don't forget to use important skills and the team can enforce their usage during execution.
</user-story>

<when-to-use>
- Setting up skill dependencies for a new project
- After adding new custom skills
- Before planning a phase that may require specific skills
- Auditing skill usage before UNIFY
- Entry point routes here via /teddy:flows
</when-to-use>

<context>
@context/session.md
@.teddy/PROJECT.md
@.teddy/ROADMAP.md
@.teddy/FLOWS.md (if exists)
</context>

<references>
@frameworks/skill-flows.md
</references>

<steps>

<step name="route_subcommand" priority="first">
**Parse the argument to determine which subcommand to execute:**

- No argument → full interactive configuration (proceed to subsequent steps)
- `add` → jump to quick-add subcommand section
- `audit` → jump to audit subcommand section
- `list` → jump to list subcommand section

If the argument doesn't match any known subcommand, show:
```
Unknown subcommand: [arg]
Available: add, audit, list
Or run /teddy:flows with no argument for full interactive configuration.
```
</step>

<step name="discover_available_skills">
**Scan and catalog available skills:**

1. **Scan available skills:**
   - `ls ~/.claude/commands/ 2>/dev/null`
   - `find ~/.claude/commands/ -name "*.md" -maxdepth 2 2>/dev/null`

2. **For each discovered skill file**, read first 30 lines to extract frontmatter:
   - `description` field from YAML frontmatter
   - `name` (derive from filename if not in frontmatter)
   - Look for `<when-to-use>` or `<purpose>` sections

3. **Categorize** by analyzing description keywords:
   - design, backend, frontend, testing, devops, content, security, other

4. **Present discovered skills table:**
```
════════════════════════════════════════
SKILL DISCOVERY
════════════════════════════════════════

Found [N] skills in ~/.claude/commands/

| # | Skill           | Category   | Description                     |
|---|-----------------|------------|---------------------------------|
| 1 | skill-name      | backend    | [description from frontmatter]  |
| 2 | another-skill   | testing    | [description from frontmatter]  |
| ...                                                                  |
```

5. **If no skills found:**
```
No custom skills found in ~/.claude/commands/.
You can manually add skills with /teddy:flows add
```
Exit gracefully — do not proceed to matching.

**SECURITY:** Never include file contents beyond frontmatter/metadata. Do not expose full skill implementations.
</step>

<step name="match_skills_to_project">
**Match discovered skills against project context:**

1. **Read project context:**
   - `.teddy/PROJECT.md` — tech stack, constraints, project type
   - `.teddy/ROADMAP.md` — current milestone, phase goals, upcoming work
   - `.teddy/FLOWS.md` — existing config (to avoid re-suggesting rejected skills)

2. **For each discovered skill, compute a match:**
   - Compare skill description/category against PROJECT.md tech stack keywords
   - Compare skill `<when-to-use>` against ROADMAP.md current phase goals
   - Check if previously rejected in FLOWS.md `## Rejected Suggestions` → mark as SKIP

3. **Assign confidence levels:**
   - **HIGH** — direct keyword match between skill description and project stack/goals
   - **MEDIUM** — category match (e.g., skill is "testing" and project has test phases)
   - **LOW** — indirect match (e.g., skill is "security" and project mentions auth)
   - **SKIP** — previously rejected by user in FLOWS.md

4. **Present matched suggestions sorted by confidence:**
```
════════════════════════════════════════
SKILL MATCHING
════════════════════════════════════════

Project: [name] | Stack: [stack]
Current Phase: [phase from ROADMAP.md]

| # | Skill           | Match Reason                    | Confidence | Suggested Priority |
|---|-----------------|--------------------------------|------------|--------------------|
| 1 | skill-name      | Stack match: React, TypeScript | HIGH       | required           |
| 2 | another-skill   | Phase goal: "add tests"        | MEDIUM     | recommended        |
| 3 | low-match-skill | Category: security             | LOW        | optional           |

[N] skills skipped (previously rejected)
```

If no matches found above LOW confidence:
```
No strong skill matches found for this project context.
You can manually add skills with /teddy:flows add
```
</step>

<step name="confirmation_flow">
**Present each suggestion for user confirmation:**

For each matched skill (sorted by confidence, highest first):

```
[1/N] skill-name (HIGH confidence)
  Match: Stack match — React, TypeScript
  Suggested: required for all phases

  [y] Accept  [n] Reject (won't be re-suggested)  [a] Accept with adjustments
  >
```

**If user selects [y] Accept:**
Record with suggested defaults (work type, priority, trigger).

**If user selects [n] Reject:**
Ask: "Brief reason for rejecting? (helps avoid re-suggesting)"
Record in Rejected Suggestions with reason and date.

**If user selects [a] Accept with adjustments:**
Ask for:
- Work type: `design | backend | frontend | testing | devops | content | security | other`
- Priority: `required | recommended | optional`
- Trigger: `always | phase-specific | manual`

**After all suggestions processed:**
```
────────────────────────────────────────
CONFIRMATION SUMMARY
────────────────────────────────────────

Accepted: [N] skills ([N] required, [N] recommended, [N] optional)
Rejected: [N] skills
Skipped:  [N] skills (previously rejected)

Any skills NOT listed that you want to add manually? (name or "done")
```

If user provides a skill name, use the quick-add flow (same as `add` subcommand).
If user says "done", proceed to output generation.

**Wait for user response at each confirmation prompt.**
</step>

<step name="generate_output">
**Generate .teddy/FLOWS.md:**

1. **Generate** `.teddy/FLOWS.md` from @templates/FLOWS.md with all confirmed mappings:
   - Populate `## Discovered Skills` with the full scan results
   - Populate `## Project Mappings` with accepted skills (work type, priority, trigger, confidence)
   - Populate `## Rejected Suggestions` with rejected skills and reasons
   - Set header metadata: project name, date, skill counts

2. **If `.teddy/FLOWS.md` already exists:**
   - Show diff of changes (new skills added, removed, priority changes)
   - Ask: "Update existing FLOWS.md? [y/n]"
   - If no, exit without writing

3. **Phase overrides:**
   - Read ROADMAP.md phases list
   - For each upcoming phase (next 2-3 after current):
     ```
     Phase [N]: [Name] — any additional skills needed beyond project defaults?
     (skill name + priority, or "skip")
     >
     ```
   - Record overrides in `.teddy/FLOWS.md` `## Phase Overrides` table
   - If user skips all, leave Phase Overrides empty

4. **Report summary:**
```
════════════════════════════════════════
FLOWS CONFIGURED
════════════════════════════════════════

Project: [name]
Skills: [N] required, [N] recommended, [N] optional
Rejected: [N] (won't be re-suggested)

Output: .teddy/FLOWS.md

────────────────────────────────────────
Skills are now available for /teddy:plan
to detect and include in execution plans.
────────────────────────────────────────
```
</step>

</steps>

<!-- ═══════════════════════════════════ -->
<!-- SUBCOMMANDS                        -->
<!-- ═══════════════════════════════════ -->

<subcommand name="add">
**Quick-add a single skill mapping.**

Usage: `/teddy:flows add`

1. Ask for skill name (or path to .md file)
2. Validate skill exists in `~/.claude/commands/`:
   - If found: read frontmatter, show description
   - If not found: warn "Skill not found in ~/.claude/commands/, adding as manual entry"
3. Ask for:
   - Work type: `design | backend | frontend | testing | devops | content | security | other`
   - Priority: `required | recommended | optional`
   - Trigger: `always | phase-specific | manual`
4. Append to `.teddy/FLOWS.md` `## Project Mappings` table
5. Add entry to `## Amendment History`

If `.teddy/FLOWS.md` doesn't exist, create it from @templates/FLOWS.md first.

```
Added: [skill-name] ([priority], [trigger])
Updated: .teddy/FLOWS.md
```
</subcommand>

<subcommand name="audit">
**Audit skill usage for the current phase.**

Usage: `/teddy:flows audit`

1. Read `.teddy/FLOWS.md` — if missing: "No flows configured. Run /teddy:flows first."
2. Read `.teddy/STATE.md` — current phase and progress
3. Identify required skills for current phase:
   - All `required` skills with trigger `always`
   - Skills with trigger `phase-specific` matching current phase
   - Phase-specific overrides from `## Phase Overrides`
4. Present audit table:

```
════════════════════════════════════════
SKILL AUDIT: Phase [N] — [Name]
════════════════════════════════════════

| Skill           | Priority    | Status      | Notes                    |
|-----------------|-------------|-------------|--------------------------|
| skill-name      | required    | configured  | In PLAN.md <skills>      |
| another-skill   | required    | MISSING     | Not found in current plan|
| optional-skill  | optional    | not used    | Available if needed      |

Required: [N]/[N] configured
Recommended: [N]/[N] configured

[PASS] All required skills accounted for.
— or —
[WARN] [N] required skills missing from current plan.
```
</subcommand>

<subcommand name="list">
**List current flows configuration.**

Usage: `/teddy:flows list`

1. Read `.teddy/FLOWS.md` — if missing: "No flows configured. Run /teddy:flows first."
2. Show:

```
════════════════════════════════════════
FLOWS: [Project Name]
════════════════════════════════════════

## Project Mappings
| Work Type  | Skill           | Priority    | Trigger        |
|------------|-----------------|-------------|----------------|
| backend    | skill-name      | required    | always         |
| testing    | another-skill   | recommended | phase-specific |

## Phase Overrides
| Phase              | Additional Skills          |
|--------------------|---------------------------|
| 03-testing         | e2e-skill (required)      |

Summary: [N] required, [N] recommended, [N] optional
Last Updated: [date]
```
</subcommand>

<acceptance-criteria>
- [ ] Frontmatter with description present
- [ ] Purpose, user-story, when-to-use sections defined
- [ ] route_subcommand step routes to correct subcommand or full flow
- [ ] discover_available_skills scans ~/.claude/commands/ and reads frontmatter
- [ ] match_skills_to_project computes confidence levels against project context
- [ ] confirmation_flow presents [y]/[n]/[a] per skill with rejection tracking
- [ ] generate_output writes .teddy/FLOWS.md from template with diff handling
- [ ] Phase overrides prompt for upcoming phases
- [ ] Subcommand: add — quick-adds single skill with validation
- [ ] Subcommand: audit — cross-references FLOWS.md with STATE.md
- [ ] Subcommand: list — displays current configuration
- [ ] Security: never exposes full skill file contents
- [ ] Boundaries: only writes to .teddy/FLOWS.md, read-only scan of ~/.claude/commands/
</acceptance-criteria>

<boundaries>
## WRITE SCOPE
- FLOWS.md only writes to `.teddy/FLOWS.md`
- Never creates files outside `.teddy/` directory

## READ-ONLY ACCESS
- `~/.claude/commands/` is scanned read-only — never modifies skill files
- `.teddy/PROJECT.md`, `.teddy/ROADMAP.md`, `.teddy/STATE.md` are read but never modified

## SECURITY
- Never exposes full skill file contents (frontmatter/metadata only)
- Never includes actual secrets, API keys, or credentials found during scanning
- Skill file paths are shown but not their implementation details
</boundaries>

<output>
## Artifact
`.teddy/FLOWS.md` — skill dependency mappings with discovered skills, project mappings, rejected suggestions, phase overrides, and amendment history.

## Location
`.teddy/FLOWS.md`

## Format
Generated from @templates/FLOWS.md
</output>
