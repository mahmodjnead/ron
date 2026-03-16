// src/components/DataTable/DataTable.tsx
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { renderCell } from "./cellRenderers";
import { TableSkeleton } from "./TableSkeleton";
import type { DataTableProps, RonColumnDef } from "./types";

export function DataTable<TData extends object>({
  data,
  columns,
  isLoading = false,
  isFetching = false,
  searchable = true,
  searchPlaceholder = "Search...",
  pageSize = 10,
  onRowClick,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const enrichedColumns = columns.map((col) => ({
    ...col,
    cell:
      col.cell ??
      (({ getValue }: any) =>
        renderCell({
          value: getValue(),
          type: col.type,
          currency: col.currency,
          badgeColors: col.badgeColors,
        })),
  }));

  const table = useReactTable({
    data,
    columns: enrichedColumns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * currentPageSize + 1;
  const endRow = Math.min(startRow + currentPageSize - 1, totalRows);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--ron-text-muted)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="ron-input pl-9"
            />
          </div>
        )}

        {isFetching && !isLoading && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--ron-text-muted)" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Refreshing...
          </div>
        )}
      </div>

      {/* Table */}
      <div className="ron-table-wrapper">
        <div className="overflow-x-auto">
          <table
            className={cn("ron-table", onRowClick && "ron-table-clickable")}
          >
            {/* Head */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className={cn(canSort && "cursor-pointer select-none")}
                      >
                        <div className="flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort && (
                            <span className="text-xs opacity-40">
                              {sorted === "asc"
                                ? "↑"
                                : sorted === "desc"
                                  ? "↓"
                                  : "↕"}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6">
                    <TableSkeleton rows={pageSize} columns={columns.length} />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm"
                    style={{ color: "var(--ron-text-muted)" }}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={
                      onRowClick ? () => onRowClick(row.original) : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalRows > 0 && (
          <div className="ron-table-footer">
            <p
              className="text-xs"
              style={{ color: "var(--ron-text-muted)" }}
            >
              Showing{" "}
              <span
                className="font-medium"
                style={{ color: "var(--ron-text)" }}
              >
                {startRow}–{endRow}
              </span>{" "}
              of{" "}
              <span
                className="font-medium"
                style={{ color: "var(--ron-text)" }}
              >
                {totalRows}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="ron-btn ron-btn-ghost ron-btn-icon ron-btn-sm"
              >
                ‹
              </button>

              {Array.from({ length: table.getPageCount() }, (_, i) => i)
                .filter(
                  (i) =>
                    Math.abs(i - pageIndex) <= 1 ||
                    i === 0 ||
                    i === table.getPageCount() - 1,
                )
                .reduce<(number | "...")[]>((acc, i, idx, arr) => {
                  if (idx > 0 && i - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(i);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-sm"
                      style={{ color: "var(--ron-text-muted)" }}
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => table.setPageIndex(item as number)}
                      className={cn(
                        "ron-btn ron-btn-sm",
                        pageIndex === item
                          ? "ron-btn-primary"
                          : "ron-btn-ghost",
                      )}
                      style={{ minWidth: "2rem" }}
                    >
                      {(item as number) + 1}
                    </button>
                  ),
                )}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="ron-btn ron-btn-ghost ron-btn-icon ron-btn-sm"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
