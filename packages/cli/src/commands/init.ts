// src/commands/init.ts
import { Command } from "commander";
import prompts from "prompts";
import pc from "picocolors";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { detectProject } from "../detectors/detectProject";
import { adminConfigTemplate } from "../templates/adminConfig";
import { generateAdminFiles } from "../generators/generateAdminFiles";

export const initCommand = new Command("init")
  .description("Initialize Ron in your React project")
  .option("--cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);

    console.log(pc.dim("Scanning your project...\n"));

    // ── Step 1: Detect environment ───────────────────────────
    const project = detectProject(cwd);

    // Validation
    if (!project.hasReact) {
      console.error(pc.red("✗ React not found. Ron requires a React project."));
      process.exit(1);
    }
    if (!project.hasTypeScript) {
      console.error(pc.red("✗ TypeScript not found. Ron requires TypeScript."));
      process.exit(1);
    }
    if (!project.hasTailwind) {
      console.warn(
        pc.yellow("⚠ Tailwind CSS not detected. Ron works best with Tailwind."),
      );
    }

    // Show what was detected
    console.log(pc.green("✔") + " React + TypeScript detected");
    if (project.hasTailwind)
      console.log(pc.green("✔") + " Tailwind CSS detected");
    if (project.router !== "unknown")
      console.log(pc.green("✔") + ` Router detected: ${project.router}`);
    if (project.auth !== "custom")
      console.log(pc.green("✔") + ` Auth detected: ${project.auth}`);

    console.log("");

    // ── Step 2: Prompts ──────────────────────────────────────
    const answers = await prompts(
      [
        {
          type: "text",
          name: "projectName",
          message: "What is your admin panel name?",
          initial: "My Admin",
        },
        {
          type: "text",
          name: "roles",
          message: "Define your roles (comma separated)",
          initial: "super_admin, admin, editor, viewer",
          validate: (v: string) =>
            v.trim().length > 0 || "At least one role is required",
        },
        ...(project.router === "unknown"
          ? [
              {
                type: "select" as const,
                name: "router",
                message: "Which router are you using?",
                choices: [
                  { title: "React Router v6", value: "react-router" },
                  { title: "TanStack Router", value: "tanstack-router" },
                ],
              },
            ]
          : []),
        ...(project.auth === "custom"
          ? [
              {
                type: "select" as const,
                name: "auth",
                message: "Which auth provider are you using?",
                choices: [
                  { title: "Clerk", value: "clerk" },
                  { title: "NextAuth", value: "next-auth" },
                  { title: "Supabase", value: "supabase" },
                  { title: "Custom / DIY", value: "custom" },
                ],
              },
            ]
          : []),
      ],
      {
        onCancel: () => {
          console.log(pc.yellow("\nSetup cancelled."));
          process.exit(0);
        },
      },
    );

    const projectName = answers.projectName as string;
    const roles = (answers.roles as string)
      .split(",")
      .map((r: string) => r.trim())
      .filter(Boolean);
    const router = (answers.router ?? project.router) as string;
    const auth = (answers.auth ?? project.auth) as string;

    console.log("");

    // ── Step 3: Install dependencies ────────────────────────
    console.log(pc.dim("Installing dependencies..."));

    const deps = [
      "@ron/core",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
      "lucide-react",
    ].join(" ");

    try {
      // Detect package manager
      const pm = fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))
        ? "pnpm add"
        : fs.existsSync(path.join(cwd, "yarn.lock"))
          ? "yarn add"
          : fs.existsSync(path.join(cwd, "bun.lockb"))
            ? "bun add"
            : "npm install";

      execSync(`${pm} ${deps}`, { cwd, stdio: "pipe" });
      console.log(pc.green("✔") + " Dependencies installed");
    } catch {
      console.warn(
        pc.yellow("⚠ Could not auto-install dependencies. Run manually:") +
          `\n  npm install ${deps}`,
      );
    }

    console.log("");

    // ── Step: Patch index.css ─────────────────────────────
    const cssFiles = [
      path.join(cwd, "src", "index.css"),
      path.join(cwd, "src", "app.css"),
      path.join(cwd, "index.css"),
    ].filter(fs.existsSync);

    if (cssFiles.length > 0) {
      const cssPath = cssFiles[0]!;
      const cssContent = await fs.readFile(cssPath, "utf-8");

      if (!cssContent.includes("@ron/ui")) {
        const updated = cssContent.trimEnd() + '\n@plugin "@ron/ui";\n';
        await fs.writeFile(cssPath, updated);
        console.log(
          pc.green("✔") + " @plugin added to " + path.relative(cwd, cssPath),
        );
      }
    }

    // ── Step 4: Scaffold admin.config.ts ────────────────────
    const configPath = path.join(cwd, "admin.config.ts");

    if (fs.existsSync(configPath)) {
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: "admin.config.ts already exists. Overwrite?",
        initial: false,
      });
      if (!overwrite) {
        console.log(pc.dim("Skipping admin.config.ts"));
      } else {
        await fs.writeFile(
          configPath,
          adminConfigTemplate({ projectName, auth: auth as any, roles }),
        );
        console.log(pc.green("✔") + " admin.config.ts created");
      }
    } else {
      await fs.writeFile(
        configPath,
        adminConfigTemplate({ projectName, auth: auth as any, roles }),
      );
      console.log(pc.green("✔") + " admin.config.ts created");
    }

    // ── Step 5: Generate /src/admin/** ───────────────────────
    console.log(pc.dim("Generating admin files..."));

    await generateAdminFiles({
      cwd,
      srcDir: project.srcDir,
      roles,
      projectName,
    });

    console.log(pc.green("✔") + " src/admin/_generated/");
    console.log(pc.green("✔") + " src/admin/hooks/");
    console.log(pc.green("✔") + " src/admin/components/guards/");
    console.log(pc.green("✔") + " src/admin/pages/");
    console.log(pc.green("✔") + " src/admin/index.tsx");

    // ── Done ─────────────────────────────────────────────────
    console.log(`
${pc.green("─────────────────────────────────────")}
  ${pc.bold("Ron is ready.")} 🎉

  ${pc.dim("Next steps:")}
  ${pc.cyan("1.")} Open ${pc.bold("admin.config.ts")} and implement ${pc.bold("getCurrentUser")}
  ${pc.cyan("2.")} Add resources to start generating permissions
  ${pc.cyan("3.")} Mount ${pc.bold("<AdminRouter />")} in your App.tsx
  ${pc.cyan("4.")} Run ${pc.bold("ron sync")} after any config changes

  ${pc.dim("Docs:")} https://ron.dev
${pc.green("─────────────────────────────────────")}
`);
  });
