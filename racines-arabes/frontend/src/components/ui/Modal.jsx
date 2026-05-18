// Modal — surface graphique : bordures nettes, sans border-radius, overlay opaque.
import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();
  const surfaceRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!isOpen) return undefined;
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && surfaceRef.current) {
      surfaceRef.current.focus();
    }
  }, [isOpen]);

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
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="fixed inset-0 bg-neutral-950/85 dark:bg-neutral-950/90 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId.current : undefined}
            tabIndex={-1}
            className={`relative w-full ${SIZES[size] ?? SIZES.md} bg-neutral-0 dark:bg-neutral-950 border border-neutral-0 dark:border-neutral-0 outline outline-1 outline-neutral-950 dark:outline-neutral-0 shadow-modal focus:outline-none`}
            variants={surfaceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {title && (
              <header className="flex items-start justify-between gap-4 border-b border-neutral-950 dark:border-neutral-0 px-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-2xs font-semibold uppercase tracking-[0.2em] text-accent-500 dark:text-accent-300">
                    — Dialog
                  </span>
                  <h2
                    id={titleId.current}
                    className="text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-0"
                  >
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('common.close')}
                  className="inline-flex h-9 w-9 items-center justify-center border border-neutral-950 dark:border-neutral-0 text-neutral-950 dark:text-neutral-0 hover:bg-neutral-950 hover:text-neutral-0 dark:hover:bg-neutral-0 dark:hover:text-neutral-950 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
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
                </button>
              </header>
            )}

            <div
              className={`px-6 max-h-[70vh] overflow-y-auto ${title ? 'py-6' : 'pt-6 pb-2'}`}
            >
              {children}
            </div>

            {footer && (
              <footer className="flex justify-end gap-3 border-t border-neutral-950 dark:border-neutral-0 px-6 py-5">
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
