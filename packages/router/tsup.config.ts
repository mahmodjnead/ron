import type { Options } from "tsup";

const config: Options[] = [
  // Runtime — components + hooks
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    external: [
      "react",
      "react-dom",
      "react-router-dom",
      "vite",
      "virtual:ron/routes", // ← external — resolved by Vite at runtime
    ],
    outDir: "dist",
  },
  // Vite plugin — separate entry
  {
    entry: { vite: "src/vite/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    external: ["vite", "fs", "path", "@ron/core"],
    outDir: "dist",
  },
];

export default config;
