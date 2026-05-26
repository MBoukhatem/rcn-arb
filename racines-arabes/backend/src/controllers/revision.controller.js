// Contrôleur des révisions — scopé à l'utilisateur courant.
// Une révision pointe vers une racine ; la session de révision présente ces
// racines sous forme de cartes recto/verso côté frontend.
import Root from '../models/Root.js';
import Revision from '../models/Revision.js';
import { AppError } from '../utils/AppError.js';
import { created, noContent, ok, paginated } from '../utils/apiResponse.js';

/** GET /api/revisions — liste paginée des révisions de l'utilisateur. */
export const listRevisions = async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const filter = { user: req.user.id };

  const [data, total] = await Promise.all([
    Revision.find(filter)
      .sort({ lastReviewedAt: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'root',
        select: 'slug letters meaningFr meaningEn meaningAr transliteration',
      }),
    Revision.countDocuments(filter),
  ]);

  return paginated(res, { data, total, page, limit });
};

/** GET /api/revisions/session — toutes les cartes pour démarrer une session. */
export const getSession = async (req, res) => {
  const revisions = await Revision.find({ user: req.user.id })
    .sort({ lastReviewedAt: 1, createdAt: -1 })
    .populate({
      path: 'root',
      select: 'slug letters meaningFr meaningEn meaningAr transliteration',
    });

  // Mélange (Fisher-Yates) pour varier l'ordre des cartes à chaque session.
  const cards = revisions
    .filter((r) => r.root) // racine supprimée → on ignore
    .map((r) => ({
      _id: r._id,
      root: r.root,
      reviewCount: r.reviewCount,
      lastReviewedAt: r.lastReviewedAt,
    }));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return ok(res, { cards });
};

/** POST /api/revisions — ajout d'une racine à la liste de révision. */
export const addRevision = async (req, res) => {
  const { root } = req.body;

  const target = await Root.findById(root);
  if (!target) {
    throw new AppError('Racine introuvable', 404);
  }

  const exists = await Revision.findOne({ user: req.user.id, root });
  if (exists) {
    throw new AppError('Cette racine est déjà dans vos révisions', 409);
  }

  const revision = await Revision.create({ user: req.user.id, root });
  return created(res, { revision });
};

/** POST /api/revisions/session/complete — applique les ratings de la session.
 *  Reçoit items: [{ id, rating }] où rating ∈ miss|hard|medium|easy.
 *  Pour chaque item : incrémente le compteur de rating correspondant et
 *  reviewCount, met à jour lastReviewedAt + lastRating. */
export const completeSession = async (req, res) => {
  const { items } = req.body;
  const now = new Date();

  // Une bulkWrite par item — chaque carte a son propre rating, donc on ne peut
  // pas mutualiser l'update sur tout le batch.
  const ops = items.map(({ id, rating }) => ({
    updateOne: {
      filter: { _id: id, user: req.user.id },
      update: {
        $set: { lastReviewedAt: now, lastRating: rating },
        $inc: { reviewCount: 1, [`ratings.${rating}`]: 1 },
      },
    },
  }));

  const result = await Revision.bulkWrite(ops);
  return ok(res, { updated: result.modifiedCount });
};

// Pondération des ratings — sert au calcul du score sur 100.
const RATING_WEIGHTS = { miss: 0, hard: 1, medium: 2, easy: 3 };
const MAX_WEIGHT = 3;

const computeScore = (ratings = {}) => {
  const total =
    (ratings.miss ?? 0) +
    (ratings.hard ?? 0) +
    (ratings.medium ?? 0) +
    (ratings.easy ?? 0);
  if (total === 0) return null;
  const weighted =
    (ratings.miss ?? 0) * RATING_WEIGHTS.miss +
    (ratings.hard ?? 0) * RATING_WEIGHTS.hard +
    (ratings.medium ?? 0) * RATING_WEIGHTS.medium +
    (ratings.easy ?? 0) * RATING_WEIGHTS.easy;
  return Math.round((weighted / (total * MAX_WEIGHT)) * 100);
};

/** GET /api/revisions/stats — stats agrégées de l'utilisateur.
 *  Renvoie : totaux par catégorie, score global, score par racine. */
export const getStats = async (req, res) => {
  const revisions = await Revision.find({ user: req.user.id }).populate({
    path: 'root',
    select: 'slug letters meaningFr transliteration',
  });

  const totals = { miss: 0, hard: 0, medium: 0, easy: 0 };
  const perRoot = [];

  for (const rev of revisions) {
    const r = rev.ratings ?? {};
    totals.miss += r.miss ?? 0;
    totals.hard += r.hard ?? 0;
    totals.medium += r.medium ?? 0;
    totals.easy += r.easy ?? 0;

    perRoot.push({
      _id: rev._id,
      root: rev.root,
      reviewCount: rev.reviewCount,
      lastReviewedAt: rev.lastReviewedAt,
      lastRating: rev.lastRating,
      ratings: {
        miss: r.miss ?? 0,
        hard: r.hard ?? 0,
        medium: r.medium ?? 0,
        easy: r.easy ?? 0,
      },
      score: computeScore(r),
    });
  }

  const totalReviews =
    totals.miss + totals.hard + totals.medium + totals.easy;
  const globalScore = computeScore(totals);

  return ok(res, {
    totals,
    totalReviews,
    totalRoots: revisions.length,
    globalScore,
    perRoot,
  });
};

/** DELETE /api/revisions/:id — retrait d'une révision de l'utilisateur. */
export const removeRevision = async (req, res) => {
  const revision = await Revision.findById(req.params.id);
  if (!revision) {
    throw new AppError('Révision introuvable', 404);
  }

  if (revision.user.toString() !== req.user.id) {
    throw new AppError('Action non autorisée sur cette révision', 403);
  }

  await revision.deleteOne();
  return noContent(res);
};
