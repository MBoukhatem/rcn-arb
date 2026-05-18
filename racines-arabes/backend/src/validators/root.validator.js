// Schémas Joi des racines trilitères (cf. PROJET.md §6.2)
import Joi from 'joi';

// Tableau d'exactement 3 lettres arabes non vides.
const lettersSchema = Joi.array()
  .items(Joi.string().trim().min(1).required())
  .length(3)
  .messages({
    'array.base': 'Les lettres doivent former un tableau',
    'array.length': 'Une racine doit comporter exactement 3 lettres',
    'string.empty': 'Chaque lettre doit être non vide',
  });

/** Création d'une racine : letters + meaningFr requis. */
export const createRootSchema = Joi.object({
  letters: lettersSchema.required().messages({
    'any.required': 'Les 3 lettres de la racine sont requises',
  }),
  meaningFr: Joi.string().trim().max(300).required().messages({
    'string.empty': 'Le sens en français est requis',
    'string.max': 'Le sens en français ne peut dépasser 300 caractères',
    'any.required': 'Le sens en français est requis',
  }),
  meaningEn: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'Le sens en anglais ne peut dépasser 300 caractères',
  }),
  meaningAr: Joi.string().trim().allow(''),
  transliteration: Joi.string().trim().allow(''),
});

/** Mise à jour d'une racine : tous optionnels, au moins un requis. */
export const updateRootSchema = Joi.object({
  letters: lettersSchema,
  meaningFr: Joi.string().trim().max(300).messages({
    'string.empty': 'Le sens en français ne peut être vide',
    'string.max': 'Le sens en français ne peut dépasser 300 caractères',
  }),
  meaningEn: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'Le sens en anglais ne peut dépasser 300 caractères',
  }),
  meaningAr: Joi.string().trim().allow(''),
  transliteration: Joi.string().trim().allow(''),
})
  .min(1)
  .messages({ 'object.min': 'Au moins un champ doit être fourni' });
