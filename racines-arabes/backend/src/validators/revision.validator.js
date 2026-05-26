// Schéma Joi des révisions.
import Joi from 'joi';

const objectId = Joi.string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/);

const RATINGS = ['miss', 'hard', 'medium', 'easy'];

/** Ajout d'une révision : root (ObjectId) requis. */
export const createRevisionSchema = Joi.object({
  root: objectId.required().messages({
    'string.empty': "L'identifiant de la racine est requis",
    'string.pattern.base': "L'identifiant de la racine n'est pas valide",
    'any.required': "L'identifiant de la racine est requis",
  }),
});

/**
 * Fin de session : liste d'items { id, rating }.
 * Chaque item correspond à une carte vue dans la session.
 */
export const completeSessionSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: objectId.required(),
        rating: Joi.string().valid(...RATINGS).required(),
      }),
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Au moins une révision doit être marquée comme vue',
      'any.required': 'La liste des révisions vues est requise',
    }),
});
