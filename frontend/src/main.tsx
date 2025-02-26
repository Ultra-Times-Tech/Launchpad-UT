import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const basePath = import.meta.env.PROD ? '' : (import.meta.env.VITE_APP_PATHNAME || '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basePath ? `/${basePath}` : ''}>
      <App />
    </BrowserRouter>
  </StrictMode>
)