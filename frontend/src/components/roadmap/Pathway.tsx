import { ChevronRight, Handshake } from 'lucide-react';
import { CircleIcon } from '../common/Icon';

export interface PathwayStep {
  title: string;
  body: string;
}

const icons = ['book-open', 'award', 'briefcase', 'rocket'];

/** Brochure pathway: Foundational Skills → Certification → Internship → Careers, linked by Industry Partners. */
export function Pathway({ steps, partnersTitle, partnersBody }: { steps: PathwayStep[]; partnersTitle: string; partnersBody: string }) {
  return (
    <div>
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="relative">
            <div className="flex h-full flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/15">
              <div className="flex items-center gap-3">
                <CircleIcon name={icons[index] ?? 'target'} tone={index === steps.length - 1 ? 'orange' : 'blue'} size="sm" className="ring-white/10" />
                <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sky-50/85">{step.body}</p>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight aria-hidden className="absolute top-1/2 -right-4 z-10 hidden size-6 -translate-y-1/2 text-orange-400 xl:block" />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-orange-500 p-6 text-navy-950 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-950 text-white">
          <Handshake className="size-6" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg">{partnersTitle}</h3>
          <p className="text-sm">{partnersBody}</p>
        </div>
      </div>
    </div>
  );
}
