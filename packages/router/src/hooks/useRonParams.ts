// src/hooks/useRonParams.ts
import { useParams } from "react-router-dom";

export function useRonParams<
  T extends Record<string, string> = Record<string, string>,
>() {
  return useParams() as T;
}
