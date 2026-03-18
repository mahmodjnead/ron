import { describe, it, expect } from "vitest";
import { validateConfig } from "./validateConfig";
import type { RonConfig } from "../types/config";

describe("validateConfig", () => {
  it("should return valid: true for a correct config", () => {
    const config: RonConfig<["admin"], any> = {
      roles: ["admin"],
      auth: { provider: "custom", getCurrentUser: async () => ({} as any) },
      resources: {
        users: {
          permissions: { view: ["admin"] },
        },
      },
      navigation: [
        { label: "Users", path: "/users", permission: "users:view" },
      ],
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(true);
  });

  it("should return valid: false if roles is empty", () => {
    const config: any = {
      roles: [],
      resources: {},
      navigation: [],
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain("roles must contain at least one role.");
    }
  });

  it("should return valid: false for duplicate roles", () => {
    const config: any = {
      roles: ["admin", "admin"],
      resources: {},
      navigation: [],
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors?.[0]).toContain("Duplicate roles found: admin");
    }
  });

  it("should return valid: false for unknown roles in permissions", () => {
    const config: RonConfig<["admin"], any> = {
      roles: ["admin"],
      auth: { provider: "custom", getCurrentUser: async () => ({} as any) },
      resources: {
        users: {
          permissions: { view: ["guest"] as any },
        },
      },
      navigation: [],
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors?.[0]).toContain('references unknown role "guest"');
    }
  });

  it("should return valid: false for unknown permissions in navigation", () => {
    const config: RonConfig<["admin"], any> = {
      roles: ["admin"],
      auth: { provider: "custom", getCurrentUser: async () => ({} as any) },
      resources: {
        users: {
          permissions: { view: ["admin"] },
        },
      },
      navigation: [
        { label: "Settings", path: "/settings", permission: "settings:edit" },
      ],
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors?.[0]).toContain('references unknown permission "settings:edit"');
    }
  });
});
