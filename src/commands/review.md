<purpose>
Structured code review of recent changes, a specific branch, or teammate output. Checks code quality, adherence to conventions, test coverage, and potential issues.
</purpose>

<user-story>
As a developer, I want structured code reviews that check quality and conventions systematically, so that issues are caught before merging.
</user-story>

<when-to-use>
- After teammates complete work (before UNIFY merge)
- Reviewing a specific branch or PR
- Checking code quality after a series of changes
- Entry point routes here via /teddy review
</when-to-use>

<context>
@context/session.md
</context>

<references>
@frameworks/quality-principles.md (for quality standards)
</references>

<steps>

<step name="determine_scope" priority="first">
Ask the user:
```
What should I review?

1. Recent teammate output (from last APPLY)
2. Specific branch or diff
3. Specific files or directory
```

**Wait for response.**

Based on response, determine review scope:
- Teammate output → read PLAN.md and teammate results
- Branch → run git diff against base branch
- Files → read specified files
</step>

<step name="execute_review">
**For each file/change in scope:**

1. **Correctness** — Does the code do what it should?
   - Logic errors
   - Edge cases not handled
   - Off-by-one errors

2. **Conventions** — Does it follow project patterns?
   - Naming conventions
   - File organization
   - Import patterns

3. **Security** — Any vulnerabilities?
   - Input validation
   - SQL injection
   - XSS potential
   - Hardcoded secrets

4. **Quality** — Is the code maintainable?
   - Complexity (overly nested, long functions)
   - DRY violations
   - Clear naming

5. **Tests** — Are changes covered?
   - New code has tests
   - Tests are meaningful (not just coverage)
   - Edge cases tested

**For large reviews, spawn review teammates:**

Each teammate reviews a subset of files:
```
Agent tool:
  subagent_type: "general-purpose"
  description: "Review: [file-group]"
  prompt: "Review these files for correctness, conventions, security, and quality: [files]. Report issues found with severity (critical/warning/info)."
```
</step>

<step name="present_findings">
Present review results:

```
════════════════════════════════════════
CODE REVIEW COMPLETE
════════════════════════════════════════

Scope: [what was reviewed]
Files: [N] reviewed

## Critical Issues
[Issues that must be fixed before merge]

## Warnings
[Issues that should be addressed]

## Suggestions
[Optional improvements]

## Summary
- Critical: [N]
- Warnings: [N]
- Suggestions: [N]
- Clean files: [N]

Verdict: [APPROVE / REQUEST CHANGES / BLOCK]
════════════════════════════════════════
```

**Wait for user response.**
</step>

</steps>

<output>
Code review report with categorized findings (critical, warnings, suggestions) and verdict.
</output>

<acceptance-criteria>
- [ ] Review scope determined and confirmed
- [ ] All files in scope reviewed for correctness, conventions, security, quality
- [ ] Issues categorized by severity (critical/warning/info)
- [ ] Clear verdict provided (approve/request changes/block)
- [ ] User informed of findings
</acceptance-criteria>
