// src/plugin/components/button.ts
export const buttonStyles = {
  // Base
  ".ron-btn": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "var(--ron-radius)",
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    padding: "0.5rem 1rem",
    transition: "all 150ms ease",
    cursor: "pointer",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
    userSelect: "none",
    "&:disabled": {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    "&:focus-visible": {
      outline: "2px solid rgb(var(--ron-border-focus))",
      outlineOffset: "2px",
    },
  },

  // Variants
  ".ron-btn-primary": {
    backgroundColor: "rgb(var(--ron-primary))",
    color: "rgb(var(--ron-primary-fg))",
    "&:hover:not(:disabled)": {
      backgroundColor: "rgb(var(--ron-primary-hover))",
    },
  },
  ".ron-btn-secondary": {
    backgroundColor: "rgb(var(--ron-secondary))",
    color: "rgb(var(--ron-secondary-fg))",
    "&:hover:not(:disabled)": {
      backgroundColor: "rgb(var(--ron-secondary-hover))",
    },
  },
  ".ron-btn-outline": {
    backgroundColor: "transparent",
    color: "rgb(var(--ron-primary))",
    borderColor: "rgb(var(--ron-primary))",
    "&:hover:not(:disabled)": {
      backgroundColor: "rgb(var(--ron-surface-active))",
    },
  },
  ".ron-btn-ghost": {
    backgroundColor: "transparent",
    color: "rgb(var(--ron-text-secondary))",
    "&:hover:not(:disabled)": {
      backgroundColor: "rgb(var(--ron-surface-hover))",
      color: "rgb(var(--ron-text))",
    },
  },
  ".ron-btn-danger": {
    backgroundColor: "rgb(var(--ron-danger))",
    color: "rgb(var(--ron-danger-fg))",
    "&:hover:not(:disabled)": {
      opacity: "0.9",
    },
  },

  // Sizes
  ".ron-btn-sm": {
    fontSize: "0.75rem",
    padding: "0.375rem 0.75rem",
  },
  ".ron-btn-lg": {
    fontSize: "1rem",
    padding: "0.625rem 1.25rem",
  },
  ".ron-btn-icon": {
    padding: "0.5rem",
    width: "2.25rem",
    height: "2.25rem",
  },
};
