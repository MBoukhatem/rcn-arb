// Middleware de pagination ?page=&limit= (cf. PROJET.md §8.2)

// Borne un entier entre min et max ; retourne fallback si invalide.
const toInt = (raw, fallback, min, max) => {
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

/**
 * Normalise page (≥ 1, défaut 1) et limit (1–100, défaut 10),
 * puis pose req.pagination = { page, limit, skip }.
 */
export const paginate = (req, _res, next) => {
  const page = toInt(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = toInt(req.query.limit, 10, 1, 100);

  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
};
