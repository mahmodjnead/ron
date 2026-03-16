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

  // ── Collapsed — icon only ───────────────────────────
  if (collapsed) {
    const targetPath = item.path ?? item.children?.[0]?.path;
    return (
      <button
        onClick={() => targetPath && onNavigate(targetPath)}
        title={item.label}
        className={cn(
          "ron-nav-item",
          "w-full justify-center px-0 py-2",
          (isActive || isChildActive) && "ron-nav-item-active",
        )}
      >
        <span className="ron-nav-item-icon">
          {item.icon ?? <div className="h-2 w-2 rounded-full bg-current" />}
        </span>
      </button>
    );
  }

  // ── Group item ──────────────────────────────────────
  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={cn(
            "ron-nav-item w-full justify-between",
            isChildActive && "ron-nav-item-active",
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="ron-nav-item-icon">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              "text-current opacity-50",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="ron-nav-group-children">
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

  // ── Leaf item ───────────────────────────────────────
  return (
    <button
      onClick={() => item.path && onNavigate(item.path)}
      className={cn(
        "ron-nav-item w-full",
        isActive && "ron-nav-item-active",
        depth > 0 && "text-sm",
      )}
    >
      {item.icon && <span className="ron-nav-item-icon">{item.icon}</span>}
      <span className="flex-1 text-left">{item.label}</span>

      {badge !== null && badge !== undefined && badge > 0 && (
        <span className="ron-badge ron-badge-info ml-auto">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}
