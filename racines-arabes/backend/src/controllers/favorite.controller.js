// Contrôleur des favoris — scopés à l'utilisateur courant (cf. PROJET.md §8.1)
import Root from '../models/Root.js';
import Word from '../models/Word.js';
import Favorite from '../models/Favorite.js';
import { AppError } from '../utils/AppError.js';
import { created, noContent, paginated } from '../utils/apiResponse.js';

// Résolution du modèle cible selon itemModel.
const ITEM_MODELS = { Root, Word };

/** GET /api/favorites — favoris paginés de l'utilisateur courant. */
export const listFavorites = async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const filter = { user: req.user.id };

  const [data, total] = await Promise.all([
    Favorite.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      // Populate dynamique : item résolu vers Root ou Word via refPath.
      // Pour les mots, peuple aussi la racine afin d'afficher un lien "Voir".
      .populate({
        path: 'item',
        populate: { path: 'root', select: 'slug letters meaningFr transliteration' },
      }),
    Favorite.countDocuments(filter),
  ]);

  return paginated(res, { data, total, page, limit });
};

/** POST /api/favorites — ajout d'un favori (racine ou mot). */
export const addFavorite = async (req, res) => {
  const { item, itemModel, note } = req.body;

  // Vérifie que l'élément cible existe réellement.
  const Model = ITEM_MODELS[itemModel];
  const target = await Model.findById(item);
  if (!target) {
    throw new AppError("L'élément à mettre en favori est introuvable", 404);
  }

  // Empêche un doublon de favori pour le même utilisateur.
  const exists = await Favorite.findOne({ user: req.user.id, item, itemModel });
  if (exists) {
    throw new AppError('Cet élément est déjà dans vos favoris', 409);
  }

  const favorite = await Favorite.create({
    user: req.user.id,
    item,
    itemModel,
    note,
  });

  return created(res, { favorite });
};

/** DELETE /api/favorites/:id — retrait d'un favori de l'utilisateur courant. */
export const removeFavorite = async (req, res) => {
  const favorite = await Favorite.findById(req.params.id);
  if (!favorite) {
    throw new AppError('Favori introuvable', 404);
  }

  // Un utilisateur ne peut supprimer que ses propres favoris.
  if (favorite.user.toString() !== req.user.id) {
    throw new AppError('Action non autorisée sur ce favori', 403);
  }

  await favorite.deleteOne();

  return noContent(res);
};
