// src/hooks/useRonLocation.ts
import { useLocation } from "react-router-dom";

export function useRonLocation() {
  const location = useLocation();
  return {
    path: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    isActive: (path: string) => location.pathname === path,
    startsWith: (path: string) => location.pathname.startsWith(path),
  };
}
