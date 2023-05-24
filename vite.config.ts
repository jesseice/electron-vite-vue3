import { rmSync } from "node:fs";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import pkg from "./package.json";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    plugins: [
      vue(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: "electron/main/index.ts",
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ "[startup] Electron App"
              );
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
          },
        },
        {
          entry: "electron/preload/index.ts",
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined, // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
          },
        },
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
      AutoImport({
        dts: "src/auto-imports.d.ts",
        imports: ["vue", "vue-router"],
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        resolvers: [
          TDesignResolver({
            library: "vue-next",
          }),
        ],
      }),
      Components({
        dts: "src/components.d.ts",
        deep: true,
        dirs: ["src/components"],
        extensions: ["vue", "tsx"],
        resolvers: [
          TDesignResolver({
            library: "vue-next",
          }),
        ],
      }),
    ],
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    // server: {
    //   host: '0.0.0.0',
    //   port: 8000,
    //   // open: true,
    //   proxy: {
    //     // 代理
    //     '/api': {
    //       target: 'http://',
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
    clearScreen: false,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // 省略文件后缀
    extensions: [".js", ".ts", ".json", ".jsx", ".tsx"],
    // 声明node变量
    define: {
      "process.env": {},
    },
  };
});
