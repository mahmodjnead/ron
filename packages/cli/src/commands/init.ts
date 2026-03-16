// packages/cli/src/commands/init.ts
import { Command } from "commander";
import prompts from "prompts";
import pc from "picocolors";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { detectProject } from "../detectors/detectProject";
import { adminConfigTemplate } from "../templates/adminConfig";
import { generateAdminFiles } from "../generators/generateAdminFiles";
import {
  indexHtmlTemplate,
  packageJsonTemplate,
  tsconfigTemplate,
  tsconfigAppTemplate,
  tsconfigNodeTemplate,
  viteConfigTemplate,
  indexCssTemplate,
  mainTsxTemplate,
  ronDtsTemplate,
  gitignoreTemplate,
} from "../templates/viteProject";
import {
  rootLayoutTemplate,
  dashboardPageTemplate,
  notFoundPageTemplate,
  sampleUsersPageTemplate,
} from "../templates/pages";

// ── Detect if folder is empty ─────────────────────────────
function isFolderEmpty(dir: string): boolean {
  if (!fs.existsSync(dir)) return true;
  const files = fs
    .readdirSync(dir)
    .filter((f) => !["node_modules", ".git", ".DS_Store"].includes(f));
  return files.length === 0;
}

// ── Get package manager install command ───────────────────
function getInstallCmd(pm: string): string {
  switch (pm) {
    case "pnpm":
      return "pnpm install";
    case "yarn":
      return "yarn";
    case "bun":
      return "bun install";
    default:
      return "npm install";
  }
}

function getRunCmd(pm: string, script: string): string {
  switch (pm) {
    case "pnpm":
      return `pnpm ${script}`;
    case "yarn":
      return `yarn ${script}`;
    case "bun":
      return `bun run ${script}`;
    default:
      return `npm run ${script}`;
  }
}

// ─────────────────────────────────────────────────────────
export const initCommand = new Command("init")
  .description("Initialize Ron — create a new project or add to existing")
  .option("--cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);
    const isEmpty = isFolderEmpty(cwd);

    console.log(
      pc.dim(
        isEmpty
          ? "Empty folder detected — creating new Ron project...\n"
          : "Existing project detected — adding Ron...\n",
      ),
    );

    // ── Shared prompts ───────────────────────────────────
    const shared = await prompts(
      [
        {
          type: "text",
          name: "projectName",
          message: "Project name?",
          initial: path.basename(cwd) || "my-admin",
        },
        {
          type: "text",
          name: "roles",
          message: "Define your roles (comma separated)",
          initial: "super_admin, admin, editor, viewer",
          validate: (v: string) =>
            v.trim().length > 0 || "At least one role is required",
        },
        {
          type: "select",
          name: "auth",
          message: "Auth provider?",
          choices: [
            { title: "Clerk", value: "clerk" },
            { title: "NextAuth", value: "next-auth" },
            { title: "Supabase", value: "supabase" },
            { title: "Custom / DIY", value: "custom" },
          ],
        },
      ],
      {
        onCancel: () => {
          console.log(pc.yellow("\nSetup cancelled."));
          process.exit(0);
        },
      },
    );

    const projectName = shared.projectName as string;
    const roles = (shared.roles as string)
      .split(",")
      .map((r: string) => r.trim())
      .filter(Boolean);
    const auth = shared.auth as string;

    // ── CREATE mode — new project ────────────────────────
    if (isEmpty) {
      const createAnswers = await prompts(
        [
          {
            type: "select",
            name: "pm",
            message: "Package manager?",
            choices: [
              { title: "npm", value: "npm" },
              { title: "pnpm", value: "pnpm" },
              { title: "yarn", value: "yarn" },
              { title: "bun", value: "bun" },
            ],
          },
          {
            type: "select",
            name: "template",
            message: "Template?",
            choices: [
              {
                title: "Minimal",
                value: "minimal",
                description: "Dashboard + layout only",
              },
              {
                title: "Full",
                value: "full",
                description: "Dashboard + Users + Settings sample pages",
              },
            ],
          },
          {
            type: "confirm",
            name: "git",
            message: "Initialize git repository?",
            initial: true,
          },
        ],
        {
          onCancel: () => {
            console.log(pc.yellow("\nSetup cancelled."));
            process.exit(0);
          },
        },
      );

      const pm = createAnswers.pm as string;
      const template = createAnswers.template as string;
      const git = createAnswers.git as boolean;

      console.log("");
      console.log(pc.dim("Scaffolding project..."));

      // ── Create folder structure ────────────────────────
      await fs.ensureDir(cwd);
      await fs.ensureDir(path.join(cwd, "src", "admin", "pages", "dashboard"));
      await fs.ensureDir(path.join(cwd, "src", "admin", "pages", "_403"));
      if (template === "full") {
        await fs.ensureDir(path.join(cwd, "src", "admin", "pages", "users"));
        await fs.ensureDir(path.join(cwd, "src", "admin", "pages", "settings"));
      }
      await fs.ensureDir(path.join(cwd, "src", "admin", "_generated"));
      await fs.ensureDir(path.join(cwd, "src", "admin", "hooks"));

      // ── Write project files ────────────────────────────
      await fs.writeFile(
        path.join(cwd, "index.html"),
        indexHtmlTemplate(projectName),
      );
      await fs.writeFile(
        path.join(cwd, "package.json"),
        packageJsonTemplate(projectName, pm),
      );
      await fs.writeFile(path.join(cwd, "tsconfig.json"), tsconfigTemplate());
      await fs.writeFile(
        path.join(cwd, "tsconfig.app.json"),
        tsconfigAppTemplate(),
      );
      await fs.writeFile(
        path.join(cwd, "tsconfig.node.json"),
        tsconfigNodeTemplate(),
      );
      await fs.writeFile(
        path.join(cwd, "vite.config.ts"),
        viteConfigTemplate(),
      );
      await fs.writeFile(path.join(cwd, ".gitignore"), gitignoreTemplate());
      await fs.writeFile(
        path.join(cwd, "src", "index.css"),
        indexCssTemplate(),
      );
      await fs.writeFile(
        path.join(cwd, "src", "main.tsx"),
        mainTsxTemplate(auth),
      );
      await fs.writeFile(path.join(cwd, "src", "ron.d.ts"), ronDtsTemplate());

      console.log(pc.green("✔") + " Project files created");

      // ── Write admin.config.ts ──────────────────────────
      await fs.writeFile(
        path.join(cwd, "admin.config.ts"),
        adminConfigTemplate({ projectName, auth: auth as any, roles }),
      );
      console.log(pc.green("✔") + " admin.config.ts created");

      // ── Write pages ────────────────────────────────────
      await fs.writeFile(
        path.join(cwd, "src", "admin", "pages", "_layout.tsx"),
        rootLayoutTemplate(projectName),
      );
      await fs.writeFile(
        path.join(cwd, "src", "admin", "pages", "dashboard", "index.tsx"),
        dashboardPageTemplate(projectName),
      );
      await fs.writeFile(
        path.join(cwd, "src", "admin", "pages", "_403", "index.tsx"),
        notFoundPageTemplate(),
      );

      if (template === "full") {
        await fs.writeFile(
          path.join(cwd, "src", "admin", "pages", "users", "index.tsx"),
          sampleUsersPageTemplate(),
        );
        await fs.writeFile(
          path.join(cwd, "src", "admin", "pages", "settings", "index.tsx"),
          `export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ color: "var(--ron-text)", fontSize: "1.5rem", fontWeight: 700 }}>
        Settings
      </h1>
      <p style={{ color: "var(--ron-text-secondary)", marginTop: "0.5rem" }}>
        Configure your application settings here.
      </p>
    </div>
  );
}
`,
        );
      }

      console.log(pc.green("✔") + " Pages scaffolded");

      // ── Write generated files ──────────────────────────
      await generateAdminFiles({
        cwd,
        srcDir: "src",
        roles,
        projectName,
      });
      console.log(pc.green("✔") + " Permission matrix generated");

      // ── Git init ───────────────────────────────────────
      if (git) {
        try {
          execSync("git init", { cwd, stdio: "pipe" });
          execSync("git add .", { cwd, stdio: "pipe" });
          execSync(`git commit -m "chore: init Ron project"`, {
            cwd,
            stdio: "pipe",
          });
          console.log(pc.green("✔") + " Git repository initialized");
        } catch {
          console.log(pc.yellow("⚠") + " Git init skipped");
        }
      }

      // ── Install dependencies ───────────────────────────
      console.log("");
      console.log(pc.dim(`Installing dependencies with ${pm}...`));

      try {
        execSync(getInstallCmd(pm), { cwd, stdio: "inherit" });
        console.log(pc.green("✔") + " Dependencies installed");
      } catch {
        console.log(
          pc.yellow("⚠ Could not install dependencies. Run manually:") +
            `\n  cd ${path.basename(cwd)} && ${getInstallCmd(pm)}`,
        );
      }

      // ── Done ───────────────────────────────────────────
      console.log(`
${pc.green("─────────────────────────────────────")}
  ${pc.bold("Ron project ready.")} 🎉

  ${pc.cyan("cd")} ${path.basename(cwd)}
  ${pc.cyan(getRunCmd(pm, "dev"))}

  ${pc.dim("Then visit")} ${pc.bold("http://localhost:5173/admin")}

  ${pc.dim("Next steps:")}
  ${pc.cyan("1.")} Open ${pc.bold("admin.config.ts")} and implement ${pc.bold("getCurrentUser")}
  ${pc.cyan("2.")} Add resources and permissions
  ${pc.cyan("3.")} Run ${pc.bold("ron sync")} after config changes
${pc.green("─────────────────────────────────────")}
`);

      // ── ADD mode — existing project ──────────────────────
    } else {
      const project = detectProject(cwd);

      if (!project.hasReact) {
        console.error(pc.red("✗ React not found."));
        process.exit(1);
      }
      if (!project.hasTypeScript) {
        console.error(pc.red("✗ TypeScript not found."));
        process.exit(1);
      }

      console.log(pc.green("✔") + " React + TypeScript detected");
      if (project.hasTailwind)
        console.log(pc.green("✔") + " Tailwind CSS detected");
      console.log("");

      // Install deps
      const deps = [
        "@ronjs/core",
        "@ronjs/ui",
        "@ronjs/router",
        "@tanstack/react-query",
        "react-hook-form",
        "zod",
        "lucide-react",
      ].join(" ");

      const pm = fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))
        ? "pnpm add"
        : fs.existsSync(path.join(cwd, "yarn.lock"))
          ? "yarn add"
          : fs.existsSync(path.join(cwd, "bun.lockb"))
            ? "bun add"
            : "npm install";

      console.log(pc.dim("Installing dependencies..."));
      try {
        execSync(`${pm} ${deps}`, { cwd, stdio: "pipe" });
        console.log(pc.green("✔") + " Dependencies installed");
      } catch {
        console.warn(
          pc.yellow("⚠ Could not auto-install. Run manually:") +
            `\n  ${pm} ${deps}`,
        );
      }

      // Scaffold admin.config.ts
      const configPath = path.join(cwd, "admin.config.ts");
      if (!fs.existsSync(configPath)) {
        await fs.writeFile(
          configPath,
          adminConfigTemplate({ projectName, auth: auth as any, roles }),
        );
        console.log(pc.green("✔") + " admin.config.ts created");
      }

      // Generate admin files
      console.log(pc.dim("Generating admin files..."));
      await generateAdminFiles({
        cwd,
        srcDir: project.srcDir,
        roles,
        projectName,
      });

      // Scaffold pages
      const pagesDir = path.join(cwd, project.srcDir, "admin", "pages");
      await fs.ensureDir(path.join(pagesDir, "dashboard"));
      await fs.writeFile(
        path.join(pagesDir, "_layout.tsx"),
        rootLayoutTemplate(projectName),
      );
      await fs.writeFile(
        path.join(pagesDir, "dashboard", "index.tsx"),
        dashboardPageTemplate(projectName),
      );
      await fs.writeFile(
        path.join(pagesDir, "_403", "index.tsx"),
        notFoundPageTemplate(),
      );

      // Patch index.css
      const cssFiles = [
        path.join(cwd, "src", "index.css"),
        path.join(cwd, "src", "app.css"),
        path.join(cwd, "index.css"),
      ].filter(fs.existsSync);

      if (cssFiles.length > 0) {
        const cssPath = cssFiles[0]!;
        const cssContent = await fs.readFile(cssPath, "utf-8");
        if (!cssContent.includes("@ronjs/ui")) {
          await fs.writeFile(
            cssPath,
            cssContent.trimEnd() + '\n@plugin "@ronjs/ui";\n',
          );
          console.log(pc.green("✔") + " @plugin added to index.css");
        }
      }

      // Patch vite.config.ts
      const viteConfigPath = path.join(cwd, "vite.config.ts");
      if (fs.existsSync(viteConfigPath)) {
        const viteContent = await fs.readFile(viteConfigPath, "utf-8");
        if (!viteContent.includes("@ronjs/router")) {
          console.log(
            pc.yellow("⚠ Please add ronRouter plugin to vite.config.ts:") +
              `\n  import { ronRouter } from "@ronjs/router/vite";` +
              `\n  plugins: [..., ronRouter({ pagesDir: "src/admin/pages", basePath: "/admin" })]`,
          );
        }
      }

      // Add ron.d.ts
      await fs.writeFile(path.join(cwd, "src", "ron.d.ts"), ronDtsTemplate());

      console.log(`
${pc.green("─────────────────────────────────────")}
  ${pc.bold("Ron is ready.")} 🎉

  ${pc.dim("Next steps:")}
  ${pc.cyan("1.")} Mount ${pc.bold("<RonRouter />")} in your main.tsx
  ${pc.cyan("2.")} Implement ${pc.bold("getCurrentUser")} in admin.config.ts
  ${pc.cyan("3.")} Run ${pc.bold("ron sync")} after config changes
  ${pc.cyan("4.")} Visit ${pc.bold("/admin")} to see your panel
${pc.green("─────────────────────────────────────")}
`);
    }
  });
