// src/templates/adminConfig.ts
import type { AuthType } from "../detectors/detectProject";

export function adminConfigTemplate(opts: {
  projectName: string;
  auth: AuthType;
  roles: string[];
}): string {
  const rolesStr = opts.roles.map((r) => `"${r}"`).join(", ");

  const authComment: Record<AuthType, string> = {
    clerk: "// Ron detected Clerk — use useUser() to resolve the current user",
    "next-auth":
      "// Ron detected NextAuth — use getSession() to resolve the current user",
    supabase:
      "// Ron detected Supabase — use supabase.auth.getUser() to resolve",
    custom:
      "// Implement getCurrentUser to return the current user with their role",
  };

  return `import { defineConfig } from "@ron/core";

export default defineConfig({
  branding: {
    name: "${opts.projectName}",
    // logo: "/logo.svg",
  },

  auth: {
    provider: "${opts.auth}",
    ${authComment[opts.auth]}
    getCurrentUser: async () => {
      throw new Error(
        "Implement getCurrentUser in admin.config.ts"
      );
    },
  },

  roles: [${rolesStr}] as const,

  resources: {
    // Add your first resource:
    // users: {
    //   permissions: {
    //     view:   ["${opts.roles[0]}"],
    //     create: ["${opts.roles[0]}"],
    //     edit:   ["${opts.roles[0]}"],
    //     delete: ["${opts.roles[0]}"],
    //   },
    // },
  },

  navigation: [
    {
      label: "Dashboard",
      icon:  "layout-dashboard",
      path:  "/admin",
    },
    // Add nav items as you add resources
  ],
});
`;
}
