// src/components/TopBar/TopBar.tsx
import React from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface TopBarUser {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface TopBarProps {
  user?: TopBarUser;
  onMenuToggle?: () => void;
  onLogout?: () => void;
  notifications?: number;
  title?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function TopBar({
  user,
  onMenuToggle,
  onLogout,
  notifications = 0,
  title,
  className,
  actions,
}: TopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className={cn("ron-topbar", className)}>
      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="ron-btn ron-btn-ghost ron-btn-icon lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && <h1 className="ron-topbar-title hidden sm:block">{title}</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">
        {actions}

        {/* Notifications */}
        <button className="ron-btn ron-btn-ghost ron-btn-icon relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--ron-danger)" }}
            />
          )}
        </button>

        {/* User menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="ron-btn ron-btn-ghost flex items-center gap-2
                         px-2 py-1.5"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="ron-avatar"
                  style={{ width: "1.75rem", height: "1.75rem" }}
                />
              ) : (
                <div className="ron-avatar">{user.name[0]?.toUpperCase()}</div>
              )}
              <div className="hidden sm:block text-left">
                <p
                  className="text-sm font-medium leading-none"
                  style={{ color: "var(--ron-text)" }}
                >
                  {user.name}
                </p>
                {user.role && (
                  <p
                    className="text-xs mt-0.5 leading-none capitalize"
                    style={{ color: "var(--ron-text-muted)" }}
                  >
                    {user.role}
                  </p>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  "opacity-50",
                  userMenuOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="ron-dropdown">
                  <div
                    className="px-3 py-2"
                    style={{
                      borderBottom: "1px solid var(--ron-border)",
                    }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--ron-text)" }}
                    >
                      {user.name}
                    </p>
                    {user.email && (
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--ron-text-muted)" }}
                      >
                        {user.email}
                      </p>
                    )}
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="ron-dropdown-item ron-dropdown-item-danger"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
