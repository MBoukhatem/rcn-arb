// UserForm — formulaire d'édition d'un utilisateur (vue admin).
// Champs : nom, bio, avatar, langue maternelle, rôle.
import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';

const SELECT_CLASS =
  'w-full h-11 px-3.5 text-sm bg-neutral-0 text-ink ' +
  'transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-500/30 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 ' +
  'dark:focus:ring-accent-300/30 ' +
  'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 ' +
  'dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600';

const LABEL_CLASS =
  'block text-2xs font-semibold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2';

export const emptyUser = () => ({
  name: '',
  bio: '',
  avatarUrl: '',
  nativeLanguage: 'fr',
  role: 'user',
});

/**
 * @param {object} props
 * @param {object} props.values
 * @param {(next:object)=>void} props.onChange
 * @param {boolean} [props.disableRole] - désactive l'édition du rôle
 *   (utilisé quand l'admin édite son propre compte).
 */
const UserForm = ({ values, onChange, disableRole = false }) => {
  const { t } = useTranslation();
  const handle = (e) => onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      <Input
        label={t('profile.name')}
        name="name"
        value={values.name}
        onChange={handle}
        required
      />

      <div>
        <label className={LABEL_CLASS} htmlFor="user-bio">
          {t('profile.bio')}
        </label>
        <textarea
          id="user-bio"
          name="bio"
          value={values.bio}
          onChange={handle}
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
        value={values.avatarUrl}
        onChange={handle}
      />

      <div>
        <label className={LABEL_CLASS} htmlFor="user-nativeLanguage">
          {t('profile.nativeLanguage')}
        </label>
        <select
          id="user-nativeLanguage"
          name="nativeLanguage"
          value={values.nativeLanguage}
          onChange={handle}
          className={SELECT_CLASS}
        >
          <option value="fr">{t('profile.nativeLanguageFr')}</option>
          <option value="en">{t('profile.nativeLanguageEn')}</option>
          <option value="ar">{t('profile.nativeLanguageAr')}</option>
        </select>
      </div>

      <div>
        <label className={LABEL_CLASS} htmlFor="user-role">
          {t('admin.role')}
        </label>
        <select
          id="user-role"
          name="role"
          value={values.role}
          onChange={handle}
          disabled={disableRole}
          className={SELECT_CLASS}
        >
          <option value="user">{t('admin.roles.user')}</option>
          <option value="admin">{t('admin.roles.admin')}</option>
        </select>
        {disableRole && (
          <p className="mt-2 text-2xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            {t('admin.cannotChangeOwnRole')}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserForm;
