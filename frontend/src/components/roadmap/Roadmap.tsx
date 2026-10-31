import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface RoadmapYear {
  label: string;
  title: string;
  body: string;
  highlights?: string[];
}

const accents = ['bg-royal-500', 'bg-royal-600', 'bg-navy-800', 'bg-navy-950'];

/** Brochure "How Does It Work?" four-year roadmap as an ordered timeline. */
export function Roadmap({ years }: { years: RoadmapYear[] }) {
  return (
    <ol className="relative grid gap-6 lg:grid-cols-4 lg:gap-5">
      <span aria-hidden className="absolute top-8 right-[12%] left-[12%] hidden h-1 rounded-full bg-gradient-to-r from-royal-500 via-orange-500 to-navy-950 lg:block" />
      {years.map((year, index) => (
        <li key={year.label} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
          {index < years.length - 1 && <span aria-hidden className="absolute top-16 bottom-[-1.5rem] left-8 w-1 -translate-x-1/2 rounded-full bg-royal-100 lg:hidden" />}
          <span className={cn('relative z-10 grid size-16 shrink-0 place-items-center rounded-full text-lg font-extrabold text-white ring-4 ring-white', accents[index % accents.length])}>
            {index + 1}
          </span>
          <div className="card flex-1 p-5 lg:mt-5 lg:w-full">
            <p className="text-xs font-bold tracking-widest text-orange-700 uppercase">{year.label}</p>
            <h3 className="mt-1 text-lg">{year.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{year.body}</p>
            {year.highlights && year.highlights.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-left text-sm">
                {year.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-royal-600" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
