// src/permissions/resolvePermissions.ts
import type { RoleTuple } from "../types/roles";
import type { ResourcesMap, InferPermissions } from "../types/permissions";
import type { RonConfig } from "../types/config";

/**
 * Builds the full ROLE → PERMISSIONS[] map from a RonConfig.
 * This is what the CLI uses to generate the _generated/permission-matrix.ts file.
 *
 * @example
 * resolvePermissions(config)
 * // →  {
 * //      admin:  ["users:view", "users:create", "content:view"],
 * //      editor: ["content:view"],
 * //    }
 */
export function resolvePermissions<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles>,
>(config: RonConfig<TRoles, TResources>): Record<string, string[]> {
  const matrix: Record<string, string[]> = {};

  // Initialize every role with an empty array
  for (const role of config.roles) {
    matrix[role] = [];
  }

  // Walk every resource → action → roles[]
  for (const [resource, resourceConfig] of Object.entries(config.resources)) {
    for (const [action, roles] of Object.entries(resourceConfig.permissions)) {
      const permission = `${resource}:${action}`;
      for (const role of roles as string[]) {
        if (matrix[role]) {
          matrix[role]!.push(permission);
        }
      }
    }
  }

  return matrix;
}
