// src/types/permissions.ts
import type { RoleValue, RoleTuple } from "./roles";

/**
 * A single permission string in resource:action format.
 * e.g. "users:view" | "content:publish"
 */
export type PermissionString = `${string}:${string}`;

/**
 * The permissions block for a single resource.
 * Each action maps to a list of roles that can perform it.
 *
 * resources: {
 *   users: {
 *     permissions: {
 *       view:   ["admin", "editor"],
 *       delete: ["admin"],
 *     }
 *   }
 * }
 */
export type ResourcePermissions<TRoles extends RoleTuple> = {
  [action: string]: ReadonlyArray<RoleValue<TRoles>>;
};

/**
 * Full resources map — each key is a resource name.
 */
export type ResourcesMap<TRoles extends RoleTuple> = {
  [resource: string]: {
    permissions: ResourcePermissions<TRoles>;
  };
};

/**
 * Derives all permission strings from a resources map.
 * e.g. { users: { permissions: { view: [...] } } }
 * →    "users:view"
 */
export type InferPermissions<TResources extends ResourcesMap<RoleTuple>> = {
  [R in keyof TResources]: `${R & string}:${keyof TResources[R]["permissions"] & string}`;
}[keyof TResources];
