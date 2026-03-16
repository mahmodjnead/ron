// src/hooks/useRonHistory.ts
import { useRef, useCallback } from "react";

export interface HistoryEntry {
  path: string;
  timestamp: number;
}

// Global history stack — persists across component re-renders
let globalStack: HistoryEntry[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export const ronHistory = {
  push(path: string) {
    globalStack.push({ path, timestamp: Date.now() });
    notify();
  },

  replace(path: string) {
    if (globalStack.length > 0) {
      globalStack[globalStack.length - 1] = {
        path,
        timestamp: Date.now(),
      };
    } else {
      globalStack.push({ path, timestamp: Date.now() });
    }
    notify();
  },

  pop(): string | undefined {
    if (globalStack.length <= 1) return undefined;
    globalStack.pop();
    notify();
    return globalStack[globalStack.length - 1]?.path;
  },

  current(): string | undefined {
    return globalStack[globalStack.length - 1]?.path;
  },

  previous(): string | undefined {
    return globalStack[globalStack.length - 2]?.path;
  },

  stack(): HistoryEntry[] {
    return [...globalStack];
  },

  clear() {
    globalStack = [];
    notify();
  },

  subscribe(fn: () => void) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};

export function useRonHistory() {
  return ronHistory;
}
