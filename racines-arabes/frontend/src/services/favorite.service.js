// Service des favoris (Favorite).
// Contrat :
//  - getFavorites renvoie l'objet paginé complet { success, data, total, page, totalPages }.
//  - les fonctions de mutation renvoient le contenu de `data`.
import api from '@/services/api';

// Liste paginée des favoris de l'utilisateur. params : { page, limit }.
export const getFavorites = async (params = {}) => {
  const res = await api.get('/favorites', { params });
  return res.data;
};

// Ajout d'un favori → favori créé. payload : { item, itemModel, note }.
export const addFavorite = async ({ item, itemModel, note }) => {
  const res = await api.post('/favorites', { item, itemModel, note });
  return res.data.data;
};

// Retrait d'un favori par id.
export const removeFavorite = async (id) => {
  const res = await api.delete(`/favorites/${id}`);
  return res.data?.data;
};
