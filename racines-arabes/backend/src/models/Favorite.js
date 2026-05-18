import mongoose from 'mongoose';
import { FAVORITE_ITEM_MODELS } from '../utils/constants.js';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'utilisateur du favori est obligatoire."],
      index: true,
    },
    // Référence polymorphe résolue dynamiquement via itemModel
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "L'élément mis en favori est obligatoire."],
      refPath: 'itemModel',
    },
    itemModel: {
      type: String,
      required: [true, "Le type de l'élément favori est obligatoire."],
      enum: {
        values: FAVORITE_ITEM_MODELS,
        message: "Le type d'élément « {VALUE} » n'est pas valide.",
      },
    },
    note: {
      type: String,
      maxlength: [280, 'La note ne peut pas dépasser 280 caractères.'],
    },
  },
  { timestamps: true }
);

// Un même élément ne peut être mis en favori qu'une fois par utilisateur
favoriteSchema.index({ user: 1, item: 1, itemModel: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
