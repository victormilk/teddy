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
- Entry point routes here via /teddy map-codebase
</when-to-use>

<context>
@context/session.md
</context>

<references>
@frameworks/teammate-orchestration.md (for parallel agent spawning)
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
  prompt: "Analyze this codebase for technology stack and external integrations. Include actual file paths in findings. Focus: languages, runtime, frameworks, dependencies, external services, configuration. Output structured findings."
```

**Teammate 2: Architecture + Structure (Organization Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Analyze architecture and directory structure"
  prompt: "Analyze this codebase architecture and directory structure. Include actual file paths. Focus: architectural pattern, layers, data flow, key abstractions, entry points, directory organization. Output structured findings."
```

**Teammate 3: Conventions + Testing (Quality Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Analyze coding conventions and test patterns"
  prompt: "Analyze this codebase for coding conventions and testing practices. Include actual file paths. Focus: code style, naming, test framework, test organization, coverage approach, linting. Output structured findings."
```

**Teammate 4: Concerns (Issues Focus)**
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Identify technical debt and concerns"
  prompt: "Analyze this codebase for technical debt, known issues, and concerns. Include actual file paths for every concern. Focus: TODOs, complexity, missing error handling, security patterns, outdated deps, missing tests. Output structured findings."
```
</step>

<step name="collect_and_write">
After all 4 teammates complete:

1. Collect results from each
2. Write 7 documents to `.teddy/codebase/`:
   - STACK.md (from Teammate 1)
   - INTEGRATIONS.md (from Teammate 1)
   - ARCHITECTURE.md (from Teammate 2)
   - STRUCTURE.md (from Teammate 2)
   - CONVENTIONS.md (from Teammate 3)
   - TESTING.md (from Teammate 3)
   - CONCERNS.md (from Teammate 4)
3. Verify all documents created and non-empty
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
▶ NEXT: /teddy init or /teddy plan
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
