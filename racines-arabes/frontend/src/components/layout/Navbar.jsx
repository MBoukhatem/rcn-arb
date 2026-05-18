// Navbar — barre de navigation responsive (burger mobile, toggle thème, langue).
// Design System §5.7.
import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';
import logo from '@/assets/logo.svg';

const LINK_BASE =
  'relative text-sm font-medium px-3 py-2 rounded-md transition-colors';
const LINK_INACTIVE =
  'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 ' +
  'dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-neutral-800';
const LINK_ACTIVE = 'text-accent-600 dark:text-accent-400';

// Icône soleil/lune pour le toggle de thème.
const ThemeIcon = ({ isDark }) =>
  isDark ? (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16 11.5A6.5 6.5 0 0 1 8.5 4a6.5 6.5 0 1 0 7.5 7.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

  // Liens publics + liens privés selon l'authentification.
  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/explorer', label: t('nav.explorer') },
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

  // Bascule de langue fr <-> en.
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
              className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent-600 dark:bg-accent-400"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b transition-colors bg-neutral-0/85 border-neutral-200 dark:bg-neutral-900/85 dark:border-neutral-800 backdrop-blur-md">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo / marque */}
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400"
          aria-label={t('nav.home')}
        >
          <img src={logo} alt="نظام الجذور" className="h-8 w-auto dark:invert" />
        </NavLink>

        {/* Liens desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          {links.map(renderNavLink)}
        </nav>

        {/* Zone droite desktop */}
        <div className="hidden md:flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label={t('language.label')}
            className="!px-2.5 font-semibold uppercase tracking-wide text-xs"
          >
            {i18n.language?.startsWith('en') ? 'EN' : 'FR'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            className="!px-2"
          >
            <ThemeIcon isDark={isDark} />
          </Button>

          <span className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />

          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <Button as={NavLink} to="/login" variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
              <Button as={NavLink} to="/register" variant="primary" size="sm">
                {t('nav.register')}
              </Button>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            className="!px-2"
          >
            <ThemeIcon isDark={isDark} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="!px-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
          </Button>
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
            className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-0 dark:bg-neutral-900"
            aria-label="Navigation mobile"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-1">
              {links.map(renderNavLink)}

              <span className="my-2 h-px w-full bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />

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
                  className="mt-2 w-full"
                >
                  {t('nav.logout')}
                </Button>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    as={NavLink}
                    to="/login"
                    variant="secondary"
                    size="md"
                    onClick={closeMenu}
                    className="w-full"
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    as={NavLink}
                    to="/register"
                    variant="primary"
                    size="md"
                    onClick={closeMenu}
                    className="w-full"
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
