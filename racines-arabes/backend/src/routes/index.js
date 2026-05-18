// Routeur principal de l'API — agrégateur + santé + 404 catch-all (cf. PROJET.md §8.1)
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import rootRoutes from './root.routes.js';
import wordRoutes from './word.routes.js';
import favoriteRoutes from './favorite.routes.js';
import { notFound } from '../middlewares/errorHandler.js';

const router = Router();

// Sonde de santé
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Ressources de l'API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roots', rootRoutes);
router.use('/words', wordRoutes);
router.use('/favorites', favoriteRoutes);

// Catch-all 404 — doit rester en dernier
router.use(notFound);

export default router;
