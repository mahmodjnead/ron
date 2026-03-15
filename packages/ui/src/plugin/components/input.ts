// src/plugin/components/input.ts
export const inputStyles = {
  ".ron-input": {
    width: "100%",
    backgroundColor: "rgb(var(--ron-surface))",
    border: "1px solid rgb(var(--ron-border))",
    borderRadius: "var(--ron-radius)",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    color: "rgb(var(--ron-text))",
    transition: "border-color 150ms, box-shadow 150ms",
    outline: "none",
    "&::placeholder": {
      color: "rgb(var(--ron-text-muted))",
    },
    "&:focus": {
      borderColor: "rgb(var(--ron-border-focus))",
      boxShadow: "0 0 0 3px rgb(var(--ron-primary) / 0.15)",
    },
    "&:disabled": {
      opacity: "0.5",
      cursor: "not-allowed",
      backgroundColor: "rgb(var(--ron-surface-hover))",
    },
  },
  ".ron-input-sm": {
    padding: "0.375rem 0.625rem",
    fontSize: "0.75rem",
  },
  ".ron-label": {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "rgb(var(--ron-text))",
    marginBottom: "0.375rem",
  },
  ".ron-field": {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
};
