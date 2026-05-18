// Routes utilisateur — profil et administration (cf. PROJET.md §8.1)
import { Router } from 'express';
import {
  updateProfile,
  changePassword,
  deleteAccount,
  listUsers,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import {
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/user.validator.js';

const router = Router();

// Profil de l'utilisateur courant
router.patch('/me', protect, validate(updateProfileSchema), updateProfile);
router.patch('/me/password', protect, validate(changePasswordSchema), changePassword);
router.delete('/me', protect, deleteAccount);

// Administration (le contrôle de rôle admin est fait dans le contrôleur)
router.get('/', protect, paginate, listUsers);
router.delete('/:id', protect, deleteUser);

export default router;
