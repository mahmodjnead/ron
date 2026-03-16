export const cardStyles = {
  ".ron-card": {
    backgroundColor: "var(--ron-surface)",
    border: "1px solid var(--ron-border)",
    borderRadius: "var(--ron-radius-lg)",
    boxShadow: "var(--ron-shadow)",
    overflow: "hidden",
  },
  ".ron-card-header": {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid var(--ron-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  ".ron-card-title": {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--ron-text)",
  },
  ".ron-card-body": {
    padding: "1.5rem",
  },
  ".ron-card-footer": {
    padding: "1rem 1.5rem",
    borderTop: "1px solid var(--ron-border)",
    backgroundColor: "var(--ron-surface-hover)",
  },
  ".ron-stat-card": {
    backgroundColor: "var(--ron-surface)",
    border: "1px solid var(--ron-border)",
    borderRadius: "var(--ron-radius-lg)",
    padding: "1.5rem",
    boxShadow: "var(--ron-shadow)",
  },
  ".ron-stat-label": {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "var(--ron-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  ".ron-stat-value": {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "var(--ron-text)",
    lineHeight: "1.2",
    marginTop: "0.25rem",
  },
  ".ron-stat-change": {
    fontSize: "0.75rem",
    fontWeight: "500",
    marginTop: "0.375rem",
  },
};
