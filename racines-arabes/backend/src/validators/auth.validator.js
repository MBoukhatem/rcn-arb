// Schémas Joi d'authentification (cf. PROJET.md §9.1, §9.2)
import Joi from 'joi';

/** Inscription : name, email, password. */
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required().messages({
    'string.empty': 'Le nom est requis',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut dépasser 60 caractères',
    'any.required': 'Le nom est requis',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': "L'adresse e-mail est requise",
    'string.email': "L'adresse e-mail n'est pas valide",
    'any.required': "L'adresse e-mail est requise",
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Le mot de passe est requis',
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'any.required': 'Le mot de passe est requis',
  }),
});

/** Connexion : email, password. */
export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': "L'adresse e-mail est requise",
    'string.email': "L'adresse e-mail n'est pas valide",
    'any.required': "L'adresse e-mail est requise",
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe est requis',
    'any.required': 'Le mot de passe est requis',
  }),
});
