// import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {ApolloProvider} from '@apollo/client'
import {client} from './services/graphql/client'
import './index.css'
import App from './App.tsx'
import AlertProvider from './provider/AlertProvider.tsx'
import { TranslationProvider } from './contexts/TranslationContext.tsx'

const basePath = import.meta.env.PROD ? '' : import.meta.env.VITE_APP_PATHNAME || ''

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ApolloProvider client={client}>
      <AlertProvider>
        <TranslationProvider>
          <BrowserRouter basename={basePath ? `/${basePath}` : ''}>
            <App />
          </BrowserRouter>
        </TranslationProvider>
      </AlertProvider>
    </ApolloProvider>
  // </StrictMode>
)