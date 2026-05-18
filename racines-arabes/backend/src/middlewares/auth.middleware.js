// Middleware d'authentification JWT (cf. PROJET.md §9.3)
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

// Extrait le token du header "Authorization: Bearer <token>".
const extractToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
};

/**
 * Protège une route : exige un JWT valide.
 * En cas de succès → req.user = { id, role } ; sinon → AppError 401.
 */
export const protect = (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError('Non autorisé, token manquant ou invalide', 401);
  }

  // jwt.verify lève JsonWebTokenError/TokenExpiredError, gérées par errorHandler.
  const payload = jwt.verify(token, env.JWT_SECRET);
  req.user = { id: payload.id, role: payload.role };
  next();
};

/**
 * Authentification optionnelle : enrichit req.user si un token valide est fourni,
 * sans jamais bloquer la requête (utile pour les routes publiques enrichies).
 */
export const optionalAuth = (req, _res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };
    } catch {
      // Token invalide/expiré : on ignore silencieusement, req.user reste undefined.
    }
  }
  next();
};
