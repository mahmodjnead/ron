// src/runtime/RonRouter.tsx
import React, {
  Suspense,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RonLayout } from "./RonLayout";
import { FirstValidRoute } from "./FirstValidRoute";
import { ronHistory } from "../hooks/useRonHistory";
import { RonPermissionProvider } from "@ron/ui";

// ── Auth Context ──────────────────────────────────────────
interface RonAuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  role?: string;
}

const AuthCtx = createContext<RonAuthContext>({
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
});

export function useRonAuth() {
  return useContext(AuthCtx);
}

// ── Route tracker — keeps ronHistory in sync ──────────────
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const current = ronHistory.current();
    if (current !== location.pathname) {
      if (!current) {
        ronHistory.push(location.pathname);
      }
    }
  }, [location.pathname]);

  return null;
}

// ── RonRouter ─────────────────────────────────────────────
interface RonRouterProps {
  auth: RonAuthContext;
  basePath?: string;
  children?: React.ReactNode;
}

export function RonRouter({
  auth,
  basePath = "/admin",
  children,
}: RonRouterProps) {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    import("virtual:ron/routes").then((mod) => {
      setRoutes(mod.routes ?? []);
    });
  }, []);

  return (
    <AuthCtx.Provider value={auth}>
      <RonPermissionProvider
        permissions={auth.permissions}
        role={auth.role ?? ""}
      >
        <BrowserRouter>
          <RouteTracker />
          <Routes>
            {/* Root redirect → first valid route */}
            // Replace the routes section in RonRouter.tsx
            {/* Root redirect — only renders after routes load */}
            <Route
              path={basePath}
              element={
                <FirstValidRoute
                  routes={routes}
                  permissions={auth.permissions}
                  basePath={basePath}
                />
              }
            />
            <Route
              path={`${basePath}/`}
              element={
                <FirstValidRoute
                  routes={routes}
                  permissions={auth.permissions}
                  basePath={basePath}
                />
              }
            />
            {/* Generated routes */}
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute
                    permission={route.permission}
                    userPermissions={auth.permissions}
                    isLoading={auth.isLoading}
                    isAuthenticated={auth.isAuthenticated}
                  >
                    <RonLayout layout={route.layout}>
                      <Suspense fallback={<PageLoader />}>
                        <route.component />
                      </Suspense>
                    </RonLayout>
                  </ProtectedRoute>
                }
              />
            ))}
            {/* 403 fallback */}
            <Route
              path={`${basePath}/403`}
              element={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                    gap: "1rem",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: "var(--ron-text-muted)",
                    }}
                  >
                    403
                  </h1>
                  <p style={{ color: "var(--ron-text-secondary)" }}>
                    You don't have permission to access this
                    paonPermissionProvider{" "}
                  </p>
                </div>
              }
            />
            {children}
          </Routes>
        </BrowserRouter>
      </RonPermissionProvider>
    </AuthCtx.Provider>
  );
}

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        height: "60vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "9999px",
          border: "2px solid var(--ron-border)",
          borderTopColor: "var(--ron-primary)",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}
