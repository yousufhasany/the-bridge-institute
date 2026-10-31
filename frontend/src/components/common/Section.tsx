import type { ReactNode } from 'react';
import { photos } from '../../assets/photos';
import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

type Tone = 'white' | 'sky' | 'mist' | 'navy';
const tones: Record<Tone, string> = {
  white: 'bg-white',
  sky: 'bg-sky-50',
  mist: 'bg-mist-50',
  navy: 'bg-navy-950 text-sky-50',
};

export function Section({ id, tone = 'white', className, children, labelledBy, reveal = false }: { id?: string; tone?: Tone; className?: string; children: ReactNode; labelledBy?: string; reveal?: boolean }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('py-16 sm:py-20 lg:py-24', tones[tone], className)}>
      <div className="container-page">{reveal ? <Reveal>{children}</Reveal> : children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  title,
  subtitle,
  eyebrow,
  align = 'left',
  tone = 'dark',
  as: Tag = 'h2',
}: {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={cn('mb-10 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <p className={cn('eyebrow mb-3', tone === 'light' ? 'text-orange-400' : 'text-orange-700')}>{eyebrow}</p>}
      <Tag
        id={id}
        className={cn(
          'orange-underline text-3xl sm:text-4xl',
          tone === 'light' && 'text-white',
          align === 'center' && 'after:left-1/2 after:-translate-x-1/2',
        )}
      >
        {title}
      </Tag>
      {subtitle && <p className={cn('mt-5 text-lg', tone === 'light' ? 'text-sky-50/90' : 'text-ink-500')}>{subtitle}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children, image = photos.hero }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode; image?: string }) {
  return (
    <header className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
      <div className="container-page relative">
        <h1 className="orange-underline max-w-3xl text-3xl text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-6 max-w-2xl text-lg text-sky-50/90">{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}
