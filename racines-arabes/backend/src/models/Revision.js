import mongoose from 'mongoose';

// Une revision lie un utilisateur à une racine qu'il souhaite réviser.
// Les compteurs `ratings.*` cumulent les jugements de mémorisation de
// l'utilisateur sur cette racine — ils ne sont incrémentés qu'à la fin d'une
// session via /revisions/session/complete. Si la racine est retirée de la
// liste de révision, le document est supprimé : les stats s'auto-nettoient.
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
    // Dernier rating attribué — utilisé pour afficher l'état courant.
    lastRating: {
      type: String,
      enum: ['miss', 'hard', 'medium', 'easy'],
      default: null,
    },
    // Compteurs cumulés par catégorie de rating.
    ratings: {
      miss: { type: Number, default: 0, min: 0 },
      hard: { type: Number, default: 0, min: 0 },
      medium: { type: Number, default: 0, min: 0 },
      easy: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);

// Unicité : une racine donnée n'apparaît qu'une fois dans la liste de révision d'un user.
revisionSchema.index({ user: 1, root: 1 }, { unique: true });

export default mongoose.model('Revision', revisionSchema);
