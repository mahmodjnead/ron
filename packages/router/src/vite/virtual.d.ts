// src/vite/virtual.d.ts
declare module "virtual:ron/routes" {
  import type { ComponentType } from "react";

  export interface RouteEntry {
    path: string;
    component: ComponentType;
    layout?: ComponentType<{ children: React.ReactNode }>;
    permission: string | null;
    isDynamic: boolean;
    params: string[];
  }

  export const routes: RouteEntry[];
  export default routes;
}
