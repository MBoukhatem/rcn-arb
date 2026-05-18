// Routes des favoris — toutes scopées à l'utilisateur courant (cf. PROJET.md §8.1)
import { Router } from 'express';
import {
  listFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favorite.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import { createFavoriteSchema } from '../validators/favorite.validator.js';

const router = Router();

router.get('/', protect, paginate, listFavorites);
router.post('/', protect, validate(createFavoriteSchema), addFavorite);
router.delete('/:id', protect, removeFavorite);

export default router;
