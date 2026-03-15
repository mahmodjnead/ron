// src/plugin/components/table.ts
export const tableStyles = {
  ".ron-table-wrapper": {
    borderRadius: "var(--ron-radius-lg)",
    border: "1px solid rgb(var(--ron-border))",
    overflow: "hidden",
    boxShadow: "var(--ron-shadow)",
    backgroundColor: "rgb(var(--ron-surface))",
  },
  ".ron-table": {
    width: "100%",
    fontSize: "0.875rem",
    borderCollapse: "collapse",
  },
  ".ron-table thead": {
    backgroundColor: "rgb(var(--ron-surface-hover))",
    borderBottom: "1px solid rgb(var(--ron-border))",
  },
  ".ron-table th": {
    padding: "0.75rem 1rem",
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "rgb(var(--ron-text-muted))",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  },
  ".ron-table td": {
    padding: "0.75rem 1rem",
    color: "rgb(var(--ron-text))",
    whiteSpace: "nowrap",
  },
  ".ron-table tbody tr": {
    borderBottom: "1px solid rgb(var(--ron-border))",
    transition: "background-color 150ms",
    "&:last-child": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: "rgb(var(--ron-surface-hover))",
    },
  },
  ".ron-table-clickable tbody tr": {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(var(--ron-surface-active))",
    },
  },
  ".ron-table-footer": {
    padding: "0.75rem 1rem",
    borderTop: "1px solid rgb(var(--ron-border))",
    backgroundColor: "rgb(var(--ron-surface-hover))",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
};
