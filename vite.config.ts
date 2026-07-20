import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()]
  
  if (mode === 'development') {
    const devServer = (await import("@hono/vite-dev-server")).default
    const { inspectAttr } = await import("kimi-plugin-inspect")
    plugins.unshift(devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }))
    plugins.unshift(inspectAttr())
  }
  
  return {
    plugins,
    server: { port: 3000 },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@contracts": path.resolve(__dirname, "./contracts"),
        "@db": path.resolve(__dirname, "./db"),
        "db": path.resolve(__dirname, "./db"),
      },
    },
    build: {
      cssMinify: false,
      rollupOptions: {
        output: { inlineDynamicImports: true },
      },
    },
    envDir: path.resolve(__dirname),
  }
});
