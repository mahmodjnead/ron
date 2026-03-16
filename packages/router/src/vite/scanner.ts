// src/vite/scanner.ts
import fs from "fs";
import path from "path";
import type { RonRoute } from "../types";

const SPECIAL_FILES = ["_layout", "_loading", "_error", "_403"];
const DYNAMIC_REGEX = /^\[([^\]]+)\]$/;

/**
 * Converts a file path to a route path.
 * pages/users/[id].tsx → /admin/users/:id
 */
function fileToRoutePath(
  filePath: string,
  pagesDir: string,
  basePath: string,
): string {
  const relative = path
    .relative(pagesDir, filePath)
    .replace(/\\/g, "/")
    .replace(/\.(tsx|ts|jsx|js)$/, "");

  const segments = relative.split("/").map((segment) => {
    // index → ""
    if (segment === "index") return "";
    // [id] → :id
    const match = segment.match(DYNAMIC_REGEX);
    if (match) return `:${match[1]}`;
    return segment;
  });

  const routePath = segments.filter((s, i) => s !== "" || i === 0).join("/");

  return (
    `${basePath}/${routePath}`.replace(/\/+/g, "/").replace(/\/$/, "") ||
    basePath
  );
}

/**
 * Extracts param names from a file path.
 * users/[id]/edit.tsx → ["id"]
 */
function extractParams(filePath: string): string[] {
  const params: string[] = [];
  const segments = filePath.replace(/\\/g, "/").split("/");
  for (const segment of segments) {
    const match = segment.match(DYNAMIC_REGEX);
    if (match) params.push(match[1]!);
  }
  return params;
}

/**
 * Finds the nearest _layout.tsx for a given file.
 */
function findLayout(filePath: string, pagesDir: string): string | undefined {
  const dir = path.dirname(filePath);
  const layoutPath = path.join(dir, "_layout.tsx");

  if (fs.existsSync(layoutPath)) return layoutPath;

  // Walk up until we reach pagesDir
  if (dir !== pagesDir && dir.startsWith(pagesDir)) {
    return findLayout(dir, pagesDir);
  }

  return undefined;
}

/**
 * Reads a page file and extracts the exported permission string.
 * export const permission = "users:view"
 */
function extractPagePermission(filePath: string): string | undefined {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(
      /export\s+const\s+permission\s*=\s*["']([^"']+)["']/,
    );
    return match?.[1];
  } catch {
    return undefined;
  }
}

/**
 * Recursively scans a directory and returns all Ron routes.
 */
export function scanPages(
  dir: string,
  pagesDir: string,
  basePath: string,
): RonRoute[] {
  const routes: RonRoute[] = [];

  if (!fs.existsSync(dir)) return routes;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const name = entry.name.replace(/\.(tsx|ts|jsx|js)$/, "");

    if (entry.isDirectory()) {
      // Recurse into subdirectory
      routes.push(...scanPages(fullPath, pagesDir, basePath));
      continue;
    }

    // Skip non-page files
    if (!/\.(tsx|ts|jsx|js)$/.test(entry.name)) continue;

    // Skip special files — they're handled separately
    if (SPECIAL_FILES.includes(name)) continue;

    const routePath = fileToRoutePath(fullPath, pagesDir, basePath);
    const params = extractParams(path.relative(pagesDir, fullPath));
    const layoutPath = findLayout(fullPath, pagesDir);

    routes.push({
      path: routePath,
      filePath: fullPath.replace(/\\/g, "/"),
      layoutPath: layoutPath?.replace(/\\/g, "/"),
      isDynamic: params.length > 0,
      params,
      isIndex: name === "index",
      isLayout: false,
      permission: extractPagePermission(fullPath),
    });
  }

  return routes;
}
