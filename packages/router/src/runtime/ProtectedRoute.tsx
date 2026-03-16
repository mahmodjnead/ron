// src/runtime/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  permission?: string | null;
  children: React.ReactNode;
  // These come from the generated permission matrix
  userPermissions: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function ProtectedRoute({
  permission,
  children,
  userPermissions,
  isLoading,
  isAuthenticated,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "9999px",
            border: "3px solid var(--ron-border)",
            borderTopColor: "var(--ron-primary)",
            animation: "spin 0.7s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permission && !userPermissions.includes(permission)) {
    return <Navigate to="/admin/403" replace />;
  }

  return <>{children}</>;
}
