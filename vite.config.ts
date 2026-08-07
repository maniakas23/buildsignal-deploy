import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const apiUrl = process.env.VITE_API_URL || "http://localhost:8787"

  return {
    plugins: [inspectAttr(), react()],
    server: {
      port: 3000,
      proxy: {
        "/api": { target: apiUrl, changeOrigin: true, secure: false },
        "/health": { target: apiUrl, changeOrigin: true, secure: false },
        "/ready": { target: apiUrl, changeOrigin: true, secure: false },
        "/version": { target: apiUrl, changeOrigin: true, secure: false },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@contracts": path.resolve(__dirname, "./contracts"),
        "@db": path.resolve(__dirname, "./db"),
        "db": path.resolve(__dirname, "./db"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      cssMinify: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('node_modules/@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('node_modules/lodash') || id.includes('node_modules/zod') || id.includes('node_modules/zustand')) {
              return 'vendor-utils';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    envDir: path.resolve(__dirname),
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || ""),
    },
  }
})
