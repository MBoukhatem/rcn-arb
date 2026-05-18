// Service des racines (Root).
// Contrat :
//  - getRoots renvoie l'objet paginé complet { success, data, total, page, totalPages }.
//  - les autres fonctions (détail/mutation) renvoient le contenu de `data`.
import api from '@/services/api';

// Liste paginée + recherche. params : { page, limit, q }.
export const getRoots = async (params = {}) => {
  const res = await api.get('/roots', { params });
  return res.data;
};

// Détail d'une racine par slug → objet racine.
export const getRoot = async (slug) => {
  const res = await api.get(`/roots/${slug}`);
  return res.data.data;
};

// Mots d'une racine. params : { type, group }.
export const getRootWords = async (slug, params = {}) => {
  const res = await api.get(`/roots/${slug}/words`, { params });
  return res.data.data;
};

// Création d'une racine → racine créée.
export const createRoot = async (payload) => {
  const res = await api.post('/roots', payload);
  return res.data.data;
};

// Mise à jour d'une racine → racine modifiée.
export const updateRoot = async (slug, payload) => {
  const res = await api.put(`/roots/${slug}`, payload);
  return res.data.data;
};

// Suppression d'une racine.
export const deleteRoot = async (slug) => {
  const res = await api.delete(`/roots/${slug}`);
  return res.data?.data;
};
