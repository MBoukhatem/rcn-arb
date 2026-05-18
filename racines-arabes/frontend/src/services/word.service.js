// Service des mots (Word).
// Contrat :
//  - getWords renvoie l'objet paginé complet { success, data, total, page, totalPages }.
//  - les autres fonctions (détail/mutation) renvoient le contenu de `data`.
import api from '@/services/api';

// Recherche avancée multi-filtres + pagination.
// params : { root | letters, type, tense, q, sortBy, page, limit }.
export const getWords = async (params = {}) => {
  const res = await api.get('/words', { params });
  return res.data;
};

// Détail d'un mot par id → objet mot.
export const getWord = async (id) => {
  const res = await api.get(`/words/${id}`);
  return res.data.data;
};

// Création d'un mot → mot créé.
export const createWord = async (payload) => {
  const res = await api.post('/words', payload);
  return res.data.data;
};

// Mise à jour d'un mot → mot modifié.
export const updateWord = async (id, payload) => {
  const res = await api.put(`/words/${id}`, payload);
  return res.data.data;
};

// Suppression d'un mot.
export const deleteWord = async (id) => {
  const res = await api.delete(`/words/${id}`);
  return res.data?.data;
};
