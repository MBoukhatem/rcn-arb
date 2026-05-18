// Schéma Joi des favoris (cf. PROJET.md §6.4)
import Joi from 'joi';
import { FAVORITE_ITEM_MODELS } from '../utils/constants.js';

/** Ajout d'un favori : item (ObjectId) + itemModel + note optionnelle. */
export const createFavoriteSchema = Joi.object({
  item: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': "L'identifiant de l'élément est requis",
      'string.pattern.base': "L'identifiant de l'élément n'est pas valide",
      'any.required': "L'identifiant de l'élément est requis",
    }),
  itemModel: Joi.string()
    .valid(...FAVORITE_ITEM_MODELS)
    .required()
    .messages({
      'any.only': `Le type d'élément doit être l'un de : ${FAVORITE_ITEM_MODELS.join(', ')}`,
      'any.required': "Le type d'élément est requis",
    }),
  note: Joi.string().trim().max(280).allow('').messages({
    'string.max': 'La note ne peut dépasser 280 caractères',
  }),
});
