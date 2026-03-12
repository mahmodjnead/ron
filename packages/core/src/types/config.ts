// src/types/config.ts
import type { RoleTuple } from "./roles";
import type { ResourcesMap } from "./permissions";
import type { NavItem } from "./navigation";
import type { AuthConfig } from "./auth";

/**
 * The full admin.config.ts shape.
 * TRoles flows through every nested type so invalid
 * roles are caught by TypeScript at config authoring time.
 */
export type RonConfig<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles> = ResourcesMap<TRoles>,
> = {
  branding?: {
    name: string;
    logo?: string;
    favicon?: string;
  };

  auth: AuthConfig<TRoles, TResources>;

  /**
   * Define roles as a readonly const tuple:
   * roles: ["super_admin", "admin", "editor", "viewer"] as const
   */
  roles: TRoles;

  /**
   * Resources and their per-action role requirements.
   * TypeScript will error if a role value isn't in the roles tuple.
   */
  resources: TResources;

  /**
   * Side navigation — permissions are typed against resources.
   */
  navigation: NavItem<TRoles, TResources>[];
};
