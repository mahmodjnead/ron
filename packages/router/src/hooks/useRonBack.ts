// src/hooks/useRonBack.ts
import { useRonNavigate } from "./useRonNavigate";
import { useRonLocation } from "./useRonLocation";

/**
 * Smart back navigation.
 * Goes back in history if available.
 * Falls back to parent route if no history.
 * Never exits the admin shell.
 */
export function useRonBack() {
  const { back, canGoBack } = useRonNavigate();
  const { path } = useRonLocation();

  const isAtRoot = path === "/admin" || path === "/admin/";

  return {
    back,
    canGoBack: canGoBack && !isAtRoot,
    isAtRoot,
  };
}
