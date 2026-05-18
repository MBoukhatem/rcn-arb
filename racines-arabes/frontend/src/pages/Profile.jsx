// Page profil — protégée. Mise à jour du profil, du mot de passe, suppression de compte.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

// Classes du select natif, alignées sur l'Input du design system.
const SELECT_CLASS =
  'w-full h-11 px-3.5 rounded-md text-sm bg-neutral-0 text-neutral-900 ' +
  'border border-neutral-300 transition-colors duration-150 ' +
  'focus:outline-none focus:border-accent-600 focus:ring-4 focus:ring-accent-600/[0.14] ' +
  'dark:bg-neutral-850 dark:text-neutral-50 dark:border-neutral-700 ' +
  'dark:focus:border-accent-400 dark:focus:ring-accent-400/20';

const LABEL_CLASS =
  'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    avatarUrl: user?.avatarUrl ?? '',
    nativeLanguage: user?.nativeLanguage ?? 'fr',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/users/me', profile);
      toast.success(t('profile.updateSuccess'));
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      toast.error(t('validation.passwordMin'));
      return;
    }
    setSavingPassword(true);
    try {
      await api.patch('/users/me/password', passwords);
      toast.success(t('profile.passwordChanged'));
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setSavingPassword(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete('/users/me');
      toast.success(t('profile.accountDeleted'));
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <PageWrapper title={t('profile.title')}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl space-y-8"
      >
        {/* Mise à jour du profil */}
        <form
          onSubmit={submitProfile}
          className="space-y-5 rounded-xl border border-neutral-200 bg-neutral-0 p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-850"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {t('profile.updateProfile')}
          </h2>

          <div>
            <span className={LABEL_CLASS}>{t('profile.email')}</span>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {user?.email}
            </p>
          </div>

          <Input
            label={t('profile.name')}
            name="name"
            type="text"
            value={profile.name}
            onChange={handleProfileChange}
            required
          />

          <div>
            <label className={LABEL_CLASS} htmlFor="bio">
              {t('profile.bio')}
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              rows={3}
              maxLength={280}
              placeholder={t('profile.bioPlaceholder')}
              className={`${SELECT_CLASS} h-auto py-2.5 placeholder:text-neutral-400 dark:placeholder:text-neutral-500`}
            />
          </div>

          <Input
            label={t('profile.avatarUrl')}
            name="avatarUrl"
            type="url"
            value={profile.avatarUrl}
            onChange={handleProfileChange}
          />

          <div>
            <label className={LABEL_CLASS} htmlFor="nativeLanguage">
              {t('profile.nativeLanguage')}
            </label>
            <select
              id="nativeLanguage"
              name="nativeLanguage"
              value={profile.nativeLanguage}
              onChange={handleProfileChange}
              className={SELECT_CLASS}
            >
              <option value="fr">{t('profile.nativeLanguageFr')}</option>
              <option value="en">{t('profile.nativeLanguageEn')}</option>
              <option value="ar">{t('profile.nativeLanguageAr')}</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={savingProfile}
            disabled={savingProfile}
          >
            {t('common.save')}
          </Button>
        </form>

        {/* Changement de mot de passe */}
        <form
          onSubmit={submitPassword}
          className="space-y-5 rounded-xl border border-neutral-200 bg-neutral-0 p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-850"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {t('profile.changePassword')}
          </h2>
          <Input
            label={t('profile.currentPassword')}
            name="currentPassword"
            type="password"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            label={t('profile.newPassword')}
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            hint={t('auth.passwordHint')}
            required
          />
          <Button
            type="submit"
            variant="primary"
            loading={savingPassword}
            disabled={savingPassword}
          >
            {t('profile.changePassword')}
          </Button>
        </form>

        {/* Suppression de compte */}
        <div className="space-y-3 rounded-xl border border-error-light/40 bg-neutral-0 p-6 sm:p-8 dark:border-error-dark/40 dark:bg-neutral-850">
          <h2 className="text-xl font-semibold text-error-light dark:text-error-dark">
            {t('profile.deleteAccount')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('profile.deleteAccountConfirm')}
          </p>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            {t('profile.deleteAccount')}
          </Button>
        </div>
      </motion.div>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('profile.deleteAccount')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleting}
              disabled={deleting}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('profile.deleteAccountConfirm')}
        </p>
      </Modal>
    </PageWrapper>
  );
};

export default Profile;
