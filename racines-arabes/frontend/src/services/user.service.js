// Service utilisateurs — endpoints d'administration et de profil courant.
// Le backend enveloppe ses réponses sous { success, data: { user } } ; on déballe.
import api from '@/services/api';

// Liste paginée des utilisateurs (admin uniquement).
// params : { page, limit }.
export const getUsers = async (params = {}) => {
  const res = await api.get('/users', { params });
  return res.data;
};

// Détail d'un utilisateur par id (admin uniquement).
export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  const payload = res.data.data;
  return payload?.user ?? payload;
};

// Mise à jour d'un utilisateur par un admin (nom, bio, avatar, langue, role).
export const updateUser = async (id, payload) => {
  const res = await api.patch(`/users/${id}`, payload);
  const data = res.data.data;
  return data?.user ?? data;
};

// Suppression d'un utilisateur (admin uniquement).
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data?.data;
};
