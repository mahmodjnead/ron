// src/components/DataTable/TableSkeleton.tsx
import { cn } from "../../utils/cn";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="flex gap-4 border-b border-gray-200 pb-3 mb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-gray-100">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className={cn(
                "h-4 bg-gray-100 rounded flex-1",
                j === 0 && "bg-gray-200",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
