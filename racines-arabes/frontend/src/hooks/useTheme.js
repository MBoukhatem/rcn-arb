// Hook d'accès au contexte de thème.
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme doit être utilisé à l’intérieur d’un <ThemeProvider>.');
  }
  return ctx;
};

export default useTheme;
