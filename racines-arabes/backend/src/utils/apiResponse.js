// Helpers de réponse HTTP uniformes (cf. PROJET.md §8.4)

/**
 * Réponse de succès simple : { success: true, data }.
 */
export const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });

/**
 * Réponse de création (201).
 */
export const created = (res, data) => res.status(201).json({ success: true, data });

/**
 * Réponse sans contenu (204).
 */
export const noContent = (res) => res.status(204).end();

/**
 * Réponse de liste paginée : { success, data, total, page, totalPages }.
 */
export const paginated = (res, { data, total, page, limit }) =>
  res.status(200).json({
    success: true,
    data,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });

/**
 * Réponse d'erreur : { success: false, message, errors? }.
 */
export const fail = (res, message, status = 400, errors) =>
  res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
