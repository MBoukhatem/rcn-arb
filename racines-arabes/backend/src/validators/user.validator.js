// Schémas Joi du profil utilisateur (cf. PROJET.md §6.1)
import Joi from 'joi';
import { NATIVE_LANGUAGES, USER_ROLES } from '../utils/constants.js';

/** Mise à jour du profil : tous les champs optionnels, au moins un requis. */
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).messages({
    'string.empty': 'Le nom ne peut être vide',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut dépasser 60 caractères',
  }),
  bio: Joi.string().trim().max(280).allow('').messages({
    'string.max': 'La bio ne peut dépasser 280 caractères',
  }),
  avatarUrl: Joi.string().trim().uri().allow('').messages({
    'string.uri': "L'URL de l'avatar n'est pas valide",
  }),
  nativeLanguage: Joi.string()
    .valid(...NATIVE_LANGUAGES)
    .messages({
      'any.only': `La langue maternelle doit être l'une de : ${NATIVE_LANGUAGES.join(', ')}`,
    }),
})
  .min(1)
  .messages({ 'object.min': 'Au moins un champ doit être fourni' });

/** Mise à jour d'un utilisateur par un admin :
 *  mêmes champs que `updateProfileSchema`, plus le `role`. */
export const adminUpdateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).messages({
    'string.empty': 'Le nom ne peut être vide',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut dépasser 60 caractères',
  }),
  bio: Joi.string().trim().max(280).allow('').messages({
    'string.max': 'La bio ne peut dépasser 280 caractères',
  }),
  avatarUrl: Joi.string().trim().uri().allow('').messages({
    'string.uri': "L'URL de l'avatar n'est pas valide",
  }),
  nativeLanguage: Joi.string()
    .valid(...NATIVE_LANGUAGES)
    .messages({
      'any.only': `La langue maternelle doit être l'une de : ${NATIVE_LANGUAGES.join(', ')}`,
    }),
  role: Joi.string()
    .valid(...USER_ROLES)
    .messages({
      'any.only': `Le rôle doit être l'un de : ${USER_ROLES.join(', ')}`,
    }),
})
  .min(1)
  .messages({ 'object.min': 'Au moins un champ doit être fourni' });

/** Changement de mot de passe : ancien + nouveau (min 8). */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Le mot de passe actuel est requis',
    'any.required': 'Le mot de passe actuel est requis',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'Le nouveau mot de passe est requis',
    'string.min': 'Le nouveau mot de passe doit contenir au moins 8 caractères',
    'any.required': 'Le nouveau mot de passe est requis',
  }),
});
