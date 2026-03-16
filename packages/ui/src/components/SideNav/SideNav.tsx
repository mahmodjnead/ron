// src/components/SideNav/SideNav.tsx
import React from "react";
import { cn } from "../../utils/cn";
import { SideNavItem } from "./SideNavItem";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { NavItemConfig } from "./SideNavItem";

export interface SideNavProps {
  items: NavItemConfig[];
  currentPath: string;
  onNavigate: (path: string) => void;
  branding?: {
    name: string;
    logo?: string;
  };
  footer?: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function SideNav({
  items,
  currentPath,
  onNavigate,
  branding,
  footer,
  className,
  collapsed = false,
  onCollapse,
}: SideNavProps) {
  return (
    <aside
      className={cn(
        "ron-sidebar",
        collapsed && "ron-sidebar-collapsed",
        className,
      )}
    >
      {/* Branding */}
      <div
        className={cn("ron-sidebar-header", collapsed && "justify-center px-0")}
      >
        {branding?.logo ? (
          <img
            src={branding.logo}
            alt={branding.name}
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="h-8 w-8 rounded-lg flex items-center
                       justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--ron-primary)" }}
          >
            <span
              className="text-sm font-bold"
              style={{ color: "var(--ron-primary-fg)" }}
            >
              {branding?.name?.[0] ?? "A"}
            </span>
          </div>
        )}
        {!collapsed && branding?.name && (
          <span
            className="font-semibold truncate"
            style={{ color: "var(--ron-text)" }}
          >
            {branding.name}
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="ron-sidebar-nav">
        {items.map((item) => (
          <SideNavItem
            key={item.path ?? item.label}
            item={item}
            currentPath={currentPath}
            onNavigate={onNavigate}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer slot */}
      {footer && !collapsed && (
        <div className="ron-sidebar-footer">{footer}</div>
      )}

      {/* Collapse toggle */}
      {onCollapse && (
        <div
          className={cn(
            "ron-sidebar-footer",
            collapsed && "flex justify-center",
          )}
        >
          <button
            onClick={() => onCollapse(!collapsed)}
            className={cn(
              "ron-btn ron-btn-ghost w-full gap-2",
              collapsed && "w-auto px-2",
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 flex-shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
