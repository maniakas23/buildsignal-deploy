import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/themes'
import './index.css'
const __BUILD_TIMESTAMP = Date.now();
import { TRPCProvider } from "@/providers/trpc"
import AccessibilityInit from "@/components/AccessibilityInit"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <TRPCProvider>
            <AccessibilityInit />
            <App />
          </TRPCProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
// deploy stamp 1784245357
