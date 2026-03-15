// src/plugin/base.ts
export const baseStyles = {
  "[data-ron-root]": {
    backgroundColor: "rgb(var(--ron-bg))",
    color: "rgb(var(--ron-text))",
    fontFamily: "inherit",
  },
  "*, *::before, *::after": {
    borderColor: "rgb(var(--ron-border))",
  },
};
