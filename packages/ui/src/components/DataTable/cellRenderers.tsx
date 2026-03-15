// src/components/DataTable/cellRenderers.tsx
import React from "react";
import type { RonColumnType } from "./types";
import { cn } from "../../utils/cn";

interface RenderCellProps {
  value: any;
  type?: RonColumnType | undefined;
  currency?: string | undefined;
  badgeColors?: Record<string, string> | undefined;
}

export function renderCell({
  value,
  type,
  currency = "USD",
  badgeColors = {},
}: RenderCellProps): React.ReactElement | null {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 text-sm">—</span>;
  }

  switch (type) {
    case "currency":
      return (
        <span className="font-medium tabular-nums">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
          }).format(Number(value))}
        </span>
      );

    case "number":
      return (
        <span className="tabular-nums">
          {new Intl.NumberFormat("en-US").format(Number(value))}
        </span>
      );

    case "date":
      return (
        <span className="text-gray-600 text-sm">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );

    case "boolean":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
          )}
        >
          {value ? "Yes" : "No"}
        </span>
      );

    case "badge": {
      const colorClass =
        badgeColors[String(value)] ?? "bg-blue-100 text-blue-700";
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
            colorClass,
          )}
        >
          {String(value)}
        </span>
      );
    }

    default:
      return <span className="text-gray-800 text-sm">{String(value)}</span>;
  }
}
