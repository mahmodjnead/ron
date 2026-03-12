// src/permissions/validateConfig.ts
import type { RoleTuple } from "../types/roles";
import type { ResourcesMap } from "../types/permissions";
import type { RonConfig } from "../types/config";

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

/**
 * Runtime validation of admin.config.ts values.
 * TypeScript catches type errors at author-time,
 * this catches logical errors at CLI-run-time.
 *
 * Checks:
 * - roles array is not empty
 * - no duplicate roles
 * - no duplicate resource names
 * - every permission role value exists in the roles array
 * - navigation permissions reference defined resources
 */
export function validateConfig<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles>,
>(config: RonConfig<TRoles, TResources>): ValidationResult {
  const errors: string[] = [];
  const roles = config.roles as readonly string[];

  // ── roles ──────────────────────────────────────────────────
  if (roles.length === 0) {
    errors.push("roles must contain at least one role.");
  }

  const duplicateRoles = roles.filter((r, i) => roles.indexOf(r) !== i);
  if (duplicateRoles.length > 0) {
    errors.push(`Duplicate roles found: ${duplicateRoles.join(", ")}`);
  }

  // ── resources ──────────────────────────────────────────────
  const resourceNames = Object.keys(config.resources);
  const duplicateResources = resourceNames.filter(
    (r, i) => resourceNames.indexOf(r) !== i,
  );
  if (duplicateResources.length > 0) {
    errors.push(`Duplicate resources: ${duplicateResources.join(", ")}`);
  }

  for (const [resource, resourceConfig] of Object.entries(config.resources)) {
    for (const [action, assignedRoles] of Object.entries(
      resourceConfig.permissions,
    )) {
      for (const role of assignedRoles as string[]) {
        if (!roles.includes(role)) {
          errors.push(
            `Resource "${resource}" action "${action}" references unknown role "${role}".`,
          );
        }
      }
    }
  }

  // ── navigation ─────────────────────────────────────────────
  const allPermissions = resourceNames.flatMap((resource) =>
    Object.keys(config.resources[resource]!.permissions).map(
      (action) => `${resource}:${action}`,
    ),
  );

  const checkNavItems = (items: typeof config.navigation) => {
    for (const item of items) {
      if (item.permission && !allPermissions.includes(item.permission)) {
        errors.push(
          `Nav item "${item.label}" references unknown permission "${item.permission}".`,
        );
      }
      if (item.children) checkNavItems(item.children);
    }
  };
  checkNavItems(config.navigation);

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
