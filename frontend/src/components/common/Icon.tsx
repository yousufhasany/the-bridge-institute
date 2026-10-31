import {
  Award,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Calculator,
  ChartNoAxesCombined,
  Code,
  GraduationCap,
  Handshake,
  Languages,
  Lightbulb,
  Monitor,
  RefreshCw,
  Rocket,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';

/** Icon names stored in the database (Course.icon) mapped to Lucide components. */
export const ICONS: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  brain: Brain,
  languages: Languages,
  calculator: Calculator,
  monitor: Monitor,
  code: Code,
  target: Target,
  award: Award,
  briefcase: BriefcaseBusiness,
  chart: ChartNoAxesCombined,
  handshake: Handshake,
  users: Users,
  lightbulb: Lightbulb,
  refresh: RefreshCw,
  rocket: Rocket,
  graduation: GraduationCap,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICONS[name] ?? BookOpen;
  return <Component className={className} aria-hidden />;
}

/** Brochure-style circular blue icon with a white line illustration. */
export function CircleIcon({ name, size = 'md', tone = 'blue', className }: { name: string; size?: 'sm' | 'md' | 'lg'; tone?: 'blue' | 'navy' | 'orange'; className?: string }) {
  const sizes = { sm: 'size-11 [&>svg]:size-5', md: 'size-14 [&>svg]:size-7', lg: 'size-20 [&>svg]:size-9' };
  const tones = {
    blue: 'bg-royal-600 text-white ring-royal-100',
    navy: 'bg-navy-950 text-white ring-royal-100',
    orange: 'bg-orange-500 text-navy-950 ring-orange-400/30',
  };
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-full ring-4', sizes[size], tones[tone], className)}>
      <Icon name={name} />
    </span>
  );
}
