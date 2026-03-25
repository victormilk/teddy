---
description: "Orchestrate parallel Explore agents to analyze and document the entire codebase"
---

<purpose>
Orchestrate parallel Explore teammates to analyze codebase and produce structured documents in .teddy/codebase/. Each teammate has fresh context and focuses on specific aspects.
</purpose>

<user-story>
As a developer, I want my codebase automatically analyzed and documented, so that planning and onboarding are informed by accurate codebase knowledge.
</user-story>

<when-to-use>
- Starting work on an existing codebase
- Before first planning session
- After major refactoring
- Entry point routes here via /teddy:map-codebase
</when-to-use>

<context>
@context/session.md
</context>

<references>
@frameworks/teammate-orchestration.md (for parallel agent spawning)
@templates/codebase/STACK.md (template for technology stack)
@templates/codebase/ARCHITECTURE.md (template for architecture)
@templates/codebase/STRUCTURE.md (template for directory structure)
@templates/codebase/CONVENTIONS.md (template for coding conventions)
@templates/codebase/TESTING.md (template for testing patterns)
@templates/codebase/INTEGRATIONS.md (template for external integrations)
@templates/codebase/CONCERNS.md (template for tech debt and issues)
</references>

<steps>

<step name="check_existing" priority="first">
Check if .teddy/codebase/ already exists:

```bash
ls -la .teddy/codebase/ 2>/dev/null
```

**If exists:**
```
.teddy/codebase/ already exists with these documents:
[List files found]

What's next?
1. Refresh — Delete existing and remap codebase
2. Update — Keep existing, only update specific documents
3. Skip — Use existing codebase map as-is
```

Wait for user response.

**If doesn't exist:** continue to spawn teammates.
</step>

<step name="spawn_teammates">
```bash
mkdir -p .teddy/codebase
```

Spawn 4 parallel Explore teammates:

**Teammate 1: Stack + Integrations (Technology Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Analyze tech stack and integrations"
  prompt: |
    Analyze this codebase for technology stack and external integrations.
    Include actual file paths in findings.

    For STACK, document: languages, runtime, package manager, frameworks,
    key dependencies (limit 5-10), configuration, platform requirements.
    Follow the template structure from @templates/codebase/STACK.md.

    For INTEGRATIONS, document: external APIs/services, data storage,
    auth providers, monitoring, CI/CD, environment config, webhooks.
    Follow the template structure from @templates/codebase/INTEGRATIONS.md.

    IMPORTANT: Document WHERE secrets live (env var names), never actual values.
    Output structured findings organized by these two documents.
```

**Teammate 2: Architecture + Structure (Organization Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Analyze architecture and directory structure"
  prompt: |
    Analyze this codebase architecture and directory structure.
    Include actual file paths.

    For ARCHITECTURE, document: overall pattern, layers and responsibilities,
    data flow/request lifecycle, key abstractions, entry points, error handling
    strategy, cross-cutting concerns.
    Follow the template structure from @templates/codebase/ARCHITECTURE.md.

    For STRUCTURE, document: directory layout (ASCII tree), directory purposes,
    key file locations, naming conventions, where to add new code, special directories.
    Follow the template structure from @templates/codebase/STRUCTURE.md.

    Output structured findings organized by these two documents.
```

**Teammate 3: Conventions + Testing (Quality Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Analyze coding conventions and test patterns"
  prompt: |
    Analyze this codebase for coding conventions and testing practices.
    Include actual file paths.

    For CONVENTIONS, document: naming patterns (files, functions, variables, types),
    code style/formatting, import organization, error handling patterns, logging,
    comment conventions, function and module design.
    Follow the template structure from @templates/codebase/CONVENTIONS.md.

    For TESTING, document: test framework/runner, file organization, test structure,
    mocking patterns, fixtures/factories, coverage, test types, common patterns.
    Follow the template structure from @templates/codebase/TESTING.md.

    Be prescriptive: "Use X" not "Sometimes Y is used".
    Output structured findings organized by these two documents.
```

**Teammate 4: Concerns (Issues Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Identify technical debt and concerns"
  prompt: |
    Analyze this codebase for technical debt, known issues, and concerns.
    Include actual file paths for EVERY concern.

    Document: tech debt, known bugs, security considerations, performance
    bottlenecks (with measurements), fragile areas, scaling limits,
    dependencies at risk, missing critical features, test coverage gaps.
    Follow the template structure from @templates/codebase/CONCERNS.md.

    IMPORTANT: Be specific with measurements ("500ms p95" not "slow").
    Include fix approaches, not just problems.
    Always include file paths — concerns without locations are not actionable.
    Output structured findings.
```
</step>

<step name="collect_and_write">
After all 4 teammates complete:

1. Collect results from each
2. Write 7 documents to `.teddy/codebase/`, following the **File Template** section from each template:
   - STACK.md (from Teammate 1) — use @templates/codebase/STACK.md format
   - INTEGRATIONS.md (from Teammate 1) — use @templates/codebase/INTEGRATIONS.md format
   - ARCHITECTURE.md (from Teammate 2) — use @templates/codebase/ARCHITECTURE.md format
   - STRUCTURE.md (from Teammate 2) — use @templates/codebase/STRUCTURE.md format
   - CONVENTIONS.md (from Teammate 3) — use @templates/codebase/CONVENTIONS.md format
   - TESTING.md (from Teammate 3) — use @templates/codebase/TESTING.md format
   - CONCERNS.md (from Teammate 4) — use @templates/codebase/CONCERNS.md format
3. Fill each template's `[placeholders]` with actual findings — remove unused sections
4. Verify all documents created and non-empty
</step>

<step name="report">
```
Codebase mapping complete.

Created .teddy/codebase/:
- STACK.md — Technologies and dependencies
- ARCHITECTURE.md — System design and patterns
- STRUCTURE.md — Directory layout and organization
- CONVENTIONS.md — Code style and patterns
- TESTING.md — Test structure and practices
- INTEGRATIONS.md — External services and APIs
- CONCERNS.md — Technical debt and issues

────────────────────────────────────────
▶ NEXT: /teddy:init or /teddy:plan
────────────────────────────────────────
```
</step>

</steps>

<output>
7 codebase documents in `.teddy/codebase/`:
STACK.md, ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, INTEGRATIONS.md, CONCERNS.md
</output>

<acceptance-criteria>
- [ ] 4 parallel Explore teammates spawned
- [ ] All 7 codebase documents created
- [ ] Documents contain actual file paths (not vague descriptions)
- [ ] No empty documents
- [ ] User informed of results and next steps
</acceptance-criteria>
