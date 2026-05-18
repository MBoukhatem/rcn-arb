import mongoose from 'mongoose';
import { WORD_TYPES, VERB_TENSES } from '../utils/constants.js';
import { normalizeArabic } from '../utils/arabic.js';

const wordSchema = new mongoose.Schema(
  {
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Root',
      required: [true, 'La racine du mot est obligatoire.'],
      index: true,
    },
    arabic: {
      type: String,
      required: [true, 'La graphie arabe est obligatoire.'],
      trim: true,
    },
    arabicNormalized: {
      type: String,
      index: true,
    },
    transliteration: {
      type: String,
      required: [true, 'La translittération est obligatoire.'],
      trim: true,
    },
    translationFr: {
      type: String,
      required: [true, 'La traduction française est obligatoire.'],
      trim: true,
      maxlength: [300, 'La traduction française ne peut pas dépasser 300 caractères.'],
    },
    translationEn: {
      type: String,
      trim: true,
      maxlength: [300, 'La traduction anglaise ne peut pas dépasser 300 caractères.'],
    },
    type: {
      type: String,
      required: [true, 'Le type morphologique est obligatoire.'],
      enum: {
        values: WORD_TYPES,
        message: "Le type « {VALUE} » n'est pas un type morphologique valide.",
      },
    },
    tense: {
      type: String,
      enum: {
        values: VERB_TENSES,
        message: "Le temps « {VALUE} » n'est pas un temps verbal valide.",
      },
      // Le temps n'est requis que pour les verbes
      required: [
        function requiredForVerb() {
          return this.type === 'VERB';
        },
        'Le temps verbal est obligatoire pour un mot de type VERB.',
      ],
      // Cohérence inverse : aucun temps autorisé hors des verbes
      validate: {
        validator: function tenseOnlyForVerb(value) {
          return this.type === 'VERB' || value == null;
        },
        message: 'Le temps verbal ne peut être renseigné que pour un mot de type VERB.',
      },
    },
    pattern: {
      type: String,
      required: [true, 'Le schème (وَزْن) est obligatoire.'],
      trim: true,
    },
    example: {
      type: String,
      maxlength: [500, "La phrase d'exemple ne peut pas dépasser 500 caractères."],
    },
    notes: {
      type: String,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères.'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calcule la graphie normalisée (sans diacritiques) pour la recherche
wordSchema.pre('validate', function normalizeArabicField(next) {
  if (typeof this.arabic === 'string') {
    this.arabicNormalized = normalizeArabic(this.arabic);
  }
  return next();
});

// Accélère le regroupement des mots par type au sein d'une racine
wordSchema.index({ root: 1, type: 1 });

// Empêche un doublon de mot (même graphie) pour une même racine
wordSchema.index({ root: 1, arabic: 1 }, { unique: true });

export default mongoose.model('Word', wordSchema);
