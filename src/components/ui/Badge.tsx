import type { HTMLAttributes, PropsWithChildren } from 'react';

type BadgeKind = 'category' | 'difficulty' | 'status' | 'keyword';

type BadgeProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    kind?: BadgeKind;
    value?: string;
  }
>;

const defaultClass = 'border-cosmic-bioGreen/35 bg-cosmic-bioGreen/18 text-cosmic-bioGreen';

const badgeStyles: Record<BadgeKind, Record<string, string>> = {
  category: {
    biology: 'border-cosmic-bioGreen/45 bg-cosmic-bioGreen/18 text-cosmic-bioGreen',
    astronomy: 'border-cosmic-nebulaPurple/50 bg-cosmic-nebulaPurple/18 text-cosmic-nebulaPurple',
    bioastro: 'border-cyan-300/50 bg-cyan-300/14 text-cyan-200',
    admin: 'border-amber-300/45 bg-amber-300/18 text-amber-200'
  },
  difficulty: {
    easy: 'border-emerald-300/50 bg-emerald-400/14 text-emerald-200',
    medium: 'border-amber-300/50 bg-amber-400/14 text-amber-200',
    hard: 'border-orange-300/55 bg-orange-400/16 text-orange-200',
    expert: 'border-red-300/55 bg-red-500/16 text-red-200'
  },
  status: {
    draft: 'border-slate-300/45 bg-slate-400/12 text-slate-200',
    active: 'border-cyan-300/50 bg-cyan-300/14 text-cyan-200',
    archived: 'border-zinc-400/45 bg-zinc-400/12 text-zinc-300',
    warning: 'border-red-300/55 bg-red-500/16 text-red-200'
  },
  keyword: {
    dna: 'border-cosmic-bioBlue/45 bg-cosmic-bioBlue/16 text-cosmic-bioBlue',
    cell: 'border-cosmic-bioGreen/45 bg-cosmic-bioGreen/14 text-cosmic-bioGreen',
    planet: 'border-cosmic-nebulaPurple/48 bg-cosmic-nebulaPurple/16 text-cosmic-nebulaPurple',
    habitability: 'border-cyan-300/48 bg-cyan-300/14 text-cyan-200'
  }
};

export function Badge({ children, className = '', kind, value, ...props }: BadgeProps) {
  const normalizedValue = value?.trim().toLowerCase();
  const style = kind && normalizedValue ? badgeStyles[kind]?.[normalizedValue] : undefined;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide ${style ?? defaultClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
