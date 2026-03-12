// src/define/defineConfig.ts
import type { RoleTuple } from "../types/roles";
import type { ResourcesMap } from "../types/permissions";
import type { RonConfig } from "../types/config";

/**
 * defineConfig — the single entry point for admin.config.ts.
 *
 * Provides full TypeScript inference and validation.
 * Roles defined here flow through permissions, navigation,
 * and all generated hooks automatically.
 *
 * @example
 * export default defineConfig({
 *   roles: ["admin", "editor", "viewer"] as const,
 *   resources: {
 *     users: {
 *       permissions: {
 *         view:   ["admin"],
 *         delete: ["admin"],
 *       }
 *     }
 *   },
 *   ...
 * })
 */
export function defineConfig<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles>,
>(config: RonConfig<TRoles, TResources>): RonConfig<TRoles, TResources> {
  return config;
}
