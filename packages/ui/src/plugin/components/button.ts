export const buttonStyles = {
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
      outline: "2px solid var(--ron-border-focus)",
      outlineOffset: "2px",
    },
  },
  ".ron-btn-primary": {
    backgroundColor: "var(--ron-primary)",
    color: "var(--ron-primary-fg)",
    "&:hover:not(:disabled)": {
      backgroundColor: "var(--ron-primary-hover)",
    },
  },
  ".ron-btn-secondary": {
    backgroundColor: "var(--ron-secondary)",
    color: "var(--ron-secondary-fg)",
    "&:hover:not(:disabled)": {
      backgroundColor: "var(--ron-secondary-hover)",
    },
  },
  ".ron-btn-outline": {
    backgroundColor: "transparent",
    color: "var(--ron-primary)",
    borderColor: "var(--ron-primary)",
    "&:hover:not(:disabled)": {
      backgroundColor: "var(--ron-surface-active)",
    },
  },
  ".ron-btn-ghost": {
    backgroundColor: "transparent",
    color: "var(--ron-text-secondary)",
    "&:hover:not(:disabled)": {
      backgroundColor: "var(--ron-surface-hover)",
      color: "var(--ron-text)",
    },
  },
  ".ron-btn-danger": {
    backgroundColor: "var(--ron-danger)",
    color: "var(--ron-danger-fg)",
    "&:hover:not(:disabled)": {
      opacity: "0.9",
    },
  },
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
