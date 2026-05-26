// Service des révisions (Revision).
// Contrat :
//  - getRevisions renvoie l'objet paginé complet { success, data, total, page, totalPages }.
//  - getRevisionSession renvoie { cards } prêtes à présenter.
//  - les mutations renvoient le contenu de `data`.
import api from '@/services/api';

// Liste paginée des révisions de l'utilisateur. params : { page, limit }.
export const getRevisions = async (params = {}) => {
  const res = await api.get('/revisions', { params });
  return res.data;
};

// Toutes les cartes pour démarrer une session (déjà mélangées côté serveur).
export const getRevisionSession = async () => {
  const res = await api.get('/revisions/session');
  return res.data?.data?.cards ?? [];
};

// Ajout d'une racine aux révisions. Le backend répond { data: { revision } }.
export const addRevision = async ({ root }) => {
  const res = await api.post('/revisions', { root });
  const payload = res.data.data;
  return payload?.revision ?? payload;
};

// Marque une session comme terminée — items: [{ id, rating }] avec
// rating ∈ 'miss' | 'hard' | 'medium' | 'easy'. Incrémente les compteurs
// ratings.<rating> et reviewCount, met à jour lastReviewedAt + lastRating.
export const completeRevisionSession = async (items) => {
  const res = await api.post('/revisions/session/complete', { items });
  return res.data?.data;
};

// Stats agrégées de l'utilisateur courant.
export const getRevisionStats = async () => {
  const res = await api.get('/revisions/stats');
  return res.data?.data;
};

// Retrait d'une révision par id.
export const removeRevision = async (id) => {
  const res = await api.delete(`/revisions/${id}`);
  return res.data?.data;
};
