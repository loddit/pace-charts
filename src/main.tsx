import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.PROD) {
  const websiteId = import.meta.env.VITE_UMAMI_CLOUD_WEBSITE_ID

  // Function to dynamically insert Umami analytics script
  const insertUmamiScript = () => {
    if (!websiteId) {
      console.error('Missing Umami website ID')
      return
    }
    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://cloud.umami.is/script.js'
    script.setAttribute('data-website-id', websiteId)
    document.head.appendChild(script)
  }

  // Insert the Umami script only in production environment
  insertUmamiScript()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
