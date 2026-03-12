// src/index.ts

// defineConfig — developer facing
export { defineConfig } from "./define/defineConfig";

// Types — for external consumption
export type { RonConfig } from "./types/config";
export type { RoleTuple, RoleValue } from "./types/roles";
export type {
  ResourcesMap,
  InferPermissions,
  PermissionString,
} from "./types/permissions";
export type { NavItem } from "./types/navigation";
export type { AuthConfig, AuthProvider, RonUser } from "./types/auth";

// Permission utilities — used by CLI
export { resolvePermissions } from "./permissions/resolvePermissions";
export { validateConfig } from "./permissions/validateConfig";
export type { ValidationResult } from "./permissions/validateConfig";
