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

// ── CLI args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flagHelp = args.includes("--help") || args.includes("-h");
const flagGlobal = args.includes("--global") || args.includes("-g");
const flagLocal = args.includes("--local") || args.includes("-l");
const configDirIdx = Math.max(
  args.indexOf("--config-dir"),
  args.indexOf("-c")
);
const customConfigDir =
  configDirIdx !== -1 ? args[configDirIdx + 1] : process.env.CLAUDE_CONFIG_DIR;

// ── Help ───────────────────────────────────────────────────────────────────
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
    -h, --help                       Show this help message

  Environment:
    CLAUDE_CONFIG_DIR                Fallback for --config-dir
  `);
  process.exit(0);
}

// ── Install logic ──────────────────────────────────────────────────────────

function resolveTarget(isGlobal) {
  if (customConfigDir) return customConfigDir;
  return isGlobal
    ? path.join(os.homedir(), ".claude")
    : path.join(process.cwd(), ".claude");
}

function copyRecursive(src, dest, pathPrefix) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, pathPrefix);
    } else if (entry.isFile()) {
      let content = fs.readFileSync(srcPath, "utf8");

      // Rewrite internal path references if needed
      if (entry.name.endsWith(".md")) {
        content = content.replace(/~\/\.claude\//g, pathPrefix);
      }

      fs.writeFileSync(destPath, content, "utf8");
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

function install(isGlobal) {
  const target = resolveTarget(isGlobal);
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
  copyRecursive(SRC_COMMANDS, commandsDest, pathPrefix);
  const cmdCount = countFiles(commandsDest);
  console.log(`  ✓ ${cmdCount} commands → ${commandsDest}`);

  // 2. Copy support files → <target>/teddy-framework/
  let supportCount = 0;
  for (const dir of SRC_SUPPORT) {
    const src = path.join(PACKAGE_ROOT, "src", dir);
    if (fs.existsSync(src)) {
      const dest = path.join(frameworkDest, dir);
      copyRecursive(src, dest, pathPrefix);
      supportCount += countFiles(dest);
    }
  }
  console.log(`  ✓ ${supportCount} support files → ${frameworkDest}`);

  console.log(`\n  Usage: type /teddy in Claude Code to get started.\n`);
  console.log(`  Commands available:`);
  console.log(`    /teddy:init          Initialize a new project`);
  console.log(`    /teddy:explore       Explore before planning`);
  console.log(`    /teddy:plan          Create execution plans`);
  console.log(`    /teddy:apply         Execute plans via agent teams`);
  console.log(`    /teddy:unify         Reconcile results & merge`);
  console.log(`    /teddy:status        View team progress`);
  console.log(`    /teddy:resume        Resume a session`);
  console.log(`    /teddy:debug         Structured debugging`);
  console.log(`    /teddy:review        Code review`);
  console.log(`    /teddy:map-codebase  Document codebase\n`);
}

// ── Main ───────────────────────────────────────────────────────────────────

if (flagGlobal && flagLocal) {
  console.error("  Error: cannot use --global and --local together.");
  process.exit(1);
}

if (flagGlobal || flagLocal) {
  install(flagGlobal);
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
      install(true);
    } else if (trimmed === "2" || trimmed.toLowerCase() === "local") {
      install(false);
    } else {
      console.error("  Invalid choice. Run again with --global or --local.");
      process.exit(1);
    }
  });
}
