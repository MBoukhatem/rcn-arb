// RootForm — formulaire éditorial d'une racine (édition uniquement).
// Champs : sens FR / EN / AR. Les lettres ne sont pas modifiables ici.
import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';

export const EMPTY_ROOT = {
  meaningFr: '',
  meaningEn: '',
  meaningAr: '',
};

const RootForm = ({ values, onChange }) => {
  const { t } = useTranslation();
  const handle = (e) => onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      <Input
        label={t('root.meaningFr')}
        name="meaningFr"
        value={values.meaningFr}
        onChange={handle}
        required
      />
      <Input
        label={t('root.meaningEn')}
        name="meaningEn"
        value={values.meaningEn}
        onChange={handle}
      />
      <Input
        label={t('root.meaningAr')}
        name="meaningAr"
        value={values.meaningAr}
        onChange={handle}
      />
    </div>
  );
};

export default RootForm;
