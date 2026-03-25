# Testing Patterns

**Analysis Date:** 2026-03-24

## Test Framework

**Runner:**
- No test framework currently configured

**Status:**
Teddy is a framework/toolkit for orchestrating AI agents, consisting primarily of Markdown templates (98%) and one Node.js CLI script (`bin/install.js`). No automated tests exist.

**Run Commands:**
```bash
# No test commands configured in package.json
```

## Test File Organization

**Location:**
- No test files exist in the codebase

**If tests were to be added:**
- Collocated pattern: `*.test.js` alongside source
- Example: `bin/install.test.js` for `bin/install.js`

## Test Structure

No tests present. Recommended pattern if adopted:

```javascript
describe('install', () => {
  describe('resolveTarget', () => {
    it('should resolve global path correctly', () => {
      // arrange
      // act
      // assert
    });

    it('should resolve local path correctly', () => {
      // arrange
      // act
      // assert
    });
  });
});
```

## Mocking

No mocks present. If tests were added, recommended targets:

**What to Mock:**
- `fs` module — file system operations in `install.js`
- `readline` — interactive CLI prompts
- `process.exit` — CLI termination

**What NOT to Mock:**
- `path` module — pure utility, no side effects

## Fixtures and Factories

No fixtures or factories present.

## Coverage

**Requirements:**
- No coverage requirements configured
- No CI enforcement

## Test Types

**Testable Surface:**
- `bin/install.js` functions: `resolveTarget`, `copyRecursive`, `countFiles`, `install`
- CLI argument parsing logic
- Path resolution for different platforms
- File copying with content rewriting

**Validation (non-automated):**
- Framework validated through manual testing and dogfooding
- `.teddy/phases/01-skill-metadata/` demonstrates successful end-to-end execution
- Quality assured via checklists: `src/checklists/plan-review.md`, `src/checklists/unify-gate.md`

## Common Patterns

**Current validation approach:**
- Pre-APPLY: `src/checklists/plan-review.md` validates plan structure
- Pre-UNIFY: `src/checklists/unify-gate.md` validates merge quality
- Both are human-executed checklists, not automated tests

---

*Testing analysis: 2026-03-24*
*Update when test patterns change*
