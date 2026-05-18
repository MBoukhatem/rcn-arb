// Footer — éditorial, dense, bordures strictes.
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FOOTER_LINK =
  'text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-700 hover:text-neutral-950 transition-colors ' +
  'dark:text-neutral-400 dark:hover:text-neutral-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-neutral-950 dark:border-neutral-0 bg-neutral-0 dark:bg-neutral-950">
      {/* Bande typographique : marquee décoratif */}
      <div className="overflow-hidden border-b border-neutral-300 dark:border-neutral-700 py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              {Array.from({ length: 10 }).map((__, k) => (
                <span
                  key={k}
                  className="text-xs font-bold uppercase tracking-[0.32em] text-neutral-950 dark:text-neutral-0"
                >
                  جذور · RACINES · ARABES ·{' '}
                  <span className="text-accent-500 dark:text-accent-300">★</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Bloc marque */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span
              lang="ar"
              className="font-arabic text-4xl font-bold text-neutral-950 dark:text-neutral-0 leading-none"
            >
              نظام الجذور
            </span>
          </div>
          <p className="text-sm max-w-md text-neutral-600 dark:text-neutral-400">
            {t('about.morphologyTitle')}. {t('about.intro')}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-px w-12 bg-accent-500" aria-hidden="true" />
            <span className="text-2xs font-semibold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              EST. {year}
            </span>
          </div>
        </div>

        {/* Bloc nav */}
        <div className="md:col-span-3">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-950 dark:text-neutral-0 mb-4">
            — Index
          </p>
          <nav className="flex flex-col gap-3" aria-label="Liens du pied de page">
            <Link to="/" className={FOOTER_LINK}>
              {t('nav.home')}
            </Link>
            <Link to="/explorer" className={FOOTER_LINK}>
              {t('nav.explorer')}
            </Link>
            <Link to="/about" className={FOOTER_LINK}>
              {t('nav.about')}
            </Link>
          </nav>
        </div>

        {/* Bloc compte */}
        <div className="md:col-span-4">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-950 dark:text-neutral-0 mb-4">
            — Compte
          </p>
          <nav className="flex flex-col gap-3" aria-label="Compte">
            <Link to="/login" className={FOOTER_LINK}>
              {t('nav.login')}
            </Link>
            <Link to="/register" className={FOOTER_LINK}>
              {t('nav.register')}
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-300 dark:border-neutral-700">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
            © {year} · {t('about.title')}
          </p>
          <p className="text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
            Black <span className="text-accent-500 dark:text-accent-300">/</span>{' '}
            White <span className="text-accent-500 dark:text-accent-300">/</span>{' '}
            Crimson
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
