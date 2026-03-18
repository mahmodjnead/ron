import { describe, it, expect } from "vitest";
import { resolvePermissions } from "./resolvePermissions";
import type { RonConfig } from "../types/config";

describe("resolvePermissions", () => {
  it("should resolve permissions for a basic config", () => {
    const config: RonConfig<["admin", "user"], any> = {
      roles: ["admin", "user"],
      auth: { provider: "custom", getCurrentUser: async () => ({} as any) },
      resources: {
        users: {
          permissions: {
            view: ["admin", "user"],
            create: ["admin"],
          },
        },
      },
      navigation: [],
    };

    const matrix = resolvePermissions(config);

    expect(matrix).toEqual({
      admin: ["users:view", "users:create"],
      user: ["users:view"],
    });
  });

  it("should handle roles with no permissions", () => {
    const config: RonConfig<["admin", "guest"], any> = {
      roles: ["admin", "guest"],
      auth: { provider: "custom", getCurrentUser: async () => ({} as any) },
      resources: {
        posts: {
          permissions: {
            view: ["admin"],
          },
        },
      },
      navigation: [],
    };

    const matrix = resolvePermissions(config);

    expect(matrix).toEqual({
      admin: ["posts:view"],
      guest: [],
    });
  });

  it("should handle multiple resources", () => {
    const config: RonConfig<["admin"], any> = {
      roles: ["admin"],
      auth: { provider: "custom", getCurrentUser: async () => ({} as any) },
      resources: {
        users: {
          permissions: { view: ["admin"] },
        },
        posts: {
          permissions: { create: ["admin"] },
        },
      },
      navigation: [],
    };

    const matrix = resolvePermissions(config);

    expect(matrix.admin).toContain("users:view");
    expect(matrix.admin).toContain("posts:create");
  });
});
