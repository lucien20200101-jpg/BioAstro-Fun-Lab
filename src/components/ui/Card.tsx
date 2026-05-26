import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardVariant = 'glass' | 'elevated' | 'interactive';

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    variant?: CardVariant;
  }
>;

const baseClass =
  'rounded-2xl border border-cosmic-nebulaPurple/35 bg-cosmic-panel/72 p-4 text-slate-100 backdrop-blur-sm transition duration-200';

const variantClassMap: Record<CardVariant, string> = {
  glass: 'shadow-[0_0_0_1px_rgba(153,119,255,0.18),0_10px_28px_rgba(11,16,36,0.45)]',
  elevated: 'shadow-[0_0_0_1px_rgba(95,224,255,0.14),0_16px_36px_rgba(11,16,36,0.55)]',
  interactive:
    'cursor-pointer shadow-[0_0_0_1px_rgba(95,224,255,0.18),0_12px_30px_rgba(11,16,36,0.48)] hover:-translate-y-0.5 hover:border-cyan-300/65 hover:shadow-[0_0_18px_rgba(95,224,255,0.22),0_18px_34px_rgba(11,16,36,0.54)] active:translate-y-0'
};

export function Card({ children, className = '', variant = 'glass', ...props }: CardProps) {
  return (
    <article className={`${baseClass} ${variantClassMap[variant]} ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}
