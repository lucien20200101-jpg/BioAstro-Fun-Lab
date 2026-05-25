import type { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return <article className="rounded-2xl bg-cosmic-panel p-4 shadow-glow">{children}</article>;
}
