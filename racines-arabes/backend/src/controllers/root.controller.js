// Contrôleur des racines trilitères — CRUD + mots dérivés (cf. PROJET.md §8.1)
import Root from '../models/Root.js';
import Word from '../models/Word.js';
import Favorite from '../models/Favorite.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, noContent, paginated } from '../utils/apiResponse.js';
import { normalizeArabic } from '../utils/arabic.js';

// Échappe les métacaractères regex d'une saisie utilisateur.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Contrôle d'ownership : admin OU créateur de la ressource.
const assertOwnership = (resource, user) => {
  const isOwner = resource.createdBy && resource.createdBy.toString() === user.id;
  if (user.role !== 'admin' && !isOwner) {
    throw new AppError('Action non autorisée sur cette ressource', 403);
  }
};

/** GET /api/roots — liste paginée avec recherche optionnelle ?q=. */
export const listRoots = async (req, res) => {
  const { page, limit, skip } = req.pagination;

  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), 'i');
    filter.$or = [
      { slug: rx },
      { meaningFr: rx },
      { meaningEn: rx },
      { transliteration: rx },
    ];
  }

  const [data, total] = await Promise.all([
    Root.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Root.countDocuments(filter),
  ]);

  return paginated(res, { data, total, page, limit });
};

/** GET /api/roots/:slug — détail d'une racine + mots dérivés. */
export const getRoot = async (req, res) => {
  const root = await Root.findOne({ slug: req.params.slug })
    .populate({ path: 'words' })
    .populate({ path: 'wordsCount' });

  if (!root) {
    throw new AppError('Racine introuvable', 404);
  }

  return ok(res, { root });
};

/** GET /api/roots/:slug/words — mots d'une racine, groupables par type. */
export const getRootWords = async (req, res) => {
  const root = await Root.findOne({ slug: req.params.slug });
  if (!root) {
    throw new AppError('Racine introuvable', 404);
  }

  const filter = { root: root._id };
  if (req.query.type) {
    filter.type = req.query.type;
  }

  const words = await Word.find(filter).sort({ type: 1, arabicNormalized: 1 });

  // ?group=true : renvoie les mots regroupés par type morphologique.
  if (req.query.group === 'true') {
    const grouped = words.reduce((acc, word) => {
      (acc[word.type] ??= []).push(word);
      return acc;
    }, {});
    return ok(res, { root, words: grouped });
  }

  return ok(res, { root, words });
};

/** POST /api/roots — création d'une racine. */
export const createRoot = async (req, res) => {
  const letters = req.body.letters.map(normalizeArabic);
  const slug = letters.join('-');

  // Vérifie le doublon de slug en amont pour renvoyer un 409 explicite.
  const exists = await Root.findOne({ slug });
  if (exists) {
    throw new AppError('Une racine avec ces lettres existe déjà', 409);
  }

  const root = await Root.create({
    ...req.body,
    letters,
    createdBy: req.user.id,
  });

  return created(res, { root });
};

/** PUT /api/roots/:slug — modification d'une racine (ownership). */
export const updateRoot = async (req, res) => {
  const root = await Root.findOne({ slug: req.params.slug });
  if (!root) {
    throw new AppError('Racine introuvable', 404);
  }

  assertOwnership(root, req.user);

  if (req.body.letters) {
    root.letters = req.body.letters.map(normalizeArabic);
  }
  for (const field of ['meaningFr', 'meaningEn', 'meaningAr', 'transliteration']) {
    if (req.body[field] !== undefined) {
      root[field] = req.body[field];
    }
  }

  // Le hook pre('validate') régénère le slug si les lettres ont changé.
  await root.save();

  return ok(res, { root });
};

/** DELETE /api/roots/:slug — suppression d'une racine + mots et favoris liés. */
export const deleteRoot = async (req, res) => {
  const root = await Root.findOne({ slug: req.params.slug });
  if (!root) {
    throw new AppError('Racine introuvable', 404);
  }

  assertOwnership(root, req.user);

  // Récupère les mots liés pour purger aussi leurs favoris.
  const words = await Word.find({ root: root._id }).select('_id');
  const wordIds = words.map((w) => w._id);

  await Promise.all([
    Word.deleteMany({ root: root._id }),
    Favorite.deleteMany({
      $or: [
        { item: root._id, itemModel: 'Root' },
        { item: { $in: wordIds }, itemModel: 'Word' },
      ],
    }),
    root.deleteOne(),
  ]);

  return noContent(res);
};
