// Contexte d'authentification : utilisateur courant, token, réhydratation au montage.
import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '@/services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  // `loading` reste vrai tant qu'on vérifie un éventuel token persistant.
  const [loading, setLoading] = useState(true);

  // Au montage : réhydrate l'utilisateur si un token existe.
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!stored) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then(({ user: me }) => setUser(me))
      .catch(() => {
        // Token invalide/expiré : logout silencieux.
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Connexion : stocke token + user.
  const login = useCallback(async (credentials) => {
    const { user: me, token: jwt } = await authService.login(credentials);
    localStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(me);
    return me;
  }, []);

  // Inscription : même traitement que la connexion.
  const register = useCallback(async (payload) => {
    const { user: me, token: jwt } = await authService.register(payload);
    localStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(me);
    return me;
  }, []);

  // Déconnexion : purge le token et réinitialise l'état.
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
