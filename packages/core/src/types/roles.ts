// src/types/roles.ts

/**
 * Extracts the union of role strings from a readonly tuple.
 * e.g. ["admin", "editor"] as const → "admin" | "editor"
 */
export type RoleValue<TRoles extends readonly string[]> =
  TRoles[number];

/**
 * Base shape every Ron config role tuple must satisfy.
 */
export type RoleTuple = readonly [string, ...string[]];
