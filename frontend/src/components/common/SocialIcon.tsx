import { useId } from 'react';

export function socialBrand(url: string): 'facebook' | 'instagram' | null {
  if (/facebook\.com|fb\.com|fb\.me/i.test(url)) return 'facebook';
  if (/instagram\.com/i.test(url)) return 'instagram';
  return null;
}

/** Facebook app icon: blue tile and white “f”. */
export function FacebookFavicon({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="5" fill="#0866FF" />
      <path
        fill="#fff"
        d="M15.9 8.1h-2c-.5 0-.8.3-.8.8v1.4h2.6l-.4 2.3h-2.2V20h-2.4v-7.4H9v-2.3h2.1V8.8c0-2 1.2-3.2 3.1-3.2.9 0 1.6.1 1.7.1v2.4z"
      />
    </svg>
  );
}

/** Instagram app icon: gradient tile and white camera. */
export function InstagramFavicon({ className = 'size-8' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="30%" cy="110%" r="140%">
          <stop offset="0%" stopColor="#f9ce34" />
          <stop offset="35%" stopColor="#ee2a7b" />
          <stop offset="80%" stopColor="#6228d7" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="5" fill={`url(#${id})`} />
      <rect x="5.4" y="5.4" width="13.2" height="13.2" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.7" cy="7.4" r="1" fill="#fff" />
    </svg>
  );
}

export function SocialLinks({ links }: { links: { label: string; url: string }[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {links.map((item) => {
        const brand = socialBrand(item.url);
        return (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
              className={brand ? 'inline-flex rounded-md transition hover:opacity-90' : 'inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-current/30 hover:opacity-80'}
            >
              {brand === 'facebook' ? <FacebookFavicon /> : brand === 'instagram' ? <InstagramFavicon /> : item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
