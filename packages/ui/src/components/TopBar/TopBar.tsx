// src/components/TopBar/TopBar.tsx
import React from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
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
    <header
      className={cn(
        "h-16 flex items-center justify-between px-4 gap-4",
        "bg-white border-b border-gray-200 flex-shrink-0",
        className,
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100
                       hover:text-gray-700 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="text-base font-semibold text-gray-800 hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Custom actions slot */}
        {actions}

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-gray-500
                           hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span
              className="absolute top-1.5 right-1.5 h-2 w-2
                             rounded-full bg-red-500"
            />
          )}
        </button>

        {/* User menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg
                         hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div
                  className="h-7 w-7 rounded-full bg-blue-600
                                flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-white text-xs font-semibold">
                    {user.name[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 leading-none">
                  {user.name}
                </p>
                {user.role && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-none capitalize">
                    {user.role}
                  </p>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform duration-200",
                  userMenuOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div
                  className="absolute right-0 top-full mt-1 w-48 z-20
                                bg-white rounded-lg border border-gray-200
                                shadow-lg py-1"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-500 truncate">
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
                      className="w-full text-left px-3 py-2 text-sm
                                 text-red-600 hover:bg-red-50 transition-colors"
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
