// Service des racines (Root).
// Contrat :
//  - getRoots renvoie l'objet paginé complet { success, data, total, page, totalPages }.
//  - les autres fonctions (détail/mutation) renvoient le contenu de `data`.
import api from '@/services/api';
import { WORD_TYPES, TYPE_META } from '@/utils/morphology';

// Liste paginée + recherche. params : { page, limit, q }.
export const getRoots = async (params = {}) => {
  const res = await api.get('/roots', { params });
  return res.data;
};

// Détail d'une racine par slug → objet racine.
// Backend renvoie { data: { root: {...} } } : on déballe le wrapper.
export const getRoot = async (slug) => {
  const res = await api.get(`/roots/${slug}`);
  return res.data.data?.root ?? res.data.data;
};

// Mots d'une racine. params : { type, group }.
// Avec group=true, le backend renvoie { root, words: { VERB: [...], MASDAR: [...], ... } }.
// On normalise en [{ type, meta, words: [...] }] consommé par WordList.
export const getRootWords = async (slug, params = {}) => {
  const res = await api.get(`/roots/${slug}/words`, { params });
  const payload = res.data.data;

  if (params.group) {
    const grouped = payload?.words ?? {};
    return WORD_TYPES.map((type) => ({
      type,
      meta: TYPE_META[type],
      words: Array.isArray(grouped[type]) ? grouped[type] : [],
    })).filter((g) => g.words.length > 0);
  }

  return payload?.words ?? payload;
};

// Suggestions de lettres compatibles avec une sélection partielle.
// letters : tableau de 3 entrées (chaîne vide ou lettre arabe).
// Retourne { 0?: ['ك',...], 1?: [...], 2?: [...] } — uniquement pour les slots vides.
export const getLetterSuggestions = async (letters = ['', '', '']) => {
  const params = {};
  letters.forEach((l, i) => {
    if (l) params[`l${i}`] = l;
  });
  const res = await api.get('/roots/suggestions', { params });
  return res.data?.data?.suggestions ?? {};
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
