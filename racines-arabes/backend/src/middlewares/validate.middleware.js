// Factory de validation Joi des payloads entrants (cf. PROJET.md §9.5)
import { AppError } from '../utils/AppError.js';

/**
 * Construit un middleware validant req[property] avec un schéma Joi.
 * En cas d'échec → AppError 400 listant les messages d'erreur.
 * En cas de succès → req[property] remplacé par la valeur validée/nettoyée.
 *
 * @param {import('joi').Schema} schema - Schéma Joi à appliquer.
 * @param {'body'|'query'|'params'} [property='body'] - Partie de la requête validée.
 */
export const validate =
  (schema, property = 'body') =>
  (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new AppError(error.details.map((d) => d.message).join('; '), 400);
    }

    req[property] = value;
    next();
  };
