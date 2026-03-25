<purpose>
Systematic debugging with persistent state that survives context resets. The debug file IS the debugging brain — create it immediately and update it continuously. Optionally spawns investigation teammates for parallel hypothesis testing.
</purpose>

<user-story>
As a developer, I want structured debugging that persists across sessions and can leverage parallel investigation agents, so that complex bugs get resolved systematically without losing progress.
</user-story>

<when-to-use>
- User reports a bug or unexpected behavior
- Tests failing without obvious cause
- Need systematic investigation across multiple files/systems
- Entry point routes here via /teddy debug
</when-to-use>

<context>
@context/session.md
</context>

<references>
@frameworks/teammate-orchestration.md (when spawning investigation teammates)
</references>

<steps>

<step name="check_active_session" priority="first">
Check for active debug sessions:

```bash
ls .teddy/debug/*.md 2>/dev/null | grep -v resolved
```

**If active sessions exist AND no arguments provided:**

Display inline:
```
## Active Debug Sessions

| # | Slug | Status | Hypothesis | Next Action |
|---|------|--------|------------|-------------|
| 1 | [slug] | [status] | [hypothesis] | [next action] |

Reply with a number to resume, or describe a new issue to start fresh.
```

Wait for user response.

**If no active sessions:**
```
No active debug sessions.

Describe the issue to start debugging.
```

Wait for user to describe the issue.
</step>

<step name="create_debug_file">
Generate slug from user input (lowercase, hyphens, max 30 chars).

```bash
mkdir -p .teddy/debug
```

Create `.teddy/debug/[slug].md` with:
- status: gathering
- trigger: verbatim user input
- Current Focus: next_action = "gather symptoms from user"

Proceed to symptom_gathering.
</step>

<step name="symptom_gathering">
Gather symptoms — update file after EACH answer:

1. **Expected behavior:** "What should happen?"
2. **Actual behavior:** "What actually happens instead?"
3. **Error messages:** "Any error messages?"
4. **When it started:** "When did this start?"
5. **Reproduction:** "How do you trigger this?"
6. **Ready check:** "Enough context to investigate?"

**Wait for all responses before proceeding.**
</step>

<step name="investigation_loop">
Autonomous investigation — update debug file continuously.

**For complex bugs, spawn investigation teammates:**

If multiple hypotheses can be tested independently:
```
Agent tool:
  subagent_type: "Explore"
  run_in_background: true
  description: "Investigate: [hypothesis]"
  prompt: "Test this hypothesis: [specific hypothesis]. Search for [specific patterns]. Report evidence for or against."
```

**Investigation cycle:**
1. Gather initial evidence
2. Form SPECIFIC, FALSIFIABLE hypothesis
3. Test hypothesis (directly or via teammate)
4. If CONFIRMED → proceed to fix
5. If ELIMINATED → append to Eliminated, form new hypothesis

Update debug file before every action and after every finding.
</step>

<step name="fix_and_verify">
1. Implement minimal fix addressing root cause
2. Verify against original symptoms
3. If verification PASSES: archive session
4. If verification FAILS: return to investigation

```bash
mkdir -p .teddy/debug/resolved
mv .teddy/debug/[slug].md .teddy/debug/resolved/
```

Report:
```
Debug complete.

Root cause: [root_cause]
Fix: [fix description]
Files: [files_changed]

Session archived: .teddy/debug/resolved/[slug].md
```
</step>

</steps>

<output>
- Debug file at `.teddy/debug/[slug].md` (active) or `.teddy/debug/resolved/[slug].md` (resolved)
- Root cause identified and documented
- Fix implemented and verified
</output>

<acceptance-criteria>
- [ ] Debug file created immediately on command
- [ ] File updated after each piece of information
- [ ] Current Focus always reflects current state
- [ ] Investigation teammates spawned for parallel hypothesis testing when appropriate
- [ ] Root cause confirmed with evidence before fixing
- [ ] Fix verified against original symptoms
- [ ] Session archived when resolved
</acceptance-criteria>
