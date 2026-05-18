// PageWrapper — conteneur de page centré avec animation d'entrée framer-motion.
// Design System §6.2.
import { motion, useReducedMotion } from 'framer-motion';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.title] - si fourni, affiché en <h1>.
 */
const PageWrapper = ({ children, className = '', title }) => {
  const shouldReduce = useReducedMotion();

  // Variants de transition de page (§6.2). Réduits si prefers-reduced-motion.
  const variants = shouldReduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: -8,
          transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        },
      };

  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 ${className}`}
    >
      {title && (
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
          {title}
        </h1>
      )}
      {children}
    </motion.main>
  );
};

export default PageWrapper;
