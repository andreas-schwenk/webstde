import * as esbuild from "esbuild";

esbuild.buildSync({
  platform: "browser",
  globalName: "webSTDE",
  minify: true,
  target: "es2020",
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "build/webstde.min.js",
});
