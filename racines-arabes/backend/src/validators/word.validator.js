// Schémas Joi des mots dérivés (cf. PROJET.md §6.3, §7.2, §8.3)
import Joi from 'joi';
import { WORD_TYPES, VERB_TENSES } from '../utils/constants.js';

// Règle conditionnelle : tense requis si type === 'VERB', ignoré sinon.
const tenseConditional = Joi.when('type', {
  is: 'VERB',
  then: Joi.string()
    .valid(...VERB_TENSES)
    .required()
    .messages({
      'any.only': `Le temps doit être l'un de : ${VERB_TENSES.join(', ')}`,
      'any.required': 'Le temps est requis pour un verbe',
    }),
  otherwise: Joi.string()
    .valid(...VERB_TENSES)
    .optional()
    .strip(),
});

/** Création d'un mot dérivé. */
export const createWordSchema = Joi.object({
  root: Joi.string().trim().required().messages({
    'string.empty': 'La racine est requise',
    'any.required': 'La racine est requise',
  }),
  arabic: Joi.string().trim().required().messages({
    'string.empty': 'La graphie arabe est requise',
    'any.required': 'La graphie arabe est requise',
  }),
  transliteration: Joi.string().trim().required().messages({
    'string.empty': 'La translittération est requise',
    'any.required': 'La translittération est requise',
  }),
  translationFr: Joi.string().trim().max(300).required().messages({
    'string.empty': 'La traduction française est requise',
    'string.max': 'La traduction française ne peut dépasser 300 caractères',
    'any.required': 'La traduction française est requise',
  }),
  translationEn: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'La traduction anglaise ne peut dépasser 300 caractères',
  }),
  type: Joi.string()
    .valid(...WORD_TYPES)
    .required()
    .messages({
      'any.only': `Le type doit être l'un de : ${WORD_TYPES.join(', ')}`,
      'any.required': 'Le type morphologique est requis',
    }),
  tense: tenseConditional,
  pattern: Joi.string().trim().required().messages({
    'string.empty': 'Le schème est requis',
    'any.required': 'Le schème est requis',
  }),
  example: Joi.string().trim().max(500).allow('').messages({
    'string.max': "L'exemple ne peut dépasser 500 caractères",
  }),
  notes: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Les notes ne peuvent dépasser 500 caractères',
  }),
});

/** Mise à jour d'un mot : tous optionnels, au moins un requis. */
export const updateWordSchema = Joi.object({
  root: Joi.string().trim(),
  arabic: Joi.string().trim(),
  transliteration: Joi.string().trim(),
  translationFr: Joi.string().trim().max(300).messages({
    'string.max': 'La traduction française ne peut dépasser 300 caractères',
  }),
  translationEn: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'La traduction anglaise ne peut dépasser 300 caractères',
  }),
  type: Joi.string()
    .valid(...WORD_TYPES)
    .messages({
      'any.only': `Le type doit être l'un de : ${WORD_TYPES.join(', ')}`,
    }),
  tense: tenseConditional,
  pattern: Joi.string().trim(),
  example: Joi.string().trim().max(500).allow('').messages({
    'string.max': "L'exemple ne peut dépasser 500 caractères",
  }),
  notes: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Les notes ne peuvent dépasser 500 caractères',
  }),
})
  .min(1)
  .messages({ 'object.min': 'Au moins un champ doit être fourni' });

/** Query de recherche avancée des mots (cf. PROJET.md §8.3) — tous optionnels. */
export const wordQuerySchema = Joi.object({
  root: Joi.string().trim(),
  letters: Joi.string().trim(),
  type: Joi.string().valid(...WORD_TYPES),
  tense: Joi.string().valid(...VERB_TENSES),
  q: Joi.string().trim().allow(''),
  sortBy: Joi.string().valid('alpha', 'type', 'date'),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});
