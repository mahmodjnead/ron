// packages/ui/tsup.plugin.ts
import type { Options } from "tsup";

const config: Options = {
  entry: { plugin: "src/plugin/index.ts" },
  format: ["esm", "cjs"],
  dts: false,
  clean: false,
  external: ["tailwindcss"],
  outDir: "dist",
};

export default config;
