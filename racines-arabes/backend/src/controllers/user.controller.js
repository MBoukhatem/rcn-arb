// Contrôleur utilisateur — profil, mot de passe, suppression (cf. PROJET.md §8.1)
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { ok, noContent, paginated } from '../utils/apiResponse.js';

// Champs du profil qu'un utilisateur est autorisé à modifier.
const PROFILE_FIELDS = ['name', 'bio', 'avatarUrl', 'nativeLanguage'];

/** PATCH /api/users/me — mise à jour des champs autorisés du profil. */
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  for (const field of PROFILE_FIELDS) {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  }
  await user.save();

  return ok(res, { user });
};

/** PATCH /api/users/me/password — changement de mot de passe. */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Mot de passe actuel incorrect', 401);
  }

  // Le hook pre('save') re-hache automatiquement le nouveau mot de passe.
  user.password = newPassword;
  await user.save();

  return ok(res, { message: 'Mot de passe mis à jour' });
};

/** DELETE /api/users/me — suppression du compte courant. */
export const deleteAccount = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  return noContent(res);
};

/** GET /api/users — liste des utilisateurs (admin uniquement). */
export const listUsers = async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Accès réservé aux administrateurs', 403);
  }

  const { page, limit, skip } = req.pagination;
  const [data, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return paginated(res, { data, total, page, limit });
};

/** DELETE /api/users/:id — suppression d'un utilisateur (admin uniquement). */
export const deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Accès réservé aux administrateurs', 403);
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  return noContent(res);
};
