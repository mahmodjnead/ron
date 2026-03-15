// src/components/DataTable/types.ts
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

export type { ColumnDef };

/**
 * Built-in column types Ron knows how to render.
 * Developers can always pass a custom `cell` renderer too.
 */
export type RonColumnType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "badge"
  | "boolean";

/**
 * Extended column definition with Ron-specific options.
 */
export type RonColumnDef<TData> = ColumnDef<TData> & {
  type?: RonColumnType;
  currency?: string; // e.g. "USD" — used when type="currency"
  dateFormat?: string; // e.g. "MMM dd, yyyy"
  badgeColors?: Record<string, string>; // value → tailwind color class
};

export interface DataTableProps<TData> {
  data: TData[];
  columns: RonColumnDef<TData>[];
  isLoading?: boolean;
  isFetching?: boolean; // background refetch indicator
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  className?: string;
}
