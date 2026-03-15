// src/commands/sync.ts
import { Command } from "commander";
import pc from "picocolors";
import path from "path";
import fs from "fs-extra";
import { resolvePermissions, validateConfig } from "@ron/core";
import {
  permissionMatrixTemplate,
  routeManifestTemplate,
} from "../templates/generatedFiles";

async function loadConfig(configPath: string): Promise<any> {
  const { execSync } = await import("child_process");
  const { pathToFileURL } = await import("url");

  const loaderPath = configPath.replace("admin.config.ts", ".ron-loader.ts");

  // Convert Windows path to file:// URL for ESM compatibility
  const configFileUrl = pathToFileURL(configPath).href;

  const loaderScript = `
import config from "${configFileUrl}";
const c = config.default ?? config;
process.stdout.write(JSON.stringify(c));
`;

  await fs.writeFile(loaderPath, loaderScript);

  try {
    const tsxBin = path.join(
      path.dirname(require.resolve("tsx/package.json")),
      "dist",
      "cli.mjs",
    );

    const output = execSync(`node "${tsxBin}" "${loaderPath}"`, {
      env: { ...process.env, NODE_NO_WARNINGS: "1" },
    }).toString();

    return JSON.parse(output);
  } finally {
    await fs.remove(loaderPath);
  }
}

export const syncCommand = new Command("sync")
  .description("Sync admin.config.ts → regenerate _generated/ files")
  .option("--cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);

    console.log(pc.dim("Reading admin.config.ts...\n"));

    // ── Step 1: Find admin.config.ts ─────────────────────────
    const configPath = path.join(cwd, "admin.config.ts");

    if (!fs.existsSync(configPath)) {
      console.error(
        pc.red("✗ admin.config.ts not found.") + pc.dim(" Run ron init first."),
      );
      process.exit(1);
    }

    // ── Step 2: Load the config ──────────────────────────────
    let config: any;

    try {
      config = await loadConfig(configPath);
    } catch (err) {
      console.error(pc.red("✗ Failed to load admin.config.ts"));
      console.error(pc.dim(String(err)));
      process.exit(1);
    }

    // ── Step 3: Validate ─────────────────────────────────────
    const validation = validateConfig(config);

    if (!validation.valid) {
      console.error(pc.red("✗ Invalid admin.config.ts:\n"));
      validation.errors.forEach((e) => console.error(pc.red("  • ") + e));
      process.exit(1);
    }

    console.log(pc.green("✔") + " Config is valid");

    // ── Step 4: Resolve permissions ──────────────────────────
    const matrix = resolvePermissions(config);
    const roles = config.roles as string[];

    console.log(pc.green("✔") + " Permission matrix resolved");
    console.log("");

    // Print matrix summary
    for (const [role, perms] of Object.entries(matrix)) {
      const permList =
        (perms as string[]).length > 0
          ? (perms as string[]).join(", ")
          : pc.dim("no permissions");
      console.log(`  ${pc.cyan(role.padEnd(16))} ${permList}`);
    }
    console.log("");

    // ── Step 5: Find _generated/ dir ────────────────────────
    const srcDir = fs.existsSync(path.join(cwd, "src")) ? "src" : ".";
    const generatedDir = path.join(cwd, srcDir, "admin", "_generated");

    if (!fs.existsSync(generatedDir)) {
      console.error(
        pc.red("✗ src/admin/_generated/ not found.") +
          pc.dim(" Run ron init first."),
      );
      process.exit(1);
    }

    // ── Step 6: Write generated files ───────────────────────
    await fs.writeFile(
      path.join(generatedDir, "permission-matrix.ts"),
      permissionMatrixTemplate(matrix),
    );

    await fs.writeFile(
      path.join(generatedDir, "route-manifest.ts"),
      routeManifestTemplate(roles),
    );

    console.log(pc.green("✔") + " _generated/permission-matrix.ts updated");
    console.log(pc.green("✔") + " _generated/route-manifest.ts updated");
    console.log("");
    console.log(pc.green("─────────────────────────────────────"));
    console.log(`  ${pc.bold("Sync complete.")} ✨`);
    console.log(pc.green("─────────────────────────────────────"));
  });
