import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

export default defineConfig(({ mode }) => {
  const apiUrl = process.env.VITE_API_URL || "http://localhost:8787"

  return {
    plugins: [inspectAttr(), react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        "/health": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        "/ready": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        "/version": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      cssMinify: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
    envDir: path.resolve(__dirname),
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        process.env.VITE_API_URL || ""
      ),
    },
  }
})
