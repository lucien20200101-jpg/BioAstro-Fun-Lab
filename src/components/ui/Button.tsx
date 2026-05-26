import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonTone = 'bio' | 'astro' | 'bioastro' | 'admin';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    tone?: ButtonTone;
    size?: ButtonSize;
  }
>;

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-bg disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-none disabled:active:translate-y-0';

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base'
};

const toneClassMap: Record<ButtonTone, Record<ButtonVariant, string>> = {
  bio: {
    primary:
      'border-cosmic-bioGreen/60 bg-cosmic-bioGreen/25 text-cosmic-bioGreen shadow-[0_0_0_1px_rgba(61,255,164,0.2)] hover:bg-cosmic-bioGreen/35 hover:shadow-[0_0_18px_rgba(61,255,164,0.35)] active:translate-y-px focus-visible:ring-cosmic-bioGreen/80',
    secondary:
      'border-cosmic-bioBlue/55 bg-cosmic-bioBlue/20 text-cosmic-bioBlue hover:bg-cosmic-bioBlue/30 active:translate-y-px focus-visible:ring-cosmic-bioBlue/80',
    danger:
      'border-red-400/65 bg-red-500/20 text-red-200 hover:bg-red-500/32 active:translate-y-px focus-visible:ring-red-300/80',
    ghost:
      'border-cosmic-bioGreen/25 bg-transparent text-cosmic-bioGreen hover:border-cosmic-bioGreen/45 hover:bg-cosmic-bioGreen/12 active:bg-cosmic-bioGreen/18 focus-visible:ring-cosmic-bioGreen/80'
  },
  astro: {
    primary:
      'border-cosmic-nebulaPurple/65 bg-cosmic-nebulaPurple/28 text-white shadow-[0_0_0_1px_rgba(153,119,255,0.2)] hover:bg-cosmic-nebulaPurple/38 hover:shadow-[0_0_18px_rgba(153,119,255,0.4)] active:translate-y-px focus-visible:ring-cosmic-nebulaPurple/85',
    secondary:
      'border-cyan-300/45 bg-cyan-300/15 text-cyan-100 hover:bg-cyan-300/24 active:translate-y-px focus-visible:ring-cyan-200/85',
    danger:
      'border-red-400/65 bg-red-500/18 text-red-100 hover:bg-red-500/30 active:translate-y-px focus-visible:ring-red-300/80',
    ghost:
      'border-cosmic-nebulaPurple/30 bg-transparent text-cosmic-nebulaPurple hover:border-cosmic-nebulaPurple/50 hover:bg-cosmic-nebulaPurple/12 active:bg-cosmic-nebulaPurple/18 focus-visible:ring-cosmic-nebulaPurple/85'
  },
  bioastro: {
    primary:
      'border-cyan-300/65 bg-gradient-to-r from-cosmic-bioBlue/35 to-cosmic-nebulaPurple/35 text-cyan-50 shadow-[0_0_0_1px_rgba(95,224,255,0.2)] hover:from-cosmic-bioBlue/45 hover:to-cosmic-nebulaPurple/45 hover:shadow-[0_0_20px_rgba(95,224,255,0.35)] active:translate-y-px focus-visible:ring-cyan-200/90',
    secondary:
      'border-cosmic-bioBlue/50 bg-cosmic-bioBlue/18 text-cyan-100 hover:bg-cosmic-bioBlue/28 active:translate-y-px focus-visible:ring-cosmic-bioBlue/85',
    danger:
      'border-red-400/65 bg-red-500/20 text-red-100 hover:bg-red-500/32 active:translate-y-px focus-visible:ring-red-300/80',
    ghost:
      'border-cyan-300/30 bg-transparent text-cyan-200 hover:border-cyan-200/55 hover:bg-cyan-300/10 active:bg-cyan-300/18 focus-visible:ring-cyan-200/90'
  },
  admin: {
    primary:
      'border-amber-300/70 bg-amber-400/22 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.24)] hover:bg-amber-400/32 hover:shadow-[0_0_16px_rgba(251,191,36,0.32)] active:translate-y-px focus-visible:ring-amber-200/85',
    secondary:
      'border-slate-300/45 bg-slate-300/10 text-slate-200 hover:bg-slate-300/18 active:translate-y-px focus-visible:ring-slate-200/75',
    danger:
      'border-red-400/70 bg-red-500/24 text-red-100 hover:bg-red-500/36 active:translate-y-px focus-visible:ring-red-300/85',
    ghost:
      'border-amber-300/30 bg-transparent text-amber-200 hover:border-amber-200/55 hover:bg-amber-300/12 active:bg-amber-300/18 focus-visible:ring-amber-200/85'
  }
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  tone = 'astro',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass = toneClassMap[tone][variant];
  const sizeClass = sizeClassMap[size];

  return (
    <button className={`${baseClass} ${sizeClass} ${variantClass} ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  );
}
