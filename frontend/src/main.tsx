import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { RouterProvider } from 'react-router-dom'
import {store} from "./app/store.ts"
import { Provider } from 'react-redux'
import router from './app/routes.ts'
import { GoogleOAuthProvider } from "@react-oauth/google"


createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="876181300692-64ptv9bde6ovaovqfnj65l5th7s88hgo.apps.googleusercontent.com">
  <StrictMode>
    <Provider store={store}>
   <RouterProvider  router={router}/>
    </Provider>
  </StrictMode>
  </GoogleOAuthProvider>,
)




