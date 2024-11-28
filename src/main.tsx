import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'
import './index.css'
import { SideBarProvider } from './contexts/SideBarContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <SideBarProvider>
        <App />
      </SideBarProvider>
    </StrictMode>
  </BrowserRouter>

)
