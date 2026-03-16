// src/hooks/useRonNavigate.ts
import { useNavigate } from "react-router-dom";
import { ronHistory } from "./useRonHistory";

const ADMIN_BASE = "/admin";

/**
 * Only PUSH when going deeper within the same section.
 * Everything else is a REPLACE.
 */
function shouldPush(from: string, to: string): boolean {
  const fromParts = from.split("/").filter(Boolean);
  const toParts = to.split("/").filter(Boolean);

  // Going deeper in same branch → push
  return (
    toParts.length > fromParts.length &&
    to.startsWith(from.endsWith("/") ? from : from + "/")
  );
}

function getParentPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return ADMIN_BASE;
  return "/" + parts.slice(0, -1).join("/");
}

export function useRonNavigate() {
  const navigate = useNavigate();

  const push = (to: string) => {
    const from = ronHistory.current() ?? window.location.pathname;

    if (shouldPush(from, to)) {
      ronHistory.push(to);
      navigate(to);
    } else {
      ronHistory.replace(to);
      navigate(to, { replace: true });
    }
  };

  const replace = (to: string) => {
    ronHistory.replace(to);
    navigate(to, { replace: true });
  };

  const back = () => {
    const previous = ronHistory.pop();
    if (previous) {
      navigate(previous, { replace: true });
    } else {
      const current = window.location.pathname;
      navigate(getParentPath(current), { replace: true });
    }
  };

  const backToParent = () => {
    const current = window.location.pathname;
    const parent = getParentPath(current);
    ronHistory.push(parent);
    navigate(parent);
  };

  return {
    push,
    replace,
    back,
    backToParent,
    canGoBack: ronHistory.stack().length > 1,
    history: ronHistory.stack(),
  };
}
