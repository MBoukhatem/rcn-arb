// Modal — fenêtre modale maison (overlay, focus-trap, Esc, scroll lock).
// Design System §5.4. Pas de bibliothèque externe.
import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

// Sélecteur des éléments focusables internes (focus-trap).
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} [props.title]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();
  const surfaceRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);

  // Blocage du scroll du body tant que la modale est ouverte.
  useEffect(() => {
    if (!isOpen) return undefined;
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      // Restitue le focus à l'élément déclencheur à la fermeture.
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen]);

  // Focus initial sur la surface à l'ouverture.
  useEffect(() => {
    if (isOpen && surfaceRef.current) {
      surfaceRef.current.focus();
    }
  }, [isOpen]);

  // Fermeture Esc + focus-trap par Tab.
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (event.key !== 'Tab' || !surfaceRef.current) return;

      const nodes = surfaceRef.current.querySelectorAll(FOCUSABLE);
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const surfaceVariants = shouldReduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.96 },
        visible: { opacity: 1, scale: 1 },
      };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Overlay sombre semi-transparent */}
          <motion.div
            className="fixed inset-0 bg-neutral-950/45 dark:bg-neutral-950/70 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Surface */}
          <motion.div
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId.current : undefined}
            tabIndex={-1}
            className={`relative w-full ${SIZES[size] ?? SIZES.md} rounded-xl bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg dark:shadow-modal focus:outline-none`}
            variants={surfaceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {title && (
              <header className="flex items-start justify-between px-6 pt-6 pb-4">
                <h2
                  id={titleId.current}
                  className="text-xl font-semibold text-neutral-900 dark:text-neutral-50"
                >
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label={t('common.close')}
                  className="-mr-2 -mt-1 !px-2"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 5l10 10M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </Button>
              </header>
            )}

            <div
              className={`px-6 max-h-[70vh] overflow-y-auto ${title ? 'py-2' : 'pt-6 pb-2'}`}
            >
              {children}
            </div>

            {footer && (
              <footer className="flex justify-end gap-3 px-6 pt-4 pb-6">
                {footer}
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
