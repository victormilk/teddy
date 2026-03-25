#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// ── Constants ──────────────────────────────────────────────────────────────
const PACKAGE_ROOT = path.resolve(__dirname, "..");
const SRC_COMMANDS = path.join(PACKAGE_ROOT, "src", "commands");
const SRC_SUPPORT = ["frameworks", "templates", "checklists", "context"];
const COMMANDS_DIR_NAME = "teddy";
const FRAMEWORK_DIR_NAME = "teddy-framework";

// ── Install logic ──────────────────────────────────────────────────────────

function resolveTarget(isGlobal, customConfigDir) {
  if (customConfigDir) return customConfigDir;
  return isGlobal
    ? path.join(os.homedir(), ".claude")
    : path.join(process.cwd(), ".claude");
}

function copyRecursive(src, dest, pathPrefix, dryRun) {
  if (!fs.existsSync(dest)) {
    if (!dryRun) {
      fs.mkdirSync(dest, { recursive: true });
    }
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, pathPrefix, dryRun);
    } else if (entry.isFile()) {
      let content = fs.readFileSync(srcPath, "utf8");

      // Rewrite internal path references if needed
      if (entry.name.endsWith(".md")) {
        content = content.replace(/~\/\.claude\//g, pathPrefix);
      }

      if (!dryRun) {
        fs.writeFileSync(destPath, content, "utf8");
      }
    }
  }
}

function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

function install(isGlobal, customConfigDir, dryRun) {
  const target = resolveTarget(isGlobal, customConfigDir);
  const commandsDest = path.join(target, "commands", COMMANDS_DIR_NAME);
  const frameworkDest = path.join(target, FRAMEWORK_DIR_NAME);
  const label = isGlobal ? "global" : "local";

  // Determine the path prefix for internal references
  const pathPrefix = customConfigDir
    ? customConfigDir.replace(/\/?$/, "/")
    : isGlobal
      ? "~/.claude/"
      : "./.claude/";

  console.log(`\n  Installing Teddy (${label})\n`);

  // 1. Copy slash commands → <target>/commands/teddy/
  copyRecursive(SRC_COMMANDS, commandsDest, pathPrefix, dryRun);
  const cmdCount = dryRun ? countFiles(SRC_COMMANDS) : countFiles(commandsDest);
  console.log(`  ✓ ${cmdCount} commands → ${commandsDest}`);

  // 2. Copy support files → <target>/teddy-framework/
  let supportCount = 0;
  for (const dir of SRC_SUPPORT) {
    const src = path.join(PACKAGE_ROOT, "src", dir);
    if (fs.existsSync(src)) {
      const dest = path.join(frameworkDest, dir);
      copyRecursive(src, dest, pathPrefix, dryRun);
      supportCount += dryRun ? countFiles(src) : countFiles(dest);
    }
  }
  console.log(`  ✓ ${supportCount} support files → ${frameworkDest}`);

  // 3. Validate @references (skip in dry-run mode)
  if (!dryRun) {
    const refs = validateReferences(target);
    if (refs.unresolved.length > 0) {
      console.log(`  ⚠ ${refs.unresolved.length} @references could not be resolved:`);
      refs.unresolved.forEach(r => console.log(`    - ${r}`));
    } else if (refs.total > 0) {
      console.log(`  ✓ ${refs.total} @references validated`);
    }
  }

  console.log(`\n  Usage: type /teddy in Claude Code to get started.\n`);
  console.log(`  Commands available:`);
  console.log(`    /teddy:init          Initialize a new project`);
  console.log(`    /teddy:explore       Explore before planning`);
  console.log(`    /teddy:plan          Create execution plans`);
  console.log(`    /teddy:apply         Execute plans via agent teams`);
  console.log(`    /teddy:amend-plan    Modify a plan mid-execution`);
  console.log(`    /teddy:unify         Reconcile results & merge`);
  console.log(`    /teddy:rollback      Revert a completed unify`);
  console.log(`    /teddy:status        View team progress`);
  console.log(`    /teddy:resume        Resume a session`);
  console.log(`    /teddy:cleanup       Clean orphaned teams & worktrees`);
  console.log(`    /teddy:debug         Structured debugging`);
  console.log(`    /teddy:review        Code review`);
  console.log(`    /teddy:map-codebase  Document codebase`);
  console.log(`    /teddy:flows         Manage skill flows\n`);

  if (dryRun) {
    console.log("\n  [DRY RUN] No files were written.\n");
  }
}

function validateConfigDir(dirPath) {
  if (!dirPath || !dirPath.trim()) {
    throw new Error("Config directory path cannot be empty");
  }
  if (dirPath.includes("..")) {
    throw new Error(
      `Invalid config directory: path traversal detected in "${dirPath}"`
    );
  }
  const resolved = path.resolve(dirPath);
  const home = os.homedir();
  const cwd = process.cwd();
  if (!resolved.startsWith(home) && !resolved.startsWith(cwd)) {
    throw new Error(
      `Invalid config directory: "${resolved}" must be within home (${home}) or project (${cwd})`
    );
  }
  return resolved;
}

function validateReferences(destDir) {
  const result = { total: 0, unresolved: [] };

  function findMdFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMdFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const mdFiles = findMdFiles(destDir);
  const refRegex = /@([a-zA-Z0-9_./-]+\.md)/g;

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = refRegex.exec(content)) !== null) {
      result.total++;
      const refPath = match[1];
      const resolved = path.join(destDir, refPath);
      if (!fs.existsSync(resolved)) {
        result.unresolved.push(refPath);
      }
    }
  }

  return result;
}

// ── Main ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const flagHelp = args.includes("--help") || args.includes("-h");
  const flagGlobal = args.includes("--global") || args.includes("-g");
  const flagLocal = args.includes("--local") || args.includes("-l");
  const flagDryRun = args.includes("--dry-run") || args.includes("-n");
  const configDirIdx = Math.max(
    args.indexOf("--config-dir"),
    args.indexOf("-c")
  );
  const customConfigDir =
    configDirIdx !== -1 ? args[configDirIdx + 1] : process.env.CLAUDE_CONFIG_DIR;

  if (customConfigDir) {
    try {
      validateConfigDir(customConfigDir);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      process.exit(1);
    }
  }

  if (flagHelp) {
    console.log(`
  teddy-framework — install Teddy slash commands for Claude Code

  Usage:
    npx teddy-framework              Interactive (prompts for location)
    npx teddy-framework --global     Install to ~/.claude/
    npx teddy-framework --local      Install to ./.claude/ (project-scoped)

  Options:
    -g, --global                     Install globally (~/.claude/)
    -l, --local                      Install locally (./.claude/)
    -c, --config-dir <path>          Custom Claude config directory
    -n, --dry-run                    Preview install without writing files
    -h, --help                       Show this help message

  Environment:
    CLAUDE_CONFIG_DIR                Fallback for --config-dir
  `);
    process.exit(0);
  }

  if (flagGlobal && flagLocal) {
    console.error("  Error: cannot use --global and --local together.");
    process.exit(1);
  }

  if (flagGlobal || flagLocal) {
    install(flagGlobal, customConfigDir, flagDryRun);
  } else {
    // Interactive prompt
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n  Teddy Framework Installer\n");
    console.log("  Where would you like to install?");
    console.log("    1) Global  (~/.claude/)  — available in all projects");
    console.log("    2) Local   (./.claude/)  — scoped to this project\n");

    rl.question("  Choice [1/2]: ", (answer) => {
      rl.close();
      const trimmed = answer.trim();

      if (trimmed === "1" || trimmed.toLowerCase() === "global") {
        install(true, customConfigDir, flagDryRun);
      } else if (trimmed === "2" || trimmed.toLowerCase() === "local") {
        install(false, customConfigDir, flagDryRun);
      } else {
        console.error("  Invalid choice. Run again with --global or --local.");
        process.exit(1);
      }
    });
  }
}

module.exports = { resolveTarget, copyRecursive, countFiles, install, validateConfigDir, validateReferences };
