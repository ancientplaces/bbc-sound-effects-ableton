import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/extension.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "dist/extension.js",
  loader: { ".html": "text" },
  external: ["node:*", "fs", "path", "https", "os", "stream", "util", "events", "buffer", "crypto"],
  logLevel: "info",
});
