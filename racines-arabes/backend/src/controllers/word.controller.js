// Contrôleur des mots dérivés — CRUD + recherche avancée (cf. PROJET.md §8.3)
import mongoose from 'mongoose';
import Root from '../models/Root.js';
import Word from '../models/Word.js';
import Favorite from '../models/Favorite.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, noContent, paginated } from '../utils/apiResponse.js';
import { normalizeArabic, buildSlug } from '../utils/arabic.js';

// Échappe les métacaractères regex d'une saisie utilisateur.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Contrôle d'ownership : admin OU créateur de la ressource.
const assertOwnership = (resource, user) => {
  const isOwner = resource.createdBy && resource.createdBy.toString() === user.id;
  if (user.role !== 'admin' && !isOwner) {
    throw new AppError('Action non autorisée sur cette ressource', 403);
  }
};

// Tris disponibles pour la recherche avancée.
const SORT_MAP = {
  alpha: { arabicNormalized: 1 },
  type: { type: 1, arabicNormalized: 1 },
  date: { createdAt: -1 },
};

/**
 * Résout une racine vers son ObjectId.
 * Accepte un ObjectId, un slug, ou une suite de lettres normalisable en slug.
 */
const resolveRoot = async (value) => {
  if (mongoose.isValidObjectId(value)) {
    return Root.findById(value);
  }
  // Slug direct ou lettres jointes/séparées → on tente le slug normalisé.
  const slug = value.includes('-')
    ? buildSlug(value.split('-'))
    : buildSlug([...normalizeArabic(value)]);
  return Root.findOne({ slug });
};

/** GET /api/words — recherche avancée multi-filtres + pagination. */
export const listWords = async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { root, letters, type, tense, q, sortBy } = req.query;

  const filter = {};

  // Filtre par racine : ?root= (ObjectId/slug) ou ?letters= (3 lettres).
  if (root || letters) {
    const resolved = await resolveRoot(root || letters);
    // Racine inconnue → aucun mot ne peut correspondre.
    filter.root = resolved ? resolved._id : new mongoose.Types.ObjectId();
  }

  if (type) filter.type = type;
  if (tense) filter.tense = tense;

  if (q) {
    const rx = new RegExp(escapeRegex(q.trim()), 'i');
    filter.$or = [
      { arabicNormalized: rx },
      { transliteration: rx },
      { translationFr: rx },
      { translationEn: rx },
    ];
  }

  const sort = SORT_MAP[sortBy] || SORT_MAP.date;

  const [data, total] = await Promise.all([
    Word.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('root', 'slug letters meaningFr transliteration'),
    Word.countDocuments(filter),
  ]);

  return paginated(res, { data, total, page, limit });
};

/** GET /api/words/:id — détail d'un mot. */
export const getWord = async (req, res) => {
  const word = await Word.findById(req.params.id).populate(
    'root',
    'slug letters meaningFr transliteration'
  );

  if (!word) {
    throw new AppError('Mot introuvable', 404);
  }

  return ok(res, { word });
};

/** POST /api/words — création d'un mot dérivé. */
export const createWord = async (req, res) => {
  const root = await resolveRoot(req.body.root);
  if (!root) {
    throw new AppError('Racine introuvable pour ce mot', 404);
  }

  // Empêche un doublon de mot (même graphie) au sein d'une racine.
  const exists = await Word.findOne({ root: root._id, arabic: req.body.arabic.trim() });
  if (exists) {
    throw new AppError('Ce mot existe déjà pour cette racine', 409);
  }

  const word = await Word.create({
    ...req.body,
    root: root._id,
    createdBy: req.user.id,
  });

  return created(res, { word });
};

/** PUT /api/words/:id — modification d'un mot (ownership). */
export const updateWord = async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    throw new AppError('Mot introuvable', 404);
  }

  assertOwnership(word, req.user);

  // La racine peut être réassignée via un ObjectId ou un slug.
  if (req.body.root !== undefined) {
    const root = await resolveRoot(req.body.root);
    if (!root) {
      throw new AppError('Racine introuvable pour ce mot', 404);
    }
    word.root = root._id;
  }

  for (const field of [
    'arabic',
    'transliteration',
    'translationFr',
    'translationEn',
    'type',
    'tense',
    'pattern',
    'example',
    'notes',
  ]) {
    if (req.body[field] !== undefined) {
      word[field] = req.body[field];
    }
  }

  await word.save();

  return ok(res, { word });
};

/** DELETE /api/words/:id — suppression d'un mot + favoris liés. */
export const deleteWord = async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    throw new AppError('Mot introuvable', 404);
  }

  assertOwnership(word, req.user);

  await Promise.all([
    Favorite.deleteMany({ item: word._id, itemModel: 'Word' }),
    word.deleteOne(),
  ]);

  return noContent(res);
};
