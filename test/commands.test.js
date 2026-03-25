const fs = require("fs");
const path = require("path");

const COMMANDS_DIR = path.join(__dirname, "..", "src", "commands");

function getCommandFiles() {
  return fs.readdirSync(COMMANDS_DIR)
    .filter(f => f.endsWith(".md"))
    .map(f => ({ name: f, path: path.join(COMMANDS_DIR, f) }));
}

describe("Command files structural validation", () => {
  const commandFiles = getCommandFiles();

  it("src/commands/ contains at least 14 command files", () => {
    expect(commandFiles.length).toBeGreaterThanOrEqual(14);
  });

  describe.each(commandFiles)("$name", ({ name, path: filePath }) => {
    let content;

    beforeAll(() => {
      content = fs.readFileSync(filePath, "utf8");
    });

    it("has YAML frontmatter with --- delimiters", () => {
      expect(content).toMatch(/^---\n[\s\S]*?\n---/);
    });

    it("has a description field in frontmatter", () => {
      expect(content).toMatch(/description:\s*["']?.+["']?/);
    });

    if (name !== "teddy.md") {
      it("has a <purpose> section", () => {
        expect(content).toMatch(/<purpose>/);
        expect(content).toMatch(/<\/purpose>/);
      });

      it("has a <steps> section", () => {
        expect(content).toMatch(/<steps>/);
        expect(content).toMatch(/<\/steps>/);
      });
    }
  });
});

describe("teddy.md command registry", () => {
  const teddyMd = fs.readFileSync(
    path.join(COMMANDS_DIR, "teddy.md"),
    "utf8"
  );

  const commandFileNames = getCommandFiles()
    .map(f => f.name)
    .filter(f => f !== "teddy.md");

  it("commands table references every command file (except teddy.md itself)", () => {
    for (const fileName of commandFileNames) {
      const baseName = fileName.replace(".md", "");
      expect(teddyMd).toContain(`teddy:${baseName}`);
    }
  });

  it("routing section has a load-on-command entry for every command file", () => {
    for (const fileName of commandFileNames) {
      const baseName = fileName.replace(".md", "");
      expect(teddyMd).toContain(`/teddy:${baseName}`);
    }
  });
});
