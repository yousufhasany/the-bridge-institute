import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QrLinks } from '../../components/common/QrLinks';
import i18n from '../../lib/i18n';
import { mockApi, renderWithProviders } from '../../test/render';
import type { Course } from '../../types/api';
import { HomePage } from './HomePage';

const course = (slug: string, title: string): Course => ({
  id: slug,
  slug,
  icon: 'book-open',
  title,
  summary: `${title} summary`,
  description: `${title} description`,
  duration: null,
  category: null,
  topics: [],
  outcomes: [],
});

const COURSES = [
  course('critical-thinking', 'Critical Thinking'),
  course('basic-english', 'Basic English'),
  course('basic-mathematics', 'Basic Mathematics'),
  course('basic-ict', 'Basic ICT'),
  course('basic-python-programming', 'Basic Python Programming'),
];

function api(settings: Record<string, unknown> = {}, sections: Record<string, unknown> = {}) {
  return mockApi((url) => {
    if (url.pathname.endsWith('/cms/sections')) return { body: { data: sections } };
    if (url.pathname.endsWith('/settings/public')) return { body: { data: settings } };
    if (url.pathname.endsWith('/courses')) return { body: { data: COURSES } };
  });
}

afterEach(async () => {
  vi.unstubAllGlobals();
  await i18n.changeLanguage('en');
});

describe('HomePage', () => {
  it('renders the brochure sections, five courses and the four-year roadmap', async () => {
    api();
    renderWithProviders(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    for (const title of ['What Is The Bridge Institute?', 'Our Goal', 'Why The Bridge Institute?', 'How Does It Work?', 'From Education to Employment', 'Who Can Apply?']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
    for (const c of COURSES) expect(await screen.findByText(c.title)).toBeInTheDocument();
    for (const year of ['Year 1', 'Year 2', 'Year 3', 'Year 4']) expect(screen.getAllByText(year).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /thebridgeinstitute2026@gmail\.com/i })).toHaveAttribute('href', 'mailto:thebridgeinstitute2026@gmail.com');
  });

  it('applies published CMS overrides on top of the default text', async () => {
    api({}, { hero: { tagline: 'Override tagline from the CMS' } });
    renderWithProviders(<HomePage />);
    expect(await screen.findByText('Override tagline from the CMS')).toBeInTheDocument();
  });

  it('renders in Bangla', async () => {
    await i18n.changeLanguage('bn');
    api();
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { name: 'দ্য ব্রিজ ইনস্টিটিউট কী?' })).toBeInTheDocument();
  });
});

describe('QrLinks', () => {
  it('shows nothing until destinations are configured', async () => {
    const fetchMock = api({ 'qr.employmentSeekers': '', 'social.facebookUrl': '' });
    const { container } = renderWithProviders(<QrLinks />);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it('only renders configured http(s) destinations', async () => {
    api({ 'qr.admissionInformation': 'https://example.org/admission', 'qr.industryQueries': 'javascript:alert(1)' });
    renderWithProviders(<QrLinks />);
    const list = await screen.findByRole('list');
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://example.org/admission');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
