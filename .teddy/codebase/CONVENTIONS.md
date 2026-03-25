# Coding Conventions

**Analysis Date:** 2026-03-24

## Naming Patterns

**Files:**
- kebab-case for commands and frameworks: `map-codebase.md`, `loop-phases.md`, `plan-review.md`
- UPPER_SNAKE_CASE for templates and output documents: `PROJECT.md`, `PLAN.md`, `SUMMARY.md`
- camelCase for JS scripts: `install.js`
- `.md` extension for all skill/framework/template files

**Functions:**
- camelCase for all functions: `resolveTarget`, `copyRecursive`, `countFiles`, `install`
- No special prefix for async functions

**Variables:**
- camelCase for variables: `flagHelp`, `flagGlobal`, `configDirIdx`, `customConfigDir`
- UPPER_SNAKE_CASE for constants: `PACKAGE_ROOT`, `SRC_COMMANDS`, `SRC_SUPPORT`, `COMMANDS_DIR_NAME`

**Types/Identifiers:**
- kebab-case for semantic role identifiers: `backend-dev`, `frontend-dev`, `test-eng`
- kebab-case for frontmatter keys and values: `phase: 01-name`, `type: execute`
- Uppercase for AC numbering: `AC-1`, `AC-2`, `AC-3`

## Code Style

**Formatting (JavaScript):**
- 2-space indentation
- `const` for all variable declarations (not `let` or `var`)
- CommonJS `require()` for imports (not ES6 imports)
- Shebang at top: `#!/usr/bin/env node`
- No Prettier or ESLint configuration (framework is primarily markdown)

**Formatting (Markdown):**
- Triple backticks with language specifier for code blocks
- YAML frontmatter between `---` delimiters
- XML-style tags for structured sections: `<purpose>`, `<steps>`, `<task>`, `<acceptance-criteria>`
- `#` hierarchy for headings (# main, ## sections, ### subsections)

## Import Organization

**Order (JavaScript — `bin/install.js`):**
1. Built-in Node.js modules (`fs`, `path`, `os`, `readline`)
2. Constants section immediately after
3. Utility functions
4. Main business logic

**Grouping:**
- Clear section comments: `// -- SectionName ------------------`

**Markdown References:**
- `@context/session.md` for runtime context
- `@frameworks/{name}.md` for methodology docs
- `@templates/{name}.md` for output templates
- `@checklists/{name}.md` for validation gates

## Error Handling

**Patterns:**
- `process.exit(1)` for CLI error termination
- `console.error()` for error messages
- Early validation before main operations (guard clauses)
- Conditional routing on error states (e.g., if `.teddy/` exists, redirect to `/teddy:resume`)

**Error Messages:**
- Descriptive context prefix: "Error: cannot use --global and --local together."
- Visual indicators: checkmarks for success, clear headers for errors

## Logging

**Framework:**
- `console.log()` for normal output
- `console.error()` for errors

**Patterns:**
- Visual headers/footers with box-drawing characters
- Indented output (2 spaces) for structure
- Progress indicators: `[count] [description] -> [path]`
- Interactive prompts via `readline.createInterface`

## Comments

**Section Headers (JavaScript):**
- Use `// -- SectionName ------------------` format with dashes
- Organize code into logical sections

**Inline Comments:**
- Minimal — code is self-documenting
- Used only where intent might be unclear

**Markdown Documentation:**
- Prose documentation in markdown, not code comments
- Acceptance criteria in Given/When/Then format

## Function Design

**Size:**
- Keep under 50 lines
- Functions in `install.js` range 5-30 lines

**Parameters:**
- Max 3 positional parameters
- Example: `function copyRecursive(src, dest, pathPrefix)`

**Return Values:**
- Explicit returns
- Guard clauses for early exit

## Module Design

**Exports:**
- `install.js` executes via side effects (CLI tool, not library)
- No module exports pattern — single executable file

**File Organization:**
- Constants -> Utilities -> Business logic -> CLI argument parsing -> Main orchestration
- One responsibility per command file (init, plan, apply, unify, etc.)

**Frontmatter Structure (YAML):**
- All command and template files include `---` delimited YAML frontmatter
- Required field: `description`
- Plan frontmatter: `phase`, `plan`, `type`, `wave`, `depends_on`, `files_modified`, `autonomous`, `team`

**Task Definition Format (XML in Markdown):**
- `<task type="auto" role="..." wave="...">` with child elements
- Task elements: `<name>`, `<files>`, `<action>`, `<verify>`, `<done>`
- Checkpoint tasks: `<task type="checkpoint:human-verify">`

---

*Convention analysis: 2026-03-24*
*Update when patterns change*
