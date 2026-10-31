import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

const SIDE_CLASS = ['reveal-from-left', 'reveal-from-right', 'reveal-from-center'] as const;

function measurableChildren(el: HTMLElement) {
  return [...el.children].filter((node): node is HTMLElement => {
    if (!(node instanceof HTMLElement)) return false;
    const style = getComputedStyle(node);
    if (style.position === 'absolute' || style.position === 'fixed' || style.display === 'none') return false;
    const box = node.getBoundingClientRect();
    return box.width > 8 && box.height > 8;
  });
}

/** True when the nodes sit in more than one column, including a wrapping grid. */
function multiColumn(nodes: HTMLElement[]) {
  if (nodes.length < 2) return false;
  const lefts = nodes.map((node) => node.getBoundingClientRect().left);
  return Math.max(...lefts) - Math.min(...lefts) >= 48;
}

/** Prefer the side-by-side blocks inside a section so each one can enter from its own side. */
function collect(root: HTMLElement) {
  const level = measurableChildren(root);
  if (multiColumn(level)) return level;

  const pieces: HTMLElement[] = [];
  for (const node of level) {
    const kids = measurableChildren(node);
    if (multiColumn(kids)) {
      pieces.push(...kids);
      continue;
    }
    if (kids.length === 1) {
      const deep = measurableChildren(kids[0]);
      if (multiColumn(deep)) {
        pieces.push(...deep);
        continue;
      }
    }
    if (kids.length > 1) {
      let split = false;
      const parts: HTMLElement[] = [];
      for (const kid of kids) {
        const nested = measurableChildren(kid);
        if (multiColumn(nested)) {
          split = true;
          parts.push(...nested);
        } else parts.push(kid);
      }
      if (split) {
        pieces.push(...parts);
        continue;
      }
    }
    pieces.push(node);
  }
  return pieces;
}

function classify(root: HTMLElement) {
  root.querySelectorAll(SIDE_CLASS.map((name) => `.${name}`).join(',')).forEach((node) => {
    node.classList.remove(...SIDE_CLASS);
  });
  const targets = collect(root);
  const bounds = root.getBoundingClientRect();
  const mid = bounds.left + bounds.width / 2;
  const ordered = [...targets].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
  ordered.forEach((node, index) => {
    const box = node.getBoundingClientRect();
    const delta = box.left + box.width / 2 - mid;
    const fullWidth = box.width > bounds.width * 0.82;
    const side = fullWidth || Math.abs(delta) < 36 ? 'reveal-from-center' : delta < 0 ? 'reveal-from-left' : 'reveal-from-right';
    node.classList.add(side);
    node.style.animationDelay = targets.length > 2 ? `${Math.min(index * 0.14, 0.56)}s` : '0s';
  });
}

/** Slides side-by-side blocks in from the left or right as they scroll into view. Full-width blocks rise into place. Content stays visible if motion is reduced. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'pending' | 'in' | 'static'>('static');

  useLayoutEffect(() => {
    const root = ref.current;
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!root || reduced || typeof IntersectionObserver === 'undefined') return;

    classify(root);
    setState('pending');
    const onResize = () => classify(root);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        classify(root);
        setState('in');
        observer.disconnect();
        window.removeEventListener('resize', onResize);
      },
      { threshold: 0.08, rootMargin: '0px 0px -2% 0px' },
    );
    observer.observe(root);
    window.addEventListener('resize', onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={ref} className={cn('reveal-group', state === 'pending' && 'is-pending', state === 'in' && 'is-in', className)}>
      {children}
    </div>
  );
}
