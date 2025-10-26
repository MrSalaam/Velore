/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}