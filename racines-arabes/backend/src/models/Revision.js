import mongoose from 'mongoose';

// Une revision lie un utilisateur à une racine qu'il souhaite réviser.
// Modèle volontairement simple : pas de SRS complexe ; on garde un timestamp
// du dernier passage pour pouvoir afficher l'ordre et, plus tard, prioriser.
const revisionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'utilisateur de la révision est obligatoire."],
      index: true,
    },
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Root',
      required: [true, 'La racine à réviser est obligatoire.'],
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Unicité : une racine donnée n'apparaît qu'une fois dans la liste de révision d'un user.
revisionSchema.index({ user: 1, root: 1 }, { unique: true });

export default mongoose.model('Revision', revisionSchema);
