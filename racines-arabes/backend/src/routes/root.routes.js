// Routes des racines trilitères (cf. PROJET.md §8.1)
import { Router } from 'express';
import {
  listRoots,
  getRoot,
  getRootWords,
  createRoot,
  updateRoot,
  deleteRoot,
} from '../controllers/root.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import { createRootSchema, updateRootSchema } from '../validators/root.validator.js';

const router = Router();

// Lecture publique
router.get('/', paginate, listRoots);
router.get('/:slug', getRoot);
router.get('/:slug/words', getRootWords);

// Écriture protégée par JWT + ownership (cf. D3)
router.post('/', protect, validate(createRootSchema), createRoot);
router.put('/:slug', protect, validate(updateRootSchema), updateRoot);
router.delete('/:slug', protect, deleteRoot);

export default router;
