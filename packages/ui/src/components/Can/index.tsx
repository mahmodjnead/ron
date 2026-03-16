// packages/ui/src/components/Can/index.tsx
import React from "react";
import { useRonPermissions } from "../PermissionProvider";

interface CanProps {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: CanProps) {
  const { permissions } = useRonPermissions();
  const required = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? required.every((p) => permissions.includes(p))
    : required.some((p) => permissions.includes(p));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
