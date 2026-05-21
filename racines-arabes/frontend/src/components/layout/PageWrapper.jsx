// PageWrapper — conteneur de page. En-tête centré et orné (style persan).
import { motion, useReducedMotion } from 'framer-motion';
import Ornament from '@/components/ui/Ornament';

const PageWrapper = ({ children, className = '', title, eyebrow }) => {
  const shouldReduce = useReducedMotion();

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
      className={`mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 ${className}`}
    >
      {title && (
        <header className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <Ornament />
          {eyebrow && (
            <p className="mt-3 text-2xs font-bold uppercase tracking-[0.3em] text-accent-600 dark:text-sand-300">
              {eyebrow}
            </p>
          )}
          <h1
            className="mt-2 font-extrabold tracking-tight leading-[1.1] text-ink dark:text-neutral-0"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            {title}
          </h1>
        </header>
      )}
      {children}
    </motion.main>
  );
};

export default PageWrapper;
