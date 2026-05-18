// Routes des mots dérivés (cf. PROJET.md §8.1, §8.3)
import { Router } from 'express';
import {
  listWords,
  getWord,
  createWord,
  updateWord,
  deleteWord,
} from '../controllers/word.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import { createWordSchema, updateWordSchema } from '../validators/word.validator.js';

const router = Router();

// Lecture publique — recherche avancée multi-filtres
router.get('/', paginate, listWords);
router.get('/:id', getWord);

// Écriture protégée par JWT + ownership (cf. D3)
router.post('/', protect, validate(createWordSchema), createWord);
router.put('/:id', protect, validate(updateWordSchema), updateWord);
router.delete('/:id', protect, deleteWord);

export default router;
