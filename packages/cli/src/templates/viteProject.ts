// packages/cli/src/templates/viteProject.ts

export const indexHtmlTemplate = (projectName: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

export const packageJsonTemplate = (projectName: string, pm: string) =>
  JSON.stringify(
    {
      name: projectName.toLowerCase().replace(/\s+/g, "-"),
      version: "0.0.1",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
        typecheck: "tsc --noEmit",
        "ron:sync": "ron sync",
      },
      dependencies: {
        "@ronjs/core": "latest",
        "@ronjs/ui": "latest",
        "@ronjs/router": "latest",
        "@tanstack/react-query": "^5.0.0",
        "lucide-react": "^0.400.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "react-router-dom": "^6.0.0",
        zod: "^3.0.0",
        "react-hook-form": "^7.0.0",
      },
      devDependencies: {
        "@tailwindcss/vite": "^4.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@vitejs/plugin-react": "^4.0.0", // ← v4 works with Vite 5/6/7
        tailwindcss: "^4.0.0",
        typescript: "^5.4.0",
        vite: "^6.0.0", // ← pin to v6, stable
      },
    },
    null,
    2,
  );

export const tsconfigTemplate = () =>
  JSON.stringify(
    {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" },
      ],
    },
    null,
    2,
  );

export const tsconfigAppTemplate = () =>
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "Bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ["src"],
    },
    null,
    2,
  );

export const tsconfigNodeTemplate = () =>
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2023"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "Bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        strict: true,
      },
      include: ["vite.config.ts"],
    },
    null,
    2,
  );

export const viteConfigTemplate = () => `import { defineConfig }  from "vite";
import react            from "@vitejs/plugin-react";
import tailwindcss      from "@tailwindcss/vite";
import { ronRouter }    from "@ronjs/router/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ronRouter({
      pagesDir: "src/admin/pages",
      basePath: "/admin",
    }),
  ],
  optimizeDeps: {
    exclude: ["@ronjs/router"],
  },
});
`;

export const indexCssTemplate = () => `@import "tailwindcss";
@plugin "@ronjs/ui";
`;

export const mainTsxTemplate = (
  auth: string,
) => `import { StrictMode }  from "react";
import { createRoot }  from "react-dom/client";
import "./index.css";
import { RonRouter }   from "@ronjs/router";
${authImports[auth] ?? ""}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RonRouter
      auth={{
        isAuthenticated: true,   // TODO: replace with real auth
        isLoading:       false,
        role:            "admin",
        permissions:     [],     // TODO: resolve from your auth provider
      }}
      basePath="/admin"
    />
  </StrictMode>
);
`;

const authImports: Record<string, string> = {
  clerk: `import { ClerkProvider } from "@clerk/clerk-react";`,
  "next-auth": `// import { SessionProvider } from "next-auth/react";`,
  supabase: `// import { createClient } from "@supabase/supabase-js";`,
  custom: "",
};

export const ronDtsTemplate = () => `declare module "virtual:ron/routes" {
  import type { ComponentType } from "react";

  export interface RouteEntry {
    path:       string;
    component:  ComponentType;
    permission: string | null;
    isDynamic:  boolean;
    params:     string[];
  }

  export const rootLayout: ComponentType<{ children: React.ReactNode }> | undefined;
  export const routes:     RouteEntry[];
  export default routes;
}
`;

export const gitignoreTemplate = () => `# Dependencies
node_modules
.pnpm-store

# Build
dist
.turbo

# Environment
.env
.env.local
.env.*.local

# Editor
.vscode
.idea
*.suo

# OS
.DS_Store
Thumbs.db

# Ron
.ron-loader.ts
`;
