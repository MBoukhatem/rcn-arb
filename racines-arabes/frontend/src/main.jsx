import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from '@/App.jsx';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { AuthProvider } from '@/context/AuthContext.jsx';

import '@/i18n.js';
import '@/styles/index.css';

// Style des toasts — alignement strict noir/blanc, sans border-radius.
const toasterOptions = {
  duration: 4000,
  style: {
    background: '#060606',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    borderRadius: '0',
    fontSize: '0.8125rem',
    padding: '0.875rem 1rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    boxShadow: 'none',
  },
  success: {
    iconTheme: { primary: '#D86C7B', secondary: '#060606' },
  },
  error: {
    iconTheme: { primary: '#D86C7B', secondary: '#060606' },
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
