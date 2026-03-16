// src/runtime/FirstValidRoute.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ronHistory } from "../hooks/useRonHistory";

interface FirstValidRouteProps {
  routes: any[];
  permissions: string[];
  basePath: string;
}

export function FirstValidRoute({
  routes,
  permissions,
  basePath,
}: FirstValidRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until routes are loaded
    if (routes.length === 0) return;

    const currentPath = window.location.pathname;

    // Only redirect if we're exactly at the base path
    if (currentPath !== basePath && currentPath !== basePath + "/") return;

    // Find first accessible non-dynamic route
    const firstValid = routes.find((route) => {
      if (route.isDynamic) return false;
      if (route.path === basePath) return false;
      if (!route.permission) return true;
      return permissions.includes(route.permission);
    });

    if (firstValid) {
      ronHistory.push(firstValid.path);
      navigate(firstValid.path, { replace: true });
    }
  }, [routes, permissions]); // re-run when routes load

  return null;
}
