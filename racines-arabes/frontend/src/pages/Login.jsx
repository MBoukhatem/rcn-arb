// Page de connexion — formulaire email/password avec validation temps réel.
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validation champ par champ — clé i18n d'erreur ou null si valide.
  const validateField = (name, val) => {
    if (name === 'email') {
      if (!val.trim()) return 'validation.emailRequired';
      if (!EMAIL_RE.test(val)) return 'validation.emailInvalid';
    }
    if (name === 'password') {
      if (!val) return 'validation.passwordRequired';
      if (val.length < 8) return 'validation.passwordMin';
    }
    return null;
  };

  const errors = {
    email: validateField('email', values.email),
    password: validateField('password', values.password),
  };
  const isValid = !errors.email && !errors.password;

  // À la saisie : on met à jour la valeur et on marque le champ « touché »
  // pour activer la validation temps réel champ par champ.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;

    setSubmitting(true);
    try {
      await login(values);
      toast.success(t('auth.loginSuccess'));
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  // Si l'auth est en cours de vérification, on attend.
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-md"
      >
        <h1 className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('auth.loginTitle')}
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5 rounded-xl border border-neutral-200 bg-neutral-0 p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-850"
        >
          <Input
            label={t('auth.email')}
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={touched.email && errors.email ? t(errors.email) : ''}
            placeholder={t('auth.emailPlaceholder')}
            required
          />
          <Input
            label={t('auth.password')}
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={touched.password && errors.password ? t(errors.password) : ''}
            hint={!errors.password ? t('auth.passwordHint') : ''}
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={submitting}
            className="w-full"
          >
            {t('auth.submitLogin')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-accent-600 hover:underline dark:text-accent-400"
          >
            {t('auth.submitRegister')}
          </Link>
        </p>
      </motion.div>
    </PageWrapper>
  );
};

export default Login;
