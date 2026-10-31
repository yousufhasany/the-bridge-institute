import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light' | 'danger' | 'navy';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-orange-500 text-navy-950 hover:bg-orange-400 shadow-sm',
  secondary: 'bg-royal-600 text-white hover:bg-royal-700 shadow-sm',
  outline: 'bg-white text-royal-700 ring-1 ring-inset ring-royal-600/40 hover:bg-sky-50',
  ghost: 'text-navy-900 hover:bg-mist-50',
  light: 'bg-white/10 text-white ring-1 ring-inset ring-white/40 hover:bg-white/20',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  navy: 'bg-navy-950 text-white hover:bg-navy-800 shadow-sm',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const buttonClasses = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(
    'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, icon, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

export function ButtonLink({ variant, size, className, icon, children, ...rest }: LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode }) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
