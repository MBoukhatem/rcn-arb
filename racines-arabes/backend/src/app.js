// Instanciation de l'application Express + middlewares globaux
import 'express-async-errors'; // doit rester en tout premier — patche la propagation async
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Sécurité : en-têtes HTTP durcis
app.use(helmet());

// CORS — whitelist sur l'origine du client (Décision D9)
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Parsing du corps JSON
app.use(express.json());

// Journalisation HTTP — désactivée en production (Décision D9)
if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limitation de débit globale (les routes /api/auth seront durcies séparément)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
app.use(globalLimiter);

// Routeur principal de l'API (health + 404 catch-all gérés dans routes/index.js)
app.use('/api', routes);

// Middleware d'erreur global — doit être enregistré en dernier
app.use(errorHandler);

export default app;
