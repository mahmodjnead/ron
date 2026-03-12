// src/types/auth.ts
import type { RoleTuple, RoleValue } from "./roles";
import type { InferPermissions, ResourcesMap } from "./permissions";

/**
 * The resolved user object Ron works with internally.
 * Returned by auth.getCurrentUser().
 */
export type RonUser<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles>,
> = {
  id: string;
  role: RoleValue<TRoles>;
  permissions: Array<InferPermissions<TResources>>;
};

/**
 * Supported auth provider identifiers.
 * "custom" means the developer handles everything in getCurrentUser.
 */
export type AuthProvider = "clerk" | "next-auth" | "supabase" | "custom";

/**
 * Auth block inside admin.config.ts
 */
export type AuthConfig<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles>,
> = {
  provider: AuthProvider;
  getCurrentUser: () => Promise<RonUser<TRoles, TResources>>;
};
