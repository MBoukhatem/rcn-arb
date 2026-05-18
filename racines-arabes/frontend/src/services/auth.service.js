// Service d'authentification.
// Contrat : chaque fonction renvoie le contenu de `data` (objet { user, token } ou { user }).
import api from '@/services/api';

// Inscription → { user, token }.
export const register = async ({ name, email, password }) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data.data;
};

// Connexion → { user, token }.
export const login = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data;
};

// Profil courant → { user }.
export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};
