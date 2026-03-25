const os = require("os");
const fs = require("fs");
const path = require("path");
const {
  resolveTarget,
  copyRecursive,
  countFiles,
  validateConfigDir,
  validateReferences,
} = require("../bin/install.js");

// ── resolveTarget ─────────────────────────────────────────────────────────

describe("resolveTarget", () => {
  it("when isGlobal=true and no customConfigDir, returns path containing .claude under homedir", () => {
    const result = resolveTarget(true, null);
    expect(result).toContain(".claude");
    expect(result.startsWith(os.homedir())).toBe(true);
  });

  it("when isGlobal=false and no customConfigDir, returns path containing .claude under cwd", () => {
    const result = resolveTarget(false, null);
    expect(result).toContain(".claude");
    expect(result.startsWith(process.cwd())).toBe(true);
  });

  it("when customConfigDir is provided, returns that path directly regardless of isGlobal", () => {
    const custom = "/my/custom/path";
    expect(resolveTarget(true, custom)).toBe(custom);
    expect(resolveTarget(false, custom)).toBe(custom);
  });

  it("all returned paths are strings", () => {
    expect(typeof resolveTarget(true, null)).toBe("string");
    expect(typeof resolveTarget(false, null)).toBe("string");
    expect(typeof resolveTarget(true, "/custom")).toBe("string");
  });
});

// ── validateConfigDir ─────────────────────────────────────────────────────

describe("validateConfigDir", () => {
  it("accepts an absolute path within os.homedir() and returns the resolved path", () => {
    const validPath = path.join(os.homedir(), "test-teddy-validate");
    const result = validateConfigDir(validPath);
    expect(result).toBe(path.resolve(validPath));
  });

  it("accepts an absolute path within process.cwd() and returns the resolved path", () => {
    const validPath = path.join(process.cwd(), "test-teddy-validate");
    const result = validateConfigDir(validPath);
    expect(result).toBe(path.resolve(validPath));
  });

  it("throws on empty string input with message about empty", () => {
    expect(() => validateConfigDir("")).toThrow(/empty/i);
  });

  it("throws on whitespace-only input", () => {
    expect(() => validateConfigDir("   ")).toThrow(/empty/i);
  });

  it("throws on path containing '..' with message about traversal", () => {
    expect(() => validateConfigDir("/some/../sneaky/path")).toThrow(
      /traversal/i
    );
  });

  it("throws on path outside both home and cwd", () => {
    // Construct a path that is guaranteed to be outside both homedir and cwd
    const home = os.homedir();
    const cwd = process.cwd();
    // Use a path that cannot be a prefix of either home or cwd
    let outsidePath = "/tmp/outside-teddy-test-dir";
    // If /tmp happens to be within home or cwd (unlikely but possible), adjust
    if (outsidePath.startsWith(home) || outsidePath.startsWith(cwd)) {
      outsidePath = "/var/outside-teddy-test-dir";
    }
    expect(() => validateConfigDir(outsidePath)).toThrow();
  });
});

// ── copyRecursive ─────────────────────────────────────────────────────────

describe("copyRecursive", () => {
  let srcDir;
  let destDir;

  beforeEach(() => {
    srcDir = fs.mkdtempSync(path.join(os.tmpdir(), "teddy-test-src-"));
    destDir = fs.mkdtempSync(path.join(os.tmpdir(), "teddy-test-dest-"));
  });

  afterEach(() => {
    fs.rmSync(srcDir, { recursive: true, force: true });
    fs.rmSync(destDir, { recursive: true, force: true });
  });

  it("copies a plain text file from src to dest without modification", () => {
    const content = "Hello, world!";
    fs.writeFileSync(path.join(srcDir, "file.txt"), content, "utf8");

    copyRecursive(srcDir, destDir, "PREFIX/");

    const result = fs.readFileSync(path.join(destDir, "file.txt"), "utf8");
    expect(result).toBe(content);
  });

  it("copies a .md file and replaces ~/.claude/ with the provided pathPrefix", () => {
    const content = "See ~/.claude/commands for details and ~/.claude/other too.";
    fs.writeFileSync(path.join(srcDir, "readme.md"), content, "utf8");

    copyRecursive(srcDir, destDir, "/custom/path/");

    const result = fs.readFileSync(path.join(destDir, "readme.md"), "utf8");
    expect(result).toBe(
      "See /custom/path/commands for details and /custom/path/other too."
    );
  });

  it("copies a .md file: non ~/.claude/ content is preserved unchanged", () => {
    const content = "# Title\n\nSome regular markdown content.\n\nNo paths here.";
    fs.writeFileSync(path.join(srcDir, "notes.md"), content, "utf8");

    copyRecursive(srcDir, destDir, "/prefix/");

    const result = fs.readFileSync(path.join(destDir, "notes.md"), "utf8");
    expect(result).toBe(content);
  });

  it("handles nested directory structures (creates subdirs)", () => {
    const nestedDir = path.join(srcDir, "sub", "deep");
    fs.mkdirSync(nestedDir, { recursive: true });
    fs.writeFileSync(path.join(nestedDir, "file.txt"), "nested content", "utf8");

    copyRecursive(srcDir, destDir, "PREFIX/");

    const result = fs.readFileSync(
      path.join(destDir, "sub", "deep", "file.txt"),
      "utf8"
    );
    expect(result).toBe("nested content");
  });

  it("in dryRun mode: source is read but dest files are NOT created", () => {
    fs.writeFileSync(path.join(srcDir, "file.txt"), "data", "utf8");

    // Use a new dest that doesn't exist yet
    const dryDest = path.join(destDir, "dry-output");
    copyRecursive(srcDir, dryDest, "PREFIX/", true);

    expect(fs.existsSync(dryDest)).toBe(false);
  });

  it("non-.md files are copied without any content replacement", () => {
    const content = "path is ~/.claude/ here";
    fs.writeFileSync(path.join(srcDir, "config.txt"), content, "utf8");

    copyRecursive(srcDir, destDir, "/replaced/");

    const result = fs.readFileSync(path.join(destDir, "config.txt"), "utf8");
    expect(result).toBe(content);
  });
});

// ── countFiles ────────────────────────────────────────────────────────────

describe("countFiles", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "teddy-test-count-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns 0 for nonexistent directory", () => {
    expect(countFiles("/nonexistent/dir/that/does/not/exist")).toBe(0);
  });

  it("returns 0 for empty directory", () => {
    expect(countFiles(tmpDir)).toBe(0);
  });

  it("returns correct count for flat directory with N files", () => {
    fs.writeFileSync(path.join(tmpDir, "a.txt"), "a");
    fs.writeFileSync(path.join(tmpDir, "b.txt"), "b");
    fs.writeFileSync(path.join(tmpDir, "c.txt"), "c");

    expect(countFiles(tmpDir)).toBe(3);
  });

  it("returns correct count for nested directory structure (counts ALL files recursively)", () => {
    fs.writeFileSync(path.join(tmpDir, "root.txt"), "root");

    const sub = path.join(tmpDir, "sub");
    fs.mkdirSync(sub);
    fs.writeFileSync(path.join(sub, "sub1.txt"), "sub1");
    fs.writeFileSync(path.join(sub, "sub2.txt"), "sub2");

    const deep = path.join(sub, "deep");
    fs.mkdirSync(deep);
    fs.writeFileSync(path.join(deep, "deep1.txt"), "deep1");

    expect(countFiles(tmpDir)).toBe(4);
  });

  it("does not count directories themselves, only files", () => {
    const sub = path.join(tmpDir, "subdir");
    fs.mkdirSync(sub);
    // Only a directory, no files
    expect(countFiles(tmpDir)).toBe(0);

    // Now add one file inside the subdir
    fs.writeFileSync(path.join(sub, "only-file.txt"), "data");
    expect(countFiles(tmpDir)).toBe(1);
  });
});

// ── install command listing ──────────────────────────────────────────────

describe("install command listing", () => {
  it("install.js source lists all command files from src/commands/", () => {
    const installSrc = fs.readFileSync(
      path.join(__dirname, "..", "bin", "install.js"),
      "utf8"
    );

    const expectedCommands = [
      "teddy:init",
      "teddy:explore",
      "teddy:plan",
      "teddy:apply",
      "teddy:unify",
      "teddy:status",
      "teddy:resume",
      "teddy:cleanup",
      "teddy:debug",
      "teddy:review",
      "teddy:map-codebase",
    ];

    for (const cmd of expectedCommands) {
      expect(installSrc).toContain(cmd);
    }
  });
});

// ── validateReferences ───────────────────────────────────────────────────

describe("validateReferences", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "teddy-test-refs-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns zero unresolved for a file with no @references", () => {
    fs.writeFileSync(path.join(tmpDir, "clean.md"), "# No refs here\n");
    const result = validateReferences(tmpDir);
    expect(result.total).toBe(0);
    expect(result.unresolved).toEqual([]);
  });

  it("detects unresolved @references in .md files", () => {
    fs.writeFileSync(
      path.join(tmpDir, "test.md"),
      "See @frameworks/nonexistent.md for details\n"
    );
    const result = validateReferences(tmpDir);
    expect(result.total).toBe(1);
    expect(result.unresolved).toContain("frameworks/nonexistent.md");
  });

  it("resolves valid @references that exist on disk", () => {
    const fwDir = path.join(tmpDir, "frameworks");
    fs.mkdirSync(fwDir);
    fs.writeFileSync(path.join(fwDir, "real.md"), "# Real\n");
    fs.writeFileSync(
      path.join(tmpDir, "test.md"),
      "See @frameworks/real.md\n"
    );
    const result = validateReferences(tmpDir);
    expect(result.total).toBe(1);
    expect(result.unresolved).toEqual([]);
  });

  it("handles nested directories when scanning for .md files", () => {
    const nestedDir = path.join(tmpDir, "sub", "deep");
    fs.mkdirSync(nestedDir, { recursive: true });
    fs.writeFileSync(
      path.join(nestedDir, "nested.md"),
      "See @missing/file.md\n"
    );
    const result = validateReferences(tmpDir);
    expect(result.total).toBe(1);
    expect(result.unresolved).toContain("missing/file.md");
  });

  it("returns zero for empty directory", () => {
    const result = validateReferences(tmpDir);
    expect(result.total).toBe(0);
    expect(result.unresolved).toEqual([]);
  });
});
