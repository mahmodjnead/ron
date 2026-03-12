// src/types/navigation.ts
import type { RoleTuple, RoleValue } from "./roles";
import type { InferPermissions } from "./permissions";
import type { ResourcesMap } from "./permissions";

/**
 * A single navigation item in the side menu.
 * Permission is typed against the resources defined in config.
 */
export type NavItem<
  TRoles extends RoleTuple,
  TResources extends ResourcesMap<TRoles>,
> = {
  label: string;
  icon?: string;
  path?: string;
  permission?: InferPermissions<TResources>;
  children?: NavItem<TRoles, TResources>[];
  badge?: () => number | null;
};
