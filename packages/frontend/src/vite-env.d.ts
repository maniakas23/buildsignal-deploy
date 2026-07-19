/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SIGNALCORE_API_URL: string
  readonly VITE_SIGNALCORE_WS_URL: string
  readonly VITE_APP_MODE: string
  readonly VITE_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
