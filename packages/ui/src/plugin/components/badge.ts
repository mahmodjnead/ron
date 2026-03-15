// src/plugin/components/badge.ts
export const badgeStyles = {
  ".ron-badge": {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "9999px",
    padding: "0.125rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    lineHeight: "1rem",
    whiteSpace: "nowrap",
  },
  ".ron-badge-success": {
    backgroundColor: "rgb(var(--ron-success-bg))",
    color: "rgb(var(--ron-success-fg))",
  },
  ".ron-badge-warning": {
    backgroundColor: "rgb(var(--ron-warning-bg))",
    color: "rgb(var(--ron-warning-fg))",
  },
  ".ron-badge-danger": {
    backgroundColor: "rgb(var(--ron-danger-bg))",
    color: "rgb(var(--ron-danger-fg))",
  },
  ".ron-badge-info": {
    backgroundColor: "rgb(var(--ron-info-bg))",
    color: "rgb(var(--ron-info-fg))",
  },
  ".ron-badge-default": {
    backgroundColor: "rgb(var(--ron-surface-hover))",
    color: "rgb(var(--ron-text-secondary))",
  },
};
