// Middleware d'erreur global UNIQUE de l'application (cf. PROJET.md §8.5)
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Catch-all 404 : toute route API inconnue produit une AppError 404.
 */
export const notFound = (req, _res, next) => {
  next(new AppError(`Route API introuvable: ${req.originalUrl}`, 404));
};

/**
 * Middleware d'erreur Express (4 arguments).
 * Normalise toute erreur en réponse { success:false, message, errors? }.
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';
  let errors;

  // Erreur de validation Mongoose → 400 + liste des messages de champs.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données invalides';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Doublon Mongoose (index unique) → 409 avec le champ en conflit.
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'champ';
    message = `Valeur déjà existante pour le champ « ${field} »`;
  }

  // Identifiant Mongoose mal formé → 400.
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Identifiant invalide pour « ${err.path} »`;
  }

  // Erreurs JWT → 401.
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
  }

  const body = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };

  // Hors production : inclure la stack pour faciliter le débogage.
  if (env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};
