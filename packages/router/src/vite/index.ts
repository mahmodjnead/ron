import type { Plugin } from "vite";
import path from "path";
import { scanPages } from "./scanner";
import { generateRoutesModule } from "./codegen";
import type { RonRouterConfig, RonRoute } from "../types";

const VIRTUAL_MODULE_ID = "virtual:ron/routes";
const RESOLVED_VIRTUAL_ID = "\0virtual:ron/routes";

export function ronRouter(config?: Partial<RonRouterConfig>): any {
  const pagesDir = config?.pagesDir ?? "src/admin/pages";
  const basePath = config?.basePath ?? "/admin";

  let resolvedPagesDir: string;
  let routes: RonRoute[] = [];

  function loadPermissions(_root: string): Record<string, string> {
    return {};
  }

  function buildRoutes(root: string) {
    const permissions = loadPermissions(root);
    const scanned = scanPages(resolvedPagesDir, resolvedPagesDir, basePath);
    routes = scanned.map((route) => ({
      ...route,
      permission: permissions[route.path] ?? route.permission,
    }));
  }

  return {
    name: "ron-router",
    enforce: "pre",

    configResolved(viteConfig: any) {
      resolvedPagesDir = path.resolve(viteConfig.root, pagesDir);
    },

    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_ID;
    },

    load(id: string) {
      if (id === RESOLVED_VIRTUAL_ID) {
        return generateRoutesModule(routes);
      }
    },

    buildStart() {
      buildRoutes(process.cwd());
    },

    configureServer(server: any) {
      const root = server.config.root;
      buildRoutes(root);

      server.watcher.add(resolvedPagesDir);

      server.watcher.on("add", (file: string) => {
        if (file.startsWith(resolvedPagesDir)) {
          buildRoutes(root);
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        }
      });

      server.watcher.on("unlink", (file: string) => {
        if (file.startsWith(resolvedPagesDir)) {
          buildRoutes(root);
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

export default ronRouter;
