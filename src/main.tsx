import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'
import './index.css'
import { SideBarProvider } from './contexts/SideBarContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import { ConfirmProvider } from './contexts/ConfirmContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <StrictMode> */}
    <SideBarProvider>
      <NotificationProvider>
        <LoadingProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </LoadingProvider>
      </NotificationProvider>
    </SideBarProvider>
    {/* </StrictMode> */}
  </BrowserRouter>

)
