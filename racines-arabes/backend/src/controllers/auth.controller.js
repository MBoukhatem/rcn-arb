// Contrôleur d'authentification — register / login / me (cf. PROJET.md §9)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { ok, created } from '../utils/apiResponse.js';

// Signe un JWT contenant l'identifiant et le rôle de l'utilisateur.
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

/** POST /api/auth/register — création de compte + JWT. */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Le hook pre('save') du modèle hache le mot de passe avec bcrypt.
  const user = await User.create({ name, email, password });
  const token = signToken(user);

  return created(res, { user, token });
};

/** POST /api/auth/login — vérifie les identifiants et renvoie un JWT. */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Le mot de passe est select:false : on le réintègre explicitement.
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Identifiants invalides', 401);
  }

  const token = signToken(user);
  return ok(res, { user, token });
};

/** GET /api/auth/me — profil de l'utilisateur courant. */
export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  return ok(res, { user });
};
