---
description: "Analyze project state and codebase to surface opportunities and converge on a direction"
---

<purpose>
Proactive exploration that reads the project's .teddy/ state, analyzes the real codebase, ideates opportunities (features, fixes, improvements, tech debt), and discusses with the user to converge into a direction for /teddy:plan.
</purpose>

<user-story>
As a developer, I want Teddy to proactively analyze my project state and codebase to surface what's worth building or fixing next, so I can make informed decisions instead of guessing.
</user-story>

<when-to-use>
- Starting a new work session and want to decide what to do next
- After completing a phase and looking for the next priority
- When the project feels stale and needs fresh direction
- Before planning — to ensure the plan is grounded in real state
- Entry point routes here via /teddy:explore
</when-to-use>

<context>
@context/session.md
@.teddy/PROJECT.md
@.teddy/ROADMAP.md
@.teddy/STATE.md
</context>

<references>
@frameworks/teammate-orchestration.md (when spawning research teammates)
@frameworks/quality-principles.md (for scope assessment)
@templates/EXPLORATION.md (for output format)
</references>

<steps>

<step name="validate_teddy_state" priority="first">
**Validate .teddy/ exists:**

Check for `.teddy/` directory in the project root.

**If `.teddy/` does NOT exist:**
```text
No .teddy/ folder found in this project.
Explore needs project state to work proactively.

▶ Redirecting to /teddy:init
```
**Stop here and invoke /teddy:init. Do not proceed.**

**If `.teddy/` exists:**
Read these files in parallel:
- `.teddy/PROJECT.md` — project identity, stack, constraints
- `.teddy/ROADMAP.md` — planned phases and milestones
- `.teddy/STATE.md` — current progress, completed phases, blockers

Also read any existing SUMMARY.md files from completed phases to understand what was already built and any deviations noted.

Also read existing explorations to avoid re-discovering known issues:
- Glob for `.teddy/explorations/EXPLORATION-*.md`
- For each found, read the title, date, and recommendation section
- Store as **prior explorations** — skip re-surfacing findings that were already addressed in completed phases

Store this as **project context** for the next steps.
</step>

<step name="analyze_codebase">
**Analyze the real codebase against project state:**

**SECURITY:** When analyzing the codebase, never include actual secrets, API keys, tokens, passwords, or credentials in exploration findings. If you encounter sensitive values, note their location (file + line) without reproducing the value itself.

Spawn 3 parallel Explore subagents (use the Agent tool with `subagent_type="Explore"` for each):

**Subagent 1: Code Health**
- Grep for `TODO`, `FIXME`, `HACK`, `XXX` across the codebase
- Identify large files (>500 lines) that may need splitting
- Look for duplicated patterns across modules
- Check for missing error handling at system boundaries (user input, external APIs)

**Subagent 2: Test & Dependency Health**
- Check which modules have tests and which don't
- Identify untested critical paths (core business logic without coverage)
- Run `npm outdated` or equivalent to check dependency freshness
- Flag missing or mismatched dependencies

**Subagent 3: Roadmap vs Reality**
- Cross-reference ROADMAP phases marked "complete" against actual code
- Verify SUMMARY.md files match reality — do listed modules/files actually exist?
- Check for empty or stub implementations in "completed" phases
- Compare with **prior explorations** to identify new vs already-known issues

Wait for all 3 subagents to return, then collect findings into a structured analysis.
</step>

<step name="ideate_opportunities">
**Categorize findings into opportunity areas:**

Build a table of opportunities from the analysis:

```text
════════════════════════════════════════
EXPLORATION: Project Health & Opportunities
════════════════════════════════════════

Project: [name] | Stack: [stack]
State: [current milestone/phase from STATE.md]

────────────────────────────────────────
FINDINGS
────────────────────────────────────────

| # | Category        | Finding                          | Priority | Effort |
|---|-----------------|----------------------------------|----------|--------|
| 1 | New Feature     | [description]                    | HIGH     | M      |
| 2 | Bug/Fix         | [description]                    | HIGH     | S      |
| 3 | Improvement     | [description]                    | MEDIUM   | L      |
| 4 | Tech Debt       | [description]                    | LOW      | S      |
| ...                                                                         |

Priority: HIGH / MEDIUM / LOW
Effort: S (< 1 phase) / M (1 phase) / L (multi-phase)

────────────────────────────────────────
TOP 3 RECOMMENDATIONS
────────────────────────────────────────

1. [Recommendation] — [rationale]
2. [Recommendation] — [rationale]
3. [Recommendation] — [rationale]
```

Present this to the user and ask:

```text
What catches your attention?
- Pick one or more items to explore further
- Suggest something not listed
- Or approve a recommendation to proceed to /teddy:plan
```

**Wait for response.**
</step>

<step name="discuss_and_refine">
**Interactive discussion (max 3 rounds):**

Engage the user in refining the direction. Each round:

1. Take user feedback and adjust recommendations
2. If deeper analysis is needed, spawn an Explore subagent with a focused prompt targeting the selected topic. Present results before the next round.
3. Re-present refined options with updated analysis

**Round tracking:**
- Round 1: Initial reaction — what interests the user
- Round 2: Deeper dive into selected topics, tradeoff discussion
- Round 3: Final convergence — present a clear recommendation

**Rounds 1-2 output format:**
```text
────────────────────────────────────────
ROUND [N]/3
────────────────────────────────────────

Updated findings based on your feedback:
[refined table or focused analysis]

What's your direction?
- Narrow further
- Approve to proceed
- One more round
```

At **round 3**, converge:
```text
────────────────────────────────────────
CONVERGENCE (Round 3/3)
────────────────────────────────────────

Based on our discussion, the recommended direction is:

Direction: [one-liner]
Scope: [what's included / excluded]
Why now: [urgency or strategic reason]
Estimated phases: [N]

Approve this direction? (yes / one more round / stop here)
```

If user asks for "one more round" explicitly, allow it. Otherwise, 3 rounds is the limit.

**Wait for confirmation at each round.**
</step>

<step name="write_exploration">
**Write EXPLORATION.md:**

Once the user approves a direction, write the exploration output using @templates/EXPLORATION.md format.

Location: `.teddy/explorations/EXPLORATION-{date}-{topic-slug}.md`

The EXPLORATION.md should capture:
- The state analysis that was done
- Opportunities identified
- Discussion summary (key decisions from the rounds)
- Final recommendation with confidence level
- How this feeds into the next plan
</step>

<step name="route_to_plan">
**Present final summary and suggest next step:**

```text
════════════════════════════════════════
EXPLORATION COMPLETE
════════════════════════════════════════

Topic: [what was explored]
Depth: [Standard / Deep]
Confidence: [HIGH / MEDIUM / LOW]
Rounds: [N]

Direction: [one-liner]

Output: .teddy/explorations/EXPLORATION-{date}-{topic-slug}.md

────────────────────────────────────────
▶ SUGGESTED NEXT: /teddy:plan
  Create plan informed by exploration findings.
────────────────────────────────────────

Want to proceed to /teddy:plan? (yes / no / explore more)
```

**IMPORTANT: Do NOT invoke /teddy:plan automatically. Wait for explicit user authorization before routing.**
**If user says no, the exploration is complete — do not push further.**
</step>

</steps>

<output>
## Artifact
EXPLORATION.md following templates/EXPLORATION.md format, enriched with state analysis and ideation findings.

## Location
`.teddy/explorations/EXPLORATION-{date}-{topic-slug}.md`
</output>

<acceptance-criteria>
- [ ] .teddy/ state validated — redirects to /teddy:init if missing
- [ ] PROJECT.md, ROADMAP.md, STATE.md read and analyzed
- [ ] Real codebase analyzed (TODOs, test gaps, roadmap vs reality)
- [ ] Opportunities categorized with priority and effort
- [ ] Top 3 recommendations presented to user
- [ ] Interactive discussion completed (max 3 rounds)
- [ ] Direction confirmed by user before writing output
- [ ] EXPLORATION.md written with findings, discussion, and recommendation
- [ ] Clear routing to /teddy:plan after completion
</acceptance-criteria>
