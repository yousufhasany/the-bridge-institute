import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/Modal';
import { Alert, ErrorState, Spinner, useErrorMessage } from '../../components/common/States';
import { useToast } from '../../components/common/Toast';
import { AdminHeader } from '../../components/dashboard/AdminUi';
import { TextArea, TextField } from '../../components/forms/Field';
import { useAuth } from '../../features/auth/AuthProvider';
import { SECTIONS, type SectionDefinition, type SectionField } from '../../features/cms/sections';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/format';
import { resources, type Language } from '../../lib/i18n';
import { cn } from '../../lib/cn';

type Content = Record<string, unknown>;

interface SectionRow {
  key: string;
  locale: Language;
  draftContent: Content | null;
  publishedContent: Content | null;
  publishedAt: string | null;
  updatedAt: string;
  hasUnpublishedChanges: boolean;
}

const PREVIEW_PATH: Record<string, string> = {
  about: '/about',
  journey: '/learning-journey',
  companies: '/companies',
  alumniIntro: '/alumni',
  privacy: '/privacy',
  terms: '/terms',
};

function defaultsFor(def: SectionDefinition, locale: Language): Content {
  const bundle = resources[locale][def.ns as keyof (typeof resources)['en']] as unknown as Content;
  const value = def.path.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Content)[part] : undefined), bundle);
  return structuredClone((value ?? {}) as Content);
}

/** Only fields that differ from the built-in default are stored, so untouched text keeps tracking the locale files. */
function overridesOnly(def: SectionDefinition, content: Content, defaults: Content): Content {
  const out: Content = {};
  for (const field of def.fields) {
    if (JSON.stringify(content[field.name]) !== JSON.stringify(defaults[field.name])) out[field.name] = content[field.name];
  }
  return out;
}

function statusOf(row: SectionRow | undefined): 'default' | 'draft' | 'published' {
  if (!row) return 'default';
  if (row.hasUnpublishedChanges) return 'draft';
  return row.publishedContent && Object.keys(row.publishedContent).length ? 'published' : 'default';
}

export function WebsiteContentPage() {
  const { t } = useTranslation('admin');
  const sections = useQuery({ queryKey: ['admin', 'cms-sections'], queryFn: () => api.get<SectionRow[]>('/cms/admin/sections') });
  const [selected, setSelected] = useState(SECTIONS[0].key);
  const [locale, setLocale] = useState<Language>('en');
  const rowFor = (key: string, lng: Language) => sections.data?.find((r) => r.key === key && r.locale === lng);

  if (sections.isLoading) return <Spinner />;
  if (sections.isError) return <ErrorState error={sections.error} onRetry={() => void sections.refetch()} />;

  const def = SECTIONS.find((s) => s.key === selected) ?? SECTIONS[0];
  const row = rowFor(def.key, locale);

  return (
    <div>
      <AdminHeader title={t('cms.title')} description={t('cms.intro')} />
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <nav aria-label={t('cms.section')} className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-mist-200 lg:self-start">
          <ul className="space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setSelected(s.key)}
                  aria-current={s.key === selected ? 'true' : undefined}
                  className={cn('flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm', s.key === selected ? 'bg-sky-50 font-semibold text-navy-950' : 'hover:bg-mist-50')}
                >
                  <span>{t(`cms.sections.${s.key}`, { defaultValue: s.key })}</span>
                  <span className="flex gap-1">
                    {(['en', 'bn'] as const).map((lng) => (
                      <StatusDot key={lng} lng={lng} status={statusOf(rowFor(s.key, lng))} />
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <div role="tablist" aria-label={t('cms.language')} className="mb-4 inline-flex rounded-xl bg-mist-50 p-1 ring-1 ring-mist-200">
            {(['en', 'bn'] as const).map((lng) => (
              <button
                key={lng}
                role="tab"
                type="button"
                aria-selected={locale === lng}
                onClick={() => setLocale(lng)}
                className={cn('rounded-lg px-4 py-1.5 text-sm font-semibold', locale === lng ? 'bg-white text-navy-950 shadow-sm' : 'text-ink-500')}
              >
                {lng === 'en' ? t('common.english') : t('common.bangla')}
              </button>
            ))}
          </div>
          <SectionEditor key={`${def.key}:${locale}`} def={def} locale={locale} row={row} />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ lng, status }: { lng: string; status: 'default' | 'draft' | 'published' }) {
  const { t } = useTranslation('admin');
  const color = status === 'published' ? 'bg-emerald-500' : status === 'draft' ? 'bg-orange-500' : 'bg-mist-200';
  return (
    <span title={`${lng.toUpperCase()}: ${t(`cms.state.${status}`)}`} className="inline-flex items-center gap-0.5 text-[10px] font-bold text-ink-500 uppercase">
      <span className={cn('size-2 rounded-full', color)} aria-hidden />
      <span className="sr-only">{`${lng}: ${t(`cms.state.${status}`)}`}</span>
      <span aria-hidden>{lng}</span>
    </span>
  );
}

function SectionEditor({ def, locale, row }: { def: SectionDefinition; locale: Language; row: SectionRow | undefined }) {
  const { t } = useTranslation('admin');
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const notify = useToast();
  const errorMessage = useErrorMessage();
  const defaults = useMemo(() => defaultsFor(def, locale), [def, locale]);
  const [content, setContent] = useState<Content>(() => ({ ...defaults, ...structuredClone(row?.draftContent ?? {}) }));
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmRevert, setConfirmRevert] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const status = statusOf(row);
  const savedDraft = JSON.stringify(row?.draftContent ?? {});
  const dirty = JSON.stringify(overridesOnly(def, content, defaults)) !== savedDraft;
  const canPublish = can('cms.publish');
  const base = `/cms/admin/sections/${def.key}/${locale}`;

  const run = async (name: string, fn: () => Promise<unknown>, message: string) => {
    setBusy(name);
    try {
      await fn();
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['admin', 'cms-sections'] }), queryClient.invalidateQueries({ queryKey: ['cms'] })]);
      notify(message);
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(null);
    }
  };

  const saveDraft = () => api.put(base, { content: overridesOnly(def, content, defaults) });
  const set = (name: string, value: unknown) => setContent((c) => ({ ...c, [name]: value }));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-mist-200" lang={locale}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-mist-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-navy-950">{t(`cms.sections.${def.key}`, { defaultValue: def.key })}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
            <Badge tone={status === 'published' ? 'green' : status === 'draft' ? 'orange' : 'gray'}>{t(`cms.state.${status}`)}</Badge>
            {row?.publishedAt && t('cms.publishedAt', { date: formatDateTime(row.publishedAt) })}
          </p>
        </div>
        <a href={PREVIEW_PATH[def.key] ?? '/'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-royal-700 hover:underline">
          {t('cms.viewOnSite')}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="mt-5 space-y-5">
        {def.fields.map((field) => (
          <FieldEditor key={`${field.name}:${resetCount}`} section={def.key} field={field} value={content[field.name]} onChange={(v) => set(field.name, v)} />
        ))}
      </div>

      <Alert className="mt-6">{t('cms.help')}</Alert>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-mist-200 pt-4">
        <Button variant="secondary" disabled={!dirty} loading={busy === 'save'} onClick={() => void run('save', saveDraft, t('cms.draftSaved'))}>
          {t('cms.saveDraft')}
        </Button>
        {canPublish && (
          <Button
            loading={busy === 'publish'}
            disabled={!dirty && status !== 'draft'}
            onClick={() =>
              void run(
                'publish',
                async () => {
                  if (dirty || !row) await saveDraft();
                  await api.post(`${base}/publish`);
                },
                t('cms.published'),
              )
            }
          >
            {t('cms.publish')}
          </Button>
        )}
        <Button variant="ghost" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => {
            setContent(structuredClone(defaults));
            setResetCount((n) => n + 1);
          }}
        >
          {t('cms.resetFields')}
        </Button>
        {canPublish && row?.publishedAt && (
          <Button variant="ghost" className="text-red-700" onClick={() => setConfirmRevert(true)}>
            {t('cms.unpublish')}
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={confirmRevert}
        title={t('cms.unpublish')}
        message={t('cms.unpublishConfirm')}
        confirmLabel={t('cms.unpublish')}
        danger
        onCancel={() => setConfirmRevert(false)}
        onConfirm={async () => {
          setConfirmRevert(false);
          await run('unpublish', () => api.post(`${base}/unpublish`), t('cms.unpublished'));
        }}
      />
    </section>
  );
}

const asText = (v: unknown) => (typeof v === 'string' ? v : '');
const asList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const fromLines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);

function FieldEditor({ section, field, value, onChange }: { section: string; field: SectionField; value: unknown; onChange: (v: unknown) => void }) {
  const { t } = useTranslation('admin');
  const label = t(`cms.fields.${field.name}`, { defaultValue: field.name });
  const longBody = (section === 'privacy' || section === 'terms') && field.name === 'body';

  if (field.type === 'text') return <TextField label={label} value={asText(value)} onChange={(e) => onChange(e.target.value)} />;
  if (field.type === 'textarea')
    return <TextArea label={label} rows={longBody ? 16 : 3} hint={longBody ? t('cms.policyHint') : undefined} value={asText(value)} onChange={(e) => onChange(e.target.value)} />;
  if (field.type === 'list') return <ListEditor label={label} value={value} onChange={onChange} />;

  const items = Array.isArray(value) ? (value as Content[]) : [];
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-navy-950">{label}</legend>
      <p className="text-xs text-ink-500">{t('cms.itemsFixed')}</p>
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl bg-mist-50 p-4 sm:grid-cols-2">
          <p className="text-xs font-bold text-ink-500 sm:col-span-2">{`${label} ${index + 1}`}</p>
          {field.itemFields?.map((sub) => {
            const subLabel = t(`cms.fields.${sub.name}`, { defaultValue: sub.name });
            const update = (v: unknown) => onChange(items.map((it, i) => (i === index ? { ...it, [sub.name]: v } : it)));
            if (sub.type === 'list') return <ListEditor key={sub.name} label={subLabel} value={item[sub.name]} onChange={update} />;
            if (sub.type === 'textarea')
              return <TextArea key={sub.name} label={subLabel} rows={3} wrapperClassName="sm:col-span-2" value={asText(item[sub.name])} onChange={(e) => update(e.target.value)} />;
            return <TextField key={sub.name} label={subLabel} value={asText(item[sub.name])} onChange={(e) => update(e.target.value)} />;
          })}
        </div>
      ))}
    </fieldset>
  );
}

function ListEditor({ label, value, onChange }: { label: string; value: unknown; onChange: (v: string[]) => void }) {
  const { t } = useTranslation('admin');
  const [text, setText] = useState(() => asList(value).join('\n'));
  return (
    <TextArea
      label={label}
      rows={4}
      hint={t('cms.listHint')}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(fromLines(e.target.value));
      }}
    />
  );
}
