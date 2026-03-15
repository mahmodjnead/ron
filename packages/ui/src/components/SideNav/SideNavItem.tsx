// src/components/SideNav/SideNavItem.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface NavItemConfig {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permission?: string;
  badge?: () => number | null;
  children?: NavItemConfig[];
}

interface SideNavItemProps {
  item: NavItemConfig;
  currentPath: string;
  depth?: number;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}

export function SideNavItem({
  item,
  currentPath,
  depth = 0,
  onNavigate,
  collapsed = false,
}: SideNavItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive =
    item.children?.some((c) => c.path === currentPath) ?? false;
  const [isOpen, setIsOpen] = useState(isChildActive);
  const isActive = item.path === currentPath;
  const badge = item.badge?.();

  // ── Collapsed — icon only ─────────────────────────────
  if (collapsed) {
    return (
      <button
        onClick={() => item.path && onNavigate(item.path)}
        title={item.label}
        className={cn(
          "w-full flex items-center justify-center p-2 rounded-lg",
          "transition-colors",
          isActive || isChildActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
        )}
      >
        {item.icon ?? <div className="h-4 w-4 rounded-full bg-gray-300" />}
      </button>
    );
  }

  // ── Group item ────────────────────────────────────────
  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg",
            "text-sm font-medium transition-colors",
            isChildActive
              ? "text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span
                className={cn(
                  "flex-shrink-0",
                  isChildActive ? "text-blue-600" : "text-gray-400",
                )}
              >
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="mt-1 ml-4 pl-3 border-l border-gray-100 space-y-1">
            {item.children!.map((child) => (
              <SideNavItem
                key={child.path ?? child.label}
                item={child}
                currentPath={currentPath}
                depth={depth + 1}
                onNavigate={onNavigate}
                collapsed={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Leaf item ─────────────────────────────────────────
  return (
    <button
      onClick={() => item.path && onNavigate(item.path)}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg",
        "text-sm font-medium transition-colors text-left",
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <div className="flex items-center gap-3">
        {item.icon && (
          <span
            className={cn(
              "flex-shrink-0",
              isActive ? "text-blue-600" : "text-gray-400",
            )}
          >
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </div>

      {badge !== null && badge !== undefined && badge > 0 && (
        <span
          className="ml-auto inline-flex items-center justify-center
                         min-w-[20px] h-5 px-1.5 rounded-full
                         bg-blue-100 text-blue-700 text-xs font-semibold"
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}
