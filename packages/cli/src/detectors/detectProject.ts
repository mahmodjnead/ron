// src/detectors/detectProject.ts
import fs from "fs-extra";
import path from "path";

export type RouterType = "react-router" | "tanstack-router" | "unknown";
export type AuthType = "clerk" | "next-auth" | "supabase" | "custom";

export interface ProjectInfo {
  hasTypeScript: boolean;
  hasTailwind: boolean;
  hasReact: boolean;
  router: RouterType;
  auth: AuthType;
  srcDir: string; // "src" or "."
}

function readPackageJson(cwd: string): Record<string, any> {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return {};
  return fs.readJsonSync(pkgPath);
}

function hasDep(pkg: Record<string, any>, name: string): boolean {
  return (
    name in (pkg.dependencies ?? {}) ||
    name in (pkg.devDependencies ?? {}) ||
    name in (pkg.peerDependencies ?? {})
  );
}

export function detectProject(cwd: string = process.cwd()): ProjectInfo {
  const pkg = readPackageJson(cwd);

  // TypeScript
  const hasTypeScript =
    hasDep(pkg, "typescript") || fs.existsSync(path.join(cwd, "tsconfig.json"));

  // Tailwind
  const hasTailwind =
    hasDep(pkg, "tailwindcss") ||
    fs.existsSync(path.join(cwd, "tailwind.config.ts")) ||
    fs.existsSync(path.join(cwd, "tailwind.config.js"));

  // React
  const hasReact = hasDep(pkg, "react");

  // Router
  let router: RouterType = "unknown";
  if (hasDep(pkg, "@tanstack/react-router")) router = "tanstack-router";
  else if (hasDep(pkg, "react-router-dom")) router = "react-router";

  // Auth
  let auth: AuthType = "custom";
  if (hasDep(pkg, "@clerk/clerk-react") || hasDep(pkg, "@clerk/nextjs"))
    auth = "clerk";
  else if (hasDep(pkg, "next-auth")) auth = "next-auth";
  else if (hasDep(pkg, "@supabase/supabase-js")) auth = "supabase";

  // src dir
  const srcDir = fs.existsSync(path.join(cwd, "src")) ? "src" : ".";

  return { hasTypeScript, hasTailwind, hasReact, router, auth, srcDir };
}
