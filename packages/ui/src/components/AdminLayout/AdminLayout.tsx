// src/components/AdminLayout/AdminLayout.tsx
import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { SideNav } from "../SideNav/SideNav";
import { TopBar } from "../TopBar/TopBar";
import type { SideNavProps } from "../SideNav/SideNav";
import type { TopBarProps } from "../TopBar/TopBar";

export interface AdminLayoutProps {
  navItems: SideNavProps["items"];
  currentPath: string;
  onNavigate: (path: string) => void;
  branding?: SideNavProps["branding"];
  navFooter?: React.ReactNode;
  user?: TopBarProps["user"];
  onLogout?: TopBarProps["onLogout"];
  notifications?: TopBarProps["notifications"];
  topBarActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({
  navItems,
  currentPath,
  onNavigate,
  branding,
  navFooter,
  user,
  onLogout,
  notifications,
  topBarActions,
  children,
  className,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const activeItem = navItems
    .flatMap((i) => [i, ...(i.children ?? [])])
    .find((i) => i.path === currentPath);

  return (
    <div className={cn("flex h-screen bg-gray-50 overflow-hidden", className)}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 lg:hidden",
          "transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SideNav
          items={navItems}
          currentPath={currentPath}
          onNavigate={(path) => {
            onNavigate(path);
            setMobileOpen(false);
          }}
          branding={branding}
          footer={navFooter}
          collapsed={false}
        />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-shrink-0">
        <SideNav
          items={navItems}
          currentPath={currentPath}
          onNavigate={onNavigate}
          branding={branding}
          footer={navFooter}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          user={user}
          onLogout={onLogout}
          notifications={notifications}
          title={activeItem?.label}
          onMenuToggle={() => setMobileOpen((o) => !o)}
          actions={topBarActions}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
