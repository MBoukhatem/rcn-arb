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

const SELECT_CLASS =
  'w-full h-11 px-3.5 text-sm bg-neutral-100 text-ink ' +
  'transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-500/40 ' +
  'dark:bg-neutral-800 dark:text-neutral-0 ' +
  'dark:focus:ring-accent-300/40 ' +
  'placeholder:text-neutral-400 dark:placeholder:text-neutral-600';

const LABEL_CLASS =
  'block text-2xs font-semibold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2';

const SECTION =
  'bg-neutral-0 dark:bg-neutral-900';
const SECTION_HEADER =
  'flex items-center justify-between px-6 py-3';
const SECTION_TITLE =
  'text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300';

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
    <PageWrapper title={t('profile.title')} eyebrow="Compte · Utilisateur">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl space-y-10"
      >
        {/* Mise à jour du profil */}
        <form onSubmit={submitProfile} className={SECTION}>
          <header className={SECTION_HEADER}>
            <span className={SECTION_TITLE}>— 01 / Profil</span>
            <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {user?.email}
            </span>
          </header>

          <div className="p-6 sm:p-8 space-y-5">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('profile.updateProfile')}
            </h2>

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
                className={`${SELECT_CLASS} h-auto py-2.5 placeholder:text-neutral-400 dark:placeholder:text-neutral-600`}
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
          </div>
        </form>

        {/* Changement de mot de passe */}
        <form onSubmit={submitPassword} className={SECTION}>
          <header className={SECTION_HEADER}>
            <span className={SECTION_TITLE}>— 02 / Sécurité</span>
          </header>
          <div className="p-6 sm:p-8 space-y-5">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
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
          </div>
        </form>

        {/* Suppression de compte */}
        <div className="bg-neutral-0 dark:bg-neutral-950 border border-accent-500 dark:border-accent-300">
          <header className="flex items-center justify-between px-6 py-3">
            <span className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — Zone critique
            </span>
          </header>
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-accent-500 dark:text-accent-300">
              {t('profile.deleteAccount')}
            </h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {t('profile.deleteAccountConfirm')}
            </p>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              {t('profile.deleteAccount')}
            </Button>
          </div>
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
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          {t('profile.deleteAccountConfirm')}
        </p>
      </Modal>
    </PageWrapper>
  );
};

export default Profile;
