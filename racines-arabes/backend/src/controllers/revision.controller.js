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

/** POST /api/revisions/session/complete — marque les révisions vues. */
export const completeSession = async (req, res) => {
  const { ids } = req.body;

  await Revision.updateMany(
    { _id: { $in: ids }, user: req.user.id },
    { $set: { lastReviewedAt: new Date() }, $inc: { reviewCount: 1 } },
  );

  return ok(res, { updated: ids.length });
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
