import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader } from '../../components/dashboard/AdminUi';
import { Checkbox, SelectField, TextArea, TextField } from '../../components/forms/Field';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/format';

interface Setting {
  id: string;
  key: string;
  group: string;
  value: unknown;
  isPublic: boolean;
  description: string | null;
  updatedAt: string;
}

interface SeoDefaults {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

interface ProgramSetting {
  status: 'requires_review' | 'confirmed' | 'not_applicable';
  enabled: boolean;
  relationship: string;
}

const GROUP_ORDER = ['contact', 'social', 'qr', 'seo', 'program'];
const isHttpUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);
const settingLabelKey = (key: string) => `settings.keys.${key.replace(/\./g, '_')}`;

export function SettingsPage() {
  const { t } = useTranslation('admin');
  const settings = useQuery({ queryKey: ['admin', 'settings'], queryFn: () => api.get<Setting[]>('/settings') });

  if (settings.isLoading) return <Spinner />;
  if (settings.isError) return <ErrorState error={settings.error} onRetry={() => void settings.refetch()} />;

  const groups = GROUP_ORDER.map((g) => ({ group: g, items: (settings.data ?? []).filter((s) => s.group === g) })).filter((g) => g.items.length);

  return (
    <div>
      <AdminHeader title={t('settings.title')} description={t('settings.intro')} />
      <div className="space-y-8">
        {groups.map(({ group, items }) => (
          <section key={group} aria-labelledby={`settings-${group}`} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-mist-200">
            <h2 id={`settings-${group}`} className="text-lg font-bold text-navy-950">
              {t(`settings.groups.${group}`)}
            </h2>
            <p className="mt-1 text-sm text-ink-500">{t(`settings.groupHelp.${group}`)}</p>
            <div className="mt-5 divide-y divide-mist-200">
              {items.map((s) => (
                <SettingRow key={s.key} setting={s} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SettingRow({ setting }: { setting: Setting }) {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const [value, setValue] = useState<unknown>(setting.value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const dirty = JSON.stringify(value) !== JSON.stringify(setting.value);
  const label = t(settingLabelKey(setting.key), { defaultValue: setting.key });

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await api.put(`/settings/${setting.key}`, { value });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] }), queryClient.invalidateQueries({ queryKey: ['settings'] })]);
      notify(t('common.saved'));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  let editor: ReactNode;
  if (setting.key === 'seo.defaults') editor = <SeoEditor value={(value ?? {}) as Partial<SeoDefaults>} onChange={setValue} />;
  else if (setting.key === 'program.sixMonthProgram') editor = <ProgramEditor value={(value ?? {}) as Partial<ProgramSetting>} onChange={setValue} />;
  else if (setting.key === 'social.links') editor = <LinksEditor label={label} value={value} onChange={setValue} />;
  else if (setting.key === 'contact.address') editor = <TextArea label={label} rows={3} value={String(value ?? '')} onChange={(e) => setValue(e.target.value)} />;
  else {
    const type = setting.key.endsWith('Email') ? 'email' : setting.key === 'contact.phone' ? 'tel' : 'url';
    const text = String(value ?? '');
    editor = (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <TextField
          label={label}
          type={type}
          wrapperClassName="flex-1"
          placeholder={type === 'url' ? 'https://' : undefined}
          hint={setting.key.startsWith('qr.') || setting.key === 'social.facebookUrl' ? t('settings.notConfiguredHint') : undefined}
          value={text}
          onChange={(e) => setValue(e.target.value)}
        />
        {setting.key.startsWith('qr.') && isHttpUrl(text) && (
          <div className="rounded-lg bg-white p-2 ring-1 ring-mist-200">
            <QRCodeSVG value={text} size={88} title={t('settings.qrPreview')} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div key={resetCount}>{editor}</div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={() => void save()} disabled={!dirty} loading={saving}>
          {t('common.save')}
        </Button>
        {dirty && (
          <Button size="sm" variant="ghost" onClick={() => {
              setValue(setting.value);
              setResetCount((n) => n + 1);
            }}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Badge tone={setting.isPublic ? 'blue' : 'gray'}>{setting.isPublic ? t('settings.public') : t('settings.private')}</Badge>
        <span className="text-xs text-ink-500">{t('common.updated')}: {formatDateTime(setting.updatedAt)}</span>
      </div>
      {setting.description && <p className="mt-2 text-xs text-ink-500">{setting.description}</p>}
      {error && (
        <Alert kind="error" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
}

function SeoEditor({ value, onChange }: { value: Partial<SeoDefaults>; onChange: (v: SeoDefaults) => void }) {
  const { t } = useTranslation('admin');
  const v = { titleEn: '', titleBn: '', descriptionEn: '', descriptionBn: '', ...value };
  const set = (name: keyof SeoDefaults, text: string) => onChange({ ...v, [name]: text });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label={t('settings.seo.titleEn')} maxLength={120} value={v.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
      <TextField label={t('settings.seo.titleBn')} maxLength={120} lang="bn" value={v.titleBn} onChange={(e) => set('titleBn', e.target.value)} />
      <TextArea label={t('settings.seo.descriptionEn')} maxLength={300} rows={3} value={v.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} />
      <TextArea label={t('settings.seo.descriptionBn')} maxLength={300} rows={3} lang="bn" value={v.descriptionBn} onChange={(e) => set('descriptionBn', e.target.value)} />
    </div>
  );
}

function ProgramEditor({ value, onChange }: { value: Partial<ProgramSetting>; onChange: (v: ProgramSetting) => void }) {
  const { t } = useTranslation('admin');
  const v: ProgramSetting = { status: 'requires_review', enabled: false, relationship: '', ...value };
  const visible = v.status === 'confirmed' && v.enabled && v.relationship.trim().length > 0;
  return (
    <div className="space-y-4">
      <Alert kind="warning">{t('settings.programHelp')}</Alert>
      <SelectField
        label={t('settings.programStatusLabel')}
        value={v.status}
        onChange={(e) => {
          const status = e.target.value as ProgramSetting['status'];
          onChange({ ...v, status, enabled: status === 'confirmed' ? v.enabled : false });
        }}
        options={(['requires_review', 'confirmed', 'not_applicable'] as const).map((s) => ({ value: s, label: t(`settings.programStatus.${s}`) }))}
      />
      <TextArea label={t('settings.relationship')} hint={t('settings.relationshipHint')} rows={3} maxLength={1000} value={v.relationship} onChange={(e) => onChange({ ...v, relationship: e.target.value })} />
      <Checkbox label={t('settings.enabled')} checked={v.enabled} disabled={v.status !== 'confirmed'} onChange={(e) => onChange({ ...v, enabled: e.target.checked })} />
      <p className="text-sm font-semibold">{visible ? t('settings.programVisible') : t('settings.programHidden')}</p>
    </div>
  );
}

function LinksEditor({ label, value, onChange }: { label: string; value: unknown; onChange: (v: { label: string; url: string }[]) => void }) {
  const { t } = useTranslation('admin');
  const initial = Array.isArray(value) ? (value as { label: string; url: string }[]).map((l) => `${l.label} | ${l.url}`).join('\n') : '';
  const [text, setText] = useState(initial);
  return (
    <TextArea
      label={label}
      rows={4}
      hint={t('settings.linksHint')}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const [name, ...rest] = line.split('|');
              return { label: name.trim(), url: rest.join('|').trim() };
            }),
        );
      }}
    />
  );
}
