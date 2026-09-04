/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_API_URL: string
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string
    readonly VITE_CLIENT_ID: string
    readonly VITE_GROQ_API_KEY: string
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_POLLINATIONS_API_KEY:string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}