import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML ships the pre-rendered hero (scripts/prerender.mjs): hydrate
// it so it isn't rebuilt (and its entrance animation doesn't replay).
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
