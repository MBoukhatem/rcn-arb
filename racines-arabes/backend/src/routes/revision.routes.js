// Routes des révisions — scopées à l'utilisateur courant.
import { Router } from 'express';
import {
  listRevisions,
  getSession,
  addRevision,
  completeSession,
  removeRevision,
} from '../controllers/revision.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import {
  createRevisionSchema,
  completeSessionSchema,
} from '../validators/revision.validator.js';

const router = Router();

router.get('/', protect, paginate, listRevisions);
router.get('/session', protect, getSession);
router.post('/', protect, validate(createRevisionSchema), addRevision);
router.post(
  '/session/complete',
  protect,
  validate(completeSessionSchema),
  completeSession,
);
router.delete('/:id', protect, removeRevision);

export default router;
