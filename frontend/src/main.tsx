import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { store } from "./app/store.ts"
import { Provider } from 'react-redux'
import router from './app/routes.ts'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './app/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <StrictMode>
        <Provider store={store}>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
        </Provider>
      </StrictMode>
    </GoogleOAuthProvider>
  </ThemeProvider>
)
