// packages/ui/src/components/PermissionProvider/index.tsx
import React, { createContext, useContext, type ReactNode } from "react";

interface PermissionContextValue {
  permissions: string[];
  role: string;
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  role: "",
});

export function RonPermissionProvider({
  permissions,
  role,
  children,
}: PermissionContextValue & { children: ReactNode }) {
  return (
    <PermissionContext.Provider value={{ permissions, role }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function useRonPermissions() {
  return useContext(PermissionContext);
}

export function usePermission(
  required: string | string[],
  requireAll: boolean = false,
): boolean {
  const { permissions } = useRonPermissions();
  const perms = Array.isArray(required) ? required : [required];

  return requireAll
    ? perms.every((p) => permissions.includes(p))
    : perms.some((p) => permissions.includes(p));
}

export function useRole(...roles: string[]): boolean {
  const { role } = useRonPermissions();
  return roles.includes(role);
}
