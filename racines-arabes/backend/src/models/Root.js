import mongoose from 'mongoose';
import { normalizeArabic, buildSlug } from '../utils/arabic.js';

// Validateur : exactement 3 lettres, chacune non vide
const validateLetters = (letters) =>
  Array.isArray(letters) &&
  letters.length === 3 &&
  letters.every((l) => typeof l === 'string' && l.trim().length > 0);

const rootSchema = new mongoose.Schema(
  {
    letters: {
      type: [String],
      required: [true, 'Les lettres de la racine sont obligatoires.'],
      validate: {
        validator: validateLetters,
        message:
          'Une racine trilitère doit comporter exactement 3 lettres non vides.',
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    meaningFr: {
      type: String,
      required: [true, 'Le sens en français est obligatoire.'],
      trim: true,
      maxlength: [300, 'Le sens en français ne peut pas dépasser 300 caractères.'],
    },
    meaningEn: {
      type: String,
      trim: true,
      maxlength: [300, 'Le sens en anglais ne peut pas dépasser 300 caractères.'],
    },
    meaningAr: {
      type: String,
      trim: true,
    },
    transliteration: {
      type: String,
      trim: true,
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

// Génère systématiquement le slug à partir des lettres normalisées.
// La translittération est saisie manuellement : elle n'est jamais inventée.
rootSchema.pre('validate', function generateSlug(next) {
  if (Array.isArray(this.letters) && this.letters.length > 0) {
    this.slug = buildSlug(this.letters.map(normalizeArabic));
  }
  return next();
});

// Liste inverse des mots dérivés de la racine
rootSchema.virtual('words', {
  ref: 'Word',
  localField: '_id',
  foreignField: 'root',
});

// Décompte des mots dérivés (calculé à la demande, jamais stocké — D8)
rootSchema.virtual('wordsCount', {
  ref: 'Word',
  localField: '_id',
  foreignField: 'root',
  count: true,
});

// Index texte pour la recherche sur les sens et la translittération
rootSchema.index({ meaningFr: 'text', meaningEn: 'text', transliteration: 'text' });

export default mongoose.model('Root', rootSchema);
