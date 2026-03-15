import type { Options } from "tsup";

const config: Options[] = [
  // Components bundle — with types
  {
    entry:    { index: "src/index.ts" },
    format:   ["esm", "cjs"],
    dts:      true,
    clean:    true,
    external: ["react", "react-dom", "tailwindcss"],
    outDir:   "dist",
  },
  // Plugin — no dts, just JS
  {
    entry:    { plugin: "src/plugin/index.ts" },
    format:   ["esm", "cjs"],
    dts:      false,
    clean:    false,
    external: ["tailwindcss"],
    outDir:   "dist",
  },
];

export default config;