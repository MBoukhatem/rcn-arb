// Navbar — barre éditoriale stricte : bordure pleine, typographie haute densité.
import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';

const LINK_BASE =
  'relative text-2xs font-semibold uppercase tracking-[0.18em] px-3 py-2 transition-colors';
// Navbar sur fond vert sapin : liens en crème, actif en sable.
const LINK_INACTIVE =
  'text-sand-100/70 hover:text-sand-50 hover:bg-accent-600/60';
const LINK_ACTIVE = 'text-sand-200';

const ThemeIcon = ({ isDark }) =>
  isDark ? (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16 11.5A6.5 6.5 0 0 1 8.5 4a6.5 6.5 0 1 0 7.5 7.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 1.5v2M10 16.5v2M3.5 10h-2M18.5 10h-2M5.05 5.05L3.64 3.64M16.36 16.36l-1.41-1.41M14.95 5.05l1.41-1.41M3.64 16.36l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/explorer', label: t('nav.explorer') },
    { to: '/search', label: t('nav.search') },
    { to: '/about', label: t('nav.about') },
    ...(isAuthenticated
      ? [
          { to: '/profile', label: t('nav.profile') },
          { to: '/favorites', label: t('nav.favorites') },
        ]
      : []),
  ];

  const handleLogout = useCallback(() => {
    logout();
    closeMenu();
    toast.success(t('auth.logoutSuccess'));
    navigate('/');
  }, [logout, closeMenu, t, navigate]);

  const toggleLanguage = useCallback(() => {
    const next = i18n.language?.startsWith('en') ? 'fr' : 'en';
    i18n.changeLanguage(next);
  }, [i18n]);

  const renderNavLink = (link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      onClick={closeMenu}
      className={({ isActive }) =>
        `${LINK_BASE} ${isActive ? LINK_ACTIVE : LINK_INACTIVE}`
      }
    >
      {({ isActive }) => (
        <>
          {link.label}
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute left-3 right-3 -bottom-0.5 h-px bg-sand-300"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-accent-700/95 dark:bg-accent-900/95 backdrop-blur">
      <div className="mx-auto max-w-[1400px] h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Marque */}
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300"
          aria-label={t('nav.home')}
        >
          <span
            lang="ar"
            className="font-arabic text-2xl font-bold text-sand-200 leading-none"
          >
            ع
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-extrabold tracking-tight text-sand-50">
              RACINES
            </span>
            <span className="mt-0.5 text-[9px] font-semibold tracking-[0.32em] text-sand-300">
              ARABES
            </span>
          </div>
        </NavLink>

        {/* Liens desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          {links.map(renderNavLink)}
        </nav>

        {/* Zone droite desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('language.label')}
            className="h-9 px-3 text-2xs font-bold uppercase tracking-[0.18em] text-sand-100 hover:bg-accent-600/60 hover:text-sand-50 transition-colors"
          >
            {i18n.language?.startsWith('en') ? 'EN' : 'FR'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            className="h-9 w-9 inline-flex items-center justify-center text-sand-100 hover:bg-accent-600/60 hover:text-sand-50 transition-colors"
          >
            <ThemeIcon isDark={isDark} />
          </button>

          <span className="mx-1 h-6 w-px bg-sand-200/30" aria-hidden="true" />

          {isAuthenticated ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="!border-sand-300 !text-sand-100 hover:!bg-sand-300 hover:!text-accent-800"
            >
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <Button
                as={NavLink}
                to="/login"
                variant="ghost"
                size="sm"
                className="!text-sand-100 hover:!bg-accent-600/60 hover:!text-sand-50"
              >
                {t('nav.login')}
              </Button>
              <Button
                as={NavLink}
                to="/register"
                variant="primary"
                size="sm"
                className="!bg-sand-300 !text-accent-800 hover:!bg-sand-200"
              >
                {t('nav.register')}
              </Button>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            className="h-9 w-9 inline-flex items-center justify-center text-sand-100"
          >
            <ThemeIcon isDark={isDark} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="h-9 w-9 inline-flex items-center justify-center text-sand-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-accent-700 dark:bg-accent-900"
            aria-label="Navigation mobile"
          >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex flex-col gap-1">
              {links.map(renderNavLink)}

              <span className="my-3 h-px w-full bg-sand-200/30" aria-hidden="true" />

              <button
                type="button"
                onClick={toggleLanguage}
                className={`${LINK_BASE} ${LINK_INACTIVE} text-left`}
              >
                {t('language.label')} · {i18n.language?.startsWith('en') ? 'EN' : 'FR'}
              </button>

              {isAuthenticated ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleLogout}
                  className="mt-3 w-full !border-sand-300 !text-sand-100 hover:!bg-sand-300 hover:!text-accent-800"
                >
                  {t('nav.logout')}
                </Button>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    as={NavLink}
                    to="/login"
                    variant="secondary"
                    size="md"
                    onClick={closeMenu}
                    className="w-full !border-sand-300 !text-sand-100 hover:!bg-sand-300 hover:!text-accent-800"
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    as={NavLink}
                    to="/register"
                    variant="primary"
                    size="md"
                    onClick={closeMenu}
                    className="w-full !bg-sand-300 !text-accent-800 hover:!bg-sand-200"
                  >
                    {t('nav.register')}
                  </Button>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
