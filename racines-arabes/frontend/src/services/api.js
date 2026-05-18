// Instance axios centrale : baseURL, injection du JWT, normalisation des erreurs.
import axios from 'axios';

// baseURL depuis l'env Vite, repli sur le proxy '/api'.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Intercepteur de requête : ajoute le Bearer token si présent en localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : sur 401 purge le token + redirige ; erreur normalisée.
api.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err.response?.status;

    // Token expiré/invalide : déconnexion forcée et retour à /login.
    if (status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    // Erreur normalisée : message issu de l'API ou repli réseau.
    const message =
      err.response?.data?.message ||
      err.message ||
      'Erreur réseau, veuillez réessayer.';
    const normalized = new Error(message);
    normalized.status = status;
    normalized.errors = err.response?.data?.errors;
    return Promise.reject(normalized);
  },
);

export default api;
