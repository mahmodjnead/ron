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
        "flex flex-col h-full bg-white border-r border-gray-200",
        "transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Branding */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-gray-200 flex-shrink-0",
          collapsed ? "justify-center px-0" : "gap-3 px-4",
        )}
      >
        {branding?.logo ? (
          <img
            src={branding.logo}
            alt={branding.name}
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="h-8 w-8 rounded-lg bg-blue-600
                          flex items-center justify-center flex-shrink-0"
          >
            <span className="text-white text-sm font-bold">
              {branding?.name?.[0] ?? "A"}
            </span>
          </div>
        )}
        {!collapsed && branding?.name && (
          <span className="font-semibold text-gray-900 truncate">
            {branding.name}
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-4 space-y-1",
          collapsed ? "px-2" : "px-3",
        )}
      >
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
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          {footer}
        </div>
      )}

      {/* Collapse toggle — bottom of sidebar */}
      {onCollapse && (
        <div
          className={cn(
            "border-t border-gray-200 flex-shrink-0",
            collapsed ? "flex justify-center p-3" : "px-3 py-3",
          )}
        >
          <button
            onClick={() => onCollapse(!collapsed)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg w-full",
              "text-sm text-gray-500 hover:bg-gray-100",
              "hover:text-gray-700 transition-colors",
              collapsed && "justify-center w-auto",
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 flex-shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
