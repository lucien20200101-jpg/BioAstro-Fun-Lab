import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLElement>>;

export function Card({ children, className = '', ...props }: CardProps) {
  return <article className={`rounded-2xl bg-cosmic-panel p-4 shadow-glow ${className}`} {...props}>{children}</article>;
}
