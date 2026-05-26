// Schéma Joi des révisions.
import Joi from 'joi';

const objectId = Joi.string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/);

/** Ajout d'une révision : root (ObjectId) requis. */
export const createRevisionSchema = Joi.object({
  root: objectId.required().messages({
    'string.empty': "L'identifiant de la racine est requis",
    'string.pattern.base': "L'identifiant de la racine n'est pas valide",
    'any.required': "L'identifiant de la racine est requis",
  }),
});

/** Marquage d'une session terminée : ids des révisions vues. */
export const completeSessionSchema = Joi.object({
  ids: Joi.array().items(objectId).min(1).required().messages({
    'array.min': 'Au moins une révision doit être marquée comme vue',
    'any.required': 'La liste des révisions vues est requise',
  }),
});
