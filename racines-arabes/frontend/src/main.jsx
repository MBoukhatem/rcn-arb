import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from '@/App.jsx';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { AuthProvider } from '@/context/AuthContext.jsx';

import '@/i18n.js';
import '@/styles/index.css';

// Style des toasts — cohérent avec le design system (thème sombre, accent pourpre).
const toasterOptions = {
  duration: 4000,
  style: {
    background: '#26262B',
    color: '#F7F7F8',
    border: '1px solid #3A3A41',
    borderRadius: '0.625rem',
    fontSize: '0.875rem',
    padding: '0.75rem 1rem',
    boxShadow: '0 16px 40px -8px rgba(10, 10, 12, 0.14)',
  },
  success: {
    iconTheme: { primary: '#A78BFA', secondary: '#26262B' },
  },
  error: {
    iconTheme: { primary: '#F87171', secondary: '#26262B' },
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-right" gutter={10} toastOptions={toasterOptions} />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
