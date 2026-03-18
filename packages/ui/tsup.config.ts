// packages/ui/tsup.config.ts
import type { Options } from "tsup";

const config: Options = {
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "tailwindcss"],
  outDir: "dist",
};

export default config;
